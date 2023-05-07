import { SQSClient } from "@aws-sdk/client-sqs";
import { basename } from "path";
import { createSQS, getSQSAttribute, getSQSList } from "./sqs";
import { SQS } from "./sqs.type";

export async function deploySQS(sqs: SQS[], region: string) {
  const sqsClient = new SQSClient({ region });
  const queues = (await getSQSList(sqsClient)).map((queue) => basename(queue));
  const sqsConf = sqs;
  console.log("\n=== SQS Deploy ===\n");
  for (const value of sqsConf) {
    const exist = queues.includes(value.name);
    if (exist) {
      console.log(`Queue ${value.name} already exists`);
      continue;
    }
    const ret = await getSQSAttribute(sqsClient, value.name);
    if (ret === undefined) {
      console.error("attribute not found error");
      continue;
    }

    const url = await createSQS(sqsClient, value);
    console.log(`create queue ${value.name} ${url}`);
  }
  console.log("sqs deploy done");
}
