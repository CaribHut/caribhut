import nodemailer from "nodemailer";
import clientPromise from "./lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const booking = req.body || {};

    const name = (booking.name || "").trim();
    const phone = (booking.phone || "").trim();
    const email = (booking.email || "").trim();
    const date = (booking.date || "").trim();
    const time = (booking.time || "").trim();
    const guests = Number(booking.guests || 0);
    const table = (booking.table || "").trim();

    if (!name || !phone || !date || !time || !guests || !table) {
      return res.status(400).json({
        success: false,
        message: "Alla obligatoriska fält måste fyllas i",
      });
    }

    const client = await clientPromise;
    const db = client.db("caribhut");
    const bookingsCollection = db.collection("bookings");

    const existingBooking = await bookingsCollection.findOne({
      date,
      time,
      table,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "Det bordet är redan bokat på vald tid",
      });
    }

    const bookingDoc = {
      name,
      phone,
      email,
      date,
      time,
      guests,
      table,
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
        <p><b>Namn:</b> ${name}</p>
        <p><b>Telefon:</b> ${phone}</p>
        <p><b>E-post:</b> ${email}</p>
        <p><b>Datum:</b> ${date}</p>
        <p><b>Tid:</b> ${time}</p>
        <p><b>Gäster:</b> ${guests}</p>
        <p><b>Bord:</b> ${table}</p>
        <p><b>Booking ID:</b> ${insertResult.insertedId}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Booking received",
    });
  } catch (error) {
    console.error("BOOKING API ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Det bordet är redan bokat på vald tid",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
