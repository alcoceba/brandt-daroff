# AGENTS.md — Brandt-Daroff (VPPB) Home Treatment App

A frontend-only PWA that guides patients through the Brandt-Daroff exercises for BPPV (Vértigo Posicional Paroxístico Benigno) at home, with a visual timer and progress tracking. Designed to be portable to Android/iOS later via Capacitor.

## Project context

This is a **medical guidance app** used by patients at home, typically next to their bed, often while dizzy. UX priorities:

- **Clarity over density.** One task per screen, huge tap targets (≥56px), high contrast, large type.
- **Offline-first.** Patients may have no signal; the app must work fully offline once loaded (PWA).
- **No backend, no login, no personal data on a server.** Everything is stored locally on the device.
- **Clinical safety.** A persistent warning tells the patient to stop and seek review if symptoms other than their usual vertigo appear (weakness, numbness in a limb, vision changes). An emergency stop is always reachable during a cycle.
- **Mobile-first.** Used one-handed, on a phone, next to the bed.

## Functional spec

### Onboarding (first run)
1. **Language selection** screen: English / Català / Castellano, shown as **flag (SVG) + text**. Language is changeable later from Home.
2. **Configuration wizard** with 6 fields, all pre-filled with protocol defaults. Skippable (saving defaults):
   - Position duration: **30s**
   - Rest between positions: **30s**
   - Rest between cycles: **2 min**
   - Sessions per day (daily slots): **3** → labels "Morning / Midday / Evening"; if a different number → "Cycle 1, Cycle 2…"
   - Total treatment days: **14**
   - Cycles per session: **5** (Brandt-Daroff protocol default, configurable).

### Home screen
- Shows **Day X / totalDays** computed from the treatment start date.
- Lists today's sessions with state: pending / in-progress / completed.
- Start a session → goes to Cycle screen.
- Access to: reconfigure (wizard), change language, **reset whole treatment** (with confirmation).
- Two operation modes: **Treatment progress** (full tracking) and **Quick timer** (no tracking, timer only). Mode switchable from Settings or Home.

### Cycle screen (during exercise)
One cycle = 5 positions. A session = 5 cycles. Short in-screen text per position:

| # | Position | Duration | Short text |
|---|----------|----------|------------|
| 1 | Sitting on bed edge | transition (Start button) | "Sitting" |
| 2 | Lying on right, head up + 45° | position duration (30s) | "Lying right · head 45°" |
| 3 | Sitting on bed edge | rest-between-positions (30s) | "Rest" |
| 4 | Lying on left, head up + 45° | position duration (30s) | "Lying left · head 45°" |
| 5 | Rest between cycles | rest-between-cycles (2 min) | "Long rest" |

- **Visual timer**: SVG circular progress ring + big countdown number.
- **Position card**: large icon/illustration + short text + duration.
- **Cycle counter**: "Cycle 2/5" and "3 cycles remaining".
- **Position change cue**: sound + vibration + visual highlight.
- **"Dizziness has passed → Next"** button on 30s positions to advance early.
- Controls (bottom bar):
  - **Play / Pause / Resume**
  - **Skip to next cycle** (skip current rest/position)
  - **Reset whole process** (confirmation)
  - **Stop and abandon** (returns to Home; session stays pending and can be restarted)
- On completing all 5 cycles → mark session completed → return to Home.
- Background glow changes color based on position kind (green for positions, yellow for short rest, red for long rest).

### Tracking
- Calendar/grid showing per-session, per-day state.
- Global progress: completed sessions / total (sessionsPerDay × totalDays).

### Persistence (local only)
- Stored: language, config, start date, completed sessions, history, sound/vibration settings.
- Restored on reopen. Reset with confirmation.

### Clinical safety
- Persistent warning: stop if **weakness, numbness in a limb, or vision changes** appear → seek medical review.
- Emergency stop button always accessible during the cycle.

### Accessibility / offline
- Large buttons, high contrast, clear typography. Sound and vibration configurable (can be silenced). PWA works offline.

### Future Android/iOS
- Same offline-first UX, local notifications for reminders, isolatable data layer for optional sync.

## Technical spec

