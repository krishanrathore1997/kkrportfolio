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
    <div className="min-h-screen bg-bg-dark flex flex-col md:flex-row text-text-primary relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <AdminSidebar username={verified.username} />

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 md:overflow-y-auto md:max-h-screen z-10">
        <div className="max-w-5xl mx-auto min-h-full">
          {/* Main Glass Container */}
          <div className="bg-bg-card/40 dark:bg-bg-card/20 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl min-h-[calc(100vh-4rem)]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

