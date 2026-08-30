<div align="center">

<img src="public/icon.svg" alt="Brandt-Daroff icon" width="120" height="120" />

# Brandt-Daroff

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![CI](https://github.com/alcoceba/brandt-daroff/actions/workflows/ci.yml/badge.svg)](https://github.com/alcoceba/brandt-daroff/actions/workflows/ci.yml)

A frontend-only PWA built with React, Vite, and TypeScript.

</div>

---

> ⚠️ **Medical disclaimer**
>
> This repository produces a self-help guide and **is not a substitute for professional medical advice, diagnosis, or treatment**. Always consult a clinician before use.

## Tech stack

- **React 18** — UI library
- **Vite 5** — build tool and dev server
- **TypeScript 5** — typed JavaScript
- **Tailwind CSS 3** — utility-first styling
- **vite-plugin-pwa** — service worker, offline support, and web manifest
- **zustand** — lightweight state management, persisted to `localStorage`
- **react-i18next** — internationalization (`en`, `ca`, `es`)
- **lucide-react** — icon set
- **Web Audio API** + **navigator.vibrate** — configurable feedback cues

## Project structure

```text
src/
  App.tsx                 # top-level routing and splash gate
  main.tsx                # React root entry
  i18n/                   # translations and i18n setup
  layouts/                # AppLayout
  screens/                # top-level route screens
  components/             # reusable UI components
    core/                 # generic primitives (BackButton, ConfirmDialog, ...)
    cycle/                # cycle session subcomponents
    home/                 # home screen subcomponents
    wizard/               # wizard subcomponents
  store/                  # zustand store and persistence
  hooks/                  # React hooks (countdown, cycle session, cues)
  utils/                  # pure helpers (date, sessions, sound, vibration)
  constants/              # app constants (treatment defaults, languages, positions)
  types/                  # shared TypeScript types
```

Tests live alongside the files they cover.

## Prerequisites

- **Node.js 18+** (Node 20 LTS recommended)

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173/brandt-daroff/`). For the best experience, use a narrow mobile viewport (375 px wide) in your browser's devtools.

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

The test suite runs on every push and pull request via GitHub Actions. Locally:

```bash
npm run test
```

Watch mode for development:

```bash
npm run test:watch
```

## Development scenarios

To quickly test UI states that would otherwise require days of sessions, use the dev scenario seeder. Start the dev server:

```bash
npm run dev
```

Then open:

```text
http://localhost:5173/brandt-daroff/?dev=scenarios
```

Click any scenario to overwrite `localStorage` and reload the app in that state. This screen is only available in development mode.

## State and persistence

All runtime state is stored in the browser's `localStorage` on the device:

- language and configuration
- treatment start date
- completed sessions and history
- sound / vibration settings

There is no backend, no analytics, and no network calls from the app itself. The whole treatment can be reset from Home (with confirmation).

## Deployment

The app is a static build, so any static host works. Recommended: **GitHub Pages** via the `gh-pages` branch.

1. Go to **Settings → Pages** and select source **Deploy from a branch** → `gh-pages` / `(root)`.
2. Run `npm run deploy` locally to build and push `dist/` to the `gh-pages` branch.

Alternatives: Netlify, Vercel, Cloudflare Pages.

## Roadmap

- Capacitor wrapper for native Android/iOS distribution
- Local notifications for session reminders
- Isolatable data layer for optional future sync

## License

[CC BY-NC 4.0](LICENSE.md) © Manel Alcoceba
