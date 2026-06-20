"use client";

import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { CircleHelpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

// A spotlight tour (driver.js) that highlights real UI elements with Next/Back.
// Auto-starts once per browser (tracked by `storageKey`) and can be replayed
// any time from the button. `steps` are plain driver.js step objects.
export function Walkthrough({
  steps,
  storageKey,
  label = "Walkthrough",
  autoStart = true,
}) {
  const startedRef = useRef(false);

  function run() {
    const tour = driver({
      showProgress: true,
      allowClose: true,
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",
      steps,
      onDestroyed: () => {
        try {
          localStorage.setItem(storageKey, "done");
        } catch {
          // ignore storage failures (private mode etc.)
        }
      },
    });
    tour.drive();
  }

  useEffect(() => {
    if (!autoStart || startedRef.current) return;
    startedRef.current = true;

    let done = false;
    try {
      done = localStorage.getItem(storageKey) === "done";
    } catch {
      done = false;
    }
    if (done) return;

    // Let the page settle so the highlighted targets are mounted.
    const t = setTimeout(run, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Button type="button" variant="outline" size="sm" onClick={run}>
      <CircleHelpIcon />
      {label}
    </Button>
  );
}
