import { useId } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* --------------------------------------------------------------------------
 * Darso — Hero composition · "The Value Loop" (v5)
 *
 * 780 frames · 26s @ 30fps · seamless loop
 *   1 · Browse            (0–135)   iPhone 16 Pro, typing search, dropdown
 *   2 · Cards             (135–285) 5-lesson deck deals in, holds, drops out
 *   3 · Calendar          (285–405) weekly (wide) or 3-day rolling (compact)
 *   4 · Vase              (405–585) fills amber to 90%, then blue top 10%,
 *                                   labelled arrows explain the split
 *   5 · Faces             (585–690) two minimalist silhouettes + sine link
 *   6 · Dark finale       (690–780) black canvas, Caveat wordmark, CTA hold
 * -------------------------------------------------------------------------- */

export const HERO_WIDTH = 1600;
export const HERO_HEIGHT = 1000;
export const HERO_FPS = 30;
export const HERO_DURATION = 780;
export type HeroLayout = "wide" | "compact";

/* ---------- Palette ---------- */

const BG = "#F7F7F5";
const SURFACE = "#FFFFFF";
const SURFACE_2 = "#F1F1EC";
const HAIRLINE = "rgba(14, 17, 22, 0.09)";
const INK = "#0E1116";
const INK_2 = "#5A6070";
const INK_3 = "#8F949E";
const INK_BLACK = "#111111";

const COOL = "#4E88F5";
const COOL_2 = "#2F6FEB";
const COOL_SOFT = "rgba(47, 111, 235, 0.14)";

const WARM = "#F0A014";
const WARM_2 = "#D48604";
const WARM_SOFT = "rgba(240, 160, 20, 0.18)";
const WARM_GHOST = "rgba(240, 160, 20, 0.15)";

const PLATFORM = "#8C7A4A";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ---------- Springs (elastic, generous overshoot) ---------- */

const ELASTIC = { damping: 10, stiffness: 140, mass: 0.9 } as const;
const ELASTIC_SOFT = { damping: 14, stiffness: 110, mass: 0.9 } as const;
const SETTLE = { damping: 22, stiffness: 100 } as const;
const POP = { damping: 12, stiffness: 170, mass: 0.9 } as const;

/* ---------- Scene windows ---------- */

const S1 = { start: 0, end: 135 };
const S2 = { start: 135, end: 285 };
const S3 = { start: 285, end: 405 };
const S4 = { start: 405, end: 585 };
const S5 = { start: 585, end: 690 };
const S6 = { start: 690, end: 780 };
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

/* ---------- Root ---------- */

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
          <SceneBrowse localFrame={frame - S1.start} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S2.start - FADE && frame < S2.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S2.start, S2.end) }}>
          <SceneCards localFrame={frame - S2.start} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S3.start - FADE && frame < S3.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S3.start, S3.end) }}>
          <SceneCalendar localFrame={frame - S3.start} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S4.start - FADE && frame < S4.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S4.start, S4.end) }}>
          <SceneVase localFrame={frame - S4.start} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S5.start - FADE && frame < S5.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S5.start, S5.end) }}>
          <SceneFaces localFrame={frame - S5.start} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S6.start - FADE && (
        <AbsoluteFill
          style={{ opacity: sceneOpacity(frame, S6.start, S6.end, 8) }}
        >
          <SceneDarkFinale localFrame={frame - S6.start} layout={layout} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ---------- Paper grain (below scenes) ---------- */

const PaperGrain: React.FC = () => (
  <svg
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      mixBlendMode: "multiply",
      opacity: 0.55,
    }}
    aria-hidden
  >
    <defs>
      <filter id="paperNoise" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
        <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0.10 0" />
      </filter>
    </defs>
    <rect width="100%" height="100%" filter="url(#paperNoise)" />
  </svg>
);

/* ---------- Hand-inked primitives ---------- */

const InkedRect: React.FC<{
  width: number;
  height: number;
  radius?: number;
  fill?: string;
  stroke?: string;
  strokeMid?: number;
  strokeCorner?: number;
  overshoot?: number;
  shadow?: string;
}> = ({
  width,
  height,
  radius = 26,
  fill = SURFACE,
  stroke = INK,
  strokeMid = 1.7,
  strokeCorner = 2.5,
  overshoot = 3,
  shadow,
}) => {
  const w = width;
  const h = height;
  const r = Math.min(radius, w / 2, h / 2);
  const o = overshoot;
  const body = `M ${r} 0 L ${w - r} 0 Q ${w} 0 ${w} ${r} L ${w} ${h - r} Q ${w} ${h} ${w - r} ${h} L ${r} ${h} Q 0 ${h} 0 ${h - r} L 0 ${r} Q 0 0 ${r} 0 Z`;
  return (
    <svg
      viewBox={`${-6} ${-6} ${w + 12} ${h + 12}`}
      width={w}
      height={h}
      style={{ overflow: "visible", filter: shadow ? `drop-shadow(${shadow})` : undefined }}
    >
      <path d={body} fill={fill} />
      <path d={`M ${r - o} 0 L ${w - r + o} 0`} stroke={stroke} strokeWidth={strokeMid} strokeLinecap="round" fill="none" />
      <path d={`M ${w} ${r - o} L ${w} ${h - r + o}`} stroke={stroke} strokeWidth={strokeMid} strokeLinecap="round" fill="none" />
      <path d={`M ${w - r + o} ${h} L ${r - o} ${h}`} stroke={stroke} strokeWidth={strokeMid} strokeLinecap="round" fill="none" />
      <path d={`M 0 ${h - r + o} L 0 ${r - o}`} stroke={stroke} strokeWidth={strokeMid} strokeLinecap="round" fill="none" />
      <path d={`M ${r} 0 Q 0 0 0 ${r}`} stroke={stroke} strokeWidth={strokeCorner} strokeLinecap="round" fill="none" />
      <path d={`M ${w - r} 0 Q ${w} 0 ${w} ${r}`} stroke={stroke} strokeWidth={strokeCorner} strokeLinecap="round" fill="none" />
      <path d={`M ${w} ${h - r} Q ${w} ${h} ${w - r} ${h}`} stroke={stroke} strokeWidth={strokeCorner} strokeLinecap="round" fill="none" />
      <path d={`M ${r} ${h} Q 0 ${h} 0 ${h - r}`} stroke={stroke} strokeWidth={strokeCorner} strokeLinecap="round" fill="none" />
    </svg>
  );
};

