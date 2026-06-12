"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface ReviewItem {
  id: string;
  clientName: string;
  designation: string;
  reviewText: string;
  imageUrl?: string;
}

interface ReviewsProps {
  reviews: ReviewItem[];
}

export default function Reviews({ reviews }: ReviewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  // Autoplay functionality
  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <section id="reviews" className="py-24 bg-bg-card relative overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute right-1/4 top-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16 relative">
          <h4 className="text-text-primary/[0.02] text-7xl md:text-9xl font-black absolute inset-0 select-none pointer-events-none flex justify-center items-center tracking-widest uppercase transition-colors duration-300">
            Reviews
          </h4>
          <h2 className="text-2xl md:text-4xl font-extrabold text-text-primary tracking-tight uppercase z-10 relative pt-6 md:pt-10 flex flex-col items-center gap-2">
            Reviews
            <span className="w-16 h-1 bg-primary rounded-full mt-2" />
          </h2>
        </div>

        {/* Carousel Slider */}
        <div className="max-w-4xl mx-auto relative px-4 sm:px-12">
          <div className="overflow-hidden min-h-[320px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="glass-panel-premium p-8 sm:p-12 rounded-3xl relative text-center flex flex-col items-center gap-6"
              >
                {/* Quote Icon Overlay */}
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(166,124,55,0.15)] mb-4">
                  <Quote className="w-8 h-8 fill-primary" />
                </div>

                {/* Testimonial Text */}
                <p className="text-text-primary text-base sm:text-lg font-light leading-relaxed italic max-w-2xl">
                  {reviews[currentIndex].reviewText}
                </p>

                {/* Divider Line */}
                <div className="w-12 h-px bg-border-subtle" />

                {/* Reviewer Details */}
                <div className="flex items-center gap-4 text-left">
                  {reviews[currentIndex].imageUrl && (
                    <img
                      src={reviews[currentIndex].imageUrl}
                      alt={reviews[currentIndex].clientName}
                      className="w-12 h-12 rounded-full object-cover border border-white/10"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${reviews[currentIndex].clientName}`;
                      }}
                    />
                  )}
                  <div>
                    <h4 className="text-base font-bold text-text-primary tracking-wide">
                      {reviews[currentIndex].clientName}
                    </h4>
                    <span className="text-xs text-text-secondary">
                      {reviews[currentIndex].designation}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-border-subtle bg-bg-subtle hover:bg-primary hover:text-white text-text-primary flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-20 shadow-lg hidden sm:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-border-subtle bg-bg-subtle hover:bg-primary hover:text-white text-text-primary flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-20 shadow-lg hidden sm:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slider Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-8 bg-primary" : "w-2.5 bg-text-secondary/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
