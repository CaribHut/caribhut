import { motion } from 'framer-motion';
import { Wine, Coffee, Beer, GlassWater, Flame, Leaf } from 'lucide-react';
import { menuData } from '../data/menuData';

const TagBadge = ({ tag }) => {
  const tagConfig = {
    spicy: { icon: Flame, className: 'bg-[#FFA500] text-white', label: 'Stark' },
    vegan: { icon: Leaf, className: 'bg-[#32CD32] text-white', label: 'Vegan' },
    popular: { icon: null, className: 'bg-[#FF66A3] text-white', label: 'Populär' },
    new: { icon: null, className: 'bg-[#008080] text-white', label: 'Nyhet' },
  };

  const config = tagConfig[tag];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span
      className={`${config.className} inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-dm font-medium`}
    >
      {Icon && <Icon size={12} />}
      {config.label}
    </span>
  );
};

const categoryIcons = {
  'Rum Cocktails': Wine,
  'Mocktails': Coffee,
  'Beer & Cider': Beer,
  'Wine': Wine,
  'Soft Drinks': GlassWater,
};

const DrinkCard = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start justify-between gap-4 py-4 border-b border-[#1A1A18]/10 last:border-0"
      data-testid={`drink-item-${item.id}`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-space text-base font-bold text-[#FDFCF8]">
            {item.name}
          </h4>
          {item.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <p className="font-dm text-[#FDFCF8]/60 text-sm mt-1">
          {item.description}
        </p>
      </div>
      <span className="font-syne text-lg font-bold text-[#FFA500]">
        {item.price} kr
      </span>
    </motion.div>
  );
};

const DrinkCategory = ({ category, items, index }) => {
  const Icon = categoryIcons[category] || Wine;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#1A1A18]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#FDFCF8]/10"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#008080] flex items-center justify-center">
          <Icon size={20} className="text-white" strokeWidth={1.5} />
        </div>
        <h3 className="font-syne text-xl font-bold text-[#FDFCF8]">{category}</h3>
      </div>
      <div className="space-y-0">
        {items.map((item, itemIndex) => (
          <DrinkCard key={item.id} item={item} index={itemIndex} />
        ))}
      </div>
    </motion.div>
  );
};

const DrinksSection = () => {
  return (
    <section
      id="drinks"
      className="py-24 md:py-32 bg-[#1A1A18] relative overflow-hidden"
      data-testid="drinks-section"
    >
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#008080] rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FF66A3] rounded-full opacity-10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
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
            Tropiska <span className="text-[#FF66A3]">Förfriskningar</span>
          </h2>
          <p className="font-dm text-[#FDFCF8]/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Från rombaserade klassiker till uppfriskande mocktails, vår dryckesmeny fångar 
            Karibiens själ. Skål för goda vibbar!
          </p>
          <div className="section-divider mx-auto mt-8" />
        </motion.div>

        {/* Featured Cocktail Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="relative rounded-3xl overflow-hidden max-w-4xl mx-auto aspect-[21/9]">
            <img
              src="https://images.unsplash.com/photo-1692746931486-22b6c7feb80e?crop=entropy&cs=srgb&fm=jpg&q=85"
              alt="Caribbean cocktails"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A18] via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="font-space text-[#FFA500] text-sm uppercase tracking-widest mb-2">
                Signaturdrink
              </p>
              <h3 className="font-syne text-3xl md:text-4xl font-extrabold text-white">
                Caribbean Punch
              </h3>
              <p className="font-dm text-white/70 mt-2 max-w-md">
                Vår berömda rumpunch — en tropisk blandning som tar dig till öparadis.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Alkoholfria Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-syne text-2xl md:text-3xl font-bold text-[#FDFCF8] text-center mb-8">
            Alkoholfria <span className="text-[#32CD32]">Favoriter</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {menuData.drinks
              .filter(cat => cat.category === 'Mocktails' || cat.category === 'Soft Drinks')
              .flatMap(cat => cat.items)
              .filter(item => item.image)
              .slice(0, 4)
              .map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-square">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A18] via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="font-space text-sm font-bold text-white">{item.name}</p>
                      <p className="font-syne text-[#FFA500] font-bold">{item.price} kr</p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Drinks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuData.drinks.map((section, index) => (
            <DrinkCategory
              key={section.category}
              category={section.category}
              items={section.items}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DrinksSection;
