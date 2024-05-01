import { scrapers } from './scrapers.js';

export async function getScrapedRecipeFromUrl(url: string) {
  const scraper = scrapers.find((scraper) => {
    return scraper.hosts.some((host) => url.includes(host));
  });

  if (!scraper) {
    throw new Error(`No scraper found for url: '${url}'`);
  }

  const recipe = await scraper.scrape(url);

  return recipe;
}
