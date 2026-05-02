import { motion } from "motion/react";

const clientLogos = [
  "SaaSkart", "DocuChain", "Growthly", "Taskly", "DataPilot", "Finova", "Shoplio",
  "CloudScale", "DevSync", "MarketFlow", "BizEdge", "NextGen", "SmartOps", "AutoLead"
];

export default function Clients() {
  return (
    <section id="clients" className="py-24 bg-obsidian overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col items-center text-center">
          <div className="section-label">Our Clients</div>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase mb-4">
            Trusted by <span className="text-gradient">Industry Leaders</span>
          </h2>
          <p className="text-white/40 text-sm max-w-2xl uppercase tracking-widest font-bold">
            Empowering businesses globally with AI-driven growth strategies and automated execution.
          </p>
        </div>
      </div>

      <div className="relative flex overflow-hidden group">
        <motion.div
          className="flex whitespace-nowrap gap-12 py-10"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            ease: "linear",
            duration: 30,
            repeat: Infinity,
          }}
        >
          {/* Double the array for seamless looping */}
          {[...clientLogos, ...clientLogos].map((client, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyber-teal/30 hover:bg-white/[0.05] transition-all duration-500 group/item"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyber-teal/20 flex items-center justify-center border border-white/10 group-hover/item:scale-110 transition-transform">
                <span className="text-cyber-teal font-black text-xl italic">{client[0]}</span>
              </div>
              <span className="text-2xl font-display font-black tracking-tighter uppercase text-white/40 group-hover/item:text-white transition-colors">
                {client}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Gradient Overlays for smooth edges */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-obsidian to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-obsidian to-transparent z-10" />
      </div>
    </section>
  );
}
