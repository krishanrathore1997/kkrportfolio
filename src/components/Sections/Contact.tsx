"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Swal from "sweetalert2";
import { submitContactForm } from "@/lib/actions";

interface ContactProps {
  email: string;
  phone: string;
  address: string;
  socialLinks: {
    linkedin?: string;
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
  };
}

export default function Contact({ email, phone, address, socialLinks }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      Swal.fire({
        title: "Warning!",
        text: "Please fill out all the fields.",
        icon: "warning",
        background: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#17191E" : "#ffffff",
        color: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#F3F4F6" : "#1F2937",
        confirmButtonColor: "#C59B4C",
      });
      return;
    }

    setIsSubmitting(true);

    const result = await submitContactForm(formData);

    setIsSubmitting(false);

    if (result.success) {
      Swal.fire({
        title: "Form Submitted!",
        text: result.message || "Thank you! I will get back to you shortly.",
        icon: "success",
        background: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#17191E" : "#ffffff",
        color: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#F3F4F6" : "#1F2937",
        timer: 3000,
        showConfirmButton: false,
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } else {
      Swal.fire({
        title: "Error!",
        text: result.message || "An error occurred during submission. Please try again.",
        icon: "error",
        background: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#17191E" : "#ffffff",
        color: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#F3F4F6" : "#1F2937",
        confirmButtonColor: "#C59B4C",
      });
    }
  };

  return (
    <section id="contact" className="py-24 bg-bg-dark relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute left-0 bottom-0 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-16 relative">
          <h4 className="text-text-primary/[0.02] text-7xl md:text-9xl font-black absolute inset-0 select-none pointer-events-none flex justify-center items-center tracking-widest uppercase transition-colors duration-300">
            Contact Me
          </h4>
          <h2 className="text-2xl md:text-4xl font-extrabold text-text-primary tracking-tight uppercase z-10 relative pt-6 md:pt-10 flex flex-col items-center gap-2">
            Contact Me
            <span className="w-16 h-1 bg-primary rounded-full mt-2" />
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-6xl mx-auto">
          {/* Contact Form Column */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl font-bold text-text-primary tracking-wide">Just say Hello</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-5 py-4 rounded-xl bg-bg-subtle border border-border-subtle text-text-primary text-sm placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full px-5 py-4 rounded-xl bg-bg-subtle border border-border-subtle text-text-primary text-sm placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                className="w-full px-5 py-4 rounded-xl bg-bg-subtle border border-border-subtle text-text-primary text-sm placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder="Your Message"
                className="w-full px-5 py-4 rounded-xl bg-bg-subtle border border-border-subtle text-text-primary text-sm placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                required
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:bg-primary/70 shadow-lg shadow-primary/10 cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Send Message"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-text-primary tracking-wide mb-4">Contact Info</h3>
              <p className="text-text-secondary text-sm font-light leading-relaxed">
                Feel free to reach out to me for web development services, project discussions, freelance availability, or just to say hello. I will get back to you within 24 hours.
              </p>
            </div>

            {/* Info details */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-bg-subtle flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-text-secondary uppercase tracking-wider block font-semibold">
                    Email
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="text-text-primary text-sm font-semibold hover:text-primary transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-bg-subtle flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-text-secondary uppercase tracking-wider block font-semibold">
                    Phone
                  </span>
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="text-text-primary text-sm font-semibold hover:text-primary transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-bg-subtle flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-text-secondary uppercase tracking-wider block font-semibold">
                    Address
                  </span>
                  <span className="text-text-primary text-sm font-semibold block leading-tight">
                    {address}
                  </span>
                </div>
              </div>
            </div>

            {/* Socials Connection */}
            <div className="pt-6 border-t border-border-subtle space-y-4">
              <h4 className="text-base font-bold text-text-primary tracking-wide">
                Connect with my social channels
              </h4>
              <div className="flex flex-wrap gap-4">
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-subtle hover:bg-primary hover:text-white text-text-primary text-xs font-semibold uppercase tracking-wider transition-all duration-300 border border-border-subtle shadow-md"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
                {socialLinks.whatsapp && (
                  <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-subtle hover:bg-[#25D366] hover:text-white text-text-primary text-xs font-semibold uppercase tracking-wider transition-all duration-300 border border-border-subtle shadow-md"
                  >
                    {/* SVG Whatsapp Icon */}
                    <svg
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.835-2.267c1.554.921 3.193 1.407 4.908 1.408 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.865 4.412 14.39 3.38 11.758 3.38c-5.437 0-9.861 4.42-9.866 9.865-.001 1.83.483 3.61 1.401 5.163l-.99 3.61 3.733-.978zM17.51 15.68c-.287-.144-1.702-.84-1.965-.936-.264-.096-.456-.144-.648.144-.192.288-.744.936-.912 1.128-.168.192-.336.216-.624.072-1.359-.68-2.34-1.196-3.23-2.73-.235-.406-.05-.623.094-.766.13-.13.287-.336.43-.504.145-.168.193-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.234-.564-.47-.487-.648-.496-.168-.009-.36-.009-.552-.009-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.4s1.032 2.784 1.176 2.976c.144.192 2.031 3.1 4.921 4.352.687.297 1.224.474 1.642.607.69.22 1.32.19 1.816.116.553-.084 1.702-.696 1.942-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.216-.552-.36z" />
                    </svg>
                    WhatsApp
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-subtle hover:bg-[#E1306C] hover:text-white text-text-primary text-xs font-semibold uppercase tracking-wider transition-all duration-300 border border-border-subtle shadow-md"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    Instagram
                  </a>
                )}
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-subtle hover:bg-[#1877F2] hover:text-white text-text-primary text-xs font-semibold uppercase tracking-wider transition-all duration-300 border border-border-subtle shadow-md"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
