"use client";

import { Player } from "@remotion/player";

import {
  HeroComposition,
  HERO_DURATION,
  HERO_FPS,
  HERO_HEIGHT,
  HERO_WIDTH,
} from "@/remotion/HeroComposition";

/**
 * Renders the Remotion composition inline via @remotion/player.
 * No MP4 render step — the composition runs live in the browser.
 */
export function HeroVideoPlayer() {
  return (
    <Player
      component={HeroComposition}
      durationInFrames={HERO_DURATION}
      fps={HERO_FPS}
      compositionWidth={HERO_WIDTH}
      compositionHeight={HERO_HEIGHT}
      style={{ width: "100%", height: "100%", display: "block" }}
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
      initialFrame={80}
    />
  );
}
