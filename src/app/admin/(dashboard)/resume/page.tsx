import React from "react";
import { prisma } from "@/lib/db";
import ResumeEditor from "./ResumeEditor";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
  const timelineItems = await prisma.timelineItem.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-8 animate-reveal">
      <div className="border-b border-black/5 pb-4">
        <h1 className="text-3xl font-bold text-text-primary tracking-wide">Resume/Timeline Settings</h1>
        <p className="text-xs text-text-secondary mt-1">Manage educational milestones and professional work experiences displayed on your resume timeline.</p>
      </div>

      <ResumeEditor initialItems={timelineItems} />
    </div>
  );
}
