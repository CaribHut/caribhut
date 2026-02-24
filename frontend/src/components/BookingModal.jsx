import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Calendar, Clock, Check, ArrowRight, ArrowLeft, Wine, ChefHat, Palmtree } from 'lucide-react';

// Updated table layout to match actual restaurant - 42 seats
// Bar on left, Kitchen on right
const tables = [
  // Left section (near bar) - 3 tables
  { id: 1, seats: 6, x: 8, y: 25, color: '#40E0D0', shape: 'long' },    // Long turquoise table
  { id: 2, seats: 2, x: 8, y: 55, color: '#DEB887', shape: 'small' },   // Small wooden table
  { id: 3, seats: 4, x: 8, y: 75, color: '#DEB887', shape: 'medium' },  // Medium wooden table
  
  // Middle-left section - 3 tables
  { id: 4, seats: 6, x: 30, y: 25, color: '#40E0D0', shape: 'long' },   // Long turquoise table
  { id: 5, seats: 4, x: 30, y: 55, color: '#2F4F4F', shape: 'medium' }, // Dark green table
  { id: 6, seats: 2, x: 30, y: 80, color: '#DEB887', shape: 'small' },  // Small wooden table
  
  // Middle-right section - 3 tables
  { id: 7, seats: 6, x: 55, y: 25, color: '#40E0D0', shape: 'long' },   // Long turquoise table
  { id: 8, seats: 4, x: 55, y: 55, color: '#2F4F4F', shape: 'medium' }, // Dark green table  
  { id: 9, seats: 4, x: 55, y: 80, color: '#DEB887', shape: 'medium' }, // Medium wooden table
  
  // Right section (near kitchen) - 3 tables
  { id: 10, seats: 4, x: 80, y: 25, color: '#40E0D0', shape: 'medium' }, // Turquoise table
  { id: 11, seats: 4, x: 80, y: 55, color: '#2F4F4F', shape: 'medium' }, // Dark green table
  { id: 12, seats: 2, x: 80, y: 80, color: '#DEB887', shape: 'small' },  // Small wooden table
];

