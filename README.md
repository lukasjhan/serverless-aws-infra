# Serverless AWS Infra Plugin

This plugin is used to create AWS infrastructure resources.

## Supported Resources

- s3
- sqs
- api gateway
- cloudfront
- route53

## Examples

[check this example project](https://github.com/lukasjhan/serverless-aws-infra/tree/master/sls-test)

## How it works?

This plugin will create the resources before and after the deployment.

### Before

- s3
  - cloudfront
  - route53
- sqs

### Deploy Serverless

- lambda
- api gateway
- cloudformation

### After

- api gateway
  - route53
