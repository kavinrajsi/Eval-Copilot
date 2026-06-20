import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function StatCard({ label, value, hint, trend }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
        {trend ? (
          <div className="absolute right-4 top-4">
            <Badge variant={trend.up ? "secondary" : "destructive"}>
              {trend.up ? (
                <TrendingUpIcon className="size-3" />
              ) : (
                <TrendingDownIcon className="size-3" />
              )}
              {trend.value}
            </Badge>
          </div>
        ) : null}
      </CardHeader>
      {hint ? (
        <CardFooter className="text-muted-foreground text-sm">{hint}</CardFooter>
      ) : null}
    </Card>
  );
}

export function SectionCards({ totalFeatures, totalCases, totalRuns, passRate }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Features"
        value={totalFeatures}
        hint="AI features under evaluation"
      />
      <StatCard
        label="Golden cases"
        value={totalCases}
        hint="Known-good answer keys"
      />
      <StatCard
        label="Runs"
        value={totalRuns}
        hint="Grading runs recorded"
      />
      <StatCard
        label="Overall pass rate"
        value={`${passRate}%`}
        hint="Across every graded case"
        trend={{ up: passRate >= 50, value: `${passRate}%` }}
      />
    </div>
  );
}
