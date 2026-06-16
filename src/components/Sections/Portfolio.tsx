"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Eye, X } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  projectUrl: string;
}

interface PortfolioProps {
  portfolio: PortfolioItem[];
}

export default function Portfolio({ portfolio }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<{ type: "image" | "figma"; url: string } | null>(null);

  // Extract unique categories dynamically
  const categories = ["All", ...Array.from(new Set(portfolio.map((item) => item.category)))];

  // Helper to check if URL is a Figma prototype or file
  const isFigmaUrl = (url: string) => {
    return url && (url.includes("figma.com/file") || url.includes("figma.com/proto") || url.includes("figma.com/design"));
  };

  // Filter items
  const filteredItems = portfolio.filter((item) => {
    return activeFilter === "All" || item.category === activeFilter;
  });

  return (
    <section id="portfolio" className="py-24 bg-bg-dark relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute left-1/4 top-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16 relative">
          <h4 className="text-text-primary/[0.02] text-7xl md:text-9xl font-black absolute inset-0 select-none pointer-events-none flex justify-center items-center tracking-widest uppercase transition-colors duration-300">
            Portfolios
          </h4>
          <h2 className="text-2xl md:text-4xl font-extrabold text-text-primary tracking-tight uppercase z-10 relative pt-6 md:pt-10 flex flex-col items-center gap-2">
            My Portfolio
            <span className="w-16 h-1 bg-primary rounded-full mt-2" />
          </h2>
        </div>

        {/* Category Filters Container */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-12 max-w-4xl mx-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${activeFilter === category
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105 cursor-pointer"
                  : "bg-bg-subtle text-text-secondary hover:text-text-primary hover:bg-bg-subtle-hover cursor-pointer"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Dynamic Project Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.a
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45 }}
                key={item.id}
                href={item.projectUrl && item.projectUrl !== "#" ? item.projectUrl : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-3xl bg-bg-card border border-border-subtle overflow-hidden shadow-lg aspect-[4/3] flex flex-col justify-end cursor-pointer"
                onClick={(e) => {
                  // If they clicked a button specifically, don't trigger the card link redirect
                  const target = e.target as HTMLElement;
                  if (target.closest("button")) {
                    e.preventDefault();
                  } else if (!item.projectUrl || item.projectUrl === "#") {
                    e.preventDefault();
                    // Open lightbox as default click action if no projectUrl
                    if (isFigmaUrl(item.projectUrl)) {
                      setLightbox({ type: "figma", url: item.projectUrl });
                    } else {
                      setLightbox({ type: "image", url: item.imageUrl });
                    }
                  }
                }}
              >
                {/* Project Image */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'><rect width='600' height='450' fill='%2318181b'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'>Project Image</text></svg>";
                  }}
                />

                {/* Mobile Bottom Bar (visible only on mobile) */}
                <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 bg-black/75 backdrop-blur-md border-t border-white/10 z-20 flex justify-between items-center">
                  <div className="text-left min-w-0 pr-2">
                    <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                    <span className="text-[10px] text-primary uppercase font-bold tracking-wider">{item.category}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isFigmaUrl(item.projectUrl)) {
                          setLightbox({ type: "figma", url: item.projectUrl });
                        } else {
                          setLightbox({ type: "image", url: item.imageUrl });
                        }
                      }}
                      className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center active:bg-primary active:text-black transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {item.projectUrl && item.projectUrl !== "#" && (
                      <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Overlay (desktop hover only) */}
                <div className="hidden md:flex absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col justify-center items-center gap-4 z-10" />

                {/* Interactions Showcase (desktop hover only) */}
                <div className="hidden md:flex absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex-col justify-center items-center gap-4 text-center px-6">
                  <h3 className="text-xl font-bold text-white tracking-wide translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </h3>
                  <span className="text-xs text-primary font-medium uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {item.category}
                  </span>

                  {/* Buttons */}
                  <div className="flex gap-4 mt-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    {/* View Image Lightbox Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isFigmaUrl(item.projectUrl)) {
                          setLightbox({ type: "figma", url: item.projectUrl });
                        } else {
                          setLightbox({ type: "image", url: item.imageUrl });
                        }
                      }}
                      className="w-11 h-11 rounded-full bg-white/10 hover:bg-primary hover:text-white text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm shadow-md cursor-pointer"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {/* External Link Button */}
                    {item.projectUrl && item.projectUrl !== "#" && (
                      <span
                        className="w-11 h-11 rounded-full bg-white/10 hover:bg-primary hover:text-white text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm shadow-md"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </span>
                    )}
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Full-Screen Lightbox Portal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50 shadow-md"
            >
              <X className="w-6 h-6" />
            </button>

            <div
              className="w-full max-w-5xl max-h-[85vh] flex items-center justify-center relative"
              onClick={(e) => e.stopPropagation()} // Prevent click through closing
            >
              {lightbox.type === "figma" ? (
                <div className="w-full aspect-video bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <iframe
                    title="Figma Live Preview"
                    src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(lightbox.url)}`}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              ) : (
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  src={lightbox.url}
                  alt="Project Showcase"
                  className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
