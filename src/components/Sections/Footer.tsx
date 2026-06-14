"use client";

import React from "react";

interface FooterProps {
  whatsappUrl: string;
}

export default function Footer({ whatsappUrl }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-dark border-t border-graphite/10 py-8 relative">
      <div className="container mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-center items-center gap-4 text-center sm:text-left">
        {/* Copyright info */}
        <p className="text-text-secondary text-sm font-light">
          &copy; {currentYear}. Designed & Developed by{" "}
          <span className="text-primary font-semibold">Krishan Kumar Rathore</span>. All rights reserved.
        </p>

        {/* Dynamic signature */}
        <span className="text-xs text-graphite/40 uppercase tracking-widest font-bold">
          Full Stack Excellence
        </span>
      </div>

      {/* Floating WhatsApp Action Icon */}
      <div className="fixed bottom-8 right-6 z-40 animate-bounce duration-1000">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 group"
          aria-label="Contact on WhatsApp"
        >
          {/* Custom SVG WhatsApp inside floating bubble */}
          <svg
            className="w-7 h-7 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.835-2.267c1.554.921 3.193 1.407 4.908 1.408 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.865 4.412 14.39 3.38 11.758 3.38c-5.437 0-9.861 4.42-9.866 9.865-.001 1.83.483 3.61 1.401 5.163l-.99 3.61 3.733-.978zM17.51 15.68c-.287-.144-1.702-.84-1.965-.936-.264-.096-.456-.144-.648.144-.192.288-.744.936-.912 1.128-.168.192-.336.216-.624.072-1.359-.68-2.34-1.196-3.23-2.73-.235-.406-.05-.623.094-.766.13-.13.287-.336.43-.504.145-.168.193-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.234-.564-.47-.487-.648-.496-.168-.009-.36-.009-.552-.009-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.4s1.032 2.784 1.176 2.976c.144.192 2.031 3.1 4.921 4.352.687.297 1.224.474 1.642.607.69.22 1.32.19 1.816.116.553-.084 1.702-.696 1.942-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.216-.552-.36z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
