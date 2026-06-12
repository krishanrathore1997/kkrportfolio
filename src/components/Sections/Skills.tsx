"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Server,
  Database,
  Layers,
  Terminal,
  GitBranch,
  Globe,
  Cpu
} from "lucide-react";

interface SkillItem {
  id: string;
  name: string;
  percentage: number;
  category: string;
}

interface SkillsProps {
  skills: SkillItem[];
}

// Icon mapping helper
const getSkillIcon = (name: string, category: string) => {
  const normalizedName = name.toLowerCase();
  const normalizedCategory = category.toLowerCase();

  if (normalizedName.includes("html") || normalizedName.includes("css")) {
    return Layers;
  }
  if (
    normalizedName.includes("js") ||
    normalizedName.includes("ts") ||
    normalizedName.includes("javascript") ||
    normalizedName.includes("typescript")
  ) {
    return Terminal;
  }
  if (
    normalizedName.includes("react") ||
    normalizedName.includes("vue") ||
    normalizedName.includes("next")
  ) {
    return Code2;
  }
  if (normalizedName.includes("laravel")) {
    return Server;
  }
  if (
    normalizedName.includes("node") ||
    normalizedName.includes("nest")
  ) {
    return Database;
  }
  if (normalizedName.includes("git")) {
    return GitBranch;
  }
  if (
    normalizedName.includes("vps") ||
    normalizedName.includes("host") ||
    normalizedName.includes("deploy")
  ) {
    return Globe;
  }

  // Mappings by category fallback
  if (normalizedCategory === "frontend") {
    return Layers;
  }
  if (normalizedCategory === "backend") {
    return Server;
  }
  if (normalizedCategory === "tools") {
    return Cpu;
  }

  return Cpu;
};

// Official Developer Logo URL helper (Devicon CDN)
const getSkillLogoUrl = (name: string) => {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("html")) {
    return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg";
  }
  if (normalizedName.includes("css")) {
    return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg";
  }
  if (normalizedName.includes("js / ts") || normalizedName.includes("javascript")) {
    return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg";
  }
  if (normalizedName.includes("ts") || normalizedName.includes("typescript")) {
    return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg";
  }
  if (normalizedName.includes("react")) {
    return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg";
  }
  if (normalizedName.includes("next")) {
    return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg";
  }
  if (normalizedName.includes("vue")) {
    return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg";
  }
  if (normalizedName.includes("laravel")) {
    return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg";
  }
  if (normalizedName.includes("node")) {
    return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg";
  }
  if (normalizedName.includes("nest")) {
    return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg";
  }
  if (normalizedName.includes("git")) {
    return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg";
  }
  if (normalizedName.includes("vps") || normalizedName.includes("hosting") || normalizedName.includes("deploy")) {
    return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg";
  }

  return null;
};

interface SkillCardProps {
  skill: SkillItem;
}

function SkillCard({ skill }: SkillCardProps) {
  const [imageError, setImageError] = useState(false);
  const logoUrl = getSkillLogoUrl(skill.name);
  const IconComponent = getSkillIcon(skill.name, skill.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.25 }}
      className="glass-panel-premium p-4 px-5 rounded-2xl border border-border-subtle flex items-center gap-4 group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(197,155,76,0.1)]"
    >
      <div className="w-10 h-10 rounded-xl bg-bg-subtle group-hover:bg-primary/10 flex items-center justify-center text-primary transition-all duration-300 shadow-sm shrink-0 overflow-hidden">
        {logoUrl && !imageError ? (
          <img
            src={logoUrl}
            alt={skill.name}
            className="w-6 h-6 object-contain group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <IconComponent className="w-5 h-5 text-primary group-hover:text-primary-hover transition-colors" />
        )}
      </div>
      <div className="space-y-0.5 min-w-0">
        <h4 className="text-text-primary text-sm font-semibold truncate group-hover:text-primary transition-colors duration-300">
          {skill.name}
        </h4>
        <span className="text-[9px] text-text-secondary tracking-widest uppercase font-medium block">
          {skill.category}
        </span>
      </div>
    </motion.div>
  );
}

export default function Skills({ skills }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Frontend", "Backend", "Tools"];

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter(
          (skill) =>
            skill.category.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <section id="skills" className="py-24 bg-bg-dark relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-6 relative">
          <h4 className="text-text-primary/[0.02] text-7xl md:text-9xl font-black absolute inset-0 select-none pointer-events-none flex justify-center items-center tracking-widest uppercase transition-colors duration-300">
            Skills
          </h4>
          <h2 className="text-2xl md:text-4xl font-extrabold text-text-primary tracking-tight uppercase z-10 relative pt-6 md:pt-10 flex flex-col items-center gap-2">
            My Skills
            <span className="w-16 h-1 bg-primary rounded-full mt-2" />
          </h2>
        </div>

        {/* Section Description */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-text-secondary text-base font-light leading-relaxed">
            I specialize in developing robust and scalable custom web applications. Represented below is a visualization of my experience and level of proficiency in frontend frameworks, backend architectures, and developer tools.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-16 max-w-lg mx-auto">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 relative z-10 ${
                  isActive
                    ? "text-white"
                    : "text-text-secondary hover:text-text-primary bg-bg-subtle/50 hover:bg-bg-subtle"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-[0_4px_12px_rgba(197,155,76,0.3)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {category}
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
