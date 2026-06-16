"use client";

import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

interface ServicesProps {
  services: ServiceItem[];
}

export default function Services({ services }: ServicesProps) {
  // Safe helper to render Lucide icon dynamically
  const renderIcon = (iconName: string) => {
    // Standard lookup or fallback
    const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName] || Icons.HelpCircle;
    return <IconComponent className="w-8 h-8" />;
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section id="services" className="py-24 bg-bg-card relative overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute right-0 bottom-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16 relative">
          <h4 className="text-text-primary/[0.02] text-7xl md:text-9xl font-black absolute inset-0 select-none pointer-events-none flex justify-center items-center tracking-widest uppercase transition-colors duration-300">
            Services
          </h4>
          <h2 className="text-2xl md:text-4xl font-extrabold text-text-primary tracking-tight uppercase z-10 relative pt-6 md:pt-10 flex flex-col items-center gap-2">
            My Services
            <span className="w-16 h-1 bg-primary rounded-full mt-2" />
          </h2>
        </div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group p-8 rounded-3xl bg-bg-dark border border-border-subtle shadow-md hover:shadow-primary/5 hover:border-primary/25 transition-all duration-300 relative overflow-hidden"
            >
              {/* Card glowing gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-bg-subtle flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6">
                {renderIcon(service.iconName)}
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-text-primary mb-4 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-text-secondary text-sm font-light leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
