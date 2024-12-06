import { config } from '#src/config/config.js';
import OpenAI from 'openai';

export const openAi = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});
