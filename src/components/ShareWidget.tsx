"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Check, X } from "lucide-react";

export default function ShareWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const shareText = "Check out Krishan Kumar Rathore's personal portfolio! A dynamic Full Stack Software Engineer.";

  useEffect(() => {
    // Safely set client-side URL
    setShareUrl(window.location.href);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const shareOptions = [
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-[#0077b5] hover:text-white dark:hover:bg-[#0077b5] dark:hover:text-white",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      color: "hover:bg-[#25D366] hover:text-white dark:hover:bg-[#25D366] dark:hover:text-white",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.835-2.267c1.554.921 3.193 1.407 4.908 1.408 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.865 4.412 14.39 3.38 11.758 3.38c-5.437 0-9.861 4.42-9.866 9.865-.001 1.83.483 3.61 1.401 5.163l-.99 3.61 3.733-.978zM17.51 15.68c-.287-.144-1.702-.84-1.965-.936-.264-.096-.456-.144-.648.144-.192.288-.744.936-.912 1.128-.168.192-.336.216-.624.072-1.359-.68-2.34-1.196-3.23-2.73-.235-.406-.05-.623.094-.766.13-.13.287-.336.43-.504.145-.168.193-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.234-.564-.47-.487-.648-.496-.168-.009-.36-.009-.552-.009-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.4s1.032 2.784 1.176 2.976c.144.192 2.031 3.1 4.921 4.352.687.297 1.224.474 1.642.607.69.22 1.32.19 1.816.116.553-.084 1.702-.696 1.942-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.216-.552-.36z" />
        </svg>
      ),
    },
    {
      name: "X (Twitter)",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-foreground hover:text-background dark:hover:bg-foreground dark:hover:text-background",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-[#1877f2] hover:text-white dark:hover:bg-[#1877f2] dark:hover:text-white",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: "hover:bg-[#0088cc] hover:text-white dark:hover:bg-[#0088cc] dark:hover:text-white",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.56 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.501 1.201-.82 1.23-.703.064-1.237-.465-1.917-.911-1.066-.698-1.67-1.131-2.703-1.811-1.196-.786-.42-1.218.261-1.927.178-.185 3.284-3.012 3.344-3.266.007-.032.014-.15-.056-.212s-.173-.041-.248-.024c-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.753-.245-1.351-.375-1.299-.791.027-.217.327-.44.898-.67 3.511-1.53 5.852-2.54 7.022-3.03 3.345-1.396 4.041-1.638 4.495-1.646.099-.002.321.023.465.14.12.097.153.228.165.326.012.099.016.321-.005.474z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-8 left-6 z-50 flex flex-col-reverse items-center gap-3">
      {/* Main Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-[0_6px_24px_rgba(197,155,76,0.3)] z-50 border border-primary/20 cursor-pointer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Share page"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Share2 className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating Share Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="flex flex-col gap-2 p-2.5 rounded-3xl glass-panel-premium border border-border-subtle shadow-2xl items-center"
          >
            {shareOptions.map((option, idx) => (
              <motion.a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`w-11 h-11 rounded-full flex items-center justify-center text-text-secondary bg-bg-subtle hover:scale-108 active:scale-95 border border-border-subtle transition-all duration-300 group relative ${option.color}`}
                aria-label={`Share on ${option.name}`}
              >
                {option.icon}
                {/* Tooltip */}
                <span className="absolute left-14 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-bg-card text-text-primary text-xs font-semibold py-1.5 px-3 rounded-xl shadow-lg border border-border-subtle whitespace-nowrap pointer-events-none z-[60]">
                  {option.name}
                </span>
              </motion.a>
            ))}

            {/* Divider */}
            <div className="w-6 h-[1px] bg-border-subtle my-1" />

            {/* Copy Link Option */}
            <motion.button
              onClick={handleCopyLink}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shareOptions.length * 0.04 }}
              className={`w-11 h-11 rounded-full flex items-center justify-center text-text-secondary bg-bg-subtle hover:scale-108 active:scale-95 border border-border-subtle transition-all duration-300 group relative cursor-pointer ${
                copied
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "hover:bg-primary hover:text-white dark:hover:text-bg-dark"
              }`}
              aria-label="Copy Page Link"
            >
              {copied ? <Check className="w-5 h-5 text-primary" /> : <Copy className="w-4 h-4" />}
              {/* Tooltip */}
              <span className="absolute left-14 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-bg-card text-text-primary text-xs font-semibold py-1.5 px-3 rounded-xl shadow-lg border border-border-subtle whitespace-nowrap pointer-events-none z-[60]">
                {copied ? "Copied!" : "Copy Link"}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
