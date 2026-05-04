/**
 * Generate /public/images/brand/og-image.jpg — 1200×630 social-share card.
 * Composition: Night background, fox logo, "Red Fox Inn" + tagline.
 *
 * Run with: node scripts/make-og-image.mjs
 */
import sharp from 'sharp';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/(\w):\//, '$1:/');
const LOGO = join(ROOT, 'public/images/brand/fox-logo-512.webp');
const OUT = join(ROOT, 'public/images/brand/og-image.jpg');

// Night #1C1410 background. Logo on the left, type on the right.
const W = 1200;
const H = 630;

// Resize logo to 380px square area
const logoBuf = await sharp(LOGO).resize({ width: 380, height: 380, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();

// SVG overlay for the type stack (right side, vertically centered)
const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <style>
      .eyebrow { font-family: 'Times New Roman', serif; font-size: 22px; fill: #D4691A; letter-spacing: 8px; font-weight: 400; }
      .title   { font-family: 'Times New Roman', serif; font-size: 92px; fill: #FAFAF7; font-weight: 300; letter-spacing: -1px; }
      .tag     { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 26px; fill: #F5EDE4; font-weight: 300; }
      .rule    { stroke: #D4691A; stroke-width: 1; opacity: 0.5; }
    </style>
  </defs>
  <text x="500" y="240" class="eyebrow">LANCASTER, NEW HAMPSHIRE</text>
  <text x="500" y="350" class="title">Red Fox Inn</text>
  <line x1="500" y1="395" x2="660" y2="395" class="rule"/>
  <text x="500" y="445" class="tag">Where the North Woods welcome you home.</text>
</svg>`);

await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: { r: 28, g: 20, b: 16 }, // Night #1C1410
  },
})
  .composite([
    { input: logoBuf, top: Math.floor((H - 380) / 2), left: 80 },
    { input: svg, top: 0, left: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(OUT);

console.log(`Wrote ${OUT}`);
