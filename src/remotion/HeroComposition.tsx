import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* --------------------------------------------------------------------------
 * Darso — Hero composition
 * Palette: charcoal (#1C1F26) + electric blue (#2F6FEB) + white. No gradients.
 * Four scenes, 4s each, crossfaded seams, seamless loop back to Scene 1.
 * -------------------------------------------------------------------------- */

export const HERO_WIDTH = 1200;
export const HERO_HEIGHT = 900;
export const HERO_FPS = 30;
export const HERO_DURATION = 480; // 16s

const ACCENT = "#4E88F5";
const ACCENT_SOFT = "rgba(78, 136, 245, 0.22)";
const HAIRLINE = "rgba(255, 255, 255, 0.10)";
const HAIRLINE_STRONG = "rgba(255, 255, 255, 0.22)";
const BG = "#0E1116";
const SURFACE = "#191C22";
const INK = "#F4F6FA";
const INK_2 = "#B8BEC9";
const GRID = "rgba(255, 255, 255, 0.05)";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Global scene windows (in frames at 30fps). */
const S1 = { start: 0, end: 120 };
const S2 = { start: 120, end: 240 };
const S3 = { start: 240, end: 360 };
const S4 = { start: 360, end: 480 };
const FADE = 22; // crossfade window between scenes

/** Fade in/out envelope for a scene given the global frame. */
function sceneOpacity(frame: number, start: number, end: number) {
  const enter = interpolate(frame, [start - FADE, start + FADE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(frame, [end - FADE, end + FADE], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(enter, exit);
}

export const HeroComposition: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: "Inter, sans-serif" }}>
      <BackgroundGrid />
      <BackgroundRule />
      {frame < S1.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S1.start, S1.end) }}>
          <SceneConstellation localFrame={frame - S1.start} />
        </AbsoluteFill>
      )}
      {frame > S2.start - FADE && frame < S2.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S2.start, S2.end) }}>
          <SceneWaveform localFrame={frame - S2.start} />
        </AbsoluteFill>
      )}
      {frame > S3.start - FADE && frame < S3.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S3.start, S3.end) }}>
          <SceneAcademics localFrame={frame - S3.start} />
        </AbsoluteFill>
      )}
      {frame > S4.start - FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S4.start, S4.end + FADE) }}>
          <SceneEcosystem localFrame={frame - S4.start} />
        </AbsoluteFill>
      )}
      <SceneLabels />
      <Foreground />
    </AbsoluteFill>
  );
};

/* ---------- Background ---------- */

const BackgroundGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, HERO_DURATION], [0, -60]);
  return (
    <AbsoluteFill
      style={{
        opacity: 0.9,
        backgroundImage: `
          linear-gradient(to right, ${GRID} 1px, transparent 1px),
          linear-gradient(to bottom, ${GRID} 1px, transparent 1px)
        `,
        backgroundSize: "56px 56px",
        transform: `translate3d(${drift}px, 0, 0)`,
      }}
    />
  );
};

const BackgroundRule: React.FC = () => {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [10, 60], [0, HERO_WIDTH * 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => cubicBezier(EASE_OUT, t),
  });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: HERO_HEIGHT * 0.5,
          height: 3,
          width,
          background: ACCENT,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: HERO_HEIGHT * 0.5 - 28,
          fontSize: 11,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: INK_2,
          opacity: interpolate(frame, [30, 70], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        darso · l'écosystème
      </div>
    </>
  );
};

/* ---------- Scene 1 · Constellation ---------- */

const CONSTELLATION_ICONS = [
  { x: 0.18, y: 0.32, kind: "note" as const },
  { x: 0.34, y: 0.22, kind: "aperture" as const },
  { x: 0.52, y: 0.30, kind: "book" as const },
  { x: 0.70, y: 0.20, kind: "atom" as const },
  { x: 0.86, y: 0.28, kind: "cursor" as const },
];

const SceneConstellation: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {CONSTELLATION_ICONS.map((icon, i) => {
        const delay = 8 + i * 10;
        const rise = spring({
          frame: localFrame - delay,
          fps,
          config: { damping: 22, stiffness: 90, mass: 0.9 },
        });
        const y = interpolate(rise, [0, 1], [50, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: icon.x * HERO_WIDTH,
              top: icon.y * HERO_HEIGHT,
              transform: `translate3d(-50%, calc(-50% + ${y}px), 0)`,
              opacity: rise,
            }}
          >
            <IconChip kind={icon.kind} glow={rise} />
          </div>
        );
      })}
    </>
  );
};

/* ---------- Scene 2 · Waveform ---------- */

