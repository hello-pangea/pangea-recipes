import { z } from 'zod';

export const noContent = z.null().meta({
  description: 'No content',
});

// https://github.com/colinhacks/zod/issues/4145#issuecomment-2982870033
// oxlint-disable-next-line typescript/unbound-method
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
  // Zod doesn't expose a public API for looking up schemas by ID
  // oxlint-disable-next-line eslint/no-underscore-dangle
  const idMap = z.globalRegistry._idmap;
  const existingSchema = idMap.get(meta.id);
  if (existingSchema) {
    z.globalRegistry.remove(existingSchema);
    idMap.delete(meta.id);
  }
  return originalAdd.call(z.globalRegistry, schema, meta);
};
