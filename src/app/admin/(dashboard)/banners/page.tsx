import React from "react";
import { prisma } from "@/lib/db";
import BannersEditor from "./BannersEditor";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-8 animate-reveal">
      <div className="border-b border-black/5 pb-4">
        <h1 className="text-3xl font-bold text-text-primary tracking-wide">Banners Slider Settings</h1>
        <p className="text-xs text-text-secondary mt-1">Manage the banners that display in the slider section after your skills. Add business cards, new deployed features, and custom banners with categories, filter tabs, descriptions, and project redirect URLs.</p>
      </div>

      <BannersEditor initialBanners={banners} />
    </div>
  );
}
