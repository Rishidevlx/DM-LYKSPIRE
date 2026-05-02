import { motion } from "motion/react";
import {
  Globe, Mail, Users2, FileText, FolderOpen, Code2, Database,
  Smile, TrendingUp, DollarSign, Target, Clock,
  Settings, Zap, Bot
} from "lucide-react";
import lykspireLogo from "../assest/LYKSPIRE LOGO.png";

const inputs = ["Website","Email","CRM","Forms","Documents","APIs","Databases"];
const outputs = ["Happy Customers","Higher Revenue","Lower Costs","Better Decisions","More Free Time"];
const inputIcons = [Globe, Mail, Users2, FileText, FolderOpen, Code2, Database];
const outputIcons = [Smile, TrendingUp, DollarSign, Target, Clock];

const stats = [
  { icon: Settings, val: "70%",  label: "Manual Work Automated" },
  { icon: DollarSign,val:"40%+", label: "Reduction in Costs" },
  { icon: Zap,       val: "3X",  label: "Faster Execution" },
  { icon: Bot,       val: "24/7",label: "Our AI works for your business" },
];

// Agent cards — no icons, compact
const agents = [
  // [gridCol, gridRow, name, desc, color]
  { col:2, row:1, name:"AI Research Agent",   desc:"Research, collect & analyze data",      color:"#a855f7" },
  { col:1, row:2, name:"AI Sales Agent",       desc:"Qualify leads & nurture 24/7",          color:"#14F195" },
  { col:3, row:2, name:"AI Support Agent",     desc:"Answer, resolve & delight customers",   color:"#3b82f6" },
  { col:1, row:3, name:"AI Operations Agent", desc:"Automate tasks & workflows",             color:"#f59e0b" },
  { col:3, row:3, name:"AI Analytics Agent",  desc:"Generate insights & reports",            color:"#ec4899" },
];

