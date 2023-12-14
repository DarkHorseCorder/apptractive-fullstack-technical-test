import { getScopes, initXeroClient } from '/opt/xero';
import { AppSyncIdentityCognito, Context } from '@aws-appsync/utils';

const { TABLE_USER } = process.env;

// openid profile email offline_access accounting.transactions accounting.settings accounting.contacts accounting.contacts accounting.attachments
export const handler = async (ctx: Context) => {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { url, scopeSet } = input;
  console.log('sub: ', sub);
  console.log('url: ', url);

  const scopes = getScopes(scopeSet);

  let xero;
  try {
    xero = initXeroClient({
      scopes: scopes.split(' '),
      grantType: 'authorization_code',
    });
  } catch (err: any) {
    console.log('ERROR init xero: ', err);
    throw new Error(err.message);
  }

  return {};
};
