import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1A1A18] py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.button
              onClick={() => scrollToSection('hero')}
              className="font-syne text-3xl font-extrabold tracking-tight mb-4 block"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-[#FF66A3]">CARIB</span>
              <span className="text-[#FDFCF8]"> HUT</span>
            </motion.button>
            <p className="font-dm text-[#FDFCF8]/60 leading-relaxed max-w-sm">
              Bringing the warmth and flavor of the Caribbean to Västerås, Sweden. 
              Authentic recipes, fresh ingredients, unforgettable experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-syne text-lg font-bold text-[#FDFCF8] mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { id: 'menu', label: 'Menu' },
                { id: 'drinks', label: 'Drinks' },
                { id: 'about', label: 'About Us' },
                { id: 'contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="font-dm text-[#FDFCF8]/60 hover:text-[#008080] transition-colors"
                    data-testid={`footer-${link.id}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-syne text-lg font-bold text-[#FDFCF8] mb-6">
              Hours
            </h4>
            <ul className="font-dm text-[#FDFCF8]/60 space-y-2 text-sm">
              <li>Tue - Thu: 11:00 - 22:00</li>
              <li>Fri: 11:00 - 23:00</li>
              <li>Sat: 12:00 - 23:00</li>
              <li>Sun: 12:00 - 20:00</li>
              <li className="text-[#FF66A3]">Mon: Closed</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#FDFCF8]/10 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-dm text-[#FDFCF8]/40 text-sm">
            © {currentYear} Carib Hut. All rights reserved.
          </p>
          <p className="font-dm text-[#FDFCF8]/40 text-sm flex items-center gap-1">
            Made with <Heart size={14} className="text-[#FF66A3]" fill="#FF66A3" /> in Västerås
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
