import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* --------------------------------------------------------------------------
 * Darso — Hero composition · "The Value Loop" (v6, illustration-driven)
 *
 * 750 frames · 25s @ 30fps · seamless loop
 *   1 · Rafiki browse         (0–120)   woman browsing courses, Sofia card
 *   2 · Painting course       (120–225) man teaching, screen pulse
 *   3 · 1-1 sessions          (225–330) two figures at a desk, focused study
 *   4 · Plan your week        (330–435) two figures + calendar, planning
 *   5 · Scale to agency       (435–540) partnership scene, puzzle click
 *   6 · Fair-share vase       (540–675) amber 90% + blue top 10% + arrows
 *   7 · Dark finale           (675–750) Caveat wordmark, CTA, fade back
 * -------------------------------------------------------------------------- */

export const HERO_WIDTH = 1600;
export const HERO_HEIGHT = 1000;
export const HERO_FPS = 30;
export const HERO_DURATION = 750;
export type HeroLayout = "wide" | "compact";

/* ---------- Palette ---------- */

const BG = "#F7F7F5";
const SURFACE = "#FFFFFF";
const INK = "#0E1116";
const INK_2 = "#5A6070";
const INK_BLACK = "#111111";

const COOL = "#4E88F5";
const COOL_2 = "#2F6FEB";

const WARM = "#F0A014";
const WARM_2 = "#D48604";

/* Springs */
const ELASTIC_SOFT = { damping: 14, stiffness: 110, mass: 0.9 } as const;
const POP = { damping: 12, stiffness: 170, mass: 0.9 } as const;

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* Scene windows */
const S1 = { start: 0, end: 120 };
const S2 = { start: 120, end: 225 };
const S3 = { start: 225, end: 330 };
const S4 = { start: 330, end: 435 };
const S5 = { start: 435, end: 540 };
const S6 = { start: 540, end: 675 };
const S7 = { start: 675, end: 750 };
const FADE = 14;

function sceneOpacity(frame: number, start: number, end: number, fade = FADE) {
  const enter = interpolate(frame, [start - fade, start + fade], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [end - fade, end + fade], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(enter, exit);
}

/* Storyset asset paths */
const SVG_RAFIKI = "/svgs/Video tutorial-rafiki.svg";
const SVG_PAINTING = "/svgs/Video tutorial-pana.svg";
const SVG_STUDYING = "/svgs/Kids Studying from Home-bro.svg";
const SVG_EVENTS = "/svgs/Events-pana.svg";
const SVG_PARTNERSHIP = "/svgs/Partnership-pana.svg";

/* --------------------------------------------------------------------------
 * Root
 * -------------------------------------------------------------------------- */

export const HeroComposition: React.FC<{ layout?: HeroLayout }> = ({
  layout = "wide",
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        color: INK,
        overflow: "hidden",
      }}
    >
      <PaperGrain />
      {frame < S1.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S1.start, S1.end) }}>
          <SceneRafikiBrowse localFrame={frame - S1.start} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S2.start - FADE && frame < S2.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S2.start, S2.end) }}>
          <ScenePainting localFrame={frame - S2.start} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S3.start - FADE && frame < S3.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S3.start, S3.end) }}>
          <SceneSessions localFrame={frame - S3.start} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S4.start - FADE && frame < S4.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S4.start, S4.end) }}>
          <SceneCalendarPlanning
            localFrame={frame - S4.start}
            layout={layout}
          />
        </AbsoluteFill>
      )}
      {frame > S5.start - FADE && frame < S5.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S5.start, S5.end) }}>
          <ScenePartnership localFrame={frame - S5.start} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S6.start - FADE && frame < S6.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S6.start, S6.end) }}>
          <SceneVase localFrame={frame - S6.start} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S7.start - FADE && (
        <AbsoluteFill
          style={{ opacity: sceneOpacity(frame, S7.start, S7.end, 6) }}
        >
          <SceneDarkFinale localFrame={frame - S7.start} layout={layout} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------------------------
 * Paper grain — subtle, sits above the base bg and below scene content
 * -------------------------------------------------------------------------- */

const PaperGrain: React.FC = () => (
  <svg
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      mixBlendMode: "multiply",
      opacity: 0.3,
    }}
    aria-hidden
  >
    <defs>
      <filter id="paperNoise" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          seed="7"
        />
        <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0.10 0" />
      </filter>
    </defs>
    <rect width="100%" height="100%" filter="url(#paperNoise)" />
  </svg>
);

