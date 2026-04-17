import { motion } from "motion/react";
import { Check } from "lucide-react";

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

export default function Process() {
  return (
    <section id="process" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
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
                  
                  {/* Abstract 3D Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-32 h-32 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 animate-pulse" />
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
