import { render } from '../../helpers/render';

import XeroTransactions from './XeroTransactions';

describe('XeroTransactions', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<XeroTransactions />);
    expect(baseElement).toBeTruthy();
  });
});
