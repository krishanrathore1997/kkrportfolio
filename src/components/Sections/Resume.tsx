"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

interface TimelineItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  duration: string;
  description?: string | null;
}

interface ResumeProps {
  timeline: TimelineItem[];
}

export default function Resume({ timeline }: ResumeProps) {
  const experiences = timeline.filter((item) => item.type === "experience");
  const education = timeline.filter((item) => item.type === "education");

  const cardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (idx: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: idx * 0.1,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  const rightCardVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: (idx: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: idx * 0.1,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <section id="resume" className="py-24 bg-bg-card relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute right-0 top-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-20 relative">
          <h4 className="text-text-primary/[0.02] text-7xl md:text-9xl font-black absolute inset-0 select-none pointer-events-none flex justify-center items-center tracking-widest uppercase transition-colors duration-300">
            Resume
          </h4>
          <h2 className="text-2xl md:text-4xl font-extrabold text-text-primary tracking-tight uppercase z-10 relative pt-6 md:pt-10 flex flex-col items-center gap-2">
            My Resume
            <span className="w-16 h-1 bg-primary rounded-full mt-2" />
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Experience Column */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 border-b border-border-subtle pb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(166,124,55,0.15)]">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary tracking-wide">Experience</h3>
            </div>

            {/* Timeline Line */}
            <div className="relative border-l border-border-subtle pl-8 ml-6 space-y-12">
              {experiences.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={cardVariants}
                  className="relative group"
                >
                  {/* Timeline Dot */}
                  <span className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-bg-card border-2 border-border-subtle flex items-center justify-center group-hover:border-primary transition-colors duration-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-text-secondary/40 group-hover:bg-primary transition-colors duration-300" />
                  </span>

                  {/* Content Panel */}
                  <div className="glass-panel-premium p-6 rounded-2xl group-hover:border-primary/10 hover:shadow-cardGlow transition-all duration-300">
                    <span className="text-xs font-semibold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full tracking-wider inline-block mb-3">
                      {exp.duration}
                    </span>
                    <h4 className="text-xl font-bold text-text-primary tracking-wide group-hover:text-primary transition-colors">
                      {exp.title}
                    </h4>
                    <h5 className="text-sm font-medium text-text-secondary mt-1">
                      {exp.subtitle}
                    </h5>
                    {exp.description && (
                      <p className="text-text-secondary text-sm font-light mt-4 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 border-b border-border-subtle pb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(166,124,55,0.15)]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary tracking-wide">Education</h3>
            </div>

            {/* Timeline Line */}
            <div className="relative border-l border-border-subtle pl-8 ml-6 space-y-12">
              {education.map((edu, idx) => (
                <motion.div
                  key={edu.id}
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={rightCardVariants}
                  className="relative group"
                >
                  {/* Timeline Dot */}
                  <span className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-bg-card border-2 border-border-subtle flex items-center justify-center group-hover:border-primary transition-colors duration-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-text-secondary/40 group-hover:bg-primary transition-colors duration-300" />
                  </span>

                  {/* Content Panel */}
                  <div className="glass-panel-premium p-6 rounded-2xl group-hover:border-primary/10 hover:shadow-cardGlow transition-all duration-300">
                    <span className="text-xs font-semibold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full tracking-wider inline-block mb-3">
                      {edu.duration}
                    </span>
                    <h4 className="text-xl font-bold text-text-primary tracking-wide group-hover:text-primary transition-colors">
                      {edu.title}
                    </h4>
                    <h5 className="text-sm font-medium text-text-secondary mt-1">
                      {edu.subtitle}
                    </h5>
                    {edu.description && (
                      <p className="text-text-secondary text-sm font-light mt-4 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
