import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Calendar, Clock, Check, ArrowRight, ArrowLeft, ChefHat, Palmtree, Waves } from 'lucide-react';

// Updated table layout - 42 seats
// Water at top, Entrance & Kitchen on right
// 6-seat tables in middle, 2-seat at top row, 4-seat at bottom
const tables = [
  // TOP ROW - All in line: 2p, 6p, 2p, 6p, 6p
  { id: 1, seats: 2, x: 12, y: 22, color: '#40E0D0', shape: 'small', label: 'Vid vattnet' },
  { id: 2, seats: 6, x: 30, y: 22, color: '#DEB887', shape: 'large', label: 'Vid vattnet' },
  { id: 3, seats: 2, x: 48, y: 22, color: '#40E0D0', shape: 'small', label: 'Vid vattnet' },
  { id: 4, seats: 6, x: 66, y: 22, color: '#DEB887', shape: 'large', label: '' },
  { id: 5, seats: 6, x: 84, y: 22, color: '#DEB887', shape: 'large', label: '' },
  
  // MIDDLE ROW - 6-seat tables
  { id: 6, seats: 6, x: 30, y: 55, color: '#40E0D0', shape: 'large', label: '' },
  { id: 7, seats: 6, x: 66, y: 55, color: '#40E0D0', shape: 'large', label: '' },
  
  // BOTTOM ROW - 4-seat tables near entrance
  { id: 8, seats: 4, x: 38, y: 85, color: '#2F4F4F', shape: 'medium', label: 'Vid entrén' },
  { id: 9, seats: 4, x: 58, y: 85, color: '#2F4F4F', shape: 'medium', label: 'Vid entrén' },
];

