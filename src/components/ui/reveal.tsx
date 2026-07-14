"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type RevealDirection = "up" | "down" | "fade" | "scale" | "left" | "right";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof React.JSX.IntrinsicElements;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
  disabled?: boolean;
}

const OFFSETS: Record<RevealDirection, string> = {
  up: "translate3d(0, 16px, 0)",
  down: "translate3d(0, -16px, 0)",
  left: "translate3d(16px, 0, 0)",
  right: "translate3d(-16px, 0, 0)",
  fade: "translate3d(0, 0, 0)",
  scale: "scale(0.97)",
};

function useReducedMotion() {
  return React.useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function Reveal({
  as: Tag = "div",
  direction = "up",
  delay = 0,
  duration = 700,
  once = true,
  threshold = 0.12,
  rootMargin = "0px 0px -8% 0px",
  disabled = false,
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [inView, setInView] = React.useState(false);
  const reduced = useReducedMotion();
  const visible = disabled || reduced || inView;

  React.useEffect(() => {
    if (disabled || reduced) return;
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [disabled, reduced, once, threshold, rootMargin]);

  const composedStyle: React.CSSProperties = {
    transitionProperty: "opacity, transform, filter",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: `${delay}ms`,
    willChange: "opacity, transform",
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : OFFSETS[direction],
    ...style,
  };

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(className)}
      style={composedStyle}
      {...rest}
    >
      {children}
    </Component>
  );
}

interface StaggerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof React.JSX.IntrinsicElements;
  step?: number;
  initialDelay?: number;
  direction?: RevealDirection;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
}

export function Stagger({
  as = "div",
  step = 70,
  initialDelay = 0,
  direction = "up",
  duration = 700,
  threshold = 0.08,
  rootMargin = "0px 0px -6% 0px",
  className,
  children,
  ...rest
}: StaggerProps) {
  const Tag = as as React.ElementType;
  const arr = React.Children.toArray(children);
  return (
    <Tag className={cn(className)} {...rest}>
      {arr.map((child, i) => (
        <Reveal
          key={i}
          direction={direction}
          delay={initialDelay + i * step}
          duration={duration}
          threshold={threshold}
          rootMargin={rootMargin}
        >
          {child}
        </Reveal>
      ))}
    </Tag>
  );
}
