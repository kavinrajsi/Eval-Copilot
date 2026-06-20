"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  passRate: {
    label: "Pass rate",
    color: "var(--chart-1)",
  },
};

// Pass rate per run over time. `data` = [{ name, passRate, pass, fail }].
export function EvalChart({ data = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pass rate by run</CardTitle>
        <CardDescription>
          Share of cases passing in each grading run, oldest to newest.
        </CardDescription>
      </CardHeader>
      <div className="px-2 pb-4 sm:px-6">
        {data.length ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
            <AreaChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
              <defs>
                <linearGradient id="fillPassRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-passRate)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-passRate)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                width={32}
                tickFormatter={(v) => `${v}%`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="passRate"
                type="monotone"
                fill="url(#fillPassRate)"
                stroke="var(--color-passRate)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <p className="text-muted-foreground px-4 py-12 text-center text-sm">
            No runs yet — grade a feature to see its pass rate here.
          </p>
        )}
      </div>
    </Card>
  );
}
