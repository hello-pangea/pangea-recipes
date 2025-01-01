import { alpha, type PaletteOptions } from '@mui/material/styles';
import type { User } from '@open-zero/features/users';

const lightTheme: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#2E86C1',
  },
  secondary: {
    main: '#F7DC6F',
  },
  success: {
    main: '#58D68D',
  },
  warning: {
    main: '#F39C12',
  },
  error: {
    main: '#E74C3C',
  },
  background: {
    paper: '#F8F9F9',
    default: '#FDFEFE',
  },
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
    disabled: '#B0BEC5',
  },
  divider: alpha('#2C3E50', 0.18),
};

const darkTheme: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#5DADE2',
  },
  secondary: {
    main: '#F1C40F',
  },
  success: {
    main: '#27AE60',
  },
  warning: {
    main: '#E67E22',
  },
  error: {
    main: '#E74C3C',
  },
  background: {
    paper: '#1E1E1E',
    default: '#121212',
  },
  text: {
    primary: '#E0E0E0',
    secondary: '#7F8C8D',
    disabled: '#757575',
  },
  divider: alpha('#E0E0E0', 0.18),
};

const autumnTheme: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#994636',
  },
  secondary: {
    main: '#36558F',
  },
  success: {
    main: '#688E26',
  },
  warning: {
    main: '#df8e1d',
  },
  error: {
    main: '#d20f39',
  },
  background: {
    paper: '#F3ECE2',
    default: '#fdf6ec',
  },
  text: {
    primary: '#242423',
    secondary: '#373F47',
    disabled: '#6c6f85',
  },
  divider: alpha('#242423', 0.18),
};

const mintTheme: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#48C9B0',
  },
  secondary: {
    main: '#A2D9CE',
  },
  success: {
    main: '#1ABC9C',
  },
  warning: {
    main: '#F39C12',
  },
  error: {
    main: '#E74C3C',
  },
  background: {
    paper: '#F4FDFD',
    default: '#E8F8F5',
  },
  text: {
    primary: '#0E6655',
    secondary: '#45B39D',
    disabled: '#B2DFDB',
  },
  divider: alpha('#0E6655', 0.18),
};

const lavendarTheme: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#7E57C2',
  },
  secondary: {
    main: '#D1C4E9',
  },
  success: {
    main: '#81C784',
  },
  warning: {
    main: '#FFB74D',
  },
  error: {
    main: '#E57373',
  },
  background: {
    paper: '#F3E5F5',
    default: '#FAF5FF',
  },
  text: {
    primary: '#4A148C',
    secondary: '#7E57C2',
    disabled: '#D1C4E9',
  },
  divider: alpha('#4A148C', 0.18),
};

const oceanTheme: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#0077B6',
  },
  secondary: {
    main: '#90E0EF',
  },
  success: {
    main: '#00B4D8',
  },
  warning: {
    main: '#FFD166',
  },
  error: {
    main: '#FF6B6B',
  },
  background: {
    paper: '#F1FAFE',
    default: '#E0F7FA',
  },
  text: {
    primary: '#023E8A',
    secondary: '#4682B4',
    disabled: '#B0C4DE',
  },
  divider: alpha('#023E8A', 0.18),
};

export const themeMap: Record<User['themePreference'], PaletteOptions> = {
  light: lightTheme,
  dark: darkTheme,
  system: lightTheme,
  autumn: autumnTheme,
  mint: mintTheme,
  lavendar: lavendarTheme,
  ocean: oceanTheme,
};
