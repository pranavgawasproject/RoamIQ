"use client";

import { useEffect, useState } from "react";
import { WaitlistInline } from "@/components/site/waitlist-inline";

type WaitlistStickyProps = {
  source: string;
  context?: Record<string, string | null | undefined>;
  heading?: string;
  description?: string;
  /** Scroll Y (px) before the bar appears. Default 0 so high-bounce landings see the form without scrolling. */
  afterPx?: number;
};

/** Fixed bottom capture for high-exit listing and destination landings. No fabricated stats or urgency. */
export function WaitlistSticky({ source, context, heading, description, afterPx = 0 }: WaitlistStickyProps) {
  const [visible, setVisible] = useState(afterPx <= 0);

  useEffect(() => {
    const onScroll = () => {
      // >= so afterPx=0 landings (100% bounce /workspaces) see the bar
      // without requiring a scroll that never happens.
      setVisible(window.scrollY >= afterPx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [afterPx]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur sm:p-4">
      <div className="mx-auto max-w-3xl pb-[env(safe-area-inset-bottom)]">
        <WaitlistInline
          source={source}
          askCity
          askGap
          compact
          context={context}
          heading={heading ?? "Leaving without a shortlist?"}
          description={
            description ??
            "Most /workspaces visits end on this index or a listing. Email plus an optional city is enough. We only write when a listed price or Wi-Fi value exists."
          }
        />
      </div>
    </div>
  );
}
