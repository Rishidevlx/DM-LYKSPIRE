import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, Minus, MessageSquare, HelpCircle, Sparkles, ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "Do you offer packages?",
    a: "No — every system is custom-built based on your specific business goals, market position, and current challenges. We engineer unique architectures for each client."
  },
  {
    q: "How soon can I see results?",
    a: "Initial setup happens within weeks. While some efficiency gains are immediate, most clients see a significant impact on growth and conversion within the first 60-90 days."
  },
  {
    q: "Who is this for?",
    a: "Startups, founders, and established businesses looking to eliminate manual marketing hurdles and scale using high-velocity AI and automation systems."
  },
  {
    q: "What makes you different?",
    a: "We don’t just provide services. We build autonomous infrastructure. Once our system is in place, it works 24/7, reducing your dependency on manual agency intervention."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-48 px-6 bg-obsidian relative overflow-hidden overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-20 items-start">
          
          {/* Left Column: Heading & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 lg:sticky lg:top-32 z-10 mb-12 lg:mb-0"
          >
            <div className="section-label">Support & Clarity</div>
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase mb-8 leading-tight">
              Got <br /> <span className="text-gradient">Questions?</span>
            </h2>
            <p className="text-white/40 text-lg mb-12 max-w-sm uppercase tracking-widest font-bold leading-relaxed">
              Find answers to common inquiries about our growth systems and architecture.
            </p>

            <div className="glass-card p-8 border-cyber-teal/10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-cyber-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <MessageSquare className="w-10 h-10 text-cyber-teal mb-6" />
               <h4 className="text-xl font-display font-black uppercase tracking-tight mb-2">Still need help?</h4>
               <p className="text-white/40 text-sm mb-8 leading-relaxed">Our team is ready to architect your custom growth strategy.</p>
               <button 
                onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
                className="flex items-center gap-2 text-cyber-teal font-black uppercase tracking-[0.2em] text-[10px] hover:gap-4 transition-all"
               >
                 Consult with an architect <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </motion.div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group glass-card !p-0 overflow-hidden border-white/5 hover:border-white/20 transition-all duration-500 ${openIndex === i ? 'border-cyber-teal/30 bg-white/[0.04]' : ''}`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                >
                  <div className="flex items-center gap-4 md:gap-6">
                     <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border transition-colors ${openIndex === i ? 'bg-cyber-teal/10 border-cyber-teal/30 text-cyber-teal' : 'bg-white/5 border-white/10 text-white/30'}`}>
                        {openIndex === i ? <Sparkles className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
                     </div>
                     <span className={`text-base md:text-xl font-display font-black uppercase tracking-tight transition-colors ${openIndex === i ? 'text-white' : 'text-white/60'}`}>
                       {faq.q}
                     </span>
                  </div>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${openIndex === i ? 'bg-cyber-teal border-cyber-teal text-obsidian rotate-180' : 'bg-white/5 border-white/10 text-white/20'}`}>
                    <Plus className={`w-4 h-4 transition-transform ${openIndex === i ? 'rotate-45' : ''}`} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-6 md:px-8 pb-8 pl-6 md:pl-24 text-white/50 text-sm md:text-base leading-relaxed uppercase tracking-[0.05em] font-medium">
                        <div className="w-full h-px bg-white/5 mb-8" />
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

