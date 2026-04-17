import { motion } from "motion/react";
import { Cpu, Zap, Shield, Globe } from "lucide-react";
import logo from "../assest/LYKSPIRE LOGO.png";

const storyLines = [
  { text: "We don’t do marketing.", highlight: false },
  { text: "We build growth systems.", highlight: true },
  { text: "At LYKSPIRE, we combine GenAI,", highlight: false },
  { text: "automation, and performance marketing.", highlight: true },
  { text: "To create systems that attract,", highlight: false },
  { text: "engage, and convert. Consistently.", highlight: true },
  { text: "Because growth should not be random.", highlight: false },
  { text: "It should be engineered.", highlight: true }
];

const founders = [
  {
    name: "Karunakaran Vijayaraghavan",
    role: "Founder",
    description: "Karunakaran Vijayaraghavan founded LyKSpire with a clear vision: to redefine how businesses grow using AI, automation, and intelligent marketing systems. With a strong focus on building scalable frameworks rather than one-time campaigns, he believes that true growth comes from structured execution, data-driven decisions, and continuous optimization.",
    icon: Cpu
  },
  {
    name: "Lokeshwari Subramanian",
    role: "Co-Founder",
    description: "Lokeshwari Subramanian brings a strategic and creative edge to LyKSpire. With a deep understanding of audience behavior and digital trends, she ensures that every campaign is both impactful and performance-driven. Her expertise lies in aligning brand voice with growth strategies — turning ideas into high-converting content and campaigns.",
    icon: Zap
  }
];

const stats = [
  { label: "AI Efficiency", value: "95%", icon: Cpu },
  { label: "Scale Velocity", value: "4x", icon: Zap },
  { label: "System Uptime", value: "24/7", icon: Shield },
  { label: "Global Reach", value: "∞", icon: Globe }
];

export default function About() {

  return (
    <div id="about" className="bg-obsidian text-white overflow-hidden">
      {/* Futuristic Intro / Storytelling */}
      <section className="relative py-32 md:py-48 hidden md:block">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none w-[80vw] max-w-4xl">
          <img src={logo} alt="LYKSPIRE" className="w-full h-auto grayscale" />
        </div>
        {/* Background Grid & HUD Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-[rgba(10,10,10,0.8)]" />
        
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 flex flex-col items-center text-center">
          <div className="space-y-4">
            {storyLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`text-4xl md:text-6xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-tight ${line.highlight ? "text-cyber-teal" : "text-white/60"}`}
              >
                {line.text}
              </motion.div>
            ))}
          </div>
        </div>

        {/* HUD Corner Accents */}
        <div className="absolute top-20 left-20 w-32 h-32 border-t-2 border-l-2 border-cyber-teal/30 rounded-tl-3xl opacity-50" />
        <div className="absolute bottom-20 right-20 w-32 h-32 border-b-2 border-r-2 border-cyber-teal/30 rounded-br-3xl opacity-50" />
      </section>

      {/* Mobile Storytelling (Simplified) */}
      <section className="md:hidden py-24 px-6 space-y-12">
        <div className="section-label">Our Mission</div>
        {storyLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-3xl font-display font-black uppercase tracking-tighter ${line.highlight ? "text-cyber-teal" : "text-white/40"}`}
          >
            {line.text}
          </motion.div>
        ))}
      </section>

      {/* Stats / System Metrics */}
      <section className="py-24 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:border-cyber-teal/30 transition-colors group"
            >
              <stat.icon className="w-8 h-8 text-cyber-teal mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-display font-black text-white mb-1">{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Founders Section - Futuristic HUD Cards */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="section-label">Leadership</div>
            <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase">
              The <span className="text-gradient">Architects</span>
            </h2>
          </div>
          <p className="text-white/40 max-w-md text-sm leading-relaxed">
            Engineering growth through a unique blend of strategic vision, technical automation, and creative performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {founders.map((founder, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* HUD Frame */}
              <div className="absolute -inset-4 border border-white/5 rounded-[40px] group-hover:border-cyber-teal/20 transition-colors duration-500" />
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-teal/40 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-all" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-teal/40 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-all" />

              <div className="relative glass-card p-12 h-full flex flex-col">
                <div className="flex items-start justify-between mb-10">
                  <div>
                    <h3 className="text-3xl font-black font-display uppercase tracking-tighter mb-2">{founder.name}</h3>
                    <div className="px-3 py-1 bg-cyber-teal/10 border border-cyber-teal/20 rounded-full inline-block">
                      <span className="text-cyber-teal text-[10px] font-black uppercase tracking-widest">{founder.role}</span>
                    </div>
                  </div>
                  <founder.icon className="w-10 h-10 text-white/10 group-hover:text-cyber-teal transition-colors" />
                </div>
                
                <p className="text-white/50 leading-relaxed text-sm mb-12 flex-1">
                  {founder.description}
                </p>

                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/20">System ID: 00{i + 1}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final Philosophy - High Impact */}
      <section className="py-48 px-6 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-cyber-teal/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.1)_0%,transparent_70%)]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center relative z-10"
        >
          <div className="text-cyber-teal font-black uppercase tracking-[0.4em] text-xs mb-8">Core Philosophy</div>
          <h2 className="text-7xl md:text-[120px] font-display font-black uppercase tracking-tighter leading-[0.8] mb-12">
            Growth is <br />
            <span className="text-gradient">Not Luck.</span>
          </h2>
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-12 bg-white/20" />
            <p className="text-white/40 font-black uppercase tracking-widest text-sm">It’s built with the right systems.</p>
            <div className="h-px w-12 bg-white/20" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
