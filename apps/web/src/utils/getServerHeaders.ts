import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const getServerHeaders = createServerFn().handler(() => {
  return Object.fromEntries(getRequestHeaders());
});
