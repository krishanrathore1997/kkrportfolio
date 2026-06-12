import React from "react";
import { prisma } from "@/lib/db";
import ProfileEditor from "./ProfileEditor";

export const dynamic = "force-dynamic";

export default async function AdminBioPage() {
  const profile = await prisma.profile.findFirst() ?? {
    name: "Krishan Kumar Rathore",
    title: "Full Stack Developer",
    subtitle: "Software Engineer",
    bioDescription: "",
    phone: "",
    email: "",
    address: "",
    language: "",
    freelance: "",
    cvUrl: "#",
    avatarUrl: "/assets/img/krishan-portrait.jpg",
    socialLinks: {
      linkedin: "",
      whatsapp: "",
    }
  };

  return (
    <div className="space-y-8 animate-reveal">
      <div className="border-b border-black/5 pb-4">
        <h1 className="text-3xl font-bold text-text-primary tracking-wide">General Bio & Profile Settings</h1>
        <p className="text-xs text-text-secondary mt-1">Manage main headings, bio descriptions, contact info, and download CV parameters.</p>
      </div>

      <ProfileEditor initialProfile={profile} />
    </div>
  );
}
