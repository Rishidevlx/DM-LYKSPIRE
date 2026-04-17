import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import logo from "../assest/LYKSPIRE LOGO.png";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-obsidian/85 backdrop-blur-2xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="LYKSPIRE" className="h-10 w-auto" />
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">
          <a href="#hero" className="hover:text-white transition-colors">Home</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#case-studies" className="hover:text-white transition-colors">Case Studies</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-obsidian rounded-full font-bold text-sm hover:bg-cyber-teal transition-colors group"
          >
            Contact us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden text-white hover:text-cyber-teal transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-obsidian/95 backdrop-blur-3xl border-b border-white/5 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col items-center gap-8 py-10 text-sm font-black text-white/50 uppercase tracking-[0.2em]">
              <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-cyber-teal transition-colors">Home</a>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-cyber-teal transition-colors">Services</a>
              <a href="#case-studies" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-cyber-teal transition-colors">Case Studies</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-cyber-teal transition-colors">About</a>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.dispatchEvent(new Event('open-contact-modal'));
                }} 
                className="mt-4 px-8 py-4 bg-cyber-teal text-obsidian rounded-full font-bold hover:scale-105 transition-transform"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  );
}
