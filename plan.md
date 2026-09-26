# Pla SEO/LLMs + Migració de domini (Revisat)

Aquest document estableix el pla tècnic per a la visibilitat en motors de cerca (SEO tradicional), indexació per a models de llenguatge (LLMs / `llms.txt`), pàgines informatives estàtiques i preparació per a la migració a `https://brandtdaroff.app`.

---

## Decisions clau

1. **Configurabilitat de la URL**: Font única de veritat mitjançant la variable `VITE_SITE_URL` (`.env` / entorn).
   - Valor per defecte (actual): `https://alcoceba.github.io/brandt-daroff`
   - Valor en migrar: `https://brandtdaroff.app`
2. **Generació estàtica amb Node.js pur**: Script `scripts/generate-static.mjs` sense dependències noves (`node:fs`, `node:path`).
   - Llegeix plantilles de `templates/` amb el marcador `__SITE_URL__`.
   - Genera els fitxers finals a `public/` abans de cada build.
3. **URLs netes (sense `.html`)**: Ús del patró *directory index* suportat per GitHub Pages i dominis propis:
   - `/info/en/` (`public/info/en/index.html`)
   - `/info/ca/` (`public/info/ca/index.html`)
   - `/info/es/` (`public/info/es/index.html`)
4. **Resolució de la limitació SPA**: Les pàgines estàtiques a `/info/{lang}/` contenen HTML semàntic pur, estils fluids i Schema.org JSON-LD (`MedicalWebPage`, `HowTo`, `FAQPage`), fent el contingut clínic 100% indexable per Google sense necessitat de renderitzar JavaScript.
5. **Base dinàmica a Vite**: `vite.config.ts` deriva automàticament `base` a partir del path de `VITE_SITE_URL` (`/brandt-daroff/` o `/`).
6. **Imatges Open Graph**: 1200×630 px per a cada idioma (`og-en.png`, `og-ca.png`, `og-es.png`), amb fons `#0f172a`, anell verd de la marca i text d'alta legibilitat.
7. **Analytics i tokens pendents**: Cloudflare Web Analytics i verificació de Google Search Console preparats per activar en afegir els tokens al `.env`.

---

## Arquitectura de fitxers

```
templates/
  robots.txt
  sitemap.xml
  llms.txt
  llms-full.txt
  info/
    en/index.html
    ca/index.html
    es/index.html
scripts/
  generate-static.mjs
  generate-og.mjs
public/
  robots.txt            (generat)
  sitemap.xml           (generat)
  llms.txt              (generat)
  llms-full.txt         (generat)
  og-en.png             (generat)
  og-ca.png             (generat)
  og-es.png             (generat)
  info/
    en/index.html       (generat)
    ca/index.html       (generat)
    es/index.html       (generat)
.env.example
.env
```

---

## Fases d'implementació

### Fase 1 — Configuració base i generador estàtic
- Crear `.env.example` i `.env` amb `VITE_SITE_URL`.
- Afegir `.env` a `.gitignore`.
- Crear `scripts/generate-static.mjs`.
- Configurar `base` dinàmica a `vite.config.ts`.
- Actualitzar scripts a `package.json` (`node scripts/generate-static.mjs && tsc --noEmit && vite build`).

### Fase 2 — Optimització per a IA (`llms.txt` i `llms-full.txt`)
- Plantilla `templates/llms.txt`: actualitzada a React 19, públic objectiu, disclaimer clínic, enllaços oficials.
- Plantilla `templates/llms-full.txt`: document mèdic i tècnic exhaustiu en anglès (anatomia BPPV, mètode Brandt-Daroff, els 5 passos, posologies, consells de seguretat, eficàcia, FAQ).

### Fase 3 — Imatges socials Open Graph (1200×630)
- Script de rasterització d'imatges OG per a anglès, català i castellà.
- Generació de `public/og-en.png`, `public/og-ca.png`, `public/og-es.png`.

### Fase 4 — Metadates de l'aplicació principal (`index.html`)
- Títol i descripció rics en paraules clau mèdiques.
- Enllaços canonical i targetes Open Graph / Twitter amb imatges localitzades.
- Schema.org JSON-LD `WebApplication`.

### Fase 5 — Pàgines estàtiques informatives (`/info/{lang}/`)
- HTML semàntic complet amb disseny fosc d'alt contrast i tipografia neta.
- Enllaç prominent de tornada a l'aplicació web ("Start guided exercise").
- Etiquetes `hreflang` creuades entre idiomes.
- Schema.org JSON-LD estructurat:
  - `MedicalWebPage`
  - `HowTo` (amb els 5 passos detallats del mètode)
  - `FAQPage` (preguntes freqüents sobre mareig, durada, seguretat)
- Plantilles `templates/sitemap.xml` i `templates/robots.txt` referenciant el sitemap.

### Fase 6 — Verificació
- Execució de `npm run lint`, `npm run typecheck` i `npm run build`.
- Comprovació de la sortida a `dist/` (comprovant que `dist/info/en/index.html`, `dist/sitemap.xml`, etc. existeixen).
- Prova de canvi de `VITE_SITE_URL` per validar la portabilitat a `brandtdaroff.app`.
