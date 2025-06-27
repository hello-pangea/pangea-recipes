import { authClient } from './authClient';

export function useMaybeSignedInUserId() {
  const { data: session } = authClient.useSession();

  return session?.user.id;
}
