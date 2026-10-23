/**
 * On web, the YouVersion DOM bundle and the app share one JavaScript realm.
 * The SDK wraps `fetch` so scripture requests go through the native content
 * client. That client also calls `fetch`, so the wrapper calls itself until
 * the stack overflows and the Read screen never paints.
 *
 * Native is unaffected: the wrapper runs in the DOM WebView, not in this file.
 * This module is imported after `@expo/metro-runtime` and before the app, so
 * the locked `fetch` is Expo's polyfill rather than the SDK wrapper.
 */
const isWeb = typeof document !== 'undefined';

if (isWeb && typeof globalThis.fetch === 'function') {
  const originalFetch = globalThis.fetch.bind(globalThis);

  try {
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      enumerable: true,
      get() {
        return originalFetch;
      },
      set() {
        // The SDK's content-cache wrapper is ignored on web.
      },
    });
  } catch {
    // `fetch` is not configurable in this runtime. Leave it alone.
  }
}