const InkedCircle: React.FC<{
  size: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  shadow?: string;
}> = ({ size, fill = SURFACE, stroke = INK, strokeWidth = 2.4, shadow }) => {
  const r = size / 2;
  return (
    <svg
      viewBox={`${-6} ${-6} ${size + 12} ${size + 12}`}
      width={size}
      height={size}
      style={{ overflow: "visible", filter: shadow ? `drop-shadow(${shadow})` : undefined }}
    >
      <circle cx={r} cy={r} r={r} fill={fill} />
      <path d={`M 0 ${r} A ${r} ${r - 0.5} 0 0 1 ${size} ${r}`} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d={`M ${size} ${r} A ${r - 0.4} ${r} 0 0 1 0 ${r}`} fill="none" stroke={stroke} strokeWidth={strokeWidth - 0.2} strokeLinecap="round" />
    </svg>
  );
};

/* ==========================================================================
 * Scene 1 · Browse — iPhone 16 Pro, typing search, dropdown, teacher card
 * ========================================================================== */

const SEARCH_TARGET = "Cours de...";
const SEARCH_SUGGESTIONS = [
  "Cours de langues",
  "Cours de piano",
  "Cours de développement",
];

// Local frames (135 total)
const T1_CURSOR_APPEARS = 32;
const T1_TYPING_START = 52;
const T1_TYPING_PER_CHAR = 3;
const T1_TYPING_END = T1_TYPING_START + SEARCH_TARGET.length * T1_TYPING_PER_CHAR; // 52 + 33 = 85
const T1_DROPDOWN_OPEN = 90;
const T1_SELECT_LANGUES = 108;
const T1_CARD_LANDS = 122;

