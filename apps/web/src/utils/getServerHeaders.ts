import { createServerFn } from '@tanstack/react-start';
import { getHeaders } from '@tanstack/react-start/server';

export const getServerHeaders = createServerFn().handler(() => {
  return getHeaders();
});
