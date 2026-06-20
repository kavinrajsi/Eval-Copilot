import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: features } = await supabase
    .from("feature")
    .select("id, name")
    .order("created_at", { ascending: false });

  return (
    <SidebarProvider>
      <AppSidebar user={user} features={features ?? []} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
