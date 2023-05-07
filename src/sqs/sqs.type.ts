import { Policy } from "./policy.type";

export interface SQS {
  name: string;
  VisibilityTimeout: string;
  DelaySeconds: string;
  MessageRetentionPeriod: string;
  Policy?: Policy;
  RedrivePolicy?: {
    deadLetterTargetArn: string;
    maxReceiveCount: number;
  };
}
