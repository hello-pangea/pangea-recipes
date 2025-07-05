import { useRouteContext } from '@tanstack/react-router';

export function useMaybeSignedInUserId() {
  const { userId } = useRouteContext({ strict: false });

  return userId ?? null;
}
