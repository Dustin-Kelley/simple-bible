# YouVersion RN (Expo) SDK — Overview & API Reference

> Derived on 2026-07-17 from the published `@1.0.0` tarballs' type definitions,
> READMEs, and package.json, plus the official Quick Start. Treat the `.d.ts`
> details below as authoritative; prose is interpretation.

## 1. What it is

Two packages that drop YouVersion Bible content and authentication into an
**Expo** app:

| Package | Role | Analogous web package |
| --- | --- | --- |
| `@youversion/platform-react-native-expo-ui` | Pre-built Bible components + the `YouVersionProvider` (theming, native sheets, auth wiring) | `@youversion/platform-react-ui` |
| `@youversion/platform-react-native-expo-core` | Installation id, optional PKCE OAuth (`useYVAuth`), token storage | roughly `@youversion/platform-core` + auth |

Both are **v1.0.0**, Apache-2.0. The UI package depends on core, and — critically
— on the web SDK's `@youversion/platform-react-ui@2.2.0`.

## 2. How it's built — the key architectural fact

The UI components are **not** re-implemented in native React Native. They render
YouVersion's **Web SDK inside a WebView** using
[Expo DOM Components](https://docs.expo.dev/guides/dom-components/) (the
`'use dom'` directive). The package's own description: *"Built on the React Web
SDK via Expo DOM Components."*

Concretely, for every visible component there are two layers in the tarball:

- `build/dom/*.js` — the actual web component (e.g. `dom/bible-card.js`), which
  wraps `@youversion/platform-react-ui` and runs inside an Expo DOM WebView.
- `build/native/*.js` — a thin React Native wrapper that owns native concerns
  (theme resolution, `@gorhom/bottom-sheet` sheets, gesture handling, auth
  token/installation-id injection) and passes props down through `dom` props to
  the DOM layer.

Implications to keep in mind:

- **Native modules are required** → Simple Bible's `expo-dev-client` dev build is
  mandatory; the SDK does **not** run in Expo Go.
- Each component (and each bottom sheet) hosts a WebView. Bottom sheets are
  real native `@gorhom/bottom-sheet` surfaces whose *content* is a DOM WebView.
- Props that cross into the DOM layer are serialized; callbacks are async
  (`() => Promise<void>`) because they bridge the native↔WebView boundary.
- Styling/branding comes from the web `platform-react-ui` (CSS injected via
  React 19 `<style precedence>`), themed light/dark by the native wrapper. Note
  Simple Bible styles with NativeWind/Tailwind — the SDK components are
  self-styled and won't inherit NativeWind classes.

## 3. Requirements

