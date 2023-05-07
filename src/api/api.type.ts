export interface API {
  name: string;
  domainName: string;
  mappings: Array<{
    path: string;
    apiName: string;
    stage: string;
  }>;
}
