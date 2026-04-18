import { motion } from "motion/react";
import { TrendingUp, Clock, Zap, Maximize } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";

const baseData = [
  { name: 'Month 1', value: 400 },
  { name: 'Month 2', value: 800 },
  { name: 'Month 3', value: 1200 },
  { name: 'Month 4', value: 2400 },
  { name: 'Month 5', value: 3800 },
  { name: 'Month 6', value: 5200 },
  { name: 'Month 7', value: 7800 },
];

export default function Results() {
  const [colorIndex, setColorIndex] = useState(0);
  const [graphData, setGraphData] = useState(baseData);
  
  const colors = [
    { stroke: "#3b82f6", fill: "#3b82f6" }, // Blue
    { stroke: "#a855f7", fill: "#a855f7" }, // Purple/Gradient
    { stroke: "#22c55e", fill: "#22c55e" }  // Green
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
      
      // Add slight jitter to values but keep the trend upward
      setGraphData(prev => prev.map((d, i) => ({
        ...d,
        value: baseData[i].value + (Math.random() * 500 - 250)
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const outcomes = [
    { text: "Increase conversion rates", icon: TrendingUp },
    { text: "Reduce manual work", icon: Zap },
    { text: "Improve response time using automation", icon: Clock },
    { text: "Create scalable and predictable growth", icon: Maximize }
  ];

  return (
    <section className="py-32 px-6 bg-obsidian border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-label">Performance</div>
            <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase mb-8 leading-none">
              Built for Real <br />
              <span className="text-gradient">Business</span> Outcomes
            </h2>
            <p className="text-white/40 text-xl font-bold uppercase tracking-widest mb-12">
              Our systems are designed to deliver measurable impact across every touchpoint.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {outcomes.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 group transition-all hover:bg-white/[0.04]"
                  style={{ borderColor: `${colors[colorIndex].stroke}33` }}
                >
                  <item.icon className="w-8 h-8 mb-6 group-hover:scale-110 transition-transform" style={{ color: colors[colorIndex].stroke }} />
                  <h3 className="text-lg font-display font-black uppercase tracking-tighter leading-tight">{item.text}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Real-time Growth Graph */}
          <div className="relative h-[500px] glass-card !p-8 overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)] transition-all duration-1000" style={{ borderColor: `${colors[colorIndex].stroke}22` }}>
             <div className="absolute top-8 left-8 z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 transition-colors duration-1000" style={{ color: colors[colorIndex].stroke }}>Real-time Performance Metrics</div>
                <div className="text-3xl font-display font-black uppercase text-white tracking-tight">Accelerating GROWTH</div>
             </div>

             <div className="h-full w-full mt-12">
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={graphData}>
                    <defs>
                      <linearGradient id="colorDynamic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors[colorIndex].fill} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={colors[colorIndex].fill} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A0A0A', border: `1px solid ${colors[colorIndex].stroke}33`, borderRadius: '12px' }}
                      itemStyle={{ color: colors[colorIndex].stroke, fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={colors[colorIndex].stroke} 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorDynamic)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>

             <div className="absolute bottom-8 right-8 flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <div className="text-4xl font-display font-black tracking-tighter transition-colors duration-1000" style={{ color: colors[colorIndex].stroke }}>95%</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-white/30 text-right">Optimization Rate</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col items-end">
                  <div className="text-4xl font-display font-black text-white tracking-tighter">4.2X</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-white/30 text-right">Average Growth</div>
                </div>
             </div>

             <div className="absolute inset-0 bg-gradient-to-tr via-transparent to-transparent pointer-events-none transition-all duration-1000" style={{ backgroundImage: `linear-gradient(to top right, ${colors[colorIndex].stroke}05, transparent)` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

