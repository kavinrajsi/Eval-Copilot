import { badRequest, ok, requireUser } from "@/lib/api";
import {
  isMachineCheckable,
  judgeByLLM,
  judgeImageByLLM,
  judgeMultiByLLM,
} from "@/lib/grading";

const IMAGE_MEDIA_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);
const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // ~4MB decoded

// POST /api/features/:id/stability — grade the SAME input N times through the AI
// judge and report how consistent it is (verdict agreement + score variance).
// Reliability, not accuracy. Nothing is saved. Only meaningful on the
// non-deterministic path: machine rules are deterministic, and suggest mode
// returns no verdict to vary — both short-circuit with an explanation.
// Body: { content?, image?: { data, media_type }, runs }
export async function POST(request, { params }) {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { supabase } = auth;
  const { id } = await params;

  const body = await request.json().catch(() => ({}));
  const content = typeof body.content === "string" ? body.content : "";
  const image = body.image && typeof body.image === "object" ? body.image : null;
  if (!content.trim() && !image) return badRequest("content or image is required");
  const runs = Math.min(10, Math.max(2, Math.round(Number(body.runs) || 5)));

  const { data: rubric, error } = await supabase
    .from("rubric")
    .select("rule_text, rules, grader_mode, criteria, pass_threshold")
    .eq("feature_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return badRequest(error.message);
  if (!rubric) return badRequest("This feature has no rubric yet — save one first.");

  const rules = rubric.rules ?? [];
  const ruleText = rubric.rule_text ?? "";
  const graderMode = rubric.grader_mode ?? "suggest";
  const criteria = rubric.criteria ?? [];
  const threshold = rubric.pass_threshold ?? 70;

  // Validate image up front (cheap) before any model calls.
  let imgData = null;
  let mediaType = null;
  if (image) {
    mediaType = image.media_type;
    if (!IMAGE_MEDIA_TYPES.has(mediaType)) {
      return badRequest("image must be PNG, JPEG, WebP, or GIF");
    }
    imgData = String(image.data ?? "").replace(/^data:[^;]+;base64,/, "");
    if (!imgData) return badRequest("image data is required");
    if (imgData.length * 0.75 > MAX_IMAGE_BYTES) {
      return badRequest("image is too large (max ~4MB)");
    }
  }

  // Deterministic / no-verdict paths have nothing to measure — say so plainly.
  if (!image && isMachineCheckable(rules)) {
    return ok({
      status: "deterministic",
      message:
        "This rubric is decided by machine rules — grading is deterministic, so it's 100% stable by construction.",
    });
  }
  if (graderMode !== "judge") {
    return ok({
      status: "not_applicable",
      message:
        "Stability applies to judge mode — suggest mode returns no verdict to vary. Switch the grader to judge (optionally with criteria) to measure consistency.",
    });
  }

  // Feature-level knowledge, fetched once and reused across the N calls.
  const { data: feature } = await supabase
    .from("feature")
    .select("knowledge")
    .eq("id", id)
    .maybeSingle();
  const knowledge = feature?.knowledge ?? "";

  const gradeOnce = () => {
    if (image) return judgeImageByLLM(imgData, mediaType, ruleText, knowledge);
    if (criteria.length) return judgeMultiByLLM(content, "", ruleText, knowledge, criteria, threshold);
    return judgeByLLM(content, "", ruleText, knowledge);
  };

  // Run N gradings concurrently.
  const results = await Promise.all(Array.from({ length: runs }, () => gradeOnce()));

  const verdicts = results.map((r) => r.verdict ?? "review");
  const counts = verdicts.reduce((m, v) => ({ ...m, [v]: (m[v] || 0) + 1 }), {});
  const [modalVerdict, modalCount] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const stablePct = Math.round((modalCount / runs) * 100);

  const scoreVals = results.map((r) => r.score).filter((s) => typeof s === "number");
  let score = null;
  if (scoreVals.length) {
    const mean = scoreVals.reduce((a, b) => a + b, 0) / scoreVals.length;
    const variance = scoreVals.reduce((a, b) => a + (b - mean) ** 2, 0) / scoreVals.length;
    score = {
      mean: Math.round(mean * 10) / 10,
      sd: Math.round(Math.sqrt(variance) * 10) / 10,
      min: Math.min(...scoreVals),
      max: Math.max(...scoreVals),
    };
  }

  return ok({
    status: "ok",
    runs,
    summary: { counts, modalVerdict, stablePct, score },
    results: results.map((r) => ({
      verdict: r.verdict ?? null,
      score: r.score ?? null,
      note: r.note ?? null,
    })),
  });
}
