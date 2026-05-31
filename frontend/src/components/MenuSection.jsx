
import { motion } from 'framer-motion';
import { Flame, Leaf, Star, Sparkles } from 'lucide-react';

const dishes = [
  {
    id: 'chicken-roti',
    name: 'Chicken Roti',
    description:
      'Mjuk roti fylld med saftig kyckling, karibiska kryddor och fräscha tillbehör.',
    price: 159,
    image: '/mat/Chicken roti.jpg',
    tags: ['popular'],
  },
  {
    id: 'scampi-roti',
    name: 'Scampi Roti',
    description:
      'Roti fylld med smakrika scampi, örter och tropiska karibiska toner.',
    price: 169,
    image: '/mat/Scampi roti.jpg',
    tags: ['new'],
  },
  {
    id: 'scampi-pasta',
    name: 'Scampi Pasta',
    description:
      'Krämig pasta med scampi, vitlök, örter och karibisk hetta.',
    price: 179,
    image: '/mat/Scampi pasta.jpg',
    tags: ['popular'],
  },
  {
    id: 'chicken-waffle',
    name: 'Chicken & Waffle',
    description:
      'Krispig kyckling med fluffig våffla och vår egengjorda magiska sås.',
    price: 125,
    image: '/mat/Chicken Waffle.jpg',
    tags: ['popular'],
  },
  {
    id: 'veg-roti',
    name: 'Veg Roti',
    description:
      'Vegetarisk roti fylld med smakrika grönsaker och autentiska karibiska kryddor.',
    price: 139,
    image: '/mat/Veg roti.jpg',
    tags: ['vegan'],
  },
  {
    id: 'caribbean-caesar',
    name: 'Caribbean Caesar Salad',
    description:
      'Fräsch caesarsallad med grillad kyckling, parmesan, krutonger och en karibisk twist.',
    price: 149,
    image: '/mat/Carib hut0097.jpg',
    tags: ['new'],
  },
];

const TagBadge = ({ tag }) => {
  const tagConfig = {
    spicy: { icon: Flame, className: 'tag-spicy', label: 'Stark' },
    vegan: { icon: Leaf, className: 'tag-vegan', label: 'Veg' },
    popular: { icon: Star, className: 'tag-popular', label: 'Populär' },
    new: { icon: Sparkles, className: 'tag-new', label: 'Nyhet' },
  };

  const config = tagConfig[tag];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <span
      className={`${config.className} inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-dm font-medium`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
};

const MenuSection = () => {
  return (
    <section
      id="menu"
      className="py-24 md:py-32 bg-white relative overflow-hidden"
      data-testid="menu-section"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF66A3] rounded-full opacity-5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#32CD32] rounded-full opacity-5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="font-space text-[#008080] font-bold tracking-widest text-sm uppercase mb-4">
            Vår Meny
          </p>

          <h2 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A1A18] mb-6">
            Karibiska <span className="text-[#FFA500]">Favoriter</span>
          </h2>

          <p className="font-dm text-[#5F5F58] text-lg max-w-2xl mx-auto leading-relaxed">
            Smakrika roti, krämig scampi pasta, caesarsallad och crispy chicken & waffle — direkt från öarna till din tallrik.
          </p>

          <div className="section-divider mx-auto mt-8" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group bg-[#FDFCF8] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-100"
              data-testid={`menu-item-${item.id}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A18]/70 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  {item.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                  <h3 className="font-syne text-2xl font-extrabold text-white">
                    {item.name}
                  </h3>

                  <p className="font-syne text-xl font-bold text-[#FFA500] bg-[#1A1A18]/80 px-3 py-1 rounded-full whitespace-nowrap">
                    {item.price} kr
                  </p>
                </div>
              </div>

              <div className="p-6">
                <p className="font-dm text-[#5F5F58] text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
