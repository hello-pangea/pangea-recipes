import type { TObject, TSchema } from '@sinclair/typebox';

export interface EndpointSpec {
  body?: TSchema;
  search?: TObject;
  response?: TSchema;
}
