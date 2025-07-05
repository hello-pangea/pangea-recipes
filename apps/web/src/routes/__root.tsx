import { NotFoundPage } from '#src/components/NotFoundPage';
import { theme } from '#src/theme/theme';
import appCss from '#src/theme/theme.css?url';
import { getHasAuthCookie } from '#src/utils/getServerWebRequest';
import { seo } from '#src/utils/seo';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import interFontCss from '@fontsource-variable/inter?url';
import loraFontCss from '@fontsource-variable/lora?url';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type {} from '@mui/material/themeCssVarsAugmentation';
import { getSignedInUserQueryOptions } from '@open-zero/features/users';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { SnackbarProvider } from 'notistack';

interface RouterContext {
  queryClient: QueryClient;
  userId: string | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    const isBrowser = typeof window !== 'undefined';

    if (!isBrowser) {
      // This is not secure
      // It is a convenience to let the server assume the user is NOT logged
      // It avoids an http request if no cookie is present
      const hasAuthCookie = await getHasAuthCookie();

      if (!hasAuthCookie) {
        return {
          userId: null,
        };
      }
    }

    const user = await context.queryClient.ensureQueryData(
      getSignedInUserQueryOptions(),
    );

    return {
      userId: user?.id ?? null,
    };
  },
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'Hello Recipes',
        description: `Never forget another recipe. Modern recipe manager to organize and share recipes online.`,
        image: '/assets/og-image.png',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: interFontCss },
      { rel: 'stylesheet', href: loraFontCss },
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'preconnect',
        href: 'https://api.hellorecipes.com',
      },
    ],
  }),
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </RootDocument>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const emotionCache = createCache({ key: 'css' });

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme} forceThemeRerender>
        <CssBaseline />
        <SnackbarProvider>{children}</SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>{children}</Providers>
        <ReactQueryDevtools buttonPosition="top-right" />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
