export interface Profile {
  id: string;
  name: string;
  title: string;
  description_en: string;
  description_id: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  university: string;
  photo_url: string;
  cv_url: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  title_en: string;
  title_id: string;
  company: string;
  period_en: string;
  period_id: string;
  description_en: string[];
  description_id: string[];
  highlights: string[];
  type: "work" | "internship" | "organizational";
  sort_order: number;
  created_at: string;
}

export interface Education {
  id: string;
  degree_en: string;
  degree_id: string;
  school_en: string;
  school_id: string;
  period_en: string;
  period_id: string;
  description_en: string;
  description_id: string;
  sort_order: number;
  created_at: string;
}

export interface SkillCategory {
  id: string;
  category_en: string;
  category_id: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  category_id: string;
  name_en: string;
  name_id: string;
  sort_order: number;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  period_en: string;
  period_id: string;
  created_at: string;
}