- **Expo SDK 56+** (peer range `>=56.0.0 <57.0.0`). Simple Bible: `~56.0.11` ✅
- **React 19** (`>=19.0.0 <20.0.0`), `react-dom` 19. Simple Bible: `19.2.3` ✅
- **React Native** `>=0.83.0` (UI) / `>=0.85.0` (core). Simple Bible: `0.85.3` ✅
- A **development build** — not Expo Go. Simple Bible uses `expo-dev-client` ✅
- Node 24 was used to build/publish (`_nodeVersion: 24.18.0`).
- A free **App Key** from [platform.youversion.com](https://platform.youversion.com/),
  conventionally exposed as `EXPO_PUBLIC_YOUVERSION_APP_KEY`.

## 4. Packages, dependencies, peers

### `@youversion/platform-react-native-expo-ui@1.0.0`

Runtime deps: `@radix-ui/react-use-controllable-state`, `@rn-primitives/portal`,
**`@youversion/platform-react-ui@2.2.0`**, `expo-localization`, `i18next`,
`react-i18next`, `zustand`, and `@youversion/platform-react-native-expo-core@1.0.0`.

Peer deps (installed in the app). The "Simple Bible" column shows current state
(checked against `package.json` on 2026-07-17):

| Peer | Range | Simple Bible |
| --- | --- | --- |
| `expo` | `>=56 <57` | ✅ `~56.0.11` |
| `@expo/dom-webview` | `>=56 <57` | ❌ add |
| `@gorhom/bottom-sheet` | `>=5.0.0` | ❌ add |
| `expo-web-browser` | `>=56 <57` | ✅ present |
| `react` / `react-dom` | `>=19 <20` | ✅ present |
| `react-native` | `>=0.83.0` | ✅ `0.85.3` |
| `react-native-gesture-handler` | `>=2.16.1` | ✅ present |
| `react-native-reanimated` | `>=3.16.0` | ✅ present |
| `react-native-safe-area-context` | `>=5.0.0` | ✅ present |
| `react-native-svg` | `>=15.15.0` | ❌ add |
| `react-native-webview` | `>=13.13.0` | **optional** (only if opting out of DOM webview) |
| `react-native-worklets` | `>=0.8.0` | **optional** (❌ add if used) |

### `@youversion/platform-react-native-expo-core@1.0.0`

Runtime deps: `zod@4.4.3`.

| Peer | Range | Simple Bible |
| --- | --- | --- |
| `expo` | `>=56 <57` | ✅ |
| `expo-application` | `>=56 <57` | ❌ add (installation id) |
| `expo-crypto` | `>=56 <57` | ❌ add (PKCE) |
| `expo-secure-store` | `>=56 <57` | ❌ add (token storage) |
| `expo-web-browser` | `>=56 <57` | ✅ present |
| `react` | `>=19 <20` | ✅ |
| `react-native` | `>=0.85.0` | ✅ `0.85.3` |
| `react-native-mmkv` | `>=4.0.0 <5.0.0` | ❌ add |
| `react-native-nitro-modules` | `>=0.35.0 <0.37.0` | ❌ add (MMKV backend) |

> Also required by the UI runtime dep chain but not a peer: `expo-localization`
> (bundled) — no action needed.

## 5. UI package — exported API

Barrel: `@youversion/platform-react-native-expo-ui`.

### Components

```
BibleCard, BibleReader, BibleTextView, VerseOfTheDay,
BibleVersionPickerSheet, BibleChapterPickerSheet, BibleReaderSettingsSheet,
YouVersionAuthButton, YouVersionProvider
```

Exported prop types mirror each: `BibleCardProps`, `BibleReaderProps`,
`BibleTextViewProps`, `VerseOfTheDayProps`, `BibleVersionPickerSheetProps`,
`BibleChapterPickerSheetProps`, `BibleReaderSettingsSheetProps`,
`YouVersionAuthButtonProps`, `YouVersionProviderProps`, and `YouVersionTheme`.

Also exported (from `./hooks`): `useTheme`, `ThemeContext`, and `Theme`
(`'light' | 'dark'`).

### `YouVersionProvider` (UI) — required root wrapper

```ts
type YouVersionTheme = 'light' | 'dark' | 'system'

type YouVersionProviderProps = {
  appKey: string
  apiHost?: string            // defaults to api.youversion.com
  theme?: YouVersionTheme     // 'system' follows device
  locale?: string             // omit → device locale via expo-localization
  auth?: AuthConfig           // enables sign-in; see core package
  fallback?: ReactNode        // rendered while providers initialize
  children: ReactNode
}
```

This is the superset provider: it wraps the **core** `YouVersionProvider`
(installation id + optional auth), theme resolution, i18n, and the native sheet
portal host. Must be rendered **inside** `GestureHandlerRootView`.

### `BibleCard`

```ts
type BibleCardProps = {
  reference: string           // USFM, e.g. "JHN.3.16" (from web props)
  versionId?: number          // controlled
  defaultVersionId?: number   // uncontrolled initial
  theme?: 'light' | 'dark' | 'system'
  showVersionPicker?: boolean
  onVersionChange?: (versionId: number) => void
  onVersionPickerPress?: (data: BibleVersionPickerPressData) => Promise<void>
  onFootnotePress?: (data: FootnoteData) => Promise<void>
  dom?: import('expo/dom').DOMProps
  // ...remaining web BibleCardProps except internal appKey/apiHost/installationId
}
```

Single-passage card. `reference` is USFM `BOOK.CHAPTER.VERSE`; `versionId` is a
YouVersion version id (e.g. `3034` = Berean Standard Bible).

### `BibleReader`

Full chapter reader with toolbar, version/chapter pickers, footnotes, and reader
settings (font size/family, line spacing). Auth-aware.

```ts
type BibleReaderProps = {
  theme?: 'light' | 'dark' | 'system'
  book?: string; defaultBook?: string
  chapter?: string; defaultChapter?: string
  versionId?: number; defaultVersionId?: number
  onBookChange?: (book: string) => Promise<void>
  onChapterChange?: (chapter: string) => Promise<void>
  onVersionChange?: (versionId: number) => Promise<void>
  onChapterPickerPress?: (data: BibleChapterPickerPressData) => Promise<void>
  onVersionPickerPress?: (data: BibleVersionPickerPressData) => Promise<void>
  onFootnotePress?: (data: FootnoteData) => Promise<void>
  showToolbar?: boolean
  backgroundColor?: string
  foregroundColor?: string
  dom?: import('expo/dom').DOMProps
}
```

At the DOM layer, auth is opt-in via a discriminated union:
`{ includeAuth: true; authRedirectUrl: string } | { includeAuth?: false }`. The
native wrapper feeds it `accessToken`, `userInfo`, `onSignInPress`,
`onSignOutPress` from `useYVAuth`, plus reader font state.

### `BibleTextView`

Lower-level verse/passage renderer.

```ts
type BibleTextViewProps = {
  theme?: 'light' | 'dark' | 'system'
  onVerseSelect?: (verses: number[]) => Promise<void>
  onFootnotePress?: (data: FootnoteData) => Promise<void>
  passageState?: DomPassageState  // pass a pre-fetched passage + error state
  dom?: import('expo/dom').DOMProps
  // ...remaining web BibleTextViewProps
}
```

### `VerseOfTheDay`

```ts
type VerseOfTheDayProps = {
  theme?: 'light' | 'dark' | 'system'
  onShare?: ...                 // from web props
  dom?: import('expo/dom').DOMProps
  // ...remaining web VerseOfTheDayProps
}
```

### Bottom sheets (controlled `isOpen` / `onClose`)

```ts
type BibleVersionPickerSheetProps = {
  isOpen: boolean; onClose: () => void
  versionId?: number
  theme?: 'light' | 'dark' | 'system'
  onSelect?: (versionId: number) => void | Promise<void>
  dom?: import('expo/dom').DOMProps
}

type BibleChapterPickerSheetProps = {
  isOpen: boolean; onClose: () => void
  book?: string; chapter?: string; versionId?: number
  theme?: 'light' | 'dark' | 'system'
  onSelect?: (data: BibleChapterPickerSelectData) => void | Promise<void>
  dom?: import('expo/dom').DOMProps
}

type BibleReaderSettingsSheetProps = {
  isSettingsSheetOpen: boolean
  onClose: () => void
}
```

`BibleReader` opens these internally; they're also exported so you can drive
pickers from your own UI.

### `YouVersionAuthButton`

Branded sign-in / sign-out button.

```ts
type YouVersionAuthButtonProps = {
  background?: 'light' | 'dark'
  radius?: 'rounded' | 'rectangular'
  outline?: boolean
  mode?: 'auto' | 'signIn' | 'signOut'   // 'auto' follows auth state
  size?: 'default' | 'short' | 'icon'
  text?: string                          // override localized label
}
```

Requires `auth` configured on the provider (it uses `useYVAuth` under the hood).

## 6. Core package — exported API

Barrel: `@youversion/platform-react-native-expo-core`.

```
useYouVersion, YouVersionProvider,
useYVAuth, useYVAuthOptional,
mmkvStorage
// types: YouVersionContextValue, AuthConfig, AuthScope, YVUserInfo
```

### Core `YouVersionProvider`

```ts
type YouVersionProviderProps = {
  appKey: string
  apiHost?: string     // default 'api.youversion.com'
  auth?: AuthConfig
  fallback?: ReactNode
  children: ReactNode
}
```

Establishes the installation id and (if `auth` is set) the auth provider. Most
apps use the **UI** provider instead, which wraps this one.

### `useYouVersion()`

```ts
type YouVersionContextValue = {
  appKey: string
  apiHost: string
  installationId: string
  authRedirectUrl?: string
}
```

### Auth

```ts
type AuthScope = 'profile' | 'email'      // DEFAULT_SCOPES = ['profile','email']

type AuthConfig = {
  redirectUri: string                     // Simple Bible: 'simplebible://callback'
  scopes?: readonly AuthScope[]
}

type YVUserInfo = {
  id?: string
  name?: string
  email?: string
  avatarUrl?: string
}
```

`useYVAuth()` returns:

```ts
type AuthContextValue = {
  isAuthenticated: boolean
  accessToken: string | null
  userInfo: YVUserInfo | null
  error: Error | null
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  refreshNow: () => Promise<void>          // force a token refresh
}
```

`useYVAuthOptional()` is the same but returns `null` (instead of throwing) when
`auth` was not configured on the provider — use it in components that render in
both authed and non-authed states.

**Auth mechanism (internal, good to know):**

- **PKCE OAuth** via `expo-web-browser` + `expo-crypto`. Flow: generate PKCE
  params → open authorize session → exchange `code` for tokens → derive user
  info from the `id_token` JWT.
- **Token storage split:**
  - Access + refresh tokens → `expo-secure-store` (Keychain service
    `com.youversion.platform`), keys `yvp.accessToken`, `yvp.refreshToken`.
  - Expiry date + cached user info → MMKV (`yvp.expiryDate`, `yvp.userInfo`).
- Tokens auto-refresh with a **60-second leeway** before expiry.
- `TokenEndpointError.isRevoked` distinguishes a revoked refresh token (forces
  re-sign-in) from a transient failure.

### Storage & installation id

- `mmkvStorage` — the shared `react-native-mmkv` instance (`yv-platform`),
  exported for app reuse if desired. (Simple Bible currently uses
  `@react-native-async-storage/async-storage`; the SDK adds MMKV alongside it.)
- Installation id is generated once and persisted in MMKV; sent to the API to
  identify the install (not the user). Default API host `api.youversion.com`.

## 7. Reference values

- **USFM reference**: `BOOK.CHAPTER.VERSE`, e.g. `JHN.3.16`, `GEN.1.1`.
- **versionId** examples: `3034` = Berean Standard Bible (BSB). Other versions
  have their own numeric ids; some require attribution (see integration guide).
- **Env var** convention: `EXPO_PUBLIC_YOUVERSION_APP_KEY`.
- **Auth redirect** for this app: `simplebible://callback` (scheme `simplebible`).

## 8. Open items to confirm with YouVersion before building

- Exact **redirect URI registration** requirements on the platform dashboard
  (must match `simplebible://callback` and the `simplebible` scheme).
- Whether specific **Bible versions require displayed copyright attribution**
  and the format (the quick start links a "copyright attribution requirements"
  page; confirm per version id we ship).
- The full set of **web props** inherited by `BibleCard` / `BibleTextView` /
  `VerseOfTheDay` — these come from `@youversion/platform-react-ui@2.2.0`; the
  exhaustive prop list is in that package's published types
  (`node_modules/@youversion/platform-react-ui` once installed).
