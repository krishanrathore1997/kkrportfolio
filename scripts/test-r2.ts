import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

// User-supplied credentials
const R2_ACCOUNT_ID = "4b234244ae2a32b7590009cd5033f1fd";
const R2_ACCESS_KEY_ID = "eb884b255e09c342e63e737781237f6c";
const R2_SECRET_ACCESS_KEY = "ef63ef40190fe980bda1f1aaee8caf87d12f6b02879a19a1167715f49035a6f7";

async function testR2() {
  console.log("--------------------------------------------------");
  console.log("          CLOUDFLARE R2 CREDENTIAL CHECK          ");
  console.log("--------------------------------------------------");
  console.log(`Account ID : ${R2_ACCOUNT_ID}`);
  console.log("--------------------------------------------------");

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  try {
    // List all buckets in the Cloudflare R2 account
    const result = await client.send(new ListBucketsCommand({}));
    
    console.log("✅ SUCCESS: Successfully authenticated and connected to Cloudflare R2!");
    console.log("--------------------------------------------------");
    console.log("Available Buckets in your account:");
    
    if (result.Buckets && result.Buckets.length > 0) {
      result.Buckets.forEach((bucket, idx) => {
        console.log(`${idx + 1}. Name: "${bucket.Name}" (Created: ${bucket.CreationDate?.toISOString()})`);
      });
    } else {
      console.log("(No buckets found in this account. Please create one in Cloudflare R2 Console.)");
    }
    console.log("--------------------------------------------------");
  } catch (error: any) {
    console.error("❌ CONNECTION FAILED!");
    console.error(`Error Code   : ${error.name || "UnknownError"}`);
    console.error(`Error Message: ${error.message || error}`);
    console.log("\nPlease verify that your Access Key ID and Secret Access Key are correct and have correct permissions.");
  }
}

testR2();