const SceneBrowse: React.FC<{ localFrame: number; layout: HeroLayout }> = ({
  localFrame,
  layout,
}) => {
  const { fps } = useVideoConfig();

  const phoneIn = spring({ frame: localFrame, fps, config: ELASTIC_SOFT });
  const phoneY = interpolate(phoneIn, [0, 1], [90, 0]);
  const phoneScale = 0.9 + phoneIn * 0.1;

  const headingIn = spring({ frame: localFrame - 10, fps, config: SETTLE });
  const searchIn = spring({ frame: localFrame - 18, fps, config: SETTLE });

  const cursorVisible = (() => {
    if (localFrame < T1_CURSOR_APPEARS) return false;
    if (localFrame < T1_TYPING_START) {
      const t = localFrame - T1_CURSOR_APPEARS;
      return t % 12 < 6;
    }
    return true;
  })();

  const typedCount = Math.max(
    0,
    Math.min(
      SEARCH_TARGET.length,
      Math.floor((localFrame - T1_TYPING_START) / T1_TYPING_PER_CHAR),
    ),
  );
  const typedText = SEARCH_TARGET.slice(0, typedCount);
  const showPlaceholder = typedCount === 0 && localFrame < T1_TYPING_START;

  const dropdownOpen = spring({
    frame: localFrame - T1_DROPDOWN_OPEN,
    fps,
    config: SETTLE,
  });
  const dropdownFade = interpolate(
    localFrame,
    [T1_SELECT_LANGUES + 4, T1_SELECT_LANGUES + 18],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const langHighlight = interpolate(
    localFrame,
    [T1_SELECT_LANGUES, T1_SELECT_LANGUES + 14],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const cardSpring = spring({
    frame: localFrame - T1_CARD_LANDS,
    fps,
    config: ELASTIC_SOFT,
  });
  const cardY = interpolate(cardSpring, [0, 1], [180, 0]);
  const cardScale = 0.94 + cardSpring * 0.06;
  const pulse =
    cardSpring > 0.5 ? 1 + Math.sin((localFrame - T1_CARD_LANDS) * 0.34) * 0.04 : 1;

  // Deliberately shorter than the composition height — protects against
  // vertical crop on short/wide desktop containers.
  const phoneW = layout === "wide" ? 350 : 400;
  const phoneH = layout === "wide" ? 560 : 660;
  const cx = HERO_WIDTH / 2;
  const cy = HERO_HEIGHT / 2;
  const innerW = phoneW - 44;

  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        width: phoneW,
        height: phoneH,
        transform: `translate(-50%, calc(-50% + ${phoneY}px)) scale(${phoneScale})`,
        opacity: phoneIn,
      }}
    >
      <IPhoneFrame width={phoneW} height={phoneH}>
        {/* Heading row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            opacity: headingIn,
            transform: `translateY(${(1 - headingIn) * 10}px)`,
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>
            Explorer
          </div>
          <div style={{ position: "relative", width: 32, height: 32 }}>
            <InkedCircle size={32} fill={SURFACE_2} strokeWidth={1.6} />
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <SearchGlyph size={13} color={INK_2} />
            </div>
          </div>
        </div>

        {/* Search input */}
        <div
          style={{
            marginTop: 12,
            opacity: searchIn,
            transform: `translateY(${(1 - searchIn) * 10}px)`,
            position: "relative",
          }}
        >
          <InkedRect
            width={innerW}
            height={46}
            radius={14}
            fill={SURFACE_2}
            strokeMid={1.1}
            strokeCorner={1.6}
            overshoot={2}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <SearchGlyph size={14} color={INK_2} />
            {showPlaceholder ? (
              <span
                style={{
                  color: INK_3,
                  fontSize: 13,
                  letterSpacing: "-0.005em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Quel cours vous intéresse ?
              </span>
            ) : (
              <span
                style={{
                  color: INK,
                  fontSize: 13,
                  letterSpacing: "-0.005em",
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {typedText}
                {cursorVisible && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: 16,
                      background: INK,
                      marginLeft: 1,
                      verticalAlign: "middle",
                    }}
                  />
                )}
              </span>
            )}
          </div>
        </div>

        {/* Dropdown suggestions */}
        {dropdownOpen > 0.01 && dropdownFade > 0.01 && (
          <div
            style={{
              marginTop: 8,
              position: "relative",
              transformOrigin: "top",
              transform: `scaleY(${dropdownOpen})`,
              opacity: dropdownFade,
            }}
          >
            <InkedRect
              width={innerW}
              height={124}
              radius={16}
              fill={SURFACE}
              strokeMid={1.1}
              strokeCorner={1.6}
              overshoot={2}
              shadow="0 10px 20px -12px rgba(14,17,22,0.14)"
            />
            <div style={{ position: "absolute", inset: 0, padding: 8 }}>
              {SEARCH_SUGGESTIONS.map((s, i) => {
                const rowIn = interpolate(
                  localFrame,
                  [T1_DROPDOWN_OPEN + i * 4, T1_DROPDOWN_OPEN + i * 4 + 10],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
                const isSelected = i === 0 && langHighlight > 0;
                return (
                  <div
                    key={s}
                    style={{
                      padding: "9px 14px",
                      borderRadius: 10,
                      background: isSelected
                        ? `rgba(47, 111, 235, ${0.10 * langHighlight})`
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      opacity: rowIn,
                      overflow: "hidden",
                    }}
                  >
                    <SearchGlyph size={12} color={INK_3} />
                    <span
                      style={{
                        fontSize: 12.5,
                        color: isSelected ? COOL_2 : INK_2,
                        fontWeight: isSelected ? 700 : 500,
                        letterSpacing: "-0.005em",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* "Langues" persistent row (padding & icon size tightened to prevent overflow) */}
        {langHighlight > 0.05 && (
          <div
            style={{
              marginTop: 12,
              position: "relative",
              opacity: langHighlight,
              transform: `translateY(${(1 - langHighlight) * 8}px)`,
              overflow: "hidden",
            }}
          >
            <InkedRect
              width={innerW}
              height={54}
              radius={14}
              fill={COOL_SOFT}
              stroke={COOL}
              strokeMid={1.4}
              strokeCorner={2}
              overshoot={2}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "0 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  color: INK,
                  letterSpacing: "-0.01em",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  minWidth: 0,
                }}
              >
                <span style={{ display: "inline-flex", flex: "0 0 auto" }}>
                  <CategoryIcon kind="globe" accent={COOL_2} size={17} />
                </span>
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Langues
                </span>
              </span>
              <span
                style={{ color: COOL_2, fontSize: 18, flex: "0 0 auto", marginLeft: 8 }}
              >
                ›
              </span>
            </div>
          </div>
        )}

        {/* Teacher card — more premium spacing & typography */}
        {cardSpring > 0.01 && (
          <div
            style={{
              position: "relative",
              transform: `translateY(${cardY}px) scale(${cardScale})`,
              opacity: cardSpring,
              marginTop: "auto",
              overflow: "hidden",
            }}
          >
            <InkedRect
              width={innerW}
              height={116}
              radius={20}
              fill={SURFACE}
              shadow="0 12px 24px -14px rgba(14,17,22,0.18)"
              overshoot={2}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 40,
                    height: 40,
                    flex: "0 0 40px",
                  }}
                >
                  <InkedCircle size={40} fill={COOL} strokeWidth={1.8} />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "grid",
                      placeItems: "center",
                      color: "white",
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    S
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
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
                      letterSpacing: "-0.005em",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Espagnol · 15+ ans d'expérience
                  </div>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    flex: "0 0 auto",
                  }}
                >
                  <StarIcon size={12} color={WARM_2} />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: INK_2,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    4,9
                  </span>
                </div>
              </div>
              <div style={{ position: "relative", height: 40 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `scale(${pulse})`,
                  }}
                >
                  <InkedRect
                    width={innerW - 32}
                    height={40}
                    radius={12}
                    fill={COOL}
                    stroke={COOL_2}
                    strokeMid={1.2}
                    strokeCorner={1.6}
                    overshoot={2}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                    color: "white",
                    fontSize: 13.5,
                    fontWeight: 700,
                    letterSpacing: "-0.005em",
                  }}
                >
                  Réserver
                </div>
              </div>
            </div>
          </div>
        )}
      </IPhoneFrame>
    </div>
  );
};

