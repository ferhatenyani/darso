import { useId } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

/**
 * Load Inter directly through @remotion/google-fonts. This runs at module
 * evaluation time and registers the font with `document.fonts`, so headless
 * Chromium (render) and Studio preview both see identical metrics — no more
 * width surprises when the composition renders to MP4.
 */
const { fontFamily: INTER_FAMILY } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

/**
 * Cabinet Grotesk — self-hosted brand voice for headlines & panel titles.
 * Loaded via FontFace so headless Chromium renders wait for glyphs before
 * capturing frames. Guarded for SSR because HeroComposition is also imported
 * from React Server Components via HeroVideoPlayer.
 */
const CABINET_FAMILY = "Cabinet Grotesk";

if (typeof document !== "undefined") {
  const handle = delayRender("Loading Cabinet Grotesk");
  const weights: Array<[string, string]> = [
    ["400", "CabinetGrotesk-Regular.woff2"],
    ["500", "CabinetGrotesk-Medium.woff2"],
    ["700", "CabinetGrotesk-Bold.woff2"],
    ["800", "CabinetGrotesk-Extrabold.woff2"],
  ];
  Promise.all(
    weights.map(([weight, file]) => {
      const face = new FontFace(
        CABINET_FAMILY,
        `url(${staticFile(`fonts/cabinet-grotesk/${file}`)}) format('woff2')`,
        { weight, style: "normal", display: "swap" },
      );
      return face.load().then((loaded) => document.fonts.add(loaded));
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => cancelRender(err));
}

const CABINET_STACK = `"${CABINET_FAMILY}", ${INTER_FAMILY}, ui-sans-serif, system-ui, sans-serif`;

/* --------------------------------------------------------------------------
 * Darso — Hero composition · "The Value Loop" (v11)
 *
 * 1082 frames · 36.1s @ 30fps · seamless loop
 *   1 · Catalogue    (0–172)   10-card fanned deck (~44f hold) → fall-out
 *   2 · Browse       (172–352) iPhone 16 Pro (340 wide), plain-div search
 *   3 · Planning     (352–562) calendar → CTA card with thick OVERLINE bar
 *   4 · Vase         (562–802) "Vous enseignez ?" + drawing arrows
 *   5 · Mosaic       (802–992) shrunk panels + late stamp + safe wallet
 *   6 · Dark finale  (992–1082) black canvas, Caveat wordmark
 *
 * Smoothness (v9):
 *   - FADE 14→16, eased cubic-bezier crossfades (not linear)
 *   - Scene internals freeze `EXIT_FREEZE_MARGIN` frames before fade begins
 *     so opacity ramps against a static image — the biggest jitter fix.
 *   - Scene 3 blur tapers back to 0 before exit so we never crossfade
 *     two blurred SVG grids simultaneously.
 *
 * MP4 render:
 *   npx remotion render Hero out/hero.mp4 \
 *     --codec=h264 --crf=18 --concurrency=6 --jpeg-quality=100
 * -------------------------------------------------------------------------- */

export const HERO_WIDTH = 1600;
export const HERO_HEIGHT = 1000;
export const HERO_FPS = 30;
export const HERO_DURATION = 1082;
export type HeroLayout = "wide" | "compact";

/* ---------- Safe zone ----------
 * The player scales the composition with object-fit:cover (see
 * hero-video-player.tsx), so wide container aspects crop top/bottom. On top of
 * that, home-hero.tsx clips the container with a path() that carves out three
 * notches into the composition:
 *   - TL headline (~380–400 wide × ~132 tall in container units, per the
 *     xl:text-[36px] cabinet headline + 22px pad)
 *   - TR compass (60 × 60)
 *   - BC split-pill CTA (~292 wide × ~66 tall)
 *
 * Translating those into composition-Y for a container of width w and
 * height h with s = max(w/1600, h/1000):
 *   comp_y(TL notch bottom) = (140 - h/2)·1600/w + 500   (when r = w/h > 1.6)
 *   comp_y(BC notch top)    = (h/2 - 66)·1600/w + 500    (when r > 1.6)
 *
 * Sweeping realistic wide-desktop containers (h ∈ [500, 900], r ∈ [1.6, 2.5]):
 *   TL notch bottom lands in comp Y ≈ 240–330 (worst at r=2.5, h=600 → 329)
 *   BC notch top    lands in comp Y ≈ 720–840 (worst at r=2.5, h=600 → 750)
 * At r > 2.5 both notches encroach further and some scenes accept small
 * bleed; ultrawide is not the primary target.
 *
 * Scenes place their top-most text at Y ≥ SAFE_TOP and bottom-most content at
 * Y ≤ SAFE_BOTTOM to stay clear of both the cover-crop AND the notch cutouts
 * on the centered content column. Content that hugs the left edge (x < ~500)
 * needs additional TL clearance beyond SAFE_TOP. */
const SAFE_TOP = 300;
const SAFE_BOTTOM = 740;

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

/** Acid-green highlighter for `HighlightWord`. Reads unmistakably as
 *  "someone marked this with a marker" — distinct from WARM (money/vase)
 *  and COOL (student/browse) so it never competes with those meanings. */
const HIGHLIGHT_GREEN = "#D4F26A";

const PLATFORM = "#8C7A4A";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ---------- Springs (elastic, generous overshoot) ---------- */

const ELASTIC = { damping: 10, stiffness: 140, mass: 0.9 } as const;
const ELASTIC_SOFT = { damping: 14, stiffness: 110, mass: 0.9 } as const;
const SETTLE = { damping: 22, stiffness: 100 } as const;
const POP = { damping: 12, stiffness: 170, mass: 0.9 } as const;
/** Smoother-than-ELASTIC arrival with just enough overshoot to feel alive. */
const SMOOTH_ENTRY = { damping: 18, stiffness: 90, mass: 1 } as const;

/* ---------- Scene windows ---------- */

const S1 = { start: 0, end: 172 };
const S2 = { start: 172, end: 352 };
const S3 = { start: 352, end: 562 };
const S4 = { start: 562, end: 802 };
const S5 = { start: 802, end: 992 };
const S6 = { start: 992, end: 1082 };
const FADE = 16;
/** Extra frames past FADE where scene internals stop advancing. Guarantees
 *  the exiting scene is visually frozen (no breathing / pulsing / bounce)
 *  before its opacity begins to drop — so the crossfade blends two STATIC
 *  images instead of two moving scenes. Single biggest smoothness win. */
const EXIT_FREEZE_MARGIN = 4;

/** Symmetric cubic ease-in-out — softer than linear at both edges, no easing
 *  spike in the middle. Standard for scene-level crossfades. */
const EASE_CROSSFADE: [number, number, number, number] = [0.65, 0, 0.35, 1];

function sceneOpacity(frame: number, start: number, end: number, fade = FADE) {
  const enter = interpolate(frame, [start - fade, start + fade], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => cubicBezier(EASE_CROSSFADE, t),
  });
  const exit = interpolate(frame, [end - fade, end + fade], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => cubicBezier(EASE_CROSSFADE, t),
  });
  return Math.min(enter, exit);
}

/** localFrame the scene should render at. Advances normally, then FREEZES
 *  `EXIT_FREEZE_MARGIN` frames before the fade-out window begins. Scenes
 *  passed `freezeExit: false` (only S6 today) render frame-accurately end-
 *  to-end because they own their own fade-out animation. */
