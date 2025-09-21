# Modern Alarm Clock — Expansions Plan

This document outlines optional add‑ons and forward‑looking improvements. It’s organized by domains, with goals, scope, UX notes, data needs, risks, and phased delivery. Use this as a living backlog to prioritize and track.

## 1) Smart Alarms
- Goals
  - Improve wake quality and reliability; reduce grogginess; adapt to routine.
- Features
  - Sleep cycle window: 20–30 min flexible window; trigger on light sleep hints.
  - Habit‑aware alarms: suggestions from historical usage + calendar context.
  - Multi‑step alarms: gradual ramp (light → ambient → tone → voice brief), dismiss actions.
- UX
  - “Set Smart Alarm” flow: time + window + ramp + actions (math, hold, QR).
  - Alarm detail screen: per‑day schedule, volumes, ramp curves, backup alarm.
- Tech
  - Ramp engine: scheduler + gain envelopes; persistent queue across reloads.
  - Local sensors (optional): microphone amplitude trend; motion via device APIs where available; degrade gracefully.
  - Data: on‑device history (alarm use, dismiss latency) for suggestions.
- Risks
  - Sensor reliability, permissions, privacy; variability across devices.
- Phases
  - P1: Ramp + multi‑step + backup alarm.
  - P2: Habit suggestions (simple heuristics).
  - P3: Sleep window with optional sensor hints.

## 2) Scenes & Routines
- Goals
  - One‑tap “Morning Brief” and “Wind‑Down” experiences.
- Features
  - Morning Brief: time, weather, first event, commute, top headline via TTS.
  - Wind‑Down: dim theme, start ambient station, DND timer, reminders.
- UX
  - Scene cards with toggles + reorder; per‑module volume/duration.
- Tech
  - JSON scene schema; module registry; TTS driver abstraction.
- Risks
  - TTS availability across platforms; API keys for news/traffic.
- Phases
  - P1: Local TTS (Web Speech API) and mock news/traffic; scene runner.
  - P2: Settings + persistence; advanced conditions (time, weather).
  - P3: External TTS/voice packs.

## 3) Faces, Layouts, and Complications
- Goals
  - Deep personalization with consistent visual rhythm.
- Features
  - Face presets: Minimal, Information‑Dense, Analog Hybrid.
  - Layout builder: drag‑and‑drop blocks; snap grid; save presets.
  - Complications: small tiles (UV, AQI, Sunrise/Sunset, Battery, Tasks).
- UX
  - “Customize” mode; grid overlay; live preview; per‑tile density and style.
- Tech
  - Slot/region system in `DigitalClock`; registry with manifest (name, sizes, data deps).
  - Persistence: localStorage first; profile export/import JSON.
- Risks
  - Performance with many tiles; responsive complexity.
- Phases
  - P1: Fixed slots + 3 tiles (Sunrise/Sunset, AQI, Battery).
  - P2: Drag‑drop + persistence; preset faces.
  - P3: Marketplace/importable tiles.

## 4) Theme System (Advanced)
- Goals
  - Expressive yet accessible themes that adapt to context.
- Features
  - Current: Midnight, Aurora, Sunset, Slate (done).
  - Add: Custom gradient editor; time‑aware and weather‑aware themes; auto‑contrast.
- UX
  - Theme dropdown + advanced modal (gradients, accent pairs, preview).
- Tech
  - Extend CSS vars with gradient tokens; computed contrast checks; transitions.
- Phases
  - P1: Custom accent/gradient editor + preview.
  - P2: Time/weather automation rules.
  - P3: Share/import themes.

## 5) Calendar, Commute, and Context
- Goals
  - Wake aligned to real‑world constraints.
- Features
  - Calendar sync (ICS/Google): next 3 events; “wake N mins before first event”.
  - Commute snapshot: travel time to favorite location; alert if spikes.
- UX
  - Compact agenda module; smart suggestions in alarm setup.
- Tech
  - ICS parser; optional Google OAuth; traffic provider adapter (mock → real).
- Risks
  - Rate limits; credentials management.
- Phases
  - P1: ICS import; mock traffic; UI wiring.
  - P2: Google Calendar/Maps integration; background revalidation.