const IPhoneFrame: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ width, height, children }) => {
  const cornerR = Math.min(width * 0.14, 52);
  const islandW = Math.min(width * 0.32, 118);
  const islandH = Math.min(28, height * 0.045);
  const islandTop = 12;
  const islandX = width / 2 - islandW / 2;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        borderRadius: cornerR,
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <InkedRect
          width={width}
          height={height}
          radius={cornerR}
          fill={SURFACE}
          strokeMid={1.8}
          strokeCorner={2.6}
          overshoot={2.5}
          shadow="0 30px 50px -22px rgba(14,17,22,0.25)"
        />
      </div>
      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: islandTop,
          left: islandX,
          width: islandW,
          height: islandH,
          borderRadius: islandH / 2,
          background: INK,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: islandH * 0.4,
          paddingRight: islandH * 0.4,
        }}
      >
        <span
          style={{
            width: islandH * 0.28,
            height: islandH * 0.28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
          }}
        />
        <span
          style={{
            width: islandH * 0.22,
            height: islandH * 0.22,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
          }}
        />
      </div>
      {/* Side buttons */}
      <div style={{ position: "absolute", left: 0, top: height * 0.16, width: 3, height: height * 0.055, background: INK, borderRadius: 2 }} />
      <div style={{ position: "absolute", left: 0, top: height * 0.24, width: 3, height: height * 0.055, background: INK, borderRadius: 2 }} />
      <div style={{ position: "absolute", right: 0, top: height * 0.19, width: 3, height: height * 0.08, background: INK, borderRadius: 2 }} />
      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: islandTop + islandH + 18,
          paddingLeft: 22,
          paddingRight: 22,
          paddingBottom: 22,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ==========================================================================
 * Scene 2 · Cards — 5-lesson deck, dealt in, held, then gravity-dropped
 * ========================================================================== */

type LessonCardData = {
  subject: string;
  when: string;
  who: string;
  letter: string;
  tone: string;
  icon: "brush" | "note" | "code" | "globe";
  rating: string;
};

const LESSONS: LessonCardData[] = [
  { subject: "Espagnol", when: "Lun · 14h", who: "Sofia", letter: "S", tone: COOL, icon: "globe", rating: "4,9" },
  { subject: "Piano", when: "Mar · 10h", who: "Karim", letter: "K", tone: WARM, icon: "note", rating: "4,8" },
  { subject: "React", when: "Mer · 18h", who: "Yasmine", letter: "Y", tone: COOL, icon: "code", rating: "5,0" },
  { subject: "Illustration", when: "Jeu · 16h", who: "Amine", letter: "A", tone: WARM, icon: "brush", rating: "4,7" },
  { subject: "Anglais", when: "Ven · 11h", who: "Lina", letter: "L", tone: PLATFORM, icon: "globe", rating: "4,9" },
];

const CARDS_DEAL_AT = [12, 30, 48, 66, 84];
const CARDS_HOLD_END = 118; // hold all 5 cards fully in place until this local frame
const CARDS_DROP_START = 122;
const CARDS_DROP_STAGGER = 4;

