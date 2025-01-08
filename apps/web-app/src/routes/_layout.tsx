import { Layout } from '#src/features/layout/Layout';
import { SignedIn, SignedOut } from '@clerk/tanstack-start';
import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
  beforeLoad: () => {
    console.log('beforeLoad layout', Boolean(window.Clerk?.user));
  },
  component: () => (
    <>
      <SignedIn>
        <Layout />
      </SignedIn>
      <SignedOut>
        <Navigate
          to="/sign-in/$"
          search={{
            redirect: location.pathname,
          }}
        />
      </SignedOut>
    </>
  ),
});
