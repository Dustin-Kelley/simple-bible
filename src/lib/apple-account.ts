import * as SecureStore from 'expo-secure-store';

import type { AppleAccount } from '@/lib/auth-state';

const KEY = 'simple-bible.apple-account';

function clean(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed;
}

function isAppleAccount(value: unknown): value is AppleAccount {
  if (typeof value !== 'object' || value === null) return false;
  if (!('user' in value) || typeof value.user !== 'string' || value.user.length === 0) return false;
  if (!('name' in value)) return false;
  if (value.name !== null && typeof value.name !== 'string') return false;
  if (!('email' in value)) return false;
  if (value.email !== null && typeof value.email !== 'string') return false;
  return true;
}

export function appleDisplayName(
  fullName: {
    givenName?: string | null;
    middleName?: string | null;
    familyName?: string | null;
  } | null
): string | null {
  if (!fullName) return null;
  const parts = [fullName.givenName, fullName.middleName, fullName.familyName].filter(
    (part): part is string => typeof part === 'string' && part.trim().length > 0
  );
  if (parts.length === 0) return null;
  return parts.map((part) => part.trim()).join(' ');
}

/** Apple only sends name and email on the first sign-in. Keep the stored copy after that. */
export function mergeAppleAccount(
  previous: AppleAccount | null,
  next: { user: string; name: string | null; email: string | null }
): AppleAccount {
  const sameUser = previous?.user === next.user;
  let name: string | null = null;
  let email: string | null = null;
  if (next.name) {
    name = next.name;
  } else if (sameUser) {
    name = previous?.name ?? null;
  }
  if (next.email) {
    email = next.email;
  } else if (sameUser) {
    email = previous?.email ?? null;
  }
  return { user: next.user, name, email };
}

export async function readAppleAccount(): Promise<AppleAccount | null> {
  try {
    const available = await SecureStore.isAvailableAsync();
    if (!available) return null;
    const raw = await SecureStore.getItemAsync(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isAppleAccount(parsed)) return null;
    return {
      user: parsed.user,
      name: clean(parsed.name),
      email: clean(parsed.email),
    };
  } catch {
    return null;
  }
}

export async function writeAppleAccount(account: AppleAccount): Promise<void> {
  const available = await SecureStore.isAvailableAsync();
  if (!available) {
    throw new Error('Secure storage is not available on this device.');
  }
  await SecureStore.setItemAsync(KEY, JSON.stringify(account));
}

export async function clearAppleAccount(): Promise<void> {
  try {
    const available = await SecureStore.isAvailableAsync();
    if (!available) return;
    await SecureStore.deleteItemAsync(KEY);
  } catch {
    // The in-memory session is still cleared by the caller.
  }
}
