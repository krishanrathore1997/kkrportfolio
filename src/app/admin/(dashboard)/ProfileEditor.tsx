"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { updateProfile } from "../actions";
import ImageUploadField from "@/components/ImageUploadField";
import { Save, User, Link2, FileText, Briefcase, Search } from "lucide-react";

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
    metaDescription: initialProfile.metaDescription || "",
    keywords: initialProfile.keywords || "",
    socialLinks: {
      linkedin: initialProfile.socialLinks?.linkedin || "",
      whatsapp: initialProfile.socialLinks?.whatsapp || "",
      instagram: initialProfile.socialLinks?.instagram || "",
      facebook: initialProfile.socialLinks?.facebook || "",
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

    const isDark = document.documentElement.classList.contains("dark");
    const swalConfig = {
      background: isDark ? "#17191E" : "#ffffff",
      color: isDark ? "#F3F4F6" : "#1F2937",
    };

    if (res.success) {
      Swal.fire({
        title: "Success!",
        text: res.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        ...swalConfig,
      });
    } else {
      Swal.fire({
        title: "Failed!",
        text: res.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#C59B4C",
        ...swalConfig,
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
          <ImageUploadField
            label="Profile Portrait Image"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={(url) => setFormData(prev => ({ ...prev, avatarUrl: url }))}
            placeholder="e.g. /assets/img/krishan-portrait.jpg"
            required
            inputClassName="form-input-premium animate-reveal"
            labelClassName="form-label-premium"
          />
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
          <div className="space-y-1.5">
            <label className="form-label-premium">Instagram Profile URL</label>
            <input
              type="url"
              name="social_instagram"
              value={formData.socialLinks.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/username"
              className="form-input-premium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="form-label-premium">Facebook Profile URL</label>
            <input
              type="url"
              name="social_facebook"
              value={formData.socialLinks.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/username"
              className="form-input-premium"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: SEO METADATA */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
          <Search className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">SEO Metadata</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="form-label-premium">Meta Description</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description for search engines..."
              className="form-input-premium resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="form-label-premium">Keywords</label>
            <textarea
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              rows={3}
              placeholder="comma, separated, keywords, for, seo"
              className="form-input-premium resize-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: DETAILED BIO */}
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
