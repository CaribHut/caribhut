import clientPromise from "./lib/mongodb";

function isAuthorized(req) {
  const password =
    req.headers["x-admin-password"] ||
    req.query.password ||
    "";

  return password === process.env.ADMIN_PASSWORD;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db("caribhut");
    const bookingsCollection = db.collection("bookings");

    const bookings = await bookingsCollection
      .find({})
      .sort({ date: 1, time: 1, createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      bookings: bookings.map((booking) => ({
        _id: booking._id.toString(),
        name: booking.name || "",
        phone: booking.phone || "",
        email: booking.email || "",
        date: booking.date || "",
        time: booking.time || "",
        guests: booking.guests || 0,
        area: booking.area || "",
        areaLabel: booking.areaLabel || booking.area_label || "",
        comment: booking.comment || "",
        status: booking.status || "confirmed",
        createdAt: booking.createdAt || null,
      })),
    });
  } catch (error) {
    console.error("ADMIN BOOKINGS API ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
