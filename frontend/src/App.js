import "@/App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BrandBanner from "./components/BrandBanner";
import MenuSection from "./components/MenuSection";
import LogoBanner from "./components/LogoBanner";
import DrinksSection from "./components/DrinksSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App bg-[#FDFCF8] min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <BrandBanner />
        <MenuSection />
        <LogoBanner />
        <DrinksSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
