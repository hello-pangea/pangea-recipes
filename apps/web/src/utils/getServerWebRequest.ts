import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { getSessionCookie } from 'better-auth/cookies';

export const getHasAuthCookie = createServerFn().handler(() => {
  const request = getWebRequest();

  const cookie = getSessionCookie(request);

  return Boolean(cookie);
});
