import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Cpu, Zap, Shield, Globe } from "lucide-react";
import logo from "../assest/LYKSPIRE LOGO.png";

// --- Sub-components moved to top to fix hoisting errors ---

interface ScrambledLetterProps {
  targetChar: string;
  delay: number;
}

const ScrambledLetter: React.FC<ScrambledLetterProps> = ({ targetChar, delay }) => {
  const [char, setChar] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      if (iteration > 15) {
        setChar(targetChar);
        clearInterval(interval);
      } else {
        setChar(chars[Math.floor(Math.random() * chars.length)]);
      }
      iteration++;
    }, 40);
    return () => clearInterval(interval);
  }, [targetChar]);

  return (
    <motion.span
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="inline-block min-w-[0.6em] text-cyber-teal drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] text-center"
    >
      {char || "\u00A0"}
    </motion.span>
  );
};

interface ScrambledTextProps {
  text: string;
}

const ScrambledText: React.FC<ScrambledTextProps> = ({ text }) => {
  return (
    <div className="flex justify-center items-center">
      {text.split("").map((char, i) => (
        <ScrambledLetter key={`${text}-${i}`} targetChar={char} delay={i * 0.05} />
      ))}
    </div>
  );
};

const TypingWords: React.FC = () => {
  const [index, setIndex] = useState(0);
  const words = ["SYSTEMS.", "STRATEGY."];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % words.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 md:gap-6 overflow-visible">
      <div className="flex items-center gap-4 text-3xl md:text-5xl lg:text-[90px] font-display font-black uppercase tracking-tighter">
        <motion.span
          initial={{ filter: "blur(20px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-white"
        >
          RIGHT
        </motion.span>
        <ScrambledText key={String(index)} text={words[index]} />
      </div>
    </div>
  );
};

const storyLines = [
  { text: "We don’t do marketing.", highlight: false },
  { text: "We build growth systems.", highlight: true },
  {
    text: "At LYKSPIRE, we combine GenAI,",
    highlight: true,
    customStyle: (t: string) => {
      return (
        <span>
          At LYKSPIRE, we combine <span className="text-cyber-teal">GenAI</span>,
        </span>
      );
    }
  },
  {
    text: "automation, performance marketing.",
    highlight: true,
    customStyle: (t: string) => {
      return (
        <span>
          <span className="text-white/40">automation</span>, <span className="text-cyber-teal">performance &</span> <span className="text-white/40">marketing</span>.
        </span>
      );
    }
  },
  { text: "To create systems that attract,", highlight: false },
  { text: "engage, convert & Consistently.", highlight: true },
  { text: "Because growth should not be random.", highlight: false },
  {
    text: "It should be 3NG!N33R3D.",
    highlight: true,
    customStyle: () => {
      return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-x-6 gap-y-2 translate-y-[4px]">
          <span className="text-white/60">It should be</span>
          <div className="relative min-w-[300px] text-cyber-teal">
            <motion.span
              animate={{
                opacity: [1, 1, 0, 1],
              }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              <motion.span
                initial={{ width: 0 }}
                animate={{
                  width: ["0%", "100%", "100%", "0%"],
                  transition: {
                    duration: 10,
                    repeat: Infinity,
                    times: [0, 0.2, 0.8, 1],
                    ease: "easeInOut"
                  }
                }}
                className="inline-block overflow-hidden whitespace-nowrap border-r-4 border-cyber-teal translate-y-[4px]"
              >
                3NG!N33R3D.
              </motion.span>
            </motion.span>
          </div>
        </div>
      );
    }
  }
];

const founders = [
  {
    name: "Vijayayaraghavan Ramakrishanan",
    role: "Director & Chief Financial Officer",
    description: "Vijayayaraghavan Ramakrishanan brings over 24 years of entrepreneurial experience, with a strong foundation in digital media, printing, and advertising. Having built and scaled his own business over decades, he possesses deep expertise in brand execution, creative production, and commercial strategy.\n\nAt LyKSpire, he leads financial strategy and contributes to the company’s long-term vision, ensuring disciplined growth, operational efficiency, and scalable execution. His leadership bridges traditional business strength with a modern, innovation-driven approach — enabling the company to deliver consistent, high-impact outcomes for a global client base.\n\nWith a proven track record across evolving media landscapes, he provides the strategic backbone that supports LyKSpire’s ambition to operate at a global standard.",
    icon: Globe
  },
  {
    name: "Karunakaran Vijayaraghavan",
    role: "Founder",
    description: "Karunakaran Vijayaraghavan founded LyKSpire with a clear vision: to redefine how businesses grow using AI, automation, and intelligent marketing systems. With a strong focus on building scalable frameworks rather than one-time campaigns, he believes that true growth comes from structured execution, data-driven decisions, and continuous optimization.",
    icon: Cpu
  },
  {
    name: "Lokeshwari Subramaniyan",
    role: "Co-Founder",
    description: "Lokeshwari Subramaniyan brings a strategic and creative edge to LyKSpire. With a deep understanding of audience behavior and digital trends, she ensures that every campaign is both impactful and performance-driven. Her expertise lies in aligning brand voice with growth strategies — turning ideas into high-converting content and campaigns.",
    icon: Zap
  }
];

const stats = [
  { label: "AI Efficiency", value: "95%", icon: Cpu },
  { label: "Scale Velocity", value: "10x", icon: Zap },
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
                {line.customStyle ? line.customStyle(line.text) : line.text}
              </motion.div>
            ))}
          </div>
        </div>

        {/* HUD Corner Accents */}
        <div className="absolute top-20 left-20 w-32 h-32 border-t-2 border-l-2 border-cyber-teal/30 rounded-tl-3xl opacity-50" />
        <div className="absolute bottom-20 right-20 w-32 h-32 border-b-2 border-r-2 border-cyber-teal/30 rounded-br-3xl opacity-50" />
      </section>

      {/* Mobile Storytelling (Simplified) */}
      <section className="md:hidden py-24 px-6 space-y-12 text-center">
        <div className="section-label mx-auto">Our Mission</div>
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

      {/* Philosophy Grid Boxes */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-cyber-teal/30 transition-colors"
          >
            <Cpu className="w-10 h-10 text-cyber-teal mb-6" />
            <h3 className="text-2xl font-display font-black uppercase tracking-tighter mb-4 italic text-gradient">95% AI Efficiency</h3>
            <p className="text-white/40 text-[10px] leading-relaxed uppercase tracking-widest font-black">Guided by Human Intelligence</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-cyber-teal/30 transition-colors"
          >
            <Shield className="w-10 h-10 text-cyber-teal mb-6" />
            <h3 className="text-2xl font-display font-black uppercase tracking-tighter mb-4 italic">Anytime Reach</h3>
            <p className="text-white/40 text-[10px] leading-relaxed uppercase tracking-widest font-black">Uninterrupted Growth Support</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-cyber-teal/30 transition-colors"
          >
            <Globe className="w-10 h-10 text-cyber-teal mb-6" />
            <h3 className="text-2xl font-display font-black uppercase tracking-tighter mb-4 italic">AI X Human Touch</h3>
            <p className="text-white/40 text-[10px] leading-relaxed uppercase tracking-widest font-black">
              Driven by Real Creators.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="p-8 rounded-3xl bg-cyber-teal/5 border border-cyber-teal/20 group hover:border-cyber-teal/40 transition-colors shadow-[0_0_30px_rgba(74,222,128,0.05)]"
          >
            <Zap className="w-10 h-10 text-cyber-teal mb-6" />
            <h3 className="text-2xl font-display font-black uppercase tracking-tighter mb-4 italic leading-tight">Accelerate Growth by 10×</h3>
            <p className="text-white/40 text-[10px] leading-relaxed uppercase tracking-widest font-black">Velocity Engineered</p>
          </motion.div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="section-label">Leadership</div>
            <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase relative">
              The <span className="text-gradient">Growth</span>
              <br />
              <div className="relative inline-block text-[#a855f7]">
                Architects
                <motion.div
                  animate={{
                    x: [0, 20, 0, -20, 0],
                    y: [0, -10, 0, 10, 0],
                    scale: [1, 1.5, 1],
                    rotate: [0, 45, 0, -45, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-12 w-8 h-8 flex items-center justify-center pointer-events-none"
                >
                  <div
                    className="w-full h-full bg-gradient-to-tr from-cyber-teal via-purple-500 to-cyber-teal shadow-[0_0_20px_rgba(74,222,128,0.5)]"
                    style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}
                  />
                  <div className="absolute inset-0 bg-white/20 blur-sm rounded-full" />
                </motion.div>
              </div>
            </h2>
          </div>
          <p className="text-white/40 max-w-md text-sm leading-relaxed">
            Engineering growth through a unique blend of strategic vision, technical automation, and creative performance.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {founders.map((founder, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative group w-full md:w-[85%] lg:w-[75%] ${i % 2 === 0 ? "self-start" : "self-end"}`}
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

                <p className="text-white/50 leading-relaxed text-sm mb-12 flex-1 whitespace-pre-line">
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
      <section className="py-24 md:py-48 px-4 md:px-6 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cyber-teal/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.1)_0%,transparent_70%)]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center relative z-10"
        >
          <div className="text-cyber-teal font-black uppercase tracking-[0.4em] text-xs mb-8">Core Philosophy</div>
          <h2 className="text-5xl md:text-7xl lg:text-[120px] font-display font-black uppercase tracking-tighter leading-[0.8] mb-8">
            Growth is <br />
            <span className="text-gradient">Not Luck.</span>
          </h2>
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-white/20" />
              <p className="text-white/40 font-black uppercase tracking-widest text-sm">It’s built with the</p>
              <div className="h-px w-12 bg-white/20" />
            </div>

            <div className="h-40 flex items-center justify-center mt-4">
              <TypingWords />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}