"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Player } from "@remotion/player";

import {
  HeroComposition,
  HERO_DURATION,
  HERO_FPS,
  HERO_HEIGHT,
  HERO_WIDTH,
  type HeroLayout,
} from "@/remotion/HeroComposition";

/** Below this aspect ratio the composition switches to its compact layout. */
const COMPACT_RATIO_THRESHOLD = 1.15;

/**
 * Renders the Remotion composition into the hero's notched container.
 *   1. Measures the parent DOM box and scales the Player so the composition
 *      always covers the notched shape (equivalent to object-fit: cover).
 *   2. Passes a stable `layout` inputProp so scenes can re-lay out for wide vs.
 *      compact container aspect ratios.
 *
 * numberOfSharedAudioTags={0}: the composition has zero audio content, so we
 * tell the Player to skip pre-mounting its shared <audio> pool. That pool
 * creates an AudioContext on mount, which Chrome blocks on refresh (no fresh
 * user gesture), gating the render loop. Setting to 0 avoids AudioContext
 * entirely — Player boots and plays unconditionally, first load and refresh
 * alike. Bump back to the default (5) if you ever add <Audio>/<Video>.
 */
export function HeroVideoPlayer() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect || rect.width === 0 || rect.height === 0) return;
      setDims((prev) => {
        if (prev && prev.w === rect.width && prev.h === rect.height) {
          return prev;
        }
        return { w: rect.width, h: rect.height };
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout: HeroLayout = useMemo(() => {
    if (!dims) return "wide";
    return dims.w / dims.h < COMPACT_RATIO_THRESHOLD ? "compact" : "wide";
  }, [dims]);

  const inputProps = useMemo(() => ({ layout }), [layout]);

  const style = useMemo<React.CSSProperties>(() => {
    if (!dims) {
      return { width: "100%", height: "100%", display: "block" };
    }
    const scale = Math.max(dims.w / HERO_WIDTH, dims.h / HERO_HEIGHT);
    const renderedW = HERO_WIDTH * scale;
    const renderedH = HERO_HEIGHT * scale;
    return {
      position: "absolute",
      left: (dims.w - renderedW) / 2,
      top: (dims.h - renderedH) / 2,
      width: renderedW,
      height: renderedH,
      display: "block",
    };
  }, [dims]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <Player
        component={HeroComposition}
        durationInFrames={HERO_DURATION}
        fps={HERO_FPS}
        compositionWidth={HERO_WIDTH}
        compositionHeight={HERO_HEIGHT}
        numberOfSharedAudioTags={0}
        inputProps={inputProps}
        style={style}
        loop
        autoPlay
        controls={false}
        showVolumeControls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        moveToBeginningWhenEnded
        alwaysShowControls={false}
        acknowledgeRemotionLicense
      />
    </div>
  );
}
