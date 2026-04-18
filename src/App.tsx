/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import CaseStudies from "./components/CaseStudies";
import About from "./components/About";
import Process from "./components/Process";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import ContactModal from "./components/ContactModal";
import WhatsAppFloating from "./components/WhatsAppFloating";
import Stats from "./components/Stats";
import ProblemSolution from "./components/ProblemSolution";
import Results from "./components/Results";
import FAQ from "./components/FAQ";
import PrimaryCTA from "./components/PrimaryCTA";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Adjust duration as needed

    const handleOpenModal = () => setIsContactModalOpen(true);
    window.addEventListener('open-contact-modal', handleOpenModal);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('open-contact-modal', handleOpenModal);
    };
  }, []);

  return (
    <main className="min-h-screen bg-obsidian selection:bg-cyber-teal selection:text-obsidian">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader key="preloader" />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Navbar />
          <Hero />
          <ProblemSolution />
          <Stats />
          <Services />
          <Results />
          <CaseStudies />
          <About />
          <Process />
          <Testimonials />
          <PrimaryCTA />
          <FAQ />
          <Contact />
          <Footer />
        </motion.div>
      )}

      {/* Global Contact Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      
      {/* Floating Elements */}
      <WhatsAppFloating />
    </main>
  );
}
