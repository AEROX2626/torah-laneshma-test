import fs from "fs";
import path from "path";
import { supabaseAdmin } from "./supabase";
import { AdminUser, hashPassword } from "./auth";

export interface Submission {
  id: string;
  kind: "chavruta" | "adopt";
  name: string;
  phone: string;
  topic_or_message?: string;
  status: "new" | "in_progress" | "done" | "trash";
  notes?: string;
  created_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_published: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AdminInvite {
  id: string;
  token: string;
  role: "admin" | "editor";
  created_at: string;
  expires_at: string;
  used_at?: string | null;
}

const STORE_PATH = path.join(process.cwd(), "app", "data", "admin_store.json");

interface LocalStore {
  users: Array<AdminUser & { password_hash: string }>;
  invites: AdminInvite[];
  submissions: Submission[];
  faqs: FaqItem[];
  site_docs: Record<string, any>;
  settings: Record<string, any>;
}

function getInitialStore(): LocalStore {
  return {
    users: [],
    invites: [],
    submissions: [
      {
        id: "demo-lead-1",
        kind: "chavruta",
        name: "יוסי כהן",
        phone: "052-1234567",
        topic_or_message: "גמרא / תלמוד",
        status: "new",
        notes: "פנייה לדוגמה לבדיקת מערכת הניהול",
        created_at: new Date().toISOString(),
      },
      {
        id: "demo-lead-2",
        kind: "adopt",
        name: "מיכל לוי",
        phone: "054-9876543",
        topic_or_message: "מעוניינת לאמץ אברך לחצי שנה",
        status: "in_progress",
        notes: "בוצעה שיחה ראשונית",
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "האם החברותא כרוכה בתשלום כלשהו?",
        answer: "לא, המיזם הינו יוזמה התנדבותית מלאה שמטרתה לבנות גשרים ולחבר בין אנשים. הלימוד ניתן באהבה וללא כל תמורה.",
        category: "כללי",
        display_order: 1,
        is_published: true,
      },
      {
        id: "faq-2",
        question: "איך מתבצע הלימוד בפועל?",
        answer: "הלימוד מתקיים בשיחה טלפונית נעימה פעם בשבוע, במשך כ-45 דקות עד שעה, בזמן שנוח לשניכם.",
        category: "לימוד",
        display_order: 2,
        is_published: true,
      },
      {
        id: "faq-3",
        question: "האם מנסים להחזיר בתשובה?",
        answer: "ממש לא! אין לנו שום אג'נדה נסתרת. המטרה היחידה היא שיח מכבד, פתוח, בגובה העיניים וחיבור אנושי דרך חוכמת התורה.",
        category: "כללי",
        display_order: 3,
        is_published: true,
      },
    ],
    site_docs: {},
    settings: {
      site_name: "תורה לנשמה",
      whatsapp_number: "050-3938114",
    },
  };
}

function readLocalStore(): LocalStore {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      const initial = getInitialStore();
      fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
      fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
  } catch {
    return getInitialStore();
  }
}

function writeLocalStore(store: LocalStore) {
  try {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing admin local store:", err);
  }
}

// ----------------- USERS -----------------
export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const { data, error } = await supabaseAdmin.from("admin_users").select("id, email, role, created_at");
    if (!error && data) return data;
  } catch {}
  return readLocalStore().users.map(({ password_hash, ...u }) => u);
}

export async function getAdminUserByEmail(email: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("admin_users")
      .select("id, email, password_hash, role, created_at")
      .eq("email", email.toLowerCase())
      .single();
    if (!error && data) return data;
  } catch {}
  const store = readLocalStore();
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createAdminUser(email: string, passwordHash: string, role: "admin" | "editor" = "editor") {
  const user = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    email: email.toLowerCase(),
    password_hash: passwordHash,
    role,
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabaseAdmin.from("admin_users").insert(user).select().single();
    if (!error && data) return data;
  } catch {}

  const store = readLocalStore();
  store.users.push(user);
  writeLocalStore(store);
  return user;
}