const TableIcon = ({ table, selected, onClick }) => {
  const { seats, color, shape, id } = table;
  
  const getTableDimensions = () => {
    if (shape === 'large') return { width: 70, height: 45 };
    if (shape === 'medium') return { width: 55, height: 38 };
    return { width: 42, height: 32 };
  };

  const { width, height } = getTableDimensions();
  
  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -3 }}
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
      <div
        className={`flex flex-col items-center justify-center transition-all rounded-xl ${
          selected ? 'ring-4 ring-[#FF66A3] ring-offset-2 ring-offset-transparent' : ''
        }`}
        style={{ 
          width, 
          height,
          backgroundColor: selected ? '#FF66A3' : color,
          boxShadow: selected 
            ? '0 8px 25px rgba(255, 102, 163, 0.5)' 
            : '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        <Users size={seats <= 2 ? 14 : 18} className="text-white mb-0.5" />
        <span className="text-white text-xs font-bold">{seats}p</span>
      </div>
      <div className={`text-center mt-1 text-xs font-bold ${selected ? 'text-[#FF66A3]' : 'text-white/80'}`}>
        Bord {id}
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
        headers: { 'Content-Type': 'application/json' },
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
            <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors" data-testid="close-booking-modal">
              <X size={24} className="text-white/60" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="px-6 py-4 bg-black/20">
            <div className="flex items-center justify-center gap-4">
              {[{ num: 1, label: 'Välj bord' }, { num: 2, label: 'Dina uppgifter' }, { num: 3, label: 'Bekräftat' }].map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s.num ? 'bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white shadow-lg' : 'bg-white/10 text-white/40'}`}>
                      {step > s.num ? <Check size={18} /> : s.num}
                    </div>
                    <span className={`text-xs mt-1 ${step >= s.num ? 'text-white' : 'text-white/40'}`}>{s.label}</span>
                  </div>
                  {i < 2 && <div className={`w-20 h-1 mx-3 rounded ${step > s.num ? 'bg-gradient-to-r from-[#FF66A3] to-[#FFA500]' : 'bg-white/10'}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block font-dm font-bold text-white mb-2">
                      <Calendar size={18} className="inline mr-2 text-[#FFA500]" />Välj datum
                    </label>
                    <input type="date" min={getMinDate()} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white focus:border-[#FF66A3] outline-none font-dm"
                      data-testid="booking-date-input" />
                  </div>
                  <div>
                    <label className="block font-dm font-bold text-white mb-2">
                      <Clock size={18} className="inline mr-2 text-[#32CD32]" />Välj tid
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {timeSlots.map((time) => (
                        <button key={time} onClick={() => setSelectedTime(time)}
                          className={`p-2 rounded-lg text-sm font-dm font-medium transition-all ${selectedTime === time ? 'bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
                          data-testid={`time-slot-${time}`}>{time}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floor Plan */}
                <div className="mb-6">
                  <h3 className="font-syne text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Palmtree size={20} className="text-[#32CD32]" />Välj bord (42 platser)
                  </h3>
                  
                  <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(180deg, #3D5A4C 0%, #2D4A3E 50%, #1A332A 100%)', minHeight: '320px' }}>
                    {/* WATER at TOP - just blue gradient, no text */}
                    <div className="absolute top-0 left-0 right-16 h-10 bg-gradient-to-b from-[#1E90FF]/50 to-transparent">
                      <div className="absolute top-1 left-1/4 w-6 h-6 border border-[#87CEEB]/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                      <div className="absolute top-2 left-1/2 w-4 h-4 border border-[#87CEEB]/20 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                      <div className="absolute top-1 left-3/4 w-5 h-5 border border-[#87CEEB]/25 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
                    </div>
                    
                    {/* ENTRANCE & KITCHEN on RIGHT */}
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-amber-900/60 to-transparent flex flex-col items-center justify-center gap-6">
                      <div className="text-center">
                        <ChefHat size={20} className="text-orange-400 mx-auto mb-1" />
                        <span className="text-orange-400 text-[9px] font-bold">KÖK</span>
                      </div>
                      <div className="text-center">
                        <span className="text-white text-base">🚪</span>
                        <p className="text-white/60 text-[9px] font-bold">ENTRÉ</p>
                      </div>
                    </div>
                    
                    {/* Decorations */}
                    <div className="absolute top-14 left-4 text-xl">🌴</div>
                    <div className="absolute bottom-16 left-4 text-lg">🌿</div>
                    
                    {/* String lights */}
                    <div className="absolute top-10 left-6 right-20 flex justify-between">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                    
                    {/* Tables */}
                    <div className="absolute inset-0 pt-8 pb-2 pl-6 pr-20">
                      {tables.map((table) => (
                        <TableIcon key={table.id} table={table} selected={selectedTable?.id === table.id} onClick={() => handleTableSelect(table)} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ backgroundColor: '#40E0D0' }}></div><span className="font-dm text-sm text-white/60">Turkos</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ backgroundColor: '#DEB887' }}></div><span className="font-dm text-sm text-white/60">Trä</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ backgroundColor: '#2F4F4F' }}></div><span className="font-dm text-sm text-white/60">Grön</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#FF66A3]"></div><span className="font-dm text-sm text-white/60">Valt</span></div>
                  </div>
                  <div className="flex justify-center gap-6 mt-2 text-white/50 text-xs font-dm">
                    <span>5st 6-platser</span><span>2st 4-platser</span><span>2st 2-platser</span>
                  </div>
                </div>

                {selectedTable && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-[#FF66A3]/20 to-[#FFA500]/20 p-4 rounded-xl mb-6 border border-[#FF66A3]/30">
                    <p className="font-dm text-white">
                      <span className="text-[#FF66A3] font-bold">Ditt val:</span> Bord {selectedTable.id} ({selectedTable.seats} platser)
                      {selectedTable.label && <span className="text-[#87CEEB]"> • {selectedTable.label}</span>}
                      {selectedDate && <span className="text-[#FFA500]"> • {selectedDate}</span>}
                      {selectedTime && <span className="text-[#32CD32]"> • kl {selectedTime}</span>}
                    </p>
                  </motion.div>
                )}

                <div className="flex justify-end">
                  <motion.button onClick={handleNext} disabled={!selectedTable || !selectedDate || !selectedTime}
                    className={`flex items-center gap-2 px-8 py-4 rounded-full font-dm font-bold transition-all ${selectedTable && selectedDate && selectedTime ? 'bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white hover:shadow-lg' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}
                    whileHover={selectedTable && selectedDate && selectedTime ? { scale: 1.05 } : {}}
                    data-testid="booking-next-button">Nästa steg<ArrowRight size={18} /></motion.button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="bg-gradient-to-r from-[#FF66A3]/20 to-[#FFA500]/20 p-4 rounded-xl mb-6 border border-[#FF66A3]/30">
                  <p className="font-dm text-white">
                    🪑 <strong>Bord {selectedTable.id}</strong> ({selectedTable.seats} platser)
                    {selectedTable.label && <span className="text-[#87CEEB]"> • {selectedTable.label}</span>} • 
                    <span className="text-[#FFA500]"> {selectedDate}</span> • <span className="text-[#32CD32]"> kl {selectedTime}</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block font-dm font-bold text-white mb-2">Namn *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#FF66A3] outline-none font-dm"
                      placeholder="Ditt namn" data-testid="booking-name-input" />
                  </div>
                  <div>
                    <label className="block font-dm font-bold text-white mb-2">Telefonnummer *</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#FF66A3] outline-none font-dm"
                      placeholder="07XX-XXX XXX" data-testid="booking-phone-input" />
                  </div>
                  <div>
                    <label className="block font-dm font-bold text-white mb-2">E-post (valfritt)</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#FF66A3] outline-none font-dm"
                      placeholder="din@email.se" data-testid="booking-email-input" />
                  </div>
                  <div>
                    <label className="block font-dm font-bold text-white mb-2">Antal gäster</label>
                    <select value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                      className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white focus:border-[#FF66A3] outline-none font-dm"
                      data-testid="booking-guests-input">
                      {[...Array(selectedTable.seats)].map((_, i) => (
                        <option key={i + 1} value={i + 1} className="bg-[#1A1A18]">{i + 1} {i === 0 ? 'gäst' : 'gäster'}</option>
                      ))}
                    </select>
                  </div>
                  {error && <div className="bg-red-500/20 text-red-300 p-4 rounded-xl font-dm border border-red-500/30">{error}</div>}
                  <div className="flex justify-between gap-4 pt-4">
                    <motion.button type="button" onClick={handleBack} className="flex items-center gap-2 px-6 py-4 rounded-full font-dm font-bold border-2 border-white/20 text-white hover:bg-white/10"
                      data-testid="booking-back-button"><ArrowLeft size={18} />Tillbaka</motion.button>
                    <motion.button type="submit" disabled={isSubmitting}
                      className={`flex items-center gap-2 px-8 py-4 rounded-full font-dm font-bold transition-all ${isSubmitting ? 'bg-white/20 text-white/50 cursor-not-allowed' : 'bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white hover:shadow-lg'}`}
                      data-testid="booking-submit-button">
                      {isSubmitting ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Bokar...</> : <>Bekräfta bokning<Check size={18} /></>}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <motion.div className="text-6xl mb-6" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>🎉</motion.div>
                <h3 className="font-syne text-3xl font-bold text-white mb-4">Tack för din bokning!</h3>
                <p className="font-dm text-white/70 text-lg mb-8 max-w-md mx-auto">Vi ser fram emot att välkomna dig till Carib Hut.</p>
                <div className="bg-white/10 p-6 rounded-2xl max-w-sm mx-auto mb-8 border border-white/20">
                  <div className="text-4xl mb-4">🌴</div>
                  <p className="font-dm text-white">
                    <strong className="text-[#FF66A3]">Bord {selectedTable?.id}</strong> ({selectedTable?.seats} platser)
                    {selectedTable?.label && <span className="text-[#87CEEB]"> • {selectedTable.label}</span>}<br />
                    <span className="text-[#FFA500]">{selectedDate}</span> kl <span className="text-[#32CD32]">{selectedTime}</span><br />
                    {formData.guests} {formData.guests === 1 ? 'gäst' : 'gäster'}<br />
                    <span className="text-white/60">{formData.name} • {formData.phone}</span>
                  </p>
                </div>
                <motion.button onClick={handleClose} className="px-8 py-4 bg-gradient-to-r from-[#FF66A3] to-[#FFA500] text-white rounded-full font-dm font-bold"
                  whileHover={{ scale: 1.05 }} data-testid="booking-close-button">Stäng</motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
