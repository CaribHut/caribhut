import { motion } from 'framer-motion';
import { Flame, Leaf, Star, Sparkles } from 'lucide-react';
import { menuData } from '../data/menuData';

const TagBadge = ({ tag }) => {
  const tagConfig = {
    spicy: { icon: Flame, className: 'tag-spicy', label: 'Spicy' },
    vegan: { icon: Leaf, className: 'tag-vegan', label: 'Vegan' },
    popular: { icon: Star, className: 'tag-popular', label: 'Popular' },
    new: { icon: Sparkles, className: 'tag-new', label: 'New' },
  };

  const config = tagConfig[tag];
  if (!config) return null;

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

const MenuItem = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group"
      data-testid={`menu-item-${item.id}`}
    >
      <div className="flex items-start justify-between gap-4 py-6 border-b border-stone-200">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h4 className="font-space text-lg font-bold text-[#1A1A18] group-hover:text-[#008080] transition-colors">
              {item.name}
            </h4>
            {item.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          <p className="font-dm text-[#5F5F58] text-sm mt-2 leading-relaxed">
            {item.description}
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="font-syne text-xl font-bold text-[#1A1A18]">
            {item.price} kr
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const CategorySection = ({ category, items, categoryIndex }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: categoryIndex * 0.2 }}
      className="mb-16"
    >
      <div className="flex items-center gap-4 mb-8">
        <h3 className="font-syne text-2xl md:text-3xl font-bold text-[#1A1A18]">
          {category}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-[#008080] to-transparent" />
      </div>
      <div className="space-y-0">
        {items.map((item, index) => (
          <MenuItem key={item.id} item={item} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

const MenuSection = () => {
  return (
    <section
      id="menu"
      className="py-24 md:py-32 bg-white relative"
      data-testid="menu-section"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF66A3] rounded-full opacity-5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#32CD32] rounded-full opacity-5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="font-space text-[#008080] font-bold tracking-widest text-sm uppercase mb-4">
            Our Menu
          </p>
          <h2 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A1A18] mb-6">
            Caribbean <span className="text-[#FFA500]">Classics</span>
          </h2>
          <p className="font-dm text-[#5F5F58] text-lg max-w-2xl mx-auto leading-relaxed">
            From spicy jerk to savory roti, each dish is crafted with authentic 
            Caribbean spices and fresh, locally-sourced ingredients.
          </p>
          <div className="section-divider mx-auto mt-8" />
        </motion.div>

        {/* Featured Dishes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-20"
        >
          {menuData.food
            .flatMap((cat) => cat.items)
            .filter((item) => item.image)
            .slice(0, 3)
            .map((item, index) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -8 }}
                className="bg-[#FDFCF8] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all card-hover"
                data-testid={`featured-dish-${item.id}`}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover img-hover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {item.tags.map((tag) => (
                      <TagBadge key={tag} tag={tag} />
                    ))}
                  </div>
                  <h4 className="font-space text-xl font-bold text-[#1A1A18] mb-2">
                    {item.name}
                  </h4>
                  <p className="font-dm text-[#5F5F58] text-sm line-clamp-2">
                    {item.description}
                  </p>
                  <p className="font-syne text-2xl font-bold text-[#008080] mt-4">
                    {item.price} kr
                  </p>
                </div>
              </motion.div>
            ))}
        </motion.div>

        {/* Full Menu List */}
        <div className="grid lg:grid-cols-2 gap-x-16">
          <div>
            {menuData.food.slice(0, 2).map((section, index) => (
              <CategorySection
                key={section.category}
                category={section.category}
                items={section.items}
                categoryIndex={index}
              />
            ))}
          </div>
          <div>
            {menuData.food.slice(2).map((section, index) => (
              <CategorySection
                key={section.category}
                category={section.category}
                items={section.items}
                categoryIndex={index + 2}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
