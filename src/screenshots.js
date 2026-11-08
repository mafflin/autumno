"use strict";

const path = require("path");
const sharp = require("sharp");

const DIR = path.resolve(__dirname, "..", "images", "screenshots");
const SRC = path.join(DIR, "dark.png");
const OUT = path.join(DIR, "screenshot.png");

const SCALE = 0.5;
const PAD = 96;
const RADIUS = 16;
const SHADOW = { blur: 24, offsetY: 16, opacity: 0.35 };

const roundedRect = (w, h, fill, opacity = 1) =>
  Buffer.from(
    `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" ` +
      `rx="${RADIUS}" fill="${fill}" fill-opacity="${opacity}"/></svg>`,
  );

async function main() {
  const { width: srcW, height: srcH } = await sharp(SRC).metadata();
  const w = Math.round(srcW * SCALE);
  const h = Math.round(srcH * SCALE);

  const spread = SHADOW.blur * 3;
  const shadowRect = await sharp({
    create: {
      width: w + 2 * spread,
      height: h + 2 * spread,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: roundedRect(w, h, "#000000", SHADOW.opacity),
        left: spread,
        top: spread,
      },
    ])
    .png()
    .toBuffer();
  const shadow = await sharp(shadowRect)
    .blur(SHADOW.blur / 2)
    .png()
    .toBuffer();

  const window = await sharp(SRC)
    .resize(w, h)
    .composite([{ input: roundedRect(w, h, "#ffffff"), blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: w + 2 * PAD,
      height: h + 2 * PAD,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: shadow, left: PAD - spread, top: PAD - spread + SHADOW.offsetY },
      { input: window, left: PAD, top: PAD },
    ])
    .png({ compressionLevel: 9 })
    .toFile(OUT);

  console.log(`  wrote ${path.relative(process.cwd(), OUT)}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
