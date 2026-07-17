# YouVersion RN (Expo) SDK — Integration Guide (Simple Bible)

> A practical setup checklist for adding the SDK to **this app** (`simple-bible`,
> Expo 56, expo-router, NativeWind, npm). Nothing here has been applied — it's
> the plan. Package manager is **npm** (`package-lock.json`).

## Prerequisites (already satisfied)

- Expo **SDK ~56.0.11**, React **19.2.3**, RN **0.85.3** — all within the SDK's
  supported ranges.
- A **development build** via `expo-dev-client` — required (Expo Go will not
  work; the SDK uses native modules).
- App scheme `simplebible` is configured in `app.json`.

## Step 1 — App Key as an environment variable

```
# .env  (add to .gitignore if not already ignored)
EXPO_PUBLIC_YOUVERSION_APP_KEY=your_app_key
```

`EXPO_PUBLIC_`-prefixed vars are inlined into the client bundle by Expo. Read it
as `process.env.EXPO_PUBLIC_YOUVERSION_APP_KEY`. (`expo-env.d.ts` is already
present for typing.)

## Step 2 — Install the SDK

```bash
npx expo install \
  @youversion/platform-react-native-expo-ui \
  @youversion/platform-react-native-expo-core
```

Install core **directly** even though UI depends on it — a direct dependency is
what lets TypeScript resolve the auth APIs (`useYVAuth`, `AuthConfig`).

## Step 3 — Install the missing peer dependencies

Simple Bible **already has**: `expo`, `expo-web-browser`, `react`, `react-dom`,
`react-native`, `react-native-gesture-handler`, `react-native-reanimated`,
`react-native-safe-area-context`.

Still **needs** (for UI + core + auth):

```bash
npx expo install \
  @gorhom/bottom-sheet \
  @expo/dom-webview \
  react-native-svg \
  expo-secure-store \
  expo-application \
  expo-crypto
```

MMKV-backed storage (core) also needs native modules:

```bash
npx expo install react-native-mmkv react-native-nitro-modules
```

Optional, only if you opt out of the default DOM webview or use worklets:

```bash
npx expo install react-native-webview react-native-worklets
```

> Use `npx expo install` (not `npm add`) so versions are pinned to Expo 56.
> `react-native-reanimated` is already wired in `babel.config.js`; if you add
> `react-native-worklets`, follow its Babel-plugin note. After adding native
> modules, rebuild the dev client (`npx expo run:ios` / `run:android` or an EAS
> dev build) — a JS reload is not enough.

## Step 4 — Wrap the app root

Simple Bible uses **expo-router**, so the root is `src/app/_layout.tsx` (this
repo keeps routes under `src/`). `GestureHandlerRootView` must be **outside**
`YouVersionProvider`.

```tsx
// src/app/_layout.tsx (illustrative — merge with the existing layout)
import { YouVersionProvider } from '@youversion/platform-react-native-expo-ui'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function RootLayout() {
  const appKey = process.env.EXPO_PUBLIC_YOUVERSION_APP_KEY
  if (!appKey) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <YouVersionProvider appKey={appKey} theme="system">
        <Stack screenOptions={{ headerShown: false }} />
      </YouVersionProvider>
    </GestureHandlerRootView>
  )
}
```

> If the existing `_layout.tsx` already wraps providers (theme, NativeWind, safe
> area), nest `YouVersionProvider` inside `GestureHandlerRootView` but around the
> screens that render Bible content. Keep the SDK's own theme in sync with the
> app's color scheme if desired (`theme="system"` follows the OS).

## Step 5 — Render a component

```tsx
import { BibleCard } from '@youversion/platform-react-native-expo-ui'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <BibleCard reference="JHN.3.16" versionId={3034} />
    </SafeAreaView>
  )
}
```

Or the full reader:

```tsx
import { BibleReader } from '@youversion/platform-react-native-expo-ui'

export default function ReadScreen() {
  return <BibleReader defaultBook="JHN" defaultChapter="3" defaultVersionId={3034} />
}
```

## Step 6 — (Optional) Enable authentication

### 6a. Redirect URI

The scheme is already `simplebible`, so the redirect URI is:

```
simplebible://callback
```

Register this exact URI for your App Key on the YouVersion platform dashboard.

### 6b. Pass `auth` to the provider

```tsx
<YouVersionProvider
  appKey={appKey}
  theme="system"
  auth={{ redirectUri: 'simplebible://callback' /* scopes defaults to ['profile','email'] */ }}
>
  <Stack screenOptions={{ headerShown: false }} />
</YouVersionProvider>
```

### 6c. Use auth state / trigger sign-in

```tsx
import { useYVAuth } from '@youversion/platform-react-native-expo-core'
import { YouVersionAuthButton } from '@youversion/platform-react-native-expo-ui'
import { Text, View } from 'react-native'

function ProfileBadge() {
  const { isAuthenticated, userInfo, isLoading } = useYVAuth()
  if (isLoading) return <Text>Loading…</Text>
  return (
    <View>
      <Text>{isAuthenticated ? userInfo?.name ?? 'Signed in' : 'Signed out'}</Text>
      <YouVersionAuthButton mode="auto" />
    </View>
  )
}
```

- `mode="auto"` flips between sign-in and sign-out based on state.
- Prefer `useYVAuthOptional()` in shared components that may render before/without
  `auth` configured (returns `null` instead of throwing).
- `signIn()` / `signOut()` / `refreshNow()` are available from `useYVAuth()` if
  you build your own auth UI.

## Common gotchas

- **Expo Go won't work.** Rebuild the dev client after adding native modules. If
  you see missing-native-module errors on first run, that's the symptom.
- **Provider nesting order matters.** `GestureHandlerRootView` outside,
  `YouVersionProvider` inside. Bottom-sheet pickers won't animate/gesture
  correctly otherwise.
- **WebView-backed components.** Each `BibleCard` / `BibleReader` / sheet hosts a
  DOM WebView; expect slightly higher memory than pure-native views and a brief
  first-paint. Don't mount many `BibleCard`s in a long list without
  virtualization.
- **NativeWind won't style SDK components.** They're self-styled via the web SDK;
  use the components' documented props (`theme`, `backgroundColor`,
  `foregroundColor`) rather than Tailwind classes.
- **Async callbacks.** Prop callbacks that cross into the DOM layer are
  `Promise`-returning; treat them as async.
- **Two storage systems.** The SDK adds MMKV (`react-native-mmkv`) alongside the
  app's existing `@react-native-async-storage/async-storage`; both can coexist.
- **Copyright attribution.** Some Bible versions require visible attribution —
  confirm per `versionId` before shipping.
- **API host override** (`apiHost`) exists on the provider for non-production
  environments; default is `api.youversion.com`.

## Verification checklist (once implemented)

- [ ] Dev client rebuilds; no missing-native-module errors in Metro logs.
- [ ] `BibleCard reference="JHN.3.16" versionId={3034}` renders verse text.
- [ ] Light/dark toggling via `theme="system"` follows the OS setting.
- [ ] Version picker sheet opens and switches versions.
- [ ] (If auth) sign-in round-trips through the browser and returns to
      `simplebible://callback`; `useYVAuth().isAuthenticated` becomes `true`;
      re-open the app and confirm the session persists (secure store + MMKV).
- [ ] Required version attributions are displayed.
- [ ] `npm run lint` and `npx tsc --noEmit` pass (modulo the pre-existing errors
      noted in `AGENTS.md`).
