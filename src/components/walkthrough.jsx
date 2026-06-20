"use client";

import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { CircleHelpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

// A spotlight tour (driver.js) that highlights real UI elements with Next/Back.
// Auto-starts once per browser (tracked by `storageKey`), always restarts right
// after login (the `?welcome=1` redirect flag), and can be replayed any time
// from the button. `steps` are plain driver.js step objects.
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
    if (startedRef.current) return;
    startedRef.current = true;

    // Force the tour right after login (?welcome=1), regardless of the
    // once-per-browser flag, then strip the param so a refresh won't replay it.
    let forced = false;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("welcome") === "1") {
        forced = true;
        params.delete("welcome");
        const qs = params.toString();
        window.history.replaceState(
          null,
          "",
          window.location.pathname + (qs ? `?${qs}` : ""),
        );
      }
    } catch {
      forced = false;
    }

    if (!forced) {
      if (!autoStart) return;
      let done = false;
      try {
        done = localStorage.getItem(storageKey) === "done";
      } catch {
        done = false;
      }
      if (done) return;
    }

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
