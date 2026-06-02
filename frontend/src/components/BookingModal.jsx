import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const seatingZones = [
  {
    id: "havet",
    name: "Vid havet",
    capacity: 15,
  },
  {
    id: "viben",
    name: "Vid viben",
    capacity: 15,
  },
  {
    id: "stranden",
    name: "Vid stranden",
    capacity: 15,
  },
];

const BookingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    zone: "havet",
  });

  const [status, setStatus] = useState("");

  if (!isOpen) return null;

  const selectedZone = seatingZones.find((zone) => zone.id === formData.zone);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("Skickar bokning...");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Bokningen kunde inte skickas.");
      }

      setStatus("Bokningen är skickad! Vi återkommer med bekräftelse.");
    } catch (error) {
      setStatus("Något gick fel. Testa igen eller kontakta oss direkt.");
    }
  };

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

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🌴</div>

            <h2 className="font-syne text-3xl font-bold text-white mb-2">
              Boka bord
            </h2>

            <p className="font-dm text-white/60">
              Välj datum, tid och område.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Namn"
              required
              className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/10"
            />

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-post"
              type="email"
              required
              className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/10"
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Telefonnummer"
              required
              className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/10"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="date"
                value={formData.date}
                onChange={handleChange}
                type="date"
                required
                className="w-full p-4 rounded-xl bg-white/10 text-white border border-white/10"
              />

              <input
                name="time"
                value={formData.time}
                onChange={handleChange}
                type="time"
                required
                className="w-full p-4 rounded-xl bg-white/10 text-white border border-white/10"
              />
            </div>

            <input
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              type="number"
              min="1"
              max={selectedZone?.capacity || 15}
              required
              className="w-full p-4 rounded-xl bg-white/10 text-white border border-white/10"
            />

            <select
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white/10 text-white border border-white/10"
            >
              {seatingZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} - {zone.capacity} platser
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white font-dm font-bold hover:shadow-lg transition-all"
            >
              Skicka bokning
            </button>

            {status && (
              <p className="text-center text-white/70 font-dm mt-4">
                {status}
              </p>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
