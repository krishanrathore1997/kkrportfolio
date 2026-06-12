"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { addSkill, updateSkill, deleteSkill } from "../../actions";
import { Plus, Edit2, Trash2, Award, Save, X } from "lucide-react";

interface SkillItem {
  id: string;
  name: string;
  percentage: number;
  category: string;
  order: number;
}

interface SkillsEditorProps {
  initialSkills: SkillItem[];
}

const COMMON_CATEGORIES = ["Frontend", "Backend", "Tools", "Other"];

export default function SkillsEditor({ initialSkills }: SkillsEditorProps) {
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    percentage: 80,
    category: "Frontend",
    order: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      percentage: 80,
      category: "Frontend",
      order: 0,
    });
    setEditingId(null);
  };

  const handleEditClick = (skill: SkillItem) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      percentage: skill.percentage,
      category: skill.category,
      order: skill.order,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "percentage" || name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Update
        const res = await updateSkill(editingId, formData);
        if (res.success) {
          setSkills((prev) =>
            prev
              .map((s) => (s.id === editingId ? { ...s, ...formData } : s))
              .sort((a, b) => a.order - b.order)
          );
          Swal.fire({
            title: "Success!",
            text: "Skill updated successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          resetForm();
        } else {
          throw new Error(res.message);
        }
      } else {
        // Create
        const res = await addSkill(formData);
        if (res.success) {
          Swal.fire({
            title: "Success!",
            text: "Skill created successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            window.location.reload();
          });
        } else {
          throw new Error(res.message);
        }
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to save skill.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This skill will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C59B4C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      setLoading(true);
      try {
        const res = await deleteSkill(id);
        if (res.success) {
          setSkills((prev) => prev.filter((s) => s.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Skill deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          throw new Error(res.message);
        }
      } catch (err: any) {
        Swal.fire({
          title: "Error!",
          text: err.message || "Failed to delete skill.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Group skills by category for nice visual display
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Skills list grouped by category */}
      <div className="lg:col-span-2 space-y-6">
        <h3 className="text-lg font-bold text-text-primary">Current Skills List</h3>

        {skills.length === 0 ? (
          <div className="glass-panel p-10 text-center text-text-secondary rounded-2xl">
            No skills configured yet. Add skills to make them appear here.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat} className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-primary border-b border-black/5 pb-1">
                {cat}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills
                  .filter((s) => s.category === cat)
                  .map((skill) => (
                    <div
                      key={skill.id}
                      className={`glass-panel p-4 rounded-xl border flex justify-between items-center group transition-all duration-300 ${
                        editingId === skill.id ? "border-primary bg-primary/5" : "border-black/5"
                      }`}
                    >
                      <div className="space-y-1.5 flex-grow pr-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-text-primary">{skill.name}</span>
                          <span className="font-semibold text-primary">{skill.percentage}%</span>
                        </div>
                        {/* Progress Bar visual indicator */}
                        <div className="w-full bg-black/5 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${skill.percentage}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-text-secondary block font-bold">
                          Order: {skill.order}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 border-l border-black/5 pl-3">
                        <button
                          onClick={() => handleEditClick(skill)}
                          className="p-1.5 bg-black/5 hover:bg-primary hover:text-black rounded-lg text-text-primary transition-all cursor-pointer"
                          title="Edit Skill"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1.5 bg-black/5 hover:bg-red-500 hover:text-white rounded-lg text-red-500 transition-all cursor-pointer"
                          title="Delete Skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Skills Editor Form */}
      <div>
        <div className="glass-panel p-6 rounded-2xl space-y-6 sticky top-24">
          <div className="flex justify-between items-center border-b border-black/5 pb-3">
            <h3 className="font-bold text-text-primary text-md">
              {editingId ? "Edit Skill" : "Add New Skill"}
            </h3>
            {editingId && (
              <button
                onClick={resetForm}
                className="text-xs text-text-secondary hover:text-red-500 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Skill Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Next.js / TypeScript"
                className="w-full px-3 py-2.5 rounded-lg bg-black/5 border border-black/5 text-text-primary text-xs focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Category Group</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="px-3 py-2.5 rounded-lg bg-black/5 border border-black/5 text-text-primary text-xs focus:outline-none focus:border-primary/50 transition-colors col-span-1"
                >
                  {COMMON_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-bg-card">
                      {cat}
                    </option>
                  ))}
                  {!COMMON_CATEGORIES.includes(formData.category) && (
                    <option value={formData.category} className="bg-bg-card">
                      Custom: {formData.category}
                    </option>
                  )}
                </select>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Or type custom category"
                  className="px-3 py-2.5 rounded-lg bg-black/5 border border-black/5 text-text-primary text-xs focus:outline-none focus:border-primary/50 transition-colors col-span-1"
                />
              </div>
            </div>

            {/* Percentage Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-text-secondary">Level / Percentage</label>
                <span className="font-bold text-primary">{formData.percentage}%</span>
              </div>
              <input
                type="range"
                name="percentage"
                min="1"
                max="100"
                value={formData.percentage}
                onChange={handleChange}
                className="w-full h-1.5 bg-black/5 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Display Order */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Sort Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                placeholder="e.g. 1"
                className="w-full px-3 py-2.5 rounded-lg bg-black/5 border border-black/5 text-text-primary text-xs focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-black font-semibold rounded-lg hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer text-xs"
            >
              {editingId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {loading ? "Saving..." : editingId ? "Update Skill" : "Add Skill"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
