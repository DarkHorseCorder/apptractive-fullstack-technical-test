import { PaletteMode, ThemeOptions } from '@mui/material';

export const defaultTheme = (mode: PaletteMode): ThemeOptions => ({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100vh',
        },
        body: {
          height: '100vh',
        },
        '#root': {
          height: '100vh',
        },
      },
    },
  },
});