// ----------------- INVITES -----------------
export async function createAdminInvite(role: "admin" | "editor" = "editor"): Promise<AdminInvite> {
  const token = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const invite: AdminInvite = {
    id: `inv-id-${Date.now()}`,
    token,
    role,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    used_at: null,
  };

  try {
    const { data, error } = await supabaseAdmin.from("admin_invites").insert(invite).select().single();
    if (!error && data) return data;
  } catch {}

  const store = readLocalStore();
  store.invites.push(invite);
  writeLocalStore(store);
  return invite;
}

export async function getAdminInviteByToken(token: string): Promise<AdminInvite | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("admin_invites")
      .select("*")
      .eq("token", token)
      .is("used_at", null)
      .single();
    if (!error && data) return data;
  } catch {}

  const store = readLocalStore();
  const inv = store.invites.find((i) => i.token === token && !i.used_at);
  if (!inv) return null;
  if (new Date(inv.expires_at) < new Date()) return null;
  return inv;
}

export async function consumeAdminInvite(token: string) {
  try {
    await supabaseAdmin.from("admin_invites").update({ used_at: new Date().toISOString() }).eq("token", token);
  } catch {}

  const store = readLocalStore();
  const inv = store.invites.find((i) => i.token === token);
  if (inv) {
    inv.used_at = new Date().toISOString();
    writeLocalStore(store);
  }
}

// ----------------- SUBMISSIONS -----------------
export async function getSubmissions(filter?: { status?: string; search?: string }): Promise<Submission[]> {
  try {
    let q = supabaseAdmin.from("submissions").select("*").order("created_at", { ascending: false });
    if (filter?.status && filter.status !== "all") {
      q = q.eq("status", filter.status);
    }
    const { data, error } = await q;
    if (!error && data) return data;
  } catch {}

  let items = readLocalStore().submissions;
  if (filter?.status && filter.status !== "all") {
    items = items.filter((s) => s.status === filter.status);
  }
  if (filter?.search) {
    const s = filter.search.toLowerCase();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(s) ||
        item.phone.includes(s) ||
        (item.topic_or_message && item.topic_or_message.toLowerCase().includes(s))
    );
  }
  return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function updateSubmissionStatus(id: string, status: Submission["status"], notes?: string) {
  try {
    const update: any = { status, updated_at: new Date().toISOString() };
    if (notes !== undefined) update.notes = notes;
    const { data, error } = await supabaseAdmin.from("submissions").update(update).eq("id", id).select().single();
    if (!error && data) return data;
  } catch {}

  const store = readLocalStore();
  const item = store.submissions.find((s) => s.id === id);
  if (item) {
    item.status = status;
    if (notes !== undefined) item.notes = notes;
    writeLocalStore(store);
    return item;
  }
  return null;
}

export async function createSubmission(sub: Omit<Submission, "id" | "created_at" | "status">): Promise<Submission> {
  const item: Submission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...sub,
    status: "new",
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabaseAdmin.from("submissions").insert(item).select().single();
    if (!error && data) return data;
  } catch {}

  const store = readLocalStore();
  store.submissions.unshift(item);
  writeLocalStore(store);
  return item;
}

// ----------------- FAQS -----------------
export async function getFaqs(options?: { publishedOnly?: boolean; includeTrash?: boolean }): Promise<FaqItem[]> {
  const publishedOnly = options?.publishedOnly ?? false;
  const includeTrash = options?.includeTrash ?? false;

  try {
    let q = supabaseAdmin.from("faqs").select("*").order("display_order", { ascending: true });
    if (publishedOnly) q = q.eq("is_published", true);
    if (!includeTrash) q = q.eq("is_deleted", false);
    const { data, error } = await q;
    if (!error && data) return data;
  } catch {}

  let items = readLocalStore().faqs;
  if (publishedOnly) items = items.filter((f) => f.is_published && !f.is_deleted);
  else if (includeTrash) items = items.filter((f) => f.is_deleted);
  else items = items.filter((f) => !f.is_deleted);

  return items.sort((a, b) => a.display_order - b.display_order);
}

