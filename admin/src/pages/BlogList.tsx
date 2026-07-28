import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, FileText, Search,
  Calendar, Clock, TrendingUp
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Blog {
  id: number;
  title: string;
  banner_image: string;
  publish_date: string;
  read_time: string;
  created_at: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API}/api/admin-blogs`, { headers });
      const data = await res.json();
      if (data.blogs) setBlogs(data.blogs);
    } catch {
      /* silently fail */
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this blog post?')) return;
    setDeletingId(id);
    try {
      await fetch(`${API}/api/admin-blogs?id=${id}`, { method: 'DELETE', headers });
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2">
            <TrendingUp size={13} />
            <span>Content</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Sora, sans-serif' }}>Blogs</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">{blogs.length} article{blogs.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          to="/blogs/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#ffffff] bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-[#2563eb]/25 transition-all active:scale-[0.98]"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Blog
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blogs…"
          className="w-full max-w-sm bg-[var(--panel-bg)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-white/25 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-[var(--panel-bg)] border border-[var(--border)] rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          <span>Title</span>
          <span className="text-right">Published</span>
          <span className="text-right">Read Time</span>
          <span className="text-right pr-1">Actions</span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-[var(--text-secondary)] text-sm">Loading blogs…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={32} className="text-[var(--text-secondary)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-secondary)]">
              {search ? 'No blogs match your search.' : 'No blogs yet.'}
            </p>
            {!search && (
              <Link to="/blogs/new" className="mt-3 inline-block text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                Create your first blog →
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-[var(--panel-bg)] transition-colors group"
              >
                {/* Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                    {blog.banner_image ? (
                      <img src={blog.banner_image} alt="" className="w-full h-full object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <FileText size={14} className="text-indigo-400" strokeWidth={1.8} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-[var(--text-secondary)] font-medium truncate group-hover:text-[var(--text-primary)] transition-colors">
                      {blog.title}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                      <Calendar size={10} />
                      Created {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Published */}
                <div className="text-right">
                  {blog.publish_date ? (
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-1">
                      {new Date(blog.publish_date).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2.5 py-1">
                      Draft
                    </span>
                  )}
                </div>

                {/* Read time */}
                <div className="text-right">
                  {blog.read_time ? (
                    <span className="text-xs text-[var(--text-secondary)] flex items-center justify-end gap-1">
                      <Clock size={11} /> {blog.read_time}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--text-secondary)]">—</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <Link
                    to={`/blogs/edit/${blog.id}`}
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={15} strokeWidth={1.8} />
                  </Link>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    disabled={deletingId === blog.id}
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                    title="Delete"
                  >
                    <Trash2 size={15} strokeWidth={1.8} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
