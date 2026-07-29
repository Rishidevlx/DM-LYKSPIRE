import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Search, Calendar, MessageSquare, TrendingUp, Filter, X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Contact {
  id: number;
  name: string;
  email: string;
  mobile: string;
  purpose: string;
  message: string;
  created_at: string;
}

const purposeColors: Record<string, string> = {
  'General': 'text-blue-300 bg-blue-500/10 border-blue-500/20',
  'Partnership': 'text-violet-300 bg-violet-500/10 border-violet-500/20',
  'Support': 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  'Sales': 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
};
const fallbackPurposeColor = 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20';

export default function ContactEnquiries() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch(`${API}/api/admin-contacts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { if (data.contacts) setContacts(data.contacts); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = contacts.filter((c) => {
    // 1. Search Filter
    const matchesSearch = 
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.purpose?.toLowerCase().includes(search.toLowerCase());

    // 2. Date Filter
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const createdDate = new Date(c.created_at);
      const now = new Date();
      if (dateFilter === 'today') {
        matchesDate = createdDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = createdDate >= weekAgo;
      } else if (dateFilter === 'month') {
        matchesDate = createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
      }
    }

    return matchesSearch && matchesDate;
  });

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2">
          <TrendingUp size={13} />
          <span>CRM</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Sora, sans-serif' }}>
          Contact Enquiries
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Manage and view all messages from the website form</p>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, purpose…"
            className="w-full bg-[var(--panel-bg)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition-all"
          />
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={16} className="text-[var(--text-secondary)]" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="w-full md:w-auto bg-[var(--panel-bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-violet-500/60 transition-all appearance-none cursor-pointer"
          >
            <option value="all" className="bg-[var(--bg-main)] text-[var(--text-primary)]">All Time</option>
            <option value="today" className="bg-[var(--bg-main)] text-[var(--text-primary)]">Today</option>
            <option value="week" className="bg-[var(--bg-main)] text-[var(--text-primary)]">Last 7 Days</option>
            <option value="month" className="bg-[var(--bg-main)] text-[var(--text-primary)]">This Month</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-[var(--panel-bg)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/5 dark:bg-white/5 border-b border-[var(--border)] text-[var(--text-secondary)] font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact Details</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Date received</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[var(--text-primary)]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-[var(--text-secondary)]">Loading enquiries…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-[var(--text-secondary)]">
                    <Mail size={32} className="mx-auto mb-3 opacity-50" />
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((contact) => {
                  const purpColor = purposeColors[contact.purpose] ?? fallbackPurposeColor;
                  return (
                    <tr key={contact.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center font-bold text-indigo-300">
                            {contact.name?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <span className="font-semibold">{contact.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <a href={`mailto:${contact.email}`} className="text-indigo-400 hover:underline">{contact.email}</a>
                          {contact.mobile && <a href={`tel:${contact.mobile}`} className="text-xs text-[var(--text-secondary)] mt-0.5">{contact.mobile}</a>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider border rounded-full px-2.5 py-1 ${purpColor}`}>
                          {contact.purpose ?? 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          {new Date(contact.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedMessage(contact)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all font-semibold text-xs flex items-center gap-1.5 ml-auto"
                        >
                          <MessageSquare size={13} /> Read Message
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedMessage(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="bg-[var(--panel-bg)] border-b border-[var(--border)] px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-300">
                    {selectedMessage.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)]">{selectedMessage.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">{selectedMessage.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMessage(null)} className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="mb-6 flex flex-wrap gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                    <p className="text-[10px] uppercase text-[var(--text-secondary)] font-bold mb-1">Purpose</p>
                    <p className="text-sm text-[var(--text-primary)] font-semibold">{selectedMessage.purpose || 'None'}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                    <p className="text-[10px] uppercase text-[var(--text-secondary)] font-bold mb-1">Mobile</p>
                    <p className="text-sm text-[var(--text-primary)] font-semibold">{selectedMessage.mobile || 'Not provided'}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                    <p className="text-[10px] uppercase text-[var(--text-secondary)] font-bold mb-1">Date</p>
                    <p className="text-sm text-[var(--text-primary)] font-semibold">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-5 border border-white/5 relative">
                  <MessageSquare size={16} className="absolute top-5 right-5 text-white/10" />
                  <p className="text-xs text-[var(--text-secondary)] font-bold uppercase mb-3">Message Content</p>
                  <p className="text-[var(--text-primary)] leading-relaxed text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[var(--border)] bg-black/10 flex justify-end gap-3">
                <a 
                  href={`mailto:${selectedMessage.email}`}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors shadow-lg shadow-indigo-500/20"
                >
                  Reply via Email
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
