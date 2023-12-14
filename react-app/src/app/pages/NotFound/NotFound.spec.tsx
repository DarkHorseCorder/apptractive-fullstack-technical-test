import { render } from '../../helpers/render';

import NotFound from './NotFound';

describe('NotFound', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NotFound />);
    expect(baseElement).toBeTruthy();
  });
});
