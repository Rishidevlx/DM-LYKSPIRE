import { useRef, useState } from 'react';
import { Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ value, onChange, label = 'Featured Image' }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10MB'); return; }
    setError('');
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API}/api/upload-image`, { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch {
      setError('Network error. Check backend is running.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
        <ImageIcon size={11} />
        {label}
      </label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-white/[0.08] group">
          <img src={value} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-indigo-600 rounded-lg text-xs font-semibold text-white"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-red-600 rounded-lg text-white"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative border-2 border-dashed border-white/[0.1] rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
        >
          {isUploading ? (
            <>
              <Loader2 size={28} className="text-indigo-400 animate-spin" />
              <p className="text-sm text-white/40">Uploading to Cloudinary…</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                <Upload size={20} className="text-white/30 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm text-white/50 font-medium">Drop image here or <span className="text-indigo-400">browse</span></p>
                <p className="text-xs text-white/25 mt-1">PNG, JPG, WEBP up to 10MB</p>
              </div>
            </>
          )}
        </div>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}
