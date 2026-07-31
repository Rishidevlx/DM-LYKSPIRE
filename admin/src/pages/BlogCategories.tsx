import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Loader2, CheckCircle2, FolderOpen } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

const inputCls = 'w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 transition-all';
const labelCls = 'block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5';

export default function BlogCategories() {
  const token = localStorage.getItem('adminToken');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/api/categories`);
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (err) {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return showToast('Name is required', 'error');
    setIsSaving(true);
    
    try {
      const res = await fetch(`${API}/api/admin-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, slug })
      });
      if (res.ok) {
        showToast('Category created!', 'success');
        setName('');
        setSlug('');
        fetchCategories();
      } else {
        const d = await res.json();
        showToast(d.error || 'Failed to create', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`${API}/api/admin-categories?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Category deleted', 'success');
        fetchCategories();
      } else {
        showToast('Failed to delete', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  };

  return (
    <div className="max-w-7xl">
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

      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 mb-0.5"><FolderOpen size={10} /> Blogs</p>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Sora, sans-serif' }}>Categories</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Form */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--panel-bg)] border border-[var(--border)] rounded-xl overflow-hidden p-5">
            <h2 className="text-sm font-bold text-[var(--text-primary)] mb-4">Add New Category</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className={labelCls}>Name *</label>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                  }}
                  placeholder="e.g. Technology"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Slug</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="technology"
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2.5 mt-2 rounded-xl text-sm font-bold text-white bg-[var(--btn-royal-blue, #2563eb)] hover:opacity-90 shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Add Category
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: List */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--panel-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border)] bg-black/[0.02]">
              <h2 className="text-sm font-bold text-[var(--text-primary)]">All Categories</h2>
            </div>
            {loading ? (
              <div className="p-10 flex justify-center text-[var(--text-muted)]"><Loader2 size={24} className="animate-spin" /></div>
            ) : categories.length === 0 ? (
              <div className="p-10 text-center text-[var(--text-secondary)] text-sm">No categories found. Create one to get started.</div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {categories.map(cat => (
                  <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-[var(--panel-hover)] transition-colors">
                    <div>
                      <h3 className="font-semibold text-sm text-[var(--text-primary)]">{cat.name}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">/{cat.slug}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
