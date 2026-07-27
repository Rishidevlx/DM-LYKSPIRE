import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Search, Calendar, MessageSquare, TrendingUp, ChevronDown } from 'lucide-react';

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
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  const filtered = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.purpose?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/30 uppercase tracking-widest mb-2">
          <TrendingUp size={13} />
          <span>CRM</span>
        </div>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
          Contact Enquiries
        </h1>
        <p className="text-white/40 text-sm mt-1">{contacts.length} total enquir{contacts.length !== 1 ? 'ies' : 'y'}</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, purpose…"
          className="w-full max-w-sm bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition-all"
        />
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="py-20 text-center text-white/25 text-sm">Loading enquiries…</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Mail size={36} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/25 text-sm">
            {search ? 'No results match your search.' : 'No enquiries yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((contact, i) => {
            const isExpanded = expandedId === contact.id;
            const purpColor = purposeColors[contact.purpose] ?? fallbackPurposeColor;

            return (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden"
              >
                {/* Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : contact.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.025] transition-colors text-left"
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {contact.name?.[0]?.toUpperCase() ?? '?'}
                  </div>

                  {/* Name + email */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/90 truncate">{contact.name}</p>
                    <p className="text-xs text-white/35 truncate">{contact.email}</p>
                  </div>

                  {/* Mobile */}
                  <p className="text-xs text-white/30 hidden md:block shrink-0">{contact.mobile}</p>

                  {/* Purpose */}
                  <span className={`text-[11px] font-semibold border rounded-full px-2.5 py-0.5 shrink-0 ${purpColor}`}>
                    {contact.purpose ?? 'General'}
                  </span>

                  {/* Date */}
                  <span className="text-xs text-white/25 hidden lg:flex items-center gap-1 shrink-0">
                    <Calendar size={11} />
                    {new Date(contact.created_at).toLocaleDateString()}
                  </span>

                  {/* Expand icon */}
                  <ChevronDown
                    size={15}
                    className={`text-white/25 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Expanded message */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5 pt-1 border-t border-white/[0.05]"
                  >
                    <div className="flex items-start gap-2 mt-3">
                      <MessageSquare size={13} className="text-white/25 mt-0.5 shrink-0" strokeWidth={1.8} />
                      <p className="text-sm text-white/55 leading-relaxed">{contact.message || 'No message provided.'}</p>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Reply via Email →
                      </a>
                      {contact.mobile && (
                        <a
                          href={`tel:${contact.mobile}`}
                          className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          Call →
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