function sceneLocalFrame(
  frame: number,
  s: { start: number; end: number },
  opts: { freezeExit?: boolean } = {},
) {
  const raw = frame - s.start;
  if (opts.freezeExit === false) return raw;
  const sceneLen = s.end - s.start;
  const clampAt = sceneLen - FADE - EXIT_FREEZE_MARGIN;
  return Math.min(raw, clampAt);
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
        fontFamily: `${INTER_FAMILY}, ui-sans-serif, system-ui, sans-serif`,
        color: INK,
        overflow: "hidden",
      }}
    >
      <PaperGrain />
      {frame < S1.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S1.start, S1.end) }}>
          <SceneCatalogue localFrame={sceneLocalFrame(frame, S1)} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S2.start - FADE && frame < S2.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S2.start, S2.end) }}>
          <SceneBrowse localFrame={sceneLocalFrame(frame, S2)} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S3.start - FADE && frame < S3.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S3.start, S3.end) }}>
          <SceneCalendar localFrame={sceneLocalFrame(frame, S3)} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S4.start - FADE && frame < S4.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S4.start, S4.end) }}>
          <SceneVase localFrame={sceneLocalFrame(frame, S4)} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S5.start - FADE && frame < S5.end + FADE && (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, S5.start, S5.end) }}>
          <SceneMosaic localFrame={sceneLocalFrame(frame, S5)} layout={layout} />
        </AbsoluteFill>
      )}
      {frame > S6.start - FADE && (
        <AbsoluteFill
          style={{ opacity: sceneOpacity(frame, S6.start, S6.end, 8) }}
        >
          {/* Finale owns its own fade-in/out (darkOpacity), don't clamp. */}
          <SceneDarkFinale
            localFrame={sceneLocalFrame(frame, S6, { freezeExit: false })}
            layout={layout}
          />
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

// Realistic search: the user types fluidly, hesitates, then rapidly finishes.
// Query kept short (23 chars) so it fits inside the pill under any font
// fallback — even before Inter is registered.
const SEARCH_FLUID = "Espagnol";
const SEARCH_RAPID = " pour débutants";
const SEARCH_TARGET = SEARCH_FLUID + SEARCH_RAPID; // "Espagnol pour débutants"

// Suggestions match the specific intent.
const SEARCH_SUGGESTIONS = [
  "Espagnol pour débutants",
  "Espagnol · conversation",
  "Espagnol · niveau B1",
];

// Local frames (150 total).
const T1_CURSOR_APPEARS = 20;
const T1_TYPING_START = 32;
const T1_TYPING_FLUID_PER_CHAR = 3;
const T1_TYPING_FLUID_END =
  T1_TYPING_START + SEARCH_FLUID.length * T1_TYPING_FLUID_PER_CHAR; // 32 + 33 = 65
const T1_TYPING_PAUSE_END = T1_TYPING_FLUID_END + 6; // 71
const T1_TYPING_RAPID_PER_CHAR = 1.4;
const T1_TYPING_END =
  T1_TYPING_PAUSE_END +
  Math.ceil(SEARCH_RAPID.length * T1_TYPING_RAPID_PER_CHAR); // ~99
const T1_DROPDOWN_OPEN = T1_TYPING_END + 3; // ~102
const T1_SELECT_LANGUES = T1_DROPDOWN_OPEN + 12; // ~114
const T1_CARD_LANDS = T1_SELECT_LANGUES + 8; // ~122

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

  // Two-phase typing with a 6f hesitation between phases
  const typedCount = (() => {
    if (localFrame < T1_TYPING_START) return 0;
    if (localFrame < T1_TYPING_FLUID_END) {
      return Math.min(
        SEARCH_FLUID.length,
        Math.floor((localFrame - T1_TYPING_START) / T1_TYPING_FLUID_PER_CHAR),
      );
    }
    if (localFrame < T1_TYPING_PAUSE_END) return SEARCH_FLUID.length;
    return Math.min(
      SEARCH_TARGET.length,
      SEARCH_FLUID.length +
        Math.floor((localFrame - T1_TYPING_PAUSE_END) / T1_TYPING_RAPID_PER_CHAR),
    );
  })();
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
    cardSpring > 0.5 ? 1 + Math.sin((localFrame - T1_CARD_LANDS) * 0.34) * 0.06 : 1;

  // Shorter phone (v14 → v15) — 260 × 460 wide (1:1.77) / 260 × 530 compact
  // (1:2.04). Compact stays near iPhone-accurate; wide is stubbier so the
  // whole silhouette fits inside the tightened safe band (300–740 = 440
  // tall) with a 10 px buffer under SAFE_BOTTOM. Inner pill width unchanged
  // (216 px, still comfortable for the 23-char search query).
  const phoneW = layout === "wide" ? 260 : 260;
  const phoneH = layout === "wide" ? 460 : 530;
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

        {/* Search input — iron-clad containment: the whole thing is wrapped
            in an overflow:hidden container that matches the InkedRect's
            radius, so nothing the child does can escape the pill. */}
        <div
          style={{
            marginTop: 12,
            opacity: searchIn,
            transform: `translateY(${(1 - searchIn) * 10}px)`,
            position: "relative",
            width: innerW,
            height: 46,
          }}
        >
          {/* Pill background — plain div, not InkedRect. Reason: InkedRect's
              viewBox has a -6px inset for overshoot strokes + default
              preserveAspectRatio="xMidYMid meet". On a wide/short pill this
              letterboxes the fill horizontally by ~26px each side, so the
              text container (inset:0) ends up starting BEFORE the visible
              pill. Plain div = pixel-exact bounds, text aligns perfectly. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: SURFACE_2,
              border: `1px solid rgba(14,17,22,0.14)`,
              borderRadius: 14,
            }}
          />
          {/* Content clip — hard boundary. Everything inside is clipped to
              the search pill's rounded rectangle. Even if the typed text
              exceeds the width, it will visually stop at the right edge. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                paddingLeft: 14,
                paddingRight: 14,
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontSize: 12,
                letterSpacing: "-0.005em",
                fontWeight: 500,
                color: INK,
                lineHeight: 1,
              }}
            >
              {showPlaceholder ? (
                <span style={{ color: INK_3, fontWeight: 400 }}>
                  Quel cours vous intéresse&nbsp;?
                </span>
              ) : (
                <>
                  {typedText}
                  {cursorVisible && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 1.5,
                        height: 13,
                        background: INK,
                        marginLeft: 1,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </>
              )}
            </div>
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
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      overflow: "hidden",
                    }}
                  >
                    <span
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
                      Sofia B.
                    </span>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        background: "#1E9E5F",
                        boxShadow: `0 0 0 ${2 + Math.sin(localFrame * 0.28) * 1.5}px rgba(30,158,95,0.35)`,
                        flex: "0 0 auto",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#1E9E5F",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Dispo
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: INK_2,
                      marginTop: 2,
                      letterSpacing: "-0.005em",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Espagnol · 15 ans · Alger centre
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
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "-0.005em",
                  }}
                >
                  Réserver un créneau
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
  const islandW = Math.min(width * 0.34, 128);
  const islandH = Math.min(30, height * 0.05);
  // Push the notch down so it visually sits in the "chin" of the top bezel
  // rather than kissing the top edge — matches real iPhone 16 Pro proportions.
  const islandTop = Math.max(18, height * 0.032);
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
      {/* Content — sits below the notch with real safe-area breathing room */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: islandTop + islandH + 28,
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
 * Scene 1 · Catalogue + Dual-CTA — 18 cards flock in, dim to background,
 *   then a big ELASTIC modal presents the two ways to use Darso.
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

// 10 diverse hand-drawn lesson cards (v9 — trimmed from 13; the fan reads
// cleaner and each card is visible without being buried by neighbours).
// Order matters — cards deal in this sequence with a compressing stagger.
const LESSONS: LessonCardData[] = [
  { subject: "Espagnol", when: "Lun · 14h", who: "Sofia", letter: "S", tone: COOL, icon: "globe", rating: "4,9" },
  { subject: "Piano", when: "Mar · 10h", who: "Karim", letter: "K", tone: WARM, icon: "note", rating: "4,8" },
  { subject: "React", when: "Mer · 18h", who: "Yasmine", letter: "Y", tone: COOL, icon: "code", rating: "5,0" },
  { subject: "Illustration", when: "Jeu · 16h", who: "Amine", letter: "A", tone: WARM, icon: "brush", rating: "4,7" },
  { subject: "Anglais", when: "Ven · 11h", who: "Lina", letter: "L", tone: PLATFORM, icon: "globe", rating: "4,9" },
  { subject: "Math BAC", when: "Sam · 15h", who: "Nabil", letter: "N", tone: COOL, icon: "code", rating: "4,9" },
  { subject: "Guitare", when: "Dim · 17h", who: "Rania", letter: "R", tone: WARM, icon: "note", rating: "4,8" },
  { subject: "Arabe", when: "Lun · 09h", who: "Meriem", letter: "M", tone: PLATFORM, icon: "globe", rating: "5,0" },
  { subject: "Physique", when: "Mar · 16h", who: "Omar", letter: "O", tone: COOL, icon: "code", rating: "4,7" },
  { subject: "Python", when: "Dim · 20h", who: "Wassim", letter: "W", tone: COOL, icon: "code", rating: "4,9" },
];

// Cascade delays — stagger compresses from 14f down to 4f so cards flock.
const CATALOGUE_DELAYS: number[] = (() => {
  const N = LESSONS.length; // 13
  const start = 14;
  const end = 4;
  const deltas: number[] = [];
  const out = [0];
  for (let i = 1; i < N; i++) {
    const t = (i - 1) / (N - 2);
    const stagger = Math.max(end, Math.round(start - t * (start - end)));
    deltas.push(stagger);
    out.push(out[i - 1] + stagger);
  }
  return out;
})();

const T1_LAST_DEAL = CATALOGUE_DELAYS[CATALOGUE_DELAYS.length - 1]; // ~82
const T1_SUBTITLE_IN = T1_LAST_DEAL + 4;
// Fanned deck hold cut ~88f → ~44f in v11. Fall starts at 126, cards clear
// by 152, freeze clamp at sceneLen - 20 = 152. Aligned, no empty tail.
const T1_FALL_START = 126;

const SceneCatalogue: React.FC<{ localFrame: number; layout: HeroLayout }> = ({
  localFrame,
  layout,
}) => {
  const { fps } = useVideoConfig();

  const isWide = layout === "wide";
  const cardW = isWide ? 360 : 300;
  const cardH = isWide ? 108 : 96;
  const cx = HERO_WIDTH / 2;
  const cy = HERO_HEIGHT / 2 + (isWide ? 40 : 50);

  // Fanned deck positions — each card sits close to center, rotated on an
  // arc so the stack reads as a hand of cards spread on a table. Deterministic.
  const fanPos = (i: number) => {
    const N = LESSONS.length; // 13
    const spread = 28; // total degrees (tighter fan for 13 cards)
    const rot = N > 1 ? (i - (N - 1) / 2) * (spread / (N - 1)) : 0;
    const pivotDist = isWide ? 200 : 160;
    const angleRad = (rot * Math.PI) / 180;
    const x = Math.sin(angleRad) * pivotDist;
    const y = -Math.cos(angleRad) * pivotDist + pivotDist;
    const h1 = Math.sin(i * 12.9898) * 43758.5453;
    const h2 = Math.sin(i * 78.233) * 12345.678;
    const jx = ((h1 - Math.floor(h1)) - 0.5) * 6;
    const jy = ((h2 - Math.floor(h2)) - 0.5) * 6;
    const jr = ((h1 - Math.floor(h1)) - 0.5) * 3;
    return { x: x + jx, y: y + jy, rot: rot + jr };
  };

  // Whole deck breathes gently between "last card lands" and "fall starts"
  const isBreathing =
    localFrame > T1_LAST_DEAL && localFrame < T1_FALL_START;
  const breathePhase = Math.max(0, localFrame - T1_LAST_DEAL) * 0.06;
  const deckBreatheY = isBreathing ? Math.sin(breathePhase) * 4 : 0;
  const deckBreatheScale = isBreathing
    ? 1 + Math.sin(breathePhase * 0.8) * 0.006
    : 1;
  const deckBreatheRot = isBreathing ? Math.sin(breathePhase * 0.5) * 0.6 : 0;

  const kickerIn = interpolate(localFrame, [6, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => cubicBezier(EASE_OUT, t),
  });
  const subtitleIn = spring({
    frame: localFrame - T1_SUBTITLE_IN,
    fps,
    config: SETTLE,
  });

  // Text fades out slightly earlier than the cards so the fall reads clean
  const textOut = interpolate(
    localFrame,
    [T1_FALL_START - 4, T1_FALL_START + 10],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Text sits just above the topmost card. Topmost card is at:
  //   y ≈ cy + fanPos(0).y - cardH/2
  // fanPos(0).y ≈ 0 (deck top). cardTop ≈ cy - cardH/2 - some rot inflation
  const topmostCardY = cy - cardH / 2 - 40;
  const kickerTop = topmostCardY - 90;
  const headlineTop = topmostCardY - 60;

  return (
    <>
      {/* Kicker close to the deck */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: kickerTop,
          transform: `translate(-50%, ${(1 - kickerIn) * -10}px)`,
          fontFamily: CABINET_STACK,
          fontSize: 12,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: INK_2,
          fontWeight: 700,
          opacity: kickerIn * textOut,
          whiteSpace: "nowrap",
        }}
      >
        Catalogue vivant
      </div>

      {/* Headline — smaller, catchier, with underlined key words */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: headlineTop,
          transform: `translate(-50%, ${(1 - kickerIn) * -14}px)`,
          fontFamily: CABINET_STACK,
          fontSize: isWide ? 30 : 22,
          fontWeight: 800,
          color: INK,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          opacity: kickerIn * textOut,
          textAlign: "center",
          maxWidth: 900,
          padding: "0 24px",
          whiteSpace: "nowrap",
        }}
      >
        Trouvez votre prof, pas juste un profil.
      </div>

      {/* Fanned deck */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(0, ${deckBreatheY}px) scale(${deckBreatheScale}) rotate(${deckBreatheRot}deg)`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      >
        {LESSONS.map((lesson, i) => {
          const dealAt = CATALOGUE_DELAYS[i];
          const enter = spring({
            frame: localFrame - dealAt,
            fps,
            config: SMOOTH_ENTRY,
          });
          if (enter < 0.01) return null;
          const f = fanPos(i);
          // Deal from top-right diagonal
          const dealX = interpolate(enter, [0, 1], [420, 0]);
          const dealY = interpolate(enter, [0, 1], [-320, 0]);
          const dealRot = interpolate(enter, [0, 1], [f.rot + 18, f.rot]);
          const dealScale = 0.9 + enter * 0.1;

          // Fall-out — each card gets a tiny per-index stagger so the deck
          // doesn't drop as one solid slab. Cards accelerate under gravity,
          // rotate slightly as they tumble off-screen.
          const cardFallStart = T1_FALL_START + (i % 5) * 1.4;
          const fallT = Math.max(0, localFrame - cardFallStart);
          const gravity = 6.2;
          const fallY = 0.5 * gravity * fallT * fallT;
          const fallRot = fallT * 0.6 * (i % 2 === 0 ? 1 : -1);
          const fallOpacity = interpolate(fallT, [18, 26], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cx + f.x,
                top: cy + f.y,
                width: cardW,
                height: cardH,
                transform: `translate(-50%, -50%) translate(${dealX}px, ${dealY + fallY}px) rotate(${dealRot + fallRot}deg) scale(${dealScale})`,
                opacity: enter * fallOpacity,
                zIndex: i + 1,
              }}
            >
              <LessonCard width={cardW} height={cardH} lesson={lesson} />
            </div>
          );
        })}
      </div>

      {/* Subtitle below the fan — arrives with the last cards, fades with fall.
          Positioned at composition Y ≈ SAFE_BOTTOM (was bottom:96 → Y=904,
          which was cropped on any container aspect > ~1.7). */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: SAFE_BOTTOM - 20,
          transform: `translate(-50%, ${(1 - subtitleIn) * 14}px)`,
          textAlign: "center",
          opacity: Math.min(1, subtitleIn) * textOut,
          maxWidth: 800,
          padding: "0 24px",
        }}
      >
        <div
          style={{
            fontSize: isWide ? 16 : 13,
            color: INK_2,
            letterSpacing: "-0.005em",
            lineHeight: 1.4,
          }}
        >
          Un vrai prof · un prix affiché · un créneau réel.
        </div>
      </div>
    </>
  );
};

/** Clean marker-style highlight — solid HIGHLIGHT_GREEN block behind the
 *  word. No wobble, no double-stroke, no marker bleed. Just a slight tilt
 *  alternating by seed parity so it doesn't feel mechanical.
 *  Bar height 1.4em, INK text on green ≈ 8:1 contrast. */
const HighlightWord: React.FC<{
  children: React.ReactNode;
  seed?: number;
}> = ({ children, seed = 0 }) => {
  const tilt = seed % 2 === 0 ? -1.5 : 1.5;
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        // `nowrap` keeps multi-word children on one line so the inline-block
        // measures the full phrase (e.g. "vous deux").
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: "-0.12em",
          width: "calc(100% + 0.24em)",
          top: "50%",
          height: "1.4em",
          transform: `translateY(-50%) rotate(${tilt}deg)`,
          background: HIGHLIGHT_GREEN,
          borderRadius: "0.08em",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <span style={{ position: "relative", zIndex: 1, color: INK }}>
        {children}
      </span>
    </span>
  );
};


/** Fill-parent hand-inked-style panel — pixel-consistent radius/border via
 *  plain CSS (SVG preserveAspectRatio="none" distorts the corners on wide
 *  aspect ratios, which is exactly the situation for the CTA pillars). */
const PillarInkedBackground: React.FC<{ accent: string; accentSoft: string }> = ({
  accent,
  accentSoft,
}) => (
  <div
    aria-hidden
    style={{
      position: "absolute",
      inset: 0,
      background: accentSoft,
      border: `1.4px solid ${accent}`,
      borderRadius: 20,
      pointerEvents: "none",
    }}
  />
);


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

// Scene 3 timing (260 local frames):
//   0–60    grid pops in + bookings deal (existing beat, untouched)
//   60–96   calendar dims to 0.15 + slight blur, becomes backdrop
//   84–108  centered CTA card lands with ELASTIC + brief breathing float
//   108–130 both bullet points animate in sequentially
//   ~145    breathing STOPS — card locks in place once fully readable
//   145–260 static hold (~115 f, ~3.8s) — plenty of reading time
const T3_TRANSITION_START = 60;
const T3_TRANSITION_END = 96;
const T3_CTA_IN = 84;
const T3_POINT_A_IN = 108;
const T3_POINT_B_IN = 120;
const T3_BREATH_FREEZE = 145;

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

  // Transition: calendar recedes into background
  const trans = interpolate(
    localFrame,
    [T3_TRANSITION_START, T3_TRANSITION_END],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => cubicBezier(EASE_OUT, t),
    },
  );
  const calendarDim = 1 - trans * 0.85; // 1 → 0.15
  // Blur tapers back to 0 in the last 20 local frames so the exit
  // crossfade never blends two blurred SVGs (major MP4 smoothness win).
  const sceneLen = S3.end - S3.start;
  const blurRelease = interpolate(
    localFrame,
    [sceneLen - FADE - EXIT_FREEZE_MARGIN - 20, sceneLen - FADE - EXIT_FREEZE_MARGIN],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const calendarBlur = trans * 3 * blurRelease;

  // Single CTA card enters with ELASTIC, points fade in sequentially
  const ctaSpring = spring({
    frame: localFrame - T3_CTA_IN,
    fps,
    config: ELASTIC,
  });
  const pointAIn = spring({
    frame: localFrame - T3_POINT_A_IN,
    fps,
    config: SMOOTH_ENTRY,
  });
  const pointBIn = spring({
    frame: localFrame - T3_POINT_B_IN,
    fps,
    config: SMOOTH_ENTRY,
  });

  // Card breathes only while it's landing — freezes once fully readable
  // so the eye can rest on the copy.
  const cardBreathY =
    ctaSpring > 0.9 && localFrame < T3_BREATH_FREEZE
      ? Math.sin((localFrame - T3_CTA_IN) * 0.14) * 3
      : 0;

  const isWide = layout === "wide";

  return (
    <>
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        width: gridW,
        height: gridH,
        transform: `translate(-50%, calc(-50% + ${frameY}px)) scale(${frameScale})`,
        opacity: frameIn * calendarDim,
        filter: calendarBlur > 0.05 ? `blur(${calendarBlur}px)` : undefined,
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
          fontFamily: CABINET_STACK,
          fontSize: 12,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: INK_2,
          fontWeight: 700,
          opacity:
            interpolate(localFrame, [40, 60], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) * (1 - trans),
        }}
      >
        Un agenda qui prend vie
      </div>
    </div>

    {/* Single centered CTA card — the two sides of the marketplace share
        one agenda system. Applied psychology: Unity ("un agenda pour vous
        deux") + concrete verbs. Card breathes on landing then locks. */}
    {ctaSpring > 0.01 && (
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: isWide ? 820 : 600,
          transform: `translate(-50%, calc(-50% + ${cardBreathY}px)) scale(${ctaSpring})`,
          opacity: Math.min(1, ctaSpring),
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <PlanningCtaCard
          isWide={isWide}
          pointAIn={pointAIn}
          pointBIn={pointBIn}
        />
      </div>
    )}
    </>
  );
};

const PlanningCtaCard: React.FC<{
  isWide: boolean;
  pointAIn: number;
  pointBIn: number;
}> = ({ isWide, pointAIn, pointBIn }) => {
  return (
    <div
      style={{
        position: "relative",
        padding: isWide ? "38px 44px 34px" : "30px 30px 26px",
        overflow: "hidden",
        borderRadius: 26,
      }}
    >
      {/* Card body */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: SURFACE,
          border: `1.8px solid ${INK}`,
          borderRadius: 26,
          boxShadow: "0 30px 60px -24px rgba(14,17,22,0.28)",
        }}
      />

      {/* Decorative top-right arc — soft accent that catches the eye without
          competing with the copy */}
      <svg
        aria-hidden
        width={isWide ? 260 : 200}
        height={isWide ? 260 : 200}
        viewBox="0 0 260 260"
        style={{
          position: "absolute",
          top: isWide ? -80 : -60,
          right: isWide ? -80 : -60,
          opacity: 0.5,
          pointerEvents: "none",
        }}
      >
        <circle cx={130} cy={130} r={120} fill="none" stroke={COOL_SOFT} strokeWidth={22} />
        <circle cx={130} cy={130} r={90} fill="none" stroke={WARM_SOFT} strokeWidth={14} />
        <circle cx={130} cy={130} r={62} fill={WARM_SOFT} opacity={0.6} />
      </svg>

      {/* Corner tick — hand-drawn feel */}
      <svg
        aria-hidden
        width={44}
        height={44}
        viewBox="0 0 44 44"
        style={{
          position: "absolute",
          bottom: 14,
          left: 14,
          opacity: 0.4,
        }}
      >
        <path
          d="M 4 22 L 22 4 M 4 30 L 30 4 M 4 38 L 38 4"
          stroke={INK_3}
          strokeWidth={1.3}
          strokeLinecap="round"
        />
      </svg>

      <div style={{ position: "relative" }}>
        {/* Head */}
        <div
          style={{
            fontFamily: CABINET_STACK,
            fontSize: 12,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: INK_3,
            fontWeight: 700,
          }}
        >
          Planification
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: CABINET_STACK,
            fontSize: isWide ? 36 : 26,
            fontWeight: 800,
            color: INK,
            letterSpacing: "-0.035em",
            lineHeight: 1.08,
          }}
        >
          Un agenda pour <HighlightWord seed={2}>vous deux</HighlightWord>.
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: isWide ? 15 : 13,
            color: INK_2,
            letterSpacing: "-0.005em",
            lineHeight: 1.4,
            maxWidth: isWide ? 520 : "100%",
          }}
        >
          Un seul outil : l&rsquo;élève réserve, le prof suit.
        </div>

        {/* Two points */}
        <div
          style={{
            marginTop: isWide ? 28 : 22,
            display: "flex",
            flexDirection: isWide ? "row" : "column",
            gap: isWide ? 0 : 14,
            alignItems: "stretch",
            position: "relative",
          }}
        >
          <PlanningPoint
            entry={pointAIn}
            accent={COOL_2}
            accentSoft={COOL_SOFT}
            kicker="Côté élève"
            title="Réservez sur les vrais créneaux"
            sub="Confirmation immédiate, zéro aller-retour WhatsApp."
            icon={<ContextStudentIcon size={36} accent={COOL_2} />}
            isWide={isWide}
          />

          {/* Divider between the two points */}
          {isWide && (
            <div
              style={{
                width: 1,
                margin: "8px 20px",
                background: `linear-gradient(180deg, transparent 0%, ${HAIRLINE} 20%, ${HAIRLINE} 80%, transparent 100%)`,
                flex: "0 0 auto",
              }}
            />
          )}

          <PlanningPoint
            entry={pointBIn}
            accent={WARM_2}
            accentSoft={WARM_SOFT}
            kicker="Côté prof"
            title="Vos dispos se remplissent seules"
            sub="Publiez une fois, pilotez tout d&rsquo;un tableau de bord."
            icon={<ContextTeacherIcon size={36} accent={WARM_2} />}
            isWide={isWide}
          />
        </div>
      </div>
    </div>
  );
};

const PlanningPoint: React.FC<{
  entry: number;
  accent: string;
  accentSoft: string;
  kicker: string;
  title: string;
  sub: string;
  icon: React.ReactNode;
  isWide: boolean;
}> = ({ entry, accent, accentSoft, kicker, title, sub, icon, isWide }) => {
  const e = Math.min(1, Math.max(0, entry));
  // Animated check: draws in as the point settles
  const checkT = Math.min(1, Math.max(0, (e - 0.6) / 0.4));
  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        padding: isWide ? "18px 20px" : "14px 16px",
        transform: `translateY(${(1 - e) * 12}px)`,
        opacity: e,
      }}
    >
      {!isWide && <PillarInkedBackground accent={accent} accentSoft={accentSoft} />}
      <div style={{ position: "relative", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ position: "relative", width: 46, height: 46, flex: "0 0 46px" }}>
          <InkedCircle size={46} fill={accentSoft} stroke={accent} strokeWidth={1.6} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            {icon}
          </div>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontFamily: CABINET_STACK,
              fontSize: 11,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              color: accent,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{kicker}</span>
            {/* Animated check tick */}
            <svg width={12} height={12} viewBox="0 0 12 12" style={{ opacity: checkT }}>
              <path
                d="M 2 6 L 5 9 L 10 3"
                fill="none"
                stroke={accent}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={14}
                strokeDashoffset={14 * (1 - checkT)}
              />
            </svg>
          </div>
          <div
            style={{
              fontFamily: CABINET_STACK,
              fontSize: isWide ? 17 : 14,
              fontWeight: 700,
              color: INK,
              letterSpacing: "-0.02em",
              marginTop: 4,
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: isWide ? 13 : 12,
              color: INK_2,
              marginTop: 6,
              letterSpacing: "-0.005em",
              lineHeight: 1.4,
            }}
          >
            {sub}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContextStudentIcon: React.FC<{ size: number; accent: string }> = ({ size, accent }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Cursor + click */}
    <path d="M 12 12 L 24 20 L 18 22 L 22 30 L 19 32 L 15 24 L 10 24 Z" fill={accent} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M 28 8 L 32 8 M 30 6 L 30 10" stroke={accent} strokeWidth={2} strokeLinecap="round" />
    <path d="M 30 26 L 34 26 M 32 24 L 32 28" stroke={accent} strokeWidth={2} strokeLinecap="round" />
  </svg>
);

const ContextTeacherIcon: React.FC<{ size: number; accent: string }> = ({ size, accent }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Mini calendar with auto-fill sparkle */}
    <rect x={6} y={9} width={22} height={22} rx={3} fill="none" stroke={accent} strokeWidth={2} />
    <line x1={6} y1={15} x2={28} y2={15} stroke={accent} strokeWidth={2} />
    <rect x={9} y={18} width={4} height={4} fill={accent} />
    <rect x={15} y={18} width={4} height={4} fill={accent} opacity={0.6} />
    <rect x={9} y={24} width={4} height={4} fill={accent} opacity={0.6} />
    <rect x={15} y={24} width={4} height={4} fill={accent} />
    <rect x={21} y={18} width={4} height={4} fill={accent} opacity={0.4} />
    {/* Sparkle */}
    <path d="M 30 24 L 32 27 L 35 24 M 32 22 L 32 30" stroke={accent} strokeWidth={1.6} strokeLinecap="round" />
    <circle cx={32} cy={26} r={7} fill="none" stroke={accent} strokeWidth={1.4} strokeDasharray="2 2" opacity={0.7} />
  </svg>
);

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

// Local frames (240 total).
//   0–25   title in
//   25–105 amber fills 0 → 90% + early "100% pour vous" callout appears
//   105–140 blue fills top 10% (visible split emerges) + 2px separator
//   140–145 brief hold on the finished jar
//   145–170 arrows + labels draw in
//   170–240 hold with subtle throb — 70f reading time to let the trust
//           message ("cut only after your revenue takes off") sink in
const T4_TITLE_IN = 8;
const T4_FILL_START = 25;
const T4_AMBER_END = 105;
const T4_BLUE_END = 140;
const T4_ARROWS_IN = 145;
const T4_HOLD_START = 175;

const SceneVase: React.FC<{ localFrame: number; layout: HeroLayout }> = ({
  localFrame,
  layout,
}) => {
  const vaseH = layout === "wide" ? 300 : 250;
  const vaseW = vaseH * 0.78;
  const cx = HERO_WIDTH / 2;
  // cy nudged down again (was +60 → +80) to compensate for SAFE_TOP moving
  // from 260 → 300: the title block anchored to SAFE_TOP now ends near Y=398
  // (kicker+headline+subtitle ≈ 98px tall), so the jar top at Y = cy - 150
  // needs to sit around Y=430 for a clean gap. Vase bottom lands at Y=730,
  // 10px above SAFE_BOTTOM=740.
  const cy = HERO_HEIGHT / 2 + 80;

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

  // Arrows now draw in three phases: line grows from label to vase (24f, eased),
  // arrowhead pops in with elastic overshoot (POP spring), label fades in
  // slightly after the line reaches its destination.
  const lineDrawT = interpolate(
    localFrame,
    [T4_ARROWS_IN, T4_ARROWS_IN + 24],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => cubicBezier([0.5, 0, 0.2, 1], t),
    },
  );
  const arrowHeadIn = spring({
    frame: localFrame - (T4_ARROWS_IN + 20),
    fps: 30,
    config: POP,
    durationInFrames: 14,
  });
  const labelIn = interpolate(
    localFrame,
    [T4_ARROWS_IN + 14, T4_ARROWS_IN + 32],
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
          // Pin the title block to SAFE_TOP so it never crops on wide desktop
          // containers, regardless of vaseH. Previous formula
          // (cy - vaseH/2 - 160) put it at Y=220, below the SAFE_TOP line.
          top: SAFE_TOP,
          transform: "translate(-50%, 0)",
          textAlign: "center",
          maxWidth: layout === "wide" ? 900 : 620,
          width: "100%",
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        {/* Kicker + inline teacher hook + headline as ONE typographic block.
            The teacher-address ("Vous enseignez ?") is now big, WARM_2,
            same weight/size as the headline — it reads as the first half of
            a call-and-response, then the headline lands in INK as the
            answer. Bigger, easier to scan, no pill. */}
        <div
          style={{
            fontFamily: CABINET_STACK,
            fontSize: 12,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: INK_3,
            fontWeight: 700,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 8}px)`,
            marginBottom: 14,
          }}
        >
          Modèle de revenus
        </div>
        <div
          style={{
            fontFamily: CABINET_STACK,
            fontSize: layout === "wide" ? 36 : 24,
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.04,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 12}px)`,
          }}
        >
          <span style={{ color: WARM_2 }}>Vous enseignez&nbsp;?</span>{" "}
          <span style={{ color: INK }}>Vous gagnez d&rsquo;abord.</span>
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
          Notre part démarre uniquement quand vos revenus décollent.
        </div>
      </div>

      {/* Amphora — throb once everything settled */}
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: vaseW,
          height: vaseH,
          transform: (() => {
            const throb =
              localFrame > T4_HOLD_START
                ? 1 + Math.sin((localFrame - T4_HOLD_START) * 0.18) * 0.012
                : 1;
            return `translate(-50%, -50%) scale(${throb})`;
          })(),
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

      {/* Labelled arrows — line draws in, arrowhead pops, then label fades */}
      {(lineDrawT > 0.005 || labelIn > 0.005) && (
        <VaseAnnotations
          cx={cx}
          cy={cy}
          vaseW={vaseW}
          vaseH={vaseH}
          layout={layout}
          lineDrawT={lineDrawT}
          headIn={arrowHeadIn}
          labelIn={labelIn}
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

  // Sine-wobble edge sampled left→right (open polyline, no closing). Layered
  // two-frequency ripple gives a more dynamic surface than a single sine.
  const wobbleEdge = (yBase: number, direction: "ltr" | "rtl" = "ltr") => {
    const steps = 14;
    const ampBase = 3.6;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = t * vbW;
      const wave =
        Math.sin(t * Math.PI * 3 + localFrame * 0.22) * ampBase +
        Math.sin(t * Math.PI * 6 - localFrame * 0.14) * (ampBase * 0.35);
      pts.push({ x, y: yBase + wave });
    }
    if (direction === "rtl") pts.reverse();
    return pts;
  };

  // Amber fill: wobble top (when there's no blue above) or flat top (when
  // capped by blue) — either way, closes down to the jar interior floor.
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

  // Blue band: wobble on top (blueTop), flat on bottom (amberTop).
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
    <svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={clipId}>
          <path d={path} />
        </clipPath>
      </defs>
      {/* Vase body */}
      <path d={path} fill={SURFACE} />
      {/* Amber region — clipped to jar */}
      {amberPct > 0.01 && (
        <g clipPath={`url(#${clipId})`}>
          <path d={amberPath} fill={WARM} />
        </g>
      )}
      {/* Blue band on top (only in the 10% cap), clipped to jar */}
      {hasBlue && (
        <g clipPath={`url(#${clipId})`}>
          <path d={bluePath} fill={COOL} />
          {/* Crisp 2px separator marking the split */}
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
  lineDrawT: number;
  headIn: number;
  labelIn: number;
}> = ({ cx, cy, vaseW, vaseH, layout, lineDrawT, headIn, labelIn }) => {
  // Arrow lines anchor to the vase and stretch outward to text labels
  const isWide = layout === "wide";
  const labelDist = isWide ? 240 : 140;
  const amberY = cy + vaseH * 0.18;
  const blueY = cy - vaseH * 0.42;
  const vaseLeftX = cx - vaseW * 0.35;
  const vaseRightX = cx + vaseW * 0.35;

  const leftLinePath = `M ${vaseLeftX - labelDist + 30} ${amberY} Q ${vaseLeftX - labelDist / 2} ${amberY - 8} ${vaseLeftX - 10} ${amberY}`;
  const rightLinePath = `M ${vaseRightX + labelDist - 30} ${blueY} Q ${vaseRightX + labelDist / 2} ${blueY + 8} ${vaseRightX + 10} ${blueY}`;
  // pathLength=1 normalizes the stroke length so dasharray/offset just take
  // values in [0,1] regardless of the actual curve length.
  const dashOffset = 1 - lineDrawT;

  return (
    <>
      <svg
        width={HERO_WIDTH}
        height={HERO_HEIGHT}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Left arrow — line draws from label toward vase */}
        <path
          d={leftLinePath}
          fill="none"
          stroke={INK}
          strokeWidth={1.8}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={dashOffset}
        />
        {/* Left arrowhead — pops with elastic overshoot at the destination */}
        {headIn > 0.01 && (
          <g
            transform={`translate(${vaseLeftX - 10} ${amberY}) scale(${headIn}) translate(${-(vaseLeftX - 10)} ${-amberY})`}
            opacity={Math.min(1, headIn)}
          >
            <path
              d={`M ${vaseLeftX - 22} ${amberY - 8} L ${vaseLeftX - 10} ${amberY} L ${vaseLeftX - 22} ${amberY + 8}`}
              fill="none"
              stroke={INK}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
        {/* Right arrow — line draws from label toward vase */}
        <path
          d={rightLinePath}
          fill="none"
          stroke={INK}
          strokeWidth={1.8}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={dashOffset}
        />
        {/* Right arrowhead — pops at the destination */}
        {headIn > 0.01 && (
          <g
            transform={`translate(${vaseRightX + 10} ${blueY}) scale(${headIn}) translate(${-(vaseRightX + 10)} ${-blueY})`}
            opacity={Math.min(1, headIn)}
          >
            <path
              d={`M ${vaseRightX + 22} ${blueY - 8} L ${vaseRightX + 10} ${blueY} L ${vaseRightX + 22} ${blueY + 8}`}
              fill="none"
              stroke={INK}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>

      {/* Left label — Vos revenus */}
      <div
        style={{
          position: "absolute",
          left: vaseLeftX - labelDist - (isWide ? 220 : 130),
          top: amberY - 30,
          width: isWide ? 220 : 130,
          textAlign: "right",
          opacity: labelIn,
          transform: `translateX(${(1 - labelIn) * -12}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: CABINET_STACK,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: WARM_2,
            marginBottom: 4,
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: 3, background: WARM }} />
          Au démarrage
        </div>
        <div
          style={{
            fontFamily: CABINET_STACK,
            fontSize: isWide ? 26 : 20,
            fontWeight: 800,
            color: INK,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          Zéro commission
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
          Le temps de construire votre audience.
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
          opacity: labelIn,
          transform: `translateX(${(1 - labelIn) * 12}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: CABINET_STACK,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: COOL_2,
            marginBottom: 4,
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: 3, background: COOL }} />
          Après le décollage
        </div>
        <div
          style={{
            fontFamily: CABINET_STACK,
            fontSize: isWide ? 26 : 20,
            fontWeight: 800,
            color: INK,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          Part calculée sur vos revenus
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
          Active une fois votre pratique installée.
        </div>
      </div>
    </>
  );
};

/* ==========================================================================
 * Scene 5 · Mosaic — 4-panel dashboard summary + central stamp
 *   Panels: Student hub · Teacher super-app · Comms suite · Agency mode
 * ========================================================================== */

// Local frames (190 total):
//   0        first panel enters (SMOOTH_ENTRY — soft, minimal overshoot)
//   20/40/60 remaining panels cascade in with a 20f stagger so each card
//           gets its own beat instead of overlapping the previous one's
//           settle. Card 4 lands at ~f60; SMOOTH_ENTRY settles by ~f75.
//   60–142  each panel's inner motif animates through its states
//   142–150 panels sit fully settled — brief read hold before the stamp
//   150–170 central stamp scales up over intersection (POP)
//   170–190 hold, subtle throb on stamp (freeze clamp at f170)
const T5_PANEL_STAGGER = 20;
const T5_STAMP_IN = 150;

const SceneMosaic: React.FC<{ localFrame: number; layout: HeroLayout }> = ({
  localFrame,
  layout,
}) => {
  const { fps } = useVideoConfig();

  const isWide = layout === "wide";
  // v8 — aggressive shrink targeting mid-size screens (laptops / tablets).
  // The video renders at 1600×1000 but is often displayed inside a container
  // that has ~24-48px of chrome; when it scales down to a 900-1200px viewport
  // the effective panel size gets small fast. So we start smaller and rely on
  // bigger typography + fewer content per panel instead of pixel density.
  //
  //   wide     grid 960×400 → exactly fills the [SAFE_TOP, SAFE_BOTTOM] band
  //   compact  grid 680×620 → portrait-friendly, generous side margin
  const gridW = isWide ? 960 : 680;
  const gridH = isWide ? 400 : 620;
  const gutter = isWide ? 18 : 14;
  const panelW = (gridW - gutter) / 2;
  const panelH = (gridH - gutter) / 2;
  const cx = HERO_WIDTH / 2;
  // Wide cy = center of the [SAFE_TOP, SAFE_BOTTOM] band (Y=520 = 300+220).
  // Panel top-row starts at Y = 520 - 200 = 320, safely below the TL notch's
  // typical reach (~290–330 at r ≤ 2.5). Bottom row ends at Y = 720 — 20px
  // above SAFE_BOTTOM=740, so the previously-clipped inner corners of the
  // bottom panels now clear the BC pill notch too. Compact keeps a small
  // downward nudge so the head text isn't kissing the composition's top edge.
  const cy = isWide
    ? (SAFE_TOP + SAFE_BOTTOM) / 2
    : HERO_HEIGHT / 2 + 30;

  const panels: Array<{
    col: 0 | 1;
    row: 0 | 1;
    kicker: string;
    title: string;
    render: (p: { w: number; h: number; local: number }) => React.ReactNode;
  }> = [
    {
      col: 0,
      row: 0,
      kicker: "Élève",
      title: "Trouvez",
      render: (p) => (
        <StudentHubMotif width={p.w} height={p.h} local={p.local} />
      ),
    },
    {
      col: 1,
      row: 0,
      kicker: "Prof",
      title: "Encaissez",
      render: (p) => (
        <TeacherAppMotif width={p.w} height={p.h} local={p.local} />
      ),
    },
    {
      col: 0,
      row: 1,
      kicker: "Ensemble",
      title: "Échangez",
      render: (p) => <CommsMotif width={p.w} height={p.h} local={p.local} />,
    },
    {
      col: 1,
      row: 1,
      kicker: "Équipe",
      title: "Grandissez",
      render: (p) => <AgencyMotif width={p.w} height={p.h} local={p.local} />,
    },
  ];

  // Central stamp — pops after all four panels are on screen
  const stampSpring = spring({
    frame: localFrame - T5_STAMP_IN,
    fps,
    config: POP,
  });
  const throb = 1 + Math.sin(localFrame * 0.11) * 0.02;
  // Stamp scaled down again for v8: with the smaller grid it now spans ~35%
  // of the shortest side so it never eclipses the surrounding panel content,
  // even on mid-size laptops/tablets.
  const stampSize = isWide ? 180 : 150;

  return (
    <>
      {panels.map((p, i) => {
        const enter = spring({
          frame: localFrame - i * T5_PANEL_STAGGER,
          fps,
          config: SMOOTH_ENTRY,
        });
        if (enter < 0.01) return null;
        const px = cx - gridW / 2 + p.col * (panelW + gutter);
        const py = cy - gridH / 2 + p.row * (panelH + gutter);
        const originX = p.col === 0 ? "100%" : "0%";
        const originY = p.row === 0 ? "100%" : "0%";
        // Local frame inside the panel — motifs read this to time their beat
        const inner = Math.max(0, localFrame - i * T5_PANEL_STAGGER - 10);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: panelW,
              height: panelH,
              transform: `scale(${enter})`,
              transformOrigin: `${originX} ${originY}`,
              opacity: enter,
            }}
          >
            <div style={{ position: "absolute", inset: 0 }}>
              <InkedRect
                width={panelW}
                height={panelH}
                radius={22}
                fill={SURFACE}
                shadow="0 20px 36px -20px rgba(14,17,22,0.20)"
                overshoot={2.5}
              />
            </div>
            {/* Panel head — compact single-line kicker + title */}
            <div
              style={{
                position: "absolute",
                left: isWide ? 22 : 18,
                right: isWide ? 22 : 18,
                top: isWide ? 18 : 18,
                display: "flex",
                alignItems: "baseline",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontFamily: CABINET_STACK,
                  fontSize: isWide ? 24 : 21,
                  fontWeight: 800,
                  color: INK,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.02,
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  fontFamily: CABINET_STACK,
                  fontSize: isWide ? 10 : 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: INK_3,
                  fontWeight: 700,
                }}
              >
                {p.kicker}
              </div>
            </div>
            {/* Motif area — fills the panel below the head. Chrome tightened
                (top 60→50, bottom 22→16) to give the motif ~16px more room
                inside the shorter panels used at the new gridH. */}
            <div
              style={{
                position: "absolute",
                left: isWide ? 22 : 18,
                right: isWide ? 22 : 18,
                top: isWide ? 50 : 52,
                bottom: isWide ? 16 : 14,
                overflow: "hidden",
              }}
            >
              {p.render({
                w: panelW - (isWide ? 44 : 36),
                h: panelH - (isWide ? 66 : 66),
                local: inner,
              })}
            </div>
          </div>
        );
      })}

      {/* Central stamp — hand-drawn seal that anchors the ecosystem */}
      {stampSpring > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            width: stampSize,
            height: stampSize,
            transform: `translate(-50%, -50%) scale(${stampSpring * throb}) rotate(-6deg)`,
            opacity: stampSpring,
          }}
        >
          <div style={{ position: "absolute", inset: 0 }}>
            <InkedCircle
              size={stampSize}
              fill={WARM}
              stroke={INK}
              strokeWidth={3.2}
              shadow="0 20px 40px -18px rgba(14,17,22,0.35)"
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              padding: isWide ? 22 : 18,
              textAlign: "center",
              color: INK,
              fontFamily: "var(--font-caveat), 'Caveat', cursive",
              fontWeight: 700,
              fontSize: isWide ? 30 : 24,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              transform: "rotate(2deg)",
            }}
          >
            Tout ce qu&rsquo;il faut pour enseigner.
          </div>
          {/* Inner ring hint */}
          <svg
            width={stampSize}
            height={stampSize}
            viewBox={`0 0 ${stampSize} ${stampSize}`}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <circle
              cx={stampSize / 2}
              cy={stampSize / 2}
              r={stampSize / 2 - 12}
              fill="none"
              stroke={INK}
              strokeWidth={1.2}
              strokeDasharray="3 5"
              opacity={0.55}
            />
          </svg>
        </div>
      )}
    </>
  );
};

/* ---------- Scene 5 motifs ---------- */

/** Student hub: mini course-card carousel morphs into a pulsing request icon,
 *  landing on a "chosen professor" tile. */
const StudentHubMotif: React.FC<{ width: number; height: number; local: number }>
  = ({ width, height, local }) => {
  const phase =
    local < 34 ? "carousel" : local < 58 ? "request" : "chosen";

  // Carousel rotation — 3 stacked cards fanned to the right
  const carouselIn = Math.min(1, Math.max(0, local / 16));
  const carouselOut = 1 - Math.min(1, Math.max(0, (local - 30) / 8));
  const carouselOpacity = Math.min(carouselIn, carouselOut);

  const requestIn = Math.min(1, Math.max(0, (local - 30) / 12));
  const requestOut = 1 - Math.min(1, Math.max(0, (local - 54) / 8));
  const requestOpacity = Math.min(requestIn, requestOut);
  const requestPulse = 1 + Math.sin(local * 0.32) * 0.05;

  const chosenIn = Math.min(1, Math.max(0, (local - 54) / 14));

  const cardW = width * 0.5;
  const cardH = height * 0.55;
  const cx = width / 2;
  const cy = height / 2;

  return (
    <div style={{ position: "relative", width, height }}>
      {phase === "carousel" || carouselOpacity > 0.01 ? (
        <div style={{ opacity: carouselOpacity }}>
          {[-1, 0, 1].map((i) => {
            const shift = i * 26 - local * 0.6;
            const rot = i * 3;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: cx + shift,
                  top: cy - cardH / 2,
                  width: cardW,
                  height: cardH,
                  transform: `translate(-50%, 0) rotate(${rot}deg)`,
                  zIndex: 10 - Math.abs(i),
                }}
              >
                <MiniCourseCard
                  width={cardW}
                  height={cardH}
                  color={i === 0 ? COOL : i === -1 ? WARM : PLATFORM}
                  letter={i === 0 ? "S" : i === -1 ? "K" : "Y"}
                  label={i === 0 ? "Espagnol" : i === -1 ? "Piano" : "React"}
                />
              </div>
            );
          })}
        </div>
      ) : null}

      {requestOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            transform: `translate(-50%, -50%) scale(${requestPulse})`,
            opacity: requestOpacity,
          }}
        >
          <RequestIcon size={Math.min(width, height) * 0.55} accent={COOL_2} />
        </div>
      )}

      {chosenIn > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            width: cardW * 1.1,
            height: cardH,
            transform: `translate(-50%, -50%) scale(${0.9 + chosenIn * 0.1})`,
            opacity: chosenIn,
          }}
        >
          <MiniCourseCard
            width={cardW * 1.1}
            height={cardH}
            color={COOL_2}
            letter="S"
            label="Sofia · Espagnol"
            highlight
          />
        </div>
      )}
    </div>
  );
};

