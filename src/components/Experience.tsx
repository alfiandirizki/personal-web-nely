"use client";

import type { Dictionary } from "@/i18n/types";
import {
  FadeInUp,
  FadeInLeft,
  StaggerContainer,
  StaggerItem,
} from "./animations";

const colors = [
  "bg-neo-pink",
  "bg-neo-blue",
  "bg-neo-green",
  "bg-neo-purple",
  "bg-neo-orange",
];

function ExperienceCard({
  exp,
  color,
}: {
  exp: {
    title: string;
    company: string;
    period: string;
    description: string[];
    highlights: string[];
  };
  color: string;
}) {
  return (
    <article className="neo-card p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Color accent bar */}
      <div className={`absolute top-0 left-0 w-1.5 sm:w-2 h-full ${color}`} />

      <div className="pl-3 sm:pl-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl md:text-2xl font-black leading-tight">
              {exp.title}
            </h3>
            <p className="text-sm sm:text-base font-bold text-neo-border/60 mt-0.5 break-words-mobile">
              {exp.company}
            </p>
          </div>
          <span
            className={`neo-btn ${color} px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm whitespace-nowrap self-start`}
          >
            {exp.period}
          </span>
        </div>
        <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5">
          {exp.description.map((item, i) => (
            <li
              key={i}
              className="text-xs sm:text-sm leading-relaxed text-neo-border/70 flex gap-2"
            >
              <span className="shrink-0 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {exp.highlights.map((tag) => (
            <span key={tag} className="neo-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Experience({
  dict,
}: {
  dict: Dictionary["experience"];
}) {
  return (
    <section className="py-12 sm:py-16" id="experience">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeInUp>
          <h2 className="neo-badge bg-neo-pink mb-8 sm:mb-10">{dict.title}</h2>
        </FadeInUp>

        {/* Work Experience */}
        <div className="mb-6 sm:mb-8">
          <FadeInLeft delay={0.1}>
            <h3 className="text-base sm:text-lg font-black mb-3 sm:mb-4 inline-flex items-center gap-2">
              <span className="neo-btn bg-neo-yellow px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
                💼
              </span>
              {dict.workLabel}
            </h3>
          </FadeInLeft>
          <StaggerContainer staggerDelay={0.15} className="space-y-4 sm:space-y-6">
            {dict.jobs.map((exp, index) => (
              <StaggerItem key={index}>
                <ExperienceCard
                  exp={exp}
                  color={colors[index % colors.length]}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Internship */}
        <div className="mb-6 sm:mb-8">
          <FadeInLeft delay={0.1}>
            <h3 className="text-base sm:text-lg font-black mb-3 sm:mb-4 inline-flex items-center gap-2">
              <span className="neo-btn bg-neo-green px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
                🌿
              </span>
              {dict.internLabel}
            </h3>
          </FadeInLeft>
          <FadeInUp delay={0.2}>
            <ExperienceCard exp={dict.internship} color="bg-neo-green" />
          </FadeInUp>
        </div>

        {/* Organizational */}
        <div>
          <FadeInLeft delay={0.1}>
            <h3 className="text-base sm:text-lg font-black mb-3 sm:mb-4 inline-flex items-center gap-2">
              <span className="neo-btn bg-neo-purple px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
                🎯
              </span>
              {dict.orgLabel}
            </h3>
          </FadeInLeft>
          <StaggerContainer staggerDelay={0.15} className="space-y-4 sm:space-y-6">
            {dict.organizational.map((exp, index) => (
              <StaggerItem key={index}>
                <ExperienceCard
                  exp={exp}
                  color={colors[(index + 3) % colors.length]}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
