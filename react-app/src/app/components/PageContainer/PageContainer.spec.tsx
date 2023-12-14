import { render } from '../../helpers/render';

import { PageContainer } from './PageContainer';

describe('PageContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <PageContainer>Page container</PageContainer>
    );
    expect(baseElement).toBeTruthy();
  });
});
