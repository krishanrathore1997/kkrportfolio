import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import AdminLogoutButton from "./AdminLogoutButton";
import SidebarNav from "./SidebarNav";

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
      <aside className="w-full md:w-64 bg-bg-card border-b md:border-b-0 md:border-r border-black/5 flex flex-col justify-between py-6 shrink-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.15)]">
        <div>
          {/* Logo Heading */}
          <div className="px-6 mb-8 flex items-center gap-3">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl">
              <img
                src="/assets/img/white-logo.png"
                alt="Build By Krish logo"
                className="h-full w-full object-cover"
              />
            </span>
            <div>
              <h2 className="text-md font-black tracking-widest uppercase text-text-primary">KKR Admin</h2>
              <span className="text-[9px] text-primary font-bold uppercase tracking-wider block">Dashboard Panel</span>
            </div>
          </div>

          {/* Links Nav component */}
          <SidebarNav />
        </div>

        {/* Footer & Logout */}
        <div className="px-4 mt-8 border-t border-black/5 pt-6 space-y-4">
          <div className="flex items-center gap-3 px-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              A
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary uppercase">{verified.username}</p>
              <span className="text-[10px] text-text-secondary block">Administrator</span>
            </div>
          </div>

          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
