import clientPromise from "./lib/mongodb";

const BOOKING_BLOCK_MINUTES = 120;
const MAX_RESTAURANT_CAPACITY = 60;

function parseBookingDateTime(date, time) {
  if (!date || !time) return null;

  const dt = new Date(`${date}T${time}:00`);
  if (Number.isNaN(dt.getTime())) return null;

  return dt;
}

function minutesDiffForward(from, to) {
  return (to.getTime() - from.getTime()) / 60000;
}

function normalizeGuests(value) {
  const parsed = parseInt(String(value || "").match(/\d+/)?.[0] || "0", 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: "Datum och tid krävs",
      });
    }

    const requestedDateTime = parseBookingDateTime(date, time);

    if (!requestedDateTime) {
      return res.status(400).json({
        success: false,
        message: "Ogiltigt datum eller tid",
      });
    }

    const client = await clientPromise;
    const db = client.db("caribhut");
    const bookingsCollection = db.collection("bookings");

    const existingBookings = await bookingsCollection.find({
      status: { $ne: "cancelled" },
    }).toArray();

    let totalBookedGuests = 0;
    const matchedBookings = [];

    for (const booking of existingBookings) {
      const bookingDateTime = parseBookingDateTime(booking.date, booking.time);
      if (!bookingDateTime) continue;

      const diff = minutesDiffForward(bookingDateTime, requestedDateTime);

      // Bokning påverkar bara framåt i 120 min:
      // ex 18:00 påverkar 18:00 och 19:00, men inte 17:00
      if (diff >= 0 && diff < BOOKING_BLOCK_MINUTES) {
        const guests = normalizeGuests(booking.guests);
        totalBookedGuests += guests;

        matchedBookings.push({
          id: booking._id,
          date: booking.date,
          time: booking.time,
          guests,
          area: booking.area || null,
        });
      }
    }

    const remainingSeats = Math.max(
      0,
      MAX_RESTAURANT_CAPACITY - totalBookedGuests
    );

    const isFullyBooked = remainingSeats <= 0;

    return res.status(200).json({
      success: true,
      date,
      time,
      bookingBlockMinutes: BOOKING_BLOCK_MINUTES,
      maxCapacity: MAX_RESTAURANT_CAPACITY,
      totalBookedGuests,
      remainingSeats,
      availableSeats: remainingSeats,
      seatsLeft: remainingSeats,
      isFullyBooked,
      message: isFullyBooked
        ? "Det är tyvärr fullt online denna tid. Vänligen ring oss istället för att boka bord."
        : null,
      matchedBookingsCount: matchedBookings.length,
    });
  } catch (error) {
    console.error("AVAILABILITY API ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
