#!/usr/bin/env node
/**
 * Patch Remotion's bundled Windows ffmpeg with the working ffmpeg-static binary.
 *
 * Why this exists: on some Windows environments the ffmpeg.exe shipped inside
 * `@remotion/compositor-win32-x64-msvc` refuses to launch (exit -1058471934,
 * DLL-init failure signature). The renders reach 100% frame decode then crash
 * at the ffmpeg-encode/mux step, which blocks `remotion render` end-to-end.
 *
 * ffmpeg-static ships a self-contained static build (no external DLL deps) at
 * a matching FFmpeg 6.x major version, so dropping it in place resolves the
 * failure without touching the surrounding compositor DLLs used by
 * `remotion.exe` and `ffprobe.exe`.
 *
 * Runs as a `postinstall` hook so every `pnpm install` (including CI) re-patches
 * — if pnpm ever re-downloads the broken ffmpeg, the next install repairs it.
 *
 * No-ops on non-Windows platforms and when either package is unavailable.
 */

import { copyFileSync, existsSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

if (process.platform !== "win32") {
  process.exit(0);
}

const require = createRequire(import.meta.url);

let staticFfmpegPath;
try {
  const mod = require("ffmpeg-static");
  staticFfmpegPath = typeof mod === "string" ? mod : mod?.default;
} catch {
  console.warn("[fix-remotion-ffmpeg] ffmpeg-static not installed — skipping.");
  process.exit(0);
}

if (!staticFfmpegPath || !existsSync(staticFfmpegPath)) {
  console.warn(
    `[fix-remotion-ffmpeg] ffmpeg-static binary missing at ${staticFfmpegPath} — skipping.`,
  );
  process.exit(0);
}

// The compositor is a transitive dep of `@remotion/renderer` (which itself
// is a transitive of `@remotion/cli`). Under pnpm, transitives aren't
// hoisted to the project root, so resolving directly from CWD fails.
// Bootstrap the resolve chain from `@remotion/cli` (root-level dep).
let compositorDir;
try {
  const cliPkg = require.resolve("@remotion/cli/package.json");
  const cliRequire = createRequire(cliPkg);
  const rendererPkg = cliRequire.resolve("@remotion/renderer/package.json");
  const rendererRequire = createRequire(rendererPkg);
  compositorDir = path.dirname(
    rendererRequire.resolve(
      "@remotion/compositor-win32-x64-msvc/package.json",
    ),
  );
} catch {
  // Not on Windows x64 or Remotion not installed — nothing to patch.
  process.exit(0);
}

const target = path.join(compositorDir, "ffmpeg.exe");
if (!existsSync(target)) {
  console.warn(`[fix-remotion-ffmpeg] target not found: ${target} — skipping.`);
  process.exit(0);
}

// Idempotency: skip when the target already matches the ffmpeg-static byte-size.
// Cheap heuristic; the alternative (hash-compare) would rebuild each install.
if (statSync(target).size === statSync(staticFfmpegPath).size) {
  process.exit(0);
}

copyFileSync(staticFfmpegPath, target);
const mb = (statSync(target).size / 1024 / 1024).toFixed(1);
console.log(
  `[fix-remotion-ffmpeg] patched Remotion's ffmpeg with ffmpeg-static (${mb} MB).`,
);
