"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent } from "@/lib/site";

type TrackedAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string;
  eventParams?: Record<string, string | number | boolean | undefined>;
  children: ReactNode;
};

/** Plain <a> that emits a GA4 event on click without changing navigation UX. */
export function TrackedAnchor({
  eventName,
  eventParams,
  children,
  onClick,
  ...rest
}: TrackedAnchorProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackEvent(eventName, eventParams);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
