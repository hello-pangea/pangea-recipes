interface ColorRange {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

const indigo: ColorRange = {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
  950: '#1e1b4b',
};

const gray: ColorRange = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
  950: '#030712',
};

const slate: ColorRange = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
};

export const color = {
  gray,
  slate,
  indigo,
  white: '#ffffff',
  black: '#000000',
} as const;

// const indigo: ColorRange = {
//   50: "blarggggg",
//   100: "blarggggg",
//   200: "blarggggg",
//   300: "blarggggg",
//   400: "blarggggg",
//   500: "blarggggg",
//   600: "blarggggg",
//   700: "blarggggg",
//   800: "blarggggg",
//   900: "blarggggg",
//   950: "blarggggg",
// };
