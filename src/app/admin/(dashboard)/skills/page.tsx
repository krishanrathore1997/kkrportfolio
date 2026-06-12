import React from "react";
import { prisma } from "@/lib/db";
import SkillsEditor from "./SkillsEditor";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [
      { category: "asc" },
      { order: "asc" },
    ],
  });

  return (
    <div className="space-y-8 animate-reveal">
      <div className="border-b border-black/5 pb-4">
        <h1 className="text-3xl font-bold text-text-primary tracking-wide">Skills Settings</h1>
        <p className="text-xs text-text-secondary mt-1">Manage technical and design skill bars that render in your bio section. Define categories and level percentages.</p>
      </div>

      <SkillsEditor initialSkills={skills} />
    </div>
  );
}
