import { gql, useMutation } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core/types';
import { xeroCreateTokenSet as XERO_CREATE_TOKEN_SET, XeroScopeSet } from '../../graphql';
import { Typography, Button } from '@mui/material';
import { Auth } from 'aws-amplify';
import { PATHS } from '../../navigation/paths';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';

/* eslint-disable-next-line */
export interface XeroRedirectProps {}

export function XeroRedirect(props: XeroRedirectProps) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [xeroCreateTokenSet] = useMutation(gql(XERO_CREATE_TOKEN_SET));

  const errorCode = searchParams.get('error');

  useEffect(() => {
    const getAuthUser = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        console.log('Authenticated user: ', authUser);
      } catch (err) {
        console.log('Error fetching authenticated user: ', err);
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
      };

      try {
        const { data } = await xeroCreateTokenSet(options);
        console.log('data: ', data);
        if (data.xeroCreateTokenSet === "{success=true}") {
          console.log('Xero Connected');
          navigate(PATHS.dashboard, { replace: true });
        } else {
          console.log('Xero connection failed');
        }
      } catch (err) {
        console.log('ERROR create xero token set', err);
      }
    };

    createTokenSet();
  }, [xeroCreateTokenSet, navigate]);

  const goToDashboard = () => navigate(PATHS.dashboard, { replace: true });

  return errorCode ? (
    <Typography color="error">
      {t('xeroError', { ns: 'xero' })} ({errorCode})
    </Typography>
  ) : (
    <>
      <Typography>Xero Connected</Typography>
      <Button 
        sx={{
          backgroundColor: '#13B5EA',
          '&:hover': {
            backgroundColor: '#13B5EA',
            opacity: 0.5,
          },
          color: '#FFF'
        }}
        onClick={goToDashboard}>
          Go to Dashboard
      </Button>
    </>
  );
}

export default XeroRedirect;