const SceneCards: React.FC<{ localFrame: number; layout: HeroLayout }> = ({
  localFrame,
  layout,
}) => {
  const { fps } = useVideoConfig();

  const cardW = layout === "wide" ? 440 : 380;
  const cardH = layout === "wide" ? 118 : 108;
  const stackStep = layout === "wide" ? 38 : 34;
  const rotations = [-4.5, 3, -2, 4, -3.5];

  const cx = HERO_WIDTH / 2;
  const cy = HERO_HEIGHT / 2;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: cy - stackStep * (LESSONS.length - 1) * 0.6 - cardH * 0.7 - 26,
          transform: "translate(-50%, -100%)",
          fontSize: 12,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: INK_2,
          fontWeight: 700,
          opacity: interpolate(
            localFrame,
            [8, 26, CARDS_DROP_START - 6, CARDS_DROP_START + 6],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
          whiteSpace: "nowrap",
        }}
      >
        Un catalogue vivant
      </div>

      {LESSONS.map((lesson, i) => {
        const dealAt = CARDS_DEAL_AT[i];
        const enter = spring({ frame: localFrame - dealAt, fps, config: ELASTIC });
        const settledY =
          cy -
          ((LESSONS.length - 1) / 2) * stackStep * 0.6 +
          i * stackStep * 0.6;

        const dealRot = interpolate(enter, [0, 1], [rotations[i] - 8, rotations[i]]);
        const dealX = interpolate(enter, [0, 1], [420, 0]);
        const dealY = interpolate(enter, [0, 1], [220, 0]);
        const dealScale = 0.9 + enter * 0.1;

        const dropAt = CARDS_DROP_START + i * CARDS_DROP_STAGGER;
        const dropT = Math.max(0, localFrame - dropAt);
        const gravity = 6.5;
        const dropY = 0.5 * gravity * dropT * dropT;
        const dropRot = dropT > 0 ? dropT * 0.55 * (i % 2 === 0 ? 1 : -1) : 0;
        const dropOpacity = interpolate(dropT, [16, 26], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const ghost1 = spring({ frame: localFrame - dealAt - 3, fps, config: ELASTIC });
        const ghost2 = spring({ frame: localFrame - dealAt - 6, fps, config: ELASTIC });

        if (enter < 0.01) return null;

        const renderGhost = (e: number, alpha: number) => {
          const rDeg = interpolate(e, [0, 1], [rotations[i] - 8, rotations[i]]);
          const xOff = interpolate(e, [0, 1], [420, 0]);
          const yOff = interpolate(e, [0, 1], [220, 0]);
          const sc = 0.9 + e * 0.1;
          return (
            <div
              style={{
                position: "absolute",
                left: cx,
                top: settledY,
                width: cardW,
                height: cardH,
                transform: `translate(-50%, -50%) translate(${xOff}px, ${yOff}px) rotate(${rDeg}deg) scale(${sc})`,
                opacity: alpha,
                zIndex: i + 1,
              }}
            >
              <LessonCard width={cardW} height={cardH} lesson={lesson} tintOverride={WARM_GHOST} />
            </div>
          );
        };

        return (
          <div key={i}>
            {dropT === 0 && ghost2 > 0.01 && renderGhost(ghost2, 0.10)}
            {dropT === 0 && ghost1 > 0.01 && renderGhost(ghost1, 0.18)}
            <div
              style={{
                position: "absolute",
                left: cx,
                top: settledY,
                width: cardW,
                height: cardH,
                transform: `translate(-50%, -50%) translate(${dealX}px, ${dealY + dropY}px) rotate(${dealRot + dropRot}deg) scale(${dealScale})`,
                opacity: dropOpacity,
                zIndex: i + 1,
              }}
            >
              <LessonCard width={cardW} height={cardH} lesson={lesson} />
            </div>
          </div>
        );
      })}
    </>
  );
};

const LessonCard: React.FC<{
  width: number;
  height: number;
  lesson: LessonCardData;
  tintOverride?: string;
}> = ({ width, height, lesson, tintOverride }) => {
  const fillColor = tintOverride ?? SURFACE;
  const strokeColor = tintOverride ?? INK;
  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <InkedRect
        width={width}
        height={height}
        radius={22}
        fill={fillColor}
        stroke={strokeColor}
        shadow="0 14px 26px -16px rgba(14,17,22,0.28)"
        overshoot={2.5}
      />
      {!tintOverride && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "0 22px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", width: 46, height: 46, flex: "0 0 46px" }}>
            <InkedCircle size={46} fill={lesson.tone} strokeWidth={1.8} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                color: "white",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {lesson.letter}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: INK,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {lesson.subject}
            </div>
            <div
              style={{
                fontSize: 12,
                color: INK_2,
                marginTop: 3,
                letterSpacing: "-0.005em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {lesson.who} · {lesson.when}
            </div>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, flex: "0 0 auto" }}>
            <StarIcon size={13} color={WARM_2} />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: INK_2,
                letterSpacing: "-0.005em",
              }}
            >
              {lesson.rating}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Silence unused-index warning if we ever iterate CARDS_HOLD_END for pacing
void CARDS_HOLD_END;

/* ==========================================================================
 * Scene 3 · Calendar — weekly (wide) or 3-day rolling (compact)
 * ========================================================================== */

const WEEKLY_DAYS = ["LUN", "MAR", "MER", "JEU", "VEN"];
const ROLLING_DAYS = ["Aujourd'hui", "Demain", "Sam."];

type Booking = {
  col: number;
  row: number;
  label: string;
  time: string;
  delay: number;
};

const WEEKLY_BOOKINGS: Booking[] = [
  { col: 0, row: 1, label: "Espagnol", time: "14h", delay: 6 },
  { col: 1, row: 0, label: "Piano", time: "10h", delay: 14 },
  { col: 2, row: 2, label: "React", time: "18h", delay: 22 },
  { col: 3, row: 1, label: "Illustration", time: "16h", delay: 30 },
  { col: 4, row: 3, label: "Yoga", time: "9h", delay: 38 },
  { col: 2, row: 3, label: "Anglais", time: "20h", delay: 46 },
];

const ROLLING_BOOKINGS: Booking[] = [
  { col: 0, row: 0, label: "Espagnol", time: "14h", delay: 6 },
  { col: 1, row: 1, label: "Piano", time: "10h", delay: 16 },
  { col: 0, row: 2, label: "React", time: "18h", delay: 26 },
  { col: 2, row: 0, label: "Illustration", time: "16h", delay: 36 },
  { col: 1, row: 2, label: "Yoga", time: "9h", delay: 44 },
  { col: 2, row: 2, label: "Anglais", time: "20h", delay: 52 },
];

