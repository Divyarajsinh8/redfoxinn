/**
 * One-shot: build the full brand asset set from the source PNGs in Downloads.
 * Outputs:
 *   public/favicon.ico                                  (16/32/48 multi-res, fox mark only)
 *   public/favicon.svg                                  -- skipped (no SVG source provided)
 *   public/apple-touch-icon.png                         (180x180, fox mark)
 *   public/icon-192.png                                 (192x192, fox mark — PWA/Android)
 *   public/icon-512.png                                 (512x512, fox mark — PWA)
 *   public/images/brand/fox-mark.webp                   (square fox mark for in-page use)
 *   public/images/brand/fox-mark-512.png                (square fox mark, PNG fallback)
 *   public/images/brand/fox-logo.png                    (overwrite — used in JSON-LD logo URL)
 *   public/images/brand/lockup-dark.webp                (header logo for dark backgrounds)
 *   public/images/brand/lockup-light.webp               (lockup for light backgrounds)
 *   public/images/brand/lockup-stacked.webp             (vertical stacked lockup)
 *   public/images/brand/og-image.jpg                    (regenerated with new lockup, 1200×630)
 *
 * Run with: node scripts/generate-brand-assets.mjs
 */
import sharp from 'sharp';
import toIco from 'to-ico';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DL = 'C:/Users/saffr/Downloads';
const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/(\w):\//, '$1:/');
const PUB = join(ROOT, 'public');
const BRAND = join(PUB, 'images/brand');

const SRC = {
  lockupLight: join(DL, '1A. Horizontal lockup — logo + wordmark (light background).png'),
  lockupDark:  join(DL, '1B. Horizontal lockup — dark background version.png'),
  stacked:     join(DL, '1C. Stackedvertical lockup — logo above wordmark.png'),
  badge:       join(DL, '1D. Logo mark in circle badge (for social avatars).png'),
  whiteRev:    join(DL, '1G. Whitereversed version.png'),
};

const fmt = (n) => (n / 1024).toFixed(1).padStart(7) + ' KB';

// -- Helper: trim white margins, return Sharp instance
const trimWhite = (src) =>
  sharp(src).trim({ background: { r: 255, g: 255, b: 255, alpha: 0 }, threshold: 8 });

// =====================================================================
// 1. FOX MARK (square, transparent bg) — extracted from stacked lockup
// =====================================================================
console.log('=== Fox mark (favicon source) ===');

// 1C is stacked: fox on top, wordmark below. Take top ~55% then trim.
const stackedMeta = await sharp(SRC.stacked).metadata();
const topRegion = await sharp(SRC.stacked)
  .extract({
    left: 0,
    top: 0,
    width: stackedMeta.width,
    height: Math.floor(stackedMeta.height * 0.55),
  })
  .toBuffer();
// Trim the white background, ensure transparent PNG output.
const foxTrimmed = await sharp(topRegion)
  .flatten({ background: { r: 255, g: 255, b: 255 } }) // ensure no transparency artifacts
  .trim({ threshold: 12 })
  .toBuffer();
const foxMeta = await sharp(foxTrimmed).metadata();
console.log(`  trimmed fox mark: ${foxMeta.width} × ${foxMeta.height}`);

// Re-pad to perfect square with white background so favicons render predictably
const max = Math.max(foxMeta.width, foxMeta.height);
const padded = await sharp(foxTrimmed)
  .extend({
    top: Math.floor((max - foxMeta.height) / 2),
    bottom: Math.ceil((max - foxMeta.height) / 2),
    left: Math.floor((max - foxMeta.width) / 2),
    right: Math.ceil((max - foxMeta.width) / 2),
    background: { r: 255, g: 255, b: 255 },
  })
  .toBuffer();

// Web-friendly fox mark, transparent-style on cream-white
await sharp(padded).resize(1024, 1024).webp({ quality: 92 }).toFile(join(BRAND, 'fox-mark.webp'));
await sharp(padded).resize(512, 512).png({ compressionLevel: 9, palette: true }).toFile(join(BRAND, 'fox-mark-512.png'));
console.log(`  fox-mark.webp + fox-mark-512.png written`);

// =====================================================================
// 2. FAVICONS (16/32/48 .ico, 180 apple-touch, 192 + 512 PNGs)
// =====================================================================
console.log('\n=== Favicons ===');

const png16 = await sharp(padded).resize(16, 16).png().toBuffer();
const png32 = await sharp(padded).resize(32, 32).png().toBuffer();
const png48 = await sharp(padded).resize(48, 48).png().toBuffer();
const ico   = await toIco([png16, png32, png48]);
await writeFile(join(PUB, 'favicon.ico'), ico);
console.log(`  favicon.ico (16/32/48 multi-res): ${fmt(ico.length)}`);

await sharp(padded).resize(180, 180).png({ compressionLevel: 9 }).toFile(join(PUB, 'apple-touch-icon.png'));
await sharp(padded).resize(192, 192).png({ compressionLevel: 9 }).toFile(join(PUB, 'icon-192.png'));
await sharp(padded).resize(512, 512).png({ compressionLevel: 9 }).toFile(join(PUB, 'icon-512.png'));
console.log(`  apple-touch-icon.png + icon-192.png + icon-512.png`);

