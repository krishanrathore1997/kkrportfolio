import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import AdminSidebar from "./AdminSidebar";

export const dynamic = "force-dynamic";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const verified = verifyToken(token);
  if (!verified) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col md:flex-row text-text-primary">
      {/* Sidebar Navigation */}
      <AdminSidebar username={verified.username} />

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

