import React from "react";
import { prisma } from "@/lib/db";
import SlidesEditor from "./SlidesEditor";

export const dynamic = "force-dynamic";

export default async function AdminSlidesPage() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-8 animate-reveal">
      <div className="border-b border-black/5 pb-4">
        <h1 className="text-3xl font-bold text-text-primary tracking-wide">Hero Slideshow Settings</h1>
        <p className="text-xs text-text-secondary mt-1">Manage the rotating slides displayed on the right column of your landing page Hero section. Add slides, set visual links, and sort display priority.</p>
      </div>

      <SlidesEditor initialSlides={slides} />
    </div>
  );
}