// JSON-LD logo URL points to /images/brand/fox-logo.png — overwrite with new mark
await sharp(padded).resize(512, 512).png({ compressionLevel: 9 }).toFile(join(BRAND, 'fox-logo.png'));
console.log(`  fox-logo.png replaced with new fox mark`);

// =====================================================================
// 3. HORIZONTAL LOCKUPS — for header use
// =====================================================================
console.log('\n=== Horizontal lockups ===');

// Dark-bg version: trim white margins, keep aspect ratio, height-based resize
async function processLockup(src, outFile, targetHeight) {
  const trimmed = await trimWhite(src).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const ratio = meta.width / meta.height;
  const targetWidth = Math.round(targetHeight * ratio);
  const info = await sharp(trimmed)
    .resize({ height: targetHeight, withoutEnlargement: true })
    .webp({ quality: 92 })
    .toFile(outFile);
  console.log(`  ${outFile.split(/[\\/]/).pop()}: ${meta.width}x${meta.height} → ${targetWidth}x${targetHeight}  ${fmt(info.size)}`);
  return { width: targetWidth, height: targetHeight };
}

// Light-bg lockup
const lockupLightDims = await processLockup(SRC.lockupLight, join(BRAND, 'lockup-light.webp'), 200);
const lockupLight2x   = await processLockup(SRC.lockupLight, join(BRAND, 'lockup-light-2x.webp'), 400);

// Dark-bg lockup — 1B has a baked dark background (won't trim with white threshold);
// 1G "white reversed" is designed for dark surfaces (white wordmark, transparent bg)
async function processReversed(src, outFile, targetHeight) {
  // Trim with default (uses corner pixel) — handles transparent OR matched bg
  const trimmed = await sharp(src).trim({ threshold: 12 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const ratio = meta.width / meta.height;
  const targetWidth = Math.round(targetHeight * ratio);
  const info = await sharp(trimmed)
    .resize({ height: targetHeight, withoutEnlargement: true })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(outFile);
  console.log(`  ${outFile.split(/[\\/]/).pop()}: ${meta.width}x${meta.height} → ${targetWidth}x${targetHeight}  ${fmt(info.size)}`);
  return { width: targetWidth, height: targetHeight };
}
// Try 1B (true horizontal dark-bg lockup) with corner-pixel trim
const lockupDarkDims = await processReversed(SRC.lockupDark, join(BRAND, 'lockup-dark.webp'), 200);
const lockupDark2x   = await processReversed(SRC.lockupDark, join(BRAND, 'lockup-dark-2x.webp'), 400);
// Also keep 1G as a "white reversed" stacked variant for places that want a square white logo
await processReversed(SRC.whiteRev, join(BRAND, 'lockup-white-stacked.webp'), 280);

// Stacked vertical (used in narrow contexts if ever needed)
await processLockup(SRC.stacked, join(BRAND, 'lockup-stacked.webp'), 280);

// =====================================================================
// 4. OG IMAGE (1200×630) — refreshed using the dark-bg lockup
// =====================================================================
console.log('\n=== OG image ===');

const W = 1200, H = 630;
const lockupForOg = await sharp(SRC.lockupDark).trim({ threshold: 8 }).resize({ height: 360, withoutEnlargement: true }).toBuffer();
const lockupOgMeta = await sharp(lockupForOg).metadata();

// SVG overlay for tagline below the lockup
const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <style>
      .tag { font-family: 'Times New Roman', serif; font-size: 26px; fill: #F5EDE4; font-weight: 300; font-style: italic; letter-spacing: 0.5px; }
      .rule { stroke: #D4691A; stroke-width: 1; opacity: 0.55; }
    </style>
  </defs>
  <line x1="${W / 2 - 60}" y1="540" x2="${W / 2 + 60}" y2="540" class="rule"/>
  <text x="${W / 2}" y="585" text-anchor="middle" class="tag">Where the North Woods welcome you home.</text>
</svg>`);

await sharp({
  create: { width: W, height: H, channels: 3, background: { r: 28, g: 20, b: 16 } }, // Night #1C1410
})
  .composite([
    {
      input: lockupForOg,
      top: Math.floor((H - lockupOgMeta.height) / 2) - 40,
      left: Math.floor((W - lockupOgMeta.width) / 2),
    },
    { input: svg, top: 0, left: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(join(BRAND, 'og-image.jpg'));
console.log(`  og-image.jpg regenerated`);

// =====================================================================
// 5. SUMMARY: log what was written + recommended HTML
// =====================================================================
console.log('\n=== Done ===\n');
console.log('Recommended HTML link block in BaseLayout <head>:');
console.log(`  <link rel="icon" href="/favicon.ico" sizes="any" />`);
console.log(`  <link rel="icon" type="image/png" sizes="32x32" href="/icon-192.png" />`); // browsers will downscale
console.log(`  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />`);
console.log(`  <link rel="manifest" href="/site.webmanifest" />  <!-- if PWA wanted -->`);
console.log(`\nLockup dims for header use (Tailwind):`);
console.log(`  lockup-dark.webp  : ${lockupDarkDims.width}x${lockupDarkDims.height}  (1x)`);
console.log(`  lockup-dark-2x    : ${lockupDark2x.width}x${lockupDark2x.height}     (retina)`);
