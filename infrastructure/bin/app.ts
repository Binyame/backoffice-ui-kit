#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BackofficeStack } from '../lib/backoffice-stack';

const app = new cdk.App();

// Get environment from context or use defaults
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

// Get environment name from context (dev, staging, prod)
const environmentName = app.node.tryGetContext('environment') || 'dev';

new BackofficeStack(app, `BackofficeStack-${environmentName}`, {
  env,
  environmentName,
  stackName: `backoffice-kit-${environmentName}`,
  description: `BackOffice UI Kit infrastructure (${environmentName})`,
  tags: {
    Project: 'BackOffice UI Kit',
    Environment: environmentName,
    ManagedBy: 'CDK',
  },
});

app.synth();
