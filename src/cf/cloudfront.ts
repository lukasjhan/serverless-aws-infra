import {
  CloudFrontClient,
  CreateCloudFrontOriginAccessIdentityCommand,
  CreateDistributionCommand,
  ListDistributionsCommand,
} from "@aws-sdk/client-cloudfront";

export const listDistributions = async (cfClient: CloudFrontClient) => {
  const command = new ListDistributionsCommand({ MaxItems: 1000 });

  try {
    const result = await cfClient.send(command);
    return result.DistributionList?.Items ?? [];
  } catch (error: any) {
    console.error("ERROR: listDistributions");
    throw new Error(error);
  }
};

export const createDistribution = async (
  cfClient: CloudFrontClient,
  domainNames: string[],
  s3Bucket: string,
  region: string,
  originAccessIdentity?: string,
  webACL?: boolean,
  publicWebsite?: boolean,
  cfsigner?: boolean
) => {
  const s3bucketUrl = publicWebsite
    ? `${s3Bucket}.s3-website.${region}.amazonaws.com`
    : `${s3Bucket}.s3.${region}.amazonaws.com`;

  const CacheBehaviors = cfsigner
    ? {
        TrustedKeyGroups: {
          Enabled: true,
          Quantity: 1,
          Items: [""],
        },
        Compress: true,
        ViewerProtocolPolicy: "redirect-to-https",
        AllowedMethods: {
          Quantity: 7,
          Items: ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"],
        },
        PathPattern: "*",
        TargetOriginId: s3bucketUrl,
        MinTTL: 0,
        DefaultTTL: 0,
        MaxTTL: 0,
        ForwardedValues: {
          QueryString: false,
          Cookies: {
            Forward: "all",
          },
          Headers: {
            Quantity: 3,
            Items: [
              "Origin",
              "Access-Control-Request-Method",
              "Access-Control-Request-Headers",
            ],
          },
          QueryStringCacheKeys: {
            Quantity: 0,
          },
        },
      }
    : {
        TargetOriginId: s3bucketUrl,
        ViewerProtocolPolicy: "redirect-to-https",
        AllowedMethods: {
          Quantity: 2,
          Items: ["HEAD", "GET"],
          CachedMethods: {
            Quantity: 2,
            Items: ["HEAD", "GET"],
          },
        },
        MinTTL: 0,
        DefaultTTL: 86400,
        MaxTTL: 31536000,
        ForwardedValues: {
          QueryString: false,
          Cookies: {
            Forward: "none",
          },
          Headers: {
            Quantity: 0,
          },
          QueryStringCacheKeys: {
            Quantity: 0,
          },
        },
      };

  const command = new CreateDistributionCommand({
    DistributionConfig: {
      Aliases: {
        Quantity: domainNames.length,
        Items: domainNames,
      },
      ViewerCertificate: {
        SSLSupportMethod: "sni-only",
        ACMCertificateArn: "",
      },
      WebACLId: webACL ? "" : undefined,
      Origins: {
        Quantity: 1,
        Items: [
          {
            Id: s3bucketUrl,
            DomainName: s3bucketUrl,
            S3OriginConfig: {
              OriginAccessIdentity: `origin-access-identity/cloudfront/${originAccessIdentity}`,
            },
          },
        ],
      },
      Enabled: true,
      Comment: s3bucketUrl,
      CallerReference: s3bucketUrl,
      DefaultCacheBehavior: CacheBehaviors,
    },
  });

  try {
    const result = await cfClient.send(command);
    return result;
  } catch (error: any) {
    console.error("ERROR: createDistribution");
    throw new Error(error);
  }
};

export const createOAI = async (cfClient: CloudFrontClient, name: string) => {
  const command = new CreateCloudFrontOriginAccessIdentityCommand({
    CloudFrontOriginAccessIdentityConfig: {
      CallerReference: name,
      Comment: name,
    },
  });

  try {
    const result = await cfClient.send(command);
    return result.CloudFrontOriginAccessIdentity;
  } catch (error: any) {
    console.error("ERROR: createOAI");
    throw new Error(error);
  }
};
