import { NextRequest, NextResponse } from "next/server";
import { verifySupabaseAuth, createSupabaseUserClient } from "@/lib/supabase";
import { isR2Enabled, r2Client } from "@/lib/r2";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Sanitizes a filename to prevent path traversal and keep names clean.
 */
function sanitizeFilename(filename: string): string {
  const basename = filename.split(/[\\/]/).pop() || "";
  const ext = basename.split(".").pop() || "";
  const nameWithoutExt = basename.substring(0, basename.lastIndexOf("."));
  const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, "_");
  return ext ? `${cleanName}.${ext.toLowerCase()}` : cleanName;
}

export async function POST(req: NextRequest) {
  let uploadedKey: string | null = null;
  let isUploadedToR2 = false;
  let localFilePath: string | null = null;

  try {
    // 1. Authenticate user
    const auth = await verifySupabaseAuth(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or missing session token." },
        { status: 401 }
      );
    }

    const { userId } = auth;

    // 2. Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { success: false, message: "Bad Request: No file field supplied." },
        { status: 400 }
      );
    }

    // 3. MIME type validation
    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { success: false, message: `Unsupported file type: ${mimeType}` },
        { status: 400 }
      );
    }

    // 4. File size validation
    const size = file.size;
    const isPdf = mimeType === "application/pdf";
    const sizeLimit = isPdf ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;

    if (size > sizeLimit) {
      return NextResponse.json(
        {
          success: false,
          message: `File size exceeds the limit of ${isPdf ? "10MB" : "5MB"}.`,
        },
        { status: 400 }
      );
    }

    // 5. Generate unique filename and key paths
    const uuid = crypto.randomUUID();
    const safeFileName = sanitizeFilename(file.name || "unnamed");
    
    const now = new Date();
    const year = now.getUTCFullYear().toString();
    const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");

    // R2 Key or local subdirectory path
    const fileKey = `users/${userId}/${year}/${month}/${uuid}-${safeFileName}`;
    uploadedKey = fileKey;

    let fileUrl = "";
    let bucketName = "";

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isR2Enabled && r2Client) {
      // --- Cloudflare R2 Upload Path ---
      bucketName = process.env.R2_BUCKET_NAME!;
      const r2PublicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "") || "";
      fileUrl = `${r2PublicBase}/${fileKey}`;

      await r2Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
          Body: buffer,
          ContentType: mimeType,
        })
      );
      isUploadedToR2 = true;
    } else {
      // --- Local Disk Upload Fallback Path ---
      bucketName = "local-disk";
      fileUrl = `/uploads/${fileKey}`;

      const uploadDir = join(process.cwd(), "public", "uploads", "users", userId, year, month);
      await mkdir(uploadDir, { recursive: true });
      
      const filePath = join(uploadDir, `${uuid}-${safeFileName}`);
      localFilePath = filePath;

      await writeFile(filePath, buffer);
    }

    // 6. Save metadata to Supabase (using user's JWT client to verify RLS)
    const supabase = createSupabaseUserClient(auth.token);
    const { error: dbError } = await supabase
      .from("media_files")
      .insert({
        user_id: userId,
        file_key: fileKey,
        file_url: fileUrl,
        original_name: file.name || "unnamed",
        mime_type: mimeType,
        size_bytes: size,
        bucket_name: bucketName,
      });

    if (dbError) {
      console.error("Supabase metadata insertion error:", dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    // 7. Success Response
    return NextResponse.json({
      success: true,
      key: fileKey,
      url: fileUrl,
      originalName: file.name || "unnamed",
      mimeType,
      size,
    });

  } catch (error: any) {
    console.error("Upload API route error:", error);

    // Rollback storage uploads upon DB failure to prevent orphan files
    if (isUploadedToR2 && r2Client && uploadedKey) {
      try {
        await r2Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: uploadedKey,
          })
        );
      } catch (cleanupError) {
        console.error("Failed to clean up R2 file during rollback:", cleanupError);
      }
    } else if (localFilePath) {
      try {
        await unlink(localFilePath);
      } catch (cleanupError) {
        console.error("Failed to clean up local file during rollback:", cleanupError);
      }
    }

    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during file upload." },
      { status: 500 }
    );
  }
}
