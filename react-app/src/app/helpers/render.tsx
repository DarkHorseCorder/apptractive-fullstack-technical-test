import { MockedProvider } from '@apollo/client/testing';
import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { render } from '@testing-library/react';
import { PropsWithChildren, ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DesignSystemContextProvider } from '../components';
import { getTheme } from '../constants/theme';
import { createEmotionCache } from './createEmotionCache';
import { defaultTheme } from './defaultTheme';

const defaultCache = createEmotionCache();
const theme = getTheme(defaultTheme('light'));

const AllTheProviders = ({ children }: PropsWithChildren) => {
  return (
    <MockedProvider>
      <BrowserRouter>
        <CacheProvider value={defaultCache}>
          <EmotionThemeProvider theme={theme}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <DesignSystemContextProvider theme={theme}>
                  {children}
              </DesignSystemContextProvider>
            </ThemeProvider>
          </EmotionThemeProvider>
        </CacheProvider>
      </BrowserRouter>
    </MockedProvider>
  );
};

const customRender = (ui: ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