/* --------------------------------------------------------------------------
 * StorysetSvg — loads a Storyset SVG via fetch, injects it inline, then
 * addresses named `<g id="...">` layers each frame with inline styles.
 * -------------------------------------------------------------------------- */

type LayerStyles = {
  transform?: string;
  transformOrigin?: string;
  opacity?: string | number;
};

const svgCache: Record<string, string> = {};

const StorysetSvg: React.FC<{
  src: string;
  animations?: Record<string, LayerStyles>;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ src, animations, style, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgText, setSvgText] = useState<string | null>(svgCache[src] ?? null);

  useEffect(() => {
    if (svgCache[src]) {
      setSvgText(svgCache[src]);
      return;
    }
    let cancelled = false;
    fetch(src)
      .then((r) => r.text())
      .then((text) => {
        svgCache[src] = text;
        if (!cancelled) setSvgText(text);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [src]);

  useLayoutEffect(() => {
    if (!animations || !containerRef.current) return;
    const root = containerRef.current;
    Object.entries(animations).forEach(([id, styles]) => {
      const el = root.querySelector<SVGGElement>(`[id="${id}"]`);
      if (!el) return;
      if (styles.transform !== undefined) el.style.transform = styles.transform;
      if (styles.transformOrigin !== undefined)
        el.style.transformOrigin = styles.transformOrigin;
      if (styles.opacity !== undefined)
        el.style.opacity = String(styles.opacity);
    });
  });

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {svgText && (
        <div
          style={{ width: "100%", height: "100%" }}
          dangerouslySetInnerHTML={{ __html: svgText }}
        />
      )}
      {children}
    </div>
  );
};

/* --------------------------------------------------------------------------
 * Reusable copy block that sits at the top of each illustrated scene
 * -------------------------------------------------------------------------- */

const SceneCopy: React.FC<{
  eyebrow: string;
  main: string;
  localFrame: number;
  layout: HeroLayout;
  eyebrowAt?: [number, number];
  mainAt?: [number, number];
}> = ({
  eyebrow,
  main,
  localFrame,
  layout,
  eyebrowAt = [8, 28],
  mainAt = [18, 38],
}) => {
  const eIn = interpolate(localFrame, eyebrowAt, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => cubicBezier(EASE_OUT, t),
  });
  const mIn = interpolate(localFrame, mainAt, [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => cubicBezier(EASE_OUT, t),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 130,
        transform: "translate(-50%, 0)",
        textAlign: "center",
        width: layout === "wide" ? 960 : 700,
        maxWidth: "92%",
        padding: "0 24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: INK_2,
          fontWeight: 700,
          opacity: eIn,
          transform: `translateY(${(1 - eIn) * 8}px)`,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontSize: layout === "wide" ? 34 : 24,
          fontWeight: 700,
          color: INK,
          letterSpacing: "-0.03em",
          marginTop: 12,
          lineHeight: 1.1,
          opacity: mIn,
          transform: `translateY(${(1 - mIn) * 10}px)`,
        }}
      >
        {main}
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
 * Illustration wrapper — smooth entry animation for each Storyset scene
 * -------------------------------------------------------------------------- */

const IllustrationStage: React.FC<{
  localFrame: number;
  size: { w: number; h: number };
  centerY?: number;
  children: React.ReactNode;
}> = ({ localFrame, size, centerY = HERO_HEIGHT / 2 + 60, children }) => {
  const { fps } = useVideoConfig();
  const inSpring = spring({ frame: localFrame, fps, config: ELASTIC_SOFT });
  const inY = interpolate(inSpring, [0, 1], [40, 0]);
  const inScale = 0.94 + inSpring * 0.06;

  return (
    <div
      style={{
        position: "absolute",
        left: HERO_WIDTH / 2,
        top: centerY,
        width: size.w,
        height: size.h,
        transform: `translate(-50%, calc(-50% + ${inY}px)) scale(${inScale})`,
        opacity: inSpring,
      }}
    >
      {children}
    </div>
  );
};

/* ==========================================================================
 * Scene 1 · Rafiki Browse — woman browsing, Sofia card slides in
 * ========================================================================== */

const SceneRafikiBrowse: React.FC<{
  localFrame: number;
  layout: HeroLayout;
}> = ({ localFrame, layout }) => {
  const { fps } = useVideoConfig();

  const bob = Math.sin(localFrame * 0.09) * 2.4;
  const screenPulse = 0.9 + Math.sin(localFrame * 0.11) * 0.1;

  const cardSpring = spring({
    frame: localFrame - 60,
    fps,
    config: ELASTIC_SOFT,
  });
  const cardY = interpolate(cardSpring, [0, 1], [40, 0]);
  const cardScale = 0.94 + cardSpring * 0.06;
  const cardPulse =
    cardSpring > 0.5 ? 1 + Math.sin((localFrame - 60) * 0.32) * 0.03 : 1;

  const illustSize =
    layout === "wide" ? { w: 540, h: 540 } : { w: 420, h: 420 };

  const animations: Record<string, LayerStyles> = {
    "freepik--Character--inject-238": {
      transform: `translate(0px, ${bob}px)`,
      transformOrigin: "50% 50%",
    },
    "freepik--background-complete--inject-238": {
      opacity: String(screenPulse),
    },
  };

  return (
    <>
      <SceneCopy
        eyebrow="Explorez"
        main="Trouvez l'enseignant qui vous ressemble."
        localFrame={localFrame}
        layout={layout}
      />

      <IllustrationStage localFrame={localFrame} size={illustSize}>
        <StorysetSvg src={SVG_RAFIKI} animations={animations} />
        {cardSpring > 0.01 && layout === "wide" && (
          <div
            style={{
              position: "absolute",
              left: "78%",
              top: "42%",
              width: 240,
              transform: `translate(-50%, calc(-50% + ${cardY}px)) scale(${cardScale})`,
              opacity: cardSpring,
            }}
          >
            <FlatTeacherCard pulse={cardPulse} />
          </div>
        )}
      </IllustrationStage>

      {cardSpring > 0.01 && layout === "compact" && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: HERO_HEIGHT * 0.5 + illustSize.h * 0.5 + 60,
            width: 300,
            transform: `translate(-50%, ${cardY}px) scale(${cardScale})`,
            opacity: cardSpring,
          }}
        >
          <FlatTeacherCard pulse={cardPulse} />
        </div>
      )}
    </>
  );
};

