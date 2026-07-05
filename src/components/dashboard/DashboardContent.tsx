"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import ProfileTab from "./tabs/ProfileTab";
import ExperienceTab from "./tabs/ExperienceTab";
import EducationTab from "./tabs/EducationTab";
import SkillsTab from "./tabs/SkillsTab";
import OverviewTab from "./tabs/OverviewTab";

type Tab = "overview" | "profile" | "experience" | "education" | "skills";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "skills", label: "Skills", icon: "🛠️" },
];

export default function DashboardContent({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/id/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r-2 border-neo-border bg-surface fixed top-0 left-0 bottom-0 z-40">
        {/* Logo */}
        <div className="p-5 border-b-2 border-neo-border">
          <span className="neo-btn bg-neo-green px-3 py-1.5 text-base font-black inline-block">
            EN.
          </span>
          <span className="ml-2 font-black text-sm">Dashboard</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${
                activeTab === tab.id
                  ? "bg-neo-yellow border-2 border-neo-border shadow-[3px_3px_0px_0px_#1a1a1a]"
                  : "hover:bg-neo-border/5 border-2 border-transparent"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t-2 border-neo-border">
          <p className="text-xs text-neo-border/60 font-medium truncate mb-3">
            {user.email}
          </p>
          <button
            onClick={handleLogout}
            className="neo-btn bg-neo-red/20 w-full py-2 text-xs text-center hover:bg-neo-red/40"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-64 border-r-2 border-neo-border bg-surface z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b-2 border-neo-border flex items-center justify-between">
          <div>
            <span className="neo-btn bg-neo-green px-3 py-1.5 text-sm font-black inline-block">
              EN.
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="neo-btn bg-neo-red/30 p-1.5 text-xs"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${
                activeTab === tab.id
                  ? "bg-neo-yellow border-2 border-neo-border shadow-[3px_3px_0px_0px_#1a1a1a]"
                  : "hover:bg-neo-border/5 border-2 border-transparent"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t-2 border-neo-border">
          <p className="text-xs text-neo-border/60 font-medium truncate mb-3">
            {user.email}
          </p>
          <button
            onClick={handleLogout}
            className="neo-btn bg-neo-red/20 w-full py-2 text-xs text-center"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        {/* Top bar - Mobile */}
        <header className="lg:hidden sticky top-0 z-30 bg-background border-b-2 border-neo-border px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="neo-btn bg-neo-blue p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-black text-sm">
            {tabs.find((t) => t.id === activeTab)?.icon}{" "}
            {tabs.find((t) => t.id === activeTab)?.label}
          </span>
          <button
            onClick={handleLogout}
            className="neo-btn bg-neo-red/30 px-3 py-1.5 text-xs"
          >
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-5xl">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "experience" && <ExperienceTab />}
          {activeTab === "education" && <EducationTab />}
          {activeTab === "skills" && <SkillsTab />}
        </main>
      </div>
    </div>
  );
}