## 6) Health, Sleep, and Naps
- Goals
  - Recovery‑friendly behavior and nap support.
- Features
  - Sleep import (HealthKit/Fit); nightly summary; bedtime nudges.
  - Nap timers: 20/45/90 min with gentle wake and ambient options.
- UX
  - Sleep card; nap quick actions; serenity visuals.
- Tech
  - Platform bridges; heuristic recommendations; alarm ramp reuse.
- Risks
  - API access; platform fragmentation.
- Phases
  - P1: Nap timers + gentle wake.
  - P2: Health imports + insights.

## 7) Weather Pro
- Goals
  - More actionable, hyperlocal insight.
- Features
  - Minute‑cast precipitation bar; AQI; UV index; wind/gusts; alerts.
  - Outfit recommender with wardrobe presets and delta vs. yesterday.
- UX
  - Compact bars + iconography; pinned “today risk” callouts.
- Tech
  - Provider abstraction (OpenWeather/Met.no/ClimaCell); caching and fallbacks.
- Phases
  - P1: AQI + UV + minute‑cast mock.
  - P2: Real minute‑cast + alerts; wardrobe presets.

## 8) Audio & Media
- Goals
  - Richer soundscapes and reliable alarms.
- Features
  - Alarm Sound Designer: layer tone + ambient + voice intro; save presets.
  - Playlist Alarms: Spotify/Apple/Radio; offline fallback tones.
- UX
  - Rack‑style editor; drag to reorder layers; volume curves; test button.
- Tech
  - Mixer with envelopes; stream health checks; OAuth integrations.
- Risks
  - DRM and autoplay policies; network reliability.
- Phases
  - P1: Layered local sounds + ramp.
  - P2: Radio/playlist alarms + fallback.

## 9) Focus & Mindfulness
- Goals
  - Reduce distraction; promote calm and productivity.
- Features
  - Pomodoro timers, breathing prompts, ambient overlays, stats.
- UX
  - Focus mode state with reduced visuals; summary after sessions.
- Tech
  - Timer engine shared with alarms; local persistence.
- Phases
  - P1: Pomodoro + basic stats.
  - P2: Breathing and ambient overlays.

## 10) Travel Mode
- Goals
  - Seamless time zone transitions.
- Features
  - Auto detect time zone change; propose updates/offsets; sunrise/sunset for destination.
- UX
  - Discreet prompt; travel overview card; quick rebase of alarms.
- Tech
  - Intl APIs + IP geolocation fallback; offset rules.
- Phases
  - P1: Manual toggle + helpers.
  - P2: Auto detect + suggestions.

## 11) Assistance & Accessibility
- Goals
  - Inclusive and hands‑free usage.
- Features
  - Voice commands (“set 7:30”, “morning brief”); high‑contrast; dyslexia‑friendly font; larger hit targets.
- Tech
  - Web Speech (local) first; ARIA audits; prefers‑reduced‑motion fallbacks.
- Phases
  - P1: Voice intents for alarms; accessibility pass.
  - P2: Extended intents and dictation.

---

## Implementation Roadmap (6–8 weeks, modular)
1. Week 1: Complications framework + Sunrise/Sunset, AQI tiles; Alarm ramp engine.
2. Week 2: Morning Brief scene (Web Speech TTS), routine runner, settings.
3. Week 3: Playlist alarms (radio sources) + offline fallback; “hold‑to‑dismiss”.
4. Week 4: ICS calendar import; mock commute module; suggestions in alarm flow.
5. Week 5: Minute‑cast mock + alerts; wardrobe presets; theme advanced modal.
6. Week 6: Drag‑and‑drop layout; preset faces; persistence & export.
7. Week 7: Travel mode (manual + helpers); accessibility/ARIA audit; reduced motion.
8. Week 8: Integrations polish; background tasks; telemetry and error reporting.

## Engineering Notes
- Testing: component tests for scheduler, ramp curves, and tile registry; visual snapshots for themes.
- Performance: memoize tiles, virtualize lists; stagger animation; cache API results.
- Telemetry: optional local diagnostics; never collect PII by default.
- Security/Privacy: user tokens stored securely; opt‑in cloud sync only.

