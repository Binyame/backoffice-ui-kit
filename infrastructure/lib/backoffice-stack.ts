import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export interface BackofficeStackProps extends cdk.StackProps {
  environmentName: string;
}

export class BackofficeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackofficeStackProps) {
    super(scope, id, props);

    const { environmentName } = props;

    // ========================================
    // VPC - Network Infrastructure
    // ========================================
    const vpc = new ec2.Vpc(this, 'BackofficeVPC', {
      maxAzs: 2,
      natGateways: environmentName === 'prod' ? 2 : 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: 'Database',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // ========================================
    // RDS PostgreSQL - Database
    // ========================================
    const dbSecret = new secretsmanager.Secret(this, 'DBSecret', {
      secretName: `${environmentName}/backoffice/db`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        includeSpace: false,
      },
    });

    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
      vpc,
      description: 'Security group for RDS database',
      allowAllOutbound: false,
    });

    const database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15,
      }),
      instanceType: environmentName === 'prod'
        ? ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL)
        : ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      credentials: rds.Credentials.fromSecret(dbSecret),
      databaseName: 'backoffice',
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      securityGroups: [dbSecurityGroup],
      backupRetention: environmentName === 'prod' ? cdk.Duration.days(7) : cdk.Duration.days(1),
      deleteAutomatedBackups: environmentName !== 'prod',
      removalPolicy: environmentName === 'prod' ? cdk.RemovalPolicy.SNAPSHOT : cdk.RemovalPolicy.DESTROY,
      deletionProtection: environmentName === 'prod',
    });

    // ========================================
    // ECS Cluster for API
    // ========================================
    const cluster = new ecs.Cluster(this, 'APICluster', {
      vpc,
      clusterName: `backoffice-api-${environmentName}`,
      containerInsights: environmentName === 'prod',
    });

    // ========================================
    // Fargate Service for NestJS API
    // ========================================
    const apiService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'APIService', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset('../apps/api', {
          file: 'Dockerfile',
        }),
        containerPort: 3001,
        environment: {
          NODE_ENV: environmentName,
          PORT: '3001',
          DB_HOST: database.dbInstanceEndpointAddress,
          DB_PORT: '5432',
          DB_NAME: 'backoffice',
        },
        secrets: {
          DB_USERNAME: ecs.Secret.fromSecretsManager(dbSecret, 'username'),
          DB_PASSWORD: ecs.Secret.fromSecretsManager(dbSecret, 'password'),
        },
      },
      cpu: environmentName === 'prod' ? 1024 : 512,
      memoryLimitMiB: environmentName === 'prod' ? 2048 : 1024,
      desiredCount: environmentName === 'prod' ? 2 : 1,
      publicLoadBalancer: true,
      healthCheckGracePeriod: cdk.Duration.seconds(60),
    });

    // Allow API to connect to database
    dbSecurityGroup.addIngressRule(
      apiService.service.connections.securityGroups[0],
      ec2.Port.tcp(5432),
      'Allow API to connect to database'
    );

    // Configure health check
    apiService.targetGroup.configureHealthCheck({
      path: '/health',
      interval: cdk.Duration.seconds(30),
      timeout: cdk.Duration.seconds(5),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 3,
    });

    // Auto-scaling for production
    if (environmentName === 'prod') {
      const scaling = apiService.service.autoScaleTaskCount({
        minCapacity: 2,
        maxCapacity: 10,
      });

      scaling.scaleOnCpuUtilization('CpuScaling', {
        targetUtilizationPercent: 70,
      });

      scaling.scaleOnMemoryUtilization('MemoryScaling', {
        targetUtilizationPercent: 80,
      });
    }

    // ========================================
    // S3 + CloudFront for Next.js App
    // ========================================
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: `backoffice-web-${environmentName}-${this.account}`,
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: environmentName === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: environmentName !== 'prod',
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    const distribution = new cloudfront.Distribution(this, 'WebsiteDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
      priceClass: environmentName === 'prod'
        ? cloudfront.PriceClass.PRICE_CLASS_ALL
        : cloudfront.PriceClass.PRICE_CLASS_100,
    });

    // Deploy Next.js static export to S3
    // Note: You need to run 'next build' with output: 'export' first
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('../apps/web/out')],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // ========================================
    // Outputs
    // ========================================
    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'Next.js Website URL',
      exportName: `${environmentName}-WebsiteURL`,
    });

    new cdk.CfnOutput(this, 'APIURL', {
      value: `http://${apiService.loadBalancer.loadBalancerDnsName}`,
      description: 'NestJS API URL',
      exportName: `${environmentName}-APIURL`,
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: database.dbInstanceEndpointAddress,
      description: 'Database endpoint',
      exportName: `${environmentName}-DatabaseEndpoint`,
    });

    new cdk.CfnOutput(this, 'DatabaseSecretArn', {
      value: dbSecret.secretArn,
      description: 'Database credentials secret ARN',
      exportName: `${environmentName}-DatabaseSecretArn`,
    });
  }
}
