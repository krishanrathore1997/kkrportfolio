import dotenv from "dotenv";
import path from "path";
import module from "module";

// Mock 'server-only' package in require.cache
try {
  const mockPath = require.resolve("server-only");
  require.cache[mockPath] = {
    id: mockPath,
    filename: mockPath,
    loaded: true,
    exports: {},
    children: [],
    path: path.dirname(mockPath),
  } as any;
} catch (e) {
  // If not resolvable, register dummy
}

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Import NextRequest
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "kkr_portfolio_jwt_secret_key_2026_change_me";
const token = jwt.sign({ username: "admin" }, JWT_SECRET, { expiresIn: "1h" });

async function runDirectTest() {
  console.log("--------------------------------------------------");
  console.log("          DIRECT HANDLER EXECUTION TEST           ");
  console.log("--------------------------------------------------");

  // Dynamically import POST handler after mocking server-only
  const { POST } = await import("../src/app/api/admin/upload/route");


  const boundary = "----TestBoundary" + Math.random().toString(36).substring(2);
  const filename = "test-image.png";
  const mimeType = "image/png";
  const fileContent = "This is a mock image file content for testing R2 upload compatibility.";

  const header = 
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
    `Content-Type: ${mimeType}\r\n\r\n`;
  const footer = `\r\n--${boundary}--\r\n`;

  const bodyBuffer = Buffer.concat([
    Buffer.from(header, "utf-8"),
    Buffer.from(fileContent, "utf-8"),
    Buffer.from(footer, "utf-8"),
  ]);

  // Construct a NextRequest object
  const req = new NextRequest("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: {
      "Cookie": `admin_token=${token}`,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body: bodyBuffer,
  });

  try {
    // Test 1: Cloudflare R2 Upload Path (Variables are present in process.env)
    console.log("\n--- TEST 1: Running with Cloudflare R2 configured ---");
    const resR2 = await POST(req);
    console.log(`Response Status: ${resR2.status}`);
    const dataR2 = await resR2.json();
    console.log("Response Body:", JSON.stringify(dataR2, null, 2));
  } catch (error: any) {
    console.error("R2 path failed:", error.message || error);
  }

  try {
    // Test 2: Local Disk Fallback Path (Temporarily clear R2 credentials in environment)
    console.log("\n--- TEST 2: Running with R2 disabled (local fallback) ---");
    delete process.env.R2_ACCOUNT_ID;
    delete process.env.R2_ACCESS_KEY_ID;
    delete process.env.R2_SECRET_ACCESS_KEY;
    delete process.env.R2_BUCKET_NAME;
    delete process.env.R2_PUBLIC_URL;

    // We must re-create request since the body streams can only be read once
    const reqLocal = new NextRequest("http://localhost:3000/api/admin/upload", {
      method: "POST",
      headers: {
        "Cookie": `admin_token=${token}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: bodyBuffer,
    });

    const resLocal = await POST(reqLocal);
    console.log(`Response Status: ${resLocal.status}`);
    const dataLocal = await resLocal.json();
    console.log("Response Body:", JSON.stringify(dataLocal, null, 2));

    // Verify if the local file was actually created in public/uploads
    if (resLocal.status === 200 && dataLocal.success) {
      const createdFilename = dataLocal.data.key;
      const fs = await import("fs");
      const localFilePath = path.join(process.cwd(), "public", "uploads", createdFilename);
      if (fs.existsSync(localFilePath)) {
        console.log(`\n✅ SUCCESS: File verified on local filesystem at: ${localFilePath}`);
        // Clean it up
        fs.unlinkSync(localFilePath);
        console.log("Deleted temporary test file from local disk.");
      } else {
        console.error(`\n❌ ERROR: File was not found at expected path: ${localFilePath}`);
      }
    }
  } catch (error: any) {
    console.error("Local fallback path failed:", error.message || error);
  }
}

runDirectTest();

