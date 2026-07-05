"use client";

import type { Dictionary } from "@/i18n/types";
import { FadeInUp, StaggerContainer, StaggerItem } from "./animations";

const icons = ["🤝", "💻", "🔬", "📋"];
const colorList = ["bg-neo-pink", "bg-neo-blue", "bg-neo-green", "bg-neo-orange"];

export default function Skills({ dict }: { dict: Dictionary["skills"] }) {
  return (
    <section className="py-12 sm:py-16" id="skills">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeInUp>
          <h2 className="neo-badge bg-neo-orange mb-8 sm:mb-10">{dict.title}</h2>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="neo-card p-5 sm:p-6 md:p-8">
            <StaggerContainer
              staggerDelay={0.12}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            >
              {dict.categories.map((cat, index) => (
                <StaggerItem key={cat.category}>
                  <div className="p-4 sm:p-5 rounded-xl border-2 border-neo-border shadow-[2px_2px_0px_0px_#1a1a1a] bg-background h-full">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                      <span
                        className={`${colorList[index % colorList.length]} border-2 border-neo-border rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl shadow-[2px_2px_0px_0px_#1a1a1a]`}
                      >
                        {icons[index % icons.length]}
                      </span>
                      <h3 className="font-black text-base sm:text-lg">
                        {cat.category}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {cat.skills.map((skill) => (
                        <span key={skill} className="neo-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
