import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";
import crypto from "crypto";

const BOOKING_BLOCK_MINUTES = 120;

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL saknas i Vercel");
  }

  if (!process.env.DB_NAME) {
    throw new Error("DB_NAME saknas i Vercel");
  }

  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();

  const db = client.db(process.env.DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

function parseBookingDateTime(date, time) {
  if (!date || !time) {
    throw new Error("Datum och tid krävs");
  }

  const dt = new Date(`${date}T${time}:00`);
  if (Number.isNaN(dt.getTime())) {
    throw new Error("Ogiltigt datum eller tid");
  }

  return dt;
}

function minutesBetween(a, b) {
  return Math.abs(a.getTime() - b.getTime()) / 60000;
}

async function ensureIndexes(db) {
  await db.collection("bookings").createIndex({ id: 1 }, { unique: true });
  await db.collection("bookings").createIndex({ table_id: 1, status: 1 });
  await db.collection("bookings").createIndex({ date: 1, time: 1, status: 1 });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const booking = req.body || {};

    if (!process.env.EMAIL_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: "EMAIL_PASSWORD saknas i Vercel",
      });
    }

    const requiredFields = ["table_id", "table_seats", "date", "time", "name", "phone", "guests"];
    for (const field of requiredFields) {
      if (
        booking[field] === undefined ||
        booking[field] === null ||
        booking[field] === ""
      ) {
        return res.status(400).json({
          success: false,
          message: `Saknar fält: ${field}`,
        });
      }
    }

    const requestedDateTime = parseBookingDateTime(booking.date, booking.time);

    const { db } = await connectToDatabase();
    await ensureIndexes(db);

    const existingBookings = await db
      .collection("bookings")
      .find(
        {
          table_id: Number(booking.table_id),
          status: "confirmed",
        },
        {
          projection: {
            _id: 0,
            id: 1,
            table_id: 1,
            date: 1,
            time: 1,
            status: 1,
          },
        }
      )
      .toArray();

    for (const existing of existingBookings) {
      try {
        const existingDateTime = parseBookingDateTime(existing.date, existing.time);
        const diff = minutesBetween(existingDateTime, requestedDateTime);

        if (diff < BOOKING_BLOCK_MINUTES) {
          return res.status(409).json({
            success: false,
            message: "Bordet är redan bokat eller upptaget nära denna tid. Välj ett annat bord eller en annan tid.",
          });
        }
      } catch (e) {
        console.error("Fel vid kontroll av befintlig bokning:", e);
      }
    }

    const bookingDoc = {
      id: crypto.randomUUID(),
      table_id: Number(booking.table_id),
      table_seats: Number(booking.table_seats),
      table_zone: booking.table_zone || null,
      date: booking.date,
      time: booking.time,
      name: String(booking.name || "").trim(),
      phone: String(booking.phone || "").trim(),
      email: booking.email ? String(booking.email).trim() : null,
      guests: Number(booking.guests),
      status: "confirmed",
      created_at: new Date().toISOString(),
    };

    await db.collection("bookings").insertOne(bookingDoc);

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
      replyTo: bookingDoc.email || "order@caribhut.se",
      subject: `Ny bordsbokning – Bord ${bookingDoc.table_id} – ${bookingDoc.date} ${bookingDoc.time}`,
      html: `
        <h2>Ny bokning</h2>
        <p><b>Namn:</b> ${escapeHtml(bookingDoc.name)}</p>
        <p><b>Telefon:</b> ${escapeHtml(bookingDoc.phone)}</p>
        <p><b>E-post:</b> ${escapeHtml(bookingDoc.email || "")}</p>
        <p><b>Datum:</b> ${escapeHtml(bookingDoc.date)}</p>
        <p><b>Tid:</b> ${escapeHtml(bookingDoc.time)}</p>
        <p><b>Gäster:</b> ${escapeHtml(bookingDoc.guests)}</p>
        <p><b>Bord ID:</b> ${escapeHtml(bookingDoc.table_id)}</p>
        <p><b>Platser vid bordet:</b> ${escapeHtml(bookingDoc.table_seats)}</p>
        <p><b>Zon:</b> ${escapeHtml(bookingDoc.table_zone || "")}</p>
        <p><b>Boknings-ID:</b> ${escapeHtml(bookingDoc.id)}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Booking received",
      booking: {
        id: bookingDoc.id,
        table_id: bookingDoc.table_id,
        date: bookingDoc.date,
        time: bookingDoc.time,
      },
    });
  } catch (error) {
    console.error("BOOKING API ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
