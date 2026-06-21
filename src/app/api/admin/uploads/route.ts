import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { readdir, stat, unlink } from "fs/promises";
import { join } from "path";
import { supabaseAdmin } from "@/lib/supabase";

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

    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "portfolio";
    const hasSupabaseCreds = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (hasSupabaseCreds) {
      // List from Supabase Storage recursively
      const filesList: any[] = [];
      
      const recurse = async (folder: string) => {
        const { data, error } = await supabaseAdmin.storage.from(bucketName).list(folder);
        if (error || !data) {
          if (error) console.error(`Error listing folder ${folder}:`, error);
          return;
        }
        
        for (const item of data) {
          const itemPath = folder ? `${folder}/${item.name}` : item.name;
          // In Supabase, directories have null id and null metadata.
          if (!item.id && !item.metadata) {
            await recurse(itemPath);
          } else {
            const { data: urlData } = supabaseAdmin.storage.from(bucketName).getPublicUrl(itemPath);
            filesList.push({
              name: itemPath.replace(/^uploads\//, ""), // Strip root 'uploads/' folder name
              url: urlData.publicUrl,
              size: item.metadata?.size || 0,
              createdAt: item.created_at ? new Date(item.created_at) : new Date(),
            });
          }
        }
      };

      await recurse("uploads");
      filesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return NextResponse.json({
        success: true,
        files: filesList,
      });
    }

    // Local Disk Fallback
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

    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "portfolio";
    const hasSupabaseCreds = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (hasSupabaseCreds) {
      // 3. Prevent path traversal attacks
      if (filename.includes("..")) {
        return NextResponse.json(
          { success: false, message: "Invalid filename." },
          { status: 400 }
        );
      }

      const fileKey = `uploads/${filename}`;
      const { error: deleteError } = await supabaseAdmin.storage
        .from(bucketName)
        .remove([fileKey]);

      if (deleteError) {
        console.error("Failed to delete file from Supabase Storage:", deleteError);
        return NextResponse.json(
          { success: false, message: "Failed to delete file from Supabase Storage." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "File deleted successfully from Supabase Storage.",
      });
    }

    // Local Disk Delete Path
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
      message: "File deleted successfully from local storage.",
    });

  } catch (error: any) {
    console.error("DELETE upload exception:", error);
    return NextResponse.json(
      { success: false, message: error.code === "ENOENT" ? "File not found." : "Failed to delete file." },
      { status: 500 }
    );
  }
}

