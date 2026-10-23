# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Cursor Cloud specific instructions

`simple-bible` is an Expo 56 / React Native app (expo-router + NativeWind). Package manager is npm (`package-lock.json`). Scripts live in `package.json`.

- Runnable target in the headless cloud VM is **web** only (no Android/iOS emulator available): `npx expo start --web --port 8081`. It serves on `http://localhost:8081`; the first web bundle takes ~15-20s.
- Lint: `npm run lint` (`expo lint`). ESLint config (`eslint.config.js`) and its deps are committed so lint runs without the interactive first-run installer.
- Typecheck: `npx tsc --noEmit`. Side-effect CSS imports are declared in `src/types/css.d.ts`.
- CI: `.github/workflows/ci.yml` runs lint and `npx tsc --noEmit` on pull requests.
- No automated test suite is configured (no `test` script, no Jest).
