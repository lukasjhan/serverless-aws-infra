import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
import { Route53Client } from "@aws-sdk/client-route-53";
import { S3Client } from "@aws-sdk/client-s3";
import { createDistribution, createOAI } from "../cf/cloudfront";
import { createDomain } from "../route53/route53";
import {
  createBucket,
  getBucketList,
  getBucketPolicyAllConf,
  getBucketPolicyOAIConf,
  putBucketAcceleration,
  putBucketPolicy,
  putCorsConfigOnBucket,
} from "./s3";
import { sleep } from "../utils";
import { S3 } from "./s3.type";

export async function deployS3(s3: S3[], region: string) {
  const s3Client = new S3Client({ region });

  const s3Conf = s3;
  const bucketList = await getBucketList(s3Client);

  for (const bucket of s3Conf) {
    const existing = bucketList.includes(bucket.name);
    if (existing) {
      console.log(`Bucket ${bucket.name} already exists`);
      continue;
    }

    console.log(`create bucket ${bucket.name}`);
    await createBucket(s3Client, bucket.name, region, bucket.public);

    if (bucket.accel) {
      console.log("put acceleration to bucket", bucket.name);
      await putBucketAcceleration(s3Client, bucket.name, bucket.accel);
    }

    if (bucket.corsConfig) {
      console.log("put cors config on bucket");
      await putCorsConfigOnBucket(s3Client, bucket.name, bucket.corsConfig);
    }

    if (bucket.cloudfront) {
      const cloudfrontConf = bucket.cloudfront;
      const cfClient = new CloudFrontClient({
        region: region,
      });
      let oai: string | undefined = undefined;

      if (cloudfrontConf.oai) {
        const oaiRet = await createOAI(cfClient, bucket.name);
        oai = oaiRet?.Id;
        console.log("create oai", oai);
      }

      console.log("create distribution");
      const cfRet = await createDistribution(
        cfClient,
        cloudfrontConf.url,
        bucket.name,
        region,
        oai,
        cloudfrontConf.acl,
        cloudfrontConf.website,
        cloudfrontConf.cfsigner
      );
      const cfDomainName = cfRet?.Distribution?.DomainName;

      if (!cfDomainName) {
        throw new Error("domainName not found");
      }

      console.log(`${cfDomainName} created`);

      const route53Client = new Route53Client({
        region: region,
      });
      for (const url of cloudfrontConf.url) {
        console.log(`create domain ${url}`);
        await createDomain(route53Client, url, cfDomainName);
      }

      await sleep(20000);

      if (bucket.policy === "CF OAI" && cloudfrontConf.oai && oai) {
        const policy = JSON.stringify(
          getBucketPolicyOAIConf(bucket.name, oai.trim()),
          null,
          4
        );
        console.log(policy);
        await putBucketPolicy(s3Client, bucket.name, policy);
        console.log("put bucket policy");
      }
    } else if (bucket.policy === "ALL") {
      const policy = JSON.stringify(
        getBucketPolicyAllConf(bucket.name),
        null,
        4
      );
      console.log(policy);
      await putBucketPolicy(s3Client, bucket.name, policy);
      console.log("put bucket policy");
    }
  }

  console.log("deploy s3 stage done");
}
