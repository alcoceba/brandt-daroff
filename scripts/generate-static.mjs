import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import autoprefixer from 'autoprefixer';
import esbuild from 'esbuild';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

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

// 1. Process root text/xml templates (robots.txt, sitemap.xml, llms.txt, etc.)
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

// 2. Generate static landing pages using React component library
async function generateStaticInfoPages() {
  console.log('[generate-static] Compiling Tailwind CSS for static landing pages...');
  const cssInputPath = path.resolve(rootDir, 'src/index.css');
  const cssInput = fs.readFileSync(cssInputPath, 'utf-8');
  const postcssResult = await postcss([tailwindcss, autoprefixer]).process(cssInput, {
    from: cssInputPath,
  });
  const compiledCss = postcssResult.css;

  console.log('[generate-static] Bundling static renderer with esbuild...');
  const cacheDir = path.resolve(rootDir, 'node_modules/.cache');
  fs.mkdirSync(cacheDir, { recursive: true });
  const tmpBundle = path.join(cacheDir, `static-renderer-${Date.now()}.mjs`);

  try {
    await esbuild.build({
      entryPoints: [path.resolve(rootDir, 'src/components/static/renderStaticPages.tsx')],
      outfile: tmpBundle,
      bundle: true,
      format: 'esm',
      platform: 'node',
      alias: {
        '@': path.resolve(rootDir, 'src'),
      },
      packages: 'external',
    });

    const { renderStaticPage, getAllStaticLanguages } = await import(`file://${tmpBundle}`);
    const languages = getAllStaticLanguages();

    for (const lang of languages) {
      const pageHtml = renderStaticPage(lang, { siteUrl, compiledCss });
      const destDir = path.join(publicDir, 'info', lang);
      fs.mkdirSync(destDir, { recursive: true });
      const destFile = path.join(destDir, 'index.html');
      fs.writeFileSync(destFile, pageHtml, 'utf-8');
      console.log(`[generate-static] Wrote: ${path.relative(rootDir, destFile)}`);
    }
  } finally {
    if (fs.existsSync(tmpBundle)) {
      fs.unlinkSync(tmpBundle);
    }
  }
}

await generateStaticInfoPages();

// 3. Check if OG images exist, if not generate them
const requiredOgImages = ['og-en.png', 'og-ca.png', 'og-es.png'];
const missingOg = requiredOgImages.some((img) => !fs.existsSync(path.join(publicDir, img)));

if (missingOg) {
  console.log('[generate-static] OG images missing. Running generate-og.mjs...');
  try {
    execFileSync('node', [path.resolve(__dirname, 'generate-og.mjs')], { stdio: 'inherit' });
  } catch (err) {
    console.warn('[generate-static] Warning: Could not generate OG images automatically.', err);
  }
}

console.log('[generate-static] Static generation complete.');
