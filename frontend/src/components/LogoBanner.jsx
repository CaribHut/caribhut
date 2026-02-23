import { motion } from 'framer-motion';

const LogoBanner = () => {
  const logoImages = [
    {
      src: "https://customer-assets.emergentagent.com/job_carib-menu/artifacts/3oklf0aa_WhatsApp%20Image%202026-02-17%20at%2021.47.28%20%283%29.jpeg",
      alt: "Carib Hut Logo Rosa"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_carib-menu/artifacts/niuxomt0_WhatsApp%20Image%202026-02-17%20at%2021.47.28%20%284%29.jpeg",
      alt: "Carib Hut Logo Grön"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_carib-menu/artifacts/674px5oo_WhatsApp%20Image%202026-02-17%20at%2021.47.28.jpeg",
      alt: "Carib Hut Logo Orange"
    }
  ];

  return (
    <section className="py-0 overflow-hidden" data-testid="logo-banner">
      <div className="flex">
        {logoImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex-1"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LogoBanner;
