"use client";

import type { Dictionary } from "@/i18n/types";
import { FadeInUp, StaggerContainer, StaggerItem, ScaleIn } from "./animations";

export default function Contact({ dict }: { dict: Dictionary["contact"] }) {
  const contactLinks = [
    {
      label: "Email",
      value: dict.email,
      href: `mailto:${dict.email}`,
      icon: "✉️",
      color: "bg-neo-yellow",
    },
    {
      label: "Phone",
      value: dict.phone,
      href: `tel:+6282228777987`,
      icon: "📱",
      color: "bg-neo-green",
    },
    {
      label: "LinkedIn",
      value: dict.linkedin,
      href: "https://www.linkedin.com/in/eka-maylinda-nely-037a53345",
      icon: "💼",
      color: "bg-neo-blue",
    },
    {
      label: "Location",
      value: dict.location,
      href: "https://maps.google.com/?q=Mojokerto,Indonesia",
      icon: "📍",
      color: "bg-neo-purple",
    },
  ];

  return (
    <section className="py-12 sm:py-16" id="contact">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeInUp>
          <h2 className="neo-badge bg-neo-purple mb-8 sm:mb-10">{dict.title}</h2>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="neo-card p-5 sm:p-6 md:p-10">
            <p className="text-base sm:text-lg font-medium mb-6 sm:mb-8 max-w-lg">
              {dict.description}
            </p>

            <StaggerContainer
              staggerDelay={0.1}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
            >
              {contactLinks.map((link) => (
                <StaggerItem key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`neo-btn ${link.color} p-4 sm:p-5 flex items-center gap-3 sm:gap-4 text-left w-full`}
                  >
                    <span className="text-2xl sm:text-3xl shrink-0">
                      {link.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="font-black text-sm sm:text-base">
                        {link.label}
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-neo-border/60 truncate">
                        {link.value}
                      </p>
                    </div>
                  </a>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Fun CTA */}
            <ScaleIn delay={0.3}>
              <div className="mt-8 sm:mt-10 neo-card bg-neo-green p-5 sm:p-6 text-center">
                <p className="text-lg sm:text-xl font-black">{dict.cta}</p>
                <a
                  href={`mailto:${dict.email}`}
                  className="neo-btn bg-neo-border text-white px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base mt-3 sm:mt-4 inline-block"
                >
                  {dict.ctaButton}
                </a>
              </div>
            </ScaleIn>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
