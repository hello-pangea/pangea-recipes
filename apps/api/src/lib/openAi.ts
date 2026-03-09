import OpenAI from 'openai';
import { config } from '#src/config/config.ts';

export const openAi = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});
