"use client";

import React, { useRef, useState } from "react";
import { Upload, X, FileText, CheckCircle2, AlertCircle, Eye, Loader2 } from "lucide-react";

export interface UploadedFileMetadata {
  key: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
}

interface MediaUploadProps {
  onUploadComplete?: (metadata: UploadedFileMetadata) => void;
  onUploadError?: (error: string) => void;
  label?: string;
  id?: string;
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

export default function MediaUpload({
  onUploadComplete,
  onUploadError,
  label = "Upload Image or PDF Document",
  id = "media-uploader",
}: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileMetadata | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // 1. Validate MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMsg("Only JPEG, PNG, WEBP, GIF images and PDF documents are allowed.");
      return false;
    }

    // 2. Validate Size Limits
    const limit = file.type === "application/pdf" ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;
    if (file.size > limit) {
      const limitMb = limit / (1024 * 1024);
      setErrorMsg(`File exceeds the maximum size limit of ${limitMb}MB.`);
      return false;
    }

    return true;
  };

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setUploading(true);
    setProgress(0);
    setErrorMsg(null);
    setUploadedFile(null);

    const isFilePdf = file.type === "application/pdf";
    setIsPdf(isFilePdf);

    // If it's an image, create a local preview URL first
    if (!isFilePdf) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    } else {
      setPreviewUrl(null);
    }

    const formData = new FormData();
    formData.append("file", file);

    // Use XHR (XMLHttpRequest) to track real-time upload progress
    const xhr = new XMLHttpRequest();
    
    xhr.open("POST", "/api/media/upload", true);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      let responseData: any = {};
      try {
        responseData = JSON.parse(xhr.responseText);
      } catch {
        // Fallback if parsing fails
      }

      if (xhr.status >= 200 && xhr.status < 300 && responseData.success) {
        const meta: UploadedFileMetadata = {
          key: responseData.key,
          url: responseData.url,
          originalName: responseData.originalName,
          mimeType: responseData.mimeType,
          size: responseData.size,
        };
        setUploadedFile(meta);
        setSuccessMsg("File uploaded successfully!");
        setPreviewUrl(meta.url); // Use the final public URL for preview/view
        if (onUploadComplete) {
          onUploadComplete(meta);
        }
      } else {
        const error = responseData.message || "An error occurred during file upload.";
        setErrorMsg(error);
        if (onUploadError) {
          onUploadError(error);
        }
      }
      setUploading(false);
    });

    xhr.addEventListener("error", () => {
      setErrorMsg("A network error occurred while uploading the file.");
      if (onUploadError) {
        onUploadError("Network upload failure.");
      }
      setUploading(false);
    });

    xhr.send(formData);
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

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const clearSelection = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold uppercase tracking-wider text-text-primary"
        >
          {label}
        </label>
      )}

      {/* Main Dropzone & Card Container */}
      <div className="relative overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/5 bg-bg-card/30 dark:bg-bg-card/10 backdrop-blur-md p-6 shadow-xl transition-all duration-300">
        
        {/* Decorative ambient lighting inside card */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        {/* Not Uploading / Upload Selection Mode */}
        {!uploadedFile && !uploading && (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer relative ${
              dragActive
                ? "border-primary bg-primary/10 scale-[0.99] shadow-inner"
                : "border-black/10 dark:border-white/10 hover:border-primary/50 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
            role="button"
            aria-label="Upload file dropzone"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary transform transition-transform duration-300 hover:scale-110">
              <Upload className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Drag & drop your file, or click to upload
              </p>
              <p className="text-xs text-text-secondary font-light">
                Supports JPEG, PNG, WEBP, GIF (max 5MB) or PDF (max 10MB)
              </p>
            </div>

            <input
              type="file"
              id={id}
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={ALLOWED_MIME_TYPES.join(",")}
              className="sr-only"
            />
          </div>
        )}

        {/* Uploading Status Mode */}
        {uploading && (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <span className="absolute text-xs font-bold text-text-primary">{progress}%</span>
            </div>

            <div className="w-full max-w-xs space-y-1 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Uploading Asset...
              </p>
              
              {/* Progress Bar Container */}
              <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Upload Success Mode */}
        {uploadedFile && (
          <div className="flex flex-col sm:flex-row items-center gap-6 animate-reveal">
            
            {/* Visual Preview */}
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-black/10 shrink-0 border border-black/5 dark:border-white/5 flex items-center justify-center">
              {isPdf ? (
                <FileText className="w-12 h-12 text-primary" />
              ) : (
                <img
                  src={previewUrl || ""}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2318181b'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23ef4444'>Preview Error</text></svg>";
                  }}
                />
              )}
            </div>

            {/* Info and Actions */}
            <div className="flex-grow w-full space-y-3">
              <div>
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">
                  File Details
                </span>
                <h4 className="text-sm font-semibold text-text-primary truncate max-w-[280px] sm:max-w-[340px]">
                  {uploadedFile.originalName}
                </h4>
                <p className="text-xs font-mono text-text-secondary">
                  {formatSize(uploadedFile.size)} • {uploadedFile.mimeType}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={uploadedFile.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/10 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {isPdf ? "View PDF Document" : "View Full Size"}
                </a>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/10 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Upload Different File
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Feedback Messages */}
        {errorMsg && (
          <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-xl border border-red-500/10 bg-red-500/5 text-red-500 text-xs animate-reveal">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold uppercase text-[10px] tracking-wider">Upload Error</p>
              <p className="font-light mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-xl border border-green-500/10 bg-green-500/5 text-green-500 text-xs animate-reveal">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold uppercase text-[10px] tracking-wider">Success</p>
              <p className="font-light mt-0.5">{successMsg}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
