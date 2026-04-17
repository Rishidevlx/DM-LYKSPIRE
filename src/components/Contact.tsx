import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Send, CheckCircle2 } from "lucide-react";
export default function Contact() {
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
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
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
    <section id="contact" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <div className="section-label">Contact</div>
            <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase mb-8">
              Let's Build <br /> Your <span className="text-gradient">System</span>
            </h2>
            <p className="text-white/40 text-xl max-w-md leading-relaxed mb-12">
              Ready to scale? Fill out the form and we'll get back to you within 24 hours.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-white/60">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Send className="w-5 h-5 text-cyber-teal" />
                </div>
                <span className="font-bold">hello@lykspire.com</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center p-10"
              >
                <CheckCircle2 className="w-20 h-20 text-cyber-teal mb-6" />
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Message Sent!</h3>
                <p className="text-white/40">We'll be in touch shortly.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 text-cyber-teal font-black uppercase tracking-widest text-xs hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="group relative">
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full bg-transparent border-0 border-b ${errors.name ? 'border-red-500' : 'border-white/20'} py-3 focus:outline-none focus:border-cyber-teal focus:ring-0 transition-colors text-white placeholder:text-white/50 text-sm`}
                      placeholder="Your Name"
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase absolute -bottom-5 left-0">{errors.name}</p>}
                  </div>

                  <div className="group relative">
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full bg-transparent border-0 border-b ${errors.email ? 'border-red-500' : 'border-white/20'} py-3 focus:outline-none focus:border-cyber-teal focus:ring-0 transition-colors text-white placeholder:text-white/50 text-sm`}
                      placeholder="Your Email"
                    />
                    {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase absolute -bottom-5 left-0">{errors.email}</p>}
                  </div>

                  <div className="group relative">
                    <input 
                      type="text"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      className={`w-full bg-transparent border-0 border-b ${errors.mobile ? 'border-red-500' : 'border-white/20'} py-3 focus:outline-none focus:border-cyber-teal focus:ring-0 transition-colors text-white placeholder:text-white/50 text-sm`}
                      placeholder="Phone Number"
                    />
                    {errors.mobile && <p className="text-red-500 text-[10px] font-bold uppercase absolute -bottom-5 left-0">{errors.mobile}</p>}
                  </div>

                  <div className="group relative">
                    <input 
                      type="text"
                      value={formData.purpose}
                      onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                      className={`w-full bg-transparent border-0 border-b ${errors.purpose ? 'border-red-500' : 'border-white/20'} py-3 focus:outline-none focus:border-cyber-teal focus:ring-0 transition-colors text-white placeholder:text-white/50 text-sm`}
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
                    className={`w-full bg-transparent border-0 border-b ${errors.message ? 'border-red-500' : 'border-white/20'} py-3 focus:outline-none focus:border-cyber-teal focus:ring-0 transition-colors resize-none text-white text-sm ${!formData.message ? 'focus:placeholder:text-cyber-teal placeholder:text-cyber-teal' : ''}`}
                    placeholder="Your Message"
                  />
                  {errors.message && <p className="text-red-500 text-[10px] font-bold uppercase absolute -bottom-5 left-0">{errors.message}</p>}
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-cyber-teal text-white rounded font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
                {submitError && <p className="text-red-500 text-xs text-center font-bold uppercase">{submitError}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
