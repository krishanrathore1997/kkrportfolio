import React from "react";
import { prisma } from "@/lib/db";
import ServicesEditor from "./ServicesEditor";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-8 animate-reveal">
      <div className="border-b border-black/5 pb-4">
        <h1 className="text-3xl font-bold text-text-primary tracking-wide">Services Settings</h1>
        <p className="text-xs text-text-secondary mt-1">Manage the services you offer on your landing page. Add, edit, delete, or reorder them.</p>
      </div>

      <ServicesEditor initialServices={services} />
    </div>
  );
}
