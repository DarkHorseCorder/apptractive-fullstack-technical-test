import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { getScopes, initXeroClient } from '/opt/xero';
import { AppSyncIdentityCognito, Context } from '@aws-appsync/utils';

const { TABLE_USER } = process.env;

export const handler = async (ctx: Context) => {
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { scopeSet, statuses } = input;

  const scopes = getScopes(scopeSet);

  try {
    const xero = initXeroClient({
        scopes: scopes.split(' '),
        grantType: 'authorization_code',
      });
    await xero.initialize();
    // DynamoDB setup for retrieving and updating the token set
    const dynamoClient = new DynamoDBClient();
    const getItemCommand = new GetItemCommand({
        TableName: TABLE_USER,
        Key: { id: { S: sub } },
    });

    // Retrieve user's Xero token set from DynamoDB
    const dynamoResponse = await dynamoClient.send(getItemCommand);
    const xeroTokenSet = JSON.parse(dynamoResponse.Item?.xeroTokenSet.S || '{}');

    await xero.setTokenSet(xeroTokenSet);
    const tokenSet = await xero.readTokenSet();

    // If token expired, refresh the token set
    if (tokenSet.expired()) {
        const validTokenSet = await xero.refreshToken();
        // Update the DynamoDB record with the new token set
        const updateItemCommand = new UpdateItemCommand({
            TableName: TABLE_USER,
            Key: {
            id: { S: sub },
            },
            UpdateExpression: 'SET xeroTokenSet = :tokenSet',
            ExpressionAttributeValues: {
            ':tokenSet': { S: JSON.stringify(validTokenSet) },
            },
        });
        await dynamoClient.send(updateItemCommand);
        // Use the refreshed token set for API calls
        await xero.setTokenSet(validTokenSet);
      }
    await xero.updateTenants();

    // Call Xero API to get invoices
    const invoicesResponse = await xero.accountingApi.getInvoices(xero.tenants[0].tenantId);
    // Filter invoices based on status
    let filteredInvoices = [];
    if (statuses) {
      filteredInvoices = invoicesResponse.body.invoices.filter((invoice: any) => {
        return invoice.status === statuses[0];
      });
    } else {
      filteredInvoices = invoicesResponse.body.invoices;
    }
    // Return the result
    return filteredInvoices;
  }
  catch (err: any) {
    console.log('ERROR getting invoices: ', err);
    throw new Error(err.message);
  }
};
