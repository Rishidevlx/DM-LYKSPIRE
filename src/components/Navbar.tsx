import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../assest/LYKSPIRE LOGO.png";
import TorchToggle from "./TorchToggle";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    
    if (location.pathname !== "/") {
      navigate("/");
      // Let it navigate first, then scroll. (For a perfect UX, hash routing or scroll to top is better)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      return;
    }

    setTimeout(() => {
      const el = document.getElementById(id.replace('#', ''));
      if (el) {
        const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: yCoordinate,
          behavior: 'smooth'
        });
      }
    }, 300);
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 bg-obsidian/85 backdrop-blur-2xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4">
          <img src={logo} alt="LYKSPIRE" className="h-10 w-auto" />
          <span className="text-gradient font-display font-black text-2xl tracking-tighter uppercase">LYKSPIRE</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">
          <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors cursor-pointer">Home</button>
          <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer">Services</button>
          <button onClick={() => scrollToSection('clients')} className="hover:text-white transition-colors cursor-pointer">Clients</button>
          <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors cursor-pointer">About</button>
          <Link to="/blog" className="hover:text-white transition-colors cursor-pointer">Blog</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <TorchToggle />
          <button 
            onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-obsidian rounded-full font-bold text-sm hover:bg-cyber-teal transition-colors group"
          >
            Contact us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center gap-4">
          <TorchToggle />
          <button 
            className="text-white hover:text-cyber-teal transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-[72px] left-0 right-0 bg-obsidian/98 backdrop-blur-3xl border-b border-white/5 shadow-2xl overflow-hidden z-[99]"
          >
            <div className="flex flex-col items-stretch gap-2 py-10 text-sm font-black text-white/50 uppercase tracking-[0.2em]">
              <button onClick={() => scrollToSection('hero')} className="py-4 px-10 text-center hover:text-cyber-teal hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer">Home</button>
              <button onClick={() => scrollToSection('services')} className="py-4 px-10 text-center hover:text-cyber-teal hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer">Services</button>
              <button onClick={() => scrollToSection('clients')} className="py-4 px-10 text-center hover:text-cyber-teal hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer">Our Clients</button>
              <button onClick={() => scrollToSection('about')} className="py-4 px-10 text-center hover:text-cyber-teal hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer">About</button>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="py-4 px-10 text-center hover:text-cyber-teal hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer">Blog</Link>
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
