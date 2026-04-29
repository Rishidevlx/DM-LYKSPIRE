import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, X, Sparkles, Download, CheckCircle2, ChevronRight, ChevronLeft, Mail, Phone, User } from "lucide-react";
import botIcon from "../assest/download.jpeg";

export default function AIChatbotFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [formStep, setFormStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    business_type: "",
    industry: "",
    main_activities: "",
    challenges: "",
    tools: "",
    team_size: "",
    goals: ""
  });

  const [leadDetails, setLeadDetails] = useState({
    email: "",
    phone: ""
  });
  const [showLeadForm, setShowLeadForm] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  // Helper to safely render AI output which might occasionally be a nested object
  const renderText = (text: any) => {
    if (!text) return "";
    if (typeof text === 'string') return text;
    if (typeof text === 'object') {
      return Object.entries(text).map(([k, v]) => `• ${k.toUpperCase()}:\n${typeof v === 'string' ? v : JSON.stringify(v)}`).join('\n\n');
    }
    return String(text);
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (formStep === 1) {
      if (!formData.business_type.trim()) newErrors.business_type = "Required";
    }
    if (formStep === 2) {
      if (!formData.main_activities.trim()) newErrors.main_activities = "Required";
    }
    if (formStep === 3) {
      if (!formData.challenges.trim()) newErrors.challenges = "Required";
    }
    if (formStep === 4) {
      if (!formData.tools.trim()) newErrors.tools = "Required";
      if (!formData.team_size.trim()) newErrors.team_size = "Required";
    }
    if (formStep === 5) {
      if (!formData.goals.trim()) newErrors.goals = "Required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setFormStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setFormStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep()) return;
    
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
      try {
        const parsedPlan = JSON.parse(data.plan);
        setGeneratedPlan(parsedPlan);
      } catch (err) {
        // Fallback if not pure JSON
        setGeneratedPlan({
          businessOverview: data.plan,
          automationPlan: "Failed to parse structured format. All data is in the Business Overview section above.",
          futureGrowth: "Failed to parse structured format. All data is in the Business Overview section above."
        });
      }
      setStep("result");
    } catch (error) {
      console.error(error);
      alert("Failed to connect to ZenThira. Check your network or Vercel logs.");
      setStep("form");
    }
  };

  const handleDownloadPDF = async () => {
    // Basic validation for lead form
    if (!leadDetails.email || !leadDetails.phone) {
      alert("Please fill in your Email and Mobile Number to get the PDF.");
      return;
    }
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadDetails.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planData: generatedPlan, userDetails: leadDetails })
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ZenThira_Growth_Plan.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setShowLeadForm(false);
    } catch (error) {
      console.error(error);
      alert("Failed to download PDF.");
    }
  };

  const resetChat = () => {
    setStep("form");
    setFormStep(1);
    setFormData({
      business_type: "", industry: "", main_activities: "",
      challenges: "", tools: "", team_size: "", goals: ""
    });
    setGeneratedPlan(null);
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
        className="fixed bottom-20 right-4 md:bottom-28 md:right-8 z-[85] w-14 h-14 md:w-16 md:h-16 bg-transparent rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(168,85,247,0.4)] hover:shadow-[0_15px_40px_rgba(168,85,247,0.6)] group overflow-hidden border-2 border-cyber-teal"
      >
        <img src={botIcon} alt="ZenThira" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
        <div className="absolute inset-0 rounded-full border border-cyber-teal animate-ping opacity-30" />
      </motion.button>

      {/* Background Overlay for Center Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[90]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chatbot Window (Centered) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-4 md:inset-0 md:m-auto z-[100] w-auto md:w-[850px] h-auto md:h-[85vh] max-h-[calc(100vh-2rem)] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-[#111] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-cyber-teal/50">
                  <img src={botIcon} alt="ZenThira" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide">ZenThira</h3>
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
            <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar bg-gradient-to-b from-obsidian to-[#0a0a0a]">
              
              {/* Step 1: Form Steps */}
              {step === "form" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 h-full flex flex-col">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-2 font-bold uppercase tracking-widest">
                      <span>Step {formStep}</span>
                      <span>{totalSteps}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-cyber-teal"
                        initial={{ width: 0 }}
                        animate={{ width: `${(formStep / totalSteps) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  <div className="bg-[#111] border border-white/5 rounded-xl p-5 text-sm text-white/80 leading-relaxed">
                    Hello! I'm ZenThira, your AI Consultant. Let's build your custom growth strategy.
                  </div>

                  <div className="flex-1">
                    {formStep === 1 && (
                      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Business Type <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            value={formData.business_type}
                            onChange={(e) => setFormData({...formData, business_type: e.target.value})}
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-teal focus:outline-none transition-colors"
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
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-teal focus:outline-none transition-colors"
                            placeholder="e.g. Healthcare, Finance"
                          />
                        </div>
                      </motion.div>
                    )}

                    {formStep === 2 && (
                      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Main Activities <span className="text-red-500">*</span></label>
                          <textarea 
                            value={formData.main_activities}
                            onChange={(e) => setFormData({...formData, main_activities: e.target.value})}
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-teal focus:outline-none transition-colors resize-none h-32"
                            placeholder="What do you do daily?"
                          />
                          {errors.main_activities && <p className="text-red-500 text-[10px]">{errors.main_activities}</p>}
                        </div>
                      </motion.div>
                    )}

                    {formStep === 3 && (
                      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Biggest Challenges <span className="text-red-500">*</span></label>
                          <textarea 
                            value={formData.challenges}
                            onChange={(e) => setFormData({...formData, challenges: e.target.value})}
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-teal focus:outline-none transition-colors resize-none h-32"
                            placeholder="What's stopping your growth right now?"
                          />
                          {errors.challenges && <p className="text-red-500 text-[10px]">{errors.challenges}</p>}
                        </div>
                      </motion.div>
                    )}

                    {formStep === 4 && (
                      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Current Tools / Software <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            value={formData.tools}
                            onChange={(e) => setFormData({...formData, tools: e.target.value})}
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-teal focus:outline-none transition-colors"
                            placeholder="Tally, Excel, Zoho, etc."
                          />
                          {errors.tools && <p className="text-red-500 text-[10px]">{errors.tools}</p>}
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Team Size <span className="text-red-500">*</span></label>
                          <select 
                            value={formData.team_size}
                            onChange={(e) => setFormData({...formData, team_size: e.target.value})}
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-teal focus:outline-none transition-colors appearance-none"
                          >
                            <option value="">Select Size</option>
                            <option value="1-5">1-5</option>
                            <option value="6-20">6-20</option>
                            <option value="21-50">21-50</option>
                            <option value="50+">50+</option>
                          </select>
                          {errors.team_size && <p className="text-red-500 text-[10px]">{errors.team_size}</p>}
                        </div>
                      </motion.div>
                    )}

                    {formStep === 5 && (
                      <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Your Ultimate Goals <span className="text-red-500">*</span></label>
                          <textarea 
                            value={formData.goals}
                            onChange={(e) => setFormData({...formData, goals: e.target.value})}
                            className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-teal focus:outline-none transition-colors resize-none h-32"
                            placeholder="What do you want to achieve in the next 12 months?"
                          />
                          {errors.goals && <p className="text-red-500 text-[10px]">{errors.goals}</p>}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    {formStep > 1 && (
                      <button 
                        onClick={prevStep}
                        className="w-12 h-12 shrink-0 bg-[#111] border border-white/10 text-white rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                    
                    {formStep < totalSteps ? (
                      <button 
                        onClick={nextStep}
                        className="flex-1 py-3.5 bg-white text-obsidian rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                      >
                        Next Step
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleSubmit()}
                        className="flex-1 py-3.5 bg-cyber-teal text-obsidian rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate AI Strategy
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Loading */}
              {step === "loading" && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-white/10 border-t-cyber-teal animate-spin" />
                    <img src={botIcon} alt="ZenThira" className="w-10 h-10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-2">Analyzing your business...</h4>
                    <p className="text-white/50 text-sm max-w-[280px] mx-auto">
                      ZenThira is crafting a tailored automation and growth plan based on your inputs.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Result (Structured Cards) */}
              {step === "result" && generatedPlan && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 select-none">
                  
                  {/* Card 1: Business Overview */}
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <User className="w-4 h-4 text-blue-400" />
                      </div>
                      <h3 className="text-white font-bold text-lg">Business Overview</h3>
                    </div>
                    <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                      {renderText(generatedPlan.businessOverview) || "Overview not available."}
                    </div>
                  </div>

                  {/* Card 2: AI Solutions & Automation */}
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-cyber-teal/20 flex items-center justify-center border border-cyber-teal/30">
                        <Sparkles className="w-4 h-4 text-cyber-teal" />
                      </div>
                      <h3 className="text-white font-bold text-lg">AI Solutions & Automation Plan</h3>
                    </div>
                    <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap select-none">
                      {renderText(generatedPlan.automationPlan) || "Automation plan not available."}
                    </div>
                  </div>

                  {/* Card 3: Future Growth */}
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                        <ChevronRight className="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 className="text-white font-bold text-lg">Future Growth & Enhancements</h3>
                    </div>
                    <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap select-none">
                      {renderText(generatedPlan.futureGrowth) || "Future growth details not available."}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Fixed Footer Buttons for Result Step */}
            {step === "result" && generatedPlan && (
              <div className="p-4 md:p-6 border-t border-white/10 bg-[#0a0a0a] flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <button 
                    onClick={() => setShowLeadForm(true)}
                    className="flex-1 py-4 bg-white text-obsidian rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                  >
                    <Download className="w-4 h-4" />
                    Download Detailed PDF
                  </button>
                  
                  <button 
                    onClick={resetChat}
                    className="flex-1 py-4 bg-transparent border border-white/10 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                  >
                    Start New Analysis
                  </button>
                </div>
                
                {/* Contact Us Prompt */}
                <div className="mt-2 pt-4 border-t border-white/5 flex flex-col items-center justify-center space-y-3">
                  <p className="text-white/60 text-xs text-center">
                    Need help implementing this plan? <span className="text-white font-bold">Contact our experts:</span>
                  </p>
                  <div className="flex gap-4">
                    <a href="mailto:info@tieraprom.co.in" className="flex items-center gap-2 text-cyber-teal hover:text-white transition-colors text-sm font-bold bg-[#111] px-4 py-2 rounded-full border border-white/5">
                      <Mail className="w-4 h-4" /> info@tieraprom.co.in
                    </a>
                    <a href="tel:+919876543210" className="flex items-center gap-2 text-cyber-teal hover:text-white transition-colors text-sm font-bold bg-[#111] px-4 py-2 rounded-full border border-white/5">
                      <Phone className="w-4 h-4" /> Book a Call
                    </a>
                  </div>
                </div>
              </div>
            )}
            
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Generation Popup */}
      <AnimatePresence>
        {showLeadForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setShowLeadForm(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-[#111] rounded-full flex items-center justify-center text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-cyber-teal/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-5 h-5 text-cyber-teal" />
                </div>
                <h3 className="text-white font-bold text-xl mb-1">Get Your Free Strategy</h3>
                <p className="text-white/50 text-sm">Enter your details to instantly download the PDF plan.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs text-white/60 font-bold uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="email" 
                      value={leadDetails.email}
                      onChange={(e) => setLeadDetails({...leadDetails, email: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm focus:border-cyber-teal focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-white/60 font-bold uppercase tracking-wider">Mobile Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="tel" 
                      value={leadDetails.phone}
                      onChange={(e) => setLeadDetails({...leadDetails, phone: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm focus:border-cyber-teal focus:outline-none transition-colors"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleDownloadPDF}
                  className="w-full py-4 mt-4 bg-cyber-teal text-obsidian rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(20,241,149,0.3)] flex justify-center items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PDF Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
