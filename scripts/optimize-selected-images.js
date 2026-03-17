const fs = require('fs/promises');
const path = require('path');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const baseDir = path.resolve(__dirname, '..');

const targets = [
  'img/ATS resume.png',
  'img/diary.png',
  'img/logo.png',
  'img/icon-512x512.png',
  'img/profile.jpg',
  'img/coding-image.jpg'
];

const excluded = new Set([
  'img/hero-bg.jpg'
]);

async function optimizeImage(relativePath) {
  if (excluded.has(relativePath)) {
    console.log(`Skipping excluded image: ${relativePath}`);
    return;
  }

  const absolutePath = path.join(baseDir, relativePath);
  const ext = path.extname(relativePath).toLowerCase();

  let plugins = [];
  if (ext === '.jpg' || ext === '.jpeg') {
    plugins = [imageminMozjpeg({ quality: 78, progressive: true })];
  } else if (ext === '.png') {
    plugins = [imageminPngquant({ quality: [0.65, 0.8], strip: true })];
  } else {
    console.log(`No optimizer configured for ${relativePath}, skipping.`);
    return;
  }

  try {
    const buffer = await fs.readFile(absolutePath);
    const optimized = await imagemin.buffer(buffer, { plugins });

    if (optimized.length < buffer.length) {
      await fs.writeFile(absolutePath, optimized);
      const savings = (((buffer.length - optimized.length) / buffer.length) * 100).toFixed(2);
      console.log(`Optimized ${relativePath} → saved ${savings}% (${buffer.length} → ${optimized.length} bytes)`);
    } else {
      console.log(`No savings for ${relativePath}, keeping original file.`);
    }
  } catch (err) {
    console.error(`Failed to optimize ${relativePath}:`, err.message);
  }
}

async function run() {
  console.log('Starting targeted image optimization...');
  for (const file of targets) {
    await optimizeImage(file);
  }
  console.log('Finished image optimization.');
}

run();
