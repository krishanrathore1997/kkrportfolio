import dotenv from "dotenv";
import path from "path";

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Temporarily delete R2 credentials BEFORE any import statements to force isR2Enabled = false
delete process.env.R2_ACCOUNT_ID;
delete process.env.R2_ACCESS_KEY_ID;
delete process.env.R2_SECRET_ACCESS_KEY;
delete process.env.R2_BUCKET_NAME;
delete process.env.R2_PUBLIC_URL;

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
} catch (e) {}

// Now import NextRequest and route handler
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "kkr_portfolio_jwt_secret_key_2026_change_me";
const token = jwt.sign({ username: "admin" }, JWT_SECRET, { expiresIn: "1h" });

async function runLocalTest() {
  console.log("--------------------------------------------------");
  console.log("          LOCAL FALLBACK PATH DIRECT TEST         ");
  console.log("--------------------------------------------------");

  const { POST } = await import("../src/app/api/admin/upload/route");

  const boundary = "----TestBoundary" + Math.random().toString(36).substring(2);
  const filename = "local-test-image.png";
  const mimeType = "image/png";
  const fileContent = "Local fallback write content.";

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

  const req = new NextRequest("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: {
      "Cookie": `admin_token=${token}`,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body: bodyBuffer,
  });

  try {
    const res = await POST(req);
    console.log(`Response Status: ${res.status}`);
    const data = await res.json();
    console.log("Response Body:", JSON.stringify(data, null, 2));

    if (res.status === 200 && data.success) {
      const createdFilename = data.data.key;
      const fs = await import("fs");
      const localFilePath = path.join(process.cwd(), "public", "uploads", createdFilename);
      if (fs.existsSync(localFilePath)) {
        console.log(`\n✅ SUCCESS: File verified on local filesystem at: ${localFilePath}`);
        fs.unlinkSync(localFilePath);
        console.log("Deleted temporary test file from local disk.");
      } else {
        console.error(`\n❌ ERROR: File was not found at expected path: ${localFilePath}`);
      }
    }
  } catch (error: any) {
    console.error("Local fallback test failed:", error);
  }
}

runLocalTest();
