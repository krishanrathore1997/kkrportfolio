"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Globe, Briefcase, Download } from "lucide-react";

interface AboutProps {
  profile: {
    name: string;
    title: string;
    subtitle: string;
    bioDescription: string;
    phone: string;
    email: string;
    address: string;
    language: string;
    freelance: string;
    cvUrl: string;
    avatarUrl: string;
  };
}

export default function About({ profile }: AboutProps) {
  const detailItems = [
    { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, "")}` },
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: MapPin, label: "From", value: profile.address },
    { icon: Globe, label: "Language", value: profile.language },
    { icon: Briefcase, label: "Freelance", value: profile.freelance },
  ];

  return (
    <section id="about" className="py-24 bg-bg-dark relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16 relative">
          <h4 className="text-text-primary/[0.03] text-7xl md:text-9xl font-black absolute inset-0 select-none pointer-events-none flex justify-center items-center tracking-widest uppercase transition-colors duration-300">
            About Me
          </h4>
          <h2 className="text-2xl md:text-4xl font-extrabold text-text-primary tracking-tight uppercase z-10 relative pt-6 md:pt-10 flex flex-col items-center gap-2">
            About Me
            <span className="w-16 h-1 bg-primary rounded-full mt-2" />
          </h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="glass-panel-premium p-6 sm:p-10 md:p-12 rounded-3xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Premium Profile Photo Frame */}
              <div className="lg:col-span-5 flex justify-center relative w-full">
                {/* Glow ring under image */}
                <div className="absolute w-[220px] h-[220px] rounded-full bg-primary/10 blur-[45px] -z-10 pointer-events-none" />

                <div className="relative group w-full max-w-[320px] aspect-[3/4] rounded-3xl overflow-hidden glass-panel border border-black/5 dark:border-white/10 shadow-2xl flex items-center justify-center bg-black/5">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'><rect width='600' height='800' fill='%2318181b'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='32' fill='%239ca3af'>Profile Image</text></svg>";
                    }}
                  />
                </div>
              </div>

              {/* Right Column: Profile Bio Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-black text-text-primary">
                    I&apos;m <span className="text-primary">{profile.name}</span>
                  </h3>
                  <h4 className="text-sm md:text-base text-text-secondary font-bold uppercase tracking-wider">
                    {profile.title} / {profile.subtitle}
                  </h4>
                </div>

                <p className="text-text-secondary leading-relaxed text-sm md:text-base font-light">
                  {profile.bioDescription}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border-subtle">
                  {detailItems.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3.5 group">
                        <div className="w-9 h-9 rounded-xl bg-bg-subtle flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <IconComponent className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-bold">
                            {item.label}
                          </span>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-text-primary text-xs sm:text-sm font-medium hover:text-primary transition-colors"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <span className="text-text-primary text-xs sm:text-sm font-medium">
                              {item.value}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Download Resume Button */}
                <div className="pt-6">
                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-primary-hover hover:scale-105 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-primary/15 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download CV
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
