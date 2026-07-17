# ADR: Adopt the YouVersion React Native (Expo) SDK in Simple Bible

Date: 2026-07-17

## Status

Proposed

## Context

Simple Bible currently renders scripture from a **bundled local KJV** JSON
(`src/data/kjv.json`, read via `src/lib/bible.ts`). We want richer YouVersion
content — multiple versions, a full reader with pickers and footnotes, Verse of
the Day, and optionally YouVersion sign-in.

YouVersion ships an official SDK for exactly this:

- `@youversion/platform-react-native-expo-ui@1.0.0` — Bible components + provider
- `@youversion/platform-react-native-expo-core@1.0.0` — installation id, PKCE
  auth, token storage

Both are v1.0.0, Apache-2.0, maintained by Life.Church. The UI package is built
on the **web** SDK's `@youversion/platform-react-ui@2.2.0`, rendered inside a
WebView via [Expo DOM Components](https://docs.expo.dev/guides/dom-components/) —
so the native and web SDKs are versioned and evolved together.

Simple Bible is a compatible host: Expo `~56.0.11`, React `19.2.3`, RN `0.85.3`,
a `expo-dev-client` dev build, scheme `simplebible`, expo-router under `src/app`.

The realistic alternatives:

1. **Adopt the official RN/Expo SDK** (this proposal). Fastest path; components,
   theming, pickers, footnotes, and PKCE auth are pre-built and maintained by YV.
2. **Consume the web SDK directly in a WebView** we build ourselves. Reinvents
   what the Expo SDK's DOM layer already does; we'd own the bridge, theming, and
   auth plumbing.
3. **Keep local content / call the YouVersion Platform HTTP API directly** and
   build fully-native RN UI. Maximum control and best performance, but large
   scope: rendering, pagination, footnotes, pickers, attribution, and OAuth all
   become ours.

## Decision

Adopt the official SDK (alternative 1) for YouVersion Bible/reader/auth features
in Simple Bible. Import Bible UI from `-ui`; import auth (`useYVAuth`,
`AuthConfig`) from `-core`, with a direct dependency on both.

Baseline versions and constraints we accept:

- The app stays on Expo **56** / React **19** (already true); the SDK's peer
  ranges are satisfied.
- We install the additional peers (`@gorhom/bottom-sheet`, `@expo/dom-webview`,
  `react-native-svg`, `expo-secure-store`, `expo-application`, `expo-crypto`,
  `react-native-mmkv`, `react-native-nitro-modules`) and rebuild the dev client.
- App Key via `EXPO_PUBLIC_YOUVERSION_APP_KEY`; auth redirect
  `simplebible://callback`.

Likely first landing spots: `BibleReader` on `src/app/read.tsx`, and
`VerseOfTheDay` / `BibleCard` on `src/app/index.tsx`. The bundled KJV path can
remain as an offline fallback initially and be retired once the SDK reader is in
place.

We defer alternatives 2 and 3 unless a concrete requirement (e.g. offline
reading, deeply custom native UI, or a hard performance ceiling the WebView can't
meet) forces native rendering.

## Consequences

**Positive**

- Minimal integration surface: install, wrap with `YouVersionProvider`, render
  components. Theming, pickers, footnotes, and localization come for free.
- Multiple versions and always-current content instead of a single bundled KJV.
- Auth is a solved problem: PKCE OAuth, secure token storage, and auto-refresh
  are handled by `-core`; we just configure `redirectUri` and read `useYVAuth`.
- Kept in lockstep with the web SDK — bug fixes and content updates flow through.

**Negative / trade-offs**

- **WebView-backed rendering.** Components run the web SDK inside Expo DOM
  WebViews. Expect higher memory per component and a brief first paint; long
  lists of cards need virtualization. Deep native customization is limited to the
  documented props, and NativeWind classes won't style SDK components.
- **Heavier native footprint.** Adds MMKV + nitro-modules, SVG, bottom-sheet,
  secure-store, crypto — more native modules to keep version-aligned, and a dev
  client rebuild is required.
- **Version coupling.** Locked to Expo SDK 56 / React 19 ranges; a future Expo
  upgrade must wait for a compatible SDK release.
- **Online dependency.** Content now requires network + a valid App Key, where
  the bundled KJV worked fully offline. Decide whether an offline fallback stays.
- **Attribution obligations.** Some Bible versions require visible copyright
  attribution; shipping without it is a licensing risk.

## Open questions (resolve before writing integration code)

1. **Scope of v1:** just `VerseOfTheDay` / `BibleCard` on the home screen, or the
   full `BibleReader` (with auth) replacing the local-KJV reader on `read.tsx`?
2. **Is authentication in scope for v1?** If yes, register
   `simplebible://callback` and confirm scopes (`profile`, `email`) on the
   platform dashboard.
3. **Offline fallback:** keep `src/data/kjv.json` + `src/lib/bible.ts` as an
   offline path, or fully replace it?
4. **Attribution:** which `versionId`s will we ship, and what does each require?
5. **Non-prod API host:** do we need to point `apiHost` at a staging environment
   during development?

## References

- Overview & API reference: [`01-sdk-overview.md`](./01-sdk-overview.md)
- Integration steps: [`02-integration-guide.md`](./02-integration-guide.md)
- Quick Start: https://developers.youversion.com/sdks/react-native-expo/quick-start
- SDK source repo: https://github.com/youversion/platform-sdk-reactnative-expo
