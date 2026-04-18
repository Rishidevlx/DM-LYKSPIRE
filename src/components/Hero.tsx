import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <div className="flex items-center mb-6">
            <span className="px-3 py-1.5 rounded-full bg-cyber-teal/10 border border-cyber-teal/30 text-cyber-teal text-[10px] md:text-xs font-black uppercase tracking-[0.2em] animate-pulse">
              Built for Scale
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-black leading-tight mb-8 tracking-tighter uppercase text-white">
            We Build <span className="text-gradient">AI-Powered</span> Growth Systems That Turn Visitors Into Customers  <span className="italic">Automatically</span>
          </h1>
          
          <p className="text-white/60 text-lg md:text-xl max-w-[600px] mb-10 leading-relaxed">
            LyKSpire helps businesses scale using AI, automation, and conversion systems so you don’t rely on inconsistent marketing anymore.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button 
              onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
              className="btn-primary text-base px-8 py-4 whitespace-nowrap"
            >
               Get My Custom Growth Plan
            </button>
            <button 
              onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
              className="btn-outline text-base px-8 py-4 whitespace-nowrap"
            >
               Book Free Strategy Call
            </button>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 bg-cyber-teal rounded-full" />
              Custom-built
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 bg-cyber-teal rounded-full" />
              No templates
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 bg-cyber-teal rounded-full" />
              No guesswork
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative aspect-square flex items-center justify-center"
        >
          {/* Ultra-Enhanced Animated 'L' Shape Object */}
          <motion.div
            animate={{ 
              y: [0, -40, 0],
              rotateY: [0, 25, -25, 0],
              rotateX: [0, 20, -20, 0]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative w-full max-w-[380px] aspect-square perspective-2000"
          >
            {/* L Shape Construction with Multiple Layers and Effects */}
            <div className="relative w-full h-full">
              {/* Vertical Bar */}
              <div className="absolute left-0 top-0 w-32 h-full">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-[0_0_80px_rgba(74,222,128,0.05)]" />
                <div className="absolute inset-[2px] bg-gradient-to-b from-white/10 via-cyber-teal/5 to-transparent rounded-[22px]" />
                
                {/* Animated Scan Line */}
                <motion.div 
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-cyber-teal/20 to-transparent z-10"
                />
              </div>

              {/* Horizontal Bar */}
              <div className="absolute left-0 bottom-0 w-full h-32">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-[0_0_80px_rgba(74,222,128,0.05)]" />
                <div className="absolute inset-[2px] bg-gradient-to-r from-white/10 via-cyber-teal/5 to-transparent rounded-[22px]" />
                
                {/* Animated Scan Line */}
                <motion.div 
                  animate={{ left: ["0%", "100%", "0%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }}
                  className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-cyber-teal/20 to-transparent z-10"
                />
              </div>
              
              {/* Corner Joint Core */}
              <div className="absolute left-0 bottom-0 w-32 h-32 flex items-center justify-center">
                <div className="w-24 h-24 bg-cyber-teal/40 rounded-3xl blur-[50px] animate-pulse" />
                <div className="relative w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center overflow-hidden">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-cyber-teal/30 rounded-full scale-150"
                  />
                  <div className="w-3 h-3 bg-cyber-teal rounded-full shadow-[0_0_15px_#4ade80]" />
                </div>
              </div>
            </div>

            {/* Floating particles - Enhanced */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyber-teal rounded-full"
                animate={{
                  x: [0, Math.random() * 500 - 250],
                  y: [0, Math.random() * 500 - 250],
                  opacity: [0, 1, 0],
                  scale: [0, 3, 0]
                }}
                transition={{
                  duration: 5 + Math.random() * 7,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
                style={{
                  top: "50%",
                  left: "50%"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
