"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { updateProfile } from "../actions";
import { Save, User, MapPin, Globe, Phone, Mail, Link2, FileText, Briefcase } from "lucide-react";

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
        confirmButtonColor: "#C59B4C",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel-premium p-6 sm:p-10 rounded-3xl space-y-8 shadow-xl">

      {/* SECTION 1: PERSONAL IDENTITY */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Personal Identity</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="form-label-premium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Krishan Kumar Rathore"
              className="form-input-premium"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="form-label-premium">Professional Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Full Stack Developer"
              className="form-input-premium"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="form-label-premium">Job Designation</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Software Engineer"
              className="form-input-premium"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="form-label-premium">Profile Portrait Image URL</label>
            <input
              type="text"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              placeholder="e.g. /assets/img/krishan-portrait.jpg"
              className="form-input-premium"
              required
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="form-label-premium">CV Download Link</label>
            <input
              type="text"
              name="cvUrl"
              value={formData.cvUrl}
              onChange={handleChange}
              placeholder="e.g. /assets/krishan-cv.pdf"
              className="form-input-premium"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: CONTACT & DETAILS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Contact & Professional Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="form-label-premium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className="form-input-premium"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="form-label-premium">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9106035651"
              className="form-input-premium"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="form-label-premium">Office/Home Location</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ahmedabad, Gujrat"
              className="form-input-premium"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="form-label-premium">Languages Spoken</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="English, Hindi, Gujrati"
              className="form-input-premium"
              required
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="form-label-premium">Freelance Status</label>
            <input
              type="text"
              name="freelance"
              value={formData.freelance}
              onChange={handleChange}
              placeholder="Available / Busy"
              className="form-input-premium"
              required
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: SOCIAL LINKS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
          <Link2 className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Social Links</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="form-label-premium">LinkedIn Profile URL</label>
            <input
              type="url"
              name="social_linkedin"
              value={formData.socialLinks.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="form-input-premium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="form-label-premium">WhatsApp Contact URL</label>
            <input
              type="url"
              name="social_whatsapp"
              value={formData.socialLinks.whatsapp}
              onChange={handleChange}
              placeholder="https://wa.me/91XXXXXXXXXX"
              className="form-input-premium"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: DETAILED BIO */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Biography</h3>
        </div>
        <div className="space-y-1.5">
          <label className="form-label-premium">Detailed Bio Paragraph</label>
          <textarea
            name="bioDescription"
            value={formData.bioDescription}
            onChange={handleChange}
            rows={5}
            placeholder="Write a brief professional intro..."
            className="form-input-premium resize-none animate-reveal"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-black/5 dark:border-white/5 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-primary-hover active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/10"
        >
          <Save className="w-4 h-4 text-black" />
          {saving ? "Saving Profile..." : "Save Bio Settings"}
        </button>
      </div>
    </form>
  );
}
