import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, X, Sparkles, Download, ChevronRight, ChevronLeft, Mail, Phone, User, AlertCircle, TrendingUp, Check } from "lucide-react";

import botIcon from "../assest/download.jpeg";

export default function AIChatbotFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [formStep, setFormStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    business_type: "",
    industry: "",
    years_in_business: "",
    language: "English",
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
  const [toastMessage, setToastMessage] = useState("");
  const [planCount, setPlanCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zenthira_plan_count');
      return saved ? parseInt(saved) : 4000;
    }
    return 4000;
  });

  useEffect(() => {
    // Fetch initial global count
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.plan_count) setPlanCount(data.plan_count);
      })
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  useEffect(() => {
    if (step === "result") {
      setPlanCount(prev => prev + 200);
    }
  }, [step]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [tempPlan, setTempPlan] = useState<any>(null);

  // Loading Stages Logic
  const [loadingStage, setLoadingStage] = useState(0);
  const loadingStages = [
    "Analyzing Business Data",
    "Identifying Growth Opportunities",
    "Finalizing Your Strategy"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "loading") {
      setLoadingStage(0);
      interval = setInterval(() => {
        setLoadingStage((prev) => {
          if (prev < loadingStages.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 2000); // 2s per stage = 10s total analysis
    }
    return () => clearInterval(interval);
  }, [step]);

  // Handle automatic transition from loading to result
  useEffect(() => {
    if (step === "loading" && loadingStage === loadingStages.length - 1 && tempPlan) {
      const timer = setTimeout(() => {
        setGeneratedPlan(tempPlan);
        setStep("result");
        setTempPlan(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loadingStage, step, tempPlan]);

  // Chatbot Tooltip Feature
  const [tooltipMessage, setTooltipMessage] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show first message after 10 seconds
    const timer1 = setTimeout(() => {
      if (!isOpen) {
        setTooltipMessage(`Join ${planCount.toLocaleString()}+ businesses that already generated their AI Growth Plan! 🚀`);
        setShowTooltip(true);
      }
    }, 10000);

    // Hide first message after 20 seconds (10s + 20s = 30s)
    const timer2 = setTimeout(() => {
      setShowTooltip(false);
    }, 30000);

    // Show second message 5 seconds after hiding (30s + 5s = 35s)
    const timer3 = setTimeout(() => {
      if (!isOpen) {
        setTooltipMessage("Still thinking? Let ZenThira analyze your business and give you actionable strategies! 💡");
        setShowTooltip(true);
      }
    }, 35000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen]);

  // Listen to external open-chatbot event (fired by Hero CTA button)
  useEffect(() => {
    const handler = () => { setIsOpen(true); setShowTooltip(false); };
    window.addEventListener('open-chatbot', handler);
    return () => window.removeEventListener('open-chatbot', handler);
  }, []);

  // Helper to safely render AI output which might occasionally be a nested object
  const renderText = (text: any) => {
    if (!text) return "";
    
    const parseValue = (val: any, depth = 0): string => {
      if (typeof val === 'string') {
        val = val.trim();
        if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
          try { val = JSON.parse(val); } catch(e) {}
        }
      }

      const indent = " ".repeat(depth * 4);
      if (Array.isArray(val)) {
        return val.map(item => `${indent}• ${parseValue(item, 0)}`).join('\n');
      }
      if (typeof val === 'object' && val !== null) {
        return Object.entries(val)
          .map(([k, v]) => `${indent}• ${k.toUpperCase()}:\n${parseValue(v, depth + 1)}`)
          .join('\n\n');
      }
      return String(val).replace(/\*\*/g, '').replace(/\*/g, '');
    };

    return parseValue(text).trim();
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (formStep === 1) {
      if (!formData.business_type.trim()) newErrors.business_type = "Required";
      if (!formData.years_in_business.trim()) newErrors.years_in_business = "Required";
      if (!formData.language.trim()) newErrors.language = "Required";
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
        setTempPlan(parsedPlan); // Store it but don't show yet
      } catch (err) {
        setTempPlan({
          snapshot: data.plan,
          marketEdge: "Analyzed manually by ZenThira Engine.",
          digitalGrowth: "Strategies embedded in the snapshot above.",
          actionPlan: "Immediate implementation recommended."
        });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to ZenThira. Check your network or Vercel logs.");
      setStep("form");
    }
  };

  const handleDownloadPDF = async () => {
    // Basic validation for lead form
    if (!leadDetails.email || !leadDetails.phone) {
      setToastMessage("Please fill in both Email & Phone Number to download!");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadDetails.email)) {
      setToastMessage("Please enter a valid email address!");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planData: generatedPlan, 
          userDetails: leadDetails,
          language: formData.language // Added language here
        })
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
      setToastMessage("Failed to download PDF. Please try again.");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const resetChat = () => {
    setStep("form");
    setFormStep(1);
    setFormData({
      business_type: "", industry: "", years_in_business: "", language: "English",
      main_activities: "", challenges: "", tools: "", team_size: "", goals: ""
    });
    setGeneratedPlan(null);
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-10 left-1/2 z-[9999] bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button with Tooltip */}
      <div className="fixed bottom-20 right-4 md:bottom-24 md:right-8 z-50 flex flex-col items-end">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-4 mr-2 bg-gradient-to-r from-purple-600 to-cyber-teal p-[2px] rounded-2xl shadow-2xl shadow-purple-500/20 max-w-[250px]"
            >
              <div className="bg-[#111] rounded-2xl p-4 relative">
                <button 
                  onClick={() => setShowTooltip(false)}
                  className="absolute -top-2 -right-2 bg-white text-black rounded-full p-1 shadow hover:scale-110 transition-transform"
                >
                  <X className="w-3 h-3" />
                </button>
                <p className="text-white text-sm font-bold leading-relaxed">{tooltipMessage}</p>
                {/* Pointer Arrow */}
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[#111] rotate-45 border-b-[2px] border-r-[2px] border-cyber-teal"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => {
            setIsOpen(true);
            setShowTooltip(false);
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: isOpen ? 0 : 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
          className="w-14 h-14 md:w-16 md:h-16 bg-transparent rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(168,85,247,0.4)] hover:shadow-[0_15px_40px_rgba(168,85,247,0.6)] group overflow-hidden border-2 border-cyber-teal"
        >
          <img src={botIcon} alt="ZenThira" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
          <div className="absolute inset-0 rounded-full border border-cyber-teal animate-ping opacity-30" />
        </motion.button>
      </div>

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
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 bg-cyber-teal/5 px-3 py-1.5 rounded-full border border-cyber-teal/20">
                  <TrendingUp className="w-3.5 h-3.5 text-cyber-teal" />
                  <span className="text-[11px] text-white/70 font-bold uppercase tracking-wider">
                    <motion.span
                      key={planCount}
                      initial={{ scale: 1.5, color: "#22d3ee" }}
                      animate={{ scale: 1, color: "rgba(255,255,255,0.7)" }}
                      className="inline-block mr-1"
                    >
                      {planCount.toLocaleString()}+
                    </motion.span>
                    Plans Generated
                  </span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar bg-gradient-to-b from-obsidian to-[#0a0a0a]">
              
              {/* Step 1: Form Steps */}
              {step === "form" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Years in Business <span className="text-red-500">*</span></label>
                            <input 
                              type="number" 
                              value={formData.years_in_business}
                              onChange={(e) => setFormData({...formData, years_in_business: e.target.value})}
                              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyber-teal focus:outline-none transition-colors"
                              placeholder="e.g. 5"
                            />
                            {errors.years_in_business && <p className="text-red-500 text-[10px]">{errors.years_in_business}</p>}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-white/60 uppercase tracking-wider font-bold">Select Language <span className="text-red-500">*</span></label>
                          <SearchableSelect 
                            value={formData.language}
                            onChange={(val) => setFormData({...formData, language: val})}
                            options={languages}
                            placeholder="Select Language"
                          />
                          {errors.language && <p className="text-red-500 text-[10px]">{errors.language}</p>}
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
                </motion.div>
              )}

              {/* Step 2: Loading */}
              {step === "loading" && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="h-full flex flex-col items-center justify-start text-center space-y-10 min-h-[500px] relative overflow-hidden pt-24"
                >
                  <div className="relative z-10">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        boxShadow: ["0 0 20px rgba(168,85,247,0.2)", "0 0 40px rgba(168,85,247,0.5)", "0 0 20px rgba(168,85,247,0.2)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-28 h-28 rounded-full border-4 border-white/5 border-t-cyber-teal flex items-center justify-center bg-[#111]" 
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 border-2 border-dashed border-white/10 rounded-full"
                      />
                      <img src={botIcon} alt="ZenThira" className="w-16 h-16 rounded-full border-2 border-cyber-teal/30 shadow-2xl" />
                    </motion.div>
                  </div>
                  
                  <div className="space-y-6 w-full max-w-sm relative z-10">
                    <div className="space-y-1">
                      <h4 className="text-white font-black text-2xl tracking-tighter uppercase italic">ZenThira <span className="text-cyber-teal">Engine</span></h4>
                    </div>
 
                    <div className="space-y-2.5">
                      {loadingStages.map((stage, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: loadingStage >= index ? 1 : 0.15,
                            x: loadingStage >= index ? 0 : -20,
                            scale: loadingStage === index ? 1.02 : 1,
                            backgroundColor: loadingStage === index ? "rgba(34,211,238,0.05)" : "transparent"
                          }}
                          className={`flex items-center gap-3 border ${loadingStage === index ? 'border-cyber-teal/30' : 'border-white/5'} rounded-xl px-5 py-3.5 transition-all duration-500`}
                        >
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            loadingStage > index ? 'bg-green-500' : 
                            loadingStage === index ? 'bg-cyber-teal animate-ping' : 'bg-white/10'
                          }`} />
                          <span className={`text-xs font-bold tracking-wide transition-colors duration-500 ${
                            loadingStage === index ? 'text-cyber-teal' : loadingStage > index ? 'text-white/80' : 'text-white/30'
                          }`}>
                            {stage}
                          </span>
                          {loadingStage > index && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                              <Check className="w-4 h-4 text-green-500" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
 
                    <div className="pt-2 px-2">
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-600 via-cyber-teal to-purple-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${((loadingStage + 1) / loadingStages.length) * 100}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── 4 New Plan Cards ── */}
              {step === "result" && generatedPlan && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 select-none">

                  {/* Card 1: Snapshot */}
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <User className="w-4 h-4 text-blue-400" />
                      </div>
                      <h3 className="text-white font-bold text-base">Snapshot</h3>
                      <span className="ml-auto text-sm">📌</span>
                    </div>
                    <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                      {renderText(generatedPlan.snapshot) || "Snapshot not available."}
                    </div>
                  </div>

                  {/* Card 2: Market Edge */}
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                      </div>
                      <h3 className="text-white font-bold text-base">Market Edge</h3>
                    </div>
                    <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                      {renderText(generatedPlan.marketEdge) || "Market edge details not available."}
                    </div>
                  </div>

                  {/* Card 3: Digital Growth */}
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-cyber-teal/20 flex items-center justify-center border border-cyber-teal/30">
                        <Sparkles className="w-4 h-4 text-cyber-teal" />
                      </div>
                      <h3 className="text-white font-bold text-base">Digital Growth</h3>
                    </div>
                    <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                      {renderText(generatedPlan.digitalGrowth) || "Digital growth strategy not available."}
                    </div>
                  </div>

                  {/* Card 4: 30-Day Action Plan */}
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                        <ChevronRight className="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 className="text-white font-bold text-base">30-Day Action Plan</h3>
                      <span className="ml-auto text-sm">✅</span>
                    </div>
                    <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                      {renderText(generatedPlan.actionPlan) || "Action plan not available."}
                    </div>
                  </div>

                </motion.div>
              )}
            </div>

            {/* Fixed Footer for Form Step */}
            {step === "form" && (
              <div className="p-4 md:p-6 border-t border-white/10 bg-[#0a0a0a] flex flex-col gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                {/* Social Proof Counter */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-[#111] bg-[#222] flex items-center justify-center overflow-hidden shadow-xl">
                          <img 
                            src={`https://i.pravatar.cc/100?u=${i + 10}`} 
                            alt="User" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.span
                        key={planCount}
                        initial={{ scale: 1.2, color: "#22d3ee" }}
                        animate={{ scale: 1, color: "#fff" }}
                        className="text-lg font-black tracking-tighter"
                      >
                        {planCount.toLocaleString()}+
                      </motion.span>
                      <span className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em] italic">Plans Generated</span>
                    </div>
                  </div>
                </motion.div>

                <div className="flex items-center gap-3">
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
              </div>
            )}
            
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
                    <a href="tel:+918754659759" className="flex items-center gap-2 text-cyber-teal hover:text-white transition-colors text-sm font-bold bg-[#111] px-4 py-2 rounded-full border border-white/5">
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
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <Mail className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-center text-white mb-2">Get Your Strategy PDF</h3>
              <p className="text-white/50 text-center text-sm mb-8">Enter your details to instantly unlock and download the complete plan.</p>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    value={leadDetails.email}
                    onChange={(e) => setLeadDetails({...leadDetails, email: e.target.value})}
                    placeholder="Enter your Gmail"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Mobile Number <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    value={leadDetails.phone}
                    onChange={(e) => setLeadDetails({...leadDetails, phone: e.target.value})}
                    placeholder="Enter your mobile number"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>

                <button 
                  onClick={handleDownloadPDF}
                  className="w-full py-4 mt-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20"
                >
                  <Download className="w-4 h-4" />
                  UNLOCK & DOWNLOAD PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// --- Searchable Select Component ---
const SearchableSelect = ({ value, onChange, options, placeholder }: { 
  value: string, 
  onChange: (val: string) => void, 
  options: {label: string}[],
  placeholder: string 
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsSelectOpen(!isSelectOpen)}
        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white flex items-center justify-between focus:border-cyber-teal outline-none transition-colors"
      >
        <div className="flex items-center gap-3">
          <Bot className="w-4 h-4 text-cyber-teal/50" />
          <span className="font-medium">{value || placeholder}</span>
        </div>
        <ChevronRight className={`w-4 h-4 text-white/30 transition-transform ${isSelectOpen ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {isSelectOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-[110] w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-3 border-b border-white/5 bg-[#111]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search language..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyber-teal/50 transition-all"
                />
                <Bot className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      onChange(opt.label);
                      setIsSelectOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-white/5 transition-all ${value === opt.label ? 'text-cyber-teal bg-cyber-teal/5 font-bold' : 'text-white/60'}`}
                  >
                    <span>{opt.label}</span>
                    {value === opt.label && <Sparkles className="w-3.5 h-3.5" />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-10 text-center text-white/30 text-xs italic">No languages found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const languages = [
  { label: "English" },
  { label: "Tamil" }
];