const TableIcon = ({ table, selected, onClick }) => {
  const { seats, color, shape, id } = table;
  
  const getTableDimensions = () => {
    if (shape === 'long') return { width: 70, height: 32 };
    if (shape === 'medium') return { width: 50, height: 32 };
    return { width: 38, height: 30 };
  };

  const { width, height } = getTableDimensions();
  
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer absolute"
      style={{ 
        left: `${table.x}%`, 
        top: `${table.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      data-testid={`table-${id}`}
    >
      {/* Table surface */}
      <div
        className={`rounded-lg flex flex-col items-center justify-center transition-all relative ${
          selected ? 'ring-4 ring-[#FF66A3] ring-offset-2' : ''
        }`}
        style={{ 
          width, 
          height,
          backgroundColor: selected ? '#FF66A3' : color,
          boxShadow: selected 
            ? '0 8px 25px rgba(255, 102, 163, 0.4)' 
            : '0 4px 12px rgba(0,0,0,0.2)'
        }}
      >
        {/* Chairs visualization */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {[...Array(Math.ceil(seats/2))].map((_, i) => (
            <div key={`top-${i}`} className="w-2 h-2 rounded-full bg-white/60" />
          ))}
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {[...Array(Math.floor(seats/2))].map((_, i) => (
            <div key={`bottom-${i}`} className="w-2 h-2 rounded-full bg-white/60" />
          ))}
        </div>
        
        {/* Table info */}
        <Users size={14} className="text-white mb-0.5" />
        <span className="text-white text-[10px] font-bold">{seats}p</span>
      </div>
      
      {/* Table number */}
      <div className={`text-center mt-1 text-[10px] font-bold ${selected ? 'text-[#FF66A3]' : 'text-white/80'}`}>
        {id}
      </div>
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        data-testid="booking-modal-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-[#1A1A18] to-[#2D2D2A] rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#FF66A3]/20"
          onClick={(e) => e.stopPropagation()}
          data-testid="booking-modal"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#1A1A18] to-[#2D2D2A] p-6 border-b border-white/10 flex items-center justify-between z-10">
            <div>
              <h2 className="font-syne text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">🌴</span>
                Boka Bord
              </h2>
              <p className="font-dm text-white/60 text-sm mt-1">
                {step === 1 && 'Välj ditt favoritbord i vår tropiska oas'}
                {step === 2 && 'Berätta vem du är'}
                {step === 3 && 'Vi ses snart!'}
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

          {/* Progress indicator */}
          <div className="px-6 py-4 bg-black/20">
            <div className="flex items-center justify-center gap-4">
              {[
                { num: 1, label: 'Välj bord' },
                { num: 2, label: 'Dina uppgifter' },
                { num: 3, label: 'Bekräftat' }
              ].map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        step >= s.num
                          ? 'bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white shadow-lg'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {step > s.num ? <Check size={18} /> : s.num}
                    </div>
                    <span className={`text-xs mt-1 ${step >= s.num ? 'text-white' : 'text-white/40'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      className={`w-20 h-1 mx-3 rounded ${
                        step > s.num ? 'bg-gradient-to-r from-[#FF66A3] to-[#FFA500]' : 'bg-white/10'
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
                    <label className="block font-dm font-bold text-white mb-2">
                      <Calendar size={18} className="inline mr-2 text-[#FFA500]" />
                      Välj datum
                    </label>
                    <input
                      type="date"
                      min={getMinDate()}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white focus:border-[#FF66A3] focus:ring-2 focus:ring-[#FF66A3]/20 outline-none font-dm"
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
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 rounded-lg text-sm font-dm font-medium transition-all ${
                            selectedTime === time
                              ? 'bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white shadow-lg'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                          data-testid={`time-slot-${time}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Restaurant Floor Plan */}
                <div className="mb-6">
                  <h3 className="font-syne text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Palmtree size={20} className="text-[#32CD32]" />
                    Välj bord (42 platser)
                  </h3>
                  
                  {/* Floor plan container */}
                  <div 
                    className="relative rounded-2xl overflow-hidden"
                    style={{ 
                      background: 'linear-gradient(135deg, #2D4A3E 0%, #1A332A 100%)',
                      minHeight: '400px'
                    }}
                  >
                    {/* Pergola roof pattern */}
                    <div className="absolute inset-0 opacity-10">
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i}
                          className="absolute h-full w-1 bg-amber-600"
                          style={{ left: `${12 + i * 12}%` }}
                        />
                      ))}
                    </div>
                    
                    {/* Bar area - Left */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-amber-900/60 to-transparent flex flex-col items-center justify-center">
                      <Wine size={24} className="text-amber-400 mb-2" />
                      <span className="text-amber-400 text-xs font-bold writing-mode-vertical transform -rotate-180" style={{ writingMode: 'vertical-rl' }}>
                        BAR
                      </span>
                    </div>
                    
                    {/* Kitchen area - Right */}
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-orange-900/60 to-transparent flex flex-col items-center justify-center">
                      <ChefHat size={24} className="text-orange-400 mb-2" />
                      <span className="text-orange-400 text-xs font-bold" style={{ writingMode: 'vertical-rl' }}>
                        KÖK
                      </span>
                    </div>
                    
                    {/* Decorative plants */}
                    <div className="absolute top-4 left-20 text-2xl">🌴</div>
                    <div className="absolute top-4 left-1/3 text-2xl">🌿</div>
                    <div className="absolute bottom-4 left-1/4 text-2xl">🌴</div>
                    <div className="absolute top-1/2 left-1/2 text-xl">🪴</div>
                    <div className="absolute bottom-4 right-20 text-2xl">🌿</div>
                    
                    {/* String lights decoration */}
                    <div className="absolute top-2 left-20 right-20 flex justify-between">
                      {[...Array(12)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                    
                    {/* Tables */}
                    <div className="absolute inset-16">
                      {tables.map((table) => (
                        <TableIcon
                          key={table.id}
                          table={table}
                          selected={selectedTable?.id === table.id}
                          onClick={() => handleTableSelect(table)}
                        />
                      ))}
                    </div>
                    
                    {/* Entrance indicator */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-white/20 text-white px-4 py-1 rounded-full text-xs font-dm flex items-center gap-2">
                        <span>↑</span> ENTRÉ
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: '#40E0D0' }}></div>
                      <span className="font-dm text-sm text-white/60">Turkos bord</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: '#DEB887' }}></div>
                      <span className="font-dm text-sm text-white/60">Träbord</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2F4F4F' }}></div>
                      <span className="font-dm text-sm text-white/60">Gröna bord</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[#FF66A3]"></div>
                      <span className="font-dm text-sm text-white/60">Valt bord</span>
                    </div>
                  </div>
                </div>

                {/* Selected info */}
                {selectedTable && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-[#FF66A3]/20 to-[#FFA500]/20 p-4 rounded-xl mb-6 border border-[#FF66A3]/30"
                  >
                    <p className="font-dm text-white">
                      <span className="text-[#FF66A3] font-bold">Ditt val:</span> Bord {selectedTable.id} ({selectedTable.seats} platser)
                      {selectedDate && <span className="text-[#FFA500]"> • {selectedDate}</span>}
                      {selectedTime && <span className="text-[#32CD32]"> • kl {selectedTime}</span>}
                    </p>
                  </motion.div>
                )}

                {/* Next button */}
                <div className="flex justify-end">
                  <motion.button
                    onClick={handleNext}
                    disabled={!selectedTable || !selectedDate || !selectedTime}
                    className={`flex items-center gap-2 px-8 py-4 rounded-full font-dm font-bold transition-all ${
                      selectedTable && selectedDate && selectedTime
                        ? 'bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white hover:shadow-lg hover:shadow-[#FF66A3]/30'
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                    whileHover={selectedTable && selectedDate && selectedTime ? { scale: 1.05 } : {}}
                    whileTap={selectedTable && selectedDate && selectedTime ? { scale: 0.95 } : {}}
                    data-testid="booking-next-button"
                  >
                    Nästa steg
                    <ArrowRight size={18} />
                  </motion.button>
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
                <div className="bg-gradient-to-r from-[#FF66A3]/20 to-[#FFA500]/20 p-4 rounded-xl mb-6 border border-[#FF66A3]/30">
                  <p className="font-dm text-white">
                    <span className="text-2xl mr-2">🪑</span>
                    <strong>Bord {selectedTable.id}</strong> ({selectedTable.seats} platser) • 
                    <span className="text-[#FFA500]"> {selectedDate}</span> • 
                    <span className="text-[#32CD32]"> kl {selectedTime}</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block font-dm font-bold text-white mb-2">
                      Namn *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#FF66A3] focus:ring-2 focus:ring-[#FF66A3]/20 outline-none font-dm"
                      placeholder="Ditt namn"
                      data-testid="booking-name-input"
                    />
                  </div>

                  <div>
                    <label className="block font-dm font-bold text-white mb-2">
                      Telefonnummer *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#FF66A3] focus:ring-2 focus:ring-[#FF66A3]/20 outline-none font-dm"
                      placeholder="07XX-XXX XXX"
                      data-testid="booking-phone-input"
                    />
                  </div>

                  <div>
                    <label className="block font-dm font-bold text-white mb-2">
                      E-post (valfritt)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#FF66A3] focus:ring-2 focus:ring-[#FF66A3]/20 outline-none font-dm"
                      placeholder="din@email.se"
                      data-testid="booking-email-input"
                    />
                  </div>

                  <div>
                    <label className="block font-dm font-bold text-white mb-2">
                      Antal gäster
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white focus:border-[#FF66A3] focus:ring-2 focus:ring-[#FF66A3]/20 outline-none font-dm"
                      data-testid="booking-guests-input"
                    >
                      {[...Array(selectedTable.seats)].map((_, i) => (
                        <option key={i + 1} value={i + 1} className="bg-[#1A1A18]">
                          {i + 1} {i === 0 ? 'gäst' : 'gäster'}
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
                      className="flex items-center gap-2 px-6 py-4 rounded-full font-dm font-bold border-2 border-white/20 text-white hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                          ? 'bg-white/20 text-white/50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white hover:shadow-lg hover:shadow-[#FF66A3]/30'
                      }`}
                      whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      data-testid="booking-submit-button"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Bokar...
                        </>
                      ) : (
                        <>
                          Bekräfta bokning
                          <Check size={18} />
                        </>
                      )}
                    </motion.button>
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
                <motion.div 
                  className="text-6xl mb-6"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  🎉
                </motion.div>
                <h3 className="font-syne text-3xl font-bold text-white mb-4">
                  Tack för din bokning!
                </h3>
                <p className="font-dm text-white/70 text-lg mb-8 max-w-md mx-auto">
                  Vi ser fram emot att välkomna dig till Carib Hut. 
                  En bekräftelse har skickats.
                </p>
                
                <div className="bg-white/10 p-6 rounded-2xl max-w-sm mx-auto mb-8 border border-white/20">
                  <div className="text-4xl mb-4">🌴</div>
                  <p className="font-dm text-white">
                    <strong className="text-[#FF66A3]">Bord {selectedTable?.id}</strong> ({selectedTable?.seats} platser)<br />
                    <span className="text-[#FFA500]">{selectedDate}</span> kl <span className="text-[#32CD32]">{selectedTime}</span><br />
                    {formData.guests} {formData.guests === 1 ? 'gäst' : 'gäster'}<br />
                    <span className="text-white/60">{formData.name} • {formData.phone}</span>
                  </p>
                </div>
                
                <motion.button
                  onClick={handleClose}
                  className="px-8 py-4 bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white rounded-full font-dm font-bold hover:shadow-lg hover:shadow-[#FF66A3]/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
