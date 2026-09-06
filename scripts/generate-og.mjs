import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const variants = [
  {
    lang: 'en',
    title: 'Brandt-Daroff',
    subtitle: 'BPPV Home Treatment Guide & Timer',
    description: 'Guided vestibular rehabilitation exercises with visual cues & progress tracking.',
    badge: 'BPPV · Free & Offline · Clinical Protocol · Home Guidance',
  },
  {
    lang: 'ca',
    title: 'Brandt-Daroff',
    subtitle: 'Tractament del VPPB a casa · Temporitzador guiat',
    description: 'Exercicis vestibulars de rehabilitació amb indicadors visuals i seguiment diari.',
    badge: 'VPPB · Gratuït i offline · Protocol clínic · Exercicis a casa',
  },
  {
    lang: 'es',
    title: 'Brandt-Daroff',
    subtitle: 'Tratamiento del VPPB en casa · Temporizador guiado',
    description: 'Ejercicios vestibulares de rehabilitación con temporizador visual y seguimiento diario.',
    badge: 'VPPB · Gratuito y offline · Protocolo clínico · Ejercicios en casa',
  },
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSvg({ title, subtitle, description, badge }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bgGlow" cx="20%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGlow)" />

  <!-- Decorative brand glow behind icon -->
  <circle cx="210" cy="315" r="170" fill="#22c55e" opacity="0.08" />
  <circle cx="210" cy="315" r="140" fill="none" stroke="#22c55e" stroke-width="2" opacity="0.25" stroke-dasharray="8 8" />

  <!-- Brand logo mark -->
  <g filter="url(#shadow)">
    <rect x="90" y="195" width="240" height="240" rx="52" fill="#0f172a" stroke="#334155" stroke-width="2" />
    <circle cx="210" cy="315" r="74" fill="none" stroke="#22c55e" stroke-width="18" />
    <circle cx="210" cy="315" r="12" fill="#f8fafc" />
  </g>

  <!-- Text content -->
  <g font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
    <!-- Main Title -->
    <text x="390" y="245" font-size="64" font-weight="800" fill="#f8fafc" letter-spacing="-0.02em">${escapeXml(title)}</text>

    <!-- Subtitle / Tagline -->
    <text x="390" y="310" font-size="30" font-weight="700" fill="#22c55e">${escapeXml(subtitle)}</text>

    <!-- Description -->
    <text x="390" y="365" font-size="22" font-weight="400" fill="#94a3b8">${escapeXml(description)}</text>

    <!-- Pill Badge -->
    <g transform="translate(390, 420)">
      <rect width="700" height="46" rx="23" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
      <text x="24" y="29" font-size="16" font-weight="600" fill="#cbd5e1" letter-spacing="0.03em">${escapeXml(badge)}</text>
    </g>
  </g>
</svg>`;
}

for (const variant of variants) {
  const svg = buildSvg(variant);
  const tempSvgPath = path.resolve(publicDir, `temp-og-${variant.lang}.svg`);
  const outPngPath = path.resolve(publicDir, `og-${variant.lang}.png`);

  fs.writeFileSync(tempSvgPath, svg, 'utf-8');

  try {
    execFileSync('ffmpeg', [
      '-y',
      '-v',
      'warning',
      '-i',
      tempSvgPath,
      '-frames:v',
      '1',
      '-update',
      '1',
      outPngPath,
    ]);
    console.log(`Generated: ${path.relative(rootDir, outPngPath)}`);
  } catch (err) {
    console.error(`Failed to generate OG image for ${variant.lang}:`, err);
  } finally {
    if (fs.existsSync(tempSvgPath)) {
      fs.unlinkSync(tempSvgPath);
    }
  }
}
