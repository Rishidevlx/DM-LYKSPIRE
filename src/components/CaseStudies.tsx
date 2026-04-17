import { motion } from "motion/react";
import { Coffee, ShoppingBag, Target, BarChart, FileText } from "lucide-react";

const cases = [
  {
    title: "Urban Brew — Building a Strong Digital Brand for a Growing Coffee Startup",
    categories: ["Brand Strategy", "Social Media Marketing", "Content & Digital Growth"],
    metrics: [
      { label: "Response time", value: "−64%" },
      { label: "Backlog", value: "−40%" },
      { label: "Uptime", value: "24/7" }
    ],
    icon: Coffee,
    color: "bg-blue-600/20",
    iconColor: "text-blue-400"
  },
  {
    title: "Premium Retail Brand – Washington DC — Strategic branding, visual storytelling, and digital positioning for a curated retail experience.",
    categories: ["Brand Strategy", "Social Media Marketing", "Content & Digital Growth"],
    metrics: [
      { label: "Increase in social reach", value: "+240%" },
      { label: "Customer engagement", value: "+65%" },
      { label: "Online visibility", value: "3x" }
    ],
    icon: ShoppingBag,
    color: "bg-red-900/40",
    iconColor: "text-red-400"
  },
  {
    title: "Leadsense — Automated Lead Qualification & Routing Engine",
    categories: ["AI Lead Scoring", "Workflow Automation"],
    metrics: [
      { label: "CR Increase", value: "+45%" },
      { label: "Response time", value: "−99%" },
      { label: "Time saved", value: "100h/mo" }
    ],
    icon: Target,
    color: "bg-teal-900/40",
    iconColor: "text-teal-400"
  },
  {
    title: "Insight Loop — Unified AI Marketing Analytics Pipeline",
    categories: ["Data Aggregation", "AI Reporting", "Pipeline Automation"],
    metrics: [
      { label: "Faster reports", value: "90%" },
      { label: "ROAS", value: "+22%" },
      { label: "Accuracy", value: "3x" }
    ],
    icon: BarChart,
    color: "bg-orange-900/40",
    iconColor: "text-orange-400"
  },
  {
    title: "Financemind — Automated Invoice & Reporting Workflow",
    categories: ["AI Document Processing", "Finance Automation", "Systems Integration"],
    metrics: [
      { label: "Entry Errors", value: "−100%" },
      { label: "Faster closing", value: "6x" },
      { label: "Costs saved", value: "$35K/y" }
    ],
    icon: FileText,
    color: "bg-olive-900/40",
    iconColor: "text-olive-400"
  }
];

export default function CaseStudies() {
  return (
    <section id="case-studies" className="relative py-32 bg-obsidian">
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="section-label">Case Studies</div>
        <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase">
          Proven <span className="text-gradient">Impact</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-[10vh]">
        {cases.map((item, i) => (
          <div 
            key={i} 
            className="sticky top-32"
            style={{ marginTop: i === 0 ? 0 : "20vh" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card overflow-hidden grid lg:grid-cols-2 lg:min-h-[550px] lg:h-auto border-white/10 shadow-xl"
            >
              {/* Left Side - Icon/Abstract */}
              <div className={`relative flex items-center justify-center min-h-[300px] lg:min-h-auto py-12 lg:py-0 ${item.color}`}>
                <div className="relative z-10 w-48 h-48 rounded-[40px] bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-500">
                  <item.icon className={`w-24 h-24 ${item.iconColor}`} />
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="p-12 flex flex-col justify-center bg-white/[0.02]">
                <div className="flex flex-wrap gap-2 mb-8">
                  {item.categories.map((cat, j) => (
                    <span key={j} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                      {cat}
                    </span>
                  ))}
                </div>

                <h3 className="text-3xl md:text-4xl font-black font-display uppercase tracking-tighter mb-10 leading-tight">
                  {item.title}
                </h3>

                <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/10">
                  {item.metrics.map((metric, j) => (
                    <div key={j}>
                      <div className={`text-3xl font-black font-display mb-1 ${item.iconColor}`}>
                        {metric.value}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
