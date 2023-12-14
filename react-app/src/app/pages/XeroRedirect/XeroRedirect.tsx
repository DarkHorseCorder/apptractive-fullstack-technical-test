import { gql, useMutation } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core/types';
import {
  xeroCreateTokenSet as XERO_CREATE_TOKEN_SET,
  XeroScopeSet,
} from '../../graphql';
import { Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface XeroRedirectProps {}

export function XeroRedirect(props: XeroRedirectProps) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [xeroCreateTokenSet] = useMutation(gql(XERO_CREATE_TOKEN_SET), {});

  const errorCode = searchParams.get('error');

  useEffect(() => {
    const getAuthUser = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        console.log('authUser: ', authUser);
      } catch (err) {
        console.log('ERROR Auth.currentAuthenticatedUser: ', err);
      }
    };

    getAuthUser();
  }, []);

  useEffect(() => {
    const createTokenSet = async () => {
      const url = window.location.href;
      const options: OperationVariables = {
        variables: {
          input: {
            url,
            scopeSet: XeroScopeSet.ACCOUNTING,
          },
        },
      }

      try {
        const { data } = await xeroCreateTokenSet(options);

        console.log('data: ', data);
      } catch (err) {
        console.log('ERROR create xero token set', err);
      }
    };

    createTokenSet();
  }, [xeroCreateTokenSet]);

  return (
    <>
      <Typography>Xero redirected</Typography>
      {errorCode && (
        <Typography color="error">
          {t('xeroError', { ns: 'xero' })} ({errorCode})
        </Typography>
      )}
    </>
  );
}

export default XeroRedirect;