/** Teacher super-app: metrics graph curves upward, then morphs into a
 *  wallet with a pulsing green lock. */
const TeacherAppMotif: React.FC<{ width: number; height: number; local: number }>
  = ({ width, height, local }) => {
  const graphOut = 1 - Math.min(1, Math.max(0, (local - 34) / 10));
  const graphIn = Math.min(1, Math.max(0, local / 14));
  const graphOpacity = Math.min(graphIn, graphOut);

  const walletIn = Math.min(1, Math.max(0, (local - 30) / 14));
  const lockPulse = 1 + Math.sin(local * 0.28) * 0.08;

  const cx = width / 2;
  const cy = height / 2;
  const gw = width * 0.86;
  const gh = height * 0.7;
  const gx = cx - gw / 2;
  const gy = cy - gh / 2;

  // Rising sparkline — animate the endpoint reaching further right.
  const revealT = Math.min(1, local / 22);
  const pts: string[] = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    if (t > revealT) break;
    const x = gx + t * gw;
    // Rising curve with a small dip
    const yNorm =
      0.75 - t * 0.55 + Math.sin(t * Math.PI * 2.2) * 0.06 * (1 - t * 0.5);
    const y = gy + yNorm * gh;
    pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }
  const sparkPath = pts.join(" ");
  const endX = gx + Math.min(1, revealT) * gw;
  const endYNorm =
    0.75 - Math.min(1, revealT) * 0.55 +
    Math.sin(Math.min(1, revealT) * Math.PI * 2.2) * 0.06;
  const endY = gy + endYNorm * gh;

  return (
    <div style={{ position: "relative", width, height }}>
      {graphOpacity > 0.01 && (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: "absolute", inset: 0, opacity: graphOpacity }}
        >
          {/* Grid hairlines */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={gx}
              y1={gy + (i * gh) / 3}
              x2={gx + gw}
              y2={gy + (i * gh) / 3}
              stroke={HAIRLINE}
              strokeWidth={1}
            />
          ))}
          {/* Area fill under curve */}
          <path
            d={`${sparkPath} L ${endX} ${gy + gh} L ${gx} ${gy + gh} Z`}
            fill={COOL_SOFT}
          />
          <path
            d={sparkPath}
            fill="none"
            stroke={COOL_2}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Ascending arrow tip */}
          <circle cx={endX} cy={endY} r={5} fill={COOL_2} />
          <path
            d={`M ${endX - 10} ${endY + 4} L ${endX} ${endY - 6} L ${endX + 10} ${endY + 4}`}
            fill="none"
            stroke={COOL_2}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Axis label — DA/mois */}
          <text
            x={gx + 6}
            y={gy + 16}
            fill={INK_3}
            fontSize={11}
            fontWeight={700}
            style={{ letterSpacing: "0.14em" }}
          >
            DA / MOIS
          </text>
        </svg>
      )}

      {walletIn > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            transform: `translate(-50%, -50%) scale(${0.85 + walletIn * 0.15})`,
            opacity: walletIn,
          }}
        >
          <WalletIcon
            width={Math.min(width * 0.86, 260)}
            height={Math.min(height * 0.62, 120)}
            lockPulse={lockPulse}
          />
        </div>
      )}
    </div>
  );
};

