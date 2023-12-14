import { gql, useMutation } from '@apollo/client';
import {
  xeroCreateConsentUrl as XERO_CREATE_CONSENT_URL,
  XeroScopeSet,
} from '../../graphql';
import { Button } from '@mui/material';

export const ConnectDisconnectXero = () => {
  const [xeroCreateConsentUrl] = useMutation(gql(XERO_CREATE_CONSENT_URL), {});

  const onXeroConnect = async () => {
    try {
      const { data } = await xeroCreateConsentUrl({
        variables: {
          input: {
            scopeSet: XeroScopeSet.ACCOUNTING,
          },
        },
      });
      if (data?.xeroCreateConsentUrl) {
        window.location.replace(data?.xeroCreateConsentUrl);
      }
    } catch (err) {
      console.log('ERROR create xero token set', err);
    }
  };

  return (
    <Button
      onClick={onXeroConnect}
      sx={{
        backgroundColor: '#13B5EA',
        '&:hover': {
          backgroundColor: '#13B5EA',
          opacity: 0.5,
        },
        color: '#FFF'
      }}
    >
      Connect Xero
    </Button>
  );
};
