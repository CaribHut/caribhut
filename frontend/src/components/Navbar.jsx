import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { id: 'hero', label: 'Hem' },
    { id: 'menu', label: 'Meny' },
    { id: 'nightmenu', label: 'Nattmeny' },
    { id: 'drinks', label: 'Drycker' },
    { id: 'about', label: 'Om Oss' },
    { id: 'contact', label: 'Kontakt' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass shadow-lg' : 'bg-transparent'
        }`}
        data-testid="navbar"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.button
              onClick={() => scrollToSection('hero')}
              className="font-syne text-2xl font-extrabold tracking-tight"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="logo-button"
            >
              <span className="text-[#FF66A3]">CARIB</span>
              <span className="text-[#1A1A18]"> HUT</span>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="nav-link font-dm text-[#1A1A18] font-medium text-sm tracking-wide hover:text-[#008080] transition-colors whitespace-nowrap"
                  data-testid={`nav-${link.id}`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => scrollToSection('contact')}
              className="hidden md:block bg-[#008080] text-white rounded-full px-6 py-3 font-dm font-bold text-sm tracking-wide hover:bg-[#006666] transition-all shadow-lg hover:shadow-xl btn-fill"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="nav-cta-button"
            >
              Boka Bord
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#1A1A18]"
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#FDFCF8] pt-24"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col items-center space-y-8 p-8">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="font-syne text-3xl font-bold text-[#1A1A18] hover:text-[#008080] transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`mobile-nav-${link.id}`}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                onClick={() => scrollToSection('contact')}
                className="mt-8 bg-[#008080] text-white rounded-full px-8 py-4 font-dm font-bold text-lg tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                data-testid="mobile-cta-button"
              >
                Boka Bord
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
