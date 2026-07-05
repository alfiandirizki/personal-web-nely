"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

export default function ProfileTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data } = await supabase.from("profile").select("*").single();
    setProfile(data);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profile")
      .update({
        name: profile.name,
        title: profile.title,
        description_en: profile.description_en,
        description_id: profile.description_id,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        linkedin_url: profile.linkedin_url,
        university: profile.university,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    setSaving(false);
    setMessage(error ? `❌ ${error.message}` : "✅ Tersimpan!");
    setTimeout(() => setMessage(""), 3000);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-neo-border/10 rounded-lg animate-pulse" />
        <div className="h-96 bg-neo-border/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="neo-card p-6 text-center bg-neo-red/10">
        <p className="font-bold">Profile belum ada. Jalankan SQL migration dulu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">👤 Profile</h1>
        {message && (
          <span className="neo-btn bg-neo-green/30 px-3 py-1 text-xs">{message}</span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="neo-card p-5 sm:p-6 space-y-4">
          <h3 className="font-black text-sm text-neo-border/60 uppercase tracking-wide">
            Informasi Dasar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Nama Lengkap" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
            <FormInput label="Title / Gelar" value={profile.title} onChange={(v) => setProfile({ ...profile, title: v })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Email" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} type="email" />
            <FormInput label="Phone" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Lokasi" value={profile.location} onChange={(v) => setProfile({ ...profile, location: v })} />
            <FormInput label="Universitas" value={profile.university} onChange={(v) => setProfile({ ...profile, university: v })} />
          </div>
          <FormInput label="LinkedIn URL" value={profile.linkedin_url} onChange={(v) => setProfile({ ...profile, linkedin_url: v })} type="url" />
        </div>

        {/* Description */}
        <div className="neo-card p-5 sm:p-6 space-y-4">
          <h3 className="font-black text-sm text-neo-border/60 uppercase tracking-wide">
            Deskripsi
          </h3>
          <FormTextarea label="English" value={profile.description_en} onChange={(v) => setProfile({ ...profile, description_en: v })} />
          <FormTextarea label="Indonesia" value={profile.description_id} onChange={(v) => setProfile({ ...profile, description_id: v })} />
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="neo-btn bg-neo-green px-8 py-3 text-sm disabled:opacity-50"
          >
            {saving ? "⏳ Menyimpan..." : "💾 Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-neo-border/70 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border-2 border-neo-border/30 rounded-xl bg-background font-medium text-sm focus:outline-none focus:border-neo-border transition-colors"
      />
    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-neo-border/70 mb-1.5">
        {label}
      </label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border-2 border-neo-border/30 rounded-xl bg-background font-medium text-sm focus:outline-none focus:border-neo-border transition-colors resize-none"
      />
    </div>
  );
}
