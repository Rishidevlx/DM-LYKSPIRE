import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Bot, Cpu, Workflow, Code2, PackageOpen, Globe2, Smartphone, Cloud, BarChart3, Link2, ShieldCheck, RefreshCw, Sparkles } from "lucide-react";

const services = [
  {
    title: "AI Engineering",
    icon: Bot,
    subtitle: "Build AI that creates measurable business value.",
    items: [
      { name: "Generative AI & Agentic AI", desc: "Autonomous AI systems and generative applications that drive real business outcomes." },
      { name: "LLM Integration & RAG", desc: "Connect LLMs with your data via retrieval-augmented generation and prompt engineering." },
      { name: "AI Copilots & Assistants", desc: "Enterprise AI assistants and copilots for operations, sales, and support teams." }
    ]
  },
  {
    title: "Agentic AI",
    icon: Cpu,
    subtitle: "Autonomous AI that works like a digital workforce.",
    items: [
      { name: "Multi-Agent Systems", desc: "AI employees that autonomously handle customer support, sales, HR, and finance tasks." },
      { name: "Decision Intelligence", desc: "AI orchestration and human-in-the-loop automation for complex decisions." },
      { name: "AI Operations Agents", desc: "Research agents, procurement agents, and AI-driven operations at scale." }
    ]
  },
  {
    title: "Intelligent Automation",
    icon: Workflow,
    subtitle: "Eliminate repetitive work through intelligent workflows.",
    items: [
      { name: "Business Process Automation", desc: "Automate workflows across CRM, ERP, HR, and finance with no-code and low-code tools." },
      { name: "Document & OCR Processing", desc: "AI extraction, document intelligence, and automated data processing pipelines." },
      { name: "Email & Finance Automation", desc: "End-to-end automation for email workflows, billing, approvals, and reporting." }
    ]
  },
  {
    title: "Custom Software Engineering",
    icon: Code2,
    subtitle: "Build software tailored to your business.",
    items: [
      { name: "Enterprise & SaaS Platforms", desc: "CRM, ERP, internal tools, and SaaS products engineered to your exact requirements." },
      { name: "Customer & Vendor Portals", desc: "Feature-rich portals for customers, vendors, and partners with real-time data." },
      { name: "FinTech & HealthTech Solutions", desc: "Specialized platforms for banking, finance, healthcare, and manufacturing industries." }
    ]
  },
  {
    title: "Product Engineering",
    icon: PackageOpen,
    subtitle: "Turn your product idea into a scalable digital business.",
    items: [
      { name: "Product Discovery & UX", desc: "Product discovery, UI/UX design, and MVP development to validate ideas fast." },
      { name: "SaaS Engineering & APIs", desc: "Scalable SaaS architecture, API development, and product modernization." },
      { name: "Product Scaling", desc: "Grow your product from MVP to enterprise-grade with robust infrastructure." }
    ]
  },
  {
    title: "Web Development",
    icon: Globe2,
    subtitle: "Modern websites and platforms engineered for performance.",
    items: [
      { name: "Corporate & Enterprise Portals", desc: "High-performance corporate websites, enterprise portals, and progressive web apps." },
      { name: "CMS & Headless CMS", desc: "Content management systems and headless CMS for scalable content delivery." },
      { name: "eCommerce Solutions", desc: "Full-featured eCommerce platforms built for conversion and scale." }
    ]
  },
  {
    title: "Mobile App Development",
    icon: Smartphone,
    subtitle: "Native and cross-platform applications.",
    items: [
      { name: "iOS & Android", desc: "Native iOS and Android apps with premium UX and performance." },
      { name: "Flutter & React Native", desc: "Cross-platform apps for enterprise, customer-facing, and field service use cases." },
      { name: "Enterprise Mobile Apps", desc: "Secure enterprise mobility solutions connected to your backend systems." }
    ]
  },
  {
    title: "Cloud Engineering",
    icon: Cloud,
    subtitle: "Secure, scalable cloud infrastructure.",
    items: [
      { name: "AWS, Azure & GCP", desc: "Multi-cloud engineering, Kubernetes, Docker, and serverless architecture." },
      { name: "DevOps & CI/CD", desc: "Infrastructure as code, automated pipelines, and DevOps best practices." },
      { name: "Cloud Migration & Recovery", desc: "Cloud migration, performance monitoring, and disaster recovery planning." }
    ]
  },
  {
    title: "Data Engineering & Analytics",
    icon: BarChart3,
    subtitle: "Transform data into business intelligence.",
    items: [
      { name: "Data Warehousing & ETL", desc: "Data lakes, ETL pipelines, and real-time data processing architectures." },
      { name: "Business Intelligence", desc: "Dashboards, predictive analytics, and data governance for smarter decisions." },
      { name: "Data Governance", desc: "Ensure data quality, compliance, and security across your entire data estate." }
    ]
  },
  {
    title: "Enterprise Integration",
    icon: Link2,
    subtitle: "Connect every system in your organization.",
    items: [
      { name: "ERP, CRM & HRMS Integration", desc: "Seamlessly connect ERP, CRM, finance, and HR systems into a unified platform." },
      { name: "REST & GraphQL APIs", desc: "API design, middleware, and event-driven architecture for enterprise connectivity." },
      { name: "Third-Party Integrations", desc: "Integrate with any third-party system or SaaS tool your business relies on." }
    ]
  },
  {
    title: "Cybersecurity",
    icon: ShieldCheck,
    subtitle: "Secure every layer of your digital ecosystem.",
    items: [
      { name: "Application & Cloud Security", desc: "Security assessment, application security, and cloud security hardening." },
      { name: "Identity & Zero Trust", desc: "Identity and access management, zero trust architecture, and compliance." },
      { name: "Security Monitoring", desc: "Continuous monitoring, vulnerability assessment, and security operations." }
    ]
  },
  {
    title: "Technology Advisory",
    icon: RefreshCw,
    subtitle: "Executive technology leadership without a full-time CTO.",
    items: [
      { name: "Fractional CTO & Architecture", desc: "Fractional CTO services, enterprise architecture, and technology strategy." },
      { name: "Digital Transformation", desc: "AI adoption strategy, cloud transformation, and digital innovation programs." },
      { name: "IT Strategy & Governance", desc: "Technology roadmaps, vendor selection, solution architecture, and governance." }
    ]
  }
];

