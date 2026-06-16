"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { addHeroSlide, updateHeroSlide, deleteHeroSlide } from "../../actions";
import ImageUploadField from "@/components/ImageUploadField";
import { Plus, Edit2, Trash2, Save, X, Sparkles } from "lucide-react";

interface SlideItem {
  id: string;
  imageUrl: string;
  title: string;
  order: number;
}

interface SlidesEditorProps {
  initialSlides: SlideItem[];
}

export default function SlidesEditor({ initialSlides }: SlidesEditorProps) {
  const [slides, setSlides] = useState<SlideItem[]>(initialSlides);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    imageUrl: "",
    title: "",
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
      imageUrl: "",
      title: "",
      order: 0,
    });
    setEditingId(null);
  };

  const handleEditClick = (slide: SlideItem) => {
    setEditingId(slide.id);
    setFormData({
      imageUrl: slide.imageUrl,
      title: slide.title,
      order: slide.order,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const swalConfig = getSwalConfig();

    try {
      if (editingId) {
        // Update
        const res = await updateHeroSlide(editingId, formData);
        if (res.success) {
          setSlides((prev) =>
            prev
              .map((s) => (s.id === editingId ? { ...s, ...formData } : s))
              .sort((a, b) => a.order - b.order)
          );
          Swal.fire({
            title: "Success!",
            text: "Slide updated successfully.",
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
        const res = await addHeroSlide(formData);
        if (res.success && res.data) {
          setSlides((prev) =>
            [...prev, res.data]
              .sort((a, b) => a.order - b.order)
          );
          Swal.fire({
            title: "Success!",
            text: "Slide added successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            ...swalConfig,
          });
          resetForm();
        } else {
          throw new Error(res.message || "Failed to create slide.");
        }
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to save slide.",
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
      text: "This slide will be permanently deleted from the Hero rotating deck.",
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
        const res = await deleteHeroSlide(id);
        if (res.success) {
          setSlides((prev) => prev.filter((s) => s.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Slide has been deleted.",
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
          text: err.message || "Failed to delete slide.",
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
      {/* Grid of Slides */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-black text-text-primary mb-2 uppercase tracking-wide border-b border-black/5 dark:border-white/5 pb-2">
          Existing Slides ({slides.length})
        </h3>

        {slides.length === 0 ? (
          <div className="glass-panel-premium p-16 rounded-3xl text-center space-y-4 shadow-sm animate-reveal">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h4 className="text-lg font-bold text-text-primary uppercase tracking-wide">No Hero Slides Added</h4>
            <p className="text-text-secondary text-xs max-w-sm mx-auto font-light leading-relaxed">
              Add hero slideshow images using the creation panel to introduce yourself with a stunning visual rotating deck on the landing section.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className={`glass-panel-premium overflow-hidden rounded-3xl border flex flex-col group transition-all duration-300 ${
                  editingId === slide.id ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-black/5"
                }`}
              >
                {/* Slide Preview */}
                <div className="relative h-44 w-full bg-black/5 overflow-hidden shrink-0">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='600' height='400' fill='%2318181b'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'>Slide Image</text></svg>";
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-black/75 text-primary text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary animate-pulse" /> Slide Order: {slide.order}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h4 className="font-bold text-text-primary text-sm group-hover:text-primary transition-colors mb-1 line-clamp-1">
                    {slide.title}
                  </h4>
                  <span className="text-[10px] text-text-secondary truncate mt-1 block font-mono">
                    Path: {slide.imageUrl}
                  </span>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 border-t border-black/5 dark:border-white/5 pt-3 mt-4">
                    <button
                      onClick={() => handleEditClick(slide)}
                      className="p-2 bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-black rounded-lg text-text-primary transition-all cursor-pointer"
                      title="Edit Slide"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 bg-black/5 dark:bg-white/5 hover:bg-red-500 hover:text-white rounded-lg text-red-500 transition-all cursor-pointer"
                      title="Delete Slide"
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
              {editingId ? "Edit Slide" : "Add Slide"}
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
              <label className="form-label-premium">Project Name / Slide Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. E-Commerce Platform"
                className="form-input-premium"
                required
              />
            </div>

            {/* Image URL */}
            <ImageUploadField
              label="Image Link / Path"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
              placeholder="e.g. /assets/hero slider/slide-1.png"
              required
            />

            {/* Display Order */}
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
              {loading ? "Saving..." : editingId ? "Update Slide" : "Add Slide"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
