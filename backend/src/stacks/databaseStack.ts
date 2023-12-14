import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table,
} from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface DatabaseStackProps extends StackProps {
  readonly isProd: boolean;
}

export class DatabaseStack extends Stack {
  public readonly defaultTableProps: () => Record<string, any>;
  public readonly userTable: Table;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    this.defaultTableProps = () => ({
      removalPolicy: props.isProd
        ? RemovalPolicy.RETAIN
        : RemovalPolicy.DESTROY, //update if table shouldn't automatically destroy
      billingMode: BillingMode.PAY_PER_REQUEST,
      deletionProtection: props.isProd,
      pointInTimeRecovery: props.isProd,
    });

    // USER
    const userTable = new Table(this, 'UserTable', {
      ...this.defaultTableProps(),
      partitionKey: { name: 'id', type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    this.userTable = userTable;
  }
}
