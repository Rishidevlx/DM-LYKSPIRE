import { motion } from "motion/react";
import { Check, ArrowRight, Activity, Target, Zap, Waves, Filter, Heart, Repeat } from "lucide-react";
import caseStudyImg from "../assest/Case studies Slide 2.jpeg";
import { useState, useEffect } from "react";

const TypingScalable = () => {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const targetText = "Scalable.";
  
  useEffect(() => {
    // Initial type
    let i = 0;
    let current = "";
    setDone(false);
    
    const type = () => {
      const interval = setInterval(() => {
        if (i < targetText.length) {
          current += targetText[i];
          setText(current);
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, 150);
      return interval;
    };
    
    const initial = type();
    
    // Repeat every 10s
    const loop = setInterval(() => {
      i = 0;
      current = "";
      setText("");
      setDone(false);
      type();
    }, 10000);

    return () => {
      clearInterval(initial);
      clearInterval(loop);
    };
  }, []);

  return (
    <motion.span
      animate={done ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="inline-block text-gradient"
    >
      {text}
    </motion.span>
  );
};

const steps = [
  {
    title: "Discover",
    description: "We understand your brand, market, and audience to identify the biggest growth opportunities.",
    details: ["Identify brand and growth opportunities", "Understand your audience and market", "Build a clear marketing direction"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Strategy",
    description: "We design a clear marketing strategy aligned with your brand goals and growth opportunities.",
    details: ["Define the right marketing channels", "Build a strong content strategy", "Create a roadmap for brand growth"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Create",
    description: "We produce high-impact content, visuals, and campaigns designed to capture attention and grow your brand.",
    details: ["Create engaging visual content", "Develop campaigns that attract attention", "Launch marketing assets across platforms"],
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Scale",
    description: "We analyze performance, optimize campaigns, and scale marketing efforts to drive continuous brand growth.",
    details: ["Track campaign performance", "Optimize marketing strategies", "Scale growth across platforms"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600"
  }
];

const flowStages = [
  { label: "Traffic", desc: "Attract audience", icon: Waves, color: "text-blue-400" },
  { label: "Magnet", desc: "Capture leads", icon: Target, color: "text-purple-400" },
  { label: "Filter", desc: "Qualify intent", icon: Filter, color: "text-cyber-teal" },
  { label: "Nurture", desc: "Build trust", icon: Heart, color: "text-pink-400" },
  { label: "Convert", desc: "Close deals", icon: Zap, color: "text-orange-400" },
  { label: "Retain", desc: "Ensure loyalty", icon: Repeat, color: "text-green-400" }
];

export default function Process() {
  return (
    <section id="process" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* NEW: How We Work Section */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-48">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-label">Our Philosophy</div>
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase mb-8">How We <br/> <span className="text-gradient">Work</span></h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl">
              We don't just execute tasks; we engineer growth. Our approach combines deep data analysis with creative storytelling, ensuring every dollar spent translates into measurable business velocity. We act as an extension of your team, obsessing over conversion as much as you do.
            </p>
          </motion.div>

          <div className="mt-20 pt-20 border-t border-white/5">
            <div className="text-center mb-16">
               <div className="section-label mx-auto">System Architecture</div>
               <h3 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase mb-4">Intelligence Flow</h3>
               <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
                 The Automated Growth Engine
               </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-4 relative">
              {flowStages.map((stage, i) => (
                <div key={i} className="flex flex-col lg:flex-row items-center flex-1 w-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group w-full"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4 group-hover:bg-white/[0.06] group-hover:border-cyber-teal/30 transition-all duration-500 shadow-xl relative z-10`}>
                        <stage.icon className={`w-6 h-6 ${stage.color} group-hover:scale-110 transition-transform`} />
                        <div className={`absolute inset-0 rounded-xl ${stage.color.replace('text', 'bg')}/5 animate-pulse -z-10`} />
                      </div>

                      <h4 className="font-display font-black uppercase text-sm tracking-tighter mb-1 text-white">{stage.label}</h4>
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 text-center leading-tight max-w-[80px]">
                        {stage.desc}
                      </p>
                    </div>
                  </motion.div>

                  {/* Animated Glowing Arrow - Desktop */}
                  {i < flowStages.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center w-full px-1">
                      <motion.div 
                        animate={{ 
                          x: [0, 5, 0],
                          opacity: [0.2, 1, 0.2]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight className="w-4 h-4 text-cyber-teal/40" />
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Mobile Arrow */}
                  {i < flowStages.length - 1 && (
                    <div className="lg:hidden py-2">
                      <motion.div 
                        animate={{ y: [0, 3, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4 text-cyber-teal/30 rotate-90" />
                      </motion.div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-32">
          <div className="section-label">Our Workflow</div>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-display font-black tracking-tighter uppercase mb-6 md:mb-8 leading-tight">
            Simple. 
            {/* STRUCTURED — Crack animation matching "Isn't Delivering" style */}
            <span className="relative inline-block mx-2">
              {/* Top Half — slides UP on crack, returns after 2s */}
              <motion.span
                whileInView={{
                  y: [0, -8, -8, 0],
                  transition: { duration: 10, repeat: Infinity, times: [0, 0.08, 0.28, 0.38] }
                }}
                viewport={{ once: true }}
                className="absolute inset-0 text-white select-none pointer-events-none"
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 48%, 85% 52%, 50% 47%, 15% 53%, 0% 47%)' }}
              >
                Structured.
              </motion.span>
              {/* Bottom Half — slides DOWN on crack, returns after 2s */}
              <motion.span
                whileInView={{
                  y: [0, 8, 8, 0],
                  transition: { duration: 10, repeat: Infinity, times: [0, 0.08, 0.28, 0.38] }
                }}
                viewport={{ once: true }}
                className="absolute inset-0 text-white select-none pointer-events-none"
                style={{ clipPath: 'polygon(0% 47%, 15% 53%, 50% 47%, 85% 52%, 100% 48%, 100% 100%, 0% 100%)' }}
              >
                Structured.
              </motion.span>
              {/* Purple Glow Layer — fires after rejoin */}
              <motion.span
                whileInView={{
                  opacity: [0, 0, 0, 1, 0],
                  textShadow: ["none", "none", "none", "0 0 25px rgba(168,85,247,0.9)", "none"],
                  transition: { duration: 10, repeat: Infinity, times: [0, 0.3, 0.38, 0.45, 0.55] }
                }}
                viewport={{ once: true }}
                className="text-[#a855f7]"
              >
                Structured.
              </motion.span>
              {/* invisible base to hold layout */}
              <span className="opacity-0">Structured.</span>
            </span>
            <br />
            <TypingScalable />
          </h2>
          <p className="text-white/40 text-xl font-bold uppercase tracking-widest max-w-xl">
            We follow a proven methodology to engineer your growth system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              num: "01",
              title: "Strategy Call",
              desc: "We understand your business, goals, and challenges.",
              icon: Target
            },
            {
              num: "02",
              title: "System Design",
              desc: "We map a custom growth engine tailored to you.",
              icon: Layers
            },
            {
              num: "03",
              title: "Build & Automate",
              desc: "We implement tools, funnels, and workflows.",
              icon: Zap
            },
            {
              num: "04",
              title: "Launch & Optimize",
              desc: "We track, refine, and scale performance.",
              icon: Activity
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-10 group hover:border-cyber-teal/40 transition-all"
            >
              <div className="text-5xl font-display font-black text-white/5 mb-8 group-hover:text-cyber-teal/10 transition-colors">
                {item.num}
              </div>
              <h3 className="text-3xl font-display font-black uppercase tracking-tighter mb-4 group-hover:text-cyber-teal transition-colors">
                {item.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed uppercase tracking-widest font-bold">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Re-using these icons for the grid
const Layers = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.1 6.27a2 2 0 0 0 0 3.45l9.07 4.09a2 2 0 0 0 1.66 0l9.07-4.09a2 2 0 0 0 0-3.45z"/><path d="m2.1 14.27 9.07 4.09a2 2 0 0 0 1.66 0l9.07-4.09"/><path d="m2.1 19.27 9.07 4.09a2 2 0 0 0 1.66 0l9.07-4.09"/></svg>
);
