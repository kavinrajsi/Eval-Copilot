import { redirect } from "next/navigation";

import { ProfileForm, PasswordForm } from "./account-forms";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Account settings · Eval Copilot" };

export default async function AccountSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fullName = user.user_metadata?.full_name ?? "";

  return (
    <>
      <SiteHeader title="Account settings" />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 md:p-6">
        <ProfileForm fullName={fullName} email={user.email ?? ""} />
        <PasswordForm />
      </div>
    </>
  );
}
