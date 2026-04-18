import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, MapPin, Mail, Phone, X, CheckCircle2, Navigation } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    purpose: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.mobile.replace(/[\s-]/g, ''))) {
      newErrors.mobile = "Please enter a valid mobile number";
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = "Purpose is required";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setIsSubmitted(true);
          setFormData({ name: "", email: "", mobile: "", purpose: "", message: "" });
        } else {
          setSubmitError("Failed to send message. Please try again.");
        }
      } catch (error) {
        setSubmitError("Something went wrong. Please check your connection.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl max-h-[95vh]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-50 w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-cyber-teal hover:border-cyber-teal transition-all duration-300 group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Left Side: Form Section */}
            <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col bg-gradient-to-br from-obsidian to-obsidian/50 overflow-y-auto">
              <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase mb-4 text-white">Let's <span className="text-gradient">Talk</span></h2>
              <p className="text-white/40 mb-12 text-sm leading-relaxed max-w-md">
                To request a quote or want to meet up for coffee, contact us directly or fill out the form and we will get back to you promptly.
              </p>

              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10 flex-1"
                >
                  <div className="w-20 h-20 bg-cyber-teal/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-cyber-teal" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">Message Sent!</h3>
                  <p className="text-white/40 mb-8 max-w-xs">Our team will get back to you as soon as possible.</p>
                  <button onClick={() => setIsSubmitted(false)} className="text-cyber-teal font-black uppercase tracking-widest text-xs hover:underline">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10 flex-1 flex flex-col justify-center">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="group relative">
                        <input 
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className={`w-full bg-transparent border-0 border-b ${errors.name ? 'border-red-500' : 'border-white/10'} py-3 focus:outline-none focus:border-cyber-teal focus:ring-0 transition-colors text-white placeholder:text-white/20 text-sm peer`}
                          placeholder="Your Name"
                        />
                        {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase absolute -bottom-5 left-0">{errors.name}</p>}
                      </div>

                      <div className="group relative">
                        <input 
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className={`w-full bg-transparent border-0 border-b ${errors.email ? 'border-red-500' : 'border-white/10'} py-3 focus:outline-none focus:border-cyber-teal focus:ring-0 transition-colors text-white placeholder:text-white/20 text-sm peer`}
                          placeholder="Your Email"
                        />
                        {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase absolute -bottom-5 left-0">{errors.email}</p>}
                      </div>

                      <div className="group relative">
                        <input 
                          type="text"
                          value={formData.mobile}
                          onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                          className={`w-full bg-transparent border-0 border-b ${errors.mobile ? 'border-red-500' : 'border-white/10'} py-3 focus:outline-none focus:border-cyber-teal focus:ring-0 transition-colors text-white placeholder:text-white/20 text-sm peer`}
                          placeholder="Phone Number"
                        />
                        {errors.mobile && <p className="text-red-500 text-[10px] font-bold uppercase absolute -bottom-5 left-0">{errors.mobile}</p>}
                      </div>

                      <div className="group relative">
                        <input 
                          type="text"
                          value={formData.purpose}
                          onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                          className={`w-full bg-transparent border-0 border-b ${errors.purpose ? 'border-red-500' : 'border-white/10'} py-3 focus:outline-none focus:border-cyber-teal focus:ring-0 transition-colors text-white placeholder:text-white/20 text-sm peer`}
                          placeholder="Subject"
                        />
                        {errors.purpose && <p className="text-red-500 text-[10px] font-bold uppercase absolute -bottom-5 left-0">{errors.purpose}</p>}
                      </div>
                    </div>

                    <div className="group relative">
                      <textarea 
                        rows={1}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        onInput={(e) => {
                          e.currentTarget.style.height = 'auto';
                          e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                        }}
                        className={`w-full bg-transparent border-0 border-b ${errors.message ? 'border-red-500' : 'border-white/10'} py-3 focus:outline-none focus:border-cyber-teal focus:ring-0 transition-colors resize-none text-white text-sm placeholder:text-white/20`}
                        placeholder="Your Message"
                      />
                      {errors.message && <p className="text-red-500 text-[10px] font-bold uppercase absolute -bottom-5 left-0">{errors.message}</p>}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-12 md:max-w-[200px] w-full py-4 bg-cyber-teal text-obsidian rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                  {submitError && <p className="text-red-500 text-[10px] font-bold uppercase mt-4">{submitError}</p>}
                </form>
              )}
            </div>

            {/* Right Side: Illustration & Info Section */}
            <div className="hidden md:flex flex-col md:w-2/5 bg-white/5 border-l border-white/5 p-12 relative overflow-hidden justify-between">
              <div className="absolute inset-0 bg-cyber-teal/5 blur-[100px] pointer-events-none" />
              
              {/* Illustration Art */}
              <div className="relative w-full aspect-square bg-cyber-teal/10 rounded-full flex flex-col items-center justify-center p-8 border border-cyber-teal/20 mx-auto mt-8 group">
                <Navigation className="w-24 h-24 text-cyber-teal -translate-y-2 translate-x-2 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-700" />
                <div className="absolute w-12 h-12 bg-blue-500/20 rounded-full blur-xl top-10 left-10" />
                <div className="absolute w-8 h-8 rounded-full border border-cyber-teal/30 bottom-16 right-12 animate-pulse" />
              </div>

              {/* Contact Info Details */}
              <div className="relative z-10 space-y-6 mt-16">
                <div className="flex items-start gap-4 text-white/60">
                  <MapPin className="w-5 h-5 text-cyber-teal flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Coimbatore, Tamil Nadu, India</span>
                </div>
                <div className="flex items-center gap-4 text-white/60">
                  <Phone className="w-5 h-5 text-cyber-teal flex-shrink-0" />
                  <span className="text-sm">+91 87546 59759</span>
                </div>
                <div className="flex items-center gap-4 text-white/60">
                  <Mail className="w-5 h-5 text-cyber-teal flex-shrink-0" />
                  <span className="text-sm">info@tieraprom.co.in</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
