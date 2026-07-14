# Simple Bible

A simple, distraction-free Bible reading app built with [Expo](https://expo.dev) (expo-router + NativeWind). Scripture text is the King James Version (public domain), bundled offline — the app needs no network and collects no data.

## Features

- **Read** — all 66 books with a book/chapter picker, previous/next chapter navigation, and adjustable text size (persisted)
- **Verse of the Day** — a daily rotating verse you can save or share
- **Search** — full-text verse search plus reference jumps ("1 John 4" → straight to the chapter)
- **Continue reading** — your last position is remembered

## Development

```bash
npm install
npx expo start        # then press i for the iOS simulator, or w for web
```

Lint and typecheck:

```bash
npm run lint
npx tsc --noEmit
```

## Building for the App Store

Builds and submissions run through [EAS](https://docs.expo.dev/build/introduction/). The `ios/` and `android/` directories are generated (`npx expo prebuild`) and gitignored; [app.json](app.json) is the source of truth.

```bash
eas build --platform ios --profile production
eas submit --platform ios
```

Over-the-air JS updates for builds already in the store (same runtime fingerprint):

```bash
eas update --channel production
```

## Scripture data

`src/data/kjv.json` contains the King James Version (31,100 verses), which is in the public domain, sourced from [thiagobodruk/bible](https://github.com/thiagobodruk/bible) with translator-note markup stripped.
