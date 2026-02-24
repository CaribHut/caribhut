import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Calendar, Clock, Check, ArrowRight, ArrowLeft } from 'lucide-react';

const tables = [
  { id: 1, seats: 6, x: 10, y: 15 },
  { id: 2, seats: 6, x: 35, y: 15 },
  { id: 3, seats: 6, x: 60, y: 15 },
  { id: 4, seats: 6, x: 10, y: 50 },
  { id: 5, seats: 6, x: 35, y: 50 },
  { id: 6, seats: 4, x: 65, y: 50 },
  { id: 7, seats: 4, x: 85, y: 50 },
  { id: 8, seats: 2, x: 70, y: 80 },
  { id: 9, seats: 2, x: 85, y: 80 },
];

const TableIcon = ({ seats, selected, onClick, id }) => {
  const getTableSize = () => {
    if (seats === 6) return { width: 80, height: 50 };
    if (seats === 4) return { width: 60, height: 40 };
    return { width: 45, height: 35 };
  };

  const { width, height } = getTableSize();
  
  const getTableColor = () => {
    if (selected) return '#008080';
    return '#1A1A18';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer"
      style={{ width, height }}
      data-testid={`table-${id}`}
    >
      <div
        className={`w-full h-full rounded-lg flex flex-col items-center justify-center transition-all ${
          selected ? 'shadow-lg shadow-[#008080]/30' : 'hover:shadow-md'
        }`}
        style={{ backgroundColor: getTableColor() }}
      >
        <Users size={seats === 2 ? 14 : 18} className="text-white mb-1" />
        <span className="text-white text-xs font-bold">{seats}p</span>
      </div>
      <p className="text-center text-xs text-[#5F5F58] mt-1">Bord {id}</p>
    </motion.div>
  );
};

const BookingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', guests: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = [
    '11:00', '12:00', '13:00', '14:00', '15:00', 
    '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };

  const handleNext = () => {
    if (step === 1 && selectedTable && selectedDate && selectedTime) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_id: selectedTable.id,
          table_seats: selectedTable.seats,
          date: selectedDate,
          time: selectedTime,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          guests: formData.guests,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBookingComplete(true);
        setStep(3);
      } else {
        setError(data.detail || 'Något gick fel. Försök igen.');
      }
    } catch (err) {
      setError('Kunde inte ansluta till servern. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedTable(null);
    setSelectedDate('');
    setSelectedTime('');
    setFormData({ name: '', phone: '', email: '', guests: 1 });
    setBookingComplete(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        data-testid="booking-modal-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#FDFCF8] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          data-testid="booking-modal"
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#FDFCF8] p-6 border-b border-stone-200 flex items-center justify-between z-10">
            <div>
              <h2 className="font-syne text-2xl font-bold text-[#1A1A18]">Boka Bord</h2>
              <p className="font-dm text-[#5F5F58] text-sm">
                {step === 1 && 'Välj bord, datum och tid'}
                {step === 2 && 'Fyll i dina uppgifter'}
                {step === 3 && 'Bokning bekräftad!'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              data-testid="close-booking-modal"
            >
              <X size={24} className="text-[#5F5F58]" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="px-6 py-4 bg-stone-50">
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      step >= s
                        ? 'bg-[#008080] text-white'
                        : 'bg-stone-200 text-[#5F5F58]'
                    }`}
                  >
                    {step > s ? <Check size={16} /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 rounded ${
                        step > s ? 'bg-[#008080]' : 'bg-stone-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Table Selection */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Date and Time Selection */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block font-dm font-bold text-[#1A1A18] mb-2">
                      <Calendar size={18} className="inline mr-2" />
                      Välj datum
                    </label>
                    <input
                      type="date"
                      min={getMinDate()}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-4 rounded-xl border border-stone-200 focus:border-[#008080] focus:ring-2 focus:ring-[#008080]/20 outline-none font-dm"
                      data-testid="booking-date-input"
                    />
                  </div>
                  <div>
                    <label className="block font-dm font-bold text-[#1A1A18] mb-2">
                      <Clock size={18} className="inline mr-2" />
                      Välj tid
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 rounded-lg text-sm font-dm font-medium transition-all ${
                            selectedTime === time
                              ? 'bg-[#008080] text-white'
                              : 'bg-stone-100 text-[#1A1A18] hover:bg-stone-200'
                          }`}
                          data-testid={`time-slot-${time}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table Map */}
                <div className="mb-6">
                  <h3 className="font-syne text-lg font-bold text-[#1A1A18] mb-4">
                    Välj bord (40 platser totalt)
                  </h3>
                  <div className="bg-stone-100 rounded-2xl p-6 relative" style={{ minHeight: '350px' }}>
                    {/* Restaurant layout indicator */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#FF66A3] text-white px-4 py-1 rounded-full text-xs font-dm">
                      Entré
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#FFA500] text-white px-4 py-1 rounded-full text-xs font-dm">
                      Kök
                    </div>
                    
                    {/* Tables */}
                    <div className="pt-8 pb-8">
                      {/* Row 1 - 6-seat tables */}
                      <div className="flex justify-center gap-8 mb-8">
                        {tables.filter(t => t.id <= 3).map((table) => (
                          <TableIcon
                            key={table.id}
                            id={table.id}
                            seats={table.seats}
                            selected={selectedTable?.id === table.id}
                            onClick={() => handleTableSelect(table)}
                          />
                        ))}
                      </div>
                      
                      {/* Row 2 - 6-seat and 4-seat tables */}
                      <div className="flex justify-center gap-8 mb-8">
                        {tables.filter(t => t.id >= 4 && t.id <= 7).map((table) => (
                          <TableIcon
                            key={table.id}
                            id={table.id}
                            seats={table.seats}
                            selected={selectedTable?.id === table.id}
                            onClick={() => handleTableSelect(table)}
                          />
                        ))}
                      </div>
                      
                      {/* Row 3 - 2-seat tables */}
                      <div className="flex justify-center gap-8">
                        {tables.filter(t => t.id >= 8).map((table) => (
                          <TableIcon
                            key={table.id}
                            id={table.id}
                            seats={table.seats}
                            selected={selectedTable?.id === table.id}
                            onClick={() => handleTableSelect(table)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#1A1A18] rounded"></div>
                      <span className="font-dm text-sm text-[#5F5F58]">Ledigt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#008080] rounded"></div>
                      <span className="font-dm text-sm text-[#5F5F58]">Valt</span>
                    </div>
                  </div>
                </div>

                {/* Selected info */}
                {selectedTable && (
                  <div className="bg-[#008080]/10 p-4 rounded-xl mb-6">
                    <p className="font-dm text-[#008080]">
                      <strong>Valt:</strong> Bord {selectedTable.id} ({selectedTable.seats} platser)
                      {selectedDate && `, ${selectedDate}`}
                      {selectedTime && ` kl ${selectedTime}`}
                    </p>
                  </div>
                )}

                {/* Next button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={!selectedTable || !selectedDate || !selectedTime}
                    className={`flex items-center gap-2 px-8 py-4 rounded-full font-dm font-bold transition-all ${
                      selectedTable && selectedDate && selectedTime
                        ? 'bg-[#008080] text-white hover:bg-[#006666]'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                    data-testid="booking-next-button"
                  >
                    Nästa
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact Form */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="bg-[#008080]/10 p-4 rounded-xl mb-6">
                  <p className="font-dm text-[#008080]">
                    <strong>Din bokning:</strong> Bord {selectedTable.id} ({selectedTable.seats} platser), 
                    {selectedDate} kl {selectedTime}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block font-dm font-bold text-[#1A1A18] mb-2">
                      Namn *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-4 rounded-xl border border-stone-200 focus:border-[#008080] focus:ring-2 focus:ring-[#008080]/20 outline-none font-dm"
                      placeholder="Ditt namn"
                      data-testid="booking-name-input"
                    />
                  </div>

                  <div>
                    <label className="block font-dm font-bold text-[#1A1A18] mb-2">
                      Telefonnummer *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-4 rounded-xl border border-stone-200 focus:border-[#008080] focus:ring-2 focus:ring-[#008080]/20 outline-none font-dm"
                      placeholder="07XX-XXX XXX"
                      data-testid="booking-phone-input"
                    />
                  </div>

                  <div>
                    <label className="block font-dm font-bold text-[#1A1A18] mb-2">
                      E-post (valfritt)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-4 rounded-xl border border-stone-200 focus:border-[#008080] focus:ring-2 focus:ring-[#008080]/20 outline-none font-dm"
                      placeholder="din@email.se"
                      data-testid="booking-email-input"
                    />
                  </div>

                  <div>
                    <label className="block font-dm font-bold text-[#1A1A18] mb-2">
                      Antal gäster
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                      className="w-full p-4 rounded-xl border border-stone-200 focus:border-[#008080] focus:ring-2 focus:ring-[#008080]/20 outline-none font-dm"
                      data-testid="booking-guests-input"
                    >
                      {[...Array(selectedTable.seats)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'gäst' : 'gäster'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-xl font-dm">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-2 px-6 py-4 rounded-full font-dm font-bold border-2 border-[#1A1A18] text-[#1A1A18] hover:bg-[#1A1A18] hover:text-white transition-all"
                      data-testid="booking-back-button"
                    >
                      <ArrowLeft size={18} />
                      Tillbaka
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex items-center gap-2 px-8 py-4 rounded-full font-dm font-bold transition-all ${
                        isSubmitting
                          ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                          : 'bg-[#008080] text-white hover:bg-[#006666]'
                      }`}
                      data-testid="booking-submit-button"
                    >
                      {isSubmitting ? 'Skickar...' : 'Bekräfta bokning'}
                      {!isSubmitting && <Check size={18} />}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-[#32CD32] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} className="text-white" />
                </div>
                <h3 className="font-syne text-3xl font-bold text-[#1A1A18] mb-4">
                  Tack för din bokning!
                </h3>
                <p className="font-dm text-[#5F5F58] text-lg mb-6 max-w-md mx-auto">
                  Vi har skickat en bekräftelse till <strong>thecaribhut@gmail.com</strong>. 
                  Vi kontaktar dig om det skulle vara några frågor.
                </p>
                <div className="bg-stone-100 p-6 rounded-2xl max-w-sm mx-auto mb-8">
                  <p className="font-dm text-[#1A1A18]">
                    <strong>Bord {selectedTable?.id}</strong> ({selectedTable?.seats} platser)<br />
                    {selectedDate} kl {selectedTime}<br />
                    {formData.guests} {formData.guests === 1 ? 'gäst' : 'gäster'}<br />
                    {formData.name} • {formData.phone}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="px-8 py-4 bg-[#008080] text-white rounded-full font-dm font-bold hover:bg-[#006666] transition-all"
                  data-testid="booking-close-button"
                >
                  Stäng
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
