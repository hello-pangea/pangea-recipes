import { authClient } from '#src/features/auth/authClient';
import { Layout } from '#src/features/layout/Layout';
import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/app/_layout')({
  component: () => (
    <>
      <SignedIn>
        <Layout />
      </SignedIn>
      <SignedOut>
        <Navigate
          to="/app/sign-in"
          search={{
            redirect: location.pathname,
          }}
        />
      </SignedOut>
    </>
  ),
});

function SignedIn({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending || error || !session) {
    return null;
  }

  return children;
}

function SignedOut({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending || error || session) {
    return null;
  }

  return children;
}