const SceneWaveform: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const { fps } = useVideoConfig();

  const bars = 44;
  const centerX = HERO_WIDTH * 0.5;
  const centerY = HERO_HEIGHT * 0.52;
  const gap = 12;
  const totalWidth = bars * gap;

  return (
    <>
      <svg
        width={HERO_WIDTH}
        height={HERO_HEIGHT}
        style={{ position: "absolute", inset: 0 }}
        viewBox={`0 0 ${HERO_WIDTH} ${HERO_HEIGHT}`}
      >
        <path
          d={`M ${centerX - 220} ${centerY - 40} Q ${centerX} ${centerY - 200} ${centerX + 220} ${centerY - 40}`}
          fill="none"
          stroke={INK}
          strokeWidth={2.4}
          strokeLinecap="round"
          opacity={interpolate(localFrame, [10, 40], [0, 0.85], { extrapolateRight: "clamp" })}
        />
        <rect
          x={centerX - 240}
          y={centerY - 60}
          width={40}
          height={90}
          rx={12}
          fill={INK}
          opacity={interpolate(localFrame, [15, 45], [0, 0.9], { extrapolateRight: "clamp" })}
        />
        <rect
          x={centerX + 200}
          y={centerY - 60}
          width={40}
          height={90}
          rx={12}
          fill={INK}
          opacity={interpolate(localFrame, [15, 45], [0, 0.9], { extrapolateRight: "clamp" })}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: centerX - totalWidth / 2,
          top: centerY + 40,
          display: "flex",
          alignItems: "flex-end",
          gap: `${gap - 4}px`,
          height: 160,
        }}
      >
        {Array.from({ length: bars }).map((_, i) => {
          const wave =
            Math.sin(localFrame * 0.18 + i * 0.5) * 0.4 +
            Math.sin(localFrame * 0.09 + i * 0.2) * 0.6;
          const baseH = 20 + Math.abs(wave) * 120;
          const enterBar = interpolate(localFrame, [i * 1.0, 24 + i * 1.0], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const isAccent = i % 5 === 0;
          return (
            <div
              key={i}
              style={{
                width: 4,
                height: baseH * enterBar,
                background: isAccent ? ACCENT : INK,
                borderRadius: 2,
                opacity: 0.85,
              }}
            />
          );
        })}
      </div>

      {/* Timeline scrubber */}
      <div
        style={{
          position: "absolute",
          left: centerX - totalWidth / 2,
          top: centerY + 220,
          width: totalWidth,
          height: 2,
          background: HAIRLINE_STRONG,
          borderRadius: 1,
        }}
      >
        <div
          style={{
            height: 2,
            width: `${interpolate(localFrame, [24, 110], [0, 100], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}%`,
            background: ACCENT,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -5,
            left: `${interpolate(localFrame, [24, 110], [0, 100], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}%`,
            width: 12,
            height: 12,
            borderRadius: 6,
            background: ACCENT,
            transform: "translateX(-50%)",
          }}
        />
      </div>

      {/* Section label */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: HERO_HEIGHT - 160,
          fontSize: 12,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: INK_2,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: interpolate(localFrame, [20, 50], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <span style={{ width: 24, height: 2, background: ACCENT, display: "inline-block" }} />
        Musique · Production · Montage
      </div>
    </>
  );
};

/* ---------- Scene 3 · Academics ---------- */

const SceneAcademics: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const { fps } = useVideoConfig();

  const centerX = HERO_WIDTH * 0.42;
  const stackTop = HERO_HEIGHT * 0.36;

  const books = [
    { w: 260, h: 42, color: INK, delay: 6 },
    { w: 300, h: 42, color: ACCENT, delay: 14 },
    { w: 240, h: 42, color: INK, delay: 22 },
    { w: 320, h: 56, color: INK_2, delay: 30 },
  ];

  return (
    <>
      {books.map((b, i) => {
        const bounce = spring({
          frame: localFrame - b.delay,
          fps,
          config: { damping: 16, stiffness: 110 },
        });
        const y = stackTop + i * 48;
        const xOffset = interpolate(bounce, [0, 1], [40, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: centerX - b.w / 2 + xOffset,
              top: y,
              width: b.w * bounce,
              height: b.h,
              background: b.color,
              borderRadius: 4,
              boxShadow: `0 6px 12px -6px ${HAIRLINE_STRONG}`,
            }}
          />
        );
      })}

      <SpeechBubble
        x={HERO_WIDTH * 0.66}
        y={HERO_HEIGHT * 0.38}
        appearFrame={40}
        localFrame={localFrame}
      />

      <div
        style={{
          position: "absolute",
          left: centerX - 130,
          top: stackTop + books.length * 48 + 32,
          fontSize: 12,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: INK_2,
          opacity: interpolate(localFrame, [60, 90], [0, 1], { extrapolateRight: "clamp" }),
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ width: 24, height: 2, background: ACCENT, display: "inline-block" }} />
        Scolarité · Langues
      </div>
    </>
  );
};

