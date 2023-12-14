import { Context, util, DynamoDBGetItemRequest } from '@aws-appsync/utils';
import { dynamoDBGetItemRequest } from '../helpers/dynamodb';

export function request(ctx: Context): DynamoDBGetItemRequest {
  const {
    args: { id },
  } = ctx;
  return dynamoDBGetItemRequest({ id });
}

export function response(ctx: Context) {
  console.log('get user ctx: ', ctx);
  const { error, result } = ctx;
  console.log('result: ', result);
  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return ctx.result;
}
