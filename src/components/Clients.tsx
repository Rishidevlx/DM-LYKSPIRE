import { useEffect, useState } from "react";
import { motion } from "motion/react";

// Static fallback clients (shown if API unavailable)
import franchLogo from "../assest/Franchisepreneur logo.png";
import lankaLogo from "../assest/Lanka greenovation logo.jpg";
import mindaptLogo from "../assest/Mindapt logo.png";
import argitLogo from "../assest/Argit logo.jpeg";

const STATIC_CLIENTS = [
  { id: -1, company_name: "Franchisepreneur", description: "", logo_url: franchLogo, link: "https://franchisepreneurglobal.com/" },
  { id: -2, company_name: "Lanka Greenovation", description: "Hosting partner", logo_url: lankaLogo, link: "https://lankagreenovation.com/" },
  { id: -3, company_name: "FLOWTERNITY", description: "Automation provider", logo_url: "", link: "https://www.flowternity.com/" },
  { id: -4, company_name: "Mindapt", description: "AI solution partner", logo_url: mindaptLogo, link: "https://mindapt.in/" },
  { id: -5, company_name: "Argit", description: "Argit solution", logo_url: argitLogo, link: "https://www.argitsolutions.in/" },
];

interface ClientData {
  id: number;
  company_name: string;
  description: string;
  logo_url: string;
  link?: string;
}

const ClientCard = ({ client, isMobile = false }: { client: ClientData; isMobile?: boolean }) => (
  <a
    href={client.link ?? "#"}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyber-teal/30 hover:bg-white/[0.05] transition-all duration-500 group/item ${isMobile ? "w-full" : "shrink-0"}`}
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyber-teal/20 flex items-center justify-center border border-white/10 group-hover/item:scale-110 transition-transform overflow-hidden shrink-0">
      {client.logo_url ? (
        <img src={client.logo_url} alt={client.company_name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-cyber-teal font-black text-xl italic">{client.company_name[0]}</span>
      )}
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-lg md:text-xl font-display font-black tracking-tighter uppercase text-white/40 group-hover/item:text-white transition-colors truncate">
        {client.company_name}
      </span>
      {client.description && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-cyber-teal/60 truncate">
          {client.description}
        </span>
      )}
    </div>
  </a>
);

export default function Clients() {
  const [clients, setClients] = useState<ClientData[]>(STATIC_CLIENTS);

  useEffect(() => {
    fetch("http://localhost:5000/api/clients")
      .then((r) => r.json())
      .then((data) => {
        if (data.clients && data.clients.length > 0) {
          setClients(data.clients);
        }
      })
      .catch(() => {
        // Silently use static fallback
      });
  }, []);

  const displayClients = clients.length > 0 ? clients : STATIC_CLIENTS;
  // Repeat enough times for smooth infinite scroll
  const scrollSet = [...displayClients, ...displayClients, ...displayClients, ...displayClients];

  return (
    <section id="clients" className="py-24 bg-obsidian overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col items-center text-center">
          <div className="section-label">Our Clients</div>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase mb-4">
            Trusted by <span className="text-gradient">Industry Leaders</span>
          </h2>
          <p className="text-white/40 text-sm max-w-2xl uppercase tracking-widest font-bold">
            Empowering businesses globally with AI-driven growth strategies and automated execution.
          </p>
        </div>
      </div>

      {/* Mobile View: 2 Column Grid */}
      <div className="md:hidden px-6 grid grid-cols-2 gap-4">
        {displayClients.map((client, i) => (
          <div key={`mobile-${client.id}-${i}`} className="w-full">
            <ClientCard client={client} isMobile />
          </div>
        ))}
      </div>

      {/* Desktop View: Scrolling Marquee */}
      <div className="hidden md:flex relative overflow-hidden group">
        <motion.div
          className="flex whitespace-nowrap gap-8 py-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {scrollSet.map((client, i) => (
            <div key={`desktop-${client.id}-${i}`} className="flex shrink-0">
              <ClientCard client={client} />
            </div>
          ))}
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-obsidian to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-obsidian to-transparent z-10" />
      </div>
    </section>
  );
}
