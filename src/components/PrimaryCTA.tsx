import { motion } from "motion/react";
import { ArrowRight, Zap, Sparkles, ShieldCheck, Activity, Globe } from "lucide-react";

export default function PrimaryCTA() {
  return (
    <section className="py-48 px-6 bg-obsidian relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-cyber-teal/10 blur-[150px] rounded-full -z-10 animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px] -z-10" />
      
      {/* Floating HUD Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[10%] text-cyber-teal/20 hidden lg:block"
      >
        <Globe className="w-32 h-32" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-[10%] text-cyber-teal/20 hidden lg:block"
      >
        <Activity className="w-40 h-40" />
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="relative glass-card !p-0 rounded-[48px] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.1)]"
        >
          {/* Inner Glow and Patterns */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-teal/5 via-transparent to-blue-500/5" />
          
          <div className="relative p-12 md:p-24 text-center">
            {/* Top Badge */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-teal/10 border border-cyber-teal/20 mb-12 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
            >
              <ShieldCheck className="w-4 h-4 text-cyber-teal" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyber-teal">System Verified Execution</span>
            </motion.div>

            <h2 className="text-6xl md:text-8xl lg:text-[100px] font-display font-black tracking-tighter uppercase mb-10 leading-[0.85] text-white">
              Build a <br />
              <div className="flex flex-wrap justify-center items-center gap-x-4">
                <span className="text-gradient drop-shadow-2xl">Growth</span>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="relative inline-flex items-center"
                >
                  <span className="text-white">EN</span>
                  <motion.span
                    animate={{ rotate: [0, 360, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 8.5 }}
                    className="inline-block text-cyber-teal"
                  >
                    G
                  </motion.span>
                  <span className="text-white">INE</span>
                </motion.div>
              </div>
              That Works Alone
            </h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-lg md:text-2xl font-bold uppercase tracking-[0.2em] mb-16 max-w-3xl mx-auto leading-relaxed"
            >
              Stop relying on <span className="text-white">temporary tactics</span>. <br />
              Secure your <span className="text-cyber-teal">market dominance</span> with automated intelligence.
            </motion.p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
                className="btn-primary text-xl px-12 py-6 w-full sm:w-auto shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
              >
                Launch My System <Sparkles className="w-6 h-6 ml-2" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
                className="btn-outline text-xl px-12 py-6 w-full sm:w-auto border-white/20"
              >
                Strategy Call <ArrowRight className="w-6 h-6 ml-2" />
              </motion.button>
            </div>

            {/* Urgency Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-12 border-t border-white/5">
               <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-cyber-teal rounded-full animate-ping" />
                  <p className="text-white/40 text-xs font-black uppercase tracking-widest leading-none">
                    4 Slots Remaining for Q2
                  </p>
               </div>
               <div className="hidden sm:block w-px h-4 bg-white/10" />
               <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  <p className="text-white/40 text-xs font-black uppercase tracking-widest leading-none">
                    High Impact Execution Only
                  </p>
               </div>
            </div>
          </div>

          {/* Corner HUD Decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-cyber-teal/30 rounded-tl-[48px]" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-cyber-teal/30 rounded-br-[48px]" />
        </motion.div>
      </div>
    </section>
  );
}

