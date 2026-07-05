"use client";

import type { Dictionary } from "@/i18n/types";
import {
  FadeInUp,
  FadeInLeft,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
} from "./animations";

export default function About({ dict }: { dict: Dictionary["about"] }) {
  return (
    <section className="py-12 sm:py-16" id="about">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeInUp>
          <h2 className="neo-badge bg-neo-blue mb-8 sm:mb-10">{dict.title}</h2>
        </FadeInUp>

        <FadeInLeft delay={0.1}>
          <div className="neo-card p-5 sm:p-6 md:p-8">
            <div className="grid md:grid-cols-[2fr_1fr] gap-6 sm:gap-8">
              {/* About text */}
              <div className="space-y-3 sm:space-y-4">
                <p className="text-base sm:text-lg leading-relaxed">{dict.p1}</p>
                <p className="text-base sm:text-lg leading-relaxed text-neo-border/70">
                  {dict.p2}
                </p>
                <p className="text-base sm:text-lg leading-relaxed text-neo-border/70">
                  {dict.p3}
                </p>
              </div>

              {/* Stats */}
              <StaggerContainer
                staggerDelay={0.15}
                className="grid grid-cols-3 md:grid-cols-1 gap-3 sm:gap-4"
              >
                <StaggerItem>
                  <ScaleIn delay={0.2}>
                    <div className="p-3 sm:p-5 bg-neo-yellow rounded-xl border-2 border-neo-border shadow-[2px_2px_0px_0px_#1a1a1a] text-center md:text-left">
                      <p className="text-2xl sm:text-4xl font-black">3+</p>
                      <p className="font-bold text-xs sm:text-sm mt-1 text-neo-border/70">
                        {dict.stat1Label}
                      </p>
                    </div>
                  </ScaleIn>
                </StaggerItem>
                <StaggerItem>
                  <ScaleIn delay={0.35}>
                    <div className="p-3 sm:p-5 bg-neo-pink rounded-xl border-2 border-neo-border shadow-[2px_2px_0px_0px_#1a1a1a] text-center md:text-left">
                      <p className="text-2xl sm:text-4xl font-black">1K+</p>
                      <p className="font-bold text-xs sm:text-sm mt-1 text-neo-border/70">
                        {dict.stat2Label}
                      </p>
                    </div>
                  </ScaleIn>
                </StaggerItem>
                <StaggerItem>
                  <ScaleIn delay={0.5}>
                    <div className="p-3 sm:p-5 bg-neo-green rounded-xl border-2 border-neo-border shadow-[2px_2px_0px_0px_#1a1a1a] text-center md:text-left">
                      <p className="text-2xl sm:text-4xl font-black">1</p>
                      <p className="font-bold text-xs sm:text-sm mt-1 text-neo-border/70">
                        {dict.stat3Label}
                      </p>
                    </div>
                  </ScaleIn>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </FadeInLeft>
      </div>
    </section>
  );
}
