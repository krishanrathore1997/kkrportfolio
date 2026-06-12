import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/lib/jwt";
import {
  User,
  Briefcase,
  Award,
  BookOpen,
  Image,
  Inbox,
  LogOut,
  ChevronRight,
  Database,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import AdminLogoutButton from "./AdminLogoutButton";

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

  const menuItems = [
    { name: "General Bio", icon: User, href: "/admin" },
    { name: "Hero Slides", icon: Sparkles, href: "/admin/slides" },
    { name: "Services", icon: Briefcase, href: "/admin/services" },
    { name: "Skills", icon: Award, href: "/admin/skills" },
    { name: "Resume/Timeline", icon: BookOpen, href: "/admin/resume" },
    { name: "Portfolio", icon: Image, href: "/admin/portfolio" },
    { name: "Reviews", icon: MessageSquare, href: "/admin/reviews" },
    { name: "Contact Leads", icon: Inbox, href: "/admin/contact" },
  ];

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col md:flex-row text-text-primary">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-bg-card border-b md:border-b-0 md:border-r border-black/5 flex flex-col justify-between py-6 shrink-0 z-30">
        <div>
          {/* Logo Heading */}
          <div className="px-6 mb-8 flex items-center gap-3">
            <Database className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-bold tracking-wider uppercase text-text-primary">KKR Admin</h2>
              <span className="text-[10px] text-text-secondary font-bold uppercase">Dashboard Panel</span>
            </div>
          </div>

          {/* Links */}
          <nav className="space-y-1 px-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-black/5 hover:text-primary transition-all group font-medium text-sm text-text-secondary hover:translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-text-secondary group-hover:text-primary" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </nav>
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
