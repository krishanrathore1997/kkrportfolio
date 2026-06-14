import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email or username is required." },
        { status: 400 }
      );
    }

    // Find admin by email or username
    const admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: email.toLowerCase() },
        ],
      },
    });

    if (!admin) {
      // Return success anyway for security (prevent email enumeration)
      // but in dev mode, we'll return a message that email wasn't found
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json(
          { success: false, message: `No admin account found with identifier: ${email}` },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          success: true,
          message: "If an account matches that email, a password reset link has been generated.",
        },
        { status: 200 }
      );
    }

    // Generate secure reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour validity

    // Update admin with reset token details
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        resetToken: token,
        resetExpiry: expiry,
      },
    });

    const resetLink = `${req.nextUrl.origin}/admin/reset-password?token=${token}`;

    console.log("==========================================");
    console.log("PASSWORD RESET REQUESTED FOR:", admin.username);
    console.log("RESET LINK:", resetLink);
    console.log("==========================================");

    // Dynamic import nodemailer to prevent build issues if not installed
    let emailSent = false;
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || '"Build by Krish Admin" <noreply@buildbykrish.com>',
          to: admin.email || email,
          subject: "Password Reset Request - Build by Krish Admin Portal",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #C59B4C; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Password Reset Request</h2>
              <p>You requested a password reset for the Build by Krish Admin Portal.</p>
              <p>Please click the button below to reset your password. This link is valid for 1 hour.</p>
              <div style="margin: 30px 0; text-align: center;">
                <a href="${resetLink}" style="background-color: #C59B4C; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password</a>
              </div>
              <p style="color: #6e7075; font-size: 14px;">If you did not request this, you can safely ignore this email.</p>
              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">Build by Krish &copy; ${new Date().getFullYear()}</p>
            </div>
          `,
        });
        emailSent = true;
      } catch (err) {
        console.error("Nodemailer failed to send email:", err);
      }
    }

    // Return response
    return NextResponse.json(
      {
        success: true,
        message: "If an account matches that email, a password reset link has been generated.",
        // In development mode, we return the reset link so the developer can click it directly.
        ...(process.env.NODE_ENV === "development" ? { resetLink, emailSent } : {}),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password handler error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
