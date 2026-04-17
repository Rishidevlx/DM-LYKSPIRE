import { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "motion/react";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString() + suffix);
  const [displayText, setDisplayText] = useState("0" + suffix);

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  useEffect(() => {
    return display.on("change", (latest) => setDisplayText(latest));
  }, [display]);

  return <span ref={ref}>{displayText}</span>;
}

export default function Stats() {
  const stats = [
    { label: "Trusted by users", value: 100, suffix: "+" },
    { label: "Generated leads", value: 1000, suffix: "+" },
    { label: "Success rate", value: 95, suffix: "%" }
  ];

  return (
    <section className="py-20 px-6 border-y border-white/5 bg-obsidian relative overflow-hidden">
      <div className="absolute inset-0 bg-cyber-teal/5 blur-[120px] -z-10 opacity-30" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center group hover:bg-white/[0.04] transition-colors"
            >
              <div className="text-5xl md:text-6xl font-display font-black tracking-tighter text-white mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/40 font-display font-bold uppercase tracking-widest text-[10px] md:text-xs">
                {stat.label}
              </div>
              
              {/* Decorative Accent */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-cyber-teal opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
