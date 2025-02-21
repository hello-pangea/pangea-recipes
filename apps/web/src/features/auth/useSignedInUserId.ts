import { authClient } from './authClient';

export function useSignedInUserId() {
  const { data: session } = authClient.useSession();

  if (!session?.user.id) {
    throw new Error('User does not exist');
  }

  return session.user.id;
}
