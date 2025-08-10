import { useRouteContext } from '@tanstack/react-router';

export function useSignedInUserId() {
  const { userId } = useRouteContext({ strict: false });

  if (!userId) {
    throw new Error('User does not exist');
  }

  return userId;
}
