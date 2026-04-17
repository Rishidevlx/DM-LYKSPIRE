import { motion } from "motion/react";
import { ArrowUpRight, Linkedin, Mail, MapPin } from "lucide-react";
import logo from "../assest/LYKSPIRE LOGO.png";

export default function Footer() {
  return (
    <footer className="py-24 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-blue-600/10 blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 mb-20">
          <div>
            <h2 className="font-display text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Ready to build <br />
              <span className="text-gradient">your growth engine?</span>
            </h2>
            <button 
              onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
              className="btn-primary text-xl px-10 py-5"
            >
              Book a Strategy Call <ArrowUpRight className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="font-display font-bold mb-6 text-sm uppercase tracking-widest text-white/40">Company</h4>
              <ul className="space-y-4 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Process</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-6 text-sm uppercase tracking-widest text-white/40">Social</h4>
              <ul className="space-y-4 text-white/60">
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                  <a href="https://www.linkedin.com/company/LyKSpire" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-display font-bold mb-6 text-sm uppercase tracking-widest text-white/40">Contact</h4>
              <div className="space-y-4">
                <p className="flex items-center gap-3 text-white/60 hover:text-white transition-colors cursor-pointer">
                  <Mail className="w-4 h-4 text-cyber-teal" /> info@tieraprom.co.in
                </p>
                <p className="flex items-start gap-3 text-white/60 hover:text-white transition-colors cursor-pointer leading-relaxed">
                  <MapPin className="w-4 h-4 text-cyber-teal flex-shrink-0 mt-1" />
                  Global Digital Hub<br />Operating Worldwide
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="LYKSPIRE" className="h-8 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
            <span className="font-display font-black tracking-tighter uppercase text-xl text-white/50">LYKSPIRE</span>
          </div>
          
          <p className="text-white/30 text-sm">
            © 2026 LYKSPIRE. All rights reserved.
          </p>

          <div className="flex gap-8 text-xs text-white/30 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
