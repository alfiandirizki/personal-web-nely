"use client";

import type { Dictionary } from "@/i18n/types";
import { FadeInUp, ScaleIn, FadeInLeft } from "./animations";

export default function Education({ dict }: { dict: Dictionary["education"] }) {
  return (
    <section className="py-12 sm:py-16" id="education">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeInUp>
          <h2 className="neo-badge bg-neo-green mb-8 sm:mb-10">{dict.title}</h2>
        </FadeInUp>

        {/* Degree */}
        <ScaleIn delay={0.1}>
          <div className="neo-card p-5 sm:p-6 md:p-8 bg-neo-green/10 mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <span className="text-2xl sm:text-4xl shrink-0">🎓</span>
              <div className="min-w-0">
                <span className="neo-tag mb-2 sm:mb-3 inline-block">
                  {dict.period}
                </span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black mt-1 sm:mt-2 leading-tight">
                  {dict.degree}
                </h3>
                <p className="font-bold text-sm sm:text-base text-neo-border/60 mt-1">
                  {dict.school}
                </p>
              </div>
            </div>
          </div>
        </ScaleIn>

        {/* Publication */}
        <FadeInLeft delay={0.2}>
          <div className="neo-card p-5 sm:p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 sm:w-2 h-full bg-neo-purple" />
            <div className="pl-3 sm:pl-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="neo-btn bg-neo-purple px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
                  📄
                </span>
                <h3 className="text-base sm:text-lg font-black">
                  {dict.publicationTitle}
                </h3>
              </div>
              <span className="neo-tag mb-3 sm:mb-4 inline-block">
                {dict.publicationPeriod}
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-neo-border/70 mt-2 sm:mt-3 break-words-mobile">
                {dict.publicationText}
              </p>
            </div>
          </div>
        </FadeInLeft>
      </div>
    </section>
  );
}
