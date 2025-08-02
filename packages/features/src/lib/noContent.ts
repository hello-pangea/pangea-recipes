import { z } from 'zod/v4';

export const noContent = z.null().meta({
  description: 'No content',
});

// https://github.com/colinhacks/zod/issues/4145#issuecomment-2982870033
// eslint-disable-next-line @typescript-eslint/unbound-method
const originalAdd = z.globalRegistry.add;

// terrible hack for vite's HMR:
// without this monkey-patch, zod will throw an error whenever editing a schema file that uses
// `.register` as it would try to re-register the schema with the same ID again
// with this patch, re-registering will just replace the schema in the registry
z.globalRegistry.add = (
  schema: Parameters<typeof originalAdd>[0],
  meta: Parameters<typeof originalAdd>[1],
) => {
  if (!meta.id) {
    return originalAdd.call(z.globalRegistry, schema, meta);
  }
  const existingSchema = z.globalRegistry._idmap.get(meta.id);
  if (existingSchema) {
    z.globalRegistry.remove(existingSchema);
    z.globalRegistry._idmap.delete(meta.id);
  }
  return originalAdd.call(z.globalRegistry, schema, meta);
};
