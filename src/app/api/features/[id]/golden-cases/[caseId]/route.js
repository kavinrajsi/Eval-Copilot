import { badRequest, ok, requireUser } from "@/lib/api";

// DELETE /api/features/:id/golden-cases/:caseId — remove a golden case.
// FKs aren't ON DELETE CASCADE, so drop the case's grades first. RLS keeps
// this scoped to the owner.
export async function DELETE(_request, { params }) {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { caseId } = await params;

  const { error: gradeErr } = await auth.supabase
    .from("grade")
    .delete()
    .eq("golden_case_id", caseId);
  if (gradeErr) return badRequest(gradeErr.message);

  const { error } = await auth.supabase
    .from("golden_case")
    .delete()
    .eq("id", caseId);
  if (error) return badRequest(error.message);

  return ok({ deleted: caseId });
}
