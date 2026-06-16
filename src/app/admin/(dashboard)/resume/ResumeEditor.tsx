"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { addTimelineItem, updateTimelineItem, deleteTimelineItem } from "../../actions";
import { Plus, Edit2, Trash2, BookOpen, Briefcase, Save, X } from "lucide-react";

interface TimelineItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  duration: string;
  description: string | null;
  order: number;
}

interface ResumeEditorProps {
  initialItems: TimelineItem[];
}

export default function ResumeEditor({ initialItems }: ResumeEditorProps) {
  const [items, setItems] = useState<TimelineItem[]>(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: "experience",
    title: "",
    subtitle: "",
    duration: "",
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
      type: "experience",
      title: "",
      subtitle: "",
      duration: "",
      description: "",
      order: 0,
    });
    setEditingId(null);
  };

  const handleEditClick = (item: TimelineItem) => {
    setEditingId(item.id);
    setFormData({
      type: item.type,
      title: item.title,
      subtitle: item.subtitle,
      duration: item.duration,
      description: item.description || "",
      order: item.order,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        const res = await updateTimelineItem(editingId, formData);
        if (res.success) {
          setItems((prev) =>
            prev
              .map((item) => (item.id === editingId ? { ...item, ...formData } : item))
              .sort((a, b) => a.order - b.order)
          );
          Swal.fire({
            title: "Success!",
            text: "Timeline item updated successfully.",
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
        const res = await addTimelineItem(formData);
        if (res.success && res.data) {
          setItems((prev) =>
            [...prev, res.data]
              .sort((a, b) => a.order - b.order)
          );
          Swal.fire({
            title: "Success!",
            text: "Timeline item created successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            ...swalConfig,
          });
          resetForm();
        } else {
          throw new Error(res.message || "Failed to create timeline item.");
        }
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to save timeline item.",
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
      text: "This milestone will be permanently deleted.",
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
        const res = await deleteTimelineItem(id);
        if (res.success) {
          setItems((prev) => prev.filter((item) => item.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Timeline item has been deleted.",
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
          text: err.message || "Failed to delete timeline item.",
          icon: "error",
          confirmButtonColor: "#C59B4C",
          ...swalConfig,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const experiences = items.filter((item) => item.type === "experience");
  const education = items.filter((item) => item.type === "education");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Timeline List */}
      <div className="lg:col-span-2 space-y-8">
        {/* Experience List */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-text-primary uppercase tracking-wide flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
            <Briefcase className="w-5 h-5 text-primary" /> Work Experience ({experiences.length})
          </h3>
          {experiences.length === 0 ? (
            <div className="glass-panel-premium p-10 rounded-2xl text-center text-text-secondary text-xs font-light">
              No work experiences defined. Use the dashboard panel to build your professional timeline.
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((item) => (
                <div
                  key={item.id}
                  className={`glass-panel-premium p-5 rounded-3xl border flex flex-col justify-between group transition-all duration-300 ${
                    editingId === item.id ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-black/5"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-text-primary text-sm">{item.title}</h4>
                      <p className="text-xs text-primary font-medium mt-0.5">{item.subtitle}</p>
                      <span className="text-[10px] text-text-secondary bg-black/5 dark:bg-white/5 px-2.5 py-0.5 rounded font-bold block w-fit mt-1.5">
                        {item.duration}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-secondary font-bold bg-black/5 dark:bg-white/5 px-2.5 py-0.5 rounded">
                      Order: {item.order}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-text-secondary text-xs font-light leading-relaxed mt-3 border-t border-black/5 dark:border-white/5 pt-3">
                      {item.description}
                    </p>
                  )}
                  <div className="flex justify-end gap-2 border-t border-black/5 dark:border-white/5 pt-3 mt-4">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-2 bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-black rounded-lg text-text-primary transition-all cursor-pointer"
                      title="Edit Milestone"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-black/5 dark:bg-white/5 hover:bg-red-500 hover:text-white rounded-lg text-red-500 transition-all cursor-pointer"
                      title="Delete Milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education List */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-text-primary uppercase tracking-wide flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
            <BookOpen className="w-5 h-5 text-primary" /> Academic Education ({education.length})
          </h3>
          {education.length === 0 ? (
            <div className="glass-panel-premium p-10 rounded-2xl text-center text-text-secondary text-xs font-light">
              No academic education milestones defined. Use the dashboard panel to build your educational timeline.
            </div>
          ) : (
            <div className="space-y-4">
              {education.map((item) => (
                <div
                  key={item.id}
                  className={`glass-panel-premium p-5 rounded-3xl border flex flex-col justify-between group transition-all duration-300 ${
                    editingId === item.id ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-black/5"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-text-primary text-sm">{item.title}</h4>
                      <p className="text-xs text-primary font-medium mt-0.5">{item.subtitle}</p>
                      <span className="text-[10px] text-text-secondary bg-black/5 dark:bg-white/5 px-2.5 py-0.5 rounded font-bold block w-fit mt-1.5">
                        {item.duration}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-secondary font-bold bg-black/5 dark:bg-white/5 px-2.5 py-0.5 rounded">
                      Order: {item.order}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-text-secondary text-xs font-light leading-relaxed mt-3 border-t border-black/5 dark:border-white/5 pt-3">
                      {item.description}
                    </p>
                  )}
                  <div className="flex justify-end gap-2 border-t border-black/5 dark:border-white/5 pt-3 mt-4">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-2 bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-black rounded-lg text-text-primary transition-all cursor-pointer"
                      title="Edit Milestone"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-black/5 dark:bg-white/5 hover:bg-red-500 hover:text-white rounded-lg text-red-500 transition-all cursor-pointer"
                      title="Delete Milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor Form */}
      <div>
        <div className="glass-panel-premium p-6 sm:p-8 rounded-3xl space-y-6 sticky top-24 shadow-xl">
          <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
            <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">
              {editingId ? "Edit Milestone" : "Add Milestone"}
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
            {/* Type */}
            <div className="space-y-1.5">
              <label className="form-label-premium">Milestone Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-input-premium"
              >
                <option value="experience" className="bg-bg-card text-text-primary">
                  Work Experience
                </option>
                <option value="education" className="bg-bg-card text-text-primary">
                  Academic Education
                </option>
              </select>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="form-label-premium">Milestone Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                className="form-input-premium"
                required
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-1.5">
              <label className="form-label-premium">Subtitle (Organization / Place)</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="e.g. KudosIntech Pvt. Ltd."
                className="form-input-premium"
                required
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="form-label-premium">Duration / Period</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. Aug 2024 - Present"
                className="form-input-premium"
                required
              />
            </div>

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

            {/* Description */}
            <div className="space-y-1.5">
              <label className="form-label-premium">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="List key achievements or details..."
                className="form-input-premium resize-none"
              />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-primary text-white font-black uppercase tracking-wider rounded-xl hover:bg-primary-hover active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer text-xs shadow-lg shadow-primary/10"
            >
              {editingId ? <Save className="w-4 h-4 text-black" /> : <Plus className="w-4 h-4 text-black" />}
              {loading ? "Saving..." : editingId ? "Update Milestone" : "Add Milestone"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
