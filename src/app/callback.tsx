import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

/**
 * YouVersion finishes the token exchange in the in-app browser.
 * This route only brings the person back into the app.
 */
export default function AuthCallback() {
  const router = useRouter();
  const hasLeft = useRef(false);

  useEffect(() => {
    if (hasLeft.current) return;
    hasLeft.current = true;

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  }, [router]);

  return null;
}
