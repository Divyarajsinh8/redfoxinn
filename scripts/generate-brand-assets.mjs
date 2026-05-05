/**
 * Generate the full brand asset set from Raj's confirmed source PNGs.
 *
 * Source files (transparent-bg PNGs):
 *   FAVICON / fox-mark only:
 *     C:/Users/saffr/Downloads/RED_FOX_INN_FINAL_LOGO-removebg-preview.png
 *   HEADER / horizontal lockup:
 *     C:/Users/saffr/Downloads/Logo_3_Horizontal_Lockup-removebg-preview.png
 *
 * Outputs:
 *   public/favicon.ico                                  16/32/48 multi-res
 *   public/apple-touch-icon.png                         180×180
 *   public/icon-192.png                                 192×192 (Android)
 *   public/icon-512.png                                 512×512 (PWA)
 *   public/images/brand/fox-mark.webp                   1024×1024 transparent
 *   public/images/brand/fox-mark-512.png                512×512 transparent
 *   public/images/brand/fox-logo.png                    512×512 (JSON-LD publisher.logo)
 *   public/images/brand/lockup-dark.webp                horizontal lockup 1x
 *   public/images/brand/lockup-dark-2x.webp             horizontal lockup retina
 *   public/images/brand/og-image.jpg                    1200×630 social card
 *
 * Run with: node scripts/generate-brand-assets.mjs
 */
import sharp from 'sharp';
import toIco from 'to-ico';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/(\w):\//, '$1:/');
const PUB = join(ROOT, 'public');
const BRAND = join(PUB, 'images/brand');

const FOX_MARK_SRC = 'C:/Users/saffr/Downloads/RED_FOX_INN_FINAL_LOGO-removebg-preview.png';
const LOCKUP_SRC   = 'C:/Users/saffr/Downloads/Logo_3_Horizontal_Lockup-removebg-preview.png';

const fmt = (n) => (n / 1024).toFixed(1).padStart(7) + ' KB';

// ---------------------------------------------------------------
// Square the fox mark on a transparent canvas so favicons render right
// ---------------------------------------------------------------
console.log('=== FOX MARK (favicon source) ===');
const foxRaw = await sharp(FOX_MARK_SRC).trim({ threshold: 5 }).toBuffer();
const foxMeta = await sharp(foxRaw).metadata();
console.log(`  trimmed: ${foxMeta.width} × ${foxMeta.height}`);

const max = Math.max(foxMeta.width, foxMeta.height);
const foxSquared = await sharp(foxRaw)
  .extend({
    top: Math.floor((max - foxMeta.height) / 2),
    bottom: Math.ceil((max - foxMeta.height) / 2),
    left: Math.floor((max - foxMeta.width) / 2),
    right: Math.ceil((max - foxMeta.width) / 2),
    background: { r: 0, g: 0, b: 0, alpha: 0 }, // transparent
  })
  .toBuffer();

await sharp(foxSquared).resize(1024, 1024).webp({ quality: 92, alphaQuality: 100 }).toFile(join(BRAND, 'fox-mark.webp'));
await sharp(foxSquared).resize(512, 512).png({ compressionLevel: 9 }).toFile(join(BRAND, 'fox-mark-512.png'));
await sharp(foxSquared).resize(512, 512).png({ compressionLevel: 9 }).toFile(join(BRAND, 'fox-logo.png'));
console.log(`  fox-mark.webp + fox-mark-512.png + fox-logo.png written`);

// ---------------------------------------------------------------
// Favicon set — fox mark on transparent
// ---------------------------------------------------------------
console.log('\n=== FAVICONS ===');
const png16 = await sharp(foxSquared).resize(16, 16).png().toBuffer();
const png32 = await sharp(foxSquared).resize(32, 32).png().toBuffer();
const png48 = await sharp(foxSquared).resize(48, 48).png().toBuffer();
const ico   = await toIco([png16, png32, png48]);
await writeFile(join(PUB, 'favicon.ico'), ico);
console.log(`  favicon.ico (16/32/48): ${fmt(ico.length)}`);

