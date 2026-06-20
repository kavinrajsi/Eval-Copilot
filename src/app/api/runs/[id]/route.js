import { badRequest, ok, requireUser } from "@/lib/api";

// DELETE /api/runs/:id — remove a run and its grades (child-first; FKs aren't
// ON DELETE CASCADE). RLS keeps this scoped to the owner.
export async function DELETE(_request, { params }) {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { id } = await params;

  const { error: gradeErr } = await auth.supabase
    .from("grade")
    .delete()
    .eq("run_id", id);
  if (gradeErr) return badRequest(gradeErr.message);

  const { error } = await auth.supabase.from("run").delete().eq("id", id);
  if (error) return badRequest(error.message);

  return ok({ deleted: id });
}
