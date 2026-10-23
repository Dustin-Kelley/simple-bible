# YouVersion React Native (Expo) SDK — Documentation Set

Reference for the YouVersion Platform React Native (Expo) SDK as used by
**Simple Bible**.

## Read in this order

1. **[01-sdk-overview.md](./01-sdk-overview.md)** — What the SDK is, how it's
   built, and the component / hook / auth API this app depends on.
2. **[02-integration-guide.md](./02-integration-guide.md)** — How Simple Bible
   is wired: packages, provider, theme, reader navigation, and auth redirect.
3. **[03-adr-adopt-youversion-rn-expo-sdk.md](./03-adr-adopt-youversion-rn-expo-sdk.md)**
   — Architecture Decision Record for adopting the SDK.

## This app's versions

| Requirement | SDK 2.1.0 needs | Simple Bible |
| --- | --- | --- |
| Expo SDK | `>=57.0.0 <58.0.0`, and `>=57.0.23` for the iOS 27 scene backport | `~57.0.31` |
| React | `>=19 <20` | `19.2.3` |
| React Native | `>=0.86.0` | `0.86.3` |
| Dev build | required (not Expo Go) | `expo-dev-client` |
| Scheme (for auth) | any registered scheme | `simplebible` |

YouVersion UI and core are both **2.1.0**. The UI package renders scripture from
`@youversion/platform-react-ui` inside a WebView via
[Expo DOM Components](https://docs.expo.dev/guides/dom-components/). Native
chrome (toolbar, pickers, verse actions) is React Native.

`BibleReader` on `src/app/read.tsx` is the reading surface. Home jumps
(continue reading, saved verses, verse of the day) go through one shared
`createBibleReaderNavigation()` object. Book, chapter, and version stay
controlled so the existing last-read store still drives the home card.

## Source facts

Updated **2026-10-23** from:

- npm `@youversion/platform-react-native-expo-ui@2.1.0` and
  `@youversion/platform-react-native-expo-core@2.1.0`
- The published type definitions in those packages
- The [React Native (Expo) Quick Start](https://developers.youversion.com/sdks/react-native-expo/quick-start)
  and [Components](https://developers.youversion.com/sdks/react-native-expo/components)
- The [SDK repo](https://github.com/youversion/platform-sdk-reactnative-expo)

iOS builds with Xcode 27 need the UIKit scene lifecycle. `app.json` opts in
with `expo-build-properties` `ios.enableSceneSupport` (Expo `57.0.23+`). A new
development build is required after this upgrade. Web does not exercise that
native startup path.
