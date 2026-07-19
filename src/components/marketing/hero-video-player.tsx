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

/** Storyset SVGs used by the composition. Pre-warmed on mount so the first
 *  loop doesn't render empty scenes while their fetches are in flight. */
const SVG_PRELOAD = [
  "/svgs/Video tutorial-rafiki.svg",
  "/svgs/Video tutorial-pana.svg",
  "/svgs/Kids Studying from Home-bro.svg",
  "/svgs/Events-pana.svg",
  "/svgs/Partnership-pana.svg",
];

/**
 * Renders the Remotion composition into the hero's notched container.
 *   1. Measures the parent DOM box and scales the Player so the composition
 *      always covers the notched shape (equivalent to object-fit: cover).
 *   2. Passes a stable `layout` inputProp so scenes can re-lay out for wide vs.
 *      compact container aspect ratios.
 *
 * Audio suppression (composition has zero audio content):
 *   - numberOfSharedAudioTags={0}: skip the shared <audio> tag pool.
 *   - initiallyMuted={true}: this is what actually gates AudioContext
 *     creation. Remotion's shouldCreateAudioContext =
 *       audioEnabled && !playerMuted && mediaVolume > 0
 *     so as long as the player boots muted, no AudioContext is instantiated,
 *     and Chrome's autoplay policy has nothing to gate the render loop on.
 *   Both together mirror Remotion's own thumbnail preview pattern. Bump back
 *   to defaults (5 tags, unmuted) if you ever add <Audio>/<Video>.
 */
export function HeroVideoPlayer() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all(SVG_PRELOAD.map((src) => fetch(src).then((r) => r.text())))
      .then(() => {
        if (!cancelled) setAssetsReady(true);
      })
      .catch(() => {
        // Even if some fail, still show the Player so the composition can
        // partially render — better than a blank container.
        if (!cancelled) setAssetsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
      {assetsReady && (
        <Player
          component={HeroComposition}
          durationInFrames={HERO_DURATION}
          fps={HERO_FPS}
          compositionWidth={HERO_WIDTH}
          compositionHeight={HERO_HEIGHT}
          numberOfSharedAudioTags={0}
          initiallyMuted
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
      )}
    </div>
  );
}
