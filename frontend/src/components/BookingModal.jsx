import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  Calendar,
  Clock,
  Check,
  ArrowRight,
  ArrowLeft,
  ChefHat,
  Palmtree,
  Waves,
} from "lucide-react";

// 62 seats total
const tables = [
  // Front row / Fontänen
  { id: 1, seats: 2, x: 10, y: 18, zone: "waterfront", shape: "small", label: "Fontänen" },
  { id: 2, seats: 6, x: 27, y: 17, zone: "waterfront", shape: "large", label: "Fontänen" },
  { id: 3, seats: 2, x: 46, y: 18, zone: "waterfront", shape: "small", label: "Fontänen" },
  { id: 4, seats: 6, x: 64, y: 17, zone: "waterfront", shape: "large", label: "Fontänen" },
  { id: 5, seats: 2, x: 84, y: 18, zone: "waterfront", shape: "small", label: "Fontänen" },

  // Middle row
  { id: 6, seats: 4, x: 18, y: 43, zone: "main", shape: "medium", label: "" },
  { id: 7, seats: 4, x: 37, y: 43, zone: "main", shape: "medium", label: "" },
  { id: 8, seats: 4, x: 56, y: 43, zone: "main", shape: "medium", label: "" },
  { id: 9, seats: 4, x: 75, y: 43, zone: "main", shape: "medium", label: "" },

  // Back row
  { id: 10, seats: 2, x: 9, y: 72, zone: "terrace", shape: "small", label: "" },
  { id: 11, seats: 6, x: 23, y: 70, zone: "terrace", shape: "large", label: "" },
  { id: 12, seats: 4, x: 40, y: 72, zone: "terrace", shape: "medium", label: "" },
  { id: 13, seats: 2, x: 55, y: 72, zone: "terrace", shape: "small", label: "" },
  { id: 14, seats: 6, x: 69, y: 70, zone: "terrace", shape: "large", label: "" },
  { id: 15, seats: 4, x: 85, y: 72, zone: "terrace", shape: "medium", label: "" },
  { id: 16, seats: 2, x: 90, y: 56, zone: "terrace", shape: "small", label: "" },
];

const getZoneColors = (zone, selected) => {
  if (selected) {
    return {
      background: "linear-gradient(135deg, #FF66A3 0%, #FFA500 100%)",
      text: "#ffffff",
      glow: "0 10px 30px rgba(255, 102, 163, 0.45)",
      ring: "ring-4 ring-[#FF66A3] ring-offset-2 ring-offset-transparent",
    };
  }

  if (zone === "waterfront") {
    return {
      background: "linear-gradient(135deg, #F6D28B 0%, #E7B76A 100%)",
      text: "#2C2116",
      glow: "0 8px 24px rgba(231, 183, 106, 0.25)",
      ring: "",
    };
  }

  if (zone === "main") {
    return {
      background: "linear-gradient(135deg, #59E3D8 0%, #35C6D7 100%)",
      text: "#082A2D",
      glow: "0 8px 24px rgba(53, 198, 215, 0.25)",
      ring: "",
    };
  }

  return {
    background: "linear-gradient(135deg, #66D3A5 0%, #35B58A 100%)",
    text: "#0E2A23",
    glow: "0 8px 24px rgba(53, 181, 138, 0.22)",
    ring: "",
  };
};

const getTableDimensions = (shape) => {
  if (shape === "large") return { width: 82, height: 50, borderRadius: 18 };
  if (shape === "medium") return { width: 62, height: 44, borderRadius: 16 };
  return { width: 48, height: 48, borderRadius: 999 };
};

const getZoneLabel = (zone) => {
  if (zone === "waterfront") return "Fontänen";
  return "Övriga platser";
};

