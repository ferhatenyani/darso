import { Composition } from "remotion";
import {
  HeroComposition,
  HERO_DURATION,
  HERO_FPS,
  HERO_HEIGHT,
  HERO_WIDTH,
  type HeroLayout,
} from "./HeroComposition";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Hero"
      component={HeroComposition}
      durationInFrames={HERO_DURATION}
      fps={HERO_FPS}
      width={HERO_WIDTH}
      height={HERO_HEIGHT}
      defaultProps={{ layout: "wide" as HeroLayout }}
    />
  </>
);
