"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { updateProfile } from "../actions";
import { Save } from "lucide-react";

interface ProfileEditorProps {
  initialProfile: any;
}

export default function ProfileEditor({ initialProfile }: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    name: initialProfile.name || "",
    title: initialProfile.title || "",
    subtitle: initialProfile.subtitle || "",
    bioDescription: initialProfile.bioDescription || "",
    phone: initialProfile.phone || "",
    email: initialProfile.email || "",
    address: initialProfile.address || "",
    language: initialProfile.language || "",
    freelance: initialProfile.freelance || "",
    cvUrl: initialProfile.cvUrl || "",
    avatarUrl: initialProfile.avatarUrl || "",
    socialLinks: {
      linkedin: initialProfile.socialLinks?.linkedin || "",
      whatsapp: initialProfile.socialLinks?.whatsapp || "",
    },
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("social_")) {
      const field = name.replace("social_", "");
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await updateProfile(formData);

    setSaving(false);

    if (res.success) {
      Swal.fire({
        title: "Success!",
        text: res.message,
        icon: "success",
        background: "#ffffff",
        color: "#1F2937",
        timer: 3000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Failed!",
        text: res.message || "Something went wrong.",
        icon: "error",
        background: "#ffffff",
        color: "#1F2937",
        confirmButtonColor: "#D4AF37",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary tracking-wide">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Krishan Kumar Rathore"
            className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors"
            required
          />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary tracking-wide">Professional Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Full Stack Developer"
            className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors"
            required
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary tracking-wide">Job Designation</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Software Engineer"
            className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors"
            required
          />
        </div>

        {/* CV Link */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary tracking-wide">CV Download Link</label>
          <input
            type="text"
            name="cvUrl"
            value={formData.cvUrl}
            onChange={handleChange}
            placeholder="e.g. /assets/krishan-cv.pdf"
            className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Profile Picture URL */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary tracking-wide">Profile Portrait Image URL</label>
          <input
            type="text"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            placeholder="e.g. /assets/img/krishan-portrait.jpg"
            className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary tracking-wide">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary tracking-wide">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9106035651"
            className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors"
            required
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary tracking-wide">Office/Home Location</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Ahmedabad, Gujrat"
            className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors"
            required
          />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary tracking-wide">Languages Spoken</label>
          <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder="English, Hindi, Gujrati"
            className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors"
            required
          />
        </div>

        {/* Freelance Status */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary tracking-wide">Freelance Status</label>
          <input
            type="text"
            name="freelance"
            value={formData.freelance}
            onChange={handleChange}
            placeholder="Available / Busy"
            className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors"
            required
          />
        </div>

        {/* Social - LinkedIn */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary tracking-wide">LinkedIn Profile URL</label>
          <input
            type="url"
            name="social_linkedin"
            value={formData.socialLinks.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Social - WhatsApp */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary tracking-wide">WhatsApp Contact URL</label>
          <input
            type="url"
            name="social_whatsapp"
            value={formData.socialLinks.whatsapp}
            onChange={handleChange}
            placeholder="https://wa.me/91XXXXXXXXXX"
            className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Bio Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text-primary tracking-wide">Detailed Bio Paragraph</label>
        <textarea
          name="bioDescription"
          value={formData.bioDescription}
          onChange={handleChange}
          rows={5}
          placeholder="Write a brief professional intro..."
          className="w-full px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
          required
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-black/5 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-xl hover:bg-primary-hover active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/10"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving Profile..." : "Save Bio Settings"}
        </button>
      </div>
    </form>
  );
}
