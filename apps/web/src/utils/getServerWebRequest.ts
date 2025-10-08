import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { getSessionCookie } from 'better-auth/cookies';

export const getHasAuthCookie = createServerFn().handler(() => {
  const request = getRequest();

  const cookie = getSessionCookie(request);

  return Boolean(cookie);
});
