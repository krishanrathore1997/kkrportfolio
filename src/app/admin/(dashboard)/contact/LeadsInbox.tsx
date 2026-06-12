"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { deleteLead, markLeadRead } from "../../actions";
import { Mail, Phone, Trash2, Eye, Calendar, User, MessageSquare, X } from "lucide-react";

interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: Date | string;
}

interface LeadsInboxProps {
  initialLeads: LeadItem[];
}

export default function LeadsInbox({ initialLeads }: LeadsInboxProps) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  const handleToggleRead = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "unread" ? "read" : "unread";
    const res = await markLeadRead(id, nextStatus as any);
    
    if (res.success) {
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status: nextStatus } as any : lead))
      );
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead((prev) => (prev ? { ...prev, status: nextStatus } as any : null));
      }
    }
  };

  const handleDeleteLead = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This message will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      background: "#ffffff",
      color: "#1F2937",
      confirmButtonColor: "#D4AF37",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const res = await deleteLead(id);
      if (res.success) {
        Swal.fire({
          title: "Deleted!",
          text: res.message,
          icon: "success",
          background: "#ffffff",
          color: "#1F2937",
          timer: 2000,
          showConfirmButton: false,
        });
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(null);
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: res.message || "Failed to delete.",
          icon: "error",
          background: "#ffffff",
          color: "#1F2937",
          confirmButtonColor: "#D4AF37",
        });
      }
    }
  };

  const handleViewLead = async (lead: LeadItem) => {
    setSelectedLead(lead);
    if (lead.status === "unread") {
      // Auto mark read on view
      await handleToggleRead(lead.id, "unread");
    }
  };

  return (
    <div className="space-y-6">
      {leads.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-black/5 text-text-secondary flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-text-primary">Your inbox is empty</h3>
          <p className="text-text-secondary text-sm max-w-sm mx-auto font-light leading-relaxed">
            When users submit the contact form on your portfolio landing page, their messages will appear here.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-black/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/5 border-b border-black/5 text-xs text-text-secondary uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Message Snippet</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`hover:bg-black/5 transition-colors ${
                      lead.status === "unread" ? "font-bold text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    {/* Sender Details */}
                    <td className="px-6 py-4 space-y-1">
                      <div className="text-text-primary font-semibold flex items-center gap-1.5">
                        {lead.name}
                        {lead.status === "unread" && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="text-xs text-text-secondary font-light">{lead.email}</div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4">{lead.phone}</td>

                    {/* Message Snippet */}
                    <td className="px-6 py-4 max-w-xs truncate font-light">
                      {lead.message}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs font-light">
                      {new Date(lead.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleRead(lead.id, lead.status)}
                        className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider cursor-pointer ${
                          lead.status === "unread"
                            ? "bg-primary/20 text-primary border border-primary/20"
                            : "bg-black/5 text-text-secondary"
                        }`}
                      >
                        {lead.status}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleViewLead(lead)}
                          className="p-2 bg-black/5 rounded-xl hover:bg-primary hover:text-black text-text-primary transition-all cursor-pointer"
                          title="Read message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-2 bg-black/5 rounded-xl hover:bg-red-500 hover:text-white text-red-500 transition-all cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Viewer Modal Overlay */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-bg-card border border-black/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative animate-reveal">
            {/* Close Button */}
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-black/5 hover:bg-black/10 text-text-primary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-black/5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-text-primary tracking-wide">{selectedLead.name}</h4>
                <p className="text-xs text-text-secondary">Sender Profile Details</p>
              </div>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-light text-text-secondary bg-black/5 p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href={`mailto:${selectedLead.email}`} className="hover:text-primary transition-colors font-medium">
                  {selectedLead.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href={`tel:${selectedLead.phone}`} className="hover:text-primary transition-colors font-medium">
                  {selectedLead.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 col-span-1 sm:col-span-2 border-t border-black/5 pt-2 mt-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                  Submitted on{" "}
                  {new Date(selectedLead.createdAt).toLocaleString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Modal Message */}
            <div className="space-y-2">
              <span className="text-xs text-text-secondary uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-primary" /> Message Body
              </span>
              <p className="bg-bg-dark p-6 rounded-2xl text-text-primary text-sm font-light leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto border border-black/5">
                {selectedLead.message}
              </p>
            </div>

            {/* Reply trigger button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-black/5">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2.5 bg-black/5 hover:bg-black/10 text-text-primary text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedLead.email}?subject=Reply to your portfolio inquiry&body=Hi ${selectedLead.name},%0D%0A%0D%0AThank you for reaching out...`}
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" /> Direct Reply
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
