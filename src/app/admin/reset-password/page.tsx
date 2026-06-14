"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { Lock } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-red-500">Invalid Reset Token</h3>
        <p className="text-sm text-text-secondary">
          No password reset token was provided. Please request a new reset link.
        </p>
        <button
          onClick={() => router.push("/admin/login")}
          className="mt-4 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors cursor-pointer"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      Swal.fire({
        title: "Warning!",
        text: "Please fill in all fields.",
        icon: "warning",
        background: "#ffffff",
        color: "#3E4045",
        confirmButtonColor: "#C59B4C",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        title: "Mismatch!",
        text: "Passwords do not match. Please try again.",
        icon: "warning",
        background: "#ffffff",
        color: "#3E4045",
        confirmButtonColor: "#C59B4C",
      });
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        title: "Weak Password!",
        text: "Password must be at least 6 characters long.",
        icon: "warning",
        background: "#ffffff",
        color: "#3E4045",
        confirmButtonColor: "#C59B4C",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Swal.fire({
          title: "Password Updated!",
          text: result.message || "Your password has been successfully reset.",
          icon: "success",
          background: "#ffffff",
          color: "#3E4045",
          timer: 3000,
          showConfirmButton: false,
        });
        router.push("/admin/login");
      } else {
        Swal.fire({
          title: "Error!",
          text: result.message || "Invalid or expired token.",
          icon: "error",
          background: "#ffffff",
          color: "#3E4045",
          confirmButtonColor: "#C59B4C",
        });
      }
    } catch (error) {
      console.error("Password reset action failed:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        background: "#ffffff",
        color: "#3E4045",
        confirmButtonColor: "#C59B4C",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* New Password Input */}
      <div className="relative flex items-center group">
        <Lock className="absolute left-4 w-5 h-5 text-black/30 group-focus-within:text-primary transition-colors" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          className="w-full pl-12 pr-5 py-4 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm placeholder-black/30 focus:outline-none focus:border-primary/50 transition-colors"
          required
        />
      </div>

      {/* Confirm Password Input */}
      <div className="relative flex items-center group">
        <Lock className="absolute left-4 w-5 h-5 text-black/30 group-focus-within:text-primary transition-colors" />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          className="w-full pl-12 pr-5 py-4 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm placeholder-black/30 focus:outline-none focus:border-primary/50 transition-colors"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-primary/10 cursor-pointer"
      >
        {loading ? "Updating..." : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background soft design highlights */}
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Reset Card */}
      <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl relative z-10 space-y-8 animate-reveal border border-black/5 shadow-2xl">
        <div className="text-center space-y-3">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/assets/img/white-logo.png"
              alt="Build By Krish logo"
              className="h-20 w-20 rounded-2xl object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-wide">Secure Reset Portal</h2>
          <p className="text-xs text-text-secondary">Define a new password for your administrator credentials.</p>
        </div>

        <Suspense
          fallback={
            <div className="text-center text-sm text-text-secondary py-4 animate-pulse">
              Verifying request...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
