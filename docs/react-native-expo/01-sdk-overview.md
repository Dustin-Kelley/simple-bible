# YouVersion RN (Expo) SDK — Overview & API Reference

> Updated 2026-11-20 from the published `@2.4.0` packages, the Quick Start, and
> the Components reference. Treat the installed `.d.ts` files as authoritative
> when this page and the package disagree.

## 1. What it is

Two packages that drop YouVersion Bible content and authentication into an
**Expo** app:

| Package | Role | Analogous web package |
| --- | --- | --- |
| `@youversion/platform-react-native-expo-ui` | Pre-built Bible components + the `YouVersionProvider` (theming, native sheets, auth wiring) | `@youversion/platform-react-ui` |
| `@youversion/platform-react-native-expo-core` | Installation id, optional PKCE OAuth (`useYVAuth`), token storage | roughly `@youversion/platform-core` + auth |

Both are **v2.4.0**, Apache-2.0. The UI package depends on core **2.4.0** and
on `@youversion/platform-react-ui@2.17.0`. From 2.4.0, `BibleReader`,
`BibleTextView`, `BibleCard`, and `VerseOfTheDay` draw scripture with native
text. `dom` is still accepted and ignored. The reader toolbar, pickers, search,
and verse actions are native on iOS and Android. Web still skips some native
chrome (verse-action sheets, the host `onShare` on Verse of the Day).

## 2. How it's built — the key architectural fact

From **2.4.0**, scripture is native React Native text. `BibleReader`,
`BibleTextView`, `BibleCard`, and `VerseOfTheDay` no longer paint the passage
inside an Expo DOM WebView. `dom` remains on the prop types and is ignored.
`highlightedVerses` is ignored; cached highlights paint the passage. A
`BibleTextView` reference must be one chapter, one verse, or a range inside
one chapter.

The package still ships `build/dom/*.js`. Importing the UI package runs
`ensureDomContentCache()`, which assigns `globalThis.fetch`. On web that
assignment shares the app realm, so `src/lib/keep-web-fetch.ts` still locks
`fetch`. Native sheets, the toolbar, and verse actions stay React Native.

Implications to keep in mind:

- **Native modules are required** → Simple Bible's `expo-dev-client` dev build is
  mandatory; the SDK does **not** run in Expo Go.
- Bottom sheets are native `@gorhom/bottom-sheet` surfaces.
- Callbacks that used to cross a WebView are still typed as async.
- Simple Bible styles with NativeWind/Tailwind. The SDK components are
  self-styled and won't inherit NativeWind classes.

### Since 2.1.0 (no app prop changes besides the verse-of-the-day URL)

- **2.2.0** adds `useImages` and `useUnifiedSearch`. A search HTTP 404 is
  `not-found`. This app does not call search.
- **2.3.0** adds `useSearch().images` and `useVerseOfTheDay`. Verse of the Day
  reads `GET /v1/verse-of-the-days` and `GET /v1/verse-of-the-days/{day}`.
  Simple Bible's "Read this verse" fetch uses that hyphenated path.
- **2.4.0** draws scripture natively, as described above. Peer ranges are the
  same Expo 57 set. `react-native-reanimated` stays `>=4.5.3`.

## 3. Requirements

- **Expo SDK 57** (peer range `>=57.0.0 <58.0.0`). YouVersion 2.0.0+ was built
  against Expo `57.0.23` for the iOS 27 scene-lifecycle backport. Simple Bible:
  `~57.0.31`, with `ios.enableSceneSupport` on. ✅
