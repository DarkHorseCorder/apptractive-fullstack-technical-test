import { MockedProvider } from '@apollo/client/testing';
import { render } from '../../helpers/render';
import { BrowserRouter } from 'react-router-dom';

import { Layout } from './Layout';

describe('Layout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <Layout />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
