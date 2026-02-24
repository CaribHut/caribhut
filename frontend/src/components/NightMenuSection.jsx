import { motion } from 'framer-motion';
import { Moon, Flame, Leaf } from 'lucide-react';

const nightMenuItems = [
  {
    id: 1,
    name: "Jerk Chicken Wings",
    description: "Serveras med plantain eller fries",
    extras: "Mango- eller chili-dip",
    tags: ["Huvudrätt"],
    icon: "🍗"
  },
  {
    id: 2,
    name: "Jerk Chicken Wrap / Roti",
    description: "Samma kyckling som wings med sallad + sås",
    extras: "Mättande & enkel montering",
    tags: ["Populär"],
    icon: "🌯"
  },
  {
    id: 3,
    name: "Veggie Bowl / Veg Wrap",
    description: "Ris & ärtor, mango-salsa, rostade grönsaker",
    extras: "Veganskt alternativ",
    tags: ["Vegan"],
    icon: "🥗"
  },
  {
    id: 4,
    name: "Loaded Plantain Fries",
    description: "Jerk-sås, picklad lök, lime creme",
    extras: "Perfekt som tilltugg",
    tags: ["Favorit"],
    icon: "🍟"
  }
];

const NightMenuSection = () => {
  return (
    <section
      id="nightmenu"
      className="py-24 md:py-32 bg-[#1A1A18] relative overflow-hidden"
      data-testid="nightmenu-section"
    >
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#FFA500] rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FF66A3] rounded-full opacity-10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Moon size={24} className="text-[#FFA500]" />
            <p className="font-space text-[#FFA500] font-bold tracking-widest text-sm uppercase">
              Nattmeny
            </p>
          </div>
          <h2 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#FDFCF8] mb-6">
            Sena <span className="text-[#FF66A3]">Klassiker</span>
          </h2>
          <p className="font-dm text-[#FDFCF8]/70 text-lg max-w-2xl mx-auto leading-relaxed">
            När natten faller serverar vi våra bästa karibiska klassiker – 
            perfekta för sena kvällar och goda vibbar.
          </p>
          <div className="section-divider mx-auto mt-8" />
        </motion.div>

        {/* Night Menu Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {nightMenuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#FDFCF8]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#FDFCF8]/10 hover:border-[#FFA500]/30 transition-all group"
              data-testid={`nightmenu-item-${item.id}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="font-space text-xl font-bold text-[#FDFCF8] group-hover:text-[#FFA500] transition-colors">
                      {item.name}
                    </h3>
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 rounded-full text-xs font-dm font-medium ${
                          tag === 'Vegan' 
                            ? 'bg-[#32CD32] text-white' 
                            : tag === 'Populär'
                            ? 'bg-[#FF66A3] text-white'
                            : 'bg-[#FFA500] text-white'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="font-dm text-[#FDFCF8]/70 mb-2">
                    {item.description}
                  </p>
                  <p className="font-dm text-[#FFA500] text-sm">
                    {item.extras}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NightMenuSection;
