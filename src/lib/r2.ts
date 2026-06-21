import { S3Client } from "@aws-sdk/client-s3";

// Prevent this module from being imported in client-side code
if (typeof window !== "undefined") {
  throw new Error("This storage utility can only be used on the server side.");
}

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

// R2 is only enabled if all credentials and URLs are supplied
export const isR2Enabled = !!(
  R2_ACCOUNT_ID &&
  R2_ACCESS_KEY_ID &&
  R2_SECRET_ACCESS_KEY &&
  R2_BUCKET_NAME &&
  R2_PUBLIC_URL
);

export let r2Client: S3Client | null = null;

if (isR2Enabled) {
  try {
    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID!,
        secretAccessKey: R2_SECRET_ACCESS_KEY!,
      },
    });
  } catch (error) {
    console.error("Failed to initialize Cloudflare R2 S3Client:", error);
    r2Client = null;
  }
} else {
  // If we are in production and R2 is expected but not configured, log a warning
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "Cloudflare R2 environment variables are missing. Storage will fall back to local disk (unsupported on Vercel ephemeral systems)."
    );
  } else {
    console.log("Cloudflare R2 is not configured. Falling back to local disk storage for development.");
  }
}
