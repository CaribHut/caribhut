
import React, { useEffect } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import InfoCards from "./components/InfoCards";
import BrandBanner from "./components/BrandBanner";
import MenuSection from "./components/MenuSection";
import NightMenuSection from "./components/NightMenuSection";
import LogoBanner from "./components/LogoBanner";
import DrinksSection from "./components/DrinksSection";
import SnowconeSection from "./components/SnowconeSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import AdminBookings from "./pages/AdminBookings";

import { Analytics } from "@vercel/analytics/react";

function App() {
  const isAdminPage = window.location.pathname.includes("admin-bookings");

  useEffect(() => {
    if (isAdminPage) return;

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
  }, [isAdminPage]);

  if (isAdminPage) {
    return (
      <>
        <AdminBookings />
        <Analytics />
      </>
    );
  }

  return (
    <div className="App bg-[#FDFCF8] min-h-screen">
      <Navbar />

      {/* STÄNGT FÖR SÄSONGEN */}
      <div className="w-full bg-[#102D27] text-white text-center py-12 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wide">
          STÄNGT FÖR SÄSONGEN
        </h1>

        <p className="text-xl md:text-2xl mt-5">
          🌴 Tack för en fantastisk sommar 2026! 🌴
        </p>

        <p className="text-lg mt-3 text-yellow-400">
          Vi ses igen nästa säsong! ☀️🍹
        </p>
      </div>

      <main>
        <Hero />
        <InfoCards />
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

      <Analytics />
    </div>
  );
}

export default App;
