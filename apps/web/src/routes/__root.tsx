import { NotFoundPage } from '#src/components/NotFoundPage';
import { config } from '#src/config/config';
import { color } from '#src/theme/colors';
import { getTheme } from '#src/theme/theme';
import appCss from '#src/theme/theme.css?url';
import { getHasAuthCookie } from '#src/utils/getServerWebRequest';
import { seo } from '#src/utils/seo';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import interFontCss from '@fontsource-variable/inter?url';
import loraFontCss from '@fontsource-variable/lora?url';
import {
  CssBaseline,
  InitColorSchemeScript,
  ThemeProvider,
} from '@mui/material';
import type {} from '@mui/material/themeCssVarsAugmentation';
import {
  getSignedInUserQueryOptions,
  useSignedInUser,
} from '@repo/features/users';
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
        title: 'Pangea Recipes - Recipe Manager',
        description: `Pangea Recipes is a modern, ad-free recipe manager that makes it easy to save, share, and collaborate on your favorite dishes.`,
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
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'preconnect',
        href: 'https://api.pangearecipes.com',
      },
    ],
    scripts: [
      ...(config.VITE_GOOGLE_TAG_ID
        ? [
            {
              src: `https://www.googletagmanager.com/gtag/js?id=${config.VITE_GOOGLE_TAG_ID}`,
              async: true,
            },
            {
              children: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);};
                gtag('js', new Date());

                gtag('config', '${config.VITE_GOOGLE_TAG_ID}', { send_page_view: false });
              `,
            },
          ]
        : []),
    ],
  }),
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const emotionCache = createCache({ key: 'css' });
  const { data: user } = useSignedInUser();

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider
        theme={getTheme(color[user?.accentColor ?? 'indigo'])}
        forceThemeRerender
      >
        <CssBaseline />
        <SnackbarProvider>{children}</SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning
  // https://mui.com/material-ui/customization/css-theme-variables/configuration/#next-js-app-router
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <InitColorSchemeScript attribute="class" />
        <Providers>{children}</Providers>
        <ReactQueryDevtools buttonPosition="top-right" />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
