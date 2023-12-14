import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

import XeroRedirect from './XeroRedirect';

// Mocks for external dependencies
jest.mock('aws-amplify');
jest.mock('react-i18next');

// Setup for useTranslation mock
(useTranslation as jest.Mock).mockReturnValue({
  t: (key: string) => key,
});

describe('XeroRedirect', () => {
  // Mock for Auth.currentAuthenticatedUser
  const mockAuthUser = () => {
    (Auth.currentAuthenticatedUser as jest.Mock).mockResolvedValue({
      email: 'testUser',
      password: 'testPassword'
    });
  };

  it('should render successfully', () => {
    mockAuthUser();

    const { baseElement } = render(
      <MockedProvider>
        <MemoryRouter>
          <XeroRedirect />
        </MemoryRouter>
      </MockedProvider>
    );

    expect(baseElement).toBeTruthy();
  });
});
