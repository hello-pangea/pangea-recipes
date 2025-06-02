import { z } from 'zod/v4';

export const minutesToSecondsSchema = z
  .union([z.number(), z.string(), z.null()])
  .transform((value) => {
    if (value === null) {
      return null;
    }

    // Handle strings
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') {
        return null;
      }

      const num = Number(trimmed);
      if (Number.isNaN(num)) {
        // Throwing inside a transform surfaces as a ZodError
        throw new Error('Must be a number');
      }
      return num;
    }

    // If we reach here, it's a number already
    return value;
  })
  // Stage B: minutes → seconds
  .transform((mins) => (mins === null ? null : mins * 60));
