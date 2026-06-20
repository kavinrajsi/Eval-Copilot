import { redirect } from "next/navigation";

import NewFeatureForm from "@/app/dashboard/new/new-feature-form";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export default async function NewFeaturePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <>
      <SiteHeader title="New feature" />
      <div className="mx-auto w-full max-w-xl p-4 md:p-6">
        <NewFeatureForm />
      </div>
    </>
  );
}
