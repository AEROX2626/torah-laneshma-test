-- ========================================================
-- סכמת מסד נתונים למערכת הניהול - תורה לנשמה (Supabase)
-- ========================================================

-- 1. טבלת משתמשי ניהול
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor', -- 'admin' | 'editor'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. טבלת הזמנות משתמשים מהירות (Easy Invite)
CREATE TABLE IF NOT EXISTS admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  used_at TIMESTAMPTZ
);

-- 3. טבלת פניות מהאתר (Submissions / Leads)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL, -- 'chavruta' | 'adopt'
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  topic_or_message TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- 'new' | 'in_progress' | 'done' | 'trash'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. טבלת שאלות ותשובות נפוצות (FAQs)
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'כללי',
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. טבלת מסמכי עץ האתר לעורך הוויזואלי (Site Docs)
CREATE TABLE IF NOT EXISTS site_docs (
  id TEXT PRIMARY KEY, -- 'page_home' | 'page_adopt' | 'header' | 'footer'
  kind TEXT NOT NULL DEFAULT 'page',
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  revision INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. טבלת טיוטות (Drafts)
CREATE TABLE IF NOT EXISTS site_drafts (
  doc_id TEXT PRIMARY KEY REFERENCES site_docs(id) ON DELETE CASCADE,
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  revision INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. טבלת הגדרות כלליות (Settings)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- הרשאות Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- מדיניות קריאה ציבורית לתוכן מפורסם (FAQ ו-site_docs)
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (is_published = true);
CREATE POLICY "Public read site_docs" ON site_docs FOR SELECT USING (true);