- **React 19** (`>=19.0.0 <20.0.0`), `react-dom` 19. Simple Bible: `19.2.3` ✅
- **React Native** `>=0.86.0`. Simple Bible: `0.86.3` ✅
- A **development build** — not Expo Go. Simple Bible uses `expo-dev-client` ✅
- Node 24 was used to build/publish (`_nodeVersion: 24.18.0`).
- A free **App Key** from [platform.youversion.com](https://platform.youversion.com/),
  conventionally exposed as `EXPO_PUBLIC_YOUVERSION_APP_KEY`.

## 4. Packages, dependencies, peers

### `@youversion/platform-react-native-expo-ui@2.4.0`

Runtime deps include `@youversion/platform-react-ui@2.17.0`,
`@youversion/platform-core@2.17.0`, `zod@4.1.12`, and
`@youversion/platform-react-native-expo-core@2.4.0`.

Peer deps (installed in the app). The "Simple Bible" column shows current state
(checked against `package.json` on 2026-07-17):

| Peer | Range | Simple Bible |
| --- | --- | --- |
| `expo` | `>=57 <58` | ✅ `~57.0.31` |
| `@expo/dom-webview` | `>=57 <58` | ✅ |
| `@gorhom/bottom-sheet` | `>=5.0.0` | ✅ |
| `expo-application` | `>=57 <58` | ✅ |
| `expo-clipboard` | `>=57 <58` | ✅ (Copy in the verse action sheet) |
| `expo-font` | `>=57 <58` | ✅ (brand fonts; a peer since UI 1.5.0) |
| `expo-web-browser` | `>=57 <58` | ✅ |
| `react` / `react-dom` | `>=19 <20` | ✅ |
| `react-native` | `>=0.86.0` | ✅ `0.86.3` |
| `react-native-gesture-handler` | `>=2.16.1` | ✅ |
| `react-native-reanimated` | `>=4.5.3` | ✅ `4.5.5` (above Expo's bundled 4.5.1; excluded from `expo install` validation) |
| `react-native-safe-area-context` | `>=5.0.0` | ✅ |
| `react-native-svg` | `>=15.15.0` | ✅ |
| `react-native-webview` | `>=13.13.0` | optional |
| `react-native-worklets` | `>=0.9.1` | ✅ `0.10.1` |

### `@youversion/platform-react-native-expo-core@2.4.0`

Runtime deps: `@youversion/platform-core@2.17.0`, `zod@4.1.12`.
Also exports `./api-client` and `./default-api-host`. This app does not import
those. `./sdk-version` is unchanged.

| Peer | Range | Simple Bible |
| --- | --- | --- |
| `expo` | `>=57 <58` | ✅ |
| `expo-crypto` | `>=57 <58` | ✅ |
| `expo-network` | `>=57 <58` | ✅ |
| `expo-secure-store` | `>=57 <58` | ✅ |
| `expo-web-browser` | `>=57 <58` | ✅ |
| `react` | `>=19 <20` | ✅ |
| `react-native` | `>=0.86.0` | ✅ `0.86.3` |
| `react-native-mmkv` | `>=4.0.0 <5.0.0` | ✅ |
| `react-native-nitro-modules` | `>=0.35.0 <0.37.0` | ✅ |

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
  showToolbar?: boolean       // default true; false also hides built-in sheets
  backgroundColor?: string
  foregroundColor?: string
  navigation?: BibleReaderNavigation  // createBibleReaderNavigation()
  dom?: import('expo/dom').DOMProps
}
```

Uncontrolled readers persist book, chapter, and version in MMKV and restore
them on the next launch. Controlled `book` / `chapter` / `versionId` win, and
the SDK does not overwrite that snapshot. Simple Bible keeps those three
controlled so the home "Continue reading" card and the reader share one
last-read record.

`createBibleReaderNavigation()` returns one pending-request object per reader.
Call it before or after the reader mounts. A newer call replaces an older one.
The reader consumes each request once.

```ts
navigation.request({ versionId: 3034, bookId: 'JHN', chapter: 3 })
navigation.focusReference({
  versionId: 3034,
  bookId: 'JHN',
  chapter: 3,
  verse: 16,
  passageId: 'JHN.3.16',
})
```

`request` loads the chapter and does not focus a verse. `chapter` is a number.
`focusReference` loads the chapter, scrolls to the verse, and dims the rest.
Pass the original `passageId` for a verse range. Both calls go through the
book / chapter / version setters, so controlled props still notify
`onBookChange` / `onChapterChange` / `onVersionChange`.

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
  background?: 'light' | 'dark'          // default 'light'
  mode?: 'auto' | 'signIn' | 'signOut'   // 'auto' follows auth state
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
  `VerseOfTheDay` — these come from `@youversion/platform-react-ui@2.17.0`; the
  exhaustive prop list is in that package's published types
  (`node_modules/@youversion/platform-react-ui` once installed).
