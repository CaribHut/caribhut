import { useState } from 'react';
import "@/App.css";
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
import BookingModal from "./components/BookingModal";

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

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
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}

export default App;
