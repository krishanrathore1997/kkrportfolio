import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, message: "Please fill out all required fields." },
        { status: 400 }
      );
    }

    // Create submission record
    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });

    return NextResponse.json(
      { success: true, message: "Your message has been submitted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Contact form submission error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
