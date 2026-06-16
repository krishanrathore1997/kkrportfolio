"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import SidebarNav from "./SidebarNav";
import AdminLogoutButton from "./AdminLogoutButton";

interface AdminSidebarProps {
  username: string;
}

export default function AdminSidebar({ username }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const currentTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    setTheme(currentTheme);
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header Nav Bar */}
      <header className="md:hidden w-full h-16 bg-bg-card/70 dark:bg-bg-card/40 backdrop-blur-xl border-b border-border-subtle flex items-center justify-between px-6 z-40 sticky top-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl">
            <img
              src="/assets/img/white-logo.png"
              alt="Build By Krish logo"
              className="h-full w-full object-cover rounded-lg"
            />
          </span>
          <div>
            <h2 className="text-xs font-black tracking-wider uppercase text-text-primary">KKR Admin</h2>
            <span className="text-[8px] text-primary font-bold uppercase tracking-wider block">Dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-primary/10 text-text-primary hover:text-primary transition-all cursor-pointer border border-transparent active:scale-95"
            aria-label="Toggle Theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-4 h-4 text-primary" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 text-text-primary hover:text-primary transition-all cursor-pointer border border-transparent active:scale-95"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Navigation Drawer Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Drawer Content */}
      <aside
        className={`md:hidden fixed top-16 bottom-0 left-0 w-72 bg-bg-card/90 dark:bg-bg-card/85 backdrop-blur-2xl border-r border-border-subtle flex flex-col justify-between py-6 z-30 transition-all duration-300 ease-in-out transform shadow-2xl ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="overflow-y-auto max-h-[calc(100vh-12rem)] py-2">
          <SidebarNav onItemClick={closeSidebar} />
        </div>

        {/* Mobile Sidebar Footer */}
        <div className="px-4 mt-auto border-t border-border-subtle pt-6 space-y-4">
          <div className="flex items-center gap-3 px-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-hover text-white flex items-center justify-center font-bold text-sm shadow-[0_4px_12px_rgba(197,155,76,0.25)]">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary uppercase tracking-wide">{username}</p>
              <span className="text-[10px] text-text-secondary block">Administrator</span>
            </div>
          </div>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Desktop Sidebar Panel */}
      <aside className="hidden md:flex w-64 bg-bg-card/60 dark:bg-bg-card/40 backdrop-blur-xl border-r border-border-subtle flex-col justify-between py-6 shrink-0 z-30 shadow-[1px_0_10px_rgba(0,0,0,0.02)] transition-all duration-300">
        <div>
          {/* Logo Heading */}
          <div className="px-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                <img
                  src="/assets/img/white-logo.png"
                  alt="Build By Krish logo"
                  className="h-full w-full object-cover rounded-xl"
                />
              </span>
              <div>
                <h2 className="text-sm font-black tracking-widest uppercase text-text-primary">KKR Admin</h2>
                <span className="text-[9px] text-primary font-bold uppercase tracking-wider block">Dashboard Panel</span>
              </div>
            </div>

            {/* Desktop Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-primary/15 text-text-primary hover:text-primary transition-all cursor-pointer border border-transparent hover:scale-105 active:scale-95"
              aria-label="Toggle Theme"
            >
              {mounted && theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-primary" />
              ) : (
                <Moon className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <SidebarNav />
        </div>

        {/* Footer & Logout */}
        <div className="px-4 mt-8 border-t border-border-subtle pt-6 space-y-4">
          <div className="flex items-center gap-3 px-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-hover text-white flex items-center justify-center font-bold text-sm shadow-[0_4px_12px_rgba(197,155,76,0.25)] transition-transform duration-300 hover:scale-105">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary uppercase tracking-wide">{username}</p>
              <span className="text-[10px] text-text-secondary block">Administrator</span>
            </div>
          </div>

          <AdminLogoutButton />
        </div>
      </aside>
    </>
  );
}
