import {
  APIGatewayClient,
  CreateBasePathMappingCommand,
  CreateDomainNameCommand,
  GetBasePathMappingsCommand,
  GetDomainNamesCommand,
  GetRestApisCommand,
} from "@aws-sdk/client-api-gateway";

export const listApis = async (apiClient: APIGatewayClient) => {
  const command = new GetRestApisCommand({ limit: 1000 });

  try {
    const result = await apiClient.send(command);
    return result.items?.map((item) => {
      return {
        name: item.name,
        id: item.id,
      };
    });
  } catch (error: any) {
    console.error("ERROR: listApis");
    throw new Error(error);
  }
};

export const getApiMapping = async (
  apiClient: APIGatewayClient,
  domainName: string
) => {
  const command = new GetBasePathMappingsCommand({ domainName });

  try {
    const result = await apiClient.send(command);
    return result;
  } catch (error: any) {
    console.error("ERROR: getApiMapping");
    throw new Error(error);
  }
};

export const createDomainName = async (
  apiClient: APIGatewayClient,
  domainName: string
) => {
  const command = new CreateDomainNameCommand({
    domainName,
    regionalCertificateArn: "",
    endpointConfiguration: {
      types: ["REGIONAL"],
    },
  });

  try {
    const result = await apiClient.send(command);
    return result;
  } catch (error: any) {
    console.error("ERROR: createDomainName");
    throw new Error(error);
  }
};

export const listDomainNames = async (apiClient: APIGatewayClient) => {
  const command = new GetDomainNamesCommand({ limit: 1000 });

  try {
    const result = await apiClient.send(command);
    return result.items?.map((domain) => {
      return { name: domain.domainName, url: domain.regionalDomainName };
    });
  } catch (error: any) {
    console.error("ERROR: listDomainNames");
    throw new Error(error);
  }
};

export const createApiMapping = async (
  apiClient: APIGatewayClient,
  restApiId: string,
  domainName: string,
  basePath: string | null,
  stage: string
) => {
  const command = new CreateBasePathMappingCommand({
    domainName,
    basePath: basePath ? basePath : "(none)",
    stage,
    restApiId,
  });

  try {
    const result = await apiClient.send(command);
    return result;
  } catch (error: any) {
    console.error("ERROR: createApiMapping");
    throw new Error(error);
  }
};
