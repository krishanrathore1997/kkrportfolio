import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required." },
        { status: 400 }
      );
    }

    // Check if admin exists in database (find by username OR email)
    let admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: username.toLowerCase() },
          { email: username.toLowerCase() }
        ]
      },
    });

    if (!admin && (username.toLowerCase() === "admin" || username.toLowerCase() === "krishanrathore3497@gmail.com")) {
      // Create default admin account dynamically if not seeded! Great fail-safety!
      const salt = await bcrypt.genSalt(10);
      const defaultPasswordHash = await bcrypt.hash("Krishan@3497", salt);
      admin = await prisma.admin.create({
        data: {
          username: "admin",
          email: "krishanrathore3497@gmail.com",
          passwordHash: defaultPasswordHash,
        },
      });
    }

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = signToken({ username: admin.username });

    const response = NextResponse.json(
      { success: true, message: "Logged in successfully!" },
      { status: 200 }
    );

    // Set secure cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("API login handler exception:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