/** Comms suite: chat bubble morphs into video camera + undulating soundwave. */
const CommsMotif: React.FC<{ width: number; height: number; local: number }> = ({
  width,
  height,
  local,
}) => {
  const bubbleIn = Math.min(1, Math.max(0, local / 14));
  const bubbleOut = 1 - Math.min(1, Math.max(0, (local - 30) / 10));
  const bubbleOpacity = Math.min(bubbleIn, bubbleOut);

  const camIn = Math.min(1, Math.max(0, (local - 26) / 14));

  const cx = width / 2;
  const cy = height / 2;
  const bubbleSize = Math.min(width * 0.42, 150);
  const camW = Math.min(width * 0.78, 260);
  const camH = Math.min(height * 0.6, 140);

  return (
    <div style={{ position: "relative", width, height }}>
      {bubbleOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            transform: `translate(-50%, -50%) scale(${0.88 + bubbleIn * 0.12})`,
            opacity: bubbleOpacity,
          }}
        >
          <ChatBubbleIcon size={bubbleSize} accent={COOL_2} />
        </div>
      )}

      {camIn > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            transform: `translate(-50%, -50%) scale(${0.85 + camIn * 0.15})`,
            opacity: camIn,
          }}
        >
          <CameraWithWave
            width={camW}
            height={camH}
            local={local}
            accent={COOL_2}
          />
        </div>
      )}
    </div>
  );
};

