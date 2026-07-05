"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OverviewTab() {
  const [counts, setCounts] = useState({
    experiences: 0,
    education: 0,
    categories: 0,
    skills: 0,
  });
  const [views, setViews] = useState({ total: 0, today: 0, week: 0 });
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const [exp, edu, cat, skill, msgs] = await Promise.all([
        supabase.from("experiences").select("id", { count: "exact", head: true }),
        supabase.from("education").select("id", { count: "exact", head: true }),
        supabase.from("skill_categories").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false),
      ]);
      setCounts({
        experiences: exp.count || 0,
        education: edu.count || 0,
        categories: cat.count || 0,
        skills: skill.count || 0,
      });
      setUnreadMessages(msgs.count || 0);

      // Page views
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [totalViews, todayViews, weekViews] = await Promise.all([
        supabase.from("page_views").select("id", { count: "exact", head: true }),
        supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
        supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
      ]);
      setViews({
        total: totalViews.count || 0,
        today: todayViews.count || 0,
        week: weekViews.count || 0,
      });

      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black">👋 Selamat datang!</h1>
        <p className="text-sm sm:text-base text-neo-border/60 mt-2">
          Kelola konten website personal kamu dari dashboard ini.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard value={loading ? "—" : String(views.today)} label="Views Hari Ini" color="bg-neo-green" />
        <StatCard value={loading ? "—" : String(views.week)} label="Views Minggu Ini" color="bg-neo-blue" />
        <StatCard value={loading ? "—" : String(views.total)} label="Total Views" color="bg-neo-yellow" />
        <StatCard value={loading ? "—" : String(unreadMessages)} label="Pesan Belum Dibaca" color="bg-neo-pink" />
      </div>

      {/* Content stats */}
      <div className="neo-card p-5 sm:p-6">
        <h3 className="font-black text-base mb-4">📝 Konten</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center">
            <p className="text-2xl font-black">{loading ? "—" : counts.experiences}</p>
            <p className="text-xs text-neo-border/60 font-bold">Experience</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black">{loading ? "—" : counts.education}</p>
            <p className="text-xs text-neo-border/60 font-bold">Education</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black">{loading ? "—" : counts.categories}</p>
            <p className="text-xs text-neo-border/60 font-bold">Kategori</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black">{loading ? "—" : counts.skills}</p>
            <p className="text-xs text-neo-border/60 font-bold">Skills</p>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="neo-card p-5 sm:p-6">
        <h3 className="font-black text-base mb-4">🔗 Quick Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="/id"
            target="_blank"
            className="neo-btn bg-neo-blue px-4 py-3 text-sm text-center block"
          >
            🌐 Website (ID)
          </a>
          <a
            href="/en"
            target="_blank"
            className="neo-btn bg-neo-purple px-4 py-3 text-sm text-center block"
          >
            🇬🇧 Website (EN)
          </a>
        </div>
      </div>

      {/* Tips */}
      <div className="neo-card p-5 sm:p-6 bg-neo-green/10">
        <h3 className="font-black text-base mb-2">💡 Tips</h3>
        <ul className="space-y-2 text-sm text-neo-border/70">
          <li className="flex gap-2">
            <span>•</span>
            <span>Gunakan tab di sidebar untuk navigasi antar section</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Semua perubahan langsung tersimpan ke database</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Konten tersedia dalam 2 bahasa (EN/ID)</span>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <span>Website publik otomatis update setelah save</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className={`neo-card p-4 sm:p-5 ${color}/20`}>
      <p className="text-3xl sm:text-4xl font-black">{value}</p>
      <p className="text-xs sm:text-sm font-bold text-neo-border/60 mt-1">
        {label}
      </p>
    </div>
  );
}
