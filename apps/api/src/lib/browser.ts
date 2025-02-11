import {
  chromium,
  type Browser,
  type BrowserContext,
} from 'playwright-chromium';
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

export let browser: Browser | undefined = undefined;
export let browserContext: BrowserContext | undefined = undefined;

export const initializeBrowser = async () => {
  browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
    ],
  });

  const userAgent = new UserAgent().toString();
  const viewport = { width: 1280, height: 800 };

  browserContext = await browser.newContext({
    userAgent,
    viewport,
  });

  // Don't load media files
  await browserContext.route(
    '**/*.{png,jpg,jpeg,gif,svg,mp3,mp4,avi,flac,ogg,wav,webm}',
    async (route) => {
      await route.abort();
    },
  );

  // Don't load ads
  await browserContext.route('**/*', (route, request) => {
    const requestUrl = new URL(request.url());
    const hostname = requestUrl.hostname;

    if (AD_SERVING_DOMAINS.some((domain) => hostname.includes(domain))) {
      return route.abort();
    }

    return route.continue();
  });
};

export const shutdownBrowser = async () => {
  if (browserContext) {
    await browserContext.close();
  }
  if (browser) {
    await browser.close();
  }
};
