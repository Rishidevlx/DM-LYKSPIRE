import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Users, TrendingUp, X, Loader2, CheckCircle2 } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Client {
  id: number;
  company_name: string;
  description: string;
  logo_url: string;
  sort_order: number;
}

interface FormState {
  company_name: string;
  description: string;
  logo_url: string;
  sort_order: number;
}

const emptyForm: FormState = { company_name: '', description: '', logo_url: '', sort_order: 0 };
const inputCls = 'w-full bg-[var(--panel-bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 transition-all';
const labelCls = 'block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5';

export default function ClientsAdmin() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const token = localStorage.getItem('adminToken');
  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API}/api/clients`);
      const data = await res.json();
      if (data.clients) setClients(data.clients);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (c: Client) => {
    setForm({ company_name: c.company_name, description: c.description, logo_url: c.logo_url, sort_order: c.sort_order });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.company_name.trim()) { showToast('Company name is required', 'error'); return; }
    setIsSaving(true);
    try {
      const url = editingId ? `${API}/api/admin-clients?id=${editingId}` : `${API}/api/admin-clients`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: authHeaders, body: JSON.stringify(form) });
      if (res.ok) {
        showToast(editingId ? 'Client updated!' : 'Client added!');
        setShowForm(false);
        fetchClients();
      } else {
        showToast('Save failed', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Remove this client?')) return;
    setDeletingId(id);
    try {
      await fetch(`${API}/api/admin-clients?id=${id}`, { method: 'DELETE', headers: authHeaders });
      setClients((p) => p.filter((c) => c.id !== id));
      showToast('Client removed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border backdrop-blur ${
              toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' : 'bg-red-950/90 border-red-500/30 text-red-300'
            }`}
          >
            <CheckCircle2 size={15} /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-1.5 mb-0.5"><TrendingUp size={10} /> Partners</p>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Sora, sans-serif' }}>Our Clients</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage clients shown in the "Trusted by Industry Leaders" section</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#ffffff] bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-[#2563eb]/25 transition-all active:scale-[0.98]"
        >
          <Plus size={16} strokeWidth={2.5} /> Add Client
        </button>
      </div>

      {/* Form Modal Overlay */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--bg-main)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-xl shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: 'Sora, sans-serif' }}>{editingId ? 'Edit Client' : 'Add New Client'}</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--panel-bg)] transition-colors"><X size={18} /></button>
              </div>

              <div className="space-y-4">
                <ImageUploader value={form.logo_url} onChange={(url) => setForm((p) => ({ ...p, logo_url: url }))} label="Client Logo / Image" />
                <div>
                  <label className={labelCls}>Company / Client Name *</label>
                  <input value={form.company_name} onChange={(e) => setForm((p) => ({ ...p, company_name: e.target.value }))} placeholder="e.g. Acme Corporation" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Partner Description</label>
                  <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="e.g. AI Automation Partner" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Sort Order (lower = first)</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className={inputCls} />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-secondary)] bg-[var(--panel-bg)] border border-[var(--border)] hover:text-[var(--text-primary)] transition-all">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#ffffff] bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                  {isSaving ? <Loader2 size={15} className="animate-spin" /> : null}
                  {editingId ? 'Update' : 'Add Client'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-[var(--text-secondary)] text-sm">Loading clients…</div>
      ) : clients.length === 0 ? (
        <div className="py-20 text-center">
          <Users size={40} className="text-[var(--text-secondary)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-secondary)]">No clients yet. Add your first partner!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--panel-bg)] border border-[var(--border)] rounded-xl p-5 group hover:border-[var(--border)] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-[var(--panel-bg)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                  {client.logo_url ? (
                    <img src={client.logo_url} alt={client.company_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-black text-indigo-400">{client.company_name[0]?.toUpperCase()}</span>
                  )}
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(client)} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(client.id)} disabled={deletingId === client.id} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40">
                    {deletingId === client.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
              <p className="font-bold text-[var(--text-primary)] text-sm">{client.company_name}</p>
              {client.description && <p className="text-xs text-[var(--text-secondary)] mt-1">{client.description}</p>}
              <p className="text-[10px] text-[var(--text-secondary)] mt-2">Order: {client.sort_order}</p>
            </motion.div>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-[var(--text-secondary)] text-center">
        💡 Changes will reflect live on the Lykspire website's "Trusted by Industry Leaders" section
      </p>
    </div>
  );
}
