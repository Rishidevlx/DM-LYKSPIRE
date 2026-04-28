import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, X, Sparkles, FileText, Download, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";

export default function AIChatbotFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [formData, setFormData] = useState({
    business_type: "",
    industry: "",
    main_activities: "",
    challenges: "",
    tools: "",
    team_size: "",
    goals: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedPlan, setGeneratedPlan] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.business_type.trim()) newErrors.business_type = "Required";
    if (!formData.main_activities.trim()) newErrors.main_activities = "Required";
    if (!formData.challenges.trim()) newErrors.challenges = "Required";
    if (!formData.tools.trim()) newErrors.tools = "Required";
    if (!formData.team_size.trim()) newErrors.team_size = "Required";
    if (!formData.goals.trim()) newErrors.goals = "Required";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length === 0) {
      setStep("loading");
      setErrors({});
      
      try {
        const response = await fetch('/api/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Failed to fetch plan');
        }

        const data = await response.json();
        setGeneratedPlan(data.plan);
        setStep("result");
      } catch (error) {
        console.error(error);
        alert("Failed to connect to the AI Consultant. Check if API key is set.");
        setStep("form");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planText: generatedPlan })
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Convert response to a Blob (file) and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AI_Automation_Plan.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
      alert("Failed to download PDF.");
    }
  };

  const resetChat = () => {
    setStep("form");
    setFormData({
      business_type: "",
      industry: "",
      main_activities: "",
      challenges: "",
      tools: "",
      team_size: "",
      goals: ""
    });
    setGeneratedPlan("");
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: isOpen ? 0 : 1 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
        className="fixed bottom-20 right-4 md:bottom-28 md:right-8 z-[85] w-12 h-12 md:w-14 md:h-14 bg-cyber-teal rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(168,85,247,0.4)] hover:shadow-[0_15px_40px_rgba(168,85,247,0.6)] group"
      >
        <Bot className="w-6 h-6 md:w-7 md:h-7 text-obsidian transition-transform group-hover:scale-110" />
        
        {/* Tooltip */}
        <div className="hidden md:block absolute right-full mr-4 bg-[#111] border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
          AI Business Consultant
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#111] border-t border-r border-white/10 rotate-45" />
        </div>

        {/* Pulsing Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-cyber-teal animate-ping opacity-50" />
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] w-[calc(100vw-2rem)] md:w-[450px] h-[600px] max-h-[calc(100vh-2rem)] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-[#111] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyber-teal/20 rounded-full flex items-center justify-center border border-cyber-teal/30">
                  <Bot className="w-5 h-5 text-cyber-teal" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide">Lykspire AI Consultant</h3>
                  <p className="text-cyber-teal text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-cyber-teal rounded-full animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-gradient-to-b from-obsidian to-[#0a0a0a]">
              
              {/* Step 1: Form */}
              {step === "form" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="bg-[#111] border border-white/5 rounded-xl p-4 text-sm text-white/80 leading-relaxed">
                    Hello! I'm your AI Consultant. Tell me about your business, and I'll generate a custom automation & growth strategy for you.
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Business Type <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.business_type}
                        onChange={(e) => setFormData({...formData, business_type: e.target.value})}
                        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-cyber-teal focus:outline-none transition-colors"
                        placeholder="e.g. Retail, Agency, SaaS"
                      />
                      {errors.business_type && <p className="text-red-500 text-[10px]">{errors.business_type}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Industry (Optional)</label>
                      <input 
                        type="text" 
                        value={formData.industry}
                        onChange={(e) => setFormData({...formData, industry: e.target.value})}
                        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-cyber-teal focus:outline-none transition-colors"
                        placeholder="e.g. Healthcare, Finance"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Main Activities <span className="text-red-500">*</span></label>
                      <textarea 
                        value={formData.main_activities}
                        onChange={(e) => setFormData({...formData, main_activities: e.target.value})}
                        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-cyber-teal focus:outline-none transition-colors resize-none h-20"
                        placeholder="What do you do daily?"
                      />
                      {errors.main_activities && <p className="text-red-500 text-[10px]">{errors.main_activities}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Biggest Challenges <span className="text-red-500">*</span></label>
                      <textarea 
                        value={formData.challenges}
                        onChange={(e) => setFormData({...formData, challenges: e.target.value})}
                        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-cyber-teal focus:outline-none transition-colors resize-none h-20"
                        placeholder="What's stopping your growth?"
                      />
                      {errors.challenges && <p className="text-red-500 text-[10px]">{errors.challenges}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Current Tools <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          value={formData.tools}
                          onChange={(e) => setFormData({...formData, tools: e.target.value})}
                          className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-cyber-teal focus:outline-none transition-colors"
                          placeholder="Tally, Excel, etc."
                        />
                        {errors.tools && <p className="text-red-500 text-[10px]">{errors.tools}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Team Size <span className="text-red-500">*</span></label>
                        <select 
                          value={formData.team_size}
                          onChange={(e) => setFormData({...formData, team_size: e.target.value})}
                          className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-cyber-teal focus:outline-none transition-colors appearance-none"
                        >
                          <option value="">Select</option>
                          <option value="1-5">1-5</option>
                          <option value="6-20">6-20</option>
                          <option value="21-50">21-50</option>
                          <option value="50+">50+</option>
                        </select>
                        {errors.team_size && <p className="text-red-500 text-[10px]">{errors.team_size}</p>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Your Goals <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.goals}
                        onChange={(e) => setFormData({...formData, goals: e.target.value})}
                        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-cyber-teal focus:outline-none transition-colors"
                        placeholder="What do you want to achieve?"
                      />
                      {errors.goals && <p className="text-red-500 text-[10px]">{errors.goals}</p>}
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        className="w-full py-3.5 bg-cyber-teal text-obsidian rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate AI Strategy
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Loading */}
              {step === "loading" && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="h-full flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-cyber-teal animate-spin" />
                    <Bot className="w-6 h-6 text-cyber-teal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2">Analyzing your business...</h4>
                    <p className="text-white/50 text-sm max-w-[250px] mx-auto">
                      Our AI is crafting a tailored automation and growth plan based on your inputs.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Result */}
              {step === "result" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="bg-cyber-teal/10 border border-cyber-teal/20 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyber-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">Analysis Complete</h4>
                      <p className="text-white/70 text-xs">Here is your customized AI growth strategy.</p>
                    </div>
                  </div>

                  <div className="bg-[#111] border border-white/10 rounded-xl p-5 text-sm text-white/80 whitespace-pre-wrap leading-relaxed select-none pointer-events-none">
                    <div className="pointer-events-auto">
                      {generatedPlan}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button 
                      onClick={handleDownloadPDF}
                      className="w-full py-3.5 bg-white text-obsidian rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download as PDF
                    </button>
                    
                    <button 
                      onClick={resetChat}
                      className="w-full py-3.5 bg-transparent border border-white/10 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                    >
                      Start New Analysis
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-3 border-t border-white/10 bg-[#111] text-center">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Powered by Gemini AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
