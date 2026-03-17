import clientPromise from "./lib/mongodb";

const BOOKING_BLOCK_MINUTES = 120;

function parseBookingDateTime(date, time) {
  if (!date || !time) return null;

  const dt = new Date(`${date}T${time}:00`);
  if (Number.isNaN(dt.getTime())) return null;

  return dt;
}

function minutesBetween(a, b) {
  return Math.abs(a.getTime() - b.getTime()) / 60000;
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

    const bookedTableIds = [];

    for (const booking of existingBookings) {
      const bookingDateTime = parseBookingDateTime(booking.date, booking.time);
      if (!bookingDateTime) continue;

      const diff = minutesBetween(bookingDateTime, requestedDateTime);

      if (diff < BOOKING_BLOCK_MINUTES) {
        let tableId = null;

        if (booking.table_id) {
          tableId = Number(booking.table_id);
        } else if (booking.table) {
          const match = String(booking.table).match(/\d+/);
          if (match) tableId = Number(match[0]);
        }

        if (tableId && !bookedTableIds.includes(tableId)) {
          bookedTableIds.push(tableId);
        }
      }
    }

    return res.status(200).json({
      success: true,
      bookedTableIds,
    });
  } catch (error) {
    console.error("AVAILABILITY API ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
