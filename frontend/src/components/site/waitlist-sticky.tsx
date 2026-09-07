"use client";

import { useEffect, useState } from "react";
import { WaitlistInline } from "@/components/site/waitlist-inline";

type WaitlistStickyProps = {
  source: string;
  context?: Record<string, string | null | undefined>;
};

/** Fixed bottom capture for /workspaces bounce traffic. No fabricated stats or urgency. */
export function WaitlistSticky({ source, context }: WaitlistStickyProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 480);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur sm:p-4">
      <div className="mx-auto max-w-3xl pb-[env(safe-area-inset-bottom)]">
        <WaitlistInline
          source={source}
          askCity
          compact
          context={context}
          heading="Leaving without a shortlist?"
          description="Most /workspaces visits end on this index or a listing. Email plus an optional city is enough. We only write when a listed price or Wi-Fi value exists."
        />
      </div>
    </div>
  );
}
