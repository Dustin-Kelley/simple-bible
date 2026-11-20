export type AppleAccount = {
  user: string;
  name: string | null;
  email: string | null;
};

export type AuthState =
  | { status: 'signed-out' }
  | {
      status: 'youversion';
      name: string | null;
      email: string | null;
      avatarUrl: string | null;
    }
  | {
      status: 'apple';
      user: string;
      name: string | null;
      email: string | null;
    };

/**
 * One account at a time. A YouVersion session wins when both are present,
 * and signing in with one clears the other.
 */
export function deriveAuthState(input: {
  youVersionSignedIn: boolean;
  youVersionName: string | null;
  youVersionEmail: string | null;
  youVersionAvatarUrl: string | null;
  apple: AppleAccount | null;
}): AuthState {
  if (input.youVersionSignedIn) {
    return {
      status: 'youversion',
      name: input.youVersionName,
      email: input.youVersionEmail,
      avatarUrl: input.youVersionAvatarUrl,
    };
  }

  if (input.apple) {
    return {
      status: 'apple',
      user: input.apple.user,
      name: input.apple.name,
      email: input.apple.email,
    };
  }

  return { status: 'signed-out' };
}

export function accountDisplayName(state: AuthState): string | null {
  if (state.status === 'signed-out') return null;
  return state.name;
}
