import { motion } from "motion/react";
import { XCircle, CheckCircle2, AlertTriangle, ArrowRight, Zap, Target, Layers, Bot, RefreshCcw } from "lucide-react";

const problems = [
  "You get leads, but they don’t convert",
  "Follow-ups are delayed or inconsistent",
  "Marketing feels random and unpredictable",
  "Too many tools, no proper integration",
  "You’re spending money, but not seeing real ROI"
];

const solutions = [
  { text: "Traffic", icon: Target, desc: "Attract the right audience" },
  { text: "Magnet", icon: Bot, desc: "Capture leads automatically" },
  { text: "Filter", icon: Layers, desc: "Qualify high-intent intent" },
  { text: "Nurture", icon: RefreshCcw, desc: "Build trust 24/7" },
  { text: "Convert", icon: Zap, desc: "Close deals at scale" }
];

export default function ProblemSolution() {
  return (
    <div className="bg-obsidian relative overflow-hidden">
      {/* PROBLEM SECTION */}
      <section className="py-32 px-6 border-b border-white/5 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="section-label text-red-400 border-red-400/20 bg-red-400/5">The Challenge</div>
              <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase mb-8 leading-tight">
                Why Your Marketing <br />
                <span className="text-red-500">Isn’t Delivering</span> Results
              </h2>
              <p className="text-white/60 text-lg mb-12 max-w-xl">
                Most businesses don’t lack effort — <span className="text-white font-bold">they lack a system.</span> Without a structured process, your growth is hit-or-miss.
              </p>
              
              <div className="space-y-4">
                {problems.map((prob, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-red-500/50" />
                    <span className="text-sm font-bold uppercase tracking-wider text-white/70">{prob}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 p-6 rounded-3xl bg-red-500/5 border border-red-500/10 inline-block">
                <p className="text-red-400 font-display font-black uppercase tracking-widest text-sm flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5" /> Marketing without a system is just noise.
                </p>
              </div>
            </motion.div>

            <div className="relative">
              <div className="aspect-square glass-card flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
                {/* Abstract Visual of Chaos */}
                <div className="relative w-full h-full flex items-center justify-center">
                   {[...Array(30)].map((_, i) => (
                     <motion.div 
                       key={i}
                       animate={{ 
                         x: [0, Math.random() * 100 - 50, 0],
                         y: [0, Math.random() * 100 - 50, 0],
                         opacity: [0.1, 0.4, 0.1]
                       }}
                       transition={{ duration: 4 + Math.random() * 4, repeat: Infinity }}
                       className="absolute w-1 h-20 bg-red-500/20 rounded-full rotate-45"
                       style={{ 
                         left: `${Math.random() * 100}%`,
                         top: `${Math.random() * 100}%`,
                         transform: `rotate(${Math.random() * 360}deg)`
                       }}
                     />
                   ))}
                   <div className="relative z-10 text-center">
                      <div className="text-[120px] font-display font-black text-red-500 opacity-20 select-none">LOST</div>
                      <div className="text-sm font-black tracking-[1em] text-red-400 mt-[-40px]">OPPORTUNITIES</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="py-32 px-6 relative">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyber-teal/5 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="section-label mx-auto">The Solution</div>
            <h2 className="text-5xl md:text-[80px] font-display font-black tracking-tighter uppercase mb-8 leading-none">
              We Don’t Run Campaigns. <br />
              <span className="text-gradient">We Build Growth Systems.</span>
            </h2>
            <p className="text-white/40 text-xl max-w-2xl mx-auto font-bold uppercase tracking-widest">
              LyKSpire designs a complete, automated pipeline that works 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
             {/* Path line */}
             <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-cyber-teal/20 to-transparent" />
             
             {solutions.map((sol, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="relative group text-center flex flex-col items-center"
               >
                 <div className="w-24 h-24 rounded-[32px] bg-white/[0.03] border border-white/5 flex items-center justify-center mb-8 group-hover:bg-cyber-teal/10 group-hover:border-cyber-teal/30 transition-all duration-500 shadow-2xl relative z-10">
                   <sol.icon className="w-10 h-10 text-cyber-teal group-hover:scale-110 transition-transform" />
                   <div className="absolute inset-0 rounded-[32px] bg-cyber-teal/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                 </div>
                 
                 <h3 className="text-2xl font-display font-black uppercase tracking-tighter mb-2">{sol.text}</h3>
                 <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">{sol.desc}</p>
                 
                 {i < solutions.length - 1 && (
                   <div className="md:hidden py-6">
                     <ArrowRight className="w-6 h-6 text-white/10 rotate-90" />
                   </div>
                 )}
               </motion.div>
             ))}
          </div>

          <div className="mt-32 p-12 glass-card text-center border-cyber-teal/10">
             <CheckCircle2 className="w-16 h-16 text-cyber-teal mx-auto mb-8 animate-bounce" />
             <h3 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mb-6">
               Your business runs on <span className="text-cyber-teal italic text-gradient">systems</span> — not guesswork.
             </h3>
             <button 
              onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
              className="btn-primary"
            >
              Start Building My System <Zap className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
