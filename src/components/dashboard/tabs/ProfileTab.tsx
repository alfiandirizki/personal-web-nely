"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import ImageCropper from "../ImageCropper";

type UploadState = "idle" | "validating" | "cropping" | "uploading" | "success" | "error";

export default function ProfileTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Separate upload states
  const [photoState, setPhotoState] = useState<UploadState>("idle");
  const [cvState, setCvState] = useState<UploadState>("idle");
  const [photoError, setPhotoError] = useState("");
  const [cvError, setCvError] = useState("");

  // Crop state
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const photoRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);
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
        photo_url: profile.photo_url,
        cv_url: profile.cv_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    setSaving(false);
    setMessage(error ? `❌ ${error.message}` : "✅ Tersimpan!");
    setTimeout(() => setMessage(""), 3000);
  }

  // Photo: validate then open cropper
  function handlePhotoSelect(file: File) {
    setPhotoError("");
    setPhotoState("validating");

    // Validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError("Format tidak didukung. Gunakan JPG, PNG, atau WebP.");
      setPhotoState("error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Ukuran file terlalu besar. Maksimal 2MB.");
      setPhotoState("error");
      return;
    }

    // Read file and open cropper
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setPhotoState("cropping");
    };
    reader.readAsDataURL(file);
  }

  // After crop, upload to Supabase
  async function handleCropDone(blob: Blob) {
    if (!profile) return;
    setPhotoState("uploading");
    setCropSrc(null);

    const path = `profile/photo.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(path, blob, { upsert: true, contentType: "image/jpeg" });

    if (uploadError) {
      setPhotoError(`Upload gagal: ${uploadError.message}`);
      setPhotoState("error");
      return;
    }

    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
    const photoUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    await supabase.from("profile").update({ photo_url: photoUrl }).eq("id", profile.id);
    setProfile({ ...profile, photo_url: photoUrl });
    setPhotoState("success");
    setTimeout(() => setPhotoState("idle"), 3000);
  }

  function handleCropCancel() {
    setCropSrc(null);
    setPhotoState("idle");
  }

  // CV upload with validation
  async function handleCVSelect(file: File) {
    if (!profile) return;
    setCvError("");
    setCvState("validating");

    // Validation
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setCvError("Format tidak didukung. Gunakan PDF, DOC, atau DOCX.");
      setCvState("error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError("Ukuran file terlalu besar. Maksimal 5MB.");
      setCvState("error");
      return;
    }

    setCvState("uploading");

    const ext = file.name.split(".").pop() || "pdf";
    const path = `profile/cv.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setCvError(`Upload gagal: ${uploadError.message}`);
      setCvState("error");
      return;
    }

    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
    const cvUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    await supabase.from("profile").update({ cv_url: cvUrl }).eq("id", profile.id);
    setProfile({ ...profile, cv_url: cvUrl });
    setCvState("success");
    setTimeout(() => setCvState("idle"), 3000);
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
      {/* Image Cropper Modal */}
      {cropSrc && photoState === "cropping" && (
        <ImageCropper
          imageSrc={cropSrc}
          onCropDone={handleCropDone}
          onCancel={handleCropCancel}
        />
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">👤 Profile</h1>
        {message && (
          <span className="neo-btn bg-neo-green/30 px-3 py-1 text-xs">{message}</span>
        )}
      </div>

      {/* Photo & CV Upload Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Photo upload */}
        <div className="neo-card p-5 space-y-4">
          <h3 className="font-black text-sm text-neo-border/60 uppercase tracking-wide">
            Foto Profil
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-neo-border overflow-hidden bg-neo-border/5 shrink-0">
              {profile.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl bg-neo-border/5">
                  👤
                </div>
              )}
            </div>
            <div className="space-y-2">
              <button
                onClick={() => photoRef.current?.click()}
                disabled={photoState === "uploading"}
                className="neo-btn bg-neo-yellow px-4 py-2 text-xs disabled:opacity-50 block"
              >
                {photoState === "uploading"
                  ? "⏳ Uploading..."
                  : photoState === "success"
                  ? "✅ Berhasil!"
                  : "📷 Upload & Crop"}
              </button>
              <p className="text-xs text-neo-border/50">JPG, PNG, WebP. Max 2MB.</p>
              {photoState === "error" && (
                <p className="text-xs text-red-600 font-medium">❌ {photoError}</p>
              )}
            </div>
          </div>
          <input
            ref={photoRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePhotoSelect(file);
              e.target.value = "";
            }}
          />
        </div>

        {/* CV upload */}
        <div className="neo-card p-5 space-y-4">
          <h3 className="font-black text-sm text-neo-border/60 uppercase tracking-wide">
            CV / Resume
          </h3>
          <div className="space-y-3">
            {profile.cv_url ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-neo-green/10 border-2 border-neo-green/30">
                <span className="text-2xl">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold">CV uploaded ✅</p>
                  <a
                    href={profile.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neo-border/60 underline"
                  >
                    Lihat file →
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-neo-border/5 border-2 border-dashed border-neo-border/20">
                <span className="text-2xl">📄</span>
                <p className="text-xs text-neo-border/50">Belum ada CV diupload</p>
              </div>
            )}
            <button
              onClick={() => cvRef.current?.click()}
              disabled={cvState === "uploading"}
              className="neo-btn bg-neo-blue px-4 py-2 text-xs disabled:opacity-50 block"
            >
              {cvState === "uploading"
                ? "⏳ Uploading..."
                : cvState === "success"
                ? "✅ Berhasil!"
                : "📎 Upload CV"}
            </button>
            <p className="text-xs text-neo-border/50">PDF, DOC, DOCX. Max 5MB.</p>
            {cvState === "error" && (
              <p className="text-xs text-red-600 font-medium">❌ {cvError}</p>
            )}
          </div>
          <input
            ref={cvRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCVSelect(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSave} className="space-y-6">
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

        <div className="neo-card p-5 sm:p-6 space-y-4">
          <h3 className="font-black text-sm text-neo-border/60 uppercase tracking-wide">
            Deskripsi
          </h3>
          <FormTextarea label="English" value={profile.description_en} onChange={(v) => setProfile({ ...profile, description_en: v })} />
          <FormTextarea label="Indonesia" value={profile.description_id} onChange={(v) => setProfile({ ...profile, description_id: v })} />
        </div>

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
      <label className="block text-xs font-bold text-neo-border/70 mb-1.5">{label}</label>
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
      <label className="block text-xs font-bold text-neo-border/70 mb-1.5">{label}</label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border-2 border-neo-border/30 rounded-xl bg-background font-medium text-sm focus:outline-none focus:border-neo-border transition-colors resize-none"
      />
    </div>
  );
}
