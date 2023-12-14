import {
  CfnOutput,
  Duration,
  Expiration,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as path from 'path';
import {
  GraphqlApi,
  SchemaFile,
  AuthorizationType as AppSyncAuthorizationType,
  FieldLogLevel,
} from 'aws-cdk-lib/aws-appsync';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import {
  IRole,
  ManagedPolicy,
  Policy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { JsResolverConstruct } from '../constructs/jsResolverConstruct';
import { LambdaAppSyncOperationConstruct } from '../constructs/lambdaAppSyncOperationConstruct';

interface APIStackProps extends StackProps {
  readonly apiId: string;
  readonly apiName: string;
  readonly createUserFuncName: string;
  readonly stage: string;
  readonly userPool: UserPool;
  readonly unauthenticatedRole: IRole;
  readonly userTable: Table;
  readonly xeroClientId: string;
  readonly xeroClientSecret: string;
}

export class AppSyncAPIStack extends Stack {
  public readonly api: GraphqlApi;

  constructor(scope: Construct, id: string, props: APIStackProps) {
    super(scope, id, props);

    // logs
    const apiLogRole = new Role(this, 'ApiLogRole', {
      roleName: 'ApiCloudWatchRole',
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSAppSyncPushToCloudWatchLogs'
        ),
      ],
    });

    // graphql api
    const api = new GraphqlApi(this, props.apiId, {
      //project name
      name: props.apiName, //api name
      schema: SchemaFile.fromAsset(
        path.join(__dirname, '../appsync/schema.graphql')
      ), //TODO: https://github.com/cdklabs/awscdk-appsync-utils should we implement?
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AppSyncAuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: props.userPool,
          },
        },
        additionalAuthorizationModes: [
          // remove if not required
          {
            authorizationType: AppSyncAuthorizationType.API_KEY,
            apiKeyConfig: {
              description: 'API Key for AppSync',
              expires: Expiration.after(Duration.days(30)), //update days if required
            },
          },
          // remove if not required
          { authorizationType: AppSyncAuthorizationType.IAM },
        ],
      },
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
        retention: RetentionDays.ONE_WEEK,
        role: apiLogRole,
      },
      xrayEnabled: true,
    });

    new CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl,
    });

    new CfnOutput(this, 'GraphQLAPIKey', {
      value: api.apiKey as string,
    });

    new CfnOutput(this, 'GraphQLAPIID', {
      value: api.apiId,
    });

    this.api = api;

    // USERS
    const userDS = api.addDynamoDbDataSource(
      'UserTableDataSource',
      props.userTable
    );

    //// update user
    //const updateUserFunc = new NodejsFunction(this, 'updateUserFunc', {
    //  ...defaultFuncProps('updateUser'),
    //  environment: {
    //    TABLE_USER: props.userTable.tableName,
    //    ENV: props.stage,
    //  },
    //});
    //const updateUserFuncDS = api.addLambdaDataSource(
    //  'UpdateUserFuncDS',
    //  updateUserFunc
    //);
    //updateUserFuncDS.createResolver('UpdateUserFuncResolver', {
    //  typeName: 'Mutation',
    //  fieldName: 'updateUser',
    //});
    //
    //props.userTable.grantWriteData(updateUserFunc);

    // get user
    new JsResolverConstruct(this, 'GetUserResolver', {
      api,
      dataSource: userDS,
      typeName: 'Query',
      fieldName: 'getUser',
      pathName: 'getUser',
    });

    // XERO
    // xero consent url
    new LambdaAppSyncOperationConstruct(this, 'XeroCreateConsentUrlMutation', {
      api,
      fieldName: 'xeroCreateConsentUrl',
      typeName: 'Mutation',
      environmentVars: {
        XERO_CLIENT_ID: props.xeroClientId,
        XERO_CLIENT_SECRET: props.xeroClientSecret,
        ENV: props.stage,
      },
    });

    // xero create token set
    const xeroCreateTokenSet = new LambdaAppSyncOperationConstruct(
      this,
      'XeroCreateTokenSetMutation',
      {
        api,
        fieldName: 'xeroCreateTokenSet',
        typeName: 'Mutation',
        environmentVars: {
          AUTH_USERPOOLID: props.userPool.userPoolId,
          FUNCTION_CREATEUSER: props.createUserFuncName,
          TABLE_USER: props.userTable.tableName,
          XERO_CLIENT_ID: props.xeroClientId,
          XERO_CLIENT_SECRET: props.xeroClientSecret,
          ENV: props.stage,
        },
      }
    );

    //  xero token set user pool policy
    xeroCreateTokenSet.lambda.role?.attachInlinePolicy(
      new Policy(this, 'XeroTokenSetUserPoolPolicy', {
        statements: [
          new PolicyStatement({
            actions: [
              'cognito-idp:AdminGetUser',
              'cognito-idp:AdminCreateUser',
              'cognito-idp:AdminAddUserToGroup',
            ],
            resources: [props.userPool.userPoolArn],
          }),
        ],
      })
    );

    // invoke create user permissions
    xeroCreateTokenSet.lambda.role?.attachInlinePolicy(
      new Policy(this, 'XeroTokenSetFunc', {
        statements: [
          new PolicyStatement({
            actions: ['lambda:InvokeFunction'],
            resources: [
              `arn:aws:lambda:${props.env?.region}:${props.env?.account}:function:${props.createUserFuncName}`,
            ],
          }),
        ],
      })
    );

    props.userTable.grantReadWriteData(xeroCreateTokenSet.lambda);
  }
}
