import { config } from '#src/config/config.ts';
import OpenAI from 'openai';

export const openAi = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});
