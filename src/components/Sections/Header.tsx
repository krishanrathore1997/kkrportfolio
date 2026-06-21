"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X, Sun, Moon } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "#home", id: "home" },
  { name: "About", href: "#about", id: "about" },
  { name: "Services", href: "#services", id: "services" },
  { name: "Resume", href: "#resume", id: "resume" },
  { name: "Portfolio", href: "#portfolio", id: "portfolio" },
  { name: "Contact", href: "#contact", id: "contact" },
];

interface HeaderProps {
  phone: string;
}

export default function Header({ phone }: HeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      // Sticky header
      if (window.scrollY >= 20) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      // Active link highlighting
      const scrollPosition = window.scrollY + 200;
      for (const link of NAV_LINKS) {
        const element = document.getElementById(link.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(link.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <header
      className={`fixed glass-panel top-0 left-0 w-full z-50 transition-all duration-300 ${isSticky
        ? "py-4 shadow-sm border-b"
        : "py-6 border-b border-transparent"
        }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <Link
          href="#home"
          onClick={(e) => handleLinkClick(e, "home")}
          className="flex items-center gap-3 group"
        >
          <span className="relative flex h-[56px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-105">
            <img
              src={theme == "light" ? "/assets/img/white-logo.png" : "/assets/img/dark-logo.png"}
              alt="build with Krish logo"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'><rect width='150' height='150' fill='%23c59b4c'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='36' font-weight='bold' fill='%23ffffff'>KKR</text></svg>";
              }}
            />
          </span>
          <span className="font-bold text-base md:text-lg tracking-wider text-text-primary uppercase group-hover:text-primary transition-colors">
            build with Krish
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-primary ${activeSection === link.id ? "text-primary" : "text-text-secondary"
                    }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Quick Call */}
          <div className="flex items-center gap-2 border-l border-border-subtle pl-6">
            <Phone className="w-4 h-4 text-primary" />
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="text-xs font-semibold text-text-primary hover:text-primary transition-colors duration-300"
            >
              {phone}
            </a>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-bg-subtle text-text-primary hover:text-primary transition-colors duration-300 cursor-pointer ml-2"
            aria-label="Toggle Theme"
          >
            {!mounted ? (
              <Moon className="w-4 h-4" />
            ) : theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-primary" />
            )}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-text-primary hover:text-primary transition-colors focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-bg-dark border-b border-border-subtle py-6 px-4 animate-reveal">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  className={`block text-base py-2 transition-colors duration-300 ${activeSection === link.id ? "text-primary font-semibold" : "text-text-secondary"
                    }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-border-subtle">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <a href={`tel:${phone}`} className="text-sm font-semibold text-text-primary">
                {phone}
              </a>
            </div>

            {/* Theme switcher */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-bg-subtle text-text-primary hover:text-primary transition-colors duration-300 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {!mounted ? (
                <Moon className="w-5 h-5" />
              ) : theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