const FlatTeacherCard: React.FC<{ pulse?: number }> = ({ pulse = 1 }) => (
  <div
    style={{
      background: SURFACE,
      borderRadius: 22,
      border: `2px solid ${INK}`,
      padding: 14,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      boxShadow: "0 18px 30px -18px rgba(14,17,22,0.28)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          background: COOL,
          border: `2px solid ${INK}`,
          display: "grid",
          placeItems: "center",
          color: "white",
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          flex: "0 0 42px",
        }}
      >
        S
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: INK,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Sofia
        </div>
        <div
          style={{
            fontSize: 12,
            color: INK_2,
            marginTop: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Espagnol · ★ 4,9
        </div>
      </div>
    </div>
    <div
      style={{
        padding: "10px 14px",
        borderRadius: 14,
        background: COOL,
        border: `2px solid ${COOL_2}`,
        color: "white",
        fontSize: 13,
        fontWeight: 700,
        textAlign: "center",
        letterSpacing: "-0.005em",
        transform: `scale(${pulse})`,
        boxShadow: `0 0 0 ${(pulse - 1) * 240}px rgba(47, 111, 235, 0.14)`,
      }}
    >
      Réserver
    </div>
  </div>
);

/* ==========================================================================
 * Scene 2 · Painting course (pana) — man teaching/creating
 * ========================================================================== */

const ScenePainting: React.FC<{
  localFrame: number;
  layout: HeroLayout;
}> = ({ localFrame, layout }) => {
  const sway = Math.sin(localFrame * 0.08) * 3;
  const videoPulse = 0.88 + Math.sin(localFrame * 0.12) * 0.12;

  const illustSize =
    layout === "wide" ? { w: 780, h: 520 } : { w: 560, h: 380 };

  const animations: Record<string, LayerStyles> = {
    "freepik--Character--inject-235": {
      transform: `translate(0px, ${sway}px)`,
      transformOrigin: "50% 100%",
    },
    "freepik--Video--inject-235": {
      opacity: String(videoPulse),
    },
  };

  return (
    <>
      <SceneCopy
        eyebrow="Tous les domaines"
        main="Un enseignant pour chaque passion."
        localFrame={localFrame}
        layout={layout}
      />
      <IllustrationStage localFrame={localFrame} size={illustSize}>
        <StorysetSvg src={SVG_PAINTING} animations={animations} />
      </IllustrationStage>
    </>
  );
};

/* ==========================================================================
 * Scene 3 · 1-1 Sessions (bro) — two figures at a desk
 * ========================================================================== */

const SceneSessions: React.FC<{
  localFrame: number;
  layout: HeroLayout;
}> = ({ localFrame, layout }) => {
  const bob1 = Math.sin(localFrame * 0.09) * 1.8;
  const bob2 = Math.sin(localFrame * 0.09 + 0.6) * 1.8;
  const devicePulse = 0.88 + Math.sin(localFrame * 0.13) * 0.12;

  const illustSize =
    layout === "wide" ? { w: 600, h: 480 } : { w: 460, h: 380 };

  const animations: Record<string, LayerStyles> = {
    "freepik--character-1--inject-229": {
      transform: `translate(0px, ${bob1}px)`,
      transformOrigin: "50% 100%",
    },
    "freepik--character-2--inject-229": {
      transform: `translate(0px, ${bob2}px)`,
      transformOrigin: "50% 100%",
    },
    "freepik--Device--inject-229": {
      opacity: String(devicePulse),
    },
  };

  return (
    <>
      <SceneCopy
        eyebrow="Un cours, un cap"
        main="Avancez à votre rythme, jamais seul."
        localFrame={localFrame}
        layout={layout}
      />
      <IllustrationStage localFrame={localFrame} size={illustSize}>
        <StorysetSvg src={SVG_STUDYING} animations={animations} />
      </IllustrationStage>
    </>
  );
};

/* ==========================================================================
 * Scene 4 · Calendar planning (events-pana)
 * ========================================================================== */

const SceneCalendarPlanning: React.FC<{
  localFrame: number;
  layout: HeroLayout;
}> = ({ localFrame, layout }) => {
  const calRot = Math.sin(localFrame * 0.06) * 1.2;
  const char1Bob = Math.sin(localFrame * 0.08) * 2;
  const char2Bob = Math.sin(localFrame * 0.08 + 0.7) * 2;
  const plantSway = Math.sin(localFrame * 0.05) * 1.5;

  const illustSize =
    layout === "wide" ? { w: 780, h: 520 } : { w: 560, h: 380 };

  const animations: Record<string, LayerStyles> = {
    "freepik--Calendar--inject-65": {
      transform: `rotate(${calRot}deg)`,
      transformOrigin: "50% 50%",
    },
    "freepik--character-1--inject-65": {
      transform: `translate(0px, ${char1Bob}px)`,
      transformOrigin: "50% 100%",
    },
    "freepik--character-2--inject-65": {
      transform: `translate(0px, ${char2Bob}px)`,
      transformOrigin: "50% 100%",
    },
    "freepik--Plant--inject-65": {
      transform: `rotate(${plantSway}deg)`,
      transformOrigin: "50% 100%",
    },
  };

  return (
    <>
      <SceneCopy
        eyebrow="Votre semaine"
        main="Un agenda qui suit votre vie, pas l'inverse."
        localFrame={localFrame}
        layout={layout}
      />
      <IllustrationStage localFrame={localFrame} size={illustSize}>
        <StorysetSvg src={SVG_EVENTS} animations={animations} />
      </IllustrationStage>
    </>
  );
};

/* ==========================================================================
 * Scene 5 · Partnership — agency scene, puzzle click + bulb glow
 * ========================================================================== */

const ScenePartnership: React.FC<{
  localFrame: number;
  layout: HeroLayout;
}> = ({ localFrame, layout }) => {
  const puzzleT = (localFrame * 0.02) % 1;
  const puzzleScale = 1 + Math.sin(puzzleT * Math.PI * 2) * 0.02;
  const bulbGlow = 0.75 + Math.sin(localFrame * 0.14) * 0.25;
  const bubbleBob = Math.sin(localFrame * 0.09) * 2;
  const charsBob = Math.sin(localFrame * 0.08) * 1.6;

  const illustSize =
    layout === "wide" ? { w: 780, h: 520 } : { w: 560, h: 380 };

  const animations: Record<string, LayerStyles> = {
    "freepik--Puzzle--inject-402": {
      transform: `scale(${puzzleScale})`,
      transformOrigin: "50% 50%",
    },
    "freepik--Characters--inject-402": {
      transform: `translate(0px, ${charsBob}px)`,
      transformOrigin: "50% 100%",
    },
    "freepik--light-bulb--inject-402": {
      opacity: String(bulbGlow),
      transformOrigin: "50% 50%",
    },
    "freepik--speech-bubble--inject-402": {
      transform: `translate(0px, ${bubbleBob}px)`,
      transformOrigin: "50% 50%",
    },
  };

  return (
    <>
      <SceneCopy
        eyebrow="Seul plus vite, ensemble plus loin"
        main="Formez votre agence. Multipliez votre impact."
        localFrame={localFrame}
        layout={layout}
      />
      <IllustrationStage localFrame={localFrame} size={illustSize}>
        <StorysetSvg src={SVG_PARTNERSHIP} animations={animations} />
      </IllustrationStage>
    </>
  );
};

/* ==========================================================================
 * Scene 6 · Vase — amber 90% + blue top 10% + labelled arrows (135 f)
 * ========================================================================== */

const T6_TITLE_IN = 6;
const T6_FILL_START = 20;
const T6_AMBER_END = 78;
const T6_BLUE_END = 100;
const T6_ARROWS_IN = 104;

const SceneVase: React.FC<{
  localFrame: number;
  layout: HeroLayout;
}> = ({ localFrame, layout }) => {
  const vaseH = layout === "wide" ? 300 : 240;
  const vaseW = vaseH * 0.78;
  const cx = HERO_WIDTH / 2;
  const cy = HERO_HEIGHT / 2 + 30;

  const titleIn = interpolate(
    localFrame,
    [T6_TITLE_IN, T6_TITLE_IN + 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => cubicBezier(EASE_OUT, t),
    },
  );
  const subIn = interpolate(
    localFrame,
    [T6_TITLE_IN + 10, T6_TITLE_IN + 26],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => cubicBezier(EASE_OUT, t),
    },
  );

  const amberPct = interpolate(
    localFrame,
    [T6_FILL_START, T6_AMBER_END],
    [0, 0.9],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => cubicBezier(EASE_OUT, t),
    },
  );
  const bluePct = interpolate(
    localFrame,
    [T6_AMBER_END, T6_BLUE_END],
    [0, 0.1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => cubicBezier(EASE_OUT, t),
    },
  );

  const arrowsIn = interpolate(
    localFrame,
    [T6_ARROWS_IN, T6_ARROWS_IN + 16],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => cubicBezier(EASE_OUT, t),
    },
  );

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: cy - vaseH * 0.5 - 130,
          transform: "translate(-50%, 0)",
          textAlign: "center",
          maxWidth: layout === "wide" ? 900 : 620,
          width: "100%",
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: INK_2,
            fontWeight: 700,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 10}px)`,
            marginBottom: 14,
          }}
        >
          Une croissance partagée
        </div>
        <div
          style={{
            fontSize: layout === "wide" ? 32 : 22,
            fontWeight: 700,
            color: INK,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 12}px)`,
          }}
        >
          Faites décoller votre activité.
        </div>
        <div
          style={{
            fontSize: layout === "wide" ? 19 : 14,
            color: INK_2,
            marginTop: 8,
            letterSpacing: "-0.01em",
            lineHeight: 1.35,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 12}px)`,
          }}
        >
          Puis contribuez au succès collectif.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: vaseW,
          height: vaseH,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Amphora
          width={vaseW}
          height={vaseH}
          amberPct={amberPct}
          bluePct={bluePct}
          localFrame={localFrame}
        />
      </div>

      {arrowsIn > 0.01 && (
        <VaseAnnotations
          cx={cx}
          cy={cy}
          vaseW={vaseW}
          vaseH={vaseH}
          layout={layout}
          opacity={arrowsIn}
        />
      )}
    </>
  );
};

const Amphora: React.FC<{
  width: number;
  height: number;
  amberPct: number;
  bluePct: number;
  localFrame: number;
}> = ({ width, height, amberPct, bluePct, localFrame }) => {
  const clipId = useId();
  const vbW = 200;
  const vbH = 260;
  const interiorBottom = 246;
  const interiorTop = 12;
  const interiorSpan = interiorBottom - interiorTop;

  const amberTop = interiorBottom - amberPct * interiorSpan;
  const blueTop = interiorBottom - (amberPct + bluePct) * interiorSpan;
  const hasBlue = bluePct > 0.01;

  const path = `
    M 60 12
    Q 100 6 140 12
    Q 148 18 145 26
    Q 138 32 130 30
    L 128 56
    C 175 82 196 130 190 176
    Q 184 216 152 236
    L 148 246
    L 52 246
    L 48 236
    Q 16 216 10 176
    C 4 130 25 82 72 56
    L 70 30
    Q 62 32 55 26
    Q 52 18 60 12 Z
  `;

  const wobbleEdge = (yBase: number, direction: "ltr" | "rtl" = "ltr") => {
    const steps = 10;
    const amp = 2.5;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = t * vbW;
      const y = yBase + Math.sin(t * Math.PI * 3 + localFrame * 0.18) * amp;
      pts.push({ x, y });
    }
    if (direction === "rtl") pts.reverse();
    return pts;
  };

  const amberEdgeTop = hasBlue
    ? [
        { x: 0, y: amberTop },
        { x: vbW, y: amberTop },
      ]
    : wobbleEdge(amberTop, "ltr");
  const amberPath =
    amberEdgeTop
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ") + ` L ${vbW} ${vbH} L 0 ${vbH} Z`;

  const blueTopEdge = wobbleEdge(blueTop, "ltr");
  const blueBottomEdge = [
    { x: vbW, y: amberTop },
    { x: 0, y: amberTop },
  ];
  const bluePath =
    blueTopEdge
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ") +
    " " +
    blueBottomEdge.map((p) => `L ${p.x} ${p.y}`).join(" ") +
    " Z";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${vbW} ${vbH}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={path} />
        </clipPath>
      </defs>
      <path d={path} fill={SURFACE} />
      {amberPct > 0.01 && (
        <g clipPath={`url(#${clipId})`}>
          <path d={amberPath} fill={WARM} />
        </g>
      )}
      {hasBlue && (
        <g clipPath={`url(#${clipId})`}>
          <path d={bluePath} fill={COOL} />
          <line
            x1={0}
            y1={amberTop}
            x2={vbW}
            y2={amberTop}
            stroke={SURFACE}
            strokeWidth={2}
          />
        </g>
      )}
      <path
        d={path}
        fill="none"
        stroke={INK}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

