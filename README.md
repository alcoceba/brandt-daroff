<div align="center">

<img src="public/icon.svg" alt="Brandt-Daroff icon" width="120" height="120" />

# Brandt-Daroff — VPPB Home Treatment

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/alcoceba/brandt-daroff/actions/workflows/ci.yml/badge.svg)](https://github.com/alcoceba/brandt-daroff/actions/workflows/ci.yml)

A progressive web app that guides patients through the Brandt-Daroff exercises for BPPV (Benign Paroxysmal Positional Vertigo) at home.

</div>

---

> ⚠️ **Medical disclaimer**
>
> This app is a self-help guide and **is not a substitute for professional medical advice, diagnosis, or treatment**. Always consult your clinician before starting, and seek immediate medical review if you experience symptoms beyond your usual vertigo — **weakness, numbness in a limb, or vision changes**. An emergency-stop button is always reachable during an exercise cycle.

## What it is

An **offline-first PWA** that walks a patient, one screen at a time, through the Brandt-Daroff habituation protocol. It is designed to be used one-handed, on a phone, next to the bed, often while dizzy. There is **no backend, no login, and no data sent to a server** — everything is stored locally on the device.

Built mobile-first with large tap targets (≥ 56 px), high contrast, and large type. Available in **English · Català · Castellano**.

## Features

- **Onboarding wizard** with the Brandt-Daroff protocol defaults pre-filled (skippable):
  - Position duration: 30 s
  - Rest between positions: 30 s
  - Rest between cycles: 2 min
  - Sessions per day: 3 (Morning / Midday / Evening; or "Cycle 1, Cycle 2…" if changed)
  - Total treatment days: 14
  - Cycles per session: 5 (Brandt-Daroff protocol default, configurable)
- **Visual timer** — SVG circular progress ring + big countdown number
- **Position cards** — large illustration + short text + duration for each of the 5 positions
- **Cycle counter** — "Cycle 2/5", "3 cycles remaining"
- **Position-change cues** — sound + vibration + visual highlight (sound and vibration configurable, both can be silenced)
- **Early advance** — a "Dizziness has passed → Next" button lets the patient skip ahead on 30 s positions
- **Controls** — Play / Pause / Resume, Skip to next cycle, Reset whole process (confirmed), Stop and abandon (session stays pending and can be restarted)
- **Tracking** — calendar/grid of per-session, per-day state; global progress (completed sessions / total)
- **Clinical safety** — persistent warning for red-flag symptoms + an always-reachable emergency stop
- **Installable** — add to your home screen; works fully offline once loaded
- **Multilingual** — English / Català / Castellano, changeable at any time from Home
- **Quick timer mode** — timer-only mode without tracking, switchable from Settings or Home

## Prerequisites

- **Node.js 18+** (Node 20 LTS recommended)

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). For the best experience, use a narrow mobile viewport (375 px wide) in your browser's devtools.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc --noEmit`) and build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run deploy` | Build and deploy to GitHub Pages (`gh-pages` branch) |

## Tests

The test suite runs on every push and pull request via GitHub Actions. Locally, run it once with:

```bash
npm run test
```

For development, use watch mode:

```bash
npm run test:watch
```

## Tech stack

- **React 18 + Vite 5 + TypeScript**
- **Tailwind CSS 3** — mobile-first, large tap targets, high contrast
- **vite-plugin-pwa** — offline + installable
- **zustand** + `localStorage` — state and persistence, no backend
- **react-i18next** (`i18next`) with `src/i18n/{en,ca,es}`
- **lucide-react** icons + custom inline SVG for position illustrations and flag badges (Catalan flag has no emoji)
- **Web Audio API** (beep) + **navigator.vibrate** — both configurable
- **Capacitor-ready** layout for a future Android/iOS wrapper

## Project structure

The codebase is organized around screens, reusable components, state, and utilities. Tests live alongside the files they cover.

## Install as a PWA

1. Open the deployed URL in your mobile browser.
2. **Chrome (Android):** menu → *Add to Home screen*.
3. **Safari (iOS):** Share → *Add to Home Screen*.

Once installed, the app works fully offline — no signal needed.

## Data & privacy

All state is stored in the browser's `localStorage` on the device:

- language and configuration
- treatment start date
- completed sessions and history
- sound / vibration settings

**Nothing leaves the device.** There is no analytics, no tracking, no network calls. The whole treatment can be reset from Home at any time (with confirmation).

## Deployment

The app is a static build, so any static host works. Recommended: **GitHub Pages** (this repo is already on GitHub) via the `gh-pages` branch.

1. Go to **Settings → Pages** and select source **Deploy from a branch** → `gh-pages` / `(root)`.
2. Run `npm run deploy` locally to build and push `dist/` to the `gh-pages` branch.

Alternatives (all free tier): Netlify, Vercel, Cloudflare Pages.

## Roadmap

- **Capacitor** wrapper for native Android/iOS distribution
- **Local notifications** for session reminders
- Isolatable data layer for optional future sync

## License

[MIT](LICENSE) © Manel Alcoceba