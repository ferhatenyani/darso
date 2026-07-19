import { Composition } from "remotion";
import {
  HeroComposition,
  HERO_DURATION,
  HERO_FPS,
  HERO_HEIGHT,
  HERO_WIDTH,
} from "./HeroComposition";

/**
 * Remotion Studio / render entry.
 * Reachable via `npx remotion studio src/remotion/index.ts`
 * or `npx remotion render Hero out/hero.mp4`.
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Hero"
      component={HeroComposition}
      durationInFrames={HERO_DURATION}
      fps={HERO_FPS}
      width={HERO_WIDTH}
      height={HERO_HEIGHT}
    />
  </>
);
