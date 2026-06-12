import React from "react";
import { prisma } from "@/lib/db";
import PortfolioEditor from "./PortfolioEditor";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const portfolioItems = await prisma.portfolioItem.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-8 animate-reveal">
      <div className="border-b border-black/5 pb-4">
        <h1 className="text-3xl font-bold text-text-primary tracking-wide">Portfolio Projects Settings</h1>
        <p className="text-xs text-text-secondary mt-1">Manage the showcase projects featured in your portfolio grid. Add images, descriptions, tags, and project demo links.</p>
      </div>

      <PortfolioEditor initialItems={portfolioItems} />
    </div>
  );
}
