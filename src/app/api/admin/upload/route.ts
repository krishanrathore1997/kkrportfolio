import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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

    // 2. Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded." },
        { status: 400 }
      );
    }

    // 3. Size check (1.5MB limit = 1.5 * 1024 * 1024 bytes)
    if (file.size > 1.5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File size exceeds the 1.5MB limit." },
        { status: 400 }
      );
    }

    // 4. MIME type check (must be an image)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only image files are allowed." },
        { status: 400 }
      );
    }

    // 5. Save file to public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate safe unique filename
    const ext = file.name.split(".").pop() || "png";
    const baseName = file.name
      .substring(0, file.name.lastIndexOf("."))
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${Date.now()}-${baseName}.${ext}`;
    const filePath = join(uploadDir, filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
    });

  } catch (error: any) {
    console.error("Upload handler exception:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during upload." },
      { status: 500 }
    );
  }
}
