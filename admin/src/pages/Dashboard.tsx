import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Activity, ArrowUpRight, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  glow: string;
  link?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({ blogs: 0, contacts: 0 });
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = async () => {
      try {
        const [bRes, cRes] = await Promise.all([
          fetch(`${API}/api/admin-blogs`, { headers }),
          fetch(`${API}/api/admin-contacts`, { headers }),
        ]);
        const bData = await bRes.json();
        const cData = await cRes.json();
        const blogs = bData.blogs ?? [];
        const contacts = cData.contacts ?? [];
        setStats({ blogs: blogs.length, contacts: contacts.length });
        setRecentBlogs(blogs.slice(0, 5));
        setRecentContacts(contacts.slice(0, 5));
      } catch {
        /* silently fail */
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards: StatCard[] = [
    {
      label: 'Published Blogs',
      value: isLoading ? '—' : stats.blogs,
      icon: <FileText size={20} strokeWidth={1.8} />,
      color: 'text-indigo-300',
      bg: 'bg-indigo-500/10',
      glow: 'shadow-indigo-500/20',
      link: '/blogs',
    },
    {
      label: 'Total Enquiries',
      value: isLoading ? '—' : stats.contacts,
      icon: <Users size={20} strokeWidth={1.8} />,
      color: 'text-violet-300',
      bg: 'bg-violet-500/10',
      glow: 'shadow-violet-500/20',
      link: '/contacts',
    },
    {
      label: 'System Status',
      value: 'Online',
      icon: <Activity size={20} strokeWidth={1.8} />,
      color: 'text-emerald-300',
      bg: 'bg-emerald-500/10',
      glow: 'shadow-emerald-500/20',
    },
  ];

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/30 uppercase tracking-widest mb-2">
          <TrendingUp size={13} />
          <span>Overview</span>
        </div>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
          Dashboard
        </h1>
        <p className="text-white/40 text-sm mt-1">Welcome back. Here's what's happening with Lykspire.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
          >
            <div className={`bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 shadow-lg ${card.glow} hover:border-white/[0.12] transition-all group`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}>
                  {card.icon}
                </div>
                {card.link && (
                  <Link to={card.link} className="text-white/20 hover:text-white/60 transition-colors">
                    <ArrowUpRight size={16} />
                  </Link>
                )}
              </div>
              <p className="text-2xl font-bold text-white mb-0.5">{card.value}</p>
              <p className="text-xs text-white/40 font-medium">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blogs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-indigo-400" strokeWidth={1.8} />
              <h2 className="text-sm font-semibold text-white">Recent Blogs</h2>
            </div>
            <Link to="/blogs" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {isLoading ? (
              <div className="px-5 py-8 text-center text-white/25 text-sm">Loading...</div>
            ) : recentBlogs.length === 0 ? (
              <div className="px-5 py-8 text-center text-white/25 text-sm">No blogs yet. <Link to="/blogs/new" className="text-indigo-400 hover:underline">Create one →</Link></div>
            ) : (
              recentBlogs.map((blog) => (
                <div key={blog.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <FileText size={13} className="text-indigo-400" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 font-medium truncate">{blog.title}</p>
                    <p className="text-xs text-white/25 flex items-center gap-1 mt-0.5">
                      <Clock size={11} />
                      {blog.publish_date ? new Date(blog.publish_date).toLocaleDateString() : 'Draft'}
                    </p>
                  </div>
                  <Link to={`/blogs/edit/${blog.id}`} className="text-white/20 hover:text-indigo-400 transition-colors">
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Enquiries */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-violet-400" strokeWidth={1.8} />
              <h2 className="text-sm font-semibold text-white">Recent Enquiries</h2>
            </div>
            <Link to="/contacts" className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {isLoading ? (
              <div className="px-5 py-8 text-center text-white/25 text-sm">Loading...</div>
            ) : recentContacts.length === 0 ? (
              <div className="px-5 py-8 text-center text-white/25 text-sm">No enquiries yet.</div>
            ) : (
              recentContacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="w-7 h-7 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 text-xs font-bold text-violet-300">
                    {contact.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 font-medium truncate">{contact.name}</p>
                    <p className="text-xs text-white/25 truncate">{contact.email}</p>
                  </div>
                  <span className="text-xs bg-violet-500/10 text-violet-300 border border-violet-500/20 rounded-full px-2 py-0.5 shrink-0">
                    {contact.purpose ?? 'General'}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
