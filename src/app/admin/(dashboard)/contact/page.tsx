import React from "react";
import { prisma } from "@/lib/db";
import LeadsInbox from "./LeadsInbox";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const leads = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-reveal">
      <div className="border-b border-black/5 pb-4">
        <h1 className="text-3xl font-bold text-text-primary tracking-wide">Client Inquiries & Leads Inbox</h1>
        <p className="text-xs text-text-secondary mt-1">View, manage, read, and delete contact submissions from your portfolio landing page in real-time.</p>
      </div>

      <LeadsInbox initialLeads={leads} />
    </div>
  );
}
