import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Loader2, X, Plus, CheckCircle2,
  Type, AlignLeft, Tag, FolderOpen, User, Clock, Calendar,
  Search, FileText, TrendingUp, Globe, Eye, Image as ImageIcon,
  File
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';



const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    [{ font: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    [{ align: [] }],
    ['clean'],
  ],
};

interface BlogFormData {
  title: string;
  slug: string;
  banner_image: string;
  alt_text: string;
  content: string;
  short_description: string;
  category: string;
  tags: string[];
  publish_date: string;
  read_time: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  author: string;
  status: 'draft' | 'published';
}

const defaultForm: BlogFormData = {
  title: '', slug: '', banner_image: '', alt_text: '', content: '',
  short_description: '', category: '', tags: [], publish_date: '',
  read_time: '', meta_title: '', meta_description: '',
  keywords: '', author: 'Admin', status: 'draft',
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[var(--border)]">
        <span className="text-indigo-400">{icon}</span>
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

const inputCls = 'w-full bg-[var(--panel-bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 transition-all';
const labelCls = 'block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5';

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState<BlogFormData>(defaultForm);
  const [tagInput, setTagInput] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [categories, setCategories] = useState<{id: number, name: string, slug: string}[]>([]);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (isEditing) {
      fetch(`${API}/api/admin-blogs?id=${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((data) => {
          if (data.blog) {
            const b = data.blog;
            let parsedTags: string[] = [];
            try { parsedTags = JSON.parse(b.tags || '[]'); } catch { parsedTags = (b.tags || '').split(',').filter(Boolean); }
            setForm({
              title: b.title ?? '',
              slug: b.slug ?? '',
              banner_image: b.banner_image ?? '',
              alt_text: b.alt_text ?? '',
              content: b.content ?? '',
              short_description: b.short_description ?? '',
              category: b.category ?? '',
              tags: parsedTags,
              publish_date: b.publish_date?.split('T')[0] ?? '',
              read_time: b.read_time ?? '',
              meta_title: b.meta_title ?? '',
              meta_description: b.meta_description ?? '',
              keywords: b.keywords ?? '',
              author: b.author ?? 'Admin',
              status: b.status ?? 'draft',
            });
            setSlugManual(true);
          }
        });
    }
  }, [id, isEditing]);

  const setField = (key: keyof BlogFormData, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title' && !slugManual) next.slug = slugify(value);
      return next;
    });
  };

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (t && !form.tags.includes(t) && form.tags.length < 10) {
      setForm((p) => ({ ...p, tags: [...p.tags, t] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const seoScore = () => {
    let score = 0;
    if (form.title) score += 20;
    if (form.meta_title) score += 20;
    if (form.meta_description) score += 20;
    if (form.keywords) score += 15;
    if (form.banner_image) score += 15;
    if (form.slug) score += 10;
    return score;
  };

  const handleSave = async (forceStatus?: 'draft' | 'published') => {
    if (!form.title.trim()) { showToast('Blog title is required', 'error'); return; }
    setIsSaving(true);
    const payload = { ...form, status: forceStatus ?? form.status };
    try {
      const url = isEditing ? `${API}/api/admin-blogs?id=${id}` : `${API}/api/admin-blogs`;
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast(forceStatus === 'published' ? 'Blog published! 🎉' : 'Draft saved', 'success');
        setTimeout(() => navigate('/blogs'), 1200);
      } else {
        const d = await res.json();
        showToast(d.error || 'Save failed', 'error');
      }
    } catch {
      showToast('Network error. Check backend.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const score = seoScore();

  return (
    <div className="max-w-7xl">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300 backdrop-blur'
                : 'bg-red-950/90 border-red-500/30 text-red-300 backdrop-blur'
            }`}
          >
            <CheckCircle2 size={16} />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/blogs')} className="p-2 rounded-xl bg-[var(--panel-bg)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--panel-bg)] transition-all">
            <ArrowLeft size={17} />
          </button>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-1.5 mb-0.5"><TrendingUp size={10} /> Content</p>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Sora, sans-serif' }}>{isEditing ? 'Edit Post' : 'New Blog Post'}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-secondary)] bg-[var(--panel-bg)] border border-[var(--border)] hover:bg-[var(--panel-bg)] hover:text-[var(--text-primary)] transition-all disabled:opacity-40 flex items-center gap-2"
          >
            <FileText size={15} /> Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#ffffff] bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-[#2563eb]/25 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Globe size={15} />}
            Publish
          </button>
        </div>
      </div>

      {/* Main Layout: 70/30 */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        {/* LEFT: Main Content */}
        <div className="space-y-5">
          {/* Title + Slug */}
          <SectionCard title="Post Details" icon={<Type size={15} />}>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Blog Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  placeholder="e.g. 5 AI Strategies to Scale Your Business in 2025"
                  className={inputCls + ' text-base font-medium'}
                />
              </div>
              <div>
                <label className={labelCls}>Slug (Auto-generated)</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 py-2.5 bg-[var(--panel-bg)] border border-[var(--border)] rounded-l-xl text-xs text-[var(--text-secondary)] whitespace-nowrap border-r-0">/blog/</span>
                  <input
                    value={form.slug}
                    onChange={(e) => { setSlugManual(true); setField('slug', slugify(e.target.value)); }}
                    placeholder="my-blog-post-title"
                    className={inputCls + ' rounded-l-none border-l-0'}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Short Description (Shown in blog cards)</label>
                <textarea
                  value={form.short_description}
                  onChange={(e) => setField('short_description', e.target.value)}
                  rows={3}
                  maxLength={300}
                  placeholder="A short, engaging summary of what this post is about…"
                  className={inputCls + ' resize-none'}
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1 text-right">{form.short_description.length}/300</p>
              </div>
            </div>
          </SectionCard>

          {/* Featured Image */}
          <SectionCard title="Featured Image" icon={<ImageIcon size={15} />}>
            <ImageUploader
              value={form.banner_image}
              onChange={(url) => setField('banner_image', url)}
              label=""
            />
            {form.banner_image && (
              <div className="mt-3">
                <label className={labelCls}>Alt Text (SEO)</label>
                <input
                  value={form.alt_text}
                  onChange={(e) => setField('alt_text', e.target.value)}
                  placeholder="Describe the image for accessibility"
                  className={inputCls}
                />
              </div>
            )}
          </SectionCard>

          {/* Rich Text Editor */}
          <SectionCard title="Blog Content *" icon={<AlignLeft size={15} />}>
            <div className="rounded-xl overflow-hidden border border-[var(--border)]" style={{ minHeight: 500 }}>
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(val) => setField('content', val)}
                modules={QUILL_MODULES}
                placeholder="Write your blog content here…"
                style={{ minHeight: 460 }}
              />
            </div>
          </SectionCard>

          {/* SEO Section */}
          <SectionCard title="SEO Settings" icon={<Search size={15} />}>
            <div className="space-y-4">
              {/* SEO Score Bar */}
              <div className="p-4 bg-[var(--panel-bg)] rounded-xl border border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">SEO Score</span>
                  <span className={`text-xs font-bold ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{score}/100</span>
                </div>
                <div className="h-2 bg-[var(--panel-bg)] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Meta Title</label>
                <input value={form.meta_title} onChange={(e) => setField('meta_title', e.target.value)} placeholder={form.title || 'SEO page title'} className={inputCls} />
                <p className="text-xs text-[var(--text-secondary)] mt-1">{form.meta_title.length}/60 chars ideal</p>
              </div>
              <div>
                <label className={labelCls}>Meta Description</label>
                <textarea value={form.meta_description} onChange={(e) => setField('meta_description', e.target.value)} rows={2} maxLength={160} placeholder="Describe your post for Google search results…" className={inputCls + ' resize-none'} />
                <p className="text-xs text-[var(--text-secondary)] mt-1">{form.meta_description.length}/160 chars</p>
              </div>
              <div>
                <label className={labelCls}>Keywords (comma separated)</label>
                <input value={form.keywords} onChange={(e) => setField('keywords', e.target.value)} placeholder="AI, automation, business growth" className={inputCls} />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT: Publish Settings */}
        <div className="space-y-5">

          {/* Category */}
          <SectionCard title="Category" icon={<FolderOpen size={15} />}>
            <select
              className={inputCls + ' cursor-pointer'}
              value={form.category}
              onChange={e => setField('category', e.target.value)}
            >
              <option value="" disabled className="bg-[var(--bg-main)] text-[var(--text-secondary)]">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name} className="bg-[var(--bg-main)] text-[var(--text-primary)]">{cat.name}</option>
              ))}
            </select>
          </SectionCard>

          {/* Tags */}
          <SectionCard title="Tags" icon={<Tag size={15} />}>
            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-indigo-500/15 border border-indigo-500/25 rounded-full text-xs text-indigo-300 font-medium">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors"><X size={11} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); } }}
                placeholder="Type & press Enter"
                className={inputCls + ' text-xs py-2'}
              />
              <button type="button" onClick={() => addTag(tagInput)} className="px-3 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors">
                <Plus size={15} />
              </button>
            </div>
          </SectionCard>

          {/* Publish Date + Read Time */}
          <SectionCard title="Publishing" icon={<Calendar size={15} />}>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Publish Date</label>
                <input type="date" value={form.publish_date} onChange={(e) => setField('publish_date', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}><Clock size={10} className="inline mr-1" />Read Time</label>
                <input value={form.read_time} onChange={(e) => setField('read_time', e.target.value)} placeholder="5 min read" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}><User size={10} className="inline mr-1" />Author</label>
                <input value={form.author} onChange={(e) => setField('author', e.target.value)} placeholder="Admin" className={inputCls} />
              </div>
            </div>
          </SectionCard>

          {/* Publish Actions */}
          <div className="space-y-2">
            <button onClick={() => handleSave('published')} disabled={isSaving} className="w-full py-3 rounded-xl text-sm font-bold text-[#ffffff] bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-[#2563eb]/25 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
              Publish Now
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
