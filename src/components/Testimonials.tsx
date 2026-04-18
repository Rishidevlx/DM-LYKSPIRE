import { motion } from "motion/react";

const testimonials = [
  {
    quote: "Lykspire completely elevated how our brand appears online. From strategy to visual storytelling and content, everything now feels far more premium and intentional.",
    author: "Brand Director",
    company: "Premium Retail Brand – Washington DC"
  },
  {
    quote: "The level of automation and intelligence they brought into our funnel is unmatched. We now save over 120 hours per month while scaling faster than ever.",
    author: "Priya Nair",
    company: "Head of Digital, GrowthNest Solutions"
  },
  {
    quote: "The automation systems they implemented streamlined our entire marketing workflow. We’ve reduced manual effort by 70+ hours monthly and saw a 38% increase in qualified leads.",
    author: "A. Sharma",
    company: "Marketing Head, Zyphra Digital"
  },
  {
    quote: "The AI-driven systems they built for us saved over 100 hours of manual work per month while increasing our conversion rates by 45%.",
    author: "Marketing Lead",
    company: "Leadsense"
  }
];

export default function Testimonials() {
  return (
    <section className="py-32 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="section-label">Testimonials</div>
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase">
            What people say <br /> about our work
          </h2>
        </div>

        <div className="flex flex-col gap-16 md:gap-32 relative mt-20">
          {/* Decorative background element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-teal/20 to-transparent rotate-12 pointer-events-none" />
          
          {testimonials.map((t, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className={`relative w-full max-w-4xl glass-card p-10 md:p-16 lg:p-20 overflow-hidden ${isEven ? 'self-start' : 'self-end'}`}
              >
                {/* Large Background Quote Symbol */}
                <div className={`absolute -top-10 ${isEven ? '-right-10' : '-left-10'} text-[250px] font-display font-black leading-none text-white/[0.03] select-none pointer-events-none rotate-12`}>
                  "
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                  <p className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight leading-[1.2] italic">
                    “{t.quote}”
                  </p>
                  
                  <div className="flex items-center gap-6 pt-10 border-t border-white/10">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl text-cyber-teal flex-shrink-0 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-cyber-teal/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative z-10">{t.author[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg uppercase tracking-wider text-white">{t.author}</h4>
                      <p className="text-cyber-teal text-sm uppercase tracking-widest mt-1 font-bold">{t.company}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
