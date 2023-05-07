import {
  ChangeResourceRecordSetsCommand,
  ListResourceRecordSetsCommand,
  Route53Client,
} from "@aws-sdk/client-route-53";

export const getDomain = async (
  route53Client: Route53Client,
  HostedZoneId: string
) => {
  const command = new ListResourceRecordSetsCommand({
    HostedZoneId: HostedZoneId,
  });
  try {
    const ret = await route53Client.send(command);
    return ret;
  } catch (error: any) {
    console.error("ERROR: getDomain");
    throw new Error(error);
  }
};

export const createDomain = async (
  route53Client: Route53Client,
  DomainName: string,
  target: string
) => {
  const HostedZoneId = getHostZoneIdByName(DomainName);
  const command = new ChangeResourceRecordSetsCommand({
    ChangeBatch: {
      Changes: [
        {
          Action: "CREATE",
          ResourceRecordSet: {
            AliasTarget: {
              HostedZoneId,
              DNSName: target,
              EvaluateTargetHealth: false,
            },
            Type: "A",
            Name: DomainName,
          },
        },
      ],
    },
    HostedZoneId: HostedZoneId,
  });
  try {
    const ret = await route53Client.send(command);
    return ret;
  } catch (error: any) {
    console.error("ERROR: createDomain");
    throw new Error(error);
  }
};

export const getHostZoneIdByName = (name: string) => {
  return "";
};