/** Agency mode: a wide base brick drops, two smaller bricks land on top,
 *  then a POP banner crowns the stack. */
const AgencyMotif: React.FC<{ width: number; height: number; local: number }> = ({
  width,
  height,
  local,
}) => {
  const { fps } = useVideoConfig();
  const baseIn = spring({ frame: local, fps, config: SETTLE });
  const brick1In = spring({ frame: local - 14, fps, config: SETTLE });
  const brick2In = spring({ frame: local - 20, fps, config: SETTLE });
  const bannerIn = spring({ frame: local - 32, fps, config: POP });

  const baseW = width * 0.72;
  const baseH = height * 0.22;
  const smallW = baseW * 0.48;
  const smallH = baseH;
  const cx = width / 2;
  const floorY = height - 12;

  const baseTop = floorY - baseH;
  const smallTop = baseTop - smallH - 4;

  const bannerW = baseW * 0.6;
  const bannerH = baseH * 1.1;
  const bannerTop = smallTop - bannerH - 6;

  return (
    <div style={{ position: "relative", width, height }}>
      {/* Base brick (solo teacher) */}
      <div
        style={{
          position: "absolute",
          left: cx,
          top: baseTop + (1 - baseIn) * 60,
          width: baseW,
          height: baseH,
          transform: `translate(-50%, 0)`,
          opacity: baseIn,
        }}
      >
        <InkedRect
          width={baseW}
          height={baseH}
          radius={8}
          fill={PLATFORM}
          stroke={INK}
          overshoot={1.5}
        />
      </div>
      {/* Two smaller bricks */}
      {[-1, 1].map((side) => {
        const t = side === -1 ? brick1In : brick2In;
        if (t < 0.01) return null;
        return (
          <div
            key={side}
            style={{
              position: "absolute",
              left: cx + side * (smallW / 2 + 2),
              top: smallTop + (1 - t) * 80,
              width: smallW,
              height: smallH,
              transform: `translate(-50%, 0)`,
              opacity: t,
            }}
          >
            <InkedRect
              width={smallW}
              height={smallH}
              radius={8}
              fill={side === -1 ? COOL : WARM}
              stroke={INK}
              overshoot={1.5}
            />
          </div>
        );
      })}
      {/* Crowning banner */}
      {bannerIn > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: bannerTop,
            width: bannerW,
            height: bannerH,
            transform: `translate(-50%, 0) scale(${bannerIn})`,
            transformOrigin: "50% 100%",
            opacity: bannerIn,
          }}
        >
          <div style={{ position: "absolute", inset: 0 }}>
            <InkedRect
              width={bannerW}
              height={bannerH}
              radius={10}
              fill={INK}
              stroke={INK}
              overshoot={1.5}
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: "white",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            Agence
          </div>
          {/* Little triangle notch under the banner */}
          <svg
            width={16}
            height={10}
            viewBox="0 0 16 10"
            style={{
              position: "absolute",
              left: "50%",
              bottom: -9,
              transform: "translate(-50%, 0)",
            }}
          >
            <path d="M 0 0 L 16 0 L 8 10 Z" fill={INK} />
          </svg>
        </div>
      )}
    </div>
  );
};

