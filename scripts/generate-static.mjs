import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const templatesDir = path.resolve(rootDir, 'templates');
const publicDir = path.resolve(rootDir, 'public');

function loadEnvSiteUrl() {
  if (process.env.VITE_SITE_URL) {
    return process.env.VITE_SITE_URL;
  }

  const envFiles = ['.env', '.env.local', '.env.example'];
  for (const envFile of envFiles) {
    const envPath = path.resolve(rootDir, envFile);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/^\s*VITE_SITE_URL\s*=\s*(.+)$/m);
      if (match && match[1]) {
        return match[1].trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }

  return 'https://alcoceba.github.io/brandt-daroff';
}

const rawSiteUrl = loadEnvSiteUrl();
const siteUrl = rawSiteUrl.replace(/\/+$/, '');
console.log(`[generate-static] Using site URL: ${siteUrl}`);

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function processTemplateDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      processTemplateDir(srcPath, destPath);
    } else {
      const content = fs.readFileSync(srcPath, 'utf-8');
      const processed = content.replaceAll('__SITE_URL__', siteUrl);
      fs.writeFileSync(destPath, processed, 'utf-8');
      console.log(`[generate-static] Wrote: ${path.relative(rootDir, destPath)}`);
    }
  }
}

processTemplateDir(templatesDir, publicDir);

// Check if OG images exist, if not generate them
const requiredOgImages = ['og-en.png', 'og-ca.png', 'og-es.png'];
const missingOg = requiredOgImages.some(img => !fs.existsSync(path.join(publicDir, img)));

if (missingOg) {
  console.log('[generate-static] OG images missing. Running generate-og.mjs...');
  try {
    execFileSync('node', [path.resolve(__dirname, 'generate-og.mjs')], { stdio: 'inherit' });
  } catch (err) {
    console.warn('[generate-static] Warning: Could not generate OG images automatically.', err);
  }
}

console.log('[generate-static] Static generation complete.');
