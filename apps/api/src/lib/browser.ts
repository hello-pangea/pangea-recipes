import { chromium, type Browser, type BrowserContext } from 'playwright-chromium';
import UserAgent from 'user-agents';

const AD_SERVING_DOMAINS = [
  'doubleclick.net',
  'adservice.google.com',
  'googlesyndication.com',
  'googletagservices.com',
  'googletagmanager.com',
  'google-analytics.com',
  'adsystem.com',
  'adservice.com',
  'adnxs.com',
  'ads-twitter.com',
  'facebook.net',
  'fbcdn.net',
  'amazon-adsystem.com',
];

const BLOCKED_RESOURCE_TYPES = new Set(['image', 'media']);

let browser: Browser | undefined = undefined;
let browserContext: BrowserContext | undefined = undefined;
let browserContextPromise: Promise<BrowserContext> | undefined = undefined;

const launchBrowserContext = async () => {
  const newBrowser = await chromium.launch({
    headless: true,
    // Shutdown is owned by close-with-grace (see index.ts). If Playwright also handled these
    // signals it would kill Chromium immediately, breaking in-flight imports and shutdownBrowser.
    handleSIGINT: false,
    handleSIGTERM: false,
    handleSIGHUP: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      // '--single-process',
      '--disable-gpu',
    ],
  });

  // If Chromium crashes or is closed, drop the stale references so the next import relaunches it
  newBrowser.on('disconnected', () => {
    if (browser === newBrowser) {
      browser = undefined;
      browserContext = undefined;
    }
  });

  try {
    const newBrowserContext = await newBrowser.newContext({
      userAgent: new UserAgent().toString(),
      viewport: { width: 1280, height: 800 },
    });

    // Don't load media files or ads
    await newBrowserContext.route('**/*', (route, request) => {
      if (BLOCKED_RESOURCE_TYPES.has(request.resourceType())) {
        return route.abort();
      }

      const hostname = new URL(request.url()).hostname;

      if (AD_SERVING_DOMAINS.some((domain) => hostname.includes(domain))) {
        return route.abort();
      }

      return route.continue();
    });

    browser = newBrowser;
    browserContext = newBrowserContext;

    return newBrowserContext;
  } catch (error) {
    await newBrowser.close().catch(() => undefined);

    throw error;
  }
};

/**
 * Returns a shared browser context, (re)launching Chromium if it isn't running.
 */
export const getBrowserContext = async () => {
  if (browser?.isConnected() && browserContext) {
    return browserContext;
  }

  browserContextPromise ??= launchBrowserContext().finally(() => {
    browserContextPromise = undefined;
  });

  return await browserContextPromise;
};

export const shutdownBrowser = async () => {
  const currentBrowser = browser;

  browser = undefined;
  browserContext = undefined;

  // Closing the browser also closes its contexts
  if (currentBrowser?.isConnected()) {
    await currentBrowser.close();
  }
};
