import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const BookingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative bg-gradient-to-br from-[#141412] via-[#1B1B18] to-[#252521] rounded-3xl w-full max-w-xl p-8 shadow-2xl border border-[#FF66A3]/20"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} className="text-white/60" />
          </button>

          <div className="text-center">
            <div className="text-6xl mb-6">🌴</div>

            <h2 className="font-syne text-3xl font-bold text-white mb-4">
              Booking disabled
            </h2>

            <p className="font-dm text-white/75 text-lg mb-4">
              Bordsbokningen är tillfälligt stängd.
            </p>

            <p className="font-dm text-white/55 mb-8">
              Vi tar just nu inte emot bordsbokningar online.
            </p>

            <button
              onClick={onClose}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white font-dm font-bold hover:shadow-lg transition-all"
            >
              Stäng
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
