import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Mail,
  LogOut,
  // TrendingUp,
  PlusCircle,
  List,
  ChevronRight,
  Users,
  X,
  FolderPlus,
} from 'lucide-react';
import { useState } from 'react';

const navConfig = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
    exact: true,
  },
  {
    label: 'Blogs',
    icon: FileText,
    path: '/blogs',
    children: [
      { label: 'All Blogs', icon: List, path: '/blogs' },
      { label: 'New Blog', icon: PlusCircle, path: '/blogs/new' },
      { label: 'Add Category', icon: FolderPlus, path: '/blogs/categories' },
    ],
  },
  {
    label: 'Our Clients',
    icon: Users,
    path: '/clients',
  },
  {
    label: 'Enquiries',
    icon: Mail,
    path: '/contacts',
  },
];

import logo from '../../../src/assest/LYKSPIRE LOGO.png';

export default function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean; setIsOpen?: (v: boolean) => void }) {
  const location = useLocation();
  const path = location.pathname;
  const [blogsOpen, setBlogsOpen] = useState(path.startsWith('/blogs'));

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  };

  const isActive = (item: { path: string; exact?: boolean }) => {
    if (item.exact) return path === item.path;
    return path === item.path || (item.path !== '/' && path.startsWith(item.path));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}
      <aside 
        className={`w-60 h-screen flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} 
        style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <img src={logo} alt="Lykspire" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-[#ffffff] leading-none tracking-wide text-sm">Lykspire</h1>
              <span className="text-[9px] font-semibold text-[#ffffff]/60 tracking-widest uppercase">Admin Panel</span>
            </div>
          </div>
          {/* Close button for mobile */}
          <button className="md:hidden text-[#ffffff]/60" onClick={() => setIsOpen?.(false)}>
            <X size={18} />
          </button>
        </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ffffff]/20 px-3 pb-2">Menu</p>

        {navConfig.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          const hasChildren = !!item.children;
          const childrenOpen = hasChildren && blogsOpen;

          return (
            <div key={item.path}>
              {hasChildren ? (
                <button
                  onClick={() => setBlogsOpen(!blogsOpen)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                    path.startsWith(item.path)
                      ? 'bg-indigo-500/15 text-indigo-300'
                      : 'text-[#ffffff]/40 hover:text-[#ffffff]/80 hover:bg-[#ffffff]/[0.04]'
                  }`}
                >
                  <Icon size={17} strokeWidth={1.8} />
                  <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                  <ChevronRight
                    size={13}
                    className={`transition-transform duration-200 ${childrenOpen ? 'rotate-90' : ''}`}
                  />
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 relative ${
                    active
                      ? 'bg-indigo-500/15 text-indigo-300'
                      : 'text-[#ffffff]/40 hover:text-[#ffffff]/80 hover:bg-[#ffffff]/[0.04]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-pill"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-indigo-400"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <Icon size={17} strokeWidth={1.8} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )}

              {/* Children */}
              {hasChildren && childrenOpen && item.children && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-4 mt-0.5 pl-4 border-l border-white/[0.06] space-y-0.5"
                >
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    const childActive = path === child.path;
                    return (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 ${
                          childActive
                            ? 'text-indigo-400 font-medium'
                            : 'text-[#ffffff]/40 hover:text-[#ffffff]/80 hover:bg-[#ffffff]/[0.04]'
                        }`}
                      >
                        <ChildIcon size={15} strokeWidth={1.8} />
                        <span className="font-medium">{child.label}</span>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#ffffff]/[0.06]">
        <button 
          onClick={() => {
            localStorage.removeItem('adminToken');
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#ffffff]/40 hover:text-[#ffffff]/80 hover:bg-[#ffffff]/[0.04] transition-all"
        >
          <LogOut size={17} strokeWidth={1.8} />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
}
