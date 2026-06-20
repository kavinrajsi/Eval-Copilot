import { notFound, redirect } from "next/navigation";

import FeatureWorkspace from "@/app/dashboard/[featureId]/feature-workspace";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export default async function FeaturePage({ params }) {
  const { featureId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: feature } = await supabase
    .from("feature")
    .select("id, name, feature_type")
    .eq("id", featureId)
    .maybeSingle();

  if (!feature) notFound();

  return (
    <>
      <SiteHeader title={feature.name}>
        {feature.feature_type ? (
          <Badge variant="secondary">{feature.feature_type}</Badge>
        ) : null}
      </SiteHeader>
      <div className="p-4 md:p-6">
        <FeatureWorkspace featureId={feature.id} />
      </div>
    </>
  );
}
