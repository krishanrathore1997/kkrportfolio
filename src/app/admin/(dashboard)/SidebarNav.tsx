"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Sparkles,
  Briefcase,
  Award,
  Sliders,
  BookOpen,
  Image,
  MessageSquare,
  Inbox,
  ChevronRight,
  Wrench,
} from "lucide-react";

interface SidebarNavProps {
  onItemClick?: () => void;
}

export default function SidebarNav({ onItemClick }: SidebarNavProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "General Bio", icon: User, href: "/admin" },
    { name: "Hero Slides", icon: Sparkles, href: "/admin/slides" },
    { name: "Services", icon: Briefcase, href: "/admin/services" },
    { name: "Skills", icon: Award, href: "/admin/skills" },
    { name: "Banners Slider", icon: Sliders, href: "/admin/banners" },
    { name: "Resume/Timeline", icon: BookOpen, href: "/admin/resume" },
    { name: "Portfolio", icon: Image, href: "/admin/portfolio" },
    { name: "Reviews", icon: MessageSquare, href: "/admin/reviews" },
    { name: "Contact Leads", icon: Inbox, href: "/admin/contact" },
    { name: "Debug Uploads", icon: Wrench, href: "/admin/debug" },
  ];

  return (
    <nav className="space-y-1.5 px-4">
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={index}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group font-bold text-[10px] tracking-wider uppercase hover:translate-x-1 border ${isActive
                ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary border-primary/25 shadow-sm shadow-primary/5"
                : "text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary border-transparent"
              }`}
          >
            <div className="flex items-center gap-3">
              <Icon
                className={`w-4 h-4 transition-colors duration-300 ${isActive
                    ? "text-primary"
                    : "text-text-secondary group-hover:text-primary"
                  }`}
              />
              <span>{item.name}</span>
            </div>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-all duration-300 ${isActive
                  ? "opacity-100 translate-x-0.5 text-primary"
                  : "opacity-0 group-hover:opacity-100 text-primary"
                }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}