// SVG line endpoints: cell centres as % — 3 equal cols/rows
const pct = { 1: 16.67, 2: 50, 3: 83.33 };

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center relative z-10 w-full">

        {/* ── LEFT ── */}
        <motion.div initial={{ opacity:0, x:-50 }} animate={{ opacity:1, x:0 }} transition={{ duration:.8 }} className="flex flex-col justify-center">
          <span className="inline-flex mb-6 px-3 py-1.5 rounded-full bg-cyber-teal/10 border border-cyber-teal/30 text-cyber-teal text-[10px] font-black uppercase tracking-[.2em] animate-pulse self-start">
            AI Agents &amp; Intelligent Systems That Run Your Business
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tighter text-white">
            Stop Scaling With <span className="text-gradient">People.</span><br />
            Start Scaling With <span className="text-cyber-teal">Systems.</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-[540px] mb-3 leading-relaxed">
            We build AI agents and intelligent platforms that think, decide, and execute — turning manual businesses into autonomous machines.
          </p>
          <p className="text-white/40 text-sm max-w-[480px] mb-10 font-medium">Replace repetitive work. Reduce costs. Scale faster.</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button onClick={() => window.dispatchEvent(new Event("open-chatbot"))} className="btn-primary text-base px-8 py-4 whitespace-nowrap">Get Your AI Automation Plan</button>
            <button onClick={() => window.dispatchEvent(new Event("open-contact-modal"))} className="btn-outline text-base px-8 py-4 whitespace-nowrap">Book Free Strategy Call</button>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[.25em] text-white/30">
            {["AI Agents","Automation Systems","SaaS Platforms","ERP / CRM","Integrations"].map(t => (
              <span key={t} className="flex items-center gap-1.5"><div className="w-1 h-1 bg-cyber-teal rounded-full"/>{t}</span>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT ── */}
        <motion.div initial={{ opacity:0, x:50 }} animate={{ opacity:1, x:0 }} transition={{ duration:1 }} className="flex flex-col gap-3 mt-10 lg:mt-0">
          <p className="text-center text-[10px] font-black uppercase tracking-[.3em] text-white/30 mb-1">Deploy your agents that works for your business</p>

          {/* 3-panel row — relative so full-width SVG overlay can span everything */}
          <div className="flex gap-3 items-center relative">

            {/* ── Full-width SVG overlay: INPUTS→agents and agents→OUTPUTS wires (desktop only) ── */}
            {/* Layout proportions: INPUTS(100px) + gap(12px) + CENTER(flex-1≈370px) + gap(12px) + OUTPUTS(108px) ≈ 602px total */}
            {/* As viewBox 0-100: INPUTS right-edge≈18.6, CENTER col1≈27.7, CENTER col3≈70, OUTPUTS left-edge≈81.4 */}
            {/* Row centres (of flex-1 container height): row1≈17, row2≈50, row3≈83 */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block"
              viewBox="0 0 100 100" preserveAspectRatio="none"
            >
              {/* INPUTS right edge → Sales (col1,row2) */}
              <line x1={18.6} y1={50} x2={27.7} y2={50}   stroke="#14F195" strokeWidth=".5" strokeDasharray="3 2.5" opacity=".4"/>
              {/* INPUTS right edge → Ops  (col1,row3) */}
              <line x1={18.6} y1={50} x2={27.7} y2={83}   stroke="#f59e0b" strokeWidth=".5" strokeDasharray="3 2.5" opacity=".35"/>
              {/* Support (col3,row2) → OUTPUTS left edge */}
              <line x1={70}   y1={50} x2={81.4} y2={50}   stroke="#3b82f6" strokeWidth=".5" strokeDasharray="3 2.5" opacity=".4"/>
              {/* Analytics (col3,row3) → OUTPUTS left edge */}
              <line x1={70}   y1={83} x2={81.4} y2={50}   stroke="#ec4899" strokeWidth=".5" strokeDasharray="3 2.5" opacity=".35"/>

              {/* Animated dots: INPUTS → Sales */}
              <motion.circle r=".9" fill="#14F195"
                initial={{ cx: "18.6", cy: "50", opacity: 0 }}
                animate={{ cx: ["18.6", "27.7", "18.6"], opacity: [0, 1, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}/>
              {/* Animated dots: INPUTS → Ops */}
              <motion.circle r=".9" fill="#f59e0b"
                initial={{ cx: "18.6", cy: "50", opacity: 0 }}
                animate={{ cx: ["18.6", "27.7", "18.6"], cy: ["50", "83", "50"], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}/>
              {/* Animated dots: Support → OUTPUTS */}
              <motion.circle r=".9" fill="#3b82f6"
                initial={{ cx: "70", cy: "50", opacity: 0 }}
                animate={{ cx: ["70", "81.4", "70"], opacity: [0, 1, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.9, ease: "easeInOut" }}/>
              {/* Animated dots: Analytics → OUTPUTS */}
              <motion.circle r=".9" fill="#ec4899"
                initial={{ cx: "70", cy: "83", opacity: 0 }}
                animate={{ cx: ["70", "81.4", "70"], cy: ["83", "50", "83"], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}/>

            </svg>

            {/* INPUTS panel — desktop only */}
            <div className="hidden lg:flex flex-shrink-0 w-[100px] bg-[#0d0d1e] border border-white/8 rounded-2xl px-3 py-4 flex-col gap-2.5 relative z-10">
              <p className="text-white/35 text-[8px] font-black uppercase tracking-widest text-center mb-1">Inputs</p>
              {inputs.map((label, i) => {
                const Icon = inputIcons[i];
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-[18px] h-[18px] rounded bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={9} className="text-white/45"/>
                    </div>
                    <span className="text-white/50 text-[10px]">{label}</span>
                  </div>
                );
              })}
            </div>

            {/* CENTER: Grid + SVG */}
            <div className="flex-1 relative">
              {/* SVG wire lines — percentage-based, viewBox 0 0 100 100 */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                {agents.map((a, i) => (
                  <g key={a.name}>
                    <line
                      x1={pct[2]} y1={pct[2]}
                      x2={pct[a.col as 1|2|3]} y2={pct[a.row as 1|2|3]}
                      stroke={a.color} strokeWidth=".6" strokeDasharray="3 2.5" opacity=".4"
                    />
                    {/* initial cx/cy required to avoid SVG undefined attr error */}
                    <motion.circle
                      r={1} fill={a.color}
                      initial={{ cx: String(pct[2]), cy: String(pct[2]), opacity: 0 }}
                      animate={{ 
                        cx:[String(pct[2]), String(pct[a.col as 1|2|3]), String(pct[2])], 
                        cy:[String(pct[2]), String(pct[a.row as 1|2|3]), String(pct[2])], 
                        opacity:[0,1,0] 
                      }}
                      transition={{ duration:2.2, repeat:Infinity, delay:i*0.45, ease:"easeInOut" }}
                    />
                  </g>
                ))}
              </svg>

              {/* 3×3 CSS Grid — auto row height (cards dictate size) */}
              <div className="relative z-10 grid grid-cols-3 gap-3"
                style={{ gridTemplateRows: "1fr auto 1fr" }}>

                {/* Row 1 */}
                <div/>
                {/* Research */}
                <motion.div initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} transition={{delay:.4}}
                  className="bg-[#0d0d1e] border rounded-xl p-3 relative" style={{borderColor:"#a855f755"}}>
                  <motion.div animate={{opacity:[0,1,0]}} transition={{duration:1.8,repeat:Infinity}}
                    className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full" style={{background:"#a855f7"}}/>
                  <p className="text-white text-[10px] font-black uppercase tracking-wide leading-tight">AI Research Agent</p>
                  <p className="text-white/40 text-[9px] mt-1 leading-snug">Research, collect &amp; analyze data</p>
                </motion.div>
                <div/>

                {/* Row 2 */}
                <motion.div initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} transition={{delay:.5}}
                  className="bg-[#0d0d1e] border rounded-xl p-3 relative self-center" style={{borderColor:"#14F19555"}}>
                  <motion.div animate={{opacity:[0,1,0]}} transition={{duration:1.8,repeat:Infinity,delay:.45}}
                    className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full" style={{background:"#14F195"}}/>
                  <p className="text-white text-[10px] font-black uppercase tracking-wide leading-tight">AI Sales Agent</p>
                  <p className="text-white/40 text-[9px] mt-1 leading-snug">Qualify leads &amp; nurture 24/7</p>
                </motion.div>

                {/* Logo Hub */}
                <div className="flex items-center justify-center py-2">
                  <div className="relative">
                    <motion.div animate={{scale:[1,1.08,1]}} transition={{duration:3,repeat:Infinity}}
                      className="w-[68px] h-[68px] rounded-full bg-[#08081a] border-2 border-purple-500/80 shadow-[0_0_50px_rgba(168,85,247,0.65)] flex items-center justify-center">
                      <img src={lykspireLogo} alt="LyKSpire" style={{width:44,height:44,objectFit:"contain"}}/>
                    </motion.div>
                    {[1.6,2.3].map((s,i)=>(
                      <motion.div key={i} animate={{scale:[1,s],opacity:[0.4,0]}} transition={{duration:2.2,repeat:Infinity,delay:i*.5}}
                        className="absolute inset-0 rounded-full border border-purple-500/40"/>
                    ))}
                  </div>
                </div>

                <motion.div initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} transition={{delay:.6}}
                  className="bg-[#0d0d1e] border rounded-xl p-3 relative self-center" style={{borderColor:"#3b82f655"}}>
                  <motion.div animate={{opacity:[0,1,0]}} transition={{duration:1.8,repeat:Infinity,delay:.9}}
                    className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full" style={{background:"#3b82f6"}}/>
                  <p className="text-white text-[10px] font-black uppercase tracking-wide leading-tight">AI Support Agent</p>
                  <p className="text-white/40 text-[9px] mt-1 leading-snug">Answer, resolve &amp; delight customers</p>
                </motion.div>

                {/* Row 3 */}
                <motion.div initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} transition={{delay:.7}}
                  className="bg-[#0d0d1e] border rounded-xl p-3 relative" style={{borderColor:"#f59e0b55"}}>
                  <motion.div animate={{opacity:[0,1,0]}} transition={{duration:1.8,repeat:Infinity,delay:1.35}}
                    className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full" style={{background:"#f59e0b"}}/>
                  <p className="text-white text-[10px] font-black uppercase tracking-wide leading-tight">AI Operations Agent</p>
                  <p className="text-white/40 text-[9px] mt-1 leading-snug">Automate tasks &amp; workflows</p>
                </motion.div>
                <div/>
                <motion.div initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} transition={{delay:.8}}
                  className="bg-[#0d0d1e] border rounded-xl p-3 relative" style={{borderColor:"#ec489955"}}>
                  <motion.div animate={{opacity:[0,1,0]}} transition={{duration:1.8,repeat:Infinity,delay:1.8}}
                    className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full" style={{background:"#ec4899"}}/>
                  <p className="text-white text-[10px] font-black uppercase tracking-wide leading-tight">AI Analytics Agent</p>
                  <p className="text-white/40 text-[9px] mt-1 leading-snug">Generate insights &amp; reports</p>
                </motion.div>
              </div>
            </div>

            {/* OUTPUTS panel — desktop only */}
            <div className="hidden lg:flex flex-shrink-0 w-[108px] bg-[#0d0d1e] border border-white/8 rounded-2xl px-3 py-4 flex-col gap-3 relative z-10">
              <p className="text-white/35 text-[8px] font-black uppercase tracking-widest text-center mb-1">Outputs</p>
              {outputs.map((label, i) => {
                const Icon = outputIcons[i];
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-[18px] h-[18px] rounded bg-cyber-teal/10 border border-cyber-teal/25 flex items-center justify-center flex-shrink-0">
                      <Icon size={9} className="text-cyber-teal"/>
                    </div>
                    <span className="text-white/55 text-[10px] leading-tight">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: INPUTS & OUTPUTS horizontal strips */}
          <div className="lg:hidden flex flex-col gap-2 mt-2">
            <div className="bg-[#0d0d1e] border border-white/8 rounded-xl px-3 py-2.5">
              <p className="text-white/35 text-[8px] font-black uppercase tracking-widest mb-2 text-center">Inputs</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
                {inputs.map((label, i) => { const Icon = inputIcons[i]; return (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon size={9} className="text-white/40"/>
                    <span className="text-white/50 text-[9px]">{label}</span>
                  </div>
                );})}
              </div>
            </div>
            <div className="bg-[#0d0d1e] border border-white/8 rounded-xl px-3 py-2.5">
              <p className="text-white/35 text-[8px] font-black uppercase tracking-widest mb-2 text-center">Outputs</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
                {outputs.map((label, i) => { const Icon = outputIcons[i]; return (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon size={9} className="text-cyber-teal"/>
                    <span className="text-white/55 text-[9px]">{label}</span>
                  </div>
                );})}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:1}} className="grid grid-cols-4 gap-2 mt-1">
            {stats.map(({icon:Icon,val,label})=>(
              <div key={val} className="bg-[#0d0d1e] border border-white/8 rounded-xl p-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-purple-400"/>
                </div>
                <div>
                  <p className="text-cyber-teal font-black text-sm leading-none">{val}</p>
                  <p className="text-white/35 text-[8px] leading-tight mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
