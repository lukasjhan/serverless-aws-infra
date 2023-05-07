import { S3 } from "./s3/s3.type";
import { SQS } from "./sqs/sqs.type";
import { API } from "./api/api.type";
import { deployS3 } from "./s3/s3.deploy";
import { deploySQS } from "./sqs/sqs.deploy";
import { deployApi } from "./api/api.deploy";

interface AWSInfraConfig {
  s3?: S3[];
  sqs?: SQS[];
  api?: API;
}

class AWSInfra {
  private hooks: Record<string, () => void>;
  private config: AWSInfraConfig = {};
  private region: string = "";
  constructor(private serverless: Record<any, any>) {
    this.hooks = {
      initialize: () => this.init(),
      "before:deploy:deploy": () => this.beforeDeploy(),
      "after:deploy:deploy": () => this.afterDeploy(),
    };
  }

  init() {
    const { awsInfraConfig } = this.serverless.configurationInput.custom;
    const { region } = this.serverless.configurationInput.provider;

    this.region = region;
    this.config = require(awsInfraConfig) as AWSInfraConfig;

    console.log("region: ", region);
    console.log("config location: ", awsInfraConfig);
    console.log("config: ", this.config);
  }

  beforeDeploy() {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (this.config.s3) {
          await deployS3(this.config.s3, this.region);
        }
        if (this.config.sqs) {
          await deploySQS(this.config.sqs, this.region);
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  afterDeploy() {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (this.config.api) {
          await deployApi(this.config.api, this.region);
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = AWSInfra;