/* ---------- Mini icons used by mosaic motifs ---------- */

const MiniCourseCard: React.FC<{
  width: number;
  height: number;
  color: string;
  letter: string;
  label: string;
  highlight?: boolean;
}> = ({ width, height, color, letter, label, highlight }) => (
  <div style={{ position: "relative", width, height }}>
    <InkedRect
      width={width}
      height={height}
      radius={14}
      fill={highlight ? "rgba(47, 111, 235, 0.10)" : SURFACE}
      stroke={highlight ? COOL_2 : INK}
      strokeMid={highlight ? 1.6 : 1.3}
      overshoot={1.5}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{ position: "relative", width: 32, height: 32, flex: "0 0 32px" }}>
        <InkedCircle size={32} fill={color} strokeWidth={1.5} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            color: "white",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {letter}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: INK,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 10,
            color: INK_3,
            marginTop: 2,
            letterSpacing: "0.08em",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {highlight ? "Choisi" : "Cours"}
        </div>
      </div>
    </div>
  </div>
);

const RequestIcon: React.FC<{ size: number; accent: string }> = ({ size, accent }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    {/* Doc silhouette */}
    <path
      d="M 24 14 L 66 14 L 82 30 L 82 86 L 24 86 Z"
      fill={SURFACE}
      stroke={INK}
      strokeWidth={2.6}
      strokeLinejoin="round"
    />
    <path d="M 66 14 L 66 30 L 82 30" fill="none" stroke={INK} strokeWidth={2.2} />
    {/* Bullet lines */}
    <line x1={34} y1={44} x2={72} y2={44} stroke={INK_2} strokeWidth={2.4} strokeLinecap="round" />
    <line x1={34} y1={54} x2={68} y2={54} stroke={INK_2} strokeWidth={2.4} strokeLinecap="round" />
    <line x1={34} y1={64} x2={62} y2={64} stroke={INK_2} strokeWidth={2.4} strokeLinecap="round" />
    {/* Send arrow badge */}
    <circle cx={78} cy={78} r={16} fill={accent} stroke={INK} strokeWidth={2.4} />
    <path
      d="M 71 78 L 84 78 M 79 73 L 84 78 L 79 83"
      fill="none"
      stroke="white"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WalletIcon: React.FC<{ width: number; height: number; lockPulse: number }> = ({
  width,
  height,
  lockPulse,
}) => (
  // viewBox height reduced from 140 → 120 and every child kept strictly
  // inside [12, 108] vertically. The bill no longer peeks out the top —
  // the amount lives on the wallet face as a "solde" line, no overflow
  // possible under any parent scale.
  <svg
    width={width}
    height={height}
    viewBox="0 0 260 120"
    preserveAspectRatio="xMidYMid meet"
    style={{ overflow: "hidden" }}
  >
    {/* Wallet body — full viewBox, safe inset */}
    <path
      d="M 20 20 Q 20 8 32 8 L 228 8 Q 240 8 240 20 L 240 100 Q 240 112 228 112 L 32 112 Q 20 112 20 100 Z"
      fill={SURFACE}
      stroke={INK}
      strokeWidth={2.6}
    />
    {/* Fold line */}
    <path
      d="M 20 44 L 240 44"
      fill="none"
      stroke={INK}
      strokeWidth={1.4}
      opacity={0.4}
    />
    {/* Solde label */}
    <text
      x={34}
      y={30}
      fontSize={10}
      fontWeight={700}
      fill={INK_3}
      style={{ letterSpacing: "0.22em" }}
    >
      SOLDE
    </text>
    {/* Big amount — sits ON the wallet face, always inside */}
    <text
      x={34}
      y={78}
      fontSize={30}
      fontWeight={800}
      fill={INK}
      style={{ letterSpacing: "-0.02em" }}
    >
      12 000
    </text>
    <text
      x={162}
      y={78}
      fontSize={14}
      fontWeight={700}
      fill={INK_2}
      style={{ letterSpacing: "0.08em" }}
    >
      DA
    </text>
    {/* Escrow tag */}
    <text
      x={34}
      y={100}
      fontSize={9}
      fontWeight={700}
      fill={INK_3}
      style={{ letterSpacing: "0.18em" }}
    >
      SÉCURISÉ · ESCROW
    </text>
    {/* Secure lock badge (pulsing green) — moved fully inside, safe origin */}
    <g transform={`translate(210 78) scale(${lockPulse})`}>
      <circle cx={0} cy={0} r={20} fill="#1E9E5F" stroke={INK} strokeWidth={2.4} />
      <path
        d="M -5 -2 L -5 -5 Q -5 -10 0 -10 Q 5 -10 5 -5 L 5 -2"
        fill="none"
        stroke="white"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <rect x={-7} y={-2} width={14} height={11} rx={2} fill="white" />
    </g>
  </svg>
);

const ChatBubbleIcon: React.FC<{ size: number; accent: string }> = ({ size, accent }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <path
      d="M 14 26 Q 14 14 26 14 L 74 14 Q 86 14 86 26 L 86 60 Q 86 72 74 72 L 44 72 L 28 86 L 32 72 L 26 72 Q 14 72 14 60 Z"
      fill={SURFACE}
      stroke={INK}
      strokeWidth={2.8}
      strokeLinejoin="round"
    />
    <circle cx={34} cy={43} r={3.4} fill={accent} />
    <circle cx={50} cy={43} r={3.4} fill={accent} />
    <circle cx={66} cy={43} r={3.4} fill={accent} />
  </svg>
);

const CameraWithWave: React.FC<{
  width: number;
  height: number;
  local: number;
  accent: string;
}> = ({ width, height, local, accent }) => {
  const vbW = 260;
  const vbH = 140;
  // Undulating soundwave bars — 12 bars sine-modulated
  const barCount = 12;
  const barW = 5;
  const barGap = 4;
  const barsWidth = barCount * barW + (barCount - 1) * barGap;
  const barsX = 148;
  const barsY = vbH / 2;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`} style={{ overflow: "visible" }}>
      {/* Camera body */}
      <rect x={14} y={30} width={124} height={80} rx={12} fill={SURFACE} stroke={INK} strokeWidth={2.8} />
      {/* Lens */}
      <circle cx={76} cy={70} r={22} fill={SURFACE_2} stroke={INK} strokeWidth={2.4} />
      <circle cx={76} cy={70} r={10} fill={INK} />
      <circle cx={72} cy={66} r={3} fill="white" opacity={0.6} />
      {/* REC dot */}
      <circle cx={124} cy={40} r={4} fill="#E33" />
      {/* Sound bars */}
      {Array.from({ length: barCount }).map((_, i) => {
        const t = i / (barCount - 1);
        const h = 14 + Math.abs(Math.sin(local * 0.28 + t * Math.PI * 2)) * 34;
        return (
          <rect
            key={i}
            x={barsX + i * (barW + barGap)}
            y={barsY - h / 2}
            width={barW}
            height={h}
            rx={2}
            fill={accent}
          />
        );
      })}
      {/* Baseline under bars */}
      <line
        x1={barsX}
        y1={barsY + 34}
        x2={barsX + barsWidth}
        y2={barsY + 34}
        stroke={INK_3}
        strokeWidth={1.2}
      />
    </svg>
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
            fontFamily: CABINET_STACK,
            fontSize: layout === "wide" ? 30 : 22,
            fontWeight: 500,
            letterSpacing: "-0.025em",
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
