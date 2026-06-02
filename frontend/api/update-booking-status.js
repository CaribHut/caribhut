import { ObjectId } from "mongodb";
import clientPromise from "./lib/mongodb";

function isAuthorized(req) {
  const password =
    req.headers["x-admin-password"] ||
    req.query.password ||
    req.body?.password ||
    "";

  return password === process.env.ADMIN_PASSWORD;
}

export default async function handler(req, res) {
  if (req.method !== "PATCH" && req.method !== "POST") {
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
    const { bookingId, status } = req.body || {};

    if (!bookingId || !ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Ogiltigt bookingId",
      });
    }

    const allowedStatuses = ["confirmed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Ogiltig status",
      });
    }

    const client = await clientPromise;
    const db = client.db("caribhut");
    const bookingsCollection = db.collection("bookings");

    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Bokningen hittades inte",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Bokningen är nu ${status}`,
      bookingId,
      status,
    });
  } catch (error) {
    console.error("UPDATE BOOKING STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