await sharp(foxSquared).resize(180, 180).png({ compressionLevel: 9 }).toFile(join(PUB, 'apple-touch-icon.png'));
await sharp(foxSquared).resize(192, 192).png({ compressionLevel: 9 }).toFile(join(PUB, 'icon-192.png'));
await sharp(foxSquared).resize(512, 512).png({ compressionLevel: 9 }).toFile(join(PUB, 'icon-512.png'));
console.log(`  apple-touch-icon + icon-192 + icon-512 written`);

// ---------------------------------------------------------------
// Horizontal lockup — for header / footer / OG
// ---------------------------------------------------------------
console.log('\n=== HORIZONTAL LOCKUP ===');
const lockupTrimmed = await sharp(LOCKUP_SRC).trim({ threshold: 5 }).toBuffer();
const lockupMeta = await sharp(lockupTrimmed).metadata();
console.log(`  trimmed: ${lockupMeta.width} × ${lockupMeta.height}  (ratio ${(lockupMeta.width / lockupMeta.height).toFixed(2)}:1)`);

async function writeLockup(outPath, height) {
  const ratio = lockupMeta.width / lockupMeta.height;
  const targetWidth = Math.round(height * ratio);
  // kernel: lanczos3 (sharp default) gives crisp upscales even from small sources
  const info = await sharp(lockupTrimmed)
    .resize({ height, kernel: 'lanczos3' })
    .webp({ quality: 95, alphaQuality: 100, effort: 6 })
    .toFile(outPath);
  console.log(`  ${outPath.split(/[\\/]/).pop()}: ${targetWidth}×${height}  ${fmt(info.size)}`);
  return { width: targetWidth, height };
}

// 1x ≈ 200px tall (used at h-10/h-12 in header which renders ~40-48px CSS px)
// 2x retina = 400px tall
const lockup1x = await writeLockup(join(BRAND, 'lockup-dark.webp'), 200);
const lockup2x = await writeLockup(join(BRAND, 'lockup-dark-2x.webp'), 400);

// ---------------------------------------------------------------
// OG image — 1200×630 with the lockup centered on Night background
// ---------------------------------------------------------------
console.log('\n=== OG IMAGE ===');
const W = 1200, H = 630;

// Resize lockup so it fits comfortably in the OG canvas (max 70% width, 50% height)
const lockupForOg = await sharp(lockupTrimmed)
  .resize({ width: 800, height: 320, fit: 'inside', withoutEnlargement: true })
  .toBuffer();
const ogLockupMeta = await sharp(lockupForOg).metadata();

// Tagline below the lockup
const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <style>
      .tag { font-family: 'Times New Roman', serif; font-size: 28px; fill: #F5EDE4; font-weight: 300; font-style: italic; letter-spacing: 0.5px; }
      .rule { stroke: #D4691A; stroke-width: 1; opacity: 0.6; }
    </style>
  </defs>
  <line x1="${W / 2 - 70}" y1="525" x2="${W / 2 + 70}" y2="525" class="rule"/>
  <text x="${W / 2}" y="575" text-anchor="middle" class="tag">Where the North Woods welcome you home.</text>
</svg>`);

await sharp({
  create: { width: W, height: H, channels: 3, background: { r: 28, g: 20, b: 16 } }, // Night #1C1410
})
  .composite([
    {
      input: lockupForOg,
      top: Math.floor((H - ogLockupMeta.height) / 2) - 50,
      left: Math.floor((W - ogLockupMeta.width) / 2),
    },
    { input: svg, top: 0, left: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(join(BRAND, 'og-image.jpg'));
console.log(`  og-image.jpg regenerated`);

// ---------------------------------------------------------------
// Done
// ---------------------------------------------------------------
console.log('\n=== Done ===\n');
console.log(`Lockup display dims: ${lockup1x.width}×${lockup1x.height} (1x), ${lockup2x.width}×${lockup2x.height} (retina)`);
