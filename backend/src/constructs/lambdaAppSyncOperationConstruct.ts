import { Duration } from 'aws-cdk-lib';
import { GraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import * as path from 'path';
import { capitalizeFirstLetter, externalLibs } from '../helpers';

export interface lambdaAppSyncOperationConstructProps {
  api: GraphqlApi;
  fieldName: string;
  typeName: 'Mutation' | 'Query';
  environmentVars?: Record<string, any>;
}

export class LambdaAppSyncOperationConstruct extends Construct {
  public readonly lambda: NodejsFunction;
  constructor(
    scope: Construct,
    id: string,
    props: lambdaAppSyncOperationConstructProps
  ) {
    super(scope, id);

    const { api, environmentVars = {}, fieldName, typeName } = props;

    //TODO: possible to make reusable?
    const defaultFuncProps = (funcName: string) => {
      const dependencyLayerArn = StringParameter.valueFromLookup(
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

    const lambdaFunction = new NodejsFunction(
      this,
      `${capitalizeFirstLetter(fieldName)}Function`,
      {
        ...defaultFuncProps(fieldName),
        environment: {
          ...environmentVars,
        },
      }
    );
    const xeroCreateConsentUrlFuncDS = api.addLambdaDataSource(
      `${capitalizeFirstLetter(fieldName)}FuncDS`,
      lambdaFunction
    );
    xeroCreateConsentUrlFuncDS.createResolver(
      `${capitalizeFirstLetter(fieldName)}FuncResolver`,
      {
        typeName,
        fieldName,
      }
    );

    this.lambda = lambdaFunction;
  }
}
