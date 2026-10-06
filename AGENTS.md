# AGENTS
- App pages live under the pathless `_app` layout (src/routes/_app.*.tsx) wrapped in AppShell; the sidebar has exactly 5 modules (Dashboard, Community Manager IA, Campagnes Ads IA, Service Client IA, Base de connaissance IA); sub-features are tabs inside them, selected via a `tab` search param. Why: client-requested structure.
- Shared session state (ideas, publications, campaigns, conversations, FAQ, docs, infos, agent configs) lives in the in-memory store src/lib/store.ts (useStore/setStore). Why: edits must persist across pages during the session without a backend.
- AI actions are simulated via useAiRun in src/components/app/kit.tsx. Why: front-end demo MVP.
