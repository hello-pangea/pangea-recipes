import { RainbowPlantLife } from './scrapers/rainbowPlantLife.js';
import type { BaseScraper } from './utils/baseScraper.js';

export const scrapers: BaseScraper[] = [new RainbowPlantLife()];
