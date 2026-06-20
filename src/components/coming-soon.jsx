import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

// Shared placeholder for routes the account menu links to that aren't built yet
// (changelog, help, docs, settings). Keeps every menu item resolving to a real
// page instead of a 404.
export function ComingSoon({ eyebrow, title, description }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex max-w-md flex-col items-center gap-4">
        <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {eyebrow}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        <p className="text-muted-foreground text-pretty">{description}</p>
        <Link
          href="/dashboard"
          className={`mt-2 ${buttonVariants({ variant: "outline" })}`}
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
