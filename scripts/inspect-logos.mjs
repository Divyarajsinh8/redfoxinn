/**
 * One-shot: read the new logo files in Downloads, print dimensions + size.
 */
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';

const DL = 'C:/Users/saffr/Downloads';
const candidates = readdirSync(DL).filter((f) => /^1[A-G]\..+\.png$/i.test(f));

for (const f of candidates) {
  const p = join(DL, f);
  try {
    const meta = await sharp(p).metadata();
    const s = await stat(p);
    console.log(`${(s.size / 1024).toFixed(1).padStart(7)}KB  ${meta.width}x${meta.height}  ${f}`);
  } catch (e) {
    console.log(`ERR ${f}: ${e.message}`);
  }
}
