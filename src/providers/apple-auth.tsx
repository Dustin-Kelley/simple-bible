import { useYVAuth } from '@youversion/platform-react-native-expo-core';
import * as AppleAuthentication from 'expo-apple-authentication';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  appleDisplayName,
  clearAppleAccount,
  mergeAppleAccount,
  readAppleAccount,
  writeAppleAccount,
} from '@/lib/apple-account';
import { deriveAuthState, type AppleAccount, type AuthState } from '@/lib/auth-state';

type AppleAuthContextValue = {
  account: AppleAccount | null;
  isLoading: boolean;
  isAvailable: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AppleAuthContext = createContext<AppleAuthContextValue | null>(null);

function isCanceled(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('code' in error)) return false;
  return error.code === 'ERR_REQUEST_CANCELED';
}

function isEnded(state: AppleAuthentication.AppleAuthenticationCredentialState): boolean {
  if (state === AppleAuthentication.AppleAuthenticationCredentialState.REVOKED) return true;
  if (state === AppleAuthentication.AppleAuthenticationCredentialState.NOT_FOUND) return true;
  if (state === AppleAuthentication.AppleAuthenticationCredentialState.TRANSFERRED) return true;
  return false;
}

export function AppleAuthProvider({ children }: { children: ReactNode }) {
  const youVersion = useYVAuth();
  const [account, setAccount] = useState<AppleAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);
  // True while an Apple sign-in should replace a YouVersion session, so a
  // YouVersion session that is still loading cannot wipe the Apple account.
  const handingOff = useRef(false);
  const youVersionWasSignedIn = useRef(false);
  const youVersionRef = useRef(youVersion);

  useEffect(() => {
    youVersionRef.current = youVersion;
  }, [youVersion]);

  const signOut = useCallback(async () => {
    await clearAppleAccount();
    setAccount(null);
    setError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const stored = await readAppleAccount();
      if (cancelled) return;
      setAccount(stored);
      setIsLoading(false);
      if (!stored) return;

      let available = false;
      try {
        available = await AppleAuthentication.isAvailableAsync();
      } catch {
        available = false;
      }
      if (!available || cancelled) return;

      try {
        const credentialState = await AppleAuthentication.getCredentialStateAsync(stored.user);
        if (cancelled) return;
        if (isEnded(credentialState)) {
          await signOut();
        }
      } catch {
        // The simulator always throws here. Keep the stored session.
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [signOut]);

  useEffect(() => {
    let cancelled = false;
    AppleAuthentication.isAvailableAsync()
      .then((available) => {
        if (!cancelled) setIsAvailable(available);
      })
      .catch(() => {
        if (!cancelled) setIsAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isAvailable) return;
    const subscription = AppleAuthentication.addRevokeListener(() => {
      void signOut();
    });
    return () => {
      subscription.remove();
    };
  }, [isAvailable, signOut]);

  useEffect(() => {
    if (youVersion.isLoading) return;

    if (handingOff.current) {
      if (youVersion.isAuthenticated) {
        void youVersionRef.current.signOut().catch((signOutError) => {
          handingOff.current = false;
          void signOut();
          setError('Could not switch from YouVersion. You are still signed in there.');
          console.error(signOutError);
        });
      } else {
        handingOff.current = false;
      }
      youVersionWasSignedIn.current = youVersion.isAuthenticated;
      return;
    }

    if (youVersion.isAuthenticated && !youVersionWasSignedIn.current) {
      void clearAppleAccount().then(() => {
        setAccount(null);
      });
    }
    youVersionWasSignedIn.current = youVersion.isAuthenticated;
  }, [signOut, youVersion.isAuthenticated, youVersion.isLoading]);

  const signIn = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setError(null);

    try {
      let available = false;
      try {
        available = await AppleAuthentication.isAvailableAsync();
      } catch {
        available = false;
      }
      if (!available) return;

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const previous = await readAppleAccount();
      const next = mergeAppleAccount(previous, {
        user: credential.user,
        name: appleDisplayName(credential.fullName),
        email: credential.email,
      });

      handingOff.current = true;
      await writeAppleAccount(next);
      setAccount(next);

      const session = youVersionRef.current;
      if (session.isAuthenticated) {
        try {
          await session.signOut();
        } catch (signOutError) {
          handingOff.current = false;
          await signOut();
          setError('Could not switch from YouVersion. You are still signed in there.');
          console.error(signOutError);
        }
      } else if (!session.isLoading) {
        handingOff.current = false;
      }
    } catch (signInError) {
      handingOff.current = false;
      if (isCanceled(signInError)) return;
      console.error(signInError);
      setError('Apple sign-in did not finish. Try again.');
    } finally {
      busy.current = false;
    }
  }, [signOut]);

  return (
    <AppleAuthContext.Provider
      value={{ account, isLoading, isAvailable, error, signIn, signOut }}>
      {children}
    </AppleAuthContext.Provider>
  );
}

export function useAppleAuth() {
  const context = useContext(AppleAuthContext);
  if (!context) {
    throw new Error('useAppleAuth must be used within AppleAuthProvider');
  }
  return context;
}

export function useAuthState() {
  const youVersion = useYVAuth();
  const apple = useAppleAuth();
  const state: AuthState = deriveAuthState({
    youVersionSignedIn: youVersion.isAuthenticated,
    youVersionName: youVersion.userInfo?.name ?? null,
    youVersionEmail: youVersion.userInfo?.email ?? null,
    youVersionAvatarUrl: youVersion.userInfo?.avatarUrl ?? null,
    apple: apple.account,
  });

  return {
    state,
    isLoading: youVersion.isLoading || apple.isLoading,
    appleAvailable: apple.isAvailable,
    appleError: apple.error,
    signInWithApple: apple.signIn,
    signOutApple: apple.signOut,
  };
}
