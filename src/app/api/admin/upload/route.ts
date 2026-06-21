import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { supabaseAdmin, ensureBucketExists } from "@/lib/supabase";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No session token found." },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid session token." },
        { status: 401 }
      );
    }

    // 2. Validate environment variables before upload IF Supabase is enabled OR in production
    const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
    const hasSupabaseCreds = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
    const useSupabaseStorage = hasSupabaseCreds || isProduction;

    if (useSupabaseStorage) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !serviceRoleKey) {
        const missingVars = [];
        if (!supabaseUrl) missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
        if (!serviceRoleKey) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");

        console.error("Missing Supabase environment variables in production:", missingVars.join(", "));
        return NextResponse.json(
          {
            success: false,
            message: `Server misconfiguration: missing Supabase environment variables (${missingVars.join(", ")}) in production. Please verify your Vercel Dashboard project settings.`,
          },
          { status: 500 }
        );
      }
    }

    // 3. Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded." },
        { status: 400 }
      );
    }

    // 4. Validate MIME Type
    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { success: false, message: `Unsupported file type: ${mimeType}` },
        { status: 400 }
      );
    }

    // 5. Validate File Size
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

    // 6. Generate unique filename and key paths
    const uuid = crypto.randomUUID();
    const safeFileName = file.name
      .split(/[\\/]/)
      .pop()
      ?.replace(/[^a-zA-Z0-9.-]/g, "_") || "unnamed";

    let fileUrl = "";
    let fileKey = "";

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (useSupabaseStorage) {
      const now = new Date();
      const year = now.getUTCFullYear().toString();
      const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
      fileKey = `uploads/${year}/${month}/${uuid}-${safeFileName}`;

      const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "portfolio";

      // 7. Ensure bucket exists
      await ensureBucketExists(bucketName);

      // 8. Upload buffer to Supabase Storage
      const { error: uploadError } = await supabaseAdmin.storage
        .from(bucketName)
        .upload(fileKey, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (uploadError) {
        console.error("Supabase Storage upload error:", uploadError);
        throw uploadError;
      }

      // 9. Get Public URL
      const { data: urlData } = supabaseAdmin.storage
        .from(bucketName)
        .getPublicUrl(fileKey);

      fileUrl = urlData.publicUrl;
    } else {
      // --- Local Disk Upload Fallback Path ---
      const uploadDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const ext = safeFileName.split(".").pop() || "png";
      const baseName = safeFileName.substring(0, safeFileName.lastIndexOf(".")).replace(/[^a-zA-Z0-9_-]/g, "_") || "file";
      const filename = `${Date.now()}-${baseName}.${ext}`;
      const filePath = join(uploadDir, filename);

      await writeFile(filePath, buffer);

      fileKey = filename;
      fileUrl = `/uploads/${filename}`;
    }

    // 8. Return response (includes legacy fields at root for backward compatibility)
    return NextResponse.json({
      success: true,
      message: "File uploaded successfully.",
      url: fileUrl, // Backwards-compatible root URL for old ImageUploadField bindings
      data: {
        key: fileKey,
        url: fileUrl,
        originalName: file.name,
        mimeType: mimeType,
        size: size,
      },
    });

  } catch (error: any) {
    console.error("Upload handler exception:", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred during upload.",
      },
      { status: 500 }
    );
  }
}
