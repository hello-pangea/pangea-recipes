import type { ZodType } from 'zod/v4';

export interface EndpointSpec {
  body?: ZodType;
  search?: ZodType;
  response?: ZodType;
}
