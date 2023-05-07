import {
  CreateQueueCommand,
  GetQueueAttributesCommand,
  ListQueuesCommand,
  SQSClient,
  SetQueueAttributesCommand,
} from "@aws-sdk/client-sqs";
import { SQS } from "./sqs.type";

export const getSQSList = async (sqs: SQSClient) => {
  const command = new ListQueuesCommand({ MaxResults: 1000 });

  try {
    const result = await sqs.send(command);
    return result.QueueUrls ?? [];
  } catch (error: any) {
    console.log(`getSQSList error: ${error}`);
    throw new Error("getSQSList error");
  }
};

export const getSQSAttribute = async (sqs: SQSClient, queueUrl: string) => {
  const command = new GetQueueAttributesCommand({
    QueueUrl: queueUrl,
    AttributeNames: ["All"],
  });

  try {
    const result = await sqs.send(command);

    if (result.Attributes === undefined) return undefined;

    const {
      VisibilityTimeout,
      DelaySeconds,
      MessageRetentionPeriod,
      Policy,
      RedrivePolicy,
    } = result.Attributes;
    return {
      VisibilityTimeout,
      DelaySeconds,
      MessageRetentionPeriod,
      Policy,
      RedrivePolicy,
    };
  } catch (error: any) {
    console.log(`SQS attribute not found ${queueUrl}, error: ${error}`);
    throw new Error("getSQSAttribute error");
  }
};

export const createSQS = async (sqs: SQSClient, config: SQS) => {
  const createQueueCommand = new CreateQueueCommand({
    QueueName: config.name,
  });

  try {
    const result = await sqs.send(createQueueCommand);
    const url = result.QueueUrl;
    const setAttributesCommand = new SetQueueAttributesCommand({
      QueueUrl: url,
      Attributes: {
        VisibilityTimeout: `${config.VisibilityTimeout}`,
        DelaySeconds: `${config.DelaySeconds}`,
        MessageRetentionPeriod: `${config.MessageRetentionPeriod}`,
        Policy: JSON.stringify(config.Policy),
        RedrivePolicy: JSON.stringify(config.RedrivePolicy),
      },
    });
    await sqs.send(setAttributesCommand);
    return url;
  } catch (error: any) {
    console.log(`createSQS error: ${error}`);
    throw new Error("createSQS error");
  }
};