const SceneCalendar: React.FC<{ localFrame: number; layout: HeroLayout }> = ({
  localFrame,
  layout,
}) => {
  const { fps } = useVideoConfig();

  const frameIn = spring({ frame: localFrame, fps, config: ELASTIC_SOFT });
  const frameY = interpolate(frameIn, [0, 1], [60, 0]);
  const frameScale = 0.94 + frameIn * 0.06;

  const isRolling = layout === "compact";
  const days = isRolling ? ROLLING_DAYS : WEEKLY_DAYS;
  const bookings = isRolling ? ROLLING_BOOKINGS : WEEKLY_BOOKINGS;
  const rowCount = isRolling ? 3 : 4;

  const gridW = layout === "wide" ? 780 : 540;
  const gridH = layout === "wide" ? 500 : 620;
  const padX = 30;
  const padTop = 76;
  const padBottom = 30;
  const innerW = gridW - padX * 2;
  const innerH = gridH - padTop - padBottom;
  const cellW = innerW / days.length;
  const cellH = innerH / rowCount;

  const cx = HERO_WIDTH / 2;
  const cy = HERO_HEIGHT / 2;

  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        width: gridW,
        height: gridH,
        transform: `translate(-50%, calc(-50% + ${frameY}px)) scale(${frameScale})`,
        opacity: frameIn,
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <InkedRect
          width={gridW}
          height={gridH}
          radius={26}
          fill={SURFACE}
          shadow="0 26px 50px -22px rgba(14,17,22,0.20)"
          overshoot={2.5}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: padX,
          right: padX,
          top: 22,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: INK_2,
            fontWeight: 700,
          }}
        >
          {isRolling ? "Prochains cours" : "Ma semaine"}
        </div>
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: INK_3,
            fontWeight: 600,
          }}
        >
          {isRolling ? "3 jours" : "Semaine 42"}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: padX,
          top: 52,
          width: innerW,
          display: "flex",
        }}
      >
        {days.map((d, i) => (
          <div
            key={d}
            style={{
              width: cellW,
              textAlign: "center",
              fontSize: 12,
              letterSpacing: "0.14em",
              fontWeight: 700,
              color: i === 0 ? WARM_2 : INK_2,
              textTransform: "uppercase",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              padding: "0 4px",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <svg
        width={innerW}
        height={innerH}
        viewBox={`0 0 ${innerW} ${innerH}`}
        style={{
          position: "absolute",
          left: padX,
          top: padTop,
          overflow: "visible",
        }}
      >
        {Array.from({ length: rowCount + 1 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * cellH} x2={innerW} y2={i * cellH} stroke={HAIRLINE} strokeWidth={1} />
        ))}
        {Array.from({ length: days.length + 1 }).map((_, i) => (
          <line key={`v${i}`} x1={i * cellW} y1={0} x2={i * cellW} y2={innerH} stroke={HAIRLINE} strokeWidth={1} />
        ))}
        <rect x={0} y={0} width={cellW} height={innerH} fill={WARM_SOFT} opacity={0.5} />
      </svg>

      {bookings.map((b, i) => {
        const enter = spring({ frame: localFrame - b.delay, fps, config: POP });
        if (enter < 0.01) return null;
        const bx = padX + b.col * cellW + cellW * 0.5;
        const by = padTop + b.row * cellH + cellH * 0.5;
        const bw = cellW * 0.82;
        const bh = cellH * 0.78;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: bx,
              top: by,
              width: bw,
              height: bh,
              transform: `translate(-50%, -50%) scale(${enter})`,
              opacity: enter,
            }}
          >
            <WaveBlock width={bw} height={bh} localFrame={localFrame} label={b.label} time={b.time} />
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -34,
          textAlign: "center",
          fontSize: 12,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: INK_2,
          fontWeight: 700,
          opacity: interpolate(localFrame, [40, 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Un agenda qui prend vie
      </div>
    </div>
  );
};

const WaveBlock: React.FC<{
  width: number;
  height: number;
  localFrame: number;
  label: string;
  time: string;
}> = ({ width, height, localFrame, label, time }) => {
  const w = width * 0.7;
  const startX = width * 0.15;
  const midY = height * 0.58;
  const amp = height * 0.13;
  const steps = 14;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = startX + t * w;
    const y = midY + Math.sin(t * Math.PI * 3 + localFrame * 0.14) * amp;
    points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  const wavePath = points.join(" ");

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <InkedRect
        width={width}
        height={height}
        radius={12}
        fill={WARM_SOFT}
        stroke={WARM_2}
        strokeMid={1.1}
        strokeCorner={1.6}
        overshoot={1.5}
      />
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 10,
          right: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: INK,
            letterSpacing: "-0.005em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "70%",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: WARM_2,
            letterSpacing: "0.08em",
          }}
        >
          {time}
        </span>
      </div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path
          d={wavePath}
          fill="none"
          stroke={WARM_2}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.95}
        />
      </svg>
    </div>
  );
};

/* ==========================================================================
 * Scene 4 · Vase — amber 90% + blue top 10% + labelled arrows (180 f)
 * ========================================================================== */

// Local frames
const T4_TITLE_IN = 8;
const T4_FILL_START = 30;
const T4_AMBER_END = 100; // amber fills 0 → 90% over 30–100
const T4_BLUE_END = 130; // blue fills 90 → 100% over 100–130
const T4_ARROWS_IN = 132;
const T4_ARROWS_HOLD = 172;

const SceneVase: React.FC<{ localFrame: number; layout: HeroLayout }> = ({
  localFrame,
  layout,
}) => {
  const vaseH = layout === "wide" ? 300 : 250;
  const vaseW = vaseH * 0.78;
  const cx = HERO_WIDTH / 2;
  const cy = HERO_HEIGHT / 2 + 30;

  const titleIn = interpolate(localFrame, [T4_TITLE_IN, T4_TITLE_IN + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => cubicBezier(EASE_OUT, t),
  });
  const subIn = interpolate(localFrame, [T4_TITLE_IN + 10, T4_TITLE_IN + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => cubicBezier(EASE_OUT, t),
  });

  // Two-phase fill:
  //   amberPct 0 → 0.9 over T4_FILL_START → T4_AMBER_END
  //   bluePct 0 → 0.1 over T4_AMBER_END → T4_BLUE_END
  const amberPct = interpolate(
    localFrame,
    [T4_FILL_START, T4_AMBER_END],
    [0, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => cubicBezier(EASE_OUT, t) },
  );
  const bluePct = interpolate(
    localFrame,
    [T4_AMBER_END, T4_BLUE_END],
    [0, 0.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => cubicBezier(EASE_OUT, t) },
  );

  const arrowsIn = interpolate(
    localFrame,
    [T4_ARROWS_IN, T4_ARROWS_IN + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => cubicBezier(EASE_OUT, t) },
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

      {/* Amphora */}
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

      {/* Labelled arrows */}
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
  // Design in a 200×260 viewBox
  const vbW = 200;
  const vbH = 260;
  // The interior fillable range (bottom → just below rim)
  const interiorBottom = 246;
  const interiorTop = 12;
  const interiorSpan = interiorBottom - interiorTop; // 234

  // Fluid tops
  const amberTop = interiorBottom - amberPct * interiorSpan;
  const blueTop = interiorBottom - (amberPct + bluePct) * interiorSpan;

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

  // Wobbly fluid surface path — reused for both amber & blue tops
  const wave = (top: number) => {
    const steps = 10;
    const amp = 2.5;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = t * vbW;
      const y = top + Math.sin(t * Math.PI * 3 + localFrame * 0.18) * amp;
      pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    pts.push(`L ${vbW} ${vbH} L 0 ${vbH} Z`);
    return pts.join(" ");
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={clipId}>
          <path d={path} />
        </clipPath>
      </defs>
      {/* Vase body */}
      <path d={path} fill={SURFACE} />
      {/* Amber fill */}
      {amberPct > 0.01 && (
        <g clipPath={`url(#${clipId})`}>
          <path d={wave(amberTop)} fill={WARM} />
        </g>
      )}
      {/* Blue top 10% (drawn above amber, only up to blueTop) */}
      {bluePct > 0.01 && (
        <g clipPath={`url(#${clipId})`}>
          <path d={wave(blueTop)} fill={COOL} />
          {/* thin crisp separator between amber & blue */}
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
      {/* Vase outline drawn on top */}
      <path
        d={path}
        fill="none"
        stroke={INK}
        strokeWidth={2.4}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Handful highlight tick on left belly */}
      <path
        d="M 32 130 Q 34 150 32 170"
        fill="none"
        stroke={INK}
        strokeWidth={1.2}
        strokeLinecap="round"
        opacity={0.35}
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
  // Arrow lines anchor to the vase and stretch outward to text labels
  const isWide = layout === "wide";
  const labelDist = isWide ? 240 : 140;
  const amberY = cy + vaseH * 0.18;
  const blueY = cy - vaseH * 0.42;
  const vaseLeftX = cx - vaseW * 0.35;
  const vaseRightX = cx + vaseW * 0.35;

  return (
    <>
      <svg
        width={HERO_WIDTH}
        height={HERO_HEIGHT}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}
      >
        {/* Left arrow — points into amber portion */}
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
        {/* Right arrow — points into blue portion */}
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

      {/* Left label — Vos revenus */}
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
          <span style={{ width: 10, height: 10, borderRadius: 3, background: WARM }} />
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

      {/* Right label — Votre contribution */}
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
          <span style={{ width: 10, height: 10, borderRadius: 3, background: COOL }} />
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

// Silence unused (kept for future use)
void T4_ARROWS_HOLD;

/* ==========================================================================
 * Scene 5 · Faces — minimalist bust silhouettes + sine link (105 f)
 * ========================================================================== */

const SceneFaces: React.FC<{ localFrame: number; layout: HeroLayout }> = ({
  localFrame,
  layout,
}) => {
  const { fps } = useVideoConfig();

  const leftIn = spring({ frame: localFrame, fps, config: ELASTIC });
  const rightIn = spring({ frame: localFrame - 10, fps, config: ELASTIC });
  const lineDraw = interpolate(localFrame, [26, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => cubicBezier(EASE_OUT, t),
  });

  const profileSize = layout === "wide" ? 200 : 160;
  const gap = layout === "wide" ? 260 : 200;
  const cy = HERO_HEIGHT / 2;
  const leftX = HERO_WIDTH / 2 - gap;
  const rightX = HERO_WIDTH / 2 + gap;

  const waveStartX = leftX + profileSize * 0.32;
  const waveEndX = rightX - profileSize * 0.32;
  const waveW = waveEndX - waveStartX;
  const amp = 26;

  const points: string[] = [];
  const steps = 40;
  const revealed = Math.floor(steps * lineDraw);
  for (let i = 0; i <= revealed; i++) {
    const t = i / steps;
    const x = waveStartX + waveW * t;
    const y = cy + Math.sin(t * Math.PI * 4 + localFrame * 0.11) * amp;
    points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  const wavePath = points.join(" ");

  const packetT = (Math.sin(localFrame * 0.08) + 1) / 2;
  const packetX = waveStartX + waveW * packetT;
  const packetY = cy + Math.sin(packetT * Math.PI * 4 + localFrame * 0.11) * amp;

  return (
    <>
      <BustSilhouette x={leftX} y={cy} size={profileSize} color={COOL} scale={leftIn} label="Étudiant" />
      <BustSilhouette x={rightX} y={cy} size={profileSize} color={WARM} scale={rightIn} label="Enseignant" />
      <svg width={HERO_WIDTH} height={HERO_HEIGHT} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {revealed > 0 && (
          <path
            d={wavePath}
            fill="none"
            stroke={PLATFORM}
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {lineDraw > 0.99 && (
          <>
            <circle cx={packetX} cy={packetY} r={10} fill={PLATFORM} opacity={0.22} />
            <circle cx={packetX} cy={packetY} r={5} fill={PLATFORM} />
          </>
        )}
      </svg>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: cy + profileSize * 0.75,
          transform: "translate(-50%, 0)",
          fontSize: 12,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: INK_2,
          fontWeight: 700,
          textAlign: "center",
          opacity: interpolate(localFrame, [50, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Une rencontre, un savoir partagé
      </div>
    </>
  );
};

/** Minimalist bust silhouette — no facial features, distinguishable by color. */
const BustSilhouette: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  scale: number;
  label: string;
}> = ({ x, y, size, color, scale, label }) => {
  const vbW = 140;
  const vbH = 160;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size * (vbH / vbW),
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: scale,
      }}
    >
      <svg width={size} height={size * (vbH / vbW)} viewBox={`0 0 ${vbW} ${vbH}`} style={{ overflow: "visible" }}>
        {/* Shoulders / body */}
        <path
          d={`M 14 158 Q 14 118 55 112 Q 70 111 85 112 Q 126 118 126 158 L 14 158 Z`}
          fill={color}
          opacity={0.9}
        />
        <path
          d={`M 14 158 Q 14 118 55 112 Q 70 111 85 112 Q 126 118 126 158`}
          fill="none"
          stroke={INK}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Neck */}
        <path d="M 55 112 L 55 96 Q 55 92 60 92 L 80 92 Q 85 92 85 96 L 85 112" fill={color} opacity={0.9} />
        <path
          d="M 55 112 L 55 96 Q 55 92 60 92 L 80 92 Q 85 92 85 96 L 85 112"
          fill="none"
          stroke={INK}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Head */}
        <ellipse cx={70} cy={54} rx={32} ry={38} fill={color} opacity={0.92} />
        <ellipse cx={70} cy={54} rx={32} ry={38} fill="none" stroke={INK} strokeWidth={2.6} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "calc(100% + 12px)",
          transform: "translate(-50%, 0)",
          fontSize: 12,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: INK_2,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ==========================================================================
 * Scene 6 · Dark finale — Caveat wordmark from brand navbar, extended hold
 * ========================================================================== */

const SceneDarkFinale: React.FC<{ localFrame: number; layout: HeroLayout }> = ({
  localFrame,
  layout,
}) => {
  const { fps } = useVideoConfig();

  // 90 frames: fade to dark 0–8, hold 8–72, fade out 72–90
  const darkOpacity = interpolate(
    localFrame,
    [0, 8, 72, 90],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Wordmark pops in with elastic overshoot then stays
  const markIn = spring({ frame: localFrame - 6, fps, config: POP });

  // CTA fades in after wordmark, holds
  const ctaOpacity = interpolate(
    localFrame,
    [20, 34, 72, 90],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const cy = HERO_HEIGHT / 2;

  return (
    <>
      <AbsoluteFill style={{ backgroundColor: INK_BLACK, opacity: darkOpacity }} />
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

/** Reproduces the navbar wordmark (Caveat, -4° tilt) on dark. */
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

/* ==========================================================================
 * Small icons
 * ========================================================================== */

const SearchGlyph: React.FC<{ size?: number; color?: string }> = ({
  size = 18,
  color = INK,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx={11} cy={11} r={7} stroke={color} strokeWidth={2} />
    <path d="M20 20l-3.5-3.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </svg>
);

const StarIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 12,
  color = WARM_2,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2 L14.5 8.5 L21.5 9.2 L16.4 14 L18 21 L12 17.5 L6 21 L7.6 14 L2.5 9.2 L9.5 8.5 Z" fill={color} />
  </svg>
);

const CategoryIcon: React.FC<{
  kind: "brush" | "note" | "code" | "globe";
  accent: string;
  size?: number;
}> = ({ kind, accent, size = 20 }) => {
  const s = size;
  const sw = 1.8;
  switch (kind) {
    case "brush":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M14 3l7 7-9 9-4.5-4.5L14 3z" stroke={accent} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M3 21c2-1 3-2 4-4l-4-2v6z" fill={accent} />
        </svg>
      );
    case "note":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M9 18V5l10-2v13" stroke={accent} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={6} cy={18} r={3} fill={accent} />
          <circle cx={16} cy={16} r={3} fill={accent} />
        </svg>
      );
    case "code":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M8 6l-5 6 5 6M16 6l5 6-5 6" stroke={accent} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "globe":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx={12} cy={12} r={9} stroke={accent} strokeWidth={sw} />
          <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke={accent} strokeWidth={sw} />
        </svg>
      );
  }
};

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
