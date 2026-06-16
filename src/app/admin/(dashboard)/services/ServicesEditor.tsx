"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { addService, updateService, deleteService } from "../../actions";
import { Plus, Edit2, Trash2, HelpCircle, Save, X, Briefcase } from "lucide-react";
import * as Icons from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

interface ServicesEditorProps {
  initialServices: ServiceItem[];
}

const COMMON_ICONS = [
  "Code",
  "Palette",
  "Cpu",
  "Smartphone",
  "Globe",
  "Laptop",
  "Server",
  "Database",
  "Shield",
  "Zap",
  "Search",
  "Layers",
];

export default function ServicesEditor({ initialServices }: ServicesEditorProps) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    iconName: "Code",
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
      description: "",
      iconName: "Code",
      order: 0,
    });
    setEditingId(null);
  };

  const handleEditClick = (service: ServiceItem) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      description: service.description,
      iconName: service.iconName,
      order: service.order,
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
        const res = await updateService(editingId, formData);
        if (res.success) {
          setServices((prev) =>
            prev
              .map((s) => (s.id === editingId ? { ...s, ...formData } : s))
              .sort((a, b) => a.order - b.order)
          );
          Swal.fire({
            title: "Success!",
            text: "Service updated successfully.",
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
        const res = await addService(formData);
        if (res.success && res.data) {
          setServices((prev) =>
            [...prev, res.data]
              .sort((a, b) => a.order - b.order)
          );
          Swal.fire({
            title: "Success!",
            text: "Service created successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            ...swalConfig,
          });
          resetForm();
        } else {
          throw new Error(res.message || "Failed to create service.");
        }
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to save service.",
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
      text: "You won't be able to revert this service!",
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
        const res = await deleteService(id);
        if (res.success) {
          setServices((prev) => prev.filter((s) => s.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Service has been deleted.",
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
          text: err.message || "Failed to delete service.",
          icon: "error",
          confirmButtonColor: "#C59B4C",
          ...swalConfig,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const renderIcon = (name: string) => {
    const IconComp = (Icons as any)[name] || HelpCircle;
    return <IconComp className="w-5 h-5" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List of Services */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-black text-text-primary mb-2 uppercase tracking-wide border-b border-black/5 dark:border-white/5 pb-2">
          Existing Services ({services.length})
        </h3>

        {services.length === 0 ? (
          <div className="glass-panel-premium p-16 rounded-3xl text-center space-y-4 shadow-sm animate-reveal">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-text-primary uppercase tracking-wide">No Services Offered</h4>
            <p className="text-text-secondary text-xs max-w-sm mx-auto font-light leading-relaxed">
              Add services you offer using the creation panel to list your expertise and core capabilities on your landing page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className={`glass-panel-premium p-5 rounded-3xl relative border flex flex-col justify-between group transition-all duration-300 ${
                  editingId === service.id ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-black/5"
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      {renderIcon(service.iconName)}
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary text-sm group-hover:text-primary transition-colors">
                        {service.title}
                      </h4>
                      <span className="text-[10px] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded text-text-secondary font-bold">
                        Order: {service.order}
                      </span>
                    </div>
                  </div>
                  <p className="text-text-secondary text-xs font-light leading-relaxed mb-4 line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="flex justify-end gap-2 border-t border-black/5 dark:border-white/5 pt-3 mt-auto">
                  <button
                    onClick={() => handleEditClick(service)}
                    className="p-2 bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-black rounded-lg text-text-primary transition-all cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 bg-black/5 dark:bg-white/5 hover:bg-red-500 hover:text-white rounded-lg text-red-500 transition-all cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
              {editingId ? "Edit Service" : "Add New Service"}
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
              <label className="form-label-premium">Service Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Web Development"
                className="form-input-premium"
                required
              />
            </div>

            {/* Icon Select */}
            <div className="space-y-1.5">
              <label className="form-label-premium">Icon Name</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  name="iconName"
                  value={formData.iconName}
                  onChange={handleChange}
                  className="form-input-premium col-span-1"
                >
                  {COMMON_ICONS.map((icon) => (
                    <option key={icon} value={icon} className="bg-bg-card">
                      {icon}
                    </option>
                  ))}
                  {!COMMON_ICONS.includes(formData.iconName) && (
                    <option value={formData.iconName} className="bg-bg-card">
                      Custom: {formData.iconName}
                    </option>
                  )}
                </select>
                <input
                  type="text"
                  name="iconName"
                  value={formData.iconName}
                  onChange={handleChange}
                  placeholder="Or type Lucide icon name"
                  className="form-input-premium col-span-1"
                />
              </div>
              <p className="text-[10px] text-text-secondary font-light mt-1">
                Enter any valid Lucide icon name (PascalCase). Example: Cpu, Code, Palette, Smartphone, Globe.
              </p>
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
              <label className="form-label-premium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the service details..."
                className="form-input-premium resize-none"
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
              {loading ? "Saving..." : editingId ? "Update Service" : "Add Service"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
