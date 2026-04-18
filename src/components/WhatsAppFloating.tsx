import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export default function WhatsAppFloating() {
  // +91 country code required for mobile deep linking
  const phoneNumber = "+91 87546 59759";
  const message = "Hi Lykspire, I'm interested in your growth marketing services!";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[90] w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] group"
    >
      <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-white fill-white transition-transform group-hover:rotate-12" />
      
      {/* Tooltip — desktop only */}
      <div className="hidden md:block absolute right-full mr-4 bg-white text-obsidian px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
        Chat with us
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45" />
      </div>

      {/* Pulsing Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-50" />
    </motion.a>
  );
}
