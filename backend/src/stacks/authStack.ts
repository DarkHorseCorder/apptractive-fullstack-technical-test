import {
  IdentityPool,
  UserPoolAuthenticationProvider,
} from '@aws-cdk/aws-cognito-identitypool-alpha';
import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import {
  AccountRecovery,
  CfnUserPoolGroup,
  ClientAttributes,
  Mfa,
  StringAttribute,
  UserPool,
  UserPoolClient,
  UserPoolIdentityProviderOidc,
  ProviderAttribute,
  UserPoolClientIdentityProvider,
} from 'aws-cdk-lib/aws-cognito';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, IRole, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import * as path from 'path';
import { externalLibs } from '../helpers';

//STEPS to init stack
// 1. Verify email address for SES https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-email.html#user-pool-email-developer

interface AuthStackProps extends StackProps {
  readonly userpoolConstructName: string;
  readonly groupNames?: string[];
  readonly identitypoolConstructName: string;
  readonly appClientConstructName: string;
  readonly userTable: Table;
  readonly appName: string;
  readonly isProd: boolean;
  readonly createUserFuncName: string;
  readonly stage: string;
  readonly xeroClientId: string;
  readonly xeroClientSecret: string;
}

export class AuthStack extends Stack {
  public readonly identityPoolId: CfnOutput;
  public readonly authenticatedRole: IRole;
  public readonly unauthenticatedRole: IRole;
  public readonly userPool: UserPool;
  public readonly createUserFunc: NodejsFunction;

  //public readonly updateUserFunc: NodejsFunction;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    //TODO: possible to make reusable?
    const defaultFuncProps = (funcName: string) => {
      const dependencyLayerArn = StringParameter.valueForStringParameter(
        this,
        'dependencyLambdaLayer'
      );
      const dependencyLayerFromArn = LayerVersion.fromLayerVersionArn(
        this,
        `DependencyLayerFromArn${funcName}`,
        dependencyLayerArn
      );

      return {
        runtime: Runtime.NODEJS_18_X,
        layers: [dependencyLayerFromArn],
        logRetention: RetentionDays.ONE_MONTH,
        //logRetentionRetryOptions: {
        //  base: Duration.millis(200),
        //  maxRetries: 10,
        //},
        timeout: Duration.seconds(30),
        entry: path.join(__dirname, `../functions/${funcName}/index.ts`),
        handler: 'handler',
        bundling: {
          externalModules: externalLibs, //Added external libraries because error was showing for pnp
        },
      };
    };

    //TODO: pool sms role?
    //const poolSmsRole = new Role(this, 'UserPoolSmsRole', {
    //  assumedBy: new ServicePrincipal('cognito-idp.amazonaws.com')
    //});

    // add user function
    const createUserFunc = new NodejsFunction(this, 'createUserFunc', {
      //TODO: capital C
      ...defaultFuncProps('createUser'),
      environment: {
        TABLE_USER: props.userTable.tableName,
      },
      functionName: props.createUserFuncName,
    });

    props.userTable.grantWriteData(createUserFunc);
    //TODO: Grant userpool access to create user function

    // post confirmation trigger function
    const postConfirmFunc = new NodejsFunction(
      this,
      'postConfirmationTriggerFunc',
      {
        ...defaultFuncProps('postConfirmationTrigger'),
        environment: {
          FUNCTION_CREATEUSER: createUserFunc.functionName,
        },
      }
    );

    // allow create user function to be invoked by post confirmation trigger function
    createUserFunc.grantInvoke(postConfirmFunc);

    //const updateUserFunc = new NodejsFunction(this, 'updateUserFunc', {
    //  ...defaultFuncProps('updateUser'),
    //  environment: {
    //    TABLE_USER: props.userTable.tableName,
    //    ENV: props.stage
    //  }
    //});

    // userpool
    const userPool = new UserPool(this, props.userpoolConstructName, {
      userPoolName: props.userpoolConstructName,
      removalPolicy: props.isProd
        ? RemovalPolicy.RETAIN
        : RemovalPolicy.DESTROY,
      signInCaseSensitive: false,
      selfSignUpEnabled: true,
      accountRecovery: AccountRecovery.PHONE_AND_EMAIL,
      signInAliases: {
        email: true,
        phone: true,
      },
      autoVerify: {
        email: true,
        phone: true,
      },
      standardAttributes: {
        email: {
          required: false,
          mutable: true,
        },
        familyName: {
          required: false,
          mutable: true,
        },
        givenName: {
          required: false,
          mutable: true,
        },
        locale: {
          required: false,
          mutable: true,
        },
        phoneNumber: {
          required: false,
          mutable: true,
        },
      },
      keepOriginal: {
        email: true,
        phone: true,
      },
      //smsRole: poolSmsRole,
      //smsRoleExternalId: 'c87467be-4f34-11ea-b77f-2e728ce88125',
      customAttributes: {
        userType: new StringAttribute({ mutable: true }),
        identityId: new StringAttribute({ mutable: true }),
      },
      mfa: Mfa.OPTIONAL,
      //mfaMessage: "",
      mfaSecondFactor: {
        otp: true,
        sms: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: Duration.days(60),
      },
      //email: UserPoolEmail.withSES({
      //  fromEmail: props.fromEmail,
      //  fromName: props.appName,
      //  replyTo: props.replyToEmail,
      //}),
      deletionProtection: props.isProd,
      lambdaTriggers: {
        postConfirmation: postConfirmFunc,
        //postAuthentication: postAuthFunc
      },
    });

