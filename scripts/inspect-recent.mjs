/**
 * Inspect recent images in Downloads — print dimensions + size + a tiny content hash
 * so we can identify which ones are fox-logo-relevant by size/dimensions.
 */
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';

const DL = 'C:/Users/saffr/Downloads';
const recent = readdirSync(DL).filter(
  (f) => /^hf_20260505/i.test(f) || /RED FOX|Fox Silhouette/i.test(f),
);
recent.sort();

for (const f of recent) {
  const p = join(DL, f);
  try {
    const meta = await sharp(p).metadata();
    const s = await stat(p);
    // tiny "thumbprint" — average color of the image
    const stats = await sharp(p).stats();
    const ch = stats.channels;
    const avg = ch.length >= 3 ? `RGB(${ch[0].mean.toFixed(0)},${ch[1].mean.toFixed(0)},${ch[2].mean.toFixed(0)})` : 'n/a';
    console.log(`${(s.size / 1024).toFixed(0).padStart(5)}KB  ${meta.width}x${meta.height}  ${avg}  ${f}`);
  } catch (e) {
    console.log(`ERR: ${f}`);
  }
}
