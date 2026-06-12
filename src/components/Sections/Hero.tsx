"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Terminal, Send, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

interface HeroSlideItem {
  id: string;
  imageUrl: string;
  title: string;
  order: number;
}

interface HeroProps {
  name: string;
  title: string;
  subtitle: string;
  heroSlides: HeroSlideItem[];
}

export default function Hero({ name, title, subtitle, heroSlides }: HeroProps) {
  const words = [name, title, subtitle];
  const [wordIndex, setWordIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const slides = heroSlides.length > 0 ? heroSlides : [
    { id: "hs-fallback", imageUrl: "/assets/hero slider/slide-1.png", title: "Web Design Architecture", order: 1 }
  ];

  // Auto-play word loop
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 3200);
    return () => clearInterval(wordInterval);
  }, []);

  // Auto-play background/slider image loop
  useEffect(() => {
    if (slides.length <= 1) return;
    const slideInterval = setInterval(() => {
      handleNextSlide();
    }, 4500);
    return () => clearInterval(slideInterval);
  }, [slideIndex, slides.length]);

  const handlePrevSlide = () => {
    if (slides.length <= 1) return;
    setDirection(-1);
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    if (slides.length <= 1) return;
    setDirection(1);
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handleDotClick = (idx: number) => {
    setDirection(idx > slideIndex ? 1 : -1);
    setSlideIndex(idx);
  };

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  // Slide transition variants for sliding animations
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center bg-bg-dark bg-grid-pattern overflow-hidden pt-24 pb-16 transition-colors duration-300"
    >
      {/* Background Visual Enhancements & Glowing Light Leaks */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute right-10 bottom-10 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 z-10 relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[calc(100vh-160px)]">
        {/* Left Column: Personal Value Prop */}
        <div className="lg:col-span-7 space-y-6 text-left flex flex-col justify-center">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm w-fit shadow-[0_8px_16px_rgba(197,155,76,0.05)]"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-primary uppercase">
              Open for freelance projects & collaborations
            </span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-2">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-text-secondary text-sm sm:text-base font-bold uppercase tracking-widest block"
            >
              Creative & Scalable Digital Products
            </motion.span>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight leading-tight">
              Hi, I am <br />
              <div className="h-[48px] sm:h-[60px] md:h-[72px] relative overflow-hidden mt-1 select-none">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: 35, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -35, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 right-0 text-primary font-black drop-shadow-[0_2px_8px_rgba(197,155,76,0.1)] truncate"
                  >
                    {words[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>
          </div>

          {/* Subtitle / Description */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-text-primary uppercase tracking-wide">
              I help businesses & startups turn ideas into powerful <span className="text-primary">digital products</span>
            </h3>
            <p className="text-text-secondary text-xs sm:text-sm md:text-base max-w-xl font-light leading-relaxed">
              Building high-performance web applications, custom software backend engines, and fully automated business integrations using clean, structured code patterns.
            </p>
          </motion.div>

          {/* Core Focus Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-2.5 pt-2"
          >
            {[
              "Modern Design",
              "Clean Code",
              "Scalable Solutions",
              "Performance Focused",
              "On-Time Delivery",
            ].map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[10px] sm:text-xs text-text-secondary font-medium"
              >
                <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
          >
            <a
              href="#portfolio"
              onClick={(e) => handleScrollClick(e, "portfolio")}
              className="w-full sm:w-auto px-7 py-3.5 bg-primary text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-primary-hover active:scale-[0.98] transition-all duration-300 shadow-lg shadow-primary/20 text-center inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4" /> View My Work
            </a>
            <a
              href="#contact"
              onClick={(e) => handleScrollClick(e, "contact")}
              className="w-full sm:w-auto px-7 py-3.5 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-text-primary font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-black/10 dark:hover:bg-white/10 hover:border-primary/30 transition-all duration-300 text-center inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-primary" /> Let's Connect
            </a>
          </motion.div>
        </div>

        {/* Right Column: Premium Image Showcase Slider */}
        <div className="lg:col-span-5 flex justify-center items-center relative mt-8 lg:mt-0 w-full">
          {/* Subtle glow sphere behind mockup */}
          <div className="absolute w-[280px] h-[280px] rounded-full bg-primary/10 blur-[60px] -z-10 pointer-events-none" />

          {/* Slideshow Container Frame */}
          <div className="w-full max-w-lg glass-panel rounded-3xl border border-black/5 dark:border-white/10 shadow-2xl overflow-hidden backdrop-blur-md relative group">
            {/* Slider window titlebar */}
            <div className="bg-black/5 dark:bg-white/5 px-5 py-3.5 border-b border-black/5 dark:border-white/10 flex items-center justify-between select-none">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              </div>
              <div className="text-[10px] text-text-secondary font-bold font-mono tracking-wider flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                {slides[slideIndex]?.title}
              </div>
              <span className="w-4" />
            </div>

            {/* Slider Image Viewer */}
            <div className="relative aspect-[4/3] w-full bg-black/5 overflow-hidden flex items-center justify-center">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.img
                  key={slideIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 }
                  }}
                  src={slides[slideIndex]?.imageUrl}
                  alt={slides[slideIndex]?.title}
                  className="absolute w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation Arrows (visible on hover) */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/40 hover:bg-primary hover:text-black text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg duration-300"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/40 hover:bg-primary hover:text-black text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg duration-300"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Navigation Dots Overlay */}
            {slides.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 select-none z-20">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      slideIndex === idx ? "bg-primary w-6" : "bg-white/40 hover:bg-white/80 w-2"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Down arrow anchor */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <a
          href="#about"
          onClick={(e) => handleScrollClick(e, "about")}
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border-subtle bg-bg-subtle hover:bg-bg-subtle-hover text-text-primary hover:text-primary transition-all duration-300 animate-float shadow-lg shadow-black/5 cursor-pointer"
          aria-label="Scroll to about me section"
        >
          <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
      </div>

      {/* Diagonal Bottom Shape */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] fill-current text-bg-dark pointer-events-none transition-colors duration-300">
        <svg viewBox="0 0 1920 120" preserveAspectRatio="none" className="relative block w-full h-[30px] md:h-[80px]">
          <polygon points="0,120 1920,120 1920,0 0,100" />
        </svg>
      </div>
    </section>
  );
}
