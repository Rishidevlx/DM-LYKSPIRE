import { motion } from "motion/react";
import { Check, ArrowRight, Activity, Target, Zap, Waves, Filter, Heart, Repeat } from "lucide-react";
import caseStudyImg from "../assest/Case studies Slide 2.jpeg";

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

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Floating Frame Layout */}
            <div className="absolute -inset-4 bg-cyber-teal/10 rounded-[40px] blur-2xl" />
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative glass-card p-2 rounded-[32px] border border-white/10 overflow-hidden shadow-2xl"
            >
              <img 
                src={caseStudyImg} 
                alt="Process Visualization" 
                className="w-full h-auto rounded-[24px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>
        </div>

        <div className="mb-32">
          <div className="section-label">Our Process</div>
          <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase mb-8">
            How We Grow <br /> Your Brand
          </h2>
          <p className="text-white/40 text-xl max-w-xl leading-relaxed">
            We follow a structured marketing process to turn strategy, content, and campaigns into real business growth.
          </p>
        </div>

        <div className="space-y-40">
          {steps.map((step, i) => (
            <div key={i} className={`flex flex-col lg:flex-row gap-20 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div 
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <h3 className="text-5xl md:text-6xl font-display font-black tracking-tighter uppercase mb-6">{step.title}</h3>
                <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-lg">
                  {step.description}
                </p>
                
                <div className="space-y-4 border-t border-white/10 pt-10">
                  {step.details.map((detail, j) => (
                    <div key={j} className="flex items-center gap-4 text-white/50">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                        <Check className="w-3 h-3 text-cyber-teal" />
                      </div>
                      <span className="text-sm font-bold uppercase tracking-wider">{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex-1 w-full"
              >
                <div className="aspect-square glass-card p-0 overflow-hidden relative group">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-obsidian via-transparent to-transparent" />
                  
                  {/* Abstract 3D Overlay - Removed Central Circle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Circle icon removed as requested */}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Enhanced Intelligence Flow */}
        <div className="mt-48 pt-48 border-t border-white/5">
          <div className="text-center mb-24">
             <div className="section-label mx-auto">System Architecture</div>
             <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase mb-6">Intelligence Flow</h2>
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
                    <div className={`w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white/[0.06] group-hover:border-cyber-teal/30 transition-all duration-500 shadow-xl relative z-10`}>
                      <stage.icon className={`w-8 h-8 ${stage.color} group-hover:scale-110 transition-transform`} />
                      <div className={`absolute inset-0 rounded-2xl ${stage.color.replace('text', 'bg')}/5 animate-pulse -z-10`} />
                    </div>

                    <h3 className="font-display font-black uppercase text-base tracking-tighter mb-2 text-white">{stage.label}</h3>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 text-center leading-tight max-w-[100px]">
                      {stage.desc}
                    </p>
                  </div>
                </motion.div>

                {/* Animated Glowing Arrow - Desktop */}
                {i < flowStages.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center w-full px-2">
                    <motion.div 
                      animate={{ 
                        x: [0, 10, 0],
                        opacity: [0.2, 1, 0.2]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-6 h-6 text-cyber-teal/40" />
                    </motion.div>
                  </div>
                )}
                
                {/* Mobile Arrow */}
                {i < flowStages.length - 1 && (
                  <div className="lg:hidden py-4">
                    <motion.div 
                      animate={{ y: [0, 5, 0], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5 text-cyber-teal/30 rotate-90" />
                    </motion.div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
