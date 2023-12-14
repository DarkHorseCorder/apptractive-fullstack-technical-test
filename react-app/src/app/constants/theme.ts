import { createTheme, ThemeOptions } from '@mui/material';
export type { ThemeOptions } from '@mui/material';
export function getTheme(theme: ThemeOptions = {}) {
  return createTheme(theme);
}
