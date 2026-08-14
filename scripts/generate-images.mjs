import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const products = JSON.parse(readFileSync(new URL("./products.json", import.meta.url), "utf8"));
const blog = JSON.parse(readFileSync(new URL("./blog.json", import.meta.url), "utf8"));

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function mix(hex, target, ratio) {
  const c = hexToRgb(hex);
  const t = hexToRgb(target);
  const m = c.map((v, i) => Math.round(v + (t[i] - v) * ratio));
  return `rgb(${m[0]},${m[1]},${m[2]})`;
}

function candleSvg(color) {
  const light = mix(color, "#ffffff", 0.35);
  const dark = mix(color, "#000000", 0.45);
  const glow = mix(color, "#ffffff", 0.25);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="80%">
      <stop offset="0%" stop-color="#1d1710"/>
      <stop offset="55%" stop-color="#120e09"/>
      <stop offset="100%" stop-color="#0b0a08"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="18%" stop-color="#ffffff" stop-opacity="0.04"/>
      <stop offset="82%" stop-color="#ffffff" stop-opacity="0.02"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.18"/>
    </linearGradient>
    <linearGradient id="wax" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${light}"/>
      <stop offset="100%" stop-color="${dark}"/>
    </linearGradient>
    <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${glow}"/>
      <stop offset="50%" stop-color="${color}"/>
      <stop offset="100%" stop-color="${glow}"/>
    </linearGradient>
    <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffe9b8" stop-opacity="0.95"/>
      <stop offset="35%" stop-color="#ffb95e" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#ff8a2a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <ellipse cx="400" cy="560" rx="330" ry="300" fill="url(#glow)"/>
  <g opacity="0.9">
    <rect x="238" y="352" width="324" height="428" rx="44" fill="url(#glass)" stroke="#ffffff" stroke-opacity="0.18"/>
    <rect x="222" y="330" width="356" height="46" rx="18" fill="rgba(255,255,255,0.07)" stroke="#ffffff" stroke-opacity="0.28"/>
    <rect x="232" y="340" width="336" height="14" rx="7" fill="url(#rim)"/>
    <rect x="254" y="420" width="292" height="340" rx="30" fill="url(#wax)"/>
    <ellipse cx="400" cy="420" rx="146" ry="20" fill="${light}"/>
    <ellipse cx="352" cy="420" rx="26" ry="10" fill="${glow}" opacity="0.6"/>
    <path d="M318 470 q -14 34 2 62" stroke="${light}" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M492 505 q 12 28 -4 54" stroke="${light}" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="M470 440 q 10 20 -2 34" stroke="${light}" stroke-width="9" fill="none" stroke-linecap="round"/>
    <rect x="394" y="352" width="12" height="72" rx="5" fill="#161412"/>
    <ellipse cx="400" cy="322" rx="110" ry="110" fill="url(#flameGlow)"/>
    <path d="M400 270 C 420 306, 422 338, 400 356 C 378 338, 380 306, 400 270 Z" fill="#ffc46b"/>
    <path d="M400 296 C 410 318, 410 340, 400 352 C 390 340, 390 318, 400 296 Z" fill="#fff3d6"/>
  </g>
  <g fill="${color}" opacity="0.85">
    <circle cx="148" cy="212" r="4"/>
    <circle cx="655" cy="186" r="3"/>
    <circle cx="620" cy="330" r="2.4"/>
    <circle cx="180" cy="348" r="2.6"/>
    <circle cx="132" cy="480" r="3.2"/>
    <circle cx="668" cy="470" r="2.8"/>
    <circle cx="690" cy="250" r="2.2"/>
    <circle cx="110" cy="300" r="2"/>
  </g>
  <g stroke="${glow}" stroke-width="1.6" opacity="0.7">
    <path d="M158 700 l8 14 M166 700 l-8 14"/>
    <path d="M640 620 l7 12 M647 620 l-7 12"/>
    <path d="M620 780 l6 10 M626 780 l-6 10"/>
    <path d="M176 600 l5 9 M181 600 l-5 9"/>
  </g>
</svg>`;
}

function blogSvg(color) {
  const light = mix(color, "#ffffff", 0.35);
  const glow = mix(color, "#ffffff", 0.2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bgb" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1d1710"/>
      <stop offset="50%" stop-color="#120e09"/>
      <stop offset="100%" stop-color="#0b0a08"/>
    </linearGradient>
    <radialGradient id="glowb" cx="75%" cy="40%" r="55%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="waxb" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${light}"/>
      <stop offset="100%" stop-color="${mix(color, "#000000", 0.4)}"/>
    </linearGradient>
    <radialGradient id="flameb" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffe9b8" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#ff8a2a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bgb)"/>
  <rect width="1200" height="630" fill="url(#glowb)"/>
  <g opacity="0.95">
    <rect x="790" y="200" width="240" height="320" rx="30" fill="rgba(255,255,255,0.06)" stroke="#ffffff" stroke-opacity="0.2"/>
    <rect x="778" y="184" width="264" height="34" rx="14" fill="rgba(255,255,255,0.08)" stroke="#ffffff" stroke-opacity="0.25"/>
    <rect x="804" y="250" width="212" height="252" rx="22" fill="url(#waxb)"/>
    <ellipse cx="910" cy="250" rx="106" ry="15" fill="${light}"/>
    <path d="M858 288 q -10 26 2 46" stroke="${light}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <rect x="904" y="190" width="12" height="60" rx="5" fill="#161412"/>
    <ellipse cx="910" cy="165" rx="80" ry="80" fill="url(#flameb)"/>
    <path d="M910 128 C 925 156, 927 180, 910 194 C 893 180, 895 156, 910 128 Z" fill="#ffc46b"/>
    <path d="M910 148 C 918 164, 918 182, 910 192 C 902 182, 902 164, 910 148 Z" fill="#fff3d6"/>
  </g>
  <g fill="${color}" opacity="0.8">
    <circle cx="250" cy="150" r="4"/>
    <circle cx="700" cy="120" r="3"/>
    <circle cx="170" cy="330" r="2.6"/>
    <circle cx="640" cy="500" r="3.4"/>
    <circle cx="360" cy="520" r="2.4"/>
    <circle cx="560" cy="90" r="2.8"/>
    <circle cx="430" cy="250" r="2.2"/>
  </g>
  <g stroke="${glow}" stroke-width="1.8" opacity="0.65">
    <path d="M240 430 l10 18 M250 430 l-10 18"/>
    <path d="M520 300 l8 14 M528 300 l-8 14"/>
    <path d="M300 560 l7 12 M307 560 l-7 12"/>
    <path d="M620 260 l6 11 M626 260 l-6 11"/>
  </g>
</svg>`;
}

const root = process.cwd();
mkdirSync(join(root, "public", "products"), { recursive: true });
mkdirSync(join(root, "public", "blog"), { recursive: true });

let count = 0;
for (const p of products.products) {
  writeFileSync(join(root, "public", "products", `${p.slug}.svg`), candleSvg(p.colorHex));
  count++;
}
for (const b of blog.blogPosts) {
  const color = "#d4a94f";
  writeFileSync(join(root, "public", "blog", `${b.slug}.svg`), blogSvg(color));
  count++;
}
console.log(`Generated ${count} SVG images`);
