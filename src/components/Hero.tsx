"use client";

import Image from "next/image";
import type { Dictionary } from "@/i18n/types";
import { FadeInLeft, FadeInRight, Float, FadeInUp } from "./animations";

export default function Hero({ dict }: { dict: Dictionary["hero"] }) {
  return (
    <section className="py-10 sm:py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-16">
          {/* Profile Photo with stickers */}
          <FadeInLeft delay={0.2} className="shrink-0">
            <Float duration={4} y={6}>
              <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64">
                <Image
                  src="/profile.jpg"
                  alt="Eka Maylinda Nely Nur Rohmah"
                  fill
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 208px, 256px"
                  className="profile-img object-cover"
                  priority
                />
                {/* Stickers — inside Float so they move with the photo */}
                <span className="absolute -top-3 -right-4 sm:-top-4 sm:-right-5 neo-btn bg-neo-yellow px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm rotate-[8deg] z-10">
                  🌱 Fresh Grad
                </span>
                <span className="absolute -bottom-3 -left-4 sm:-bottom-4 sm:-left-5 neo-btn bg-neo-green px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm rotate-[-6deg] z-10">
                  🌿 Agriculture
                </span>
              </div>
            </Float>
          </FadeInLeft>

          {/* Text Content */}
          <div className="text-center md:text-left w-full">
            {/* Status pill */}
            <FadeInRight delay={0.1}>
              <div className="inline-flex items-center gap-2 neo-btn bg-neo-green px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm mb-4 sm:mb-6">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-600 animate-pulse" />
                {dict.badge}
              </div>
            </FadeInRight>

            <FadeInRight delay={0.2}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                {dict.title}
              </h1>
            </FadeInRight>

            <FadeInRight delay={0.3}>
              <p className="text-base sm:text-lg md:text-xl font-bold mt-2 sm:mt-3 text-neo-border/70">
                {dict.subtitle}
              </p>
            </FadeInRight>

            <FadeInRight delay={0.4}>
              <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-neo-border/60 max-w-lg mx-auto md:mx-0 leading-relaxed">
                {dict.description}
              </p>
            </FadeInRight>

            {/* CTA Buttons */}
            <FadeInUp delay={0.5}>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                <a
                  href="#contact"
                  className="neo-btn bg-neo-pink px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base text-center"
                >
                  {dict.cta1}
                </a>
                <a
                  href="#experience"
                  className="neo-btn bg-neo-blue px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base text-center"
                >
                  {dict.cta2}
                </a>
              </div>
            </FadeInUp>

            {/* Quick info tags */}
            <FadeInUp delay={0.6}>
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
                <span className="neo-tag">{dict.location}</span>
                <span className="neo-tag">{dict.university}</span>
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  );
}