const SpeechBubble: React.FC<{
  x: number;
  y: number;
  appearFrame: number;
  localFrame: number;
}> = ({ x, y, appearFrame, localFrame }) => {
  const enter = interpolate(localFrame, [appearFrame, appearFrame + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => cubicBezier(EASE_OUT, t),
  });
  const chips = ["Bonjour", "مرحبا", "Hello", "Salam"];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 300,
        transform: `translate3d(-50%, -50%, 0) scale(${0.9 + enter * 0.1})`,
        opacity: enter,
      }}
    >
      <div
        style={{
          background: SURFACE,
          border: `1.5px solid ${INK}`,
          borderRadius: 20,
          padding: "22px 24px",
          position: "relative",
          boxShadow: `0 12px 28px -12px ${HAIRLINE_STRONG}`,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {chips.map((chip, i) => {
            const chipIn = interpolate(
              localFrame,
              [appearFrame + 12 + i * 8, appearFrame + 32 + i * 8],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <span
                key={chip}
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: i === 1 ? ACCENT : INK,
                  padding: "6px 12px",
                  border: `1px solid ${i === 1 ? ACCENT : HAIRLINE_STRONG}`,
                  borderRadius: 999,
                  opacity: chipIn,
                  transform: `translateY(${(1 - chipIn) * 8}px)`,
                }}
              >
                {chip}
              </span>
            );
          })}
        </div>
        <svg
          width={20}
          height={16}
          style={{ position: "absolute", bottom: -14, left: 40 }}
          viewBox="0 0 20 16"
        >
          <path d="M 0 0 L 20 0 L 6 14 Z" fill={SURFACE} stroke={INK} strokeWidth={1.5} />
          <path d="M 1 0.5 L 19 0.5" stroke={SURFACE} strokeWidth={2} />
        </svg>
      </div>
    </div>
  );
};

/* ---------- Scene 4 · Ecosystem ---------- */

const ECOSYSTEM: { angle: number; radius: number; kind: IconKind }[] = [
  { angle: -90, radius: 200, kind: "note" },
  { angle: -30, radius: 210, kind: "aperture" },
  { angle: 30, radius: 200, kind: "book" },
  { angle: 90, radius: 210, kind: "atom" },
  { angle: 150, radius: 200, kind: "cursor" },
  { angle: 210, radius: 210, kind: "brush" },
];

const SceneEcosystem: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const { fps } = useVideoConfig();
  const centerX = HERO_WIDTH * 0.5;
  const centerY = HERO_HEIGHT * 0.5;

  const rotate = interpolate(localFrame, [0, 120], [-6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => cubicBezier(EASE_OUT, t),
  });

  return (
    <>
      {/* Ripple rings from center */}
      {[0, 22, 44, 66].map((delay, i) => {
        const rippleFrame = localFrame - delay;
        const r = interpolate(rippleFrame, [0, 90], [0, 320], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const alpha = interpolate(rippleFrame, [0, 30, 90], [0, 0.35, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: centerX,
              top: centerY,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              border: `1.5px solid ${ACCENT}`,
              opacity: alpha,
              transform: `translate(-50%, -50%)`,
            }}
          />
        );
      })}

      {/* Center dot */}
      <div
        style={{
          position: "absolute",
          left: centerX,
          top: centerY,
          width: 22,
          height: 22,
          borderRadius: 11,
          background: ACCENT,
          transform: "translate(-50%, -50%)",
          boxShadow: `0 0 0 8px ${ACCENT_SOFT}`,
        }}
      />

      {/* Icon orbit */}
      <div
        style={{
          position: "absolute",
          left: centerX,
          top: centerY,
          transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        }}
      >
        {ECOSYSTEM.map((n, i) => {
          const nodeIn = spring({
            frame: localFrame - 20 - i * 6,
            fps,
            config: { damping: 22, stiffness: 90 },
          });
          const rad = (n.angle * Math.PI) / 180;
          const nx = Math.cos(rad) * n.radius * nodeIn;
          const ny = Math.sin(rad) * n.radius * nodeIn;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: nx,
                top: ny,
                transform: `translate(-50%, -50%) rotate(${-rotate}deg)`,
                opacity: nodeIn,
              }}
            >
              <IconChip kind={n.kind} glow={1} />
            </div>
          );
        })}

        <svg
          width={520}
          height={520}
          style={{ position: "absolute", left: -260, top: -260, pointerEvents: "none" }}
        >
          {ECOSYSTEM.map((n, i) => {
            const rad = (n.angle * Math.PI) / 180;
            const nodeIn = spring({
              frame: localFrame - 20 - i * 6,
              fps,
              config: { damping: 22, stiffness: 90 },
            });
            return (
              <line
                key={i}
                x1={260}
                y1={260}
                x2={260 + Math.cos(rad) * n.radius * nodeIn}
                y2={260 + Math.sin(rad) * n.radius * nodeIn}
                stroke={HAIRLINE}
                strokeWidth={1}
                strokeDasharray="3 6"
                opacity={nodeIn * 0.9}
              />
            );
          })}
        </svg>
      </div>
    </>
  );
};

