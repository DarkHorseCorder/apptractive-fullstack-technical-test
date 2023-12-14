import { render } from '../../helpers/render';
import { BrowserRouter } from 'react-router-dom';

import { NavBar } from './NavBar';

describe('NavBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavBar />, { wrapper: BrowserRouter });
    expect(baseElement).toBeTruthy();
  });
});