const VaseAnnotations: React.FC<{
  cx: number;
  cy: number;
  vaseW: number;
  vaseH: number;
  layout: HeroLayout;
  opacity: number;
}> = ({ cx, cy, vaseW, vaseH, layout, opacity }) => {
  const isWide = layout === "wide";
  const labelDist = isWide ? 230 : 130;
  const amberY = cy + vaseH * 0.18;
  const blueY = cy - vaseH * 0.42;
  const vaseLeftX = cx - vaseW * 0.35;
  const vaseRightX = cx + vaseW * 0.35;

  return (
    <>
      <svg
        width={HERO_WIDTH}
        height={HERO_HEIGHT}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity,
        }}
      >
        <path
          d={`M ${vaseLeftX - labelDist + 30} ${amberY} Q ${vaseLeftX - labelDist / 2} ${amberY - 8} ${vaseLeftX - 10} ${amberY}`}
          fill="none"
          stroke={INK}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
        <path
          d={`M ${vaseLeftX - 22} ${amberY - 8} L ${vaseLeftX - 10} ${amberY} L ${vaseLeftX - 22} ${amberY + 8}`}
          fill="none"
          stroke={INK}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M ${vaseRightX + labelDist - 30} ${blueY} Q ${vaseRightX + labelDist / 2} ${blueY + 8} ${vaseRightX + 10} ${blueY}`}
          fill="none"
          stroke={INK}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
        <path
          d={`M ${vaseRightX + 22} ${blueY - 8} L ${vaseRightX + 10} ${blueY} L ${vaseRightX + 22} ${blueY + 8}`}
          fill="none"
          stroke={INK}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: vaseLeftX - labelDist - (isWide ? 220 : 130),
          top: amberY - 30,
          width: isWide ? 220 : 130,
          textAlign: "right",
          opacity,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: WARM_2,
            marginBottom: 4,
          }}
        >
          <span
            style={{ width: 10, height: 10, borderRadius: 3, background: WARM }}
          />
          Votre part
        </div>
        <div
          style={{
            fontSize: isWide ? 22 : 16,
            fontWeight: 700,
            color: INK,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Vos revenus
        </div>
        <div
          style={{
            fontSize: isWide ? 13 : 11,
            color: INK_2,
            marginTop: 4,
            letterSpacing: "-0.005em",
            lineHeight: 1.35,
          }}
        >
          Ce que vous gagnez pour votre travail.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: vaseRightX + labelDist,
          top: blueY - 30,
          width: isWide ? 240 : 140,
          textAlign: "left",
          opacity,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: COOL_2,
            marginBottom: 4,
          }}
        >
          <span
            style={{ width: 10, height: 10, borderRadius: 3, background: COOL }}
          />
          Au collectif
        </div>
        <div
          style={{
            fontSize: isWide ? 22 : 16,
            fontWeight: 700,
            color: INK,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Votre contribution
        </div>
        <div
          style={{
            fontSize: isWide ? 13 : 11,
            color: INK_2,
            marginTop: 4,
            letterSpacing: "-0.005em",
            lineHeight: 1.35,
          }}
        >
          Ce qui fait grandir la communauté.
        </div>
      </div>
    </>
  );
};

/* ==========================================================================
 * Scene 7 · Dark finale — Caveat wordmark from brand navbar
 * ========================================================================== */

const SceneDarkFinale: React.FC<{
  localFrame: number;
  layout: HeroLayout;
}> = ({ localFrame, layout }) => {
  const { fps } = useVideoConfig();

  const darkOpacity = interpolate(
    localFrame,
    [0, 6, 56, 75],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const markIn = spring({ frame: localFrame - 5, fps, config: POP });
  const ctaOpacity = interpolate(
    localFrame,
    [16, 28, 56, 75],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const cy = HERO_HEIGHT / 2;

  return (
    <>
      <AbsoluteFill
        style={{ backgroundColor: INK_BLACK, opacity: darkOpacity }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: cy - 40,
          transform: `translate(-50%, -50%) scale(${markIn})`,
          opacity: markIn * darkOpacity,
        }}
      >
        <CaveatWordmark size={layout === "wide" ? 140 : 100} />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: cy + 80,
          transform: "translate(-50%, 0)",
          textAlign: "center",
          color: "white",
          opacity: ctaOpacity,
        }}
      >
        <div
          style={{
            fontSize: layout === "wide" ? 30 : 22,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "rgba(255,255,255,0.92)",
          }}
        >
          Rejoignez la communauté.
        </div>
      </div>
    </>
  );
};

const CaveatWordmark: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      display: "inline-block",
      fontFamily: "var(--font-caveat), 'Caveat', cursive",
      fontSize: size,
      fontWeight: 700,
      color: "white",
      lineHeight: 1,
      letterSpacing: "-0.005em",
      transform: "rotate(-4deg)",
      transformOrigin: "50% 60%",
      textShadow: "0 4px 30px rgba(255,255,255,0.15)",
    }}
  >
    darso
  </div>
);

/* ---------- Utility ---------- */

function cubicBezier(
  [p1x, p1y, p2x, p2y]: [number, number, number, number],
  t: number,
): number {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;
  const sampleX = (u: number) => ((ax * u + bx) * u + cx) * u;
  const sampleY = (u: number) => ((ay * u + by) * u + cy) * u;
  const sampleDx = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  let u = t;
  for (let i = 0; i < 6; i++) {
    const x = sampleX(u) - t;
    const dx = sampleDx(u);
    if (Math.abs(dx) < 1e-6) break;
    u = u - x / dx;
    if (u < 0) u = 0;
    if (u > 1) u = 1;
  }
  return sampleY(u);
}
