import { MockedProvider } from '@apollo/client/testing';
import { render } from '../../helpers/render';
import { BrowserRouter } from 'react-router-dom';

import Dashboard from './Dashboard';

describe('Dashboard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <Dashboard />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
