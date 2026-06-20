import { ComingSoon } from "@/components/coming-soon";

export const metadata = { title: "Docs · Eval Copilot" };

export default function DocsPage() {
  return (
    <ComingSoon
      eyebrow="Docs"
      title="Documentation is in progress."
      description="Reference for golden sets, rubrics, runs, and grading will be published here. The README in the repo is the most complete source today."
    />
  );
}
