import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { readdir, stat, unlink } from "fs/promises";
import { join } from "path";

export async function GET(req: NextRequest) {
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

    const uploadDir = join(process.cwd(), "public", "uploads");
    
    let filesList: any[] = [];
    try {
      const files = await readdir(uploadDir);
      for (const file of files) {
        const filePath = join(uploadDir, file);
        const fileStat = await stat(filePath);
        if (fileStat.isFile()) {
          filesList.push({
            name: file,
            url: `/uploads/${file}`,
            size: fileStat.size,
            createdAt: fileStat.birthtime,
          });
        }
      }
      // Sort by newest first
      filesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch {
      // Directory might not exist yet if no files uploaded
      filesList = [];
    }

    return NextResponse.json({
      success: true,
      files: filesList,
    });

  } catch (error: any) {
    console.error("GET uploads exception:", error);
    return NextResponse.json(
      { success: false, message: "Failed to list uploads." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    // 2. Get filename to delete
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("file");

    if (!filename) {
      return NextResponse.json(
        { success: false, message: "Filename query parameter 'file' is required." },
        { status: 400 }
      );
    }

    // 3. Prevent path traversal attacks
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json(
        { success: false, message: "Invalid filename." },
        { status: 400 }
      );
    }

    const filePath = join(process.cwd(), "public", "uploads", filename);
    await unlink(filePath);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully.",
    });

  } catch (error: any) {
    console.error("DELETE upload exception:", error);
    return NextResponse.json(
      { success: false, message: error.code === "ENOENT" ? "File not found." : "Failed to delete file." },
      { status: 500 }
    );
  }
}
