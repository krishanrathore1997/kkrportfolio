"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { addBanner, updateBanner, deleteBanner } from "../../actions";
import ImageUploadField from "@/components/ImageUploadField";
import { Plus, Edit2, Trash2, Save, X, Sparkles, ExternalLink } from "lucide-react";

interface BannerItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  projectUrl: string | null;
  description: string | null;
  order: number;
}

interface BannersEditorProps {
  initialBanners: BannerItem[];
}

export default function BannersEditor({ initialBanners }: BannersEditorProps) {
  const [banners, setBanners] = useState<BannerItem[]>(initialBanners);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    imageUrl: "",
    projectUrl: "",
    description: "",
    order: 0,
  });

  const getSwalConfig = () => {
    const isDark = document.documentElement.classList.contains("dark");
    return {
      background: isDark ? "#17191E" : "#ffffff",
      color: isDark ? "#F3F4F6" : "#1F2937",
    };
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "General",
      imageUrl: "",
      projectUrl: "",
      description: "",
      order: 0,
    });
    setEditingId(null);
  };

  const handleEditClick = (banner: BannerItem) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      category: banner.category,
      imageUrl: banner.imageUrl,
      projectUrl: banner.projectUrl || "",
      description: banner.description || "",
      order: banner.order,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      ...formData,
      projectUrl: formData.projectUrl || null,
      description: formData.description || null,
    };

    const swalConfig = getSwalConfig();

    try {
      if (editingId) {
        // Update
        const res = await updateBanner(editingId, dataToSend);
        if (res.success) {
          setBanners((prev) =>
            prev
              .map((b) => (b.id === editingId ? { ...b, ...dataToSend } : b))
              .sort((a, b) => a.order - b.order)
          );
          Swal.fire({
            title: "Success!",
            text: "Banner updated successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            ...swalConfig,
          });
          resetForm();
        } else {
          throw new Error(res.message);
        }
      } else {
        // Create
        const res = await addBanner(dataToSend);
        if (res.success && res.data) {
          setBanners((prev) =>
            [...prev, res.data]
              .sort((a, b) => a.order - b.order)
          );
          Swal.fire({
            title: "Success!",
            text: "Banner added successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            ...swalConfig,
          });
          resetForm();
        } else {
          throw new Error(res.message || "Failed to create banner.");
        }
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to save banner.",
        icon: "error",
        confirmButtonColor: "#C59B4C",
        ...swalConfig,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const swalConfig = getSwalConfig();
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This banner will be permanently deleted from the slider.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C59B4C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      ...swalConfig,
    });

    if (confirm.isConfirmed) {
      setLoading(true);
      try {
        const res = await deleteBanner(id);
        if (res.success) {
          setBanners((prev) => prev.filter((b) => b.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Banner has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            ...swalConfig,
          });
        } else {
          throw new Error(res.message);
        }
      } catch (err: any) {
        Swal.fire({
          title: "Error!",
          text: err.message || "Failed to delete banner.",
          icon: "error",
          confirmButtonColor: "#C59B4C",
          ...swalConfig,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List of Banners */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-black text-text-primary mb-2 uppercase tracking-wide border-b border-black/5 dark:border-white/5 pb-2">
          Existing Banners ({banners.length})
        </h3>

        {banners.length === 0 ? (
          <div className="glass-panel-premium p-16 rounded-3xl text-center space-y-4 shadow-sm animate-reveal">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h4 className="text-lg font-bold text-text-primary uppercase tracking-wide">No Banners Configured</h4>
            <p className="text-text-secondary text-xs max-w-sm mx-auto font-light leading-relaxed">
              Add promotional sliding banners using the creation panel to showcase specific achievements, campaigns, or services on your website.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className={`glass-panel-premium overflow-hidden rounded-3xl border flex flex-col group transition-all duration-300 ${
                  editingId === banner.id ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-black/5"
                }`}
              >
                {/* Image Preview */}
                <div className="relative h-44 w-full bg-black/5 overflow-hidden shrink-0">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><rect width='800' height='450' fill='%2318181b'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' fill='%239ca3af'>Banner Image</text></svg>";
                    }}
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <span className="bg-black/75 text-primary text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-primary animate-pulse" /> Order: {banner.order}
                    </span>
                    <span className="bg-primary text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-lg shadow-sm">
                      {banner.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h4 className="font-bold text-text-primary text-sm group-hover:text-primary transition-colors mb-1 line-clamp-1">
                    {banner.title}
                  </h4>
                  {banner.description && (
                    <p className="text-xs text-text-secondary line-clamp-2 mt-1 mb-2 font-light">
                      {banner.description}
                    </p>
                  )}
                  <div className="text-[10px] text-text-secondary font-mono flex flex-col gap-1 mt-auto pt-3 border-t border-black/5 dark:border-white/5">
                    <span className="truncate block">Image: {banner.imageUrl}</span>
                    {banner.projectUrl && (
                      <a
                        href={banner.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-1.5 font-sans"
                      >
                        Link: {banner.projectUrl} <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 border-t border-black/5 dark:border-white/5 pt-3 mt-4">
                    <button
                      onClick={() => handleEditClick(banner)}
                      className="p-2 bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-black rounded-lg text-text-primary transition-all cursor-pointer"
                      title="Edit Banner"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 bg-black/5 dark:bg-white/5 hover:bg-red-500 hover:text-white rounded-lg text-red-500 transition-all cursor-pointer"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Form */}
      <div>
        <div className="glass-panel-premium p-6 sm:p-8 rounded-3xl space-y-6 sticky top-24 shadow-xl">
          <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
            <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">
              {editingId ? "Edit Banner" : "Add Banner"}
            </h3>
            {editingId && (
              <button
                onClick={resetForm}
                className="text-xs text-text-secondary hover:text-red-500 flex items-center gap-1 cursor-pointer font-bold"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="form-label-premium">Banner Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. My Business Card"
                className="form-input-premium"
                required
              />
            </div>

            {/* Category / Badge Label */}
            <div className="space-y-1.5">
              <label className="form-label-premium">Category / Label Badge (Optional)</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Graphic, Template, Deployed"
                className="form-input-premium"
              />
            </div>

            {/* Image URL */}
            <ImageUploadField
              label="Image URL / Path"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
              placeholder="e.g. /assets/img/banners/card.png or URL"
              required
            />

            {/* Project URL */}
            <div className="space-y-1.5">
              <label className="form-label-premium">Project URL (Optional)</label>
              <input
                type="text"
                name="projectUrl"
                value={formData.projectUrl}
                onChange={handleChange}
                placeholder="e.g. https://linkedin.com/in/..."
                className="form-input-premium"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="form-label-premium">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description of the banner content..."
                className="form-input-premium resize-y"
              />
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="form-label-premium">Sort Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                placeholder="e.g. 1"
                className="form-input-premium"
                required
              />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-primary text-white font-black uppercase tracking-wider rounded-xl hover:bg-primary-hover active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer text-xs shadow-lg shadow-primary/10"
            >
              {editingId ? <Save className="w-4 h-4 text-black" /> : <Plus className="w-4 h-4 text-black" />}
              {loading ? "Saving..." : editingId ? "Update Banner" : "Add Banner"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
