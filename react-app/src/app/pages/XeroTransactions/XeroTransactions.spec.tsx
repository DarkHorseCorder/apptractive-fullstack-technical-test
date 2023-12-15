import React from 'react';
import '@testing-library/jest-dom';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../../i18n/index';

import XeroTransactions from './XeroTransactions';
import { xeroListTransactions as XERO_LIST_TRANSACTIONS_QUERY } from '../../graphql';

const mocks = [
  {
    request: {
      query: gql(XERO_LIST_TRANSACTIONS_QUERY),
      variables: {
        input: {
          scopeSet: 'PROFILE',
          statuses: null,
          page: 1,
        },
      },
    },
    result: {
      data: {
        xeroListTransactions: [
          {
            "status": "AUTHORISED",
            "totalTax": 30.18,
            "total": 396,
            "invoiceNumber": "INV-0027",
            "invoiceID": "fee88eea-f2aa-4a71-a372-33d6d83d3c45",
            "amountPaid": 0
          },
          {
            "status": "AUTHORISED",
            "totalTax": 4.54,
            "total": 59.54,
            "invoiceNumber": "AP",
            "invoiceID": "9f5bca33-8590-4b6f-acfb-e85712b10217",
            "amountPaid": 0
          },
          {
            "status": "AUTHORISED",
            "totalTax": 2.39,
            "total": 31.39,
            "invoiceNumber": "AP",
            "invoiceID": "8a3fdcc9-83eb-4fdd-83e0-52ec1b40b072",
            "amountPaid": 0
          },
          {
            "status": "PAID",
            "totalTax": 41.25,
            "total": 541.25,
            "invoiceNumber": "INV-0010",
            "invoiceID": "4c4db294-3633-45cd-8706-f0b3b0079609",
            "amountPaid": 0
          }
        ],
      },
    },
  },
];

describe('XeroTransactions', () => {
  it('renders without crashing', async () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <XeroTransactions />
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('xeroTransactions')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <XeroTransactions />
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('handles status filter change', async () => {
    const { getByText, getByRole } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <XeroTransactions />
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    const select = getByRole('button', { name: /all/i });
    fireEvent.mouseDown(select);
    fireEvent.click(getByText('DRAFT'));

    await waitFor(() => {
      expect(getByText('DRAFT')).toBeInTheDocument();
    });
  });

});
