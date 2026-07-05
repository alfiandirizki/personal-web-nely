"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SkillCategory, Skill } from "@/lib/supabase/types";

const colorList = ["bg-neo-pink", "bg-neo-blue", "bg-neo-green", "bg-neo-orange", "bg-neo-purple", "bg-neo-yellow"];

export default function SkillsTab() {
  const [categories, setCategories] = useState<(SkillCategory & { skills: Skill[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<SkillCategory | null>(null);
  const [editingSkills, setEditingSkills] = useState<{ categoryId: string; categoryName: string; skills: Skill[] } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: cats } = await supabase.from("skill_categories").select("*").order("sort_order");
    const { data: skills } = await supabase.from("skills").select("*").order("sort_order");
    const merged = (cats || []).map((cat) => ({
      ...cat,
      skills: (skills || []).filter((s) => s.category_id === cat.id),
    }));
    setCategories(merged);
    setLoading(false);
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCat) return;
    setSaving(true);
    if (editingCat.id === "new") {
      const { id: _, created_at: __, ...rest } = editingCat;
      await supabase.from("skill_categories").insert(rest);
    } else {
      const { created_at: _, ...rest } = editingCat;
      await supabase.from("skill_categories").update(rest).eq("id", editingCat.id);
    }
    setSaving(false);
    setEditingCat(null);
    fetchData();
    showMsg("✅ Kategori tersimpan!");
  }

  async function deleteCategory(id: string) {
    if (!confirm("Hapus kategori + semua skill-nya?")) return;
    await supabase.from("skill_categories").delete().eq("id", id);
    fetchData();
    showMsg("🗑️ Dihapus!");
  }

  async function saveSkills(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSkills) return;
    setSaving(true);

    await supabase.from("skills").delete().eq("category_id", editingSkills.categoryId);
    const toInsert = editingSkills.skills
      .filter((s) => s.name_en.trim())
      .map((s, i) => ({
        category_id: editingSkills.categoryId,
        name_en: s.name_en.trim(),
        name_id: s.name_id.trim() || s.name_en.trim(),
        sort_order: i + 1,
      }));
    if (toInsert.length > 0) await supabase.from("skills").insert(toInsert);

    setSaving(false);
    setEditingSkills(null);
    fetchData();
    showMsg("✅ Skills tersimpan!");
  }

  function showMsg(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-36 bg-neo-border/10 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-neo-border/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Edit category
  if (editingCat) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">{editingCat.id === "new" ? "➕" : "✏️"} Kategori</h1>
          <button onClick={() => setEditingCat(null)} className="neo-btn bg-surface px-4 py-2 text-sm">← Kembali</button>
        </div>
        <form onSubmit={saveCategory} className="neo-card p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Category (EN)" value={editingCat.category_en} onChange={(v) => setEditingCat({ ...editingCat, category_en: v })} />
            <FormInput label="Category (ID)" value={editingCat.category_id} onChange={(v) => setEditingCat({ ...editingCat, category_id: v })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Icon (emoji)" value={editingCat.icon} onChange={(v) => setEditingCat({ ...editingCat, icon: v })} />
            <FormInput label="Sort Order" value={String(editingCat.sort_order)} onChange={(v) => setEditingCat({ ...editingCat, sort_order: parseInt(v) || 0 })} />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="neo-btn bg-neo-green px-8 py-3 text-sm disabled:opacity-50">
              {saving ? "⏳..." : "💾 Simpan"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Edit skills in category
  if (editingSkills) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-black">✏️ {editingSkills.categoryName}</h1>
          <button onClick={() => setEditingSkills(null)} className="neo-btn bg-surface px-4 py-2 text-sm">← Kembali</button>
        </div>
        <form onSubmit={saveSkills} className="neo-card p-5 sm:p-6 space-y-3">
          <p className="text-xs text-neo-border/60">EN di kiri, ID di kanan. Kosongkan ID jika sama.</p>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {editingSkills.skills.map((skill, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={skill.name_en}
                  onChange={(e) => {
                    const u = [...editingSkills.skills];
                    u[i] = { ...u[i], name_en: e.target.value };
                    setEditingSkills({ ...editingSkills, skills: u });
                  }}
                  placeholder="English"
                  className="flex-1 px-3 py-2 border-2 border-neo-border/30 rounded-xl bg-background text-sm focus:outline-none focus:border-neo-border transition-colors"
                />
                <input
                  type="text"
                  value={skill.name_id}
                  onChange={(e) => {
                    const u = [...editingSkills.skills];
                    u[i] = { ...u[i], name_id: e.target.value };
                    setEditingSkills({ ...editingSkills, skills: u });
                  }}
                  placeholder="Indonesia"
                  className="flex-1 px-3 py-2 border-2 border-neo-border/30 rounded-xl bg-background text-sm focus:outline-none focus:border-neo-border transition-colors"
                />
                <button
                  type="button"
                  onClick={() => {
                    const u = editingSkills.skills.filter((_, idx) => idx !== i);
                    setEditingSkills({ ...editingSkills, skills: u });
                  }}
                  className="neo-btn bg-neo-red/30 px-2 py-1.5 text-xs shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setEditingSkills({
              ...editingSkills,
              skills: [...editingSkills.skills, { id: "", category_id: editingSkills.categoryId, name_en: "", name_id: "", sort_order: editingSkills.skills.length + 1 }],
            })}
            className="neo-btn bg-neo-blue/50 w-full py-2.5 text-sm text-center"
          >
            + Tambah Skill
          </button>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving} className="neo-btn bg-neo-green px-8 py-3 text-sm disabled:opacity-50">
              {saving ? "⏳..." : "💾 Simpan Semua"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">🛠️ Skills</h1>
        <button onClick={() => setEditingCat({ id: "new", category_en: "", category_id: "", icon: "📋", sort_order: categories.length + 1, created_at: "" })} className="neo-btn bg-neo-green px-4 py-2 text-sm">+ Kategori</button>
      </div>

      {message && <span className="neo-btn bg-neo-green/30 px-3 py-1 text-xs inline-block">{message}</span>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat, index) => (
          <div key={cat.id} className="neo-card p-5 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`${colorList[index % colorList.length]} w-9 h-9 flex items-center justify-center rounded-lg border-2 border-neo-border text-base`}>
                  {cat.icon}
                </span>
                <div>
                  <p className="font-black text-sm">{cat.category_en}</p>
                  <p className="text-xs text-neo-border/50">{cat.skills.length} skills</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditingCat(cat)} className="neo-btn bg-neo-yellow px-2 py-1 text-xs">✏️</button>
                <button onClick={() => deleteCategory(cat.id)} className="neo-btn bg-neo-red/30 px-2 py-1 text-xs">🗑️</button>
              </div>
            </div>

            {/* Skills preview */}
            <div className="flex flex-wrap gap-1.5 flex-1 mb-4">
              {cat.skills.slice(0, 6).map((s) => (
                <span key={s.id} className="neo-tag text-xs">{s.name_en}</span>
              ))}
              {cat.skills.length > 6 && (
                <span className="text-xs text-neo-border/50 self-center">+{cat.skills.length - 6} more</span>
              )}
            </div>

            {/* Edit skills button */}
            <button
              onClick={() => setEditingSkills({
                categoryId: cat.id,
                categoryName: cat.category_en,
                skills: cat.skills.length > 0 ? cat.skills : [{ id: "", category_id: cat.id, name_en: "", name_id: "", sort_order: 1 }],
              })}
              className="neo-btn bg-neo-blue/30 w-full py-2 text-xs text-center mt-auto"
            >
              ✏️ Edit Skills
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-bold text-neo-border/70 mb-1.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 border-2 border-neo-border/30 rounded-xl bg-background font-medium text-sm focus:outline-none focus:border-neo-border transition-colors" />
    </div>
  );
}
