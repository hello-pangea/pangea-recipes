import { createAuthClient } from 'better-auth/react';
import { config } from '#src/config/config';

export const authClient = createAuthClient({
  baseURL: `${config.VITE_API_URL}/auth`,
});
