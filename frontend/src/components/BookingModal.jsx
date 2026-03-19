import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  Calendar,
  Clock,
  Check,
  ArrowRight,
  ArrowLeft,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";

const MAX_RESTAURANT_CAPACITY = 60;
const MAX_ONLINE_BOOKING_SIZE = 12;

const seatingAreas = [
  {
    id: "waterfront",
    title: "Vid fontänen",
    description: "För er som vill sitta nära vattnet och stämningen.",
    emoji: "💦",
  },
  {
    id: "main",
    title: "Mitt i serveringen",
    description: "Bra puls, nära bar och musik.",
    emoji: "🌴",
  },
  {
    id: "terrace",
    title: "Lugnare sittning",
    description: "Lite mer avskilt och avslappnat.",
    emoji: "🍽️",
  },
];

const timeSlots = [
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

const getAreaBadgeClasses = (areaId, selected) => {
  if (selected) {
    return "border-[#FF66A3] bg-gradient-to-r from-[#FF66A3]/20 to-[#FFA500]/20 shadow-[0_10px_30px_rgba(255,102,163,0.18)]";
  }

  if (areaId === "waterfront") {
    return "border-[#F6D28B]/20 bg-[#F6D28B]/5 hover:bg-[#F6D28B]/10";
  }

  if (areaId === "main") {
    return "border-[#59E3D8]/20 bg-[#59E3D8]/5 hover:bg-[#59E3D8]/10";
  }

  return "border-[#66D3A5]/20 bg-[#66D3A5]/5 hover:bg-[#66D3A5]/10";
};

const getAreaPillClasses = (areaId) => {
  if (areaId === "waterfront") {
    return "bg-[#F6D28B]/20 text-[#F6D28B] border border-[#F6D28B]/30";
  }

  if (areaId === "main") {
    return "bg-[#59E3D8]/20 text-[#59E3D8] border border-[#59E3D8]/30";
  }

  return "bg-[#66D3A5]/20 text-[#66D3A5] border border-[#66D3A5]/30";
};

const getAreaLabel = (areaId) => {
  if (areaId === "waterfront") return "Vid fontänen";
  if (areaId === "main") return "Mitt i serveringen";
  if (areaId === "terrace") return "Lugnare sittning";
  return areaId || "-";
};

const BookingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    guests: 2,
    comment: "",
  });

  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [remainingSeats, setRemainingSeats] = useState(MAX_RESTAURANT_CAPACITY);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [error, setError] = useState("");

  const isAvailabilityReady = Boolean(selectedDate && selectedTime);
  const isFull = isAvailabilityReady && remainingSeats <= 0;

  const maxGuestsAllowed = useMemo(() => {
    if (!isAvailabilityReady) return Math.min(MAX_ONLINE_BOOKING_SIZE, MAX_RESTAURANT_CAPACITY);
    return Math.max(0, Math.min(MAX_ONLINE_BOOKING_SIZE, remainingSeats));
  }, [isAvailabilityReady, remainingSeats]);

  const guestOptions = useMemo(() => {
    const max = Math.max(0, maxGuestsAllowed);
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [maxGuestsAllowed]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate || !selectedTime) {
        setRemainingSeats(MAX_RESTAURANT_CAPACITY);
        setAvailabilityError("");
        return;
      }

      setIsLoadingAvailability(true);
      setAvailabilityError("");

      try {
        const response = await fetch(
          `/api/availability?date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Kunde inte hämta tillgänglighet");
        }

        // Flexibel hantering så modalen funkar även om du ändrar API-svaret senare
        const remaining =
          typeof data.remainingSeats === "number"
            ? data.remainingSeats
            : typeof data.availableSeats === "number"
            ? data.availableSeats
            : typeof data.seatsLeft === "number"
            ? data.seatsLeft
            : typeof data.totalBookedGuests === "number"
            ? Math.max(0, MAX_RESTAURANT_CAPACITY - data.totalBookedGuests)
            : typeof data.bookedGuests === "number"
            ? Math.max(0, MAX_RESTAURANT_CAPACITY - data.bookedGuests)
            : MAX_RESTAURANT_CAPACITY;

        setRemainingSeats(Math.max(0, remaining));
      } catch (err) {
        setRemainingSeats(MAX_RESTAURANT_CAPACITY);
        setAvailabilityError("Kunde inte kontrollera tillgänglighet just nu.");
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    if (maxGuestsAllowed > 0 && formData.guests > maxGuestsAllowed) {
      setFormData((prev) => ({
        ...prev,
        guests: maxGuestsAllowed,
      }));
    }

    if (isFull) {
      setFormData((prev) => ({
        ...prev,
        guests: 1,
      }));
    }
  }, [maxGuestsAllowed, formData.guests, isFull]);

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleNext = () => {
    if (!selectedDate || !selectedTime || !selectedArea) return;
    if (isFull) return;
    if (!formData.guests || formData.guests < 1) return;

    setStep(2);
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
          area: selectedArea,
          area_label: getAreaLabel(selectedArea),
          date: selectedDate,
          time: selectedTime,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          guests: formData.guests,
          comment: formData.comment,
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
    setSelectedDate("");
    setSelectedTime("");
    setSelectedArea("");
    setFormData({
      name: "",
      phone: "",
      email: "",
      guests: 2,
      comment: "",
    });
    setRemainingSeats(MAX_RESTAURANT_CAPACITY);
    setAvailabilityError("");
    setIsSubmitting(false);
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
        className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        data-testid="booking-modal-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="bg-gradient-to-br from-[#141412] via-[#1B1B18] to-[#252521] rounded-none md:rounded-3xl w-full h-[100dvh] md:h-auto md:max-w-4xl md:max-h-[90vh] overflow-y-auto shadow-2xl border-0 md:border border-[#FF66A3]/15"
          onClick={(e) => e.stopPropagation()}
          data-testid="booking-modal"
        >
          <div className="sticky top-0 bg-gradient-to-r from-[#141412]/95 to-[#252521]/95 backdrop-blur-md px-4 py-4 md:p-6 border-b border-white/10 flex items-center justify-between z-10">
            <div>
              <h2 className="font-syne text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-2xl md:text-3xl">🌴</span>
                Boka Bord
              </h2>
              <p className="font-dm text-white/60 text-xs md:text-sm mt-1">
                {step === 1 && "Välj datum, tid, antal gäster och område"}
                {step === 2 && "Fyll i dina uppgifter"}
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

          <div className="px-4 py-4 md:px-6 md:py-4 bg-black/20">
            <div className="flex items-center justify-center gap-2 md:gap-4">
              {[
                { num: 1, label: "Bokning" },
                { num: 2, label: "Dina uppgifter" },
                { num: 3, label: "Bekräftat" },
              ].map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        step >= s.num
                          ? "bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white shadow-lg"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {step > s.num ? <Check size={18} /> : s.num}
                    </div>
                    <span className={`text-[10px] md:text-xs mt-1 ${step >= s.num ? "text-white" : "text-white/40"}`}>
                      {s.label}
                    </span>
                  </div>

                  {i < 2 && (
                    <div
                      className={`w-10 md:w-20 h-1 mx-2 md:mx-3 rounded ${
                        step > s.num ? "bg-gradient-to-r from-[#FF66A3] to-[#FFA500]" : "bg-white/10"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
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
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`p-2.5 rounded-xl text-sm font-dm font-medium transition-all ${
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

                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 mb-6">
                  <div>
                    <label className="block font-dm font-bold text-white mb-2">
                      <Users size={18} className="inline mr-2 text-[#59E3D8]" />
                      Antal gäster
                    </label>

                    <select
                      value={isFull ? "" : formData.guests}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guests: parseInt(e.target.value, 10),
                        })
                      }
                      disabled={!isAvailabilityReady || isFull || guestOptions.length === 0}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white focus:border-[#FF66A3] outline-none font-dm disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="booking-guests-input"
                    >
                      {!isAvailabilityReady && (
                        <option value="" className="bg-[#1A1A18]">
                          Välj datum & tid först
                        </option>
                      )}

                      {isAvailabilityReady && !isFull && guestOptions.map((num) => (
                        <option key={num} value={num} className="bg-[#1A1A18]">
                          {num} {num === 1 ? "gäst" : "gäster"}
                        </option>
                      ))}
                    </select>

                    <div className="mt-3 space-y-2">
                      {isLoadingAvailability && (
                        <div className="text-xs text-white/50 font-dm">
                          Kollar lediga platser...
                        </div>
                      )}

                      {!isLoadingAvailability && isAvailabilityReady && !isFull && (
                        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                          <p className="font-dm text-sm text-white">
                            <span className="text-[#32CD32] font-bold">{remainingSeats}</span> platser kvar online denna tid.
                          </p>
                        </div>
                      )}

                      {!isLoadingAvailability && isFull && (
                        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                          <p className="font-dm text-sm md:text-base text-red-200 leading-relaxed">
                            <strong>Det är tyvärr fullt online denna tid.</strong>
                            <br />
                            Vänligen ring oss istället för att boka bord.
                          </p>
                        </div>
                      )}

                      {!isLoadingAvailability && availabilityError && (
                        <div className="rounded-xl border border-yellow-500/25 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100 font-dm">
                          {availabilityError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-dm font-bold text-white mb-3">
                      <MapPin size={18} className="inline mr-2 text-[#87CEEB]" />
                      Önskat område
                    </label>

                    <div className="grid grid-cols-1 gap-3">
                      {seatingAreas.map((area) => {
                        const selected = selectedArea === area.id;

                        return (
                          <button
                            key={area.id}
                            type="button"
                            onClick={() => setSelectedArea(area.id)}
                            className={`w-full rounded-2xl border p-4 text-left transition-all ${getAreaBadgeClasses(area.id, selected)}`}
                            data-testid={`area-option-${area.id}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xl">{area.emoji}</span>
                                  <span className="text-white font-bold text-base">{area.title}</span>
                                  <span className={`text-[11px] px-2 py-1 rounded-full font-semibold ${getAreaPillClasses(area.id)}`}>
                                    Önskemål
                                  </span>
                                  {selected && (
                                    <span className="text-[11px] px-2 py-1 rounded-full font-semibold bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white">
                                      Vald
                                    </span>
                                  )}
                                </div>

                                <p className="mt-3 text-sm text-white/75 font-dm leading-relaxed">
                                  {area.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-white/75 text-sm font-dm leading-relaxed">
                        Ni väljer önskat område — vi placerar er på bästa möjliga bord utifrån tillgänglighet och sällskapets storlek.
                      </p>
                    </div>
                  </div>
                </div>

                {(selectedDate || selectedTime || selectedArea) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-[#FF66A3]/15 to-[#FFA500]/15 p-4 rounded-2xl mb-6 border border-[#FF66A3]/20"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <p className="font-dm text-white text-sm md:text-base leading-relaxed">
                        <span className="text-[#FF66A3] font-bold">Din bokning:</span>
                        {selectedDate && <span className="text-[#FFA500]"> • {selectedDate}</span>}
                        {selectedTime && <span className="text-[#32CD32]"> • kl {selectedTime}</span>}
                        {!isFull && formData.guests ? <span className="text-[#59E3D8]"> • {formData.guests} {formData.guests === 1 ? "gäst" : "gäster"}</span> : null}
                        {selectedArea && <span className="text-[#87CEEB]"> • {getAreaLabel(selectedArea)}</span>}
                      </p>

                      <p className="text-sm text-white/65">
                        Området är ett önskemål, inte ett specifikt bord.
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-end">
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    disabled={!selectedDate || !selectedTime || !selectedArea || isFull || !formData.guests}
                    className={`flex items-center gap-2 px-6 md:px-8 py-4 rounded-full font-dm font-bold transition-all w-full md:w-auto justify-center ${
                      selectedDate && selectedTime && selectedArea && !isFull && formData.guests
                        ? "bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white hover:shadow-lg"
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                    }`}
                    whileHover={selectedDate && selectedTime && selectedArea && !isFull && formData.guests ? { scale: 1.02 } : {}}
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
                  <p className="font-dm text-white text-sm md:text-base leading-relaxed">
                    <strong>{formData.guests} {formData.guests === 1 ? "gäst" : "gäster"}</strong>
                    <span className="text-[#87CEEB]"> • {getAreaLabel(selectedArea)}</span> •
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
                    <label className="block font-dm font-bold text-white mb-2">
                      <Phone size={16} className="inline mr-2 text-[#32CD32]" />
                      Telefonnummer *
                    </label>
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
                    <label className="block font-dm font-bold text-white mb-2">
                      <MessageSquare size={16} className="inline mr-2 text-[#59E3D8]" />
                      Kommentar / önskemål
                    </label>
                    <textarea
                      rows={4}
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#FF66A3] outline-none font-dm resize-none"
                      placeholder="Ex. barnstol, allergi, födelsedag eller annat önskemål"
                      data-testid="booking-comment-input"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/20 text-red-300 p-4 rounded-xl font-dm border border-red-500/30">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col-reverse md:flex-row justify-between gap-4 pt-4">
                    <motion.button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center justify-center gap-2 px-6 py-4 rounded-full font-dm font-bold border-2 border-white/20 text-white hover:bg-white/10 w-full md:w-auto"
                      data-testid="booking-back-button"
                    >
                      <ArrowLeft size={18} />
                      Tillbaka
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full font-dm font-bold transition-all w-full md:w-auto ${
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
                          Skicka bokning <Check size={18} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 md:py-12">
                <motion.div
                  className="text-6xl mb-6"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  🎉
                </motion.div>

                <h3 className="font-syne text-2xl md:text-3xl font-bold text-white mb-4">Tack för din bokning!</h3>
                <p className="font-dm text-white/70 text-base md:text-lg mb-8 max-w-md mx-auto">
                  Vi ser fram emot att välkomna dig till Carib Hut.
                </p>

                <div className="bg-white/10 p-6 rounded-2xl max-w-sm mx-auto mb-8 border border-white/20">
                  <div className="text-4xl mb-4">🌴</div>
                  <p className="font-dm text-white leading-relaxed">
                    <strong className="text-[#FF66A3]">{formData.guests} {formData.guests === 1 ? "gäst" : "gäster"}</strong>
                    <span className="text-[#87CEEB]"> • {getAreaLabel(selectedArea)}</span>
                    <br />
                    <span className="text-[#FFA500]">{selectedDate}</span> kl{" "}
                    <span className="text-[#32CD32]">{selectedTime}</span>
                    <br />
                    <span className="text-white/60">
                      {formData.name} • {formData.phone}
                    </span>
                  </p>
                </div>

                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="px-8 py-4 bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white rounded-full font-dm font-bold w-full sm:w-auto"
                  whileHover={{ scale: 1.03 }}
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
