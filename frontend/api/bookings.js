import nodemailer from "nodemailer";
import clientPromise from "./lib/mongodb";

const BOOKING_BLOCK_MINUTES = 120;

const AREA_CAPACITY = {
  waterfront: 15,
  main: 15,
  terrace: 15,
};

const AREA_LABELS = {
  waterfront: "Vid havet",
  main: "Vid stranden",
  terrace: "Vid viben",
};

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

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const booking = req.body || {};

    const name = String(booking.name || "").trim();
    const phone = String(booking.phone || "").trim();
    const email = String(booking.email || "").trim();
    const date = String(booking.date || "").trim();
    const time = String(booking.time || "").trim();
    const guests = normalizeGuests(booking.guests);
    const area = String(booking.area || booking.zone || "").trim();

    const areaLabel = String(
      booking.area_label || AREA_LABELS[area] || area || ""
    ).trim();

    const comment = String(booking.comment || "").trim();

    if (!name || !phone || !date || !time || !guests || !area) {
      return res.status(400).json({
        success: false,
        message: "Alla obligatoriska fält måste fyllas i",
        debug: {
          name,
          phone,
          date,
          time,
          guests,
          area,
        },
      });
    }

    const areaCapacity = AREA_CAPACITY[area];

    if (!areaCapacity) {
      return res.status(400).json({
        success: false,
        message: "Ogiltigt område",
      });
    }

    if (guests < 1) {
      return res.status(400).json({
        success: false,
        message: "Antal gäster måste vara minst 1",
      });
    }

    if (guests > areaCapacity) {
      return res.status(400).json({
        success: false,
        message: `Det finns max ${areaCapacity} platser i området ${areaLabel}.`,
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

    const existingBookings = await bookingsCollection
      .find({
        status: { $ne: "cancelled" },
        area,
      })
      .toArray();

    let totalBookedGuests = 0;

    for (const existingBooking of existingBookings) {
      const bookingDateTime = parseBookingDateTime(
        existingBooking.date,
        existingBooking.time
      );

      if (!bookingDateTime) continue;

      const diff = minutesDiffForward(bookingDateTime, requestedDateTime);

      if (diff >= 0 && diff < BOOKING_BLOCK_MINUTES) {
        totalBookedGuests += normalizeGuests(existingBooking.guests);
      }
    }

    const remainingSeats = Math.max(0, areaCapacity - totalBookedGuests);

    if (remainingSeats <= 0) {
      return res.status(409).json({
        success: false,
        message: `Det är tyvärr fullt i området ${areaLabel} denna tid. Vänligen välj en annan tid eller annat område.`,
      });
    }

    if (guests > remainingSeats) {
      return res.status(409).json({
        success: false,
        message: `Det finns tyvärr bara ${remainingSeats} platser kvar i området ${areaLabel} denna tid.`,
      });
    }

    const bookingDoc = {
      name,
      phone,
      email: email || null,
      date,
      time,
      guests,
      area,
      areaLabel,
      comment: comment || null,
      status: "confirmed",
      createdAt: new Date(),
    };

    const insertResult = await bookingsCollection.insertOne(bookingDoc);

    if (!insertResult.insertedId) {
      throw new Error("Kunde inte spara bokningen i databasen");
    }

    if (!process.env.EMAIL_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: "EMAIL_PASSWORD saknas i Vercel",
      });
    }

    const transporter = nodemailer.createTransport({
      host: "mailcluster.loopia.se",
      port: 465,
      secure: true,
      auth: {
        user: "order@caribhut.se",
        pass: process.env.EMAIL_PASSWORD,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });

    await transporter.sendMail({
      from: '"Carib Hut Bokning" <order@caribhut.se>',
      to: "order@caribhut.se",
      replyTo: email || "order@caribhut.se",
      subject: "Ny bordsbokning – Carib Hut",
      html: `
        <h2>Ny bokning</h2>
        <p><b>Namn:</b> ${escapeHtml(name)}</p>
        <p><b>Telefon:</b> ${escapeHtml(phone)}</p>
        <p><b>E-post:</b> ${escapeHtml(email || "-")}</p>
        <p><b>Datum:</b> ${escapeHtml(date)}</p>
        <p><b>Tid:</b> ${escapeHtml(time)}</p>
        <p><b>Gäster:</b> ${guests}</p>
        <p><b>Önskat område:</b> ${escapeHtml(areaLabel)}</p>
        <p><b>Kommentar / önskemål:</b> ${escapeHtml(comment || "-")}</p>
        <p><b>Platser kvar i området efter bokning:</b> ${Math.max(
          0,
          remainingSeats - guests
        )}</p>
        <p><b>Booking ID:</b> ${insertResult.insertedId}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Booking received",
      bookingId: insertResult.insertedId,
      remainingSeats: Math.max(0, remainingSeats - guests),
      area,
      areaLabel,
    });
  } catch (error) {
    console.error("BOOKING API ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
