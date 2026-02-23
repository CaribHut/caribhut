import { motion } from 'framer-motion';
import { Heart, Utensils, Users } from 'lucide-react';
import { aboutData } from '../data/menuData';

const AboutSection = () => {
  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-[#FDFCF8] relative overflow-hidden"
      data-testid="about-section"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FF66A3] rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#32CD32] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="font-space text-[#008080] font-bold tracking-widest text-sm uppercase mb-4">
            Om Oss
          </p>
          <h2 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A1A18] mb-6">
            {aboutData.title}
          </h2>
          <p className="font-dm text-[#5F5F58] text-xl max-w-2xl mx-auto">
            {aboutData.subtitle}
          </p>
          <div className="section-divider mx-auto mt-8" />
        </motion.div>

        {/* Story Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://customer-assets.emergentagent.com/job_carib-menu/artifacts/3tl4ybpu_CaribHUT-85.jpg"
                alt="Carib Hut grundare"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A18]/50 to-transparent" />
            </div>
            
            {/* Floating accent */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-8 -right-8 bg-[#008080] text-white p-8 rounded-2xl shadow-xl max-w-[200px]"
            >
              <p className="font-syne text-4xl font-extrabold">2024</p>
              <p className="font-dm text-sm opacity-80">Grundat i Västerås</p>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#FF66A3] rounded-full opacity-30" />
            <div className="absolute top-1/2 -right-4 w-12 h-12 bg-[#32CD32] rounded-full opacity-40" />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {aboutData.story.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="font-dm text-[#1A1A18] text-lg leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Heart,
              title: 'Lagat med Kärlek',
              description: 'Varje rätt bär värmen och passionen från karibisk hemlagad mat.',
              color: '#FF66A3',
            },
            {
              icon: Utensils,
              title: 'Autentiska Recept',
              description: 'Traditionella recept som gått i arv i generationer, tillagade med omsorg.',
              color: '#FFA500',
            },
            {
              icon: Users,
              title: 'Gemenskap Först',
              description: 'Vi är mer än en restaurang — vi är en mötesplats för matälskare.',
              color: '#32CD32',
            },
          ].map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-stone-100"
              data-testid={`value-${index}`}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: `${value.color}20` }}
              >
                <value.icon size={28} style={{ color: value.color }} strokeWidth={1.5} />
              </div>
              <h3 className="font-syne text-xl font-bold text-[#1A1A18] mb-3">
                {value.title}
              </h3>
              <p className="font-dm text-[#5F5F58] leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Founders Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-[#1A1A18] rounded-3xl p-12 md:p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#008080] rounded-full opacity-10 blur-3xl" />
          
          <div className="grid md:grid-cols-2 gap-12 relative z-10">
            {aboutData.founders.map((founder, index) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center md:text-left"
              >
                <p className="font-dm text-[#FDFCF8]/80 text-xl italic leading-relaxed mb-6">
                  "{founder.quote}"
                </p>
                <div>
                  <p className="font-syne text-lg font-bold text-[#FDFCF8]">
                    {founder.name}
                  </p>
                  <p className="font-dm text-[#008080] text-sm">
                    {founder.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