/* ---------- Persistent labels ---------- */

const SceneLabels: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [30, 70], [0, 1], { extrapolateRight: "clamp" });
  // Corners are carved by the container mask, so keep meta labels ≥ 200px
  // from the top-left and bottom-right of the composition.
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 220,
          fontSize: 12,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: INK,
          opacity,
        }}
      >
        01 · vidéo darso
      </div>
      <div
        style={{
          position: "absolute",
          top: 56,
          right: 80,
          fontSize: 12,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: INK_2,
          opacity,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 4.5,
            background: "#D3352E",
            display: "inline-block",
          }}
        />
        en direct
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 56,
          left: 80,
          fontSize: 12,
          fontFeatureSettings: '"tnum" 1',
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: INK,
          opacity,
        }}
      >
        1200 × 900 · 30 fps
      </div>
    </>
  );
};

/* ---------- Foreground vignette ---------- */

const Foreground: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      boxShadow: `inset 0 0 200px rgba(10, 11, 14, 0.05)`,
    }}
  />
);

/* ---------- Icon primitive ---------- */

type IconKind = "note" | "aperture" | "book" | "atom" | "cursor" | "brush";

const IconChip: React.FC<{ kind: IconKind; glow: number }> = ({ kind, glow }) => {
  return (
    <div
      style={{
        width: 74,
        height: 74,
        borderRadius: 20,
        background: SURFACE,
        border: `1.5px solid ${INK}`,
        display: "grid",
        placeItems: "center",
        boxShadow: `0 12px 28px -14px ${HAIRLINE_STRONG}, 0 0 0 ${8 * glow}px ${ACCENT_SOFT}`,
      }}
    >
      <IconGlyph kind={kind} />
    </div>
  );
};

const IconGlyph: React.FC<{ kind: IconKind }> = ({ kind }) => {
  const s = 30;
  const stroke = INK;
  const sw = 1.9;
  const accent = ACCENT;

  switch (kind) {
    case "note":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M9 18V5l10-2v13" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={6} cy={18} r={3} fill={accent} />
          <circle cx={16} cy={16} r={3} fill={stroke} />
        </svg>
      );
    case "aperture":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx={12} cy={12} r={9} stroke={stroke} strokeWidth={sw} />
          <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4"
            stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <circle cx={12} cy={12} r={2.5} fill={accent} />
        </svg>
      );
    case "book":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M4 5.5C4 4.67 4.67 4 5.5 4H12v16H5.5A1.5 1.5 0 014 18.5v-13z"
            stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M20 5.5C20 4.67 19.33 4 18.5 4H12v16h6.5a1.5 1.5 0 001.5-1.5v-13z"
            stroke={stroke} strokeWidth={sw} strokeLinejoin="round" fill={accent} fillOpacity={0.14} />
        </svg>
      );
    case "atom":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <ellipse cx={12} cy={12} rx={10} ry={4} stroke={stroke} strokeWidth={sw} />
          <ellipse cx={12} cy={12} rx={10} ry={4} stroke={stroke} strokeWidth={sw} transform="rotate(60 12 12)" />
          <ellipse cx={12} cy={12} rx={10} ry={4} stroke={stroke} strokeWidth={sw} transform="rotate(-60 12 12)" />
          <circle cx={12} cy={12} r={2} fill={accent} />
        </svg>
      );
    case "cursor":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M5 3l6 16 2.5-6.5L20 10 5 3z" fill={stroke} />
          <path d="M13.5 12.5L20 19" stroke={accent} strokeWidth={2.4} strokeLinecap="round" />
        </svg>
      );
    case "brush":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M14 3l7 7-9 9-4.5-4.5L14 3z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" fill={accent} fillOpacity={0.18} />
          <path d="M3 21c2-1 3-2 4-4l-4-2v6z" fill={stroke} />
        </svg>
      );
  }
};

/* ---------- utility ---------- */

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
