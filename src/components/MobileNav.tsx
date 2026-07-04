"use client";

import { useState, useEffect } from "react";
import type { Dictionary } from "@/i18n/types";
import LanguageSwitcher from "./LanguageSwitcher";

export default function MobileNav({
  dict,
  locale,
}: {
  dict: Dictionary["nav"];
  locale: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger buttons */}
      <div className="md:hidden flex items-center gap-2">
        <LanguageSwitcher locale={locale} />
        <button
          onClick={() => setIsOpen(true)}
          className="neo-btn bg-neo-blue p-2"
          aria-label="Open menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`mobile-menu-overlay ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-in menu */}
      <nav
        className={`mobile-menu ${isOpen ? "active" : ""}`}
        aria-label="Mobile navigation"
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="neo-btn bg-neo-red p-2 self-end mb-4"
          aria-label="Close menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Links */}
        <a
          href="#about"
          onClick={() => setIsOpen(false)}
          className="neo-btn bg-neo-blue px-5 py-3 text-base text-center"
        >
          {dict.about}
        </a>
        <a
          href="#experience"
          onClick={() => setIsOpen(false)}
          className="neo-btn bg-neo-pink px-5 py-3 text-base text-center"
        >
          {dict.experience}
        </a>
        <a
          href="#education"
          onClick={() => setIsOpen(false)}
          className="neo-btn bg-neo-green px-5 py-3 text-base text-center"
        >
          {dict.education}
        </a>
        <a
          href="#skills"
          onClick={() => setIsOpen(false)}
          className="neo-btn bg-neo-orange px-5 py-3 text-base text-center"
        >
          {dict.skills}
        </a>
        <a
          href="#contact"
          onClick={() => setIsOpen(false)}
          className="neo-btn bg-neo-purple px-5 py-3 text-base text-center"
        >
          {dict.contact}
        </a>
      </nav>
    </>
  );
}
