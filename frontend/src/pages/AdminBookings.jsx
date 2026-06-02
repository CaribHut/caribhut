import { useEffect, useState } from "react";

const PASSWORD = "caribhut1337!";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const res = await fetch(
        `/api/admin-bookings?password=${PASSWORD}`
      );

      const data = await res.json();

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      const res = await fetch("/api/update-booking-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: PASSWORD,
          bookingId,
          status,
        }),
      });

      const data = await res.json();

      if (data.success) {
        loadBookings();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-white">
        Laddar bokningar...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white p-8">
      <h1 className="text-4xl font-bold mb-8">
        Carib Hut Bokningar
      </h1>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-[#1c1c1c] rounded-xl p-5 border border-white/10"
          >
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <strong>Namn:</strong> {booking.name}
              </div>

              <div>
                <strong>Telefon:</strong> {booking.phone}
              </div>

              <div>
                <strong>E-post:</strong> {booking.email}
              </div>

              <div>
                <strong>Datum:</strong> {booking.date}
              </div>

              <div>
                <strong>Tid:</strong> {booking.time}
              </div>

              <div>
                <strong>Gäster:</strong> {booking.guests}
              </div>

              <div>
                <strong>Område:</strong>{" "}
                {booking.areaLabel}
              </div>

              <div>
                <strong>Status:</strong>{" "}
                {booking.status}
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() =>
                  updateStatus(
                    booking._id,
                    "cancelled"
                  )
                }
                className="px-4 py-2 bg-red-600 rounded-lg"
              >
                Avboka
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    booking._id,
                    "confirmed"
                  )
                }
                className="px-4 py-2 bg-green-600 rounded-lg"
              >
                Bekräfta
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
