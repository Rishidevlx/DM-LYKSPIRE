import { useRef } from "react";
import Lottie from "lottie-react";
import globeAnimation from "../assest/Globe.json";
import { motion, useInView } from "motion/react";
import { Globe } from "lucide-react";

export default function GlobalPresence() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Glow - Make it relative to the full section so it extends properly */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-teal/5 blur-[150px] rounded-full -z-10" />

      <div className="px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:flex-1 flex flex-col gap-8"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-cyber-teal" />
            <span className="text-cyber-teal font-black uppercase tracking-[0.3em] text-xs">
              Global Operations
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter uppercase leading-[1] text-white">
            We are a <br />
            <span className="text-[#a855f7] drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">remote-first</span> <br /> 
            growth team
          </h2>
          
          <div className="h-px w-24 bg-white/10" />
          
          <p className="text-white/40 text-lg md:text-xl font-bold uppercase tracking-widest leading-relaxed">
            Working with clients globally. <br />
            <span className="text-white">Work with us from anywhere in the world.</span>
          </p>


        </motion.div>

        {/* Right Globe */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
          animate={isInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="w-full lg:flex-1 flex justify-center items-center"
        >
          <div className="relative w-full max-w-[550px] aspect-square">
            {/* Globe Glow Backing */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#a855f7]/20 to-cyber-teal/20 blur-[80px] rounded-full mix-blend-screen pointer-events-none" />
            
            {/* Lottie Globe Animation */}
            <Lottie animationData={globeAnimation} loop={true} className="w-full h-full relative z-10 [&>svg]:!overflow-visible" />
          </div>
        </motion.div>

        </div>
      </div>
    </section>
  );
}
