import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { getScopes, initXeroClient } from '/opt/xero';
import { AppSyncIdentityCognito, Context } from '@aws-appsync/utils';

const { TABLE_USER } = process.env;

/**
 * AWS Lambda handler for updating Xero token in DynamoDB.
 *
 * @param {Context} ctx - The context of the Lambda execution containing identity and arguments.
 * @returns {Promise<object>} An object indicating the success or failure of the operation.
 */
export const handler = async (ctx: Context) => {
  // Extract user identity and input arguments from the context
  const { sub } = ctx.identity as AppSyncIdentityCognito;
  const { input } = ctx.arguments;
  const { url, scopeSet } = input;
  console.log('sub: ', sub);
  console.log('url: ', url);

  // Get the scopes for the Xero client
  const scopes = getScopes(scopeSet);

  try {
  // Initialize Xero client and exchange authorization code for token set
    const xero = initXeroClient({
      scopes: scopes.split(' '),
      grantType: 'authorization_code',
    });
    // Exchange authorization code for token set
    const tokenSet = await xero.apiCallback(url);

    // Store the token set in DynamoDB
    const dynamoDbClient = new DynamoDBClient();

    const updateItemCommand = new UpdateItemCommand({
      TableName: TABLE_USER,
      Key: {
        id: { S: sub },
      },
      UpdateExpression: 'SET xeroTokenSet = :tokenSet',
      ExpressionAttributeValues: {
        ':tokenSet': { S: JSON.stringify(tokenSet) },
      },
    });

    await dynamoDbClient.send(updateItemCommand);

    console.log('Token set updated for user:', tokenSet);
    
    return { success: true, message: "Token updated successfully"};
  } catch (err: any) {
    console.log('ERROR init xero: ', err);
    throw new Error(err.message);
  }

  return {};
};