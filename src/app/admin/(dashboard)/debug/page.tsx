"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { UploadCloud, Trash2, Copy, ExternalLink, RefreshCw } from "lucide-react";

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function DebugUploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/uploads");
      const data = await res.json();
      if (res.ok && data.success) {
        setFiles(data.files);
      } else {
        throw new Error(data.message || "Failed to load uploaded files.");
      }
    } catch (error: any) {
      console.error("Fetch files error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (file: File) => {
    // 1. Client-side size check (1.5MB)
    if (file.size > 1.5 * 1024 * 1024) {
      Swal.fire({
        title: "File Too Large!",
        text: `The file size is ${(file.size / (1024 * 1024)).toFixed(2)}MB. Max limit is 1.5MB.`,
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
        text: "Only image files are allowed in this tester.",
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
        Swal.fire({
          title: "Success!",
          text: "Image uploaded successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchFiles();
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Upload Failed!",
        text: error.message || "Something went wrong.",
        icon: "error",
        background: "#ffffff",
        color: "#1F2937",
        confirmButtonColor: "#C59B4C",
      });
    } finally {
      setUploading(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: "Copied!",
      text: "URL path copied to clipboard.",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
    });
  };

  const handleDelete = async (filename: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This file will be permanently deleted from the server disk.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C59B4C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/uploads?file=${encodeURIComponent(filename)}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (res.ok && data.success) {
          Swal.fire({
            title: "Deleted!",
            text: "File has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          fetchFiles();
        } else {
          throw new Error(data.message || "Failed to delete file.");
        }
      } catch (err: any) {
        Swal.fire({
          title: "Error!",
          text: err.message || "Failed to delete file.",
          icon: "error",
        });
      }
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8 animate-reveal">
      {/* Header */}
      <div className="border-b border-black/5 dark:border-white/5 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-wide">Debug Upload Center</h1>
          <p className="text-xs text-text-secondary mt-1">
            Test uploader limits (max 1.5MB) and inspect locally uploaded assets under public/uploads directory.
          </p>
        </div>
        <button
          onClick={fetchFiles}
          disabled={loading}
          className="p-2 bg-black/5 hover:bg-black/10 dark:hover:bg-white/10 text-text-primary rounded-xl transition-colors cursor-pointer disabled:opacity-50 border border-black/5 dark:border-white/5"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Playground Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-bold">Upload Playground</h3>
            
            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center gap-3 min-h-[200px] relative ${
                dragActive
                  ? "border-primary bg-primary/5 scale-[0.99]"
                  : "border-black/10 dark:border-white/10 hover:border-primary/50"
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-xs font-semibold text-text-primary">Uploading to server...</p>
                  <p className="text-[10px] text-text-secondary">Please wait while we transfer the image.</p>
                </>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-text-secondary/60 transition-colors" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-text-primary">Drag & drop image here</p>
                    <p className="text-[10px] text-text-secondary font-light">or click to browse local files</p>
                  </div>
                  <span className="text-[9px] text-primary font-bold uppercase bg-primary/10 px-2 py-0.5 rounded">
                    Max size: 1.5MB
                  </span>
                  
                  {/* Invisible Input */}
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Media Manager Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary font-bold">
              Recent Server Uploads ({files.length})
            </h3>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-text-secondary">Scanning uploads directory...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="py-12 text-center text-text-secondary text-xs">
                No uploads found. Drag files into the playground to populate.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-black/5 dark:border-white/5 text-text-secondary font-semibold">
                      <th className="pb-3 font-medium">Image</th>
                      <th className="pb-3 font-medium">Filename</th>
                      <th className="pb-3 font-medium">Size</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {files.map((file) => (
                      <tr key={file.name} className="group">
                        <td className="py-3 pr-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/5 border border-black/5 flex items-center justify-center shrink-0">
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        </td>
                        <td className="py-3 pr-3 max-w-[150px] sm:max-w-[200px]">
                          <span className="font-semibold text-text-primary block truncate" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-[10px] text-text-secondary font-mono truncate block" title={file.url}>
                            {file.url}
                          </span>
                        </td>
                        <td className="py-3 pr-3 text-text-secondary whitespace-nowrap">
                          {formatSize(file.size)}
                        </td>
                        <td className="py-3 text-right whitespace-nowrap">
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={() => copyToClipboard(file.url)}
                              className="p-1.5 hover:bg-primary/20 hover:text-primary rounded-lg text-text-secondary transition-colors cursor-pointer border border-transparent"
                              title="Copy URL"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-text-secondary transition-colors cursor-pointer border border-transparent"
                              title="View Fullsize"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDelete(file.name)}
                              className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-red-500 transition-colors cursor-pointer border border-transparent"
                              title="Delete File"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
