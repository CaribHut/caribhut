import "@/App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MenuSection from "./components/MenuSection";
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
        <MenuSection />
        <DrinksSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
