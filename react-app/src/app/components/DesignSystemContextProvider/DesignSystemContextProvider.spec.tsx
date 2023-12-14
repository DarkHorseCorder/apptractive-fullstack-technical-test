import { render } from '@testing-library/react';
import { getTheme } from '../../constants/theme';
import { DesignSystemContextProvider } from './DesignSystemContextProvider';

describe('DesignSystemContextProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DesignSystemContextProvider theme={getTheme()}>
        Hello World
      </DesignSystemContextProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
