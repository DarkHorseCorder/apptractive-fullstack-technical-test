#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
// import 'source-map-support/register';
import { AppSyncAPIStack } from './stacks/AppSyncAPIStack';
import { AuthStack } from './stacks/authStack';
import { DatabaseStack } from './stacks/databaseStack';
import { LayerStack } from './stacks/layerStack';

import * as dotenv from "dotenv";

dotenv.config();

const {
  STAGE,
  AWS_ACCOUNT,
  AWS_REGION,
  XERO_CLIENT_ID,
  XERO_CLIENT_SECRET
} = process.env;

const stage = STAGE as string;
const isProd = stage === 'prod';

const appName = 'FullstackTestApp';
const appPrefix = 'FUL';

const apiId = `${appPrefix}ProjectApiId`;
const apiName = `${appPrefix}GraphqlAPI-${stage}`;
const createUserFuncName = `${appPrefix}AuthStack-createUserFunc-${stage}`;

const account = AWS_ACCOUNT;
const region = AWS_REGION;

console.log('AWS_ACCOUNT: ', account);
console.log('AWS_REGION: ', region);
console.log('process.envprocess.envprocess.envprocess.envprocess.env: ', process.env);

const xeroClientId = XERO_CLIENT_ID;
const xeroClientSecret = XERO_CLIENT_SECRET;

const defaultEnv = {
  account,
  region,
};

const app = new App();

new LayerStack(app, `${appPrefix}LayerStack`, {
  env: {
    ...defaultEnv,
  },
});

const databaseStack = new DatabaseStack(app, `${appPrefix}DatabaseStack`, {
  env: {
    ...defaultEnv,
  },
  isProd,
});

const authStack = new AuthStack(app, `${appPrefix}AuthStack`, {
  env: {
    ...defaultEnv,
  },
  groupNames: ['SuperAdmins', 'Admins', 'Users'],
  identitypoolConstructName: `${appPrefix}-IdentityPool-${stage}`,
  appName,
  appClientConstructName: `${appPrefix}-UserPoolClient-${stage}`,
  userpoolConstructName: `${appPrefix}-UserPool-${stage}`,
  userTable: databaseStack.userTable,
  isProd,
  createUserFuncName,
  stage,
  xeroClientId,
  xeroClientSecret
});

new AppSyncAPIStack(app, `${appPrefix}AppSyncAPIStack`, {
  env: {
    ...defaultEnv,
  },
  apiId,
  apiName,
  stage,
  userPool: authStack.userPool,
  unauthenticatedRole: authStack.unauthenticatedRole,
  userTable: databaseStack.userTable,
  createUserFuncName,
  xeroClientId,
  xeroClientSecret,
});

app.synth();
