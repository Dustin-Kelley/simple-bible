# Shipping Simple Bible

Checklist for the first App Store and Play release. The repo is set up for EAS Build and EAS Submit. The items below need a person, a store account, or a YouVersion console click.

Read [README.md](../README.md) for day-to-day setup. YouVersion's own steps are the [quick start](https://developers.youversion.com/sdks/react-native-expo/quick-start) and [authentication](https://developers.youversion.com/sdks/react-native-expo/authentication).

## Before you archive a build

1. Confirm `EXPO_PUBLIC_YOUVERSION_APP_KEY` is set in the EAS `production` environment (and in `preview` / `development` if you build those). Use visibility `sensitive` or plaintext. A `secret` value is available on the EAS Build worker, so a build can inline it, but you cannot pull a secret locally and you cannot use one to bundle JavaScript for `eas update` on this SDK.

   ```bash
   eas env:set --name EXPO_PUBLIC_YOUVERSION_APP_KEY --value YOUR_KEY --environment production --visibility sensitive
   ```

2. In the [YouVersion Platform console](https://platform.youversion.com/), open the app that owns that key and add this callback URI exactly:

   ```text
   simplebible://callback
   ```

   The app scheme in `app.json` is `simplebible`. The redirect the provider uses is `AUTH_REDIRECT_URI` in `src/lib/youversion.ts`. Those two have to stay in lockstep. Sign-in scopes are the SDK default, `profile` and `email`. Highlights are not requested.

3. The callback route is already in the app. `src/app/callback.tsx` matches `simplebible://callback`. The root layout is a stack: Home, Read, and Settings stay in one tab navigator, and `callback` is a separate screen. A hidden native tab cannot be opened, so the callback is not a tab. When the redirect arrives, that screen goes back to the tab you left, or to Home if there is nothing to go back to. You still register the URI in the console (step 2) before testing sign-in on a device.

4. Publish [docs/index.html](index.html) at a public HTTPS URL. That page is the privacy policy and the support contact. The previous copy said the app was an offline King James Bible with no account. That is no longer true. Replace any live copy of the old page before review.

5. Spot-check a copyrighted Bible version and a public-domain one in the reader and on the verse of the day. Those components print the version's attribution. There is no separate `BibleTextView` screen that would need a hand-written copyright line.

6. If this app is already in either store, sync EAS's remote build number so `autoIncrement` does not reuse a number Apple or Google already has:

   ```bash
   eas build:version:get
   eas build:version:set
   ```

   The user-facing version is `expo.version` in `app.json` (currently `1.1.0`). Bump that yourself for each store release. EAS does not bump it. `package.json` `version` is still `1.0.0` and is not what the stores display.

## Credentials only you can create

- Expo account `dustinkelley`, project `simple-bible` (`8a1e3b3c-80d0-452f-87fc-916f1895f716`). `eas login` as that account, or as someone with access to the project.
- Apple Developer Program membership. Create the App Store Connect app with bundle ID `com.dustinkelley.simple-bible`. Then:

  ```bash
  eas credentials --platform ios
  ```

  For a non-interactive iOS submit, add `submit.production.ios.ascAppId` (and team id if EAS asks) after the App Store Connect record exists. Those values are not in the repo because they are yours.

- Google Play Console developer account. Create the app with package name `com.dustinkelley.simplebible`. Create a Play service-account JSON key and attach it to this Android package:

  ```bash
  eas credentials --platform android
  ```

  Do not commit the JSON key. EAS stores it.

## Build and upload

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

Or:

```bash
eas build --platform all --profile production --auto-submit
```

What those profiles do:

- `production` turns on `autoIncrement`, channel `production`, and EAS environment `production`. Android output is an AAB, which Play requires. iOS output is a store IPA.
- `preview` is an internal build for testers. Android is an APK so someone can install it without Play.
- `development` is a dev client for a physical device. `development-simulator` is the iOS Simulator variant. The old `development` profile built only for the simulator. Device builds are now the default so YouVersion sign-in can be tried on a phone.

Android `eas submit` uploads to the **internal** track as a **draft**. Testers do not receive it, and it is not the public production track. When you want a wider release, change `submit.production.android.track` and `releaseStatus` in `eas.json`, or promote the release in Play Console.

iOS upload lands in App Store Connect. TestFlight and the public release still wait for you to submit the version for review and release it.

`ITSAppUsesNonExemptEncryption` is `false`. On Apple's export question, the app uses HTTPS and the operating system's crypto for sign-in. That is the standard exemption. Confirm that answer still matches the binary you upload.

## Store listing, filled in by hand

Both stores will reject the binary until the listing exists.

- Name, subtitle, description, and keywords. Describe it as a Bible reader powered by YouVersion. Do not say the text is stored in the app or that it works offline.
- Screenshots and a preview from a preview or production build. iPhone only: `ios.supportsTablet` is `false`, so do not upload an iPad-only listing unless you turn tablet support on and rebuild.
- Privacy policy URL: the public address of `docs/index.html`.
- Support URL and contact: the same page, email `kelleydustin2018@gmail.com`.
- Age rating. You choose it in each console. The app has no chat and no ads. Bible text is the content reviewers will rate.
- App privacy (Apple) and Data safety (Play). Match the answers to `ios.privacyManifests` in `app.json` and to the privacy page:
  - Not used for tracking. No advertising ID.
  - If the person signs in: name, email address, and YouVersion user id, linked to that account, used for app functionality.
  - Installation id, linked after sign-in, used for app functionality, not for tracking. `@youversion/platform-react-native-expo-core` 2.1.0 creates it once with `Crypto.randomUUID()`, stores it on the device, and sends that value as `X-YVP-Installation-Id` on scripture requests and on token requests. Sign-in also puts the same id on the authorize request, so YouVersion can tie this install to the account. `expo-application` is used for the display name only. The privacy manifest lists this as Other Data Types (`NSPrivacyCollectedDataTypeOtherDataTypes`), linked. On Apple's form, use Other Data. On Play's form, describe the same random per-install id.
  - Data is sent over HTTPS to YouVersion (`api.youversion.com`) and, at launch, to Expo's update service.
  - No camera, microphone, location, contacts, or photo-library prompts. Android blocks those permissions, plus storage permissions and the advertising ID, so a library cannot add them quietly.
- Data deletion. Deleting the app removes on-device reading data and tokens. A YouVersion account is deleted through YouVersion, not through this app. Point Play's deletion link at the privacy page section that says this.
- Copyright. Bible text stays under each publisher's license. YouVersion's [copyright guide](https://developers.youversion.com/sdks/react-native-expo/guides/copyright-and-attribution) is the reference. The reader and verse of the day already render the attribution those components provide.

After the first TestFlight or Play upload, Apple may email about a missing required-reason API. The manifest already includes the reasons declared by the Expo and React Native libraries in this repo (UserDefaults `CA92.1`, file timestamps `C617.1` / `0A2A.1` / `3B52.1`, disk space `E174.1` / `85F4.1`, system boot time `35F9.1`). Add any further reason from Apple's email under `ios.privacyManifests` and ship a new build.

## After it is in the store

JavaScript and asset fixes for the same native fingerprint:

```bash
eas update --channel production --environment production --message "Describe the change"
```

A new native module, a scheme change, or a permission change needs `eas build`, not `eas update`.

## Decisions still open

These were left as they are so an already-registered store app or YouVersion key does not break.

- **Bundle IDs do not match.** iOS is `com.dustinkelley.simple-bible` (hyphen). Android is `com.dustinkelley.simplebible` (no hyphen). Change either one only if that store app does not exist yet. After the first upload, the id is permanent.
- **URL scheme is `simplebible`.** YouVersion recommends a reverse-DNS scheme such as `com.dustinkelley.simplebible`, because custom schemes are not owned. On Android, two apps with the same scheme make the system ask which app to open. Keep `simplebible` if the callback is already registered. If you change it before release, change `expo.scheme` and `AUTH_REDIRECT_URI` together, register the new `scheme://callback`, and rebuild. A JavaScript update cannot change the scheme.
- **iPhone only.** `supportsTablet` is false. Turn it on only if you want an iPad layout, then rebuild.
- **Android submit stays on the internal draft track** until you change `eas.json` or promote the release.
- **Highlights** are off. To save highlights to YouVersion, add `permissions: ['highlights']` on the provider `auth` config and have existing users sign in again. That edit is in `src/app/_layout.tsx`, which this pass did not touch.
- **`package.json` version is `1.0.0`.** The store version is `app.json` `1.1.0`. Leave the package version unless you want them to match. Stores do not read it.
