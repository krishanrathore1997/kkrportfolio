import { NextRequest, NextResponse } from "next/server";
import { verifySupabaseAuth, createSupabaseUserClient } from "@/lib/supabase";
import { isR2Enabled, r2Client } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { unlink } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";

export async function DELETE(req: NextRequest) {
  try {
    // 1. Authenticate user
    const auth = await verifySupabaseAuth(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or missing session token." },
        { status: 401 }
      );
    }

    // 2. Extract ID or key from request
    let idOrKey: string | null = null;

    // Check query parameters first
    const url = new URL(req.url);
    idOrKey = url.searchParams.get("id") || url.searchParams.get("key") || url.searchParams.get("idOrKey");

    // If not in query, try parsing JSON body
    if (!idOrKey) {
      try {
        const body = await req.json();
        idOrKey = body.id || body.key || body.idOrKey;
      } catch {
        // No body or invalid JSON, ignore
      }
    }

    if (!idOrKey) {
      return NextResponse.json(
        { success: false, message: "Bad Request: Missing file 'id' or 'key' parameter." },
        { status: 400 }
      );
    }

    // 3. Retrieve file record from Supabase
    // Using user-bound Supabase client to fetch. If the record does not belong to the user,
    // Supabase RLS will filter it out, returning 0 records or error.
    const supabase = createSupabaseUserClient(auth.token);
    const { data: fileRecord, error: selectError } = await supabase
      .from("media_files")
      .select("*")
      .or(`id.eq.${idOrKey},file_key.eq.${idOrKey}`)
      .maybeSingle();

    if (selectError) {
      console.error("Database query error:", selectError);
      return NextResponse.json(
        { success: false, message: "Failed to retrieve media record." },
        { status: 500 }
      );
    }

    if (!fileRecord) {
      // Return 404 to avoid leaking existence of files owned by other users
      return NextResponse.json(
        { success: false, message: "File not found or unauthorized." },
        { status: 404 }
      );
    }

    // 4. Delete the actual file from the appropriate storage driver
    if (fileRecord.bucket_name === "local-disk") {
      // Local Disk Delete
      try {
        const filePath = join(process.cwd(), "public", "uploads", fileRecord.file_key);
        await unlink(filePath);
      } catch (err: any) {
        // If file doesn't exist on disk, we still proceed to delete the db record
        if (err.code !== "ENOENT") {
          console.error("Failed to delete local file:", err);
          return NextResponse.json(
            { success: false, message: "Failed to delete file from local storage." },
            { status: 500 }
          );
        }
      }
    } else {
      // Cloudflare R2 Delete
      if (!isR2Enabled || !r2Client) {
        return NextResponse.json(
          {
            success: false,
            message: "Failed to delete: R2 storage is not configured on this server instance.",
          },
          { status: 500 }
        );
      }

      try {
        await r2Client.send(
          new DeleteObjectCommand({
            Bucket: fileRecord.bucket_name,
            Key: fileRecord.file_key,
          })
        );
      } catch (r2Error) {
        console.error("Failed to delete file from R2:", r2Error);
        return NextResponse.json(
          { success: false, message: "Failed to delete file from Cloudflare R2." },
          { status: 500 }
        );
      }
    }

    // 5. Delete metadata record from Supabase
    const { error: deleteError } = await supabase
      .from("media_files")
      .delete()
      .eq("id", fileRecord.id);

    if (deleteError) {
      console.error("Failed to delete database record:", deleteError);
      return NextResponse.json(
        { success: false, message: "Failed to delete database record." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "File and its metadata deleted successfully.",
    });

  } catch (error) {
    console.error("Delete API route exception:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred during deletion." },
      { status: 500 }
    );
  }
}
