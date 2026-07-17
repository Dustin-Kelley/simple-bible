# YouVersion React Native (Expo) SDK — Documentation Set

Research and reference docs gathered **before** implementing the YouVersion
Platform React Native (Expo) SDK in the **Simple Bible** app. No app code has
been changed yet. These docs exist so we understand the SDK — its shape,
requirements, and trade-offs — before wiring it in.

## Read in this order

1. **[01-sdk-overview.md](./01-sdk-overview.md)** — What the SDK is, how it's
   built (Expo DOM Components over the Web SDK), the two packages, and the full
   component / hook / auth API reference derived from the shipped type
   definitions.
2. **[02-integration-guide.md](./02-integration-guide.md)** — Step-by-step setup
   **for this app**: install, peer dependencies (with what Simple Bible already
   has vs. still needs), provider wiring, environment variables, the
   `simplebible://` auth redirect, and common gotchas.
3. **[03-adr-adopt-youversion-rn-expo-sdk.md](./03-adr-adopt-youversion-rn-expo-sdk.md)**
   — Architecture Decision Record: the decision to adopt the SDK, alternatives
   considered, consequences, and remaining questions.

## This app is a compatible target ✅

Simple Bible already satisfies the SDK's hard requirements:

| Requirement | SDK needs | Simple Bible has |
| --- | --- | --- |
| Expo SDK | `>=56 <57` | `~56.0.11` |
| React | `>=19 <20` | `19.2.3` |
| React Native | `>=0.85.0` (core) / `>=0.83.0` (ui) | `0.85.3` |
| Dev build | required (not Expo Go) | uses `expo-dev-client` |
| Scheme (for auth) | any registered scheme | `simplebible` |

The SDK's UI package renders YouVersion's **web** SDK
(`@youversion/platform-react-ui@2.2.0`) inside a WebView via
[Expo DOM Components](https://docs.expo.dev/guides/dom-components/). That web SDK
is maintained in a separate repo (`youversion/platform-sdk-react`); here we only
consume the published npm packages.

## Source facts

Everything in these docs was derived on **2026-07-17** from:

- npm registry metadata for `@youversion/platform-react-native-expo-ui@1.0.0`
  and `@youversion/platform-react-native-expo-core@1.0.0`
- The shipped `README.md`, `package.json`, and **`.d.ts` type definitions** inside
  both published tarballs (the ground truth for exported APIs and props)
- The [React Native (Expo) Quick Start](https://developers.youversion.com/sdks/react-native-expo/quick-start)

Both packages are at **v1.0.0**, Apache-2.0, published via GitHub Actions OIDC
trusted publishing by Life.Church maintainers.
