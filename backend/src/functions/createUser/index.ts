import { createRecord } from '/opt/dynamoDB';
import {
  adminAddUserToGroup,
} from '/opt/cognito';

const {
  TABLE_USER,
} = process.env;

export type CreateUserEvent = {
  userPoolId: string; // userPoolId past to function to prevent circular dependency with Auth
  userAttributes: any;
  userName: string;
};

export const handler = async (event: CreateUserEvent) => {
  console.log('event received:', event);
  const { userPoolId, userAttributes, userName } = event; // https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html

  if (!userPoolId) {
    throw new Error('userPoolId not provided');
  }

  const createdAt = new Date().toISOString();
  const userParams: any = {
    id: userAttributes.sub,
    email: userAttributes.email || null,
    phone: userAttributes.phone_number || null,
    identityId: userAttributes['custom:identityId'] || null,
    firstName: userAttributes.given_name || null,
    lastName: userAttributes.family_name || null,
    owner: userAttributes.sub,
    createdAt,
    updatedAt: createdAt,
  };

  try {
    console.log('create user props: ', userParams);
    await createRecord(TABLE_USER ?? '', userParams);
  } catch (err: any) {
    console.log('ERROR create user: ', err);
  }

  const addUserParams = {
    GroupName: 'Users',
    UserPoolId: userPoolId,
    Username: userName,
  };

  try {
    await adminAddUserToGroup(addUserParams);
  } catch (err: any) {
    console.log('error adding to group', err);
  }

  return userParams;
};
