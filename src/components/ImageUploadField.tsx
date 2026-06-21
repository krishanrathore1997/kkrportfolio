import React, { useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Upload, X, Link as LinkIcon, Copy, Check, Cloud } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  inputClassName?: string;
  labelClassName?: string;
}

export default function ImageUploadField({
  label,
  name,
  value,
  onChange,
  placeholder = "e.g. /assets/img/portfolio/project.jpg",
  required = false,
  inputClassName,
  labelClassName,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Detect active tab on mount and value changes:
  // If the value is an external URL (starts with http), default to the "link" tab; otherwise default to "upload".
  const [activeTab, setActiveTab] = useState<"upload" | "link">("upload");

  useEffect(() => {
    if (value && (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("//"))) {
      setActiveTab("link");
    } else {
      setActiveTab("upload");
    }
  }, [value]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultInputClass = "form-input-premium text-xs";
  const defaultLabelClass = "form-label-premium text-[11px] uppercase tracking-wider";

  const appliedInputClass = inputClassName || defaultInputClass;
  const appliedLabelClass = labelClassName || defaultLabelClass;

  const handleUpload = async (file: File) => {
    // 1. Client-side size check (1.5MB)
    if (file.size > 1.5 * 1024 * 1024) {
      Swal.fire({
        title: "File Too Large!",
        text: "The maximum image upload size is 1.5MB. Please select a smaller image.",
        icon: "error",
        background: "#ffffff",
        color: "#1F2937",
        confirmButtonColor: "#C59B4C",
      });
      return;
    }

    // 2. Client-side MIME type check
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        title: "Invalid File Type!",
        text: "Only image files (JPEG, PNG, WEBP, GIF, SVG) are allowed.",
        icon: "error",
        background: "#ffffff",
        color: "#1F2937",
        confirmButtonColor: "#C59B4C",
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onChange(data.url);
        Swal.fire({
          title: "Uploaded!",
          text: "Image uploaded successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Image upload error:", error);
      Swal.fire({
        title: "Upload Failed!",
        text: error.message || "An unexpected error occurred during upload.",
        icon: "error",
        background: "#ffffff",
        color: "#1F2937",
        confirmButtonColor: "#C59B4C",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const copyPath = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-2.5 w-full">
      <div className="flex justify-between items-center">
        <label className={appliedLabelClass}>{label}</label>
        {value && (
          <button
            type="button"
            onClick={clearImage}
            className="text-[10px] text-red-500 hover:text-red-600 hover:underline flex items-center gap-1 cursor-pointer font-semibold uppercase tracking-wider transition-colors"
          >
            <X className="w-3 h-3" /> Clear Image
          </button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer ${
            activeTab === "upload"
              ? "bg-white dark:bg-bg-card text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Upload className="w-3 h-3" /> Upload File
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("link")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer ${
            activeTab === "link"
              ? "bg-white dark:bg-bg-card text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <LinkIcon className="w-3 h-3" /> External Link
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "upload" ? (
        value ? (
          /* Premium Preview & Metadata Card */
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 transition-all duration-300 relative group animate-reveal">
            {/* Image Preview */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/10 shrink-0 border border-black/10">
              <img
                src={value}
                alt="Uploaded file"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2318181b'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23ef4444'>Error</text></svg>";
                }}
              />
            </div>

            {/* Path Details and Controls */}
            <div className="flex-grow w-full min-w-0 space-y-2.5">
              <div>
                <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider block">Uploaded path</span>
                <div className="flex items-center gap-2 mt-1 w-full min-w-0">
                  <code className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-white/60 dark:bg-bg-card/60 text-text-primary border border-black/5 dark:border-white/5 select-all truncate flex-grow min-w-0">
                    {value}
                  </code>
                  <button
                    type="button"
                    onClick={copyPath}
                    className="p-1.5 rounded-lg bg-white dark:bg-bg-card hover:bg-primary/20 hover:text-primary text-text-secondary border border-black/5 dark:border-white/5 transition-colors cursor-pointer shrink-0"
                    title="Copy Path"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer border border-primary/10"
                >
                  Change File
                </button>
                <button
                  type="button"
                  onClick={clearImage}
                  className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer border border-red-500/10"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Premium Drag-and-Drop Zone */
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 flex flex-col items-center justify-center gap-2.5 min-h-[140px] cursor-pointer relative ${
              dragActive
                ? "border-primary bg-primary/10 scale-[0.99]"
                : "border-black/10 dark:border-white/10 hover:border-primary/50 hover:bg-black/5 dark:hover:bg-white/5"
            } ${uploading ? "pointer-events-none" : ""}`}
          >
            {uploading ? (
              <>
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-1" />
                <p className="text-[11px] font-bold text-text-primary uppercase tracking-wider">Uploading asset...</p>
                <p className="text-[9px] text-text-secondary">Please wait while the image is written to server.</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                  <Cloud className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-text-primary uppercase tracking-wider">
                    Drag & drop file or click to upload
                  </p>
                  <p className="text-[9px] text-text-secondary">
                    Supports JPEG, PNG, WEBP, GIF, SVG (max 1.5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        )
      ) : (
        /* Image Link / URL input */
        <div className="flex gap-3 items-center animate-reveal">
          <div className="flex-grow">
            <input
              type="text"
              name={name}
              value={value}
              onChange={handleTextChange}
              placeholder={placeholder}
              className={appliedInputClass}
              required={required}
            />
          </div>
          {value && (
            <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-black/5 border border-black/5 shrink-0">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2318181b'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23ef4444'>Error</text></svg>";
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Hidden native file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
