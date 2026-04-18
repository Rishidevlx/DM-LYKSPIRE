import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Sparkles, Megaphone, BarChart3, Search, Video } from "lucide-react";

const services = [
  {
    title: "Brand Strategy & Positioning",
    icon: Sparkles,
    items: [
      { name: "Brand Identity", desc: "Visual and verbal identity that makes your brand instantly recognizable." },
      { name: "Market Positioning", desc: "Clear positioning that differentiates your brand from competitors." },
      { name: "Messaging Framework", desc: "Consistent messaging that communicates your brand value effectively." }
    ]
  },
  {
    title: "Social Media Growth",
    icon: Megaphone,
    items: [
      { name: "Content Strategy", desc: "Planning content that attracts the right audience." },
      { name: "Platform Growth", desc: "Building visibility on Instagram, LinkedIn, and other platforms." },
      { name: "Audience Engagement", desc: "Creating content that sparks interaction and community." }
    ]
  },
  {
    title: "Content & Creative Production",
    icon: Video,
    items: [
      { name: "Video Content", desc: "Producing engaging short form and brand videos." },
      { name: "Creative Design", desc: "Designing visuals that make your brand stand out." },
      { name: "Campaign Concepts", desc: "Building creative ideas that drive engagement." }
    ]
  },
  {
    title: "SEO & Digital Visibility",
    icon: Search,
    items: [
      { name: "SEO Strategy", desc: "Optimizing your website for higher rankings." },
      { name: "Content SEO", desc: "Creating content that drives organic traffic." },
      { name: "Website Optimization", desc: "Improving site performance and discoverability." }
    ]
  },
  {
    title: "Performance Marketing",
    icon: BarChart3,
    items: [
      { name: "Paid Advertising", desc: "Running targeted ad campaigns across digital platforms." },
      { name: "Funnel Optimization", desc: "Improving customer journeys to increase conversions." },
      { name: "Campaign Analytics", desc: "Tracking and analyzing performance for continuous growth." }
    ]
  }
];

export default function Services() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  return (
    <section id="services" className="bg-obsidian">
      {/* Desktop Horizontal Scroll */}
      <div ref={targetRef} className="hidden md:block relative h-[500vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden pt-32 pb-10">
          <div className="max-w-7xl mx-auto px-6 w-full mb-12">
            <div className="section-label mt-8 md:mt-16">Our Services</div>
            <h2 className="text-5xl md:text-6xl font-display font-black tracking-tighter uppercase">
              Growth <span className="text-gradient">Solutions</span>
            </h2>
          </div>

          <motion.div style={{ x }} className="flex gap-8 px-[10%] items-stretch">
            {services.map((service, i) => (
              <div key={i}>
                <ServiceCard service={service} index={i} />
              </div>
            ))}
            
            {/* CTA CARD */}
            <div className="flex-shrink-0 w-[450px] glass-card p-10 flex flex-col justify-center items-center text-center border-cyber-teal/30 bg-cyber-teal/5 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-cyber-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <Sparkles className="w-16 h-16 text-cyber-teal mb-8 animate-pulse" />
               <h3 className="text-4xl font-display font-black uppercase tracking-tighter mb-4">
                 Get My Custom <br/> <span className="text-gradient">Growth Plan</span>
               </h3>
               <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-[280px]">
                 Receive a personalized system blueprint tailored to your business.
               </p>
               <button 
                 onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
                 className="btn-primary"
               >
                 Book My Call
               </button>
            </div>
          </motion.div>

          {/* Scroll Progress Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              style={{ scaleX: scrollYProgress }} 
              className="h-full bg-cyber-teal origin-left"
            />
          </div>
        </div>
      </div>

      {/* Mobile Vertical Layout */}
      <div className="md:hidden py-24 px-6 space-y-16">
        <div className="mb-12">
          <div className="section-label mt-8">Our Services</div>
          <h2 className="text-4xl font-display font-black tracking-tighter uppercase">
            Growth <br /> <span className="text-gradient">Solutions</span>
          </h2>
        </div>
        
        <div className="space-y-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ServiceCard service={service} index={i} isMobile />
            </motion.div>
          ))}
          
          {/* CTA CARD MOBILE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full glass-card p-10 flex flex-col justify-center items-center text-center border-cyber-teal/30 bg-cyber-teal/5"
          >
             <Sparkles className="w-12 h-12 text-cyber-teal mb-6" />
             <h3 className="text-3xl font-display font-black uppercase tracking-tighter mb-4">
               Get My Custom <br/> <span className="text-gradient">Growth Plan</span>
             </h3>
             <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-[280px]">
               Receive a personalized system blueprint tailored to your business.
             </p>
             <button 
               onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
               className="btn-primary w-full"
             >
               Book My Call
             </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: typeof services[number];
  index: number;
  isMobile?: boolean;
}

function ServiceCard({ service, index, isMobile = false }: ServiceCardProps) {
  return (
    <div
      className={`flex-shrink-0 ${isMobile ? "w-full" : "w-[450px]"} glass-card p-10 flex flex-col h-full min-h-[600px] group`}
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 border border-white/10 group-hover:scale-110 transition-transform">
        <service.icon className="w-8 h-8 text-cyber-teal" />
      </div>
      
      <h3 className="text-3xl font-black font-display uppercase tracking-tighter mb-8 leading-none">
        {service.title}
      </h3>

      <div className="space-y-8 flex-1">
        {service.items.map((item, j) => (
          <div key={j} className="group/item">
            <h4 className="text-cyber-teal text-xs font-black uppercase tracking-widest mb-2 group-hover/item:translate-x-1 transition-transform">
              {item.name}
            </h4>
            <p className="text-white/40 text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center">
        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">0{index + 1}</span>
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-cyber-teal hover:border-cyber-teal transition-colors cursor-pointer">
          →
        </div>
      </div>
    </div>
  );
}
