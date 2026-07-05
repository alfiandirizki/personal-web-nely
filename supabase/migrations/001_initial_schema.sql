-- Profile table (single row for personal info)
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_id TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  linkedin_url TEXT NOT NULL DEFAULT '',
  university TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Experience table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL DEFAULT '',
  title_id TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  period_en TEXT NOT NULL DEFAULT '',
  period_id TEXT NOT NULL DEFAULT '',
  description_en TEXT[] DEFAULT '{}',
  description_id TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  type TEXT NOT NULL DEFAULT 'work' CHECK (type IN ('work', 'internship', 'organizational')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  degree_en TEXT NOT NULL DEFAULT '',
  degree_id TEXT NOT NULL DEFAULT '',
  school_en TEXT NOT NULL DEFAULT '',
  school_id TEXT NOT NULL DEFAULT '',
  period_en TEXT NOT NULL DEFAULT '',
  period_id TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_id TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Skill categories
CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_en TEXT NOT NULL DEFAULT '',
  category_id TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '📋',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Skills (belongs to a category)
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES skill_categories(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL DEFAULT '',
  name_id TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Publications
CREATE TABLE IF NOT EXISTS publications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  authors TEXT NOT NULL DEFAULT '',
  journal TEXT NOT NULL DEFAULT '',
  year INTEGER NOT NULL DEFAULT 2025,
  period_en TEXT NOT NULL DEFAULT '',
  period_id TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (website is public)
CREATE POLICY "Public read access" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read access" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read access" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON publications FOR SELECT USING (true);

-- Authenticated users can do everything (admin)
CREATE POLICY "Auth full access" ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON skill_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access" ON publications FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial data
INSERT INTO profile (name, title, description_en, description_id, email, phone, location, linkedin_url, university)
VALUES (
  'Eka Maylinda Nely Nur Rohmah, S.P.',
  'Agriculture Graduate',
  'Agriculture graduate with strong analytical, communication, and stakeholder engagement skills. Experienced in research, data analysis, project coordination, and community-based activities.',
  'Lulusan Pertanian dengan kemampuan analitis, komunikasi, dan keterlibatan pemangku kepentingan yang kuat. Berpengalaman dalam riset, analisis data, koordinasi proyek, dan kegiatan berbasis komunitas.',
  'ekamaylindanely11@gmail.com',
  '0822-2877-7987',
  'Mojokerto, Indonesia',
  'https://www.linkedin.com/in/eka-maylinda-nely-037a53345',
  'Brawijaya University'
);

-- Experiences
INSERT INTO experiences (title_en, title_id, company, period_en, period_id, description_en, description_id, highlights, type, sort_order) VALUES
('Store Staff', 'Staff Toko', 'Podjok Gerabah', 'Mar 2026 — Present', 'Mar 2026 — Sekarang',
  ARRAY['Assisted customers by providing product information and addressing inquiries', 'Managed daily store operations, including inventory organization and product display', 'Maintained accurate records of sales transactions and stock availability', 'Handled customer concerns and contributed to a positive customer experience'],
  ARRAY['Membantu pelanggan dengan menyediakan informasi produk dan menjawab pertanyaan', 'Mengelola operasional toko harian, termasuk organisasi inventaris dan display produk', 'Menjaga catatan transaksi penjualan dan ketersediaan stok secara akurat', 'Menangani keluhan pelanggan dan berkontribusi pada pengalaman pelanggan yang positif'],
  ARRAY['Customer Service', 'Inventory', 'Sales'], 'work', 1),
('Enumerator', 'Enumerator', 'Lembaga Survei Indonesia DAPIL V', 'Sep — Nov 2023', 'Sep — Nov 2023',
  ARRAY['Conducted field surveys and respondent interviews following established procedures', 'Collected, verified, and recorded data with high accuracy', 'Adapted to diverse field conditions and time constraints'],
  ARRAY['Melaksanakan survei lapangan dan wawancara responden sesuai prosedur yang ditetapkan', 'Mengumpulkan, memverifikasi, dan mencatat data dengan akurasi tinggi', 'Beradaptasi dengan beragam kondisi lapangan dan batasan waktu'],
  ARRAY['Data Collection', 'Survey', 'Field Work'], 'work', 2),
('Intern — Landscape & Nursery Division', 'Magang — Divisi Lanskap & Pembibitan', 'Dinas Lingkungan Hidup Kota Malang', 'Jul — Sep 2024', 'Jul — Sep 2024',
  ARRAY['Assisted in plant nursery management for city parks', 'Conducted monitoring and maintenance of urban green spaces', 'Participated in tree planting and care', 'Performed tree health surveys and seedling inventory, contributing to data management'],
  ARRAY['Membantu pengelolaan pembibitan tanaman untuk taman kota', 'Melakukan monitoring dan pemeliharaan ruang terbuka hijau', 'Berpartisipasi dalam penanaman dan perawatan pohon', 'Melakukan survei kesehatan pohon dan inventaris bibit, berkontribusi pada manajemen data'],
  ARRAY['Nursery Management', 'Green Spaces', 'Data Management'], 'internship', 1),
('Event Division', 'Divisi Acara', 'PRIMORDIA', 'Jul 2024 — Jan 2025', 'Jul 2024 — Jan 2025',
  ARRAY['Developed event concepts and activity schedules in coordination with cross-functional teams', 'Managed operational planning and logistics for more than 400 participants and committee members', 'Collaborated with multiple stakeholders to ensure smooth event implementation'],
  ARRAY['Mengembangkan konsep acara dan jadwal kegiatan berkoordinasi dengan tim lintas fungsi', 'Mengelola perencanaan operasional dan logistik untuk lebih dari 400 peserta dan panitia', 'Berkolaborasi dengan berbagai pemangku kepentingan untuk memastikan implementasi acara yang lancar'],
  ARRAY['Event Planning', 'Logistics', 'Coordination'], 'organizational', 1),
('Consumption Division', 'Divisi Konsumsi', 'MTQMN XVII & GBQN IX', '2022 — 2023', '2022 — 2023',
  ARRAY['Coordinated food distribution logistics for approximately 1,000 event participants', 'Worked closely with field teams to ensure timely and accurate distribution across multiple venues', 'Assisted in planning, monitoring, and resolving logistical issues'],
  ARRAY['Mengkoordinasikan logistik distribusi makanan untuk sekitar 1.000 peserta acara', 'Bekerja sama dengan tim lapangan untuk memastikan distribusi tepat waktu di berbagai venue', 'Membantu perencanaan, pemantauan, dan penyelesaian masalah logistik'],
  ARRAY['Logistics', 'Team Coordination', 'Operations'], 'organizational', 2);

-- Education
INSERT INTO education (degree_en, degree_id, school_en, school_id, period_en, period_id, description_en, description_id, sort_order) VALUES
('Bachelor of Agriculture (S.P.)', 'Sarjana Pertanian (S.P.)', 'Brawijaya University', 'Universitas Brawijaya', 'Aug 2021 — Jul 2025', 'Ags 2021 — Jul 2025', '', '', 1);

-- Publications
INSERT INTO publications (title, authors, journal, year, period_en, period_id) VALUES
('Response of Oleander (Nerium oleander L.) Cuttings to Variations in Stem Position and Rootone-F Soaking Duration', 'Rohmah, Eka M. N. N. R., and Baskara, Medha', 'J Plantropica', 2025, 'Jan — Jul 2025', 'Jan — Jul 2025');

-- Skill Categories
INSERT INTO skill_categories (category_en, category_id, icon, sort_order) VALUES
('Soft Skills', 'Soft Skills', '🤝', 1),
('Hard Skills', 'Hard Skills', '💻', 2),
('Research & Analysis', 'Riset & Analisis', '🔬', 3),
('Operations & Coordination', 'Operasional & Koordinasi', '📋', 4);

-- Skills
INSERT INTO skills (category_id, name_en, name_id, sort_order)
SELECT sc.id, s.name_en, s.name_id, s.sort_order
FROM skill_categories sc
CROSS JOIN (VALUES
  ('Soft Skills', 'Communication', 'Komunikasi', 1),
  ('Soft Skills', 'Stakeholder Engagement', 'Keterlibatan Pemangku Kepentingan', 2),
  ('Soft Skills', 'Relationship Building', 'Membangun Relasi', 3),
  ('Soft Skills', 'Problem Solving', 'Pemecahan Masalah', 4),
  ('Soft Skills', 'Attention to Detail', 'Perhatian terhadap Detail', 5),
  ('Soft Skills', 'Analytical Thinking', 'Berpikir Analitis', 6),
  ('Soft Skills', 'Team Collaboration', 'Kolaborasi Tim', 7),
  ('Soft Skills', 'Adaptability', 'Adaptabilitas', 8),
  ('Soft Skills', 'Project Coordination', 'Koordinasi Proyek', 9)
) AS s(cat, name_en, name_id, sort_order)
WHERE sc.category_en = s.cat;

INSERT INTO skills (category_id, name_en, name_id, sort_order)
SELECT sc.id, s.name_en, s.name_id, s.sort_order
FROM skill_categories sc
CROSS JOIN (VALUES
  ('Hard Skills', 'Canva', 'Canva', 1),
  ('Hard Skills', 'CapCut', 'CapCut', 2),
  ('Hard Skills', 'Google Workspace', 'Google Workspace', 3),
  ('Hard Skills', 'Content Research', 'Riset Konten', 4),
  ('Hard Skills', 'Basic Content Creation', 'Pembuatan Konten Dasar', 5),
  ('Hard Skills', 'Microsoft Excel', 'Microsoft Excel', 6),
  ('Hard Skills', 'Microsoft Word', 'Microsoft Word', 7),
  ('Hard Skills', 'Microsoft PowerPoint', 'Microsoft PowerPoint', 8)
) AS s(cat, name_en, name_id, sort_order)
WHERE sc.category_en = s.cat;

INSERT INTO skills (category_id, name_en, name_id, sort_order)
SELECT sc.id, s.name_en, s.name_id, s.sort_order
FROM skill_categories sc
CROSS JOIN (VALUES
  ('Research & Analysis', 'Data Collection', 'Pengumpulan Data', 1),
  ('Research & Analysis', 'Field Survey', 'Survei Lapangan', 2),
  ('Research & Analysis', 'Data Analysis', 'Analisis Data', 3),
  ('Research & Analysis', 'Report Writing', 'Penulisan Laporan', 4),
  ('Research & Analysis', 'Research Methodology', 'Metodologi Penelitian', 5)
) AS s(cat, name_en, name_id, sort_order)
WHERE sc.category_en = s.cat;

INSERT INTO skills (category_id, name_en, name_id, sort_order)
SELECT sc.id, s.name_en, s.name_id, s.sort_order
FROM skill_categories sc
CROSS JOIN (VALUES
  ('Operations & Coordination', 'Event Planning', 'Perencanaan Acara', 1),
  ('Operations & Coordination', 'Logistics Management', 'Manajemen Logistik', 2),
  ('Operations & Coordination', 'Inventory Management', 'Manajemen Inventaris', 3),
  ('Operations & Coordination', 'Customer Service', 'Layanan Pelanggan', 4),
  ('Operations & Coordination', 'Community Engagement', 'Keterlibatan Komunitas', 5)
) AS s(cat, name_en, name_id, sort_order)
WHERE sc.category_en = s.cat;
