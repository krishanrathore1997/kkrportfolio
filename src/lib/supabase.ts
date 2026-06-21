import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Prevent this module from being imported in client-side code
if (typeof window !== "undefined") {
  throw new Error("This Supabase helper can only be used on the server side.");
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

/**
 * Extracts the user token from the request's Authorization header or cookies.
 */
export function getSupabaseUserToken(req: NextRequest): string | null {
  // 1. Try Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.substring(7);
  }

  // 2. Try to find the Supabase Auth cookie
  // Supabase usually sets cookies named: sb-<project-ref>-auth-token
  const cookieStore = req.cookies;
  const allCookies = cookieStore.getAll();
  
  // Find cookie that looks like sb-<project-ref>-auth-token
  const authCookie = allCookies.find(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  if (authCookie) {
    try {
      // Supabase auth cookies can be JSON-serialized arrays of string tokens,
      // or a simple string, depending on the client library version.
      const parsed = JSON.parse(authCookie.value);
      if (parsed && typeof parsed === "object") {
        return parsed.access_token || parsed.token || null;
      }
    } catch {
      // If it's a raw JWT string
      return authCookie.value;
    }
  }

  // 3. Fallback: Check standard sb-access-token cookie
  const sbAccessToken = cookieStore.get("sb-access-token")?.value;
  if (sbAccessToken) {
    return sbAccessToken;
  }

  return null;
}

/**
 * Verifies the Supabase JWT token server-side and returns the user payload.
 */
export async function verifySupabaseAuth(req: NextRequest) {
  const token = getSupabaseUserToken(req);
  if (!token) {
    return null;
  }

  if (!SUPABASE_JWT_SECRET) {
    console.error("Missing SUPABASE_JWT_SECRET in environment variables.");
    return null;
  }

  try {
    // Supabase JWTs are signed with HS256 algorithm using the JWT Secret
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET, {
      algorithms: ["HS256"],
    }) as {
      sub: string;
      email?: string;
      role?: string;
    };

    return {
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      token,
    };
  } catch (error) {
    console.error("Failed to verify Supabase JWT token:", error);
    return null;
  }
}

/**
 * Instantiates a client-specific Supabase client using the user's own token.
 * This ensures that Row Level Security (RLS) is correctly applied in the DB.
 */
export function createSupabaseUserClient(token: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase URL or Anon Key is missing in environment variables.");
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      persistSession: false,
    },
  });
}

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(
  SUPABASE_URL || "",
  SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY || "",
  {
    auth: {
      persistSession: false,
    },
  }
);

/**
 * Ensures the configured Supabase Storage bucket exists and is public.
 */
export async function ensureBucketExists(bucket: string) {
  try {
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (listError) {
      console.error("Error listing Supabase Storage buckets:", listError);
      return;
    }

    const exists = buckets.some((b) => b.name === bucket);
    if (!exists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket(bucket, {
        public: true,
      });
      if (createError) {
        console.error(`Failed to create public Supabase Storage bucket "${bucket}":`, createError);
      } else {
        console.log(`Successfully created public Supabase Storage bucket: "${bucket}"`);
      }
    }
  } catch (err) {
    console.error("Exception checking/creating Supabase Storage bucket:", err);
  }
}