export default function Services() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Framer Motion requires string templates to match exactly for smooth interpolation
  const x = useTransform(scrollYProgress, [0, 1], ["calc(0% + 0vw)", "calc(-100% + 100vw)"]);

  return (
    <section id="services" className="bg-obsidian">
      {/* Desktop Horizontal Scroll */}
      <div ref={targetRef} className="hidden md:block relative h-[1200vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden pt-32 pb-10">
          <div className="max-w-7xl mx-auto px-6 w-full mb-12">
            <div className="section-label mt-8 md:mt-16">Our Services</div>
            <h2 className="text-5xl md:text-6xl font-display font-black tracking-tighter uppercase">
              Intelligent <span className="text-gradient">Engineering</span> Solutions
            </h2>
          </div>

          <motion.div style={{ x }} className="flex gap-8 px-[10vw] items-stretch w-max">
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
                 Ready to Build an <br/> <span className="text-gradient">Intelligent Business?</span>
               </h3>
               <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-[280px]">
                 Book a discovery call and let's engineer the future together.
               </p>
               <button 
                 onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
                 className="btn-primary"
               >
                 Book a Discovery Call
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
            Intelligent <br /> <span className="text-gradient">Engineering</span> Solutions
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
               Ready to Build an <br/> <span className="text-gradient">Intelligent Business?</span>
             </h3>
             <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-[280px]">
               Book a discovery call and let's engineer the future together.
             </p>
             <button 
               onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
               className="btn-primary w-full"
             >
               Book a Discovery Call
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
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
        <service.icon className="w-8 h-8 text-cyber-teal" />
      </div>
      
      <h3 className="text-3xl font-black font-display uppercase tracking-tighter mb-2 leading-none">
        {service.title}
      </h3>
      <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-8">{service.subtitle}</p>

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
