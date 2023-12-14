import {
  DynamoDBGetItemRequest,
  Key,
  util,
} from '@aws-appsync/utils';

export const dynamoDBGetItemRequest = (key: Key): DynamoDBGetItemRequest => {
  return {
    operation: 'GetItem',
    key: util.dynamodb.toMapValues(key),
  };
};

//export const dynamodbPutRequest = ({
//  key,
//  data,
//  condition: inCondObj = {},
//}: dynamodbPutRequestProps): DynamoDBPutItemRequest => {
//  const condition = JSON.parse(
//    util.transform.toDynamoDBConditionExpression(inCondObj)
//  );
//  if (
//    condition.expressionValues &&
//    !Object.keys(condition.expressionValues).length
//  ) {
//    delete condition.expressionValues;
//  }
//  return {
//    operation: 'PutItem',
//    key: util.dynamodb.toMapValues(key),
//    attributeValues: util.dynamodb.toMapValues(data),
//    condition,
//  };
//};
