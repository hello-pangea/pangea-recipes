import { useSignedInUser } from '@open-zero/features/users';

export function useCustomAuth() {
  const { data: signedInUser } = useSignedInUser();

  return { user: signedInUser?.user ?? null };
}

/**
 * Throws an error if used in an unauthenticated route
 * Guarentees the user is authenticated
 */
export function useAuthRequired() {
  const { data: signedInUser } = useSignedInUser();

  if (!signedInUser?.user) {
    throw new Error(
      'useAuth must be used where a user is guarenteed to be authenticated',
    );
  }

  return { user: signedInUser.user };
}
