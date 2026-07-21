"use client";

import { useEffect, useRef, useState } from "react";

/** Below this container aspect ratio, use the compact-layout video. */
const COMPACT_RATIO_THRESHOLD = 1.15;
/** Video fade-in duration once the browser reports it can play. */
const REVEAL_FADE_MS = 260;

type Layout = "wide" | "compact";

/**
 * Serves the hero animation as a pre-rendered WebM/MP4 video instead of
 * running the Remotion composition live via `@remotion/player`. The two
 * layouts are rendered from `src/remotion/HeroComposition.tsx` at build time:
 *
 *   npx remotion render Hero public/hero-wide.webm    --props='{"layout":"wide"}'    --codec=vp9 --crf=22
 *   npx remotion render Hero public/hero-compact.webm --props='{"layout":"compact"}' --codec=vp9 --crf=22
 *   npx remotion render Hero public/hero-wide.mp4     --props='{"layout":"wide"}'    --codec=h264 --crf=18
 *   npx remotion render Hero public/hero-compact.mp4  --props='{"layout":"compact"}' --codec=h264 --crf=18
 *
 * WebM (VP9) is the primary format — ~35% smaller than h264 at matched
 * quality. MP4 (h264) is the fallback for Safari < 14.1 and any decoder that
 * doesn't advertise VP9 support.
 *
 * Runtime:
 *   - ResizeObserver picks the layout that matches the container's aspect,
 *     so the same viewport-adaptive behavior the live composition had is
 *     preserved. When the aspect crosses the threshold we call `video.load()`
 *     to swap the source without a component remount.
 *   - The element mounts with `preload="auto"` so buffering starts on the
 *     first paint of the page. By the time the notched clip-path finishes
 *     morphing (~800ms per `INTRO_MS` in home-hero.tsx), decoding is warm and
 *     the video is ready to play on any reasonable connection.
 *   - Opacity is gated on `canplay` and fades in over 260ms. Before that,
 *     the video is transparent and the parent shape div's cream background
 *     shows through — which matches the composition's frame-0 paper-grain
 *     state, so there's no visible seam between "not-yet-loaded" and "playing".
 */
export function HeroVideoPlayer() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [layout, setLayout] = useState<Layout>("wide");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect || rect.width === 0 || rect.height === 0) return;
      const next: Layout =
        rect.width / rect.height < COMPACT_RATIO_THRESHOLD ? "compact" : "wide";
      setLayout((prev) => (prev === next ? prev : next));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // When the layout flips, force the video to reload from the newly-selected
  // <source> URLs. Without this the browser keeps playing the previous layout
  // even after React updates the DOM (video src is only re-evaluated on load()).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setReady(false);
    video.load();
  }, [layout]);

  const base = layout === "compact" ? "/hero-compact" : "/hero-wide";

  return (
    <div
      ref={wrapperRef}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
        onCanPlay={() => setReady(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          opacity: ready ? 1 : 0,
          transition: `opacity ${REVEAL_FADE_MS}ms ease-out`,
        }}
      >
        {/* Keys force React to unmount/remount the <source> nodes when the
            layout changes so the browser sees fresh URLs at the next load(). */}
        <source key={`${base}.webm`} src={`${base}.webm`} type="video/webm" />
        <source key={`${base}.mp4`} src={`${base}.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}
