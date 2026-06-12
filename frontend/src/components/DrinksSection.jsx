import { motion } from 'framer-motion';

const drinks = [
  { name: 'Paloma', file: 'Polama.jpeg' },
  { name: 'Tiki Sunset', file: 'Tiki sunset.jpeg' },
  { name: 'Caribbean Cooler', file: 'Carribean cooler.jpeg' },
  { name: 'Passionsfruktsmojito', file: 'Passionsfrukts mojito.jpeg' },
  { name: 'Tropical Lemon', file: 'Tropical lemon.jpeg' },
  { name: 'Piña Colada', file: 'Pina colada.jpeg' },
  { name: 'Saturn', file: 'Saturn.jpeg' },
];

const DrinksSection = () => {
  return (
    <section
      id="drinks"
      className="py-24 md:py-32 bg-[#1A1A18] relative overflow-hidden"
      data-testid="drinks-section"
    >
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#008080] rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FF66A3] rounded-full opacity-10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="font-space text-[#32CD32] font-bold tracking-widest text-sm uppercase mb-4">
            Dryckesmeny
          </p>

          <h2 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#FDFCF8] mb-6">
            Tropiska <span className="text-[#FF66A3]">Drinkar</span>
          </h2>

          <p className="font-dm text-[#FDFCF8]/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Fruktiga, fräscha och färgstarka drinkar med karibisk känsla.
          </p>

          <div className="section-divider mx-auto mt-8" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {drinks.map((drink, index) => (
            <motion.div
              key={drink.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group bg-[#1A1A18]/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-[#FDFCF8]/10"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={encodeURI(`/drinks/${drink.file}`)}
                  alt={drink.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A18] via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-syne text-2xl font-extrabold text-white">
                    {drink.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DrinksSection;
