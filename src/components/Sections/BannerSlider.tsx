"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface BannerItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  projectUrl: string | null;
  description: string | null;
  order: number;
}

interface BannerSliderProps {
  banners: BannerItem[];
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovering, setIsHovering] = useState(false);

  const handleNext = useCallback(() => {
    if (banners.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const handlePrev = useCallback(() => {
    if (banners.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Autoplay functionality (6 seconds interval, pauses on hover, resets on click)
  useEffect(() => {
    if (banners.length <= 1 || isHovering) return;
    const timer = setInterval(handleNext, 6000);
    return () => clearInterval(timer);
  }, [handleNext, banners.length, isHovering, currentIndex]);

  if (banners.length === 0) return null;

  // Unified spring transitions for high-end swiping feel
  const sliderSpring = { type: "spring" as const, stiffness: 220, damping: 28 };

  const imageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      scale: 1.05,
      opacity: 0,
    }),
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        x: sliderSpring,
        scale: { duration: 0.6, ease: "easeOut" as const },
        opacity: { duration: 0.4 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      scale: 0.95,
      opacity: 0,
      transition: {
        x: sliderSpring,
        scale: { duration: 0.5, ease: "easeIn" as const },
        opacity: { duration: 0.3 }
      }
    }),
  };

  const textContainerVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: sliderSpring,
        opacity: { duration: 0.35 },
        staggerChildren: 0.08,
        delayChildren: 0.05,
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      transition: {
        x: sliderSpring,
        opacity: { duration: 0.3 }
      }
    }),
  };

  const textItemVariants = {
    enter: {
      y: 15,
      opacity: 0,
    },
    center: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 18,
      }
    },
    exit: {
      y: -10,
      opacity: 0,
      transition: {
        duration: 0.2,
      }
    }
  };

  const currentBanner = banners[currentIndex];

  return (
    <section id="highlights" className="py-24 bg-bg-dark relative overflow-hidden transition-colors duration-300">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-6 relative">
          <h4 className="text-text-primary/[0.02] text-7xl md:text-9xl font-black absolute inset-0 select-none pointer-events-none flex justify-center items-center tracking-widest uppercase transition-colors duration-300">
            Showcase
          </h4>
          <h2 className="text-2xl md:text-4xl font-extrabold text-text-primary tracking-tight uppercase z-10 relative pt-6 md:pt-10 flex flex-col items-center gap-2">
            My Banners
            <span className="w-16 h-1 bg-primary rounded-full mt-2" />
          </h2>
        </div>

        {/* Section Description */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-text-secondary text-base font-light leading-relaxed">
            A showcase of custom graphic templates, business cards, and freshly deployed platform features.
          </p>
        </div>

        {/* Slider Window Container */}
        <div
          className="max-w-5xl mx-auto relative px-4 sm:px-12"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="glass-panel-premium w-full rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-2xl relative min-h-[400px] md:h-[420px]">
            {/* Left Column: Metadata & Details */}
            <div className="md:col-span-5 p-8 sm:p-10 flex flex-col justify-center text-left h-full relative overflow-hidden">
              <div className="grid grid-cols-1 grid-rows-1 items-center w-full">
                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={textContainerVariants}
                    className="col-start-1 row-start-1 space-y-5 w-full flex flex-col justify-center"
                  >
                    <div className="space-y-2.5">
                      {currentBanner.category && (
                        <motion.span
                          variants={textItemVariants}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary tracking-widest uppercase w-max"
                        >
                          {currentBanner.category}
                        </motion.span>
                      )}
                      <motion.h3
                        variants={textItemVariants}
                        className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight leading-tight uppercase"
                      >
                        {currentBanner.title}
                      </motion.h3>
                    </div>

                    {currentBanner.description && (
                      <motion.p
                        variants={textItemVariants}
                        className="text-text-secondary text-xs sm:text-sm font-light leading-relaxed line-clamp-4"
                      >
                        {currentBanner.description}
                      </motion.p>
                    )}

                    {currentBanner.projectUrl && (
                      <motion.div
                        variants={textItemVariants}
                        className="pt-2"
                      >
                        <a
                          href={currentBanner.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-primary-hover active:scale-[0.98] transition-all duration-300 shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                          Explore <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Visual Preview */}
            <div className="md:col-span-7 relative h-64 sm:h-80 md:h-[420px] w-full bg-black/5 overflow-hidden border-t md:border-t-0 md:border-l border-border-subtle shrink-0">
              <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                <motion.img
                  key={currentIndex}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  src={currentBanner.imageUrl}
                  alt={currentBanner.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/800x450?text=Banner+Graphic";
                  }}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1, x: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-border-subtle bg-bg-subtle hover:bg-primary hover:text-black text-text-primary flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-20 shadow-lg hidden sm:flex cursor-pointer active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, x: 4 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-border-subtle bg-bg-subtle hover:bg-primary hover:text-black text-text-primary flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-20 shadow-lg hidden sm:flex cursor-pointer active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </>
          )}

          {/* Dots Indicators */}
          {banners.length > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {banners.map((_, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx ? "w-8 bg-primary" : "w-2 bg-text-secondary/40 hover:bg-text-secondary/70"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
