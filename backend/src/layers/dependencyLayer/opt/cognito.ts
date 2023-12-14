import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminCreateUserResponse,
  AdminAddUserToGroupCommandInput,
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
  AdminListGroupsForUserCommandInput,
  AdminCreateUserRequest,
} from '@aws-sdk/client-cognito-identity-provider';
import * as generatePassword from 'generate-password';

const cognitoIdentityServiceProvider = new CognitoIdentityProviderClient({
  apiVersion: '2016-04-18',
});

export const USER_GROUPS = {
  SUPER_ADMINS: 'SuperAdmins',
  ADMINS: 'Admins',
  USERS: 'Users',
};

export const PASSWORD_POLICY = {
  length: 8,
  numbers: true,
  symbols: true,
  lowercase: true,
  uppercase: true,
  strict: true,
};

export const getCognitoUser = async (userPoolId: string, username: string) => {
  const input = {
    UserPoolId: userPoolId,
    Username: username,
  };

  const command = new AdminGetUserCommand(input);
  return cognitoIdentityServiceProvider.send(command);
};

type cognitoUserProps = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  teamId?: string;
};

export const adminListGroupsForUser = async (
  input: AdminListGroupsForUserCommandInput
) => {
  const command = new AdminListGroupsForUserCommand(input);
  return cognitoIdentityServiceProvider.send(command);
};
export const adminAddUserToGroup = async (
  input: AdminAddUserToGroupCommandInput
) => {
  const command = new AdminAddUserToGroupCommand(input);
  return cognitoIdentityServiceProvider.send(command);
};
export const createCognitoUser = async (
  userPoolId: string,
  { firstName, lastName, email, phone }: cognitoUserProps
): Promise<AdminCreateUserResponse> => {
  const password = generatePassword.generate({
    ...PASSWORD_POLICY,
    excludeSimilarCharacters: true,
  });

  const input: AdminCreateUserRequest = {
    UserPoolId: userPoolId,
    Username: email,
    TemporaryPassword: password,
    DesiredDeliveryMediums: ['EMAIL'],
    ForceAliasCreation: false,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
  };

  if (phone) {
    input?.DesiredDeliveryMediums?.push('SMS');
    input?.UserAttributes?.push({
      Name: 'phone_number',
      Value: phone,
    });
  }

  if (firstName) {
    input?.UserAttributes?.push({
      Name: 'given_name',
      Value: firstName,
    });
  }

  if (lastName) {
    input?.UserAttributes?.push({
      Name: 'family_name',
      Value: lastName,
    });
  }

  const command = new AdminCreateUserCommand(input);
  return cognitoIdentityServiceProvider.send(command);
};

export const isInGroupFromClaims = (claims: any, group: string) => {
  return (
    claims &&
    claims['cognito:groups'] &&
    claims['cognito:groups'].includes(group)
  );
};
