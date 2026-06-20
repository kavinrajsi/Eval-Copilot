// Spotlight-tour step definitions (driver.js format). Plain data so they can be
// imported by Server Components and handed to the <Walkthrough> client component.

export const dashboardTour = [
  {
    element: '[data-slot="sidebar-container"]',
    popover: {
      title: "Navigation",
      description:
        "Jump between the dashboard and each feature you're evaluating. New features appear here.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="new-feature"]',
    popover: {
      title: "1. Create a feature",
      description:
        "Start here — add the AI capability you want to evaluate (e.g. an SEO writer, image generator, or classifier).",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: '[data-tour="kpis"]',
    popover: {
      title: "Health at a glance",
      description:
        "Totals for your features, golden cases, runs, and the overall pass rate across every graded case.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="chart"]',
    popover: {
      title: "Pass rate over time",
      description:
        "Each run's pass rate, oldest to newest — watch it climb as you fix issues.",
      side: "top",
    },
  },
  {
    element: '[data-tour="features"]',
    popover: {
      title: "Your features",
      description:
        "Click any feature to open its workspace: Golden Set → Rubric → Run → Results → Compare.",
      side: "top",
    },
  },
];

export const workspaceTour = [
  {
    element: '[data-slot="tabs-list"]',
    popover: {
      title: "The five-step flow",
      description:
        "Golden Set (write known-good answers first) → Rubric (what the computer checks) → Run (grade outputs) → Results (a human confirms the fuzzy ones) → Compare (did the fix help?).",
      side: "bottom",
      align: "start",
    },
  },
];
