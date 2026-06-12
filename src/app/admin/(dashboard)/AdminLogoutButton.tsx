"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the admin panel.",
      icon: "question",
      showCancelButton: true,
      background: "#ffffff",
      color: "#3E4045",
      confirmButtonColor: "#C59B4C",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch("/api/admin/logout", {
          method: "POST",
        });

        if (res.ok) {
          router.push("/admin/login");
          router.refresh();
        }
      } catch (error) {
        console.error("Logout exception:", error);
      }
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors font-medium text-sm cursor-pointer text-left"
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </button>
  );
}
