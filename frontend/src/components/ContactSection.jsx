import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';
import { contactData } from '../data/menuData';

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="py-24 md:py-32 bg-white relative overflow-hidden"
      data-testid="contact-section"
    >
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFA500] rounded-full opacity-5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="font-space text-[#008080] font-bold tracking-widest text-sm uppercase mb-4">
            Visit Us
          </p>
          <h2 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1A1A18] mb-6">
            Come Say <span className="text-[#32CD32]">Hello</span>
          </h2>
          <p className="font-dm text-[#5F5F58] text-lg max-w-2xl mx-auto leading-relaxed">
            We're located in the heart of Västerås. Drop by for a taste of the Caribbean 
            or reach out to book a table for your next celebration.
          </p>
          <div className="section-divider mx-auto mt-8" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Address */}
            <div className="flex gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#FF66A3]/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={24} className="text-[#FF66A3]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-syne text-lg font-bold text-[#1A1A18] mb-1">
                  Location
                </h3>
                <p className="font-dm text-[#5F5F58]">{contactData.address}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#32CD32]/10 flex items-center justify-center flex-shrink-0">
                <Phone size={24} className="text-[#32CD32]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-syne text-lg font-bold text-[#1A1A18] mb-1">
                  Phone
                </h3>
                <a
                  href={`tel:${contactData.phone}`}
                  className="font-dm text-[#5F5F58] hover:text-[#008080] transition-colors"
                  data-testid="phone-link"
                >
                  {contactData.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#FFA500]/10 flex items-center justify-center flex-shrink-0">
                <Mail size={24} className="text-[#FFA500]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-syne text-lg font-bold text-[#1A1A18] mb-1">
                  Email
                </h3>
                <a
                  href={`mailto:${contactData.email}`}
                  className="font-dm text-[#5F5F58] hover:text-[#008080] transition-colors"
                  data-testid="email-link"
                >
                  {contactData.email}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#008080]/10 flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="text-[#008080]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-syne text-lg font-bold text-[#1A1A18] mb-3">
                  Opening Hours
                </h3>
                <div className="font-dm text-[#5F5F58] space-y-1">
                  <p>{contactData.hours.weekdays}</p>
                  <p>{contactData.hours.friday}</p>
                  <p>{contactData.hours.saturday}</p>
                  <p>{contactData.hours.sunday}</p>
                  <p className="text-[#FF66A3]">{contactData.hours.monday}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              <motion.a
                href={`https://instagram.com/${contactData.social.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#1A1A18] flex items-center justify-center text-white hover:bg-[#FF66A3] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                data-testid="instagram-link"
              >
                <Instagram size={20} strokeWidth={1.5} />
              </motion.a>
              <motion.a
                href={`https://facebook.com/${contactData.social.facebook.replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#1A1A18] flex items-center justify-center text-white hover:bg-[#008080] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                data-testid="facebook-link"
              >
                <Facebook size={20} strokeWidth={1.5} />
              </motion.a>
            </div>
          </motion.div>

          {/* Map Placeholder / Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-square lg:aspect-auto lg:h-full min-h-[400px] relative">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop"
                alt="Restaurant interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A18]/60 to-transparent" />
              
              {/* Overlay CTA */}
              <div className="absolute bottom-8 left-8 right-8">
                <motion.a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactData.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#1A1A18] rounded-full px-6 py-3 font-dm font-bold text-sm hover:bg-[#008080] hover:text-white transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="get-directions-button"
                >
                  <MapPin size={18} />
                  Get Directions
                </motion.a>
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#32CD32] rounded-full opacity-20" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#FF66A3] rounded-full opacity-30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
