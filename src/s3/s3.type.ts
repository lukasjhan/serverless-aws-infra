export interface S3 {
  name: string;
  accel: boolean;
  public?: boolean;
  corsConfig?: BucketCorsConfig[];
  enableWebsite?: boolean;
  policy?: 'ALL' | 'CF OAI';
  cloudfront?: {
    oai: boolean;
    website?: boolean;
    url: string[];
    acl?: boolean;
    cfsigner?: boolean;
  };
}

export interface BucketCorsConfig {
  AllowedHeaders: string[];
  AllowedMethods: Array<'GET' | 'PUT' | 'POST' | 'DELETE' | 'HEAD' | 'OPTIONS'>;
  AllowedOrigins: string[];
  ExposeHeaders?: string[];
  MaxAgeSeconds?: number;
}

export interface BucketWebsiteConfig {
  ErrorDocument: {
    Key: string;
  };
  IndexDocument: {
    Suffix: string;
  };
}
