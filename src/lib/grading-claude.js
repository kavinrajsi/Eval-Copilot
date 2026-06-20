// Server-only Claude call behind the suggest-only assist in grading.js.
//
// This file statically imports the Anthropic SDK, so it must never be imported
// from a Client Component. grading.js loads it via dynamic import() inside an
// async function that only runs on the server (the runs API route), which keeps
// the SDK out of the client bundle.

import Anthropic from "@anthropic-ai/sdk";

// Lightweight, high-frequency assist (runs per golden case), so default to the
// fast/cheap Haiku tier. Override to "claude-sonnet-4-5" for sharper judgment.
const MODEL = process.env.ANTHROPIC_SUGGEST_MODEL || "claude-haiku-4-5";

const SYSTEM = `You are a meticulous QA reviewer assisting a human grader of AI feature outputs.

You NEVER give a final pass/fail verdict — a human decides that. Your only job is to flag concrete, likely problems for that human to confirm.

Compare the ACTUAL output against the KNOWN-GOOD answer the team committed to in advance. Call out specific issues you can see: missing required detail, wrong facts or numbers, invented/unsupported claims, banned or off-brand terms, tone mismatch, or length/format problems. Ground every point in the two texts — do not speculate beyond them.

Respond in 1-3 short, plain-text sentences. If nothing clearly stands out, say so and remind the reviewer to still confirm the fuzzy dimensions a rule can't check. No preamble, no markdown, no verdict.`;

/**
 * Ask Claude to suggest possible failures for one output. Returns a plain-text
 * note (never a verdict). Throws on provider/network errors so the caller can
 * fall back to the heuristic.
 *
 * @param {string} actual
 * @param {string} knownGood
 * @returns {Promise<string>}
 */
export async function suggestViaClaude(actual, knownGood) {
  // Reads ANTHROPIC_API_KEY from the environment.
  const client = new Anthropic();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `KNOWN-GOOD answer:\n${knownGood || "(none provided)"}\n\nACTUAL output:\n${actual || "(empty)"}\n\nFlag possible problems with the actual output for a human to review.`,
      },
    ],
  });

  return response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();
}

const JUDGE_SYSTEM = `You are an evaluation judge scoring one AI feature output.

Grade the ACTUAL output strictly against the RUBRIC, using the KNOWN-GOOD answer as the reference the team committed to in advance. Decide a single verdict — "pass" or "fail" — based only on what the rubric requires. When the rubric is silent, lean on whether the actual output is materially as good as the known-good.

You are an automated first-pass grader; a human may override your verdict, so be precise and honest rather than lenient. Give a confidence level and a one-sentence rationale grounded in the two texts.`;

const JUDGE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    verdict: { type: "string", enum: ["pass", "fail"] },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    rationale: { type: "string" },
  },
  required: ["verdict", "confidence", "rationale"],
};

/**
 * LLM-as-judge: score one output pass/fail against the rubric. Returns a graded
 * result (the verdict IS set here). Throws on provider/parse errors so the
 * caller can fall back to suggest-only.
 *
 * @returns {Promise<{verdict: 'pass'|'fail', decided_by: 'llm_judge', note: string}>}
 */
export async function judgeViaClaude(actual, knownGood, ruleText) {
  const client = new Anthropic();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    system: JUDGE_SYSTEM,
    output_config: { format: { type: "json_schema", schema: JUDGE_SCHEMA } },
    messages: [
      {
        role: "user",
        content: `RUBRIC:\n${ruleText || "(none provided)"}\n\nKNOWN-GOOD answer:\n${knownGood || "(none provided)"}\n\nACTUAL output:\n${actual || "(empty)"}\n\nScore the actual output pass or fail against the rubric.`,
      },
    ],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  const parsed = JSON.parse(text); // throws on malformed output → caller falls back
  const verdict = parsed.verdict === "pass" ? "pass" : "fail";
  const confidence = parsed.confidence ?? "low";
  const rationale = (parsed.rationale ?? "").trim();

  return {
    verdict,
    decided_by: "llm_judge",
    note: `[${confidence} confidence] ${rationale}`.trim(),
  };
}
