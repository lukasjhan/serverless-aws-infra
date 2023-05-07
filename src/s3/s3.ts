import {
  CreateBucketCommand,
  GetBucketCorsCommand,
  GetBucketPolicyCommand,
  GetBucketWebsiteCommand,
  HeadBucketCommand,
  ListBucketsCommand,
  PutBucketAccelerateConfigurationCommand,
  PutBucketCorsCommand,
  PutBucketPolicyCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { BucketCorsConfig } from "./s3.type";
import { filterUndefined } from "../utils";

export const checkBucketExists = async (s3: S3Client, bucket: string) => {
  const command = new HeadBucketCommand({ Bucket: bucket });

  try {
    await s3.send(command);
    return true;
  } catch (error: any) {
    console.error(`ERROR: s3 bucket not found: ${bucket}`);
    throw new Error(error);
  }
};

export const getBucketList = async (s3: S3Client) => {
  const command = new ListBucketsCommand({});

  try {
    const ret = await s3.send(command);
    return (
      ret.Buckets?.map((bucket) => bucket.Name).filter(filterUndefined) ?? []
    );
  } catch (error: any) {
    console.error(`ERROR: getBucketList`);
    throw new Error(error);
  }
};

export const getCORSConfig = async (s3: S3Client, bucket: string) => {
  const command = new GetBucketCorsCommand({ Bucket: bucket });

  try {
    const result = await s3.send(command);
    return result.CORSRules;
  } catch (error: any) {
    console.error(`ERROR: getCORSConfig`);
    throw new Error(error);
  }
};

export const getBucketWebsite = async (s3: S3Client, bucket: string) => {
  const command = new GetBucketWebsiteCommand({ Bucket: bucket });

  try {
    const result = await s3.send(command);
    return {
      IndexDocument: result.IndexDocument,
      ErrorDocument: result.ErrorDocument,
    };
  } catch (error: any) {
    console.error(`ERROR: getBucketWebsite`);
    throw new Error(error);
  }
};

export const getBucketPolicy = async (s3: S3Client, bucket: string) => {
  const command = new GetBucketPolicyCommand({ Bucket: bucket });

  try {
    const result = await s3.send(command);
    return result.Policy;
  } catch (error: any) {
    console.error(`ERROR: getBucketPolicy`);
    return undefined;
  }
};

export const getBucketPolicyAllConf = (bucketName: string) => {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          AWS: "*",
        },
        Action: "s3:GetObject",
        Resource: `arn:aws:s3:::${bucketName}/*`,
      },
    ],
  };
};

export const getBucketPolicyOAIConf = (bucketName: string, OAI: string) => {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          AWS: `arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${OAI}`,
        },
        Action: "s3:GetObject",
        Resource: `arn:aws:s3:::${bucketName}/*`,
      },
    ],
  };
};

export const createBucket = async (
  s3: S3Client,
  bucketName: string,
  region: string,
  isPublic?: boolean
) => {
  const command = new CreateBucketCommand({
    Bucket: bucketName,
    CreateBucketConfiguration: { LocationConstraint: region },
    ACL: isPublic === true ? "public-read" : "private",
  });

  try {
    const result = await s3.send(command);
    return result;
  } catch (error: any) {
    console.error(`ERROR: createBucket`);
    throw new Error(error);
  }
};

export const putCorsConfigOnBucket = async (
  s3: S3Client,
  bucketName: string,
  corsConfig: BucketCorsConfig[]
) => {
  const command = new PutBucketCorsCommand({
    Bucket: bucketName,
    CORSConfiguration: { CORSRules: corsConfig },
  });

  try {
    const result = await s3.send(command);
    return result;
  } catch (error: any) {
    console.error(`ERROR: putCorsConfigOnBucket`);
    throw new Error(error);
  }
};

export const putBucketPolicy = async (
  s3: S3Client,
  bucketName: string,
  policy: string
) => {
  const command = new PutBucketPolicyCommand({
    Bucket: bucketName,
    Policy: policy,
  });

  try {
    const result = await s3.send(command);
    return result;
  } catch (error: any) {
    console.error(`ERROR: putBucketPolicy`);
    throw new Error(error);
  }
};

export const putBucketAcceleration = async (
  s3: S3Client,
  bucketName: string,
  acceleration: boolean
) => {
  const status = acceleration ? "Enabled" : "Suspended";

  const command = new PutBucketAccelerateConfigurationCommand({
    Bucket: bucketName,
    AccelerateConfiguration: { Status: status },
  });

  try {
    const result = await s3.send(command);
    return result;
  } catch (error: any) {
    console.error(`ERROR: putBucketPolicy`);
    throw new Error(error);
  }
};
