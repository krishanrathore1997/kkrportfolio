"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Lock, User, Mail } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      Swal.fire({
        title: "Warning!",
        text: "Please enter both username and password.",
        icon: "warning",
        background: "#ffffff",
        color: "#3E4045",
        confirmButtonColor: "#C59B4C",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Swal.fire({
          title: "Access Granted!",
          text: result.message || "Logged in successfully.",
          icon: "success",
          background: "#ffffff",
          color: "#3E4045",
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/admin");
        router.refresh();
      } else {
        Swal.fire({
          title: "Access Denied!",
          text: result.message || "Invalid credentials. Please try again.",
          icon: "error",
          background: "#ffffff",
          color: "#3E4045",
          confirmButtonColor: "#C59B4C",
        });
      }
    } catch (error) {
      console.error("Login client exception:", error);
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

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotEmail) {
      Swal.fire({
        title: "Warning!",
        text: "Please enter your email address or username.",
        icon: "warning",
        background: "#ffffff",
        color: "#3E4045",
        confirmButtonColor: "#C59B4C",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (result.resetLink) {
          Swal.fire({
            title: "Reset Link (Dev Mode)",
            html: `
              <p style="margin-bottom: 15px; font-size: 14px;">Email sending simulated in Development. Please use the link below:</p>
              <a href="${result.resetLink}" style="color: #C59B4C; font-weight: 600; word-break: break-all; display: block; padding: 12px; background: rgba(197, 155, 76, 0.08); border: 1px dashed #C59B4C; border-radius: 8px; text-decoration: none; font-size: 13px; line-height: 1.4;">Reset Password Page</a>
            `,
            icon: "success",
            background: "#ffffff",
            color: "#3E4045",
            confirmButtonColor: "#C59B4C",
          });
        } else {
          Swal.fire({
            title: "Reset Email Generated!",
            text: result.message || "A password reset link has been successfully generated.",
            icon: "success",
            background: "#ffffff",
            color: "#3E4045",
            confirmButtonColor: "#C59B4C",
          });
        }
        setForgotEmail("");
        setMode("login");
      } else {
        Swal.fire({
          title: "Error!",
          text: result.message || "Failed to process forgot password request.",
          icon: "error",
          background: "#ffffff",
          color: "#3E4045",
          confirmButtonColor: "#C59B4C",
        });
      }
    } catch (error) {
      console.error("Forgot password client exception:", error);
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
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background soft design highlights */}
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Login / Reset Card */}
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
          <h2 className="text-2xl font-bold text-text-primary tracking-wide">
            {mode === "login" ? "Administrator Portal" : "Reset Password"}
          </h2>
          <p className="text-xs text-text-secondary">
            {mode === "login"
              ? "Enter secure credentials to manage portfolio database."
              : "Enter admin email or username to request a reset link."}
          </p>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="relative flex items-center group">
              <User className="absolute left-4 w-5 h-5 text-black/30 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username or Email"
                className="w-full pl-12 pr-5 py-4 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm placeholder-black/30 focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative flex items-center group">
              <Lock className="absolute left-4 w-5 h-5 text-black/30 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-12 pr-5 py-4 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm placeholder-black/30 focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-xs text-text-secondary hover:text-primary transition-colors cursor-pointer border-none bg-transparent outline-none focus:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-primary/10 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="relative flex items-center group">
              <Mail className="absolute left-4 w-5 h-5 text-black/30 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Username or Email"
                className="w-full pl-12 pr-5 py-4 rounded-xl bg-black/5 border border-black/5 text-text-primary text-sm placeholder-black/30 focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-primary/10 cursor-pointer"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <button
                type="button"
                onClick={() => setMode("login")}
                className="w-full py-3 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer border border-transparent bg-transparent outline-none"
              >
                Cancel & Return
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
