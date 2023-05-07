module.exports = {
  s3: [
    {
      name: "test-bucket",
      accel: true,
      public: false,
      corsConfig: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["PUT", "GET"],
          AllowedOrigins: ["*"],
        },
      ],
      enableWebsite: false,
      policy: "CF OAI",
      cloudfront: {
        oai: true,
        url: [`${process.env.STAGE}.test.com`],
        acl: false,
      },
    },
  ],
  sqs: [
    {
      name: "test-queue",
      VisibilityTimeout: "600",
      DelaySeconds: "0",
      MessageRetentionPeriod: "1209600",
      RedrivePolicy: {
        deadLetterTargetArn: ``,
        maxReceiveCount: 5,
      },
    },
  ],
  api: {
    name: "test-api",
    domainName: "test.com",
    mappings: [
      {
        path: "(none)",
        apiName: `${process.env.STAGE}-lambda0`,
        stage: process.env.STAGE,
      },
      {
        path: "lambda1",
        apiName: `${process.env.STAGE}-lambda1`,
        stage: process.env.STAGE,
      },
    ],
  },
};
