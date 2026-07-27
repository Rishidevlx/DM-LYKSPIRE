import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      if (location.pathname !== '/login') navigate('/login');
    } else {
      setIsAuthenticated(true);
      if (location.pathname === '/login') navigate('/');
    }
  }, [navigate, location]);

  if (location.pathname === '/login') return <Outlet />;
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ background: 'var(--bg-main)' }}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-60' : 'ml-0'}`}>
        {/* Top bar with theme toggle */}
        <header className="h-12 shrink-0 flex items-center justify-between px-6 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-main)' }}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-lg hover:bg-[var(--panel-bg)] text-[var(--text-secondary)] transition-colors">
            <Menu size={18} />
          </button>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'var(--panel-bg)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="p-8 min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
