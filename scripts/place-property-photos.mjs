/**
 * Process the property photos Raj uploaded 2026-05-05 and place them in
 * public/images/property/ as WebP. Map each labeled file to its venue page.
 *
 * Run with: node scripts/place-property-photos.mjs
 */
import sharp from 'sharp';
import { mkdir, stat, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/(\w):\//, '$1:/');
const DL = 'C:/Users/saffr/Downloads';
const OUT = join(ROOT, 'public/images/property');

await mkdir(OUT, { recursive: true });

// Source filename → output slug. Multiple sources for the same destination
// allowed (script picks the first that exists).
const MAP = [
  { src: ['THE FRONT OF THE BUILDING.jpg'],         out: 'exterior-front-1' },
  { src: ['THE FRONT OF THE BUILDING 2.jpg'],       out: 'exterior-front-2' },
  { src: ['THE SIGN.jpeg'],                          out: 'exterior-sign' },
  { src: ['THE PATIO IN THE PARKING.jpeg'],         out: 'patio' },
  { src: ['THE RECEPTION AREA.jpeg'],                out: 'reception-1' },
  { src: ['THE RECEPTION AREA 2.jpg'],              out: 'reception-2' },
  { src: ['THE RECEPTION  BREAKFAST AREA.jpg', 'THE RECEPTION BREAKFAST AREA.jpg'], out: 'reception-breakfast' },
  { src: ['THE DEN.jpeg'],                           out: 'the-den-1' },
  { src: ['THE DEN 2.jpg'],                          out: 'the-den-2' },
  { src: ['THE DUSK.jpg'],                           out: 'the-dusk' },
  { src: ['The Huntington Room.jpeg'],              out: 'huntington-room' },
  { src: ['The Prospect Room.jpeg'],                out: 'prospect-room' },
];

const fmt = (n) => (n / 1024).toFixed(0).padStart(5) + ' KB';

async function fileExists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function findFirst(candidates) {
  for (const f of candidates) {
    const p = join(DL, f);
    if (await fileExists(p)) return p;
  }
  return null;
}

const manifest = {};

for (const item of MAP) {
  const src = await findFirst(item.src);
  if (!src) {
    console.log(`  SKIP  ${item.out} — none of [${item.src.join(', ')}] found`);
    continue;
  }
  const meta = await sharp(src).metadata();
  // Two sizes for srcset.
  // .rotate() with no args physically applies EXIF orientation then clears it.
  // Without this, phone-camera shots can ship upside-down / sideways.
  const out800 = join(OUT, `${item.out}-800.webp`);
  const out1600 = join(OUT, `${item.out}-1600.webp`);
  const i800 = await sharp(src).rotate().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out800);
  const i1600 = await sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out1600);

  manifest[item.out] = {
    width: meta.width,
    height: meta.height,
    aspect: (meta.width / meta.height).toFixed(2),
    size800: i800.size,
    size1600: i1600.size,
  };
  console.log(`  ${item.out.padEnd(22)}  ${meta.width}×${meta.height}  →  800w ${fmt(i800.size)}  ·  1600w ${fmt(i1600.size)}`);
}

console.log('\n=== Manifest ===');
console.log(JSON.stringify(manifest, null, 2));
