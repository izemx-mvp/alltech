# AGENTS
- App pages live under the pathless `_app` layout (src/routes/_app.*.tsx) which wraps them in AppShell; login is `/`. Why: one shared sidebar/header.
- All data is mock data in src/lib/mock.ts and AI actions are simulated via useAiRun in src/components/app/kit.tsx. Why: front-end demo MVP, no backend.
