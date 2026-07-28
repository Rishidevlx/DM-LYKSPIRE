import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flashlight, FlashlightOff } from 'lucide-react';

export default function TorchToggle() {
  const [isOn, setIsOn] = useState(() => {
    return localStorage.getItem('siteTheme') === 'light';
  });

  useEffect(() => {
    if (isOn) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('siteTheme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('siteTheme', 'dark');
    }
  }, [isOn]);

  return (
    <button
      onClick={() => setIsOn(!isOn)}
      style={{
        background: isOn ? 'var(--theme-cyber-teal)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${isOn ? 'var(--theme-cyber-teal)' : 'rgba(255,255,255,0.15)'}`
      }}
      className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 cursor-pointer overflow-visible group"
      title="Toggle Theme"
    >
      <motion.div
        animate={{ rotate: isOn ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative z-10 flex items-center justify-center w-full h-full"
      >
        {/* The Icon */}
        <div style={{ color: isOn ? '#ffffff' : 'rgba(255,255,255,0.6)' }} className="transition-colors duration-300">
          {isOn ? <Flashlight size={18} /> : <FlashlightOff size={18} />}
        </div>
      </motion.div>
        
      {/* The Beam */}
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0, height: 0, width: 0 }}
            animate={{ opacity: 1, height: 40, width: 40 }}
            exit={{ opacity: 0, height: 0, width: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-1/2 -translate-x-1/2 origin-top pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0, 255, 204, 0.4) 0%, transparent 100%)',
              clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0% 100%)',
              filter: 'blur(2px)',
              marginTop: '-4px'
            }}
          />
        )}
      </AnimatePresence>
    </button>
  );
}
