import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export default function WhatsAppFloating() {
  const phoneNumber = "8754659759";
  const message = "Hi Lykspire, I'm interested in your growth marketing services!";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[90] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-shadow hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] group"
    >
      <MessageCircle className="w-8 h-8 text-white fill-white transition-transform group-hover:rotate-12" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 bg-white text-obsidian px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
        Chat with us
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45" />
      </div>

      {/* Pulsing Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-50" />
    </motion.a>
  );
}
