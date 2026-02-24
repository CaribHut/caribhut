import { motion } from 'framer-motion';
import { Snowflake, Sun } from 'lucide-react';

const SnowconeSection = () => {
  return (
    <section
      id="snowcone"
      className="py-24 md:py-32 bg-gradient-to-b from-[#FDFCF8] to-[#E8F4F8] relative overflow-hidden"
      data-testid="snowcone-section"
    >
      {/* Background decoration */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#00BFFF] rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#FF66A3] rounded-full opacity-10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Snowflake size={24} className="text-[#00BFFF]" />
            <p className="font-space text-[#00BFFF] font-bold tracking-widest text-sm uppercase">
              Snowcone
            </p>
            <Sun size={24} className="text-[#FFA500]" />
          </div>
          <h2 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A1A18] mb-6">
            Karibisk <span className="text-[#FF66A3]">Iskall</span> Njutning
          </h2>
          <p className="font-dm text-[#5F5F58] text-lg max-w-2xl mx-auto leading-relaxed">
            Karibisk glass gjord på krossad is med naturliga smaker. 
            Perfekt i sommarvärmen!
          </p>
          <div className="section-divider mx-auto mt-8" />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://customer-assets.emergentagent.com/job_carib-menu/artifacts/42qkjo36_kykys%20erikslund%20jpg.jpg"
                alt="Snow Cone - Karibisk glass"
                className="w-full aspect-square object-cover"
              />
            </div>
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-[#FF66A3] text-white p-6 rounded-2xl shadow-xl"
            >
              <Snowflake size={32} className="mb-2" />
              <p className="font-syne text-lg font-bold">Iskall</p>
              <p className="font-dm text-sm opacity-80">Förfriskning</p>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#00BFFF] rounded-full opacity-30" />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
              <h3 className="font-syne text-2xl font-bold text-[#1A1A18] mb-4">
                Snow Cone
              </h3>
              <p className="font-dm text-[#5F5F58] leading-relaxed mb-4">
                <span className="font-bold text-[#1A1A18]">Shaved Ice</span> toppat med naturliga sirap och smaker. 
                En klassisk karibisk favorit som kyler ner dig på varma dagar.
              </p>
              <div className="flex items-center gap-2 text-[#00BFFF]">
                <Snowflake size={18} />
                <span className="font-space text-sm font-bold">Traditionell stil</span>
              </div>
            </div>

            <div className="bg-[#1A1A18] p-8 rounded-2xl text-white">
              <h3 className="font-syne text-2xl font-bold mb-4">
                Snow Dreams <span className="text-[#FF66A3]">★</span>
              </h3>
              <p className="font-dm text-white/80 leading-relaxed mb-4">
                <span className="font-bold text-[#FFA500]">Vår egen version:</span> En krämig 
                vaniljgräddsglass som bas, blandad med våra egengjorda extrakt.
              </p>
              <p className="font-dm text-white/60 text-sm mb-4">
                Alla extrakt är gjorda från grunden med naturliga ingredienser.
              </p>
              <div className="mt-6">
                <p className="font-space text-[#FFA500] text-sm uppercase tracking-widest mb-3">
                  Välj din smak:
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-[#FF6B6B] px-4 py-2 rounded-full text-sm font-dm font-bold">
                    Jordgubb
                  </span>
                  <span className="bg-[#FFA500] px-4 py-2 rounded-full text-sm font-dm font-bold">
                    Mango
                  </span>
                  <span className="bg-[#32CD32] px-4 py-2 rounded-full text-sm font-dm font-bold">
                    Äpple
                  </span>
                  <span className="bg-[#9B59B6] px-4 py-2 rounded-full text-sm font-dm font-bold">
                    Sommarbär
                  </span>
                  <span className="bg-[#3498DB] px-4 py-2 rounded-full text-sm font-dm font-bold">
                    Blåbär
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#00BFFF]/10 p-6 rounded-2xl text-center">
                <p className="font-syne text-3xl font-extrabold text-[#00BFFF]">100%</p>
                <p className="font-dm text-[#5F5F58] text-sm">Naturliga smaker</p>
              </div>
              <div className="bg-[#FF66A3]/10 p-6 rounded-2xl text-center">
                <p className="font-syne text-3xl font-extrabold text-[#FF66A3]">★★★</p>
                <p className="font-dm text-[#5F5F58] text-sm">Sommarfavorit</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SnowconeSection;
