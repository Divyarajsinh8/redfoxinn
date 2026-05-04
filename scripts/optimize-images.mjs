/**
 * Optimize images for the web:
 *  - Room photos (.jpg) → WebP at 800w and 1600w
 *  - Vintage postcards → re-encode WebP at lower quality
 *  - Fox logo (8.8 MB PNG) → 512px and 1200px WebP variants
 *
 * Run with: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/(\w):\//, '$1:/');

const ROOMS_DIR = join(ROOT, 'public/images/rooms');
const HERITAGE_DIR = join(ROOT, 'public/images/heritage');
const BRAND_DIR = join(ROOT, 'public/images/brand');

const fmt = (n) => (n / 1024).toFixed(1) + 'KB';

async function fileSize(p) {
  try {
    return (await stat(p)).size;
  } catch {
    return 0;
  }
}

async function processRooms() {
  console.log('\n=== Room photos → WebP @ 800w + 1600w ===');
  const files = (await readdir(ROOMS_DIR)).filter((f) => extname(f).toLowerCase() === '.jpg');
  const manifest = {};
  for (const f of files) {
    const inPath = join(ROOMS_DIR, f);
    const slug = basename(f, '.jpg');
    const meta = await sharp(inPath).metadata();
    const inSize = await fileSize(inPath);

    // Two sizes for srcset
    const sizes = [800, 1600];
    const outputs = {};
    for (const w of sizes) {
      const outPath = join(ROOMS_DIR, `${slug}-${w}.webp`);
      const info = await sharp(inPath).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(outPath);
      outputs[`${w}w`] = { path: `/images/rooms/${slug}-${w}.webp`, size: info.size };
    }
    // Aspect ratio for width/height attrs
    manifest[slug] = {
      original: { width: meta.width, height: meta.height, size: inSize },
      webp: outputs,
      // Display dims for srcset default (1600w)
      width: 1600,
      height: Math.round((meta.height / meta.width) * 1600),
    };
    console.log(
      `${slug}: ${meta.width}x${meta.height} ${fmt(inSize)} → 800w ${fmt(outputs['800w'].size)} + 1600w ${fmt(outputs['1600w'].size)}`,
    );
  }
  return manifest;
}

async function processHeritage() {
  console.log('\n=== Heritage postcards → re-encode WebP @ q70 ===');
  const files = (await readdir(HERITAGE_DIR)).filter((f) => extname(f).toLowerCase() === '.webp');
  const manifest = {};
  for (const f of files) {
    const inPath = join(HERITAGE_DIR, f);
    const slug = basename(f, '.webp');
    const meta = await sharp(inPath).metadata();
    const inSize = await fileSize(inPath);
    const outPath = join(HERITAGE_DIR, `${slug}-opt.webp`);
    const info = await sharp(inPath).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 72 }).toFile(outPath);
    manifest[slug] = { width: meta.width, height: meta.height, size: info.size, optPath: `/images/heritage/${slug}-opt.webp` };
    console.log(`${slug}: ${meta.width}x${meta.height} ${fmt(inSize)} → opt ${fmt(info.size)}`);
  }
  return manifest;
}

async function processLogo() {
  console.log('\n=== Fox logo → compressed WebP variants ===');
  const inPath = join(BRAND_DIR, 'fox-logo.png');
  const meta = await sharp(inPath).metadata();
  const inSize = await fileSize(inPath);
  console.log(`Source: ${meta.width}x${meta.height} ${fmt(inSize)}`);

  // 512px (favicon-friendly) + 1200px (OG/schema)
  const out512 = join(BRAND_DIR, 'fox-logo-512.webp');
  const out1200 = join(BRAND_DIR, 'fox-logo-1200.webp');
  const i512 = await sharp(inPath).resize({ width: 512, withoutEnlargement: true }).webp({ quality: 90 }).toFile(out512);
  const i1200 = await sharp(inPath).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 90 }).toFile(out1200);
  console.log(`512w: ${fmt(i512.size)}`);
  console.log(`1200w: ${fmt(i1200.size)}`);

  // Also a small PNG for icon use (favicon/apple-touch-icon source)
  const outPng = join(BRAND_DIR, 'fox-logo-512.png');
  const iPng = await sharp(inPath).resize({ width: 512, withoutEnlargement: true }).png({ compressionLevel: 9, palette: true }).toFile(outPng);
  console.log(`512w PNG: ${fmt(iPng.size)}`);

  return { width: meta.width, height: meta.height };
}

async function main() {
  const rooms = await processRooms();
  const heritage = await processHeritage();
  const logo = await processLogo();
  console.log('\n=== Manifest ===');
  console.log(JSON.stringify({ rooms, heritage, logo }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
