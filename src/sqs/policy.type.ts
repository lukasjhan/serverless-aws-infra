export interface PolicyStatement {
  Sid?: string;
  Effect: 'Allow' | 'Deny';
  Principal: { [key: string]: string };
  Action: string;
  Resource: string;
}

export interface Policy {
  Version?: string;
  Id?: string;
  Statement: PolicyStatement[];
}
