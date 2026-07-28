import { motion } from "motion/react";
import { XCircle, CheckCircle2, AlertTriangle, ArrowRight, Zap, Target, Layers, Bot, RefreshCcw } from "lucide-react";

const problems = [
  "You have software but it doesn't connect your business",
  "Teams do repetitive work that AI should be handling",
  "Technology choices aren't aligned with business outcomes",
  "Legacy systems slow down your growth and operations",
  "You're scaling people instead of scaling intelligent systems"
];

const solutions = [
  { text: "Discover", icon: Target, desc: "Understand your business" },
  { text: "Design", icon: Bot, desc: "Architect the right solution" },
  { text: "Engineer", icon: Layers, desc: "Build scalable systems" },
  { text: "Deploy", icon: Zap, desc: "Launch with confidence" },
  { text: "Optimize", icon: RefreshCcw, desc: "Scale with AI & analytics" }
];

export default function ProblemSolution() {
  return (
    <div className="bg-obsidian relative overflow-hidden">
      {/* PROBLEM SECTION */}
      <section className="py-32 px-6 border-b border-white/5 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="section-label text-red-400 border-red-400/20 bg-red-400/5">The Challenge</div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-black tracking-tighter uppercase mb-6 md:mb-8 leading-tight relative">
                Why Your Technology <br />
                <div className="relative inline-block mt-2">
                  {/* Top Half of Text */}
                  <motion.span 
                    initial={{ y: 0, rotate: 0 }}
                    whileInView={{ 
                      y: [0, -5, -5, -7, -5],
                      rotate: [0, -1, -1, -2, -1],
                      transition: { 
                        times: [0, 0.1, 0.8, 0.9, 1],
                        duration: 10, 
                        repeat: Infinity,
                        delay: 2
                      } 
                    }}
                    viewport={{ once: true }}
                    className="absolute inset-0 text-red-500 select-none pointer-events-none"
                    style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 48%, 85% 52%, 70% 47%, 50% 55%, 30% 45%, 15% 53%, 0% 47%)' }}
                  >
                    Isn't Delivering
                  </motion.span>
                  
                  {/* Bottom Half of Text */}
                  <motion.span 
                    initial={{ y: 0, rotate: 0 }}
                    whileInView={{ 
                      y: [0, 5, 5, 7, 5],
                      rotate: [0, 0.5, 0.5, 1, 0.5],
                      transition: { 
                        times: [0, 0.1, 0.8, 0.9, 1],
                        duration: 10, 
                        repeat: Infinity,
                        delay: 2
                      } 
                    }}
                    viewport={{ once: true }}
                    className="absolute inset-0 text-red-500 select-none pointer-events-none"
                    style={{ clipPath: 'polygon(0% 47%, 15% 53%, 30% 45%, 50% 55%, 70% 47%, 85% 52%, 100% 48%, 100% 100%, 0% 100%)' }}
                  >
                    Isn't Delivering
                  </motion.span>

                  {/* Base Text (Invisible to maintain layout) */}
                  <span className="opacity-0">Isn't Delivering</span>

                  {/* Realistic Crack Line Effect */}
                  <motion.svg 
                    initial={{ opacity: 0, pathLength: 0 }}
                    whileInView={{ 
                      opacity: [0, 1, 1, 0.8, 1],
                      pathLength: [0, 1, 1, 1, 1],
                      transition: { 
                        times: [0, 0.1, 0.8, 0.9, 1],
                        duration: 10, 
                        repeat: Infinity,
                        delay: 2
                      } 
                    }}
                    viewport={{ once: true }}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible" 
                    viewBox="0 0 500 100"
                  >
                    <path 
                      d="M 0 50 L 75 56 L 150 48 L 250 58 L 350 50 L 425 55 L 500 51" 
                      fill="none" 
                      stroke="rgba(255,255,255,0.8)" 
                      strokeWidth="2" 
                      className="drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                    />
                  </motion.svg>
                </div> Results
              </h2>
              <p className="text-white/60 text-lg mb-12 max-w-xl">
                Most businesses don't lack technology — <span className="text-white font-bold">they lack intelligent systems.</span> Without a connected, automated foundation, your growth hits a ceiling.
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
                  <AlertTriangle className="w-5 h-5" /> Technology without intelligence is just overhead.
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
                    <div className="relative z-10 w-full h-full p-8 flex flex-col items-center justify-start pt-8">
                        <motion.div 
                         initial={{ opacity: 0, y: -20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         className="text-3xl md:text-4xl lg:text-5xl font-black tracking-[0.3em] md:tracking-[0.5em] text-red-500 mb-4 md:mb-6 self-center"
                        >
                          MISSES
                        </motion.div>
                        
                        <div className="relative w-full flex-1">
                          {/* Straight down arrow — left side, top to bottom */}
                          <motion.svg 
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            viewBox="0 0 400 320"
                          >
                            {/* Vertical line on left side */}
                            <motion.path 
                              d="M 40 10 L 40 290" 
                              fill="none" 
                              stroke="rgba(239, 68, 68, 0.6)" 
                              strokeWidth="3"
                              initial={{ pathLength: 0 }}
                              whileInView={{ pathLength: 1 }}
                              transition={{ duration: 1.6, ease: "easeInOut" }}
                            />
                            {/* Arrow head pointing DOWN */}
                            <motion.polygon
                              points="28,276 40,300 52,276"
                              fill="rgba(239, 68, 68, 0.8)"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ delay: 1.4 }}
                            />
                          </motion.svg>

                          {/* GROWTH letters — staggered diagonally to the RIGHT of the arrow */}
                          {["G", "R", "O", "W", "T", "H"].map((letter, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: 20, y: -10 }}
                              whileInView={{ opacity: 1, x: 0, y: 0 }}
                              transition={{ delay: 0.3 + i * 0.18, duration: 0.5 }}
                              className="absolute text-5xl md:text-6xl font-display font-black text-red-600/40"
                              style={{ 
                                left: `${20 + i * 12}%`, 
                                top: `${5 + i * 15}%`,
                                textShadow: '0 0 30px rgba(239, 68, 68, 0.3)'
                              }}
                            >
                              {letter}
                            </motion.div>
                          ))}
                        </div>
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
              More Than a Development Company. <br />
              <span className="text-gradient">We Deliver Business Outcomes.</span>
            </h2>
            <p className="text-white/70 text-xl max-w-2xl mx-auto font-bold uppercase tracking-widest">
              LykSpire becomes your long-term technology partner — helping you continuously innovate, adopt AI, and build solutions that grow with your business.
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
             <h3 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter mb-6 leading-tight">
                Your business runs on <span className="text-cyber-teal italic text-gradient">intelligent systems</span> — not 
                <motion.span 
                  initial={{ filter: "blur(12px)", opacity: 0 }}
                  whileInView={{ 
                    filter: ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"],
                    opacity: [0, 1, 1, 0],
                    transition: { 
                      duration: 10, 
                      repeat: Infinity,
                      times: [0, 0.1, 0.3, 0.4],
                      repeatDelay: 0,
                      delay: 1
                    }
                  }}
                  viewport={{ once: true }}
                  className="inline-block ml-3"
                >
                  guesswork.
                </motion.span>
             </h3>
             <button 
              onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
              className="btn-primary"
            >
              Start Building My Intelligent Business <Zap className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
