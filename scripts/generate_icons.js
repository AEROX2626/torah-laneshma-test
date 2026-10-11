const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

function createIcoFromPngs(pngBuffersWithSizes) {
  // pngBuffersWithSizes: [{ size: 16, buffer: Buffer }, { size: 32, buffer: Buffer }, { size: 48, buffer: Buffer }]
  const count = pngBuffersWithSizes.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: 1 = ICO
  header.writeUInt16LE(count, 4); // Count

  const dirEntries = [];
  const imageBuffers = [];

  for (const item of pngBuffersWithSizes) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(item.size >= 256 ? 0 : item.size, 0); // Width
    entry.writeUInt8(item.size >= 256 ? 0 : item.size, 1); // Height
    entry.writeUInt8(0, 2); // Colors
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // Size
    entry.writeUInt32LE(offset, 12); // Offset

    offset += item.buffer.length;
    dirEntries.push(entry);
    imageBuffers.push(item.buffer);
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage();

  const svgPath = path.resolve(__dirname, "../app/icon.svg");
  const svgContent = fs.readFileSync(svgPath, "utf-8");

  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; }
    svg { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>`;

  await page.setContent(html);

  // Generate PNGs at different resolutions
  const sizes = [16, 32, 48, 64, 180, 192, 512];
  const renderedBuffers = {};

  for (const size of sizes) {
    await page.setViewportSize({ width: size, height: size });
    const buf = await page.screenshot({ omitBackground: true });
    renderedBuffers[size] = buf;
  }

  await browser.close();

  // Save Apple touch icon (180x180)
  fs.writeFileSync(path.resolve(__dirname, "../app/apple-icon.png"), renderedBuffers[180]);
  fs.writeFileSync(path.resolve(__dirname, "../public/apple-touch-icon.png"), renderedBuffers[180]);
  console.log("Saved apple touch icons (180x180)");

  // Save PWA icons
  fs.writeFileSync(path.resolve(__dirname, "../public/icon-192.png"), renderedBuffers[192]);
  fs.writeFileSync(path.resolve(__dirname, "../public/icon-512.png"), renderedBuffers[512]);
  console.log("Saved icon-192.png and icon-512.png");

  // Create favicon.ico with 16x16, 32x32, 48x48
  const icoBuffer = createIcoFromPngs([
    { size: 16, buffer: renderedBuffers[16] },
    { size: 32, buffer: renderedBuffers[32] },
    { size: 48, buffer: renderedBuffers[48] }
  ]);

  fs.writeFileSync(path.resolve(__dirname, "../app/favicon.ico"), icoBuffer);
  fs.writeFileSync(path.resolve(__dirname, "../public/favicon.ico"), icoBuffer);
  console.log("Saved favicon.ico (multi-res 16/32/48) to app/ and public/");
})();
