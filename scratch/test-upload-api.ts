import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const JWT_SECRET = process.env.JWT_SECRET || "kkr_portfolio_jwt_secret_key_2026_change_me";
const token = jwt.sign({ username: "admin" }, JWT_SECRET, { expiresIn: "1h" });

async function runTest() {
  const url = "http://localhost:3000/api/admin/upload";
  console.log(`Sending test request to ${url}...`);

  // Create a mock image file buffer
  const fileContent = "This is a mock image file content for testing R2 upload compatibility.";
  
  // We construct a multipart boundary
  const boundary = "----TestBoundary" + Math.random().toString(36).substring(2);
  const filename = "test-image.png";
  const mimeType = "image/png";

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

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Cookie": `admin_token=${token}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: bodyBuffer,
    });

    console.log(`Response Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log("Response Body:", JSON.stringify(data, null, 2));
  } catch (error: any) {
    console.error("Fetch request failed:", error.message || error);
    console.log("\nIf connection was refused, the Next.js local server may not be running on port 3000, or the port is different.");
  }
}

runTest();
