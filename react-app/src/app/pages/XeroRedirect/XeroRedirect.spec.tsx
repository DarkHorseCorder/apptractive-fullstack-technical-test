import { render } from '../../helpers/render';

import XeroRedirect from './XeroRedirect';

describe('XeroRedirect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<XeroRedirect />);
    expect(baseElement).toBeTruthy();
  });
});
