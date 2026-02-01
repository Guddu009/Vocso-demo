# Code Agent Guidelines – Expo LMS App

## Tech Stack
- Expo (managed) + TypeScript
- expo-router for navigation
- NativeWind (Tailwind)
- TanStack Query (server state)
- Axios (API layer)
- Zustand (client/local state)
- Expo AV (video), Expo FileSystem/Sharing (docs)
- Expo Notifications (push)
- Firebase used only via backend + Expo push tokens

## Architecture Rules
- Routes live in `/app` only (expo-router).
- Business logic lives in `/src/features/<feature>`.
- Each feature owns: `api.ts`, `queries.ts`, `types.ts`, and optional `store.ts`.
- Use TanStack Query for all server data (no server data in Zustand).
- Use Zustand only for local UI/session state (auth, player, downloads).
- Axios must be used via the shared client (`src/api/client.ts`).

## Coding Standards
- TypeScript strict, no `any`.
- Prefer composition over inheritance.
- No logic in screens; screens only orchestrate hooks/components.
- Handle loading, error, and empty states explicitly.
- Follow mobile performance best practices (memoization, pagination).

## Data & Security
- Tokens stored only in Expo SecureStore.
- No secrets or env values hardcoded.
- Video access via signed URLs or backend-controlled access.
- Validate all forms using Zod.

## Quality & Production
- Add error boundaries where applicable.
- Log errors via Sentry.
- Keep components small and reusable.
- Code must be readable, scalable, and production-ready.

## Prohibited
- No direct API calls in components.
- No global state for server data.
## Completed Tasks

### Chatroom App with Background Notifications
- **Status**: Implemented
- **Features**:
    - Username-based login (Zustand store).
    - Real-time messaging with Firebase Firestore.
    - Expo Notifications integration (Foreground/Background/Killed states).
    - Auto-navigation to chatroom on notification tap.
- **Key Files**:
    - `app/login.tsx`, `app/chat.tsx`, `app/index.tsx`
    - `src/config/firebaseConfig.js`
    - `src/utils/notificationHelper.ts`
    - `src/store/userStore.ts`

