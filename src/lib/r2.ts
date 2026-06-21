import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

export const isR2Enabled = !!(
  process.env.R2_ENABLED !== "false" &&
  accountId &&
  accessKeyId &&
  secretAccessKey &&
  process.env.R2_BUCKET_NAME &&
  process.env.R2_PUBLIC_URL
);

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId || "dummy"}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || "dummy",
    secretAccessKey: secretAccessKey || "dummy",
  },
});

