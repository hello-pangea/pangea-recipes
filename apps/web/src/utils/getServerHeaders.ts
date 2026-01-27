import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const getServerHeaders = createServerFn().handler(() => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.fromEntries(getRequestHeaders());
});
