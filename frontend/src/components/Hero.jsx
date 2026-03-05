import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const scrollToMenu = () => {
    const element = document.getElementById('menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-orb orb-pink absolute top-20 left-10 animate-blob" />
        <div className="gradient-orb orb-green absolute top-40 right-20 animate-blob animation-delay-2000" />
        <div className="gradient-orb orb-orange absolute bottom-40 left-1/3 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-space text-[#008080] font-bold tracking-widest text-sm uppercase"
              >
                Välkommen till Carib Hut
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-syne text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1A1A18] leading-tight"
              >
                Karibisk{' '}
                <span className="text-[#FF66A3]">Själ</span>
                <br />
                Svenskt{' '}
                <span className="text-[#32CD32]">Hjärta</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-dm text-[#5F5F58] text-lg md:text-xl leading-relaxed max-w-lg"
            >
              Upplev autentiska karibiska smaker mitt i Västerås. 
              Djärva kryddor, färska råvaror och recept som gått i arv i generationer.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                onClick={scrollToMenu}
                className="bg-[#008080] text-white rounded-full px-8 py-4 font-dm font-bold tracking-wide shadow-lg hover:bg-[#006666] hover:shadow-xl transition-all btn-fill"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="hero-menu-button"
              >
                Se Menyn
              </motion.button>
              <motion.button
                onClick={() => {
                  const element = document.getElementById('about');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-[#1A1A18] text-[#1A1A18] rounded-full px-8 py-4 font-dm font-bold tracking-wide hover:bg-[#1A1A18] hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="hero-story-button"
              >
                Vår Historia
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-12 pt-8"
            >
              <div>
                <p className="font-syne text-4xl font-extrabold text-[#FF66A3]">10+</p>
                <p className="font-dm text-[#5F5F58] text-sm">Signaturrätter</p>
              </div>
              <div>
                <p className="font-syne text-4xl font-extrabold text-[#32CD32]">100%</p>
                <p className="font-dm text-[#5F5F58] text-sm">Färskt Dagligen</p>
              </div>
              <div>
                <p className="font-syne text-4xl font-extrabold text-[#FFA500]">5★</p>
                <p className="font-dm text-[#5F5F58] text-sm">Omdömen</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Grid - Tetris Style */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Mobile: Single image */}
            <div className="lg:hidden mb-8">
              <motion.div
                className="rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
              >
                <img
  src="/chrisrene.jpg"
  alt="Carib Hut kockar"
  fetchpriority="high"
  className="w-full h-full object-cover object-top img-hover"
                />
              </motion.div>
            </div>

            {/* Desktop: Tetris layout */}
            <div className="relative w-full h-[600px] hidden lg:block">
              {/* Main large image - Two Chefs */}
              <motion.div
                className="absolute top-0 right-0 w-[85%] h-[70%] rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src="https://customer-assets.emergentagent.com/job_carib-menu/artifacts/28uktxfn_till%20hemsida.jpg"
                  alt="Carib Hut kockar"
                  className="w-full h-full object-cover object-top img-hover"
                />
              </motion.div>
              
              {/* Smaller accent image - Chef cooking */}
              <motion.div
                className="absolute bottom-0 left-0 w-[50%] h-[45%] rounded-2xl overflow-hidden shadow-xl border-4 border-[#FDFCF8]"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src="https://customer-assets.emergentagent.com/job_carib-menu/artifacts/3tl4ybpu_CaribHUT-85.jpg"
                  alt="Carib Hut kock i köket"
                  className="w-full h-full object-cover img-hover"
                />
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#FF66A3] rounded-full opacity-20 animate-blob" />
              <div className="absolute bottom-20 right-0 w-16 h-16 bg-[#32CD32] rounded-full opacity-30 animate-blob animation-delay-2000" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.button
          onClick={scrollToMenu}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[#008080]"
          data-testid="scroll-indicator"
        >
          <ChevronDown size={32} strokeWidth={1.5} />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