    if (props?.groupNames && props?.groupNames?.length > 0) {
      props.groupNames?.forEach(
        (groupName) =>
          new CfnUserPoolGroup(
            this,
            `${props.userpoolConstructName}${groupName}Group`,
            {
              userPoolId: userPool.userPoolId,
              groupName: groupName,
            }
          )
      );
    }

    // IDENTITY PROVIDERS
    const xeroIdentityProvider = new UserPoolIdentityProviderOidc(
      this,
      'XeroUserPoolIdentityProviderOidc',
      {
        name: 'Xero',
        clientId: props.xeroClientId,
        clientSecret: props.xeroClientSecret,
        issuerUrl: 'https://identity.xero.com',
        scopes: ['openid', 'profile', 'email', 'offline_access'],
        userPool,
        attributeMapping: {
          email: ProviderAttribute.other('email'),
          givenName: ProviderAttribute.other('given_name'),
          familyName: ProviderAttribute.other('family_name'),
          preferredUsername: ProviderAttribute.other('sub'),
        },
      }
    );
    //const appleProvider = new UserPoolIdentityProviderApple(this, 'AppleProvider', {
    //  userPool: userPool,
    //  clientId: 'com.example.apple',  // https://developer.apple.com/documentation/sign_in_with_apple/clientconfigi/3230948-clientid
    //  teamId: 'XXXXXX',
    //  keyId: 'XXXXXX',
    //  privateKey: 'XXXXXX',
    //  scopes: [], //https://developer.apple.com/documentation/sign_in_with_apple/clientconfigi/3230955-scope
    //  attributeMapping: {
    //    email: ProviderAttribute.APPLE_EMAIL,
    //    givenName: ProviderAttribute.APPLE_FIRST_NAME,
    //    familyName: ProviderAttribute.APPLE_LAST_NAME
    //  }
    //});
    //
    //const clientSecretValue = Secret.fromSecretAttributes(this, "CognitoClientSecret", {
    //  secretCompleteArn: "arn:aws:secretsmanager:xxx:xxx:secret:xxx-xxx"
    //}).secretValue
    //
    //// sign in with Google
    //const googleProvider = new UserPoolIdentityProviderGoogle(this, 'GoogleProvider', {
    //  userPool: userPool,
    //  clientId: 'XXXXXX', //TODO: update
    //  clientSecretValue: clientSecretValue,
    //  scopes: [],
    //  attributeMapping: {
    //    email: ProviderAttribute.GOOGLE_EMAIL,
    //    givenName: ProviderAttribute.GOOGLE_GIVEN_NAME,
    //    familyName: ProviderAttribute.GOOGLE_FAMILY_NAME
    //  }
    //});

    createUserFunc.role?.attachInlinePolicy(
      new Policy(this, 'CreateUserFuncUserPoolPolicy', {
        statements: [
          new PolicyStatement({
            actions: [
              'cognito-idp:AdminUpdateUserAttributes',
              'cognito-idp:AdminAddUserToGroup',
            ],
            effect: Effect.ALLOW,
            resources: [userPool.userPoolArn],
          }),
        ],
      })
    );

    // set attributes that are readable by a user
    const readAttributes = new ClientAttributes()
      .withStandardAttributes({
        email: true,
        emailVerified: true,
        phoneNumber: true,
        phoneNumberVerified: true,
        familyName: true,
        givenName: true,
        locale: true,
      })
      .withCustomAttributes(
        'userType',
        'identityId'
      );

    // set attributes that are writable for a user
    const writeAttributes = new ClientAttributes().withStandardAttributes({
      email: true,
      phoneNumber: true,
      familyName: true,
      givenName: true,
      locale: true,
    });

    const clientProps = {
      authFlows: {
        userPassword: true,
        userSrp: true,
        custom: true,
      },
      oAuth: {
        callbackUrls: ['http://localhost:4200/xero-redirect'],
      },
      supportedIdentityProviders: [
        UserPoolClientIdentityProvider.custom('Xero'),
      ],
      readAttributes,
      writeAttributes,
      userPool,
    };

    const userPoolClient = new UserPoolClient(
      this,
      `${props.appClientConstructName}`,
      {
        ...clientProps,
      }
    );

    userPoolClient.node.addDependency(xeroIdentityProvider);

    const userPoolWebClient = new UserPoolClient(
      this,
      `${props.appClientConstructName}-web`,
      {
        ...clientProps,
      }
    );

    userPoolWebClient.node.addDependency(xeroIdentityProvider);

    // authenticated / non-authenticated users
    const identityPool = new IdentityPool(
      this,
      props.identitypoolConstructName,
      {
        identityPoolName: props.identitypoolConstructName,
        allowUnauthenticatedIdentities: false,
        authenticationProviders: {
          userPools: [
            new UserPoolAuthenticationProvider({ userPool, userPoolClient }),
            new UserPoolAuthenticationProvider({
              userPool,
              userPoolClient: userPoolWebClient,
            }),
          ],
        },
      }
    );

    new CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });

    new CfnOutput(this, 'UserPoolDomain', {
      value: userPool.userPoolProviderUrl,
    });

    new CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });

    this.identityPoolId = new CfnOutput(this, 'IdentityPoolId', {
      value: identityPool.identityPoolId,
    });

    this.authenticatedRole = identityPool.authenticatedRole;
    this.unauthenticatedRole = identityPool.unauthenticatedRole;
    this.userPool = userPool;
    this.createUserFunc = createUserFunc;
  }
}
