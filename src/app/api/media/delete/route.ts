import { NextRequest, NextResponse } from "next/server";
import { verifySupabaseAuth, createSupabaseUserClient, supabaseAdmin } from "@/lib/supabase";
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
      // Delete from Supabase Storage
      try {
        const { error: storageError } = await supabaseAdmin.storage
          .from(fileRecord.bucket_name)
          .remove([fileRecord.file_key]);

        if (storageError) {
          console.error("Failed to delete file from Supabase Storage:", storageError);
          return NextResponse.json(
            { success: false, message: "Failed to delete file from Supabase Storage." },
            { status: 500 }
          );
        }
      } catch (storageException) {
        console.error("Supabase Storage delete exception:", storageException);
        return NextResponse.json(
          { success: false, message: "Exception occurred during Supabase Storage deletion." },
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