export async function saveFaq(faq: Partial<FaqItem> & { question: string; answer: string }): Promise<FaqItem> {
  const id = faq.id || `faq-${Date.now()}`;
  const record: FaqItem = {
    id,
    question: faq.question,
    answer: faq.answer,
    category: faq.category || "כללי",
    display_order: faq.display_order ?? 0,
    is_published: faq.is_published ?? true,
    is_deleted: faq.is_deleted ?? false,
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabaseAdmin.from("faqs").upsert(record).select().single();
    if (!error && data) return data;
  } catch {}

  const store = readLocalStore();
  const idx = store.faqs.findIndex((f) => f.id === id);
  if (idx >= 0) {
    store.faqs[idx] = { ...store.faqs[idx], ...record };
  } else {
    store.faqs.push(record);
  }
  writeLocalStore(store);
  return record;
}

export async function deleteFaq(id: string, permanent = false) {
  if (permanent) {
    try {
      await supabaseAdmin.from("faqs").delete().eq("id", id);
    } catch {}

    const store = readLocalStore();
    store.faqs = store.faqs.filter((f) => f.id !== id);
    writeLocalStore(store);
  } else {
    // Soft delete to recycle bin
    try {
      await supabaseAdmin.from("faqs").update({ is_deleted: true, updated_at: new Date().toISOString() }).eq("id", id);
    } catch {}

    const store = readLocalStore();
    const item = store.faqs.find((f) => f.id === id);
    if (item) {
      item.is_deleted = true;
      writeLocalStore(store);
    }
  }
}

export async function restoreFaq(id: string) {
  try {
    await supabaseAdmin.from("faqs").update({ is_deleted: false, updated_at: new Date().toISOString() }).eq("id", id);
  } catch {}

  const store = readLocalStore();
  const item = store.faqs.find((f) => f.id === id);
  if (item) {
    item.is_deleted = false;
    writeLocalStore(store);
  }
}

// ----------------- SITE DOCS (TREE ENGINE) -----------------
export async function getSiteDoc(id: string): Promise<any | null> {
  try {
    const { data, error } = await supabaseAdmin.from("site_docs").select("*").eq("id", id).single();
    if (!error && data) return data;
  } catch {}

  const store = readLocalStore();
  if (store.site_docs && store.site_docs[id]) {
    return store.site_docs[id];
  }

  // Initial seed doc for home page sections
  if (id === "page_home") {
    const seedHome = {
      id: "page_home",
      kind: "page",
      title: "דף הבית · תורה לנשמה",
      path: "/",
      revision: 1,
      nodes: [
        {
          id: "hero-sec",
          type: "section",
          name: "אזור פתיחה (Hero)",
          classes: "relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 bg-radial-gradient",
          children: [
            {
              id: "hero-container",
              type: "container",
              name: "קונטיינר מרכזי",
              classes: "max-w-7xl mx-auto px-5 sm:px-8",
              children: [
                {
                  id: "hero-badge",
                  type: "heading",
                  name: "תגית פתיחה",
                  tag: "div",
                  classes: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 font-bold text-xs uppercase mb-6 shadow-sm",
                  props: { text: "חברותא טלפונית ללימוד תורה" },
                },
                {
                  id: "hero-title",
                  type: "heading",
                  name: "כותרת ראשית",
                  tag: "h1",
                  classes: "font-heading font-black text-4xl sm:text-6xl md:text-7xl text-ink-950 mb-6 leading-tight",
                  props: { text: "חיבור אנושי אמיתי, מכל מקום" },
                },
                {
                  id: "hero-subtitle",
                  type: "text",
                  name: "פסקת הסבר",
                  classes: "text-lg sm:text-xl text-ink-600 font-medium mb-10 max-w-2xl leading-relaxed",
                  props: { text: "שעה אחת בשבוע של לימוד ושיחה בגובה העיניים. בליווי אישי, מותאם אליך, ובאהבה גדולה." },
                },
              ],
            },
          ],
        },
      ],
      updated_at: new Date().toISOString(),
    };
    store.site_docs[id] = seedHome;
    writeLocalStore(store);
    return seedHome;
  }

  return null;
}

export async function saveSiteDoc(id: string, doc: any): Promise<any> {
  const record = {
    ...doc,
    id,
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabaseAdmin.from("site_docs").upsert(record).select().single();
    if (!error && data) return data;
  } catch {}

  const store = readLocalStore();
  if (!store.site_docs) store.site_docs = {};
  store.site_docs[id] = record;
  writeLocalStore(store);
  return record;
}
