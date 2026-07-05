"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Dictionary } from "@/i18n/types";
import type { Profile, Experience as ExpType, Education as EduType, SkillCategory, Skill, Publication } from "@/lib/supabase/types";
import Hero from "./Hero";
import About from "./About";
import Experience from "./Experience";
import Education from "./Education";
import Skills from "./Skills";
import Contact from "./Contact";

type FetchState = "pending" | "loading" | "success" | "failed" | "empty";

interface SiteData {
  profile: Profile | null;
  experiences: ExpType[];
  education: EduType[];
  skillCategories: (SkillCategory & { skills: Skill[] })[];
  publications: Publication[];
}

export default function LandingContent({
  locale,
  dict,
}: {
  locale: string;
  dict: Dictionary;
}) {
  const [state, setState] = useState<FetchState>("pending");
  const [data, setData] = useState<SiteData | null>(null);

  useEffect(() => {
    fetchSiteData();
  }, []);

  async function fetchSiteData() {
    setState("loading");

    try {
      const supabase = createClient();

      const [profileRes, expRes, eduRes, catRes, skillRes, pubRes] =
        await Promise.all([
          supabase.from("profile").select("*").single(),
          supabase.from("experiences").select("*").order("sort_order"),
          supabase.from("education").select("*").order("sort_order"),
          supabase.from("skill_categories").select("*").order("sort_order"),
          supabase.from("skills").select("*").order("sort_order"),
          supabase.from("publications").select("*").order("year", { ascending: false }),
        ]);

      // Check if we got valid data
      if (!profileRes.data && !expRes.data?.length) {
        setState("empty");
        return;
      }

      const skillCategories = (catRes.data || []).map((cat) => ({
        ...cat,
        skills: (skillRes.data || []).filter((s) => s.category_id === cat.id),
      }));

      setData({
        profile: profileRes.data,
        experiences: expRes.data || [],
        education: eduRes.data || [],
        skillCategories,
        publications: pubRes.data || [],
      });
      setState("success");
    } catch {
      setState("failed");
    }
  }

  // PENDING state
  if (state === "pending") {
    return <LoadingSkeleton />;
  }

  // LOADING state
  if (state === "loading") {
    return <LoadingSkeleton />;
  }

  // FAILED state
  if (state === "failed") {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="neo-card p-8 sm:p-12 text-center bg-neo-red/10">
          <span className="text-5xl mb-4 block">😵</span>
          <h2 className="text-xl sm:text-2xl font-black mb-2">
            Oops! Gagal memuat data
          </h2>
          <p className="text-sm text-neo-border/60 mb-6">
            Terjadi kesalahan saat mengambil data. Coba refresh halaman.
          </p>
          <button
            onClick={() => fetchSiteData()}
            className="neo-btn bg-neo-yellow px-6 py-3 text-sm"
          >
            🔄 Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // EMPTY state
  if (state === "empty") {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="neo-card p-8 sm:p-12 text-center bg-neo-blue/10">
          <span className="text-5xl mb-4 block">📭</span>
          <h2 className="text-xl sm:text-2xl font-black mb-2">
            Belum ada data
          </h2>
          <p className="text-sm text-neo-border/60 mb-6">
            Database masih kosong. Silakan jalankan migration SQL dan tambahkan
            konten melalui dashboard.
          </p>
          <a
            href={`/${locale}/login`}
            className="neo-btn bg-neo-green px-6 py-3 text-sm inline-block"
          >
            🔐 Masuk ke Dashboard
          </a>
        </div>
      </div>
    );
  }

  // SUCCESS state — render with data from Supabase
  if (!data) return null;

  const isId = locale === "id";

  // Build dict-compatible structures from Supabase data
  const heroDict = data.profile
    ? {
        ...dict.hero,
        title: data.profile.name.split(",")[0] || dict.hero.title,
        subtitle: data.profile.title
          ? `S.P. — ${data.profile.title}`
          : dict.hero.subtitle,
        description: isId
          ? data.profile.description_id
          : data.profile.description_en,
        location: `📍 ${data.profile.location}`,
        university: `🎓 ${data.profile.university}`,
      }
    : dict.hero;

  const aboutDict = data.profile
    ? {
        ...dict.about,
        p1: isId ? data.profile.description_id : data.profile.description_en,
        p2: dict.about.p2,
        p3: dict.about.p3,
      }
    : dict.about;

  const experienceDict = {
    ...dict.experience,
    jobs: data.experiences
      .filter((e) => e.type === "work")
      .map((e) => ({
        title: isId ? e.title_id : e.title_en,
        company: e.company,
        period: isId ? e.period_id : e.period_en,
        description: isId ? e.description_id : e.description_en,
        highlights: e.highlights,
      })),
    internship: (() => {
      const intern = data.experiences.find((e) => e.type === "internship");
      if (intern) {
        return {
          title: isId ? intern.title_id : intern.title_en,
          company: intern.company,
          period: isId ? intern.period_id : intern.period_en,
          description: isId ? intern.description_id : intern.description_en,
          highlights: intern.highlights,
        };
      }
      return dict.experience.internship;
    })(),
    organizational: data.experiences
      .filter((e) => e.type === "organizational")
      .map((e) => ({
        title: isId ? e.title_id : e.title_en,
        company: e.company,
        period: isId ? e.period_id : e.period_en,
        description: isId ? e.description_id : e.description_en,
        highlights: e.highlights,
      })),
  };

  const educationDict = (() => {
    const edu = data.education[0];
    const pub = data.publications[0];
    return {
      ...dict.education,
      degree: edu ? (isId ? edu.degree_id : edu.degree_en) : dict.education.degree,
      school: edu ? (isId ? edu.school_id : edu.school_en) : dict.education.school,
      period: edu ? (isId ? edu.period_id : edu.period_en) : dict.education.period,
      publicationText: pub
        ? `${pub.authors}. ${pub.year}. ${pub.title}. ${pub.journal}.`
        : dict.education.publicationText,
      publicationPeriod: pub
        ? isId ? pub.period_id : pub.period_en
        : dict.education.publicationPeriod,
    };
  })();

  const skillsDict = {
    ...dict.skills,
    categories: data.skillCategories.map((cat) => ({
      category: isId ? cat.category_id : cat.category_en,
      skills: cat.skills.map((s) => (isId ? s.name_id : s.name_en)),
    })),
  };

  const contactDict = data.profile
    ? {
        ...dict.contact,
        email: data.profile.email,
        phone: data.profile.phone,
        linkedin: data.profile.name.split(",")[0] || dict.contact.linkedin,
        location: data.profile.location,
      }
    : dict.contact;

  return (
    <>
      <Hero dict={heroDict} photoUrl={data?.profile?.photo_url} cvUrl={data?.profile?.cv_url} />
      <div className="wavy-divider max-w-6xl mx-auto" />
      <About dict={aboutDict} />
      <div className="wavy-divider max-w-6xl mx-auto" />
      <Experience dict={experienceDict} />
      <div className="wavy-divider max-w-6xl mx-auto" />
      <Education dict={educationDict} />
      <div className="wavy-divider max-w-6xl mx-auto" />
      <Skills dict={skillsDict} />
      <div className="wavy-divider max-w-6xl mx-auto" />
      <Contact dict={contactDict} locale={locale} />
    </>
  );
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Hero skeleton */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-2xl bg-neo-border/10 animate-pulse shrink-0" />
        <div className="space-y-4 w-full max-w-lg">
          <div className="h-8 w-32 bg-neo-green/30 rounded-lg animate-pulse" />
          <div className="h-12 w-3/4 bg-neo-border/10 rounded-lg animate-pulse" />
          <div className="h-6 w-1/2 bg-neo-border/10 rounded-lg animate-pulse" />
          <div className="h-20 w-full bg-neo-border/5 rounded-lg animate-pulse" />
          <div className="flex gap-3">
            <div className="h-11 w-36 bg-neo-pink/30 rounded-lg animate-pulse" />
            <div className="h-11 w-36 bg-neo-blue/30 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-1.5 bg-neo-border/10 rounded animate-pulse" />

      {/* About skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-40 bg-neo-blue/30 rounded-lg animate-pulse" />
        <div className="grid md:grid-cols-[2fr_1fr] gap-6">
          <div className="h-48 bg-neo-border/5 rounded-2xl animate-pulse" />
          <div className="space-y-3">
            <div className="h-20 bg-neo-yellow/20 rounded-2xl animate-pulse" />
            <div className="h-20 bg-neo-pink/20 rounded-2xl animate-pulse" />
            <div className="h-20 bg-neo-green/20 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-1.5 bg-neo-border/10 rounded animate-pulse" />

      {/* Experience skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-44 bg-neo-pink/30 rounded-lg animate-pulse" />
        <div className="h-32 bg-neo-border/5 rounded-2xl animate-pulse" />
        <div className="h-32 bg-neo-border/5 rounded-2xl animate-pulse" />
      </div>

      {/* Divider */}
      <div className="h-1.5 bg-neo-border/10 rounded animate-pulse" />

      {/* Skills skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-36 bg-neo-orange/30 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-36 bg-neo-border/5 rounded-2xl animate-pulse" />
          <div className="h-36 bg-neo-border/5 rounded-2xl animate-pulse" />
          <div className="h-36 bg-neo-border/5 rounded-2xl animate-pulse" />
          <div className="h-36 bg-neo-border/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
