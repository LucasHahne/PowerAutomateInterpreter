import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
mkdirSync(publicDir, { recursive: true });

const ogSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0e7490"/>
      <stop offset="100%" style="stop-color:#134e4a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="72" y="210" font-family="system-ui,Segoe UI,sans-serif" font-size="52" font-weight="700" fill="#f8fafc">Power Automate</text>
  <text x="72" y="285" font-family="system-ui,Segoe UI,sans-serif" font-size="52" font-weight="700" fill="#22d3ee">Expression Interpreter</text>
  <text x="72" y="370" font-family="system-ui,Segoe UI,sans-serif" font-size="26" fill="#cbd5e1">Workflow Definition Language expressions in your browser</text>
</svg>`;

const iconSvg = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#0e7490"/>
  <text x="256" y="310" font-family="system-ui,Segoe UI,sans-serif" font-size="220" font-weight="800" fill="#22d3ee" text-anchor="middle">PA</text>
</svg>`;

await sharp(Buffer.from(ogSvg)).png().toFile(join(publicDir, "og-image.png"));
await sharp(Buffer.from(iconSvg)).png().toFile(join(publicDir, "icon.png"));
console.log("Wrote public/og-image.png and public/icon.png");
