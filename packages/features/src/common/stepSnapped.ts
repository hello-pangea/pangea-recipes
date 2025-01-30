export function stepUpSnapped(data: {
  value: number;
  steps: number[];
  stepUpBy?: number;
}): number {
  const { value, steps, stepUpBy } = data;

  if (!steps.length) {
    return value;
  }

  const firstStep = steps[0];

  if (firstStep === undefined) {
    return value;
  }

  let snappedValue = steps.find((v) => v > value);

  if (!value || value < firstStep) {
    snappedValue = steps[0];
  } else if (!snappedValue) {
    if (stepUpBy) {
      if (value % stepUpBy === 0) {
        snappedValue = value + stepUpBy;
      } else {
        snappedValue = Math.ceil(value / stepUpBy) * stepUpBy;
      }
    } else {
      snappedValue = value;
    }
  }

  return snappedValue ?? 0;
}

export function stepDownSnapped(data: {
  value: number;
  steps: number[];
  stepDownBy?: number;
}): number {
  const { value, steps, stepDownBy } = data;

  let snappedIndex = steps.findIndex((v) => v >= value);

  if (snappedIndex <= 0) {
    snappedIndex = 1;
  }

  let snappedValue = steps[snappedIndex - 1];

  const lastStep = steps.at(-1);

  if (lastStep === undefined) {
    return value;
  }

  if (value > lastStep) {
    if (stepDownBy) {
      if (value % stepDownBy === 0) {
        snappedValue = value - stepDownBy;
      } else {
        snappedValue = Math.floor(value / stepDownBy) * stepDownBy;
      }
    } else {
      snappedValue = steps[steps.length - 1];
    }
  }

  return snappedValue ?? 0;
}