const TableIcon = ({ table, selected, recommended, booked, onClick }) => {
  const { seats, shape, id, zone } = table;
  const { width, height, borderRadius } = getTableDimensions(shape);
  const colors = getZoneColors(zone, selected);

  return (
    <div
      className={`absolute ${booked ? "cursor-not-allowed" : "cursor-pointer"}`}
      style={{
        left: `${table.x}%`,
        top: `${table.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
      data-testid={`table-${id}`}
    >
      <motion.div
        whileHover={booked ? {} : { scale: 1.06, y: -4 }}
        whileTap={booked ? {} : { scale: 0.97 }}
        animate={{
          scale: booked ? 1 : selected ? 1.07 : recommended ? 1.03 : 1,
          opacity: booked ? 0.28 : recommended || selected ? 1 : 0.8,
          y: 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div
          className={`relative flex flex-col items-center justify-center border backdrop-blur-sm ${
            selected
              ? colors.ring
              : recommended
              ? "ring-2 ring-white/30 border-white/40"
              : "border-white/20"
          }`}
          style={{
            width,
            height,
            borderRadius,
            background: colors.background,
            boxShadow: colors.glow,
          }}
        >
          {booked && (
            <div className="absolute -top-2 rounded-full bg-red-500/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              Bokad
            </div>
          )}

          <Users
            size={seats <= 2 ? 14 : seats === 4 ? 16 : 18}
            style={{ color: colors.text }}
            className="mb-0.5"
          />
          <span className="text-xs font-extrabold" style={{ color: colors.text }}>
            {seats}p
          </span>
        </div>

        <div className={`text-center mt-2 text-xs font-bold ${selected ? "text-[#FF66A3]" : "text-white/85"}`}>
          Bord {id}
        </div>
      </motion.div>
    </div>
  );
};

const BookingModal = ({ isOpen, onClose }) => {
  const [bookedTableIds, setBookedTableIds] = useState([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    guests: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate || !selectedTime) {
        setBookedTableIds([]);
        return;
      }

      setIsLoadingAvailability(true);

      try {
      const response = await fetch(
  `/api/availability?date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}`
);

        const data = await response.json();

        if (response.ok) {
          setBookedTableIds(data.bookedTableIds || []);
        } else {
          setBookedTableIds([]);
        }
      } catch (error) {
        setBookedTableIds([]);
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    if (selectedTable && bookedTableIds.includes(selectedTable.id)) {
      setSelectedTable(null);
    }
  }, [bookedTableIds, selectedTable]);

  const timeSlots = ["11:00", "12:00", "13:00", "14:00", "15:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

  const getRecommendedTableIds = (guestCount) => {
    if (!guestCount || guestCount < 1) return [];

    const exact = tables.filter((table) => table.seats === guestCount);

    if (exact.length > 0) {
      return exact.map((table) => table.id);
    }

    const nextBestSize = Math.min(
      ...tables
        .filter((table) => table.seats >= guestCount)
        .map((table) => table.seats)
    );

    if (Number.isFinite(nextBestSize)) {
      return tables
        .filter((table) => table.seats === nextBestSize)
        .map((table) => table.id);
    }

    return [];
  };

  const recommendedTableIds = getRecommendedTableIds(formData.guests);
  const count2 = tables.filter((t) => t.seats === 2).length;
  const count4 = tables.filter((t) => t.seats === 4).length;
  const count6 = tables.filter((t) => t.seats === 6).length;

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);

    if (formData.guests > table.seats) {
      setFormData((prev) => ({
        ...prev,
        guests: table.seats,
      }));
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedTable && selectedDate && selectedTime) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  table: `Bord ${selectedTable.id}`,
  table_id: selectedTable.id,
  table_seats: selectedTable.seats,
  table_zone: selectedTable.zone,
  date: selectedDate,
  time: selectedTime,
  name: formData.name,
  phone: formData.phone,
  email: formData.email,
  guests: formData.guests,
}),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { detail: text };
      }

      if (response.ok) {
        setBookingComplete(true);
        setStep(3);
      } else {
        setError(data.detail || data.message || `Något gick fel. (HTTP ${response.status})`);
      }
    } catch (err) {
      setError("Kunde inte ansluta till servern. Försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedTable(null);
    setSelectedDate("");
    setSelectedTime("");
    setFormData({ name: "", phone: "", email: "", guests: 1 });
    setBookingComplete(false);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        data-testid="booking-modal-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-[#141412] via-[#1B1B18] to-[#252521] rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#FF66A3]/15"
          onClick={(e) => e.stopPropagation()}
          data-testid="booking-modal"
        >
          <div className="sticky top-0 bg-gradient-to-r from-[#141412]/95 to-[#252521]/95 backdrop-blur-md p-6 border-b border-white/10 flex items-center justify-between z-10">
            <div>
              <h2 className="font-syne text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">🌴</span>
                Boka Bord
              </h2>
              <p className="font-dm text-white/60 text-sm mt-1">
                {step === 1 && "Välj ditt favoritbord i vår tropiska oas"}
                {step === 2 && "Berätta vem du är"}
                {step === 3 && "Vi ses snart!"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              data-testid="close-booking-modal"
            >
              <X size={24} className="text-white/60" />
            </button>
          </div>

          <div className="px-6 py-4 bg-black/20">
            <div className="flex items-center justify-center gap-4">
              {[{ num: 1, label: "Välj bord" }, { num: 2, label: "Dina uppgifter" }, { num: 3, label: "Bekräftat" }].map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        step >= s.num
                          ? "bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white shadow-lg"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {step > s.num ? <Check size={18} /> : s.num}
                    </div>
                    <span className={`text-xs mt-1 ${step >= s.num ? "text-white" : "text-white/40"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      className={`w-20 h-1 mx-3 rounded ${
                        step > s.num ? "bg-gradient-to-r from-[#FF66A3] to-[#FFA500]" : "bg-white/10"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block font-dm font-bold text-white mb-2">
                      <Calendar size={18} className="inline mr-2 text-[#FFA500]" />
                      Välj datum
                    </label>
                    <input
                      type="date"
                      min={getMinDate()}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/15 text-white focus:border-[#FF66A3] outline-none font-dm"
                      data-testid="booking-date-input"
                    />
                  </div>

                  <div>
                    <label className="block font-dm font-bold text-white mb-2">
                      <Clock size={18} className="inline mr-2 text-[#32CD32]" />
                      Välj tid
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 rounded-xl text-sm font-dm font-medium transition-all ${
                            selectedTime === time
                              ? "bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white shadow-lg"
                              : "bg-white/10 text-white hover:bg-white/15"
                          }`}
                          data-testid={`time-slot-${time}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className="mb-6">
                  <label className="block font-dm font-bold text-white mb-2">
                    <Users size={18} className="inline mr-2 text-[#59E3D8]" />
                    Antal gäster
                  </label>

                  <select
                    value={formData.guests}
                    onChange={(e) =>
                      setFormData({ ...formData, guests: parseInt(e.target.value, 10) })
                    }
                    className="w-full md:w-64 p-4 rounded-xl bg-white/10 border border-white/20 text-white focus:border-[#FF66A3] outline-none font-dm"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num} className="bg-[#1A1A18]">
                        {num} {num === 1 ? "gäst" : "gäster"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Floor Plan */}
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <h3 className="font-syne text-lg font-bold text-white flex items-center gap-2">
                      <Palmtree size={20} className="text-[#32CD32]" />
                      Välj bord vid Fontänen
                    </h3>

                    {isLoadingAvailability && (
                      <div className="text-xs text-white/50 font-dm">Laddar bokningar...</div>
                    )}
                  </div>

                  <div
                    className="relative rounded-[28px] overflow-hidden border border-white/10 shadow-2xl"
                    style={{
                      background: "linear-gradient(180deg, #122019 0%, #183327 42%, #26301f 100%)",
                      minHeight: "430px",
                    }}
                  >
                    {/* Water strip */}
                    <div className="absolute top-0 left-0 right-16 h-16 bg-gradient-to-r from-[#2F8CFF]/70 via-[#38BDF8]/60 to-[#1D4ED8]/60">
                      <div className="absolute inset-0 opacity-60">
                        <div
                          className="absolute top-2 left-1/4 w-8 h-8 border border-white/20 rounded-full animate-ping"
                          style={{ animationDuration: "3.5s" }}
                        />
                        <div
                          className="absolute top-3 left-1/2 w-5 h-5 border border-white/15 rounded-full animate-ping"
                          style={{ animationDuration: "4.5s", animationDelay: "1s" }}
                        />
                        <div
                          className="absolute top-2 left-3/4 w-6 h-6 border border-white/20 rounded-full animate-ping"
                          style={{ animationDuration: "4s", animationDelay: "0.5s" }}
                        />
                      </div>

                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        <Waves size={14} />
                        Fontänen
                      </div>
                    </div>

                    {/* Kitchen/entrance bar */}
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-amber-900/50 to-transparent flex flex-col items-center justify-center gap-7">
                      <div className="text-center">
                        <ChefHat size={20} className="text-orange-300 mx-auto mb-1" />
                        <span className="text-orange-200 text-[9px] font-bold tracking-wide">KÖK</span>
                      </div>

                      <div className="text-center">
                        <span className="text-white text-base">🚪</span>
                        <p className="text-white/70 text-[9px] font-bold tracking-wide">ENTRÉ</p>
                      </div>
                    </div>

                    {/* Decorations */}
                    <div className="absolute top-[76px] left-4 text-lg">🌴</div>
                    <div className="absolute bottom-8 left-4 text-base">🌿</div>

                    {/* Soft lights */}
                    <div className="absolute top-16 left-8 right-24 flex justify-between">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-yellow-300/90 animate-pulse shadow-[0_0_8px_rgba(255,220,120,0.8)]"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>

                    {/* Walkways */}
                    <div className="absolute left-6 right-20 top-[28%] h-px bg-white/10" />
                    <div className="absolute left-6 right-20 top-[57%] h-px bg-white/10" />

                    {/* Tables */}
                    <div className="absolute inset-0 pt-8 pb-4 pl-6 pr-20">
                      {tables.map((table) => (
                        <TableIcon
                          key={table.id}
                          table={table}
                          selected={selectedTable?.id === table.id}
                          recommended={recommendedTableIds.includes(table.id)}
                          booked={bookedTableIds.includes(table.id)}
                          onClick={() => {
                            if (!bookedTableIds.includes(table.id)) {
                              handleTableSelect(table);
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-4 mt-5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-500/90" />
                      <span className="font-dm text-sm text-white/60">Bokad</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gradient-to-r from-[#FF66A3] to-[#FFA500]" />
                      <span className="font-dm text-sm text-white/60">Valt bord</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-6 mt-2 text-white/50 text-xs font-dm">
                    <span>{count6} st 6-platser</span>
                    <span>{count4} st 4-platser</span>
                    <span>{count2} st 2-platser</span>
                  </div>
                </div>

                {selectedTable && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-[#FF66A3]/15 to-[#FFA500]/15 p-4 rounded-2xl mb-6 border border-[#FF66A3]/20"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <p className="font-dm text-white">
                        <span className="text-[#FF66A3] font-bold">Ditt val:</span> Bord {selectedTable.id} ({selectedTable.seats} platser)
                        <span className="text-[#87CEEB]"> • {getZoneLabel(selectedTable.zone)}</span>
                        {selectedDate && <span className="text-[#FFA500]"> • {selectedDate}</span>}
                        {selectedTime && <span className="text-[#32CD32]"> • kl {selectedTime}</span>}
                      </p>

                      <p className="text-sm text-white/65">
                        {selectedTable.zone === "waterfront"
                          ? "Närmast fontänen."
                          : "Skön plats i serveringen."}
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-end">
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    disabled={!selectedTable || !selectedDate || !selectedTime}
                    className={`flex items-center gap-2 px-8 py-4 rounded-full font-dm font-bold transition-all ${
                      selectedTable && selectedDate && selectedTime
                        ? "bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white hover:shadow-lg"
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                    }`}
                    whileHover={selectedTable && selectedDate && selectedTime ? { scale: 1.05 } : {}}
                    data-testid="booking-next-button"
                  >
                    Nästa steg <ArrowRight size={18} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="bg-gradient-to-r from-[#FF66A3]/15 to-[#FFA500]/15 p-4 rounded-2xl mb-6 border border-[#FF66A3]/20">
                  <p className="font-dm text-white">
                    🪑 <strong>Bord {selectedTable.id}</strong> ({selectedTable.seats} platser)
                    <span className="text-[#87CEEB]"> • {getZoneLabel(selectedTable.zone)}</span> •
                    <span className="text-[#FFA500]"> {selectedDate}</span> • <span className="text-[#32CD32]"> kl {selectedTime}</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block font-dm font-bold text-white mb-2">Namn *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#FF66A3] outline-none font-dm"
                      placeholder="Ditt namn"
                      data-testid="booking-name-input"
                    />
                  </div>

                  <div>
                    <label className="block font-dm font-bold text-white mb-2">Telefonnummer *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#FF66A3] outline-none font-dm"
                      placeholder="07XX-XXX XXX"
                      data-testid="booking-phone-input"
                    />
                  </div>

                  <div>
                    <label className="block font-dm font-bold text-white mb-2">E-post (valfritt)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#FF66A3] outline-none font-dm"
                      placeholder="din@email.se"
                      data-testid="booking-email-input"
                    />
                  </div>

                  <div>
                    <label className="block font-dm font-bold text-white mb-2">Antal gäster</label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value, 10) })}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white focus:border-[#FF66A3] outline-none font-dm"
                      data-testid="booking-guests-input"
                    >
                      {[...Array(selectedTable.seats)].map((_, i) => (
                        <option key={i + 1} value={i + 1} className="bg-[#1A1A18]">
                          {i + 1} {i === 0 ? "gäst" : "gäster"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div className="bg-red-500/20 text-red-300 p-4 rounded-xl font-dm border border-red-500/30">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-between gap-4 pt-4">
                    <motion.button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-2 px-6 py-4 rounded-full font-dm font-bold border-2 border-white/20 text-white hover:bg-white/10"
                      data-testid="booking-back-button"
                    >
                      <ArrowLeft size={18} />
                      Tillbaka
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex items-center gap-2 px-8 py-4 rounded-full font-dm font-bold transition-all ${
                        isSubmitting
                          ? "bg-white/20 text-white/50 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white hover:shadow-lg"
                      }`}
                      data-testid="booking-submit-button"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Bokar...
                        </>
                      ) : (
                        <>
                          Bekräfta bokning <Check size={18} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <motion.div
                  className="text-6xl mb-6"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  🎉
                </motion.div>

                <h3 className="font-syne text-3xl font-bold text-white mb-4">Tack för din bokning!</h3>
                <p className="font-dm text-white/70 text-lg mb-8 max-w-md mx-auto">
                  Vi ser fram emot att välkomna dig till Carib Hut.
                </p>

                <div className="bg-white/10 p-6 rounded-2xl max-w-sm mx-auto mb-8 border border-white/20">
                  <div className="text-4xl mb-4">🌴</div>
                  <p className="font-dm text-white">
                    <strong className="text-[#FF66A3]">Bord {selectedTable?.id}</strong> ({selectedTable?.seats} platser)
                    <span className="text-[#87CEEB]"> • {selectedTable ? getZoneLabel(selectedTable.zone) : ""}</span>
                    <br />
                    <span className="text-[#FFA500]">{selectedDate}</span> kl{" "}
                    <span className="text-[#32CD32]">{selectedTime}</span>
                    <br />
                    {formData.guests} {formData.guests === 1 ? "gäst" : "gäster"}
                    <br />
                    <span className="text-white/60">
                      {formData.name} • {formData.phone}
                    </span>
                  </p>
                </div>

                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="px-8 py-4 bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white rounded-full font-dm font-bold"
                  whileHover={{ scale: 1.05 }}
                  data-testid="booking-close-button"
                >
                  Stäng
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
