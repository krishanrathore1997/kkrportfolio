import React from "react";
import { getPortfolioData } from "@/lib/data";

// Import UI Sections
import Header from "@/components/Sections/Header";
import Hero from "@/components/Sections/Hero";
import About from "@/components/Sections/About";
import Services from "@/components/Sections/Services";
import Skills from "@/components/Sections/Skills";
import Resume from "@/components/Sections/Resume";
import Portfolio from "@/components/Sections/Portfolio";
import Reviews from "@/components/Sections/Reviews";
import Contact from "@/components/Sections/Contact";
import Footer from "@/components/Sections/Footer";
import ShareWidget from "@/components/ShareWidget";

// Force Next.js to dynamically revalidate the page or perform SSR/ISR
export const revalidate = 60; // Revalidate every 60 seconds (Incremental Static Regeneration)

export default async function Home() {
  const { profile, services, skills, timeline, portfolio, reviews, heroSlides } = await getPortfolioData();

  const social = (profile.socialLinks as any) || {};

  return (
    <>
      {/* Header / Navigation */}
      <Header phone={profile.phone} />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero
          name={profile.name}
          title={profile.title}
          subtitle={profile.subtitle}
          heroSlides={heroSlides}
        />

        {/* About Me Section */}
        <About profile={profile} />

        {/* Services Section */}
        <Services services={services} />

        {/* Skills Section */}
        <Skills skills={skills} />

        {/* Resume Timeline Section */}
        <Resume timeline={timeline} />

        {/* Portfolios Grid Section */}
        <Portfolio portfolio={portfolio} />

        {/* Reviews Section */}
        <Reviews reviews={reviews} />

        {/* Contact Form Section */}
        <Contact
          email={profile.email}
          phone={profile.phone}
          address={profile.address}
          socialLinks={{
            linkedin: social.linkedin,
            whatsapp: social.whatsapp,
          }}
        />
      </main>

      {/* Footer & Floating Actions */}
      <Footer whatsappUrl={social.whatsapp || "#"} />
      <ShareWidget />
    </>
  );
}
