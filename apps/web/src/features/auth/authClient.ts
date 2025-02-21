import { config } from '#src/config/config';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: `${config.VITE_API_URL}/auth`,
});
