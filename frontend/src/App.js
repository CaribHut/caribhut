import React, { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BrandBanner from "./components/BrandBanner";
import MenuSection from "./components/MenuSection";
import NightMenuSection from "./components/NightMenuSection";
import LogoBanner from "./components/LogoBanner";
import DrinksSection from "./components/DrinksSection";
import SnowconeSection from "./components/SnowconeSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

import { Analytics } from "@vercel/analytics/react";

const BookingModal = lazy(() => import("./components/BookingModal"));

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="App bg-[#FDFCF8] min-h-screen">
      <Navbar onBookingClick={() => setIsBookingOpen(true)} />

      <main>
        <Hero />
        <BrandBanner />
        <MenuSection />
        <NightMenuSection />
        <LogoBanner />
        <DrinksSection />
        <SnowconeSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />

      <Suspense fallback={null}>
        {isBookingOpen && (
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
          />
        )}
      </Suspense>

      <Analytics />
    </div>
  );
}

export default App;
