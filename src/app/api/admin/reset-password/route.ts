import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: "Token and password are required." },
        { status: 400 }
      );
    }

    // Find admin with valid reset token and check expiry
    const admin = await prisma.admin.findFirst({
      where: {
        resetToken: token,
        resetExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token. Please request a new link." },
        { status: 400 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Update password and clear reset token fields
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        passwordHash: passwordHash,
        resetToken: null,
        resetExpiry: null,
      },
    });

    return NextResponse.json(
      { success: true, message: "Your password has been successfully reset!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password handler error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
