import { motion } from 'framer-motion';

const BrandBanner = () => {
  const brandImages = [
    {
      src: "https://customer-assets.emergentagent.com/job_carib-menu/artifacts/u4bejg1c_WhatsApp%20Image%202026-02-17%20at%2021.47.28%20%282%29.jpeg",
      alt: "Från öarna till din tallrik - Rosa"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_carib-menu/artifacts/7bvcqdkx_WhatsApp%20Image%202026-02-17%20at%2021.47.28%20%285%29.jpeg",
      alt: "Från öarna till din tallrik - Grön"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_carib-menu/artifacts/spjf0vno_WhatsApp%20Image%202026-02-17%20at%2021.47.28%20%281%29.jpeg",
      alt: "Från öarna till din tallrik - Orange"
    }
  ];

  return (
    <section className="py-0 overflow-hidden" data-testid="brand-banner">
      <div className="flex">
        {brandImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
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

export default BrandBanner;
