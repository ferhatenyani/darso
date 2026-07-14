"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  CheckoutStepperDesktop,
  CheckoutStepperMobile,
} from "@/components/checkout/checkout-stepper";

// Layout scaffold shared by every step of the checkout flow.
// - Desktop: left column = 280px vertical stepper, right column = content.
// - Mobile: sticky top step indicator, then content, then a caller-provided
//   sticky bottom action bar (safe-area padded). Passing null hides the bar
//   for the terminal "Confirmé" step which has in-content CTAs instead.

type Props = {
  currentIndex: number;
  children: ReactNode;
  /**
   * Optional sticky bottom bar on mobile. Rendered inside a safe-area-padded
   * container with a top divider and card background. On desktop this
   * container is hidden — desktop shows its own in-content action row.
   */
  mobileActionBar?: ReactNode;
  className?: string;
};

export function CheckoutShell({
  currentIndex,
  children,
  mobileActionBar,
  className,
}: Props) {
  return (
    <div className={cn("relative", className)}>
      {/* Mobile: sticky step header under the site nav */}
      <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="container-narrow py-3">
          <CheckoutStepperMobile currentIndex={currentIndex} />
        </div>
      </div>

      {/* Main container */}
      <div className="container-narrow py-8 md:py-12 lg:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <CheckoutStepperDesktop currentIndex={currentIndex} />
          <div className={cn("min-w-0 flex-1", mobileActionBar && "pb-24 lg:pb-0")}>
            {children}
          </div>
        </div>
      </div>

      {/* Mobile: sticky bottom action bar */}
      {mobileActionBar && (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card",
            "shadow-e3 lg:hidden",
            "pb-[max(env(safe-area-inset-bottom),16px)] pt-3 px-4",
          )}
        >
          {mobileActionBar}
        </div>
      )}
    </div>
  );
}