### Stack
- **React 18 + Vite + TypeScript**
- **Tailwind CSS** (mobile-first, large tap targets, high contrast)
- **vite-plugin-pwa** (offline + installable)
- **zustand** + localStorage (state + persistence, no backend)
- **react-i18next** with `src/i18n/{en,ca,es}.ts`
- **lucide-react** icons + custom inline SVG for position illustrations and flag badges (no Catalan flag emoji exists)
- **Web Audio API** (beep) + **navigator.vibrate** — both configurable
- **Capacitor-ready** layout for a future mobile wrapper

### Project structure
```
src/
  main.tsx
  App.tsx
  types/
    index.ts
  i18n/
    resources.ts
    index.ts
  store/
    useTreatmentStore.ts
  components/
    Calendar.tsx
    CycleProgressDots.tsx
    FlagIcon.tsx
    Logo.tsx
    PositionIcon.tsx
    ProgressSummary.tsx
    CircularProgress.tsx
    SessionCompletionCard.tsx
    Timer.tsx
    core/
      BackButton.tsx
      ConfirmDialog.tsx
      Stepper.tsx
  screens/
    CycleSessionScreen.tsx
    HomeScreen.tsx
    InfoScreen.tsx
    LanguageSelectorScreen.tsx
    LanguageSettingsScreen.tsx
    SettingsScreen.tsx
    WizardScreen.tsx
  layouts/
    AppLayout.tsx
  constants/
    languages.ts
    positions.ts
    treatment.ts
  hooks/
    useBeepCues.ts
    useCountdown.ts
    useCycleSession.ts
  storage/
    createStorage.ts
    treatmentStorage.ts
  utils/
    date.ts
    format.ts
    sessions.ts
    sound.ts
    vibration.ts
public/
  manifest.webmanifest
  icon.svg
  icon-192.png
  icon-512.png
  robots.txt
  llms.txt
```

### State model (persisted to localStorage)
- `language: 'en' | 'ca' | 'es'`
- `config: { positionDuration, restBetweenPositions, restBetweenCycles, sessionsPerDay, totalDays, cyclesPerSession }` (seconds / count / days)
- `startDate: ISOString | null`
- `sessions: { [isoDate]: { [sessionId]: 'pending' | 'in-progress' | 'completed' } }`
- `progress: { [isoDate]: { [sessionId]: { cycleIndex, positionIndex } } }` (in-progress session state, cleared on completion)
- `sessionDurations: { [isoDate]: { [sessionId]: elapsedSeconds } }` (real time invested per completed session)
- `settings: { sound: boolean, vibration: boolean }`
- `skipSafetyWarning: boolean` (persistent opt-out of the cycle safety dialog)
- `mode: 'progress' | 'quick'`
- `onboardingComplete: boolean`

### Hosting (free)
Recommended: **GitHub Pages** (the repo is already on GitHub). The project is configured for manual deploy via `gh-pages`:
1. Go to **Settings → Pages** and select source **Deploy from a branch** → `gh-pages` / `(root)`.
2. Run `npm run deploy` locally to build and push `dist/` to the `gh-pages` branch.

Alternatives: Netlify, Vercel, Cloudflare Pages (all free tier).

### Commands
- `npm run dev` — local dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the build
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `npm run deploy` — build and deploy to GitHub Pages (`gh-pages` branch)

## Conventions

- **Language**: code, comments, and commit messages in **English**.
- **No comments** unless requested.
- **No backend, no network calls** in the app. Everything client-side.
- **No personal/medical data** beyond local session state; nothing leaves the device.
- **Follow the medical protocol defaults**; user config is allowed but defaults must match the Brandt-Daroff protocol.
- **Mobile-first, high contrast, ≥56px tap targets.**
- **i18n every user-facing string** via react-i18next; never hardcode display text.
- **Flags as inline SVG**, not emoji (Catalan flag has no emoji).
- **Prefer editing existing files**; never create documentation files unless asked.
- **Never commit changes unless explicitly asked.**

## Verification

Before finishing any task:
- Run `npm run lint` and `npm run typecheck`; fix any errors.
- Run `npm run build` to confirm the build passes.
- Manually exercise the affected flow (onboarding → wizard → Home → a full cycle → tracking) at a narrow mobile viewport.
