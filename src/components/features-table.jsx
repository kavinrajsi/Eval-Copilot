"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function PassRate({ value }) {
  if (value == null) return <span className="text-muted-foreground">—</span>;
  return (
    <Badge variant={value >= 50 ? "secondary" : "destructive"}>{value}%</Badge>
  );
}

export function FeaturesTable({ rows = [] }) {
  const router = useRouter();

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">All features</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Golden cases</TableHead>
              <TableHead className="text-right">Runs</TableHead>
              <TableHead className="text-right">Latest pass rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((r) => (
                <TableRow
                  key={r.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/dashboard/${r.id}`)}
                >
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>
                    {r.type ? (
                      <Badge variant="outline">{r.type}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{r.cases}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.runs}</TableCell>
                  <TableCell className="text-right">
                    <PassRate value={r.latestPassRate} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground text-center">
                  No features yet —{" "}
                  <Link href="/dashboard/new" className="underline underline-offset-4">
                    create one to get started
                  </Link>
                  .
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}
