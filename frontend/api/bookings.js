import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const booking = req.body;

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
      replyTo: booking.email || "order@caribhut.se",
      subject: "Ny bordsbokning – Carib Hut",
      html: `
        <h2>Ny bokning</h2>
        <p><b>Namn:</b> ${booking.name || ""}</p>
        <p><b>Telefon:</b> ${booking.phone || ""}</p>
        <p><b>E-post:</b> ${booking.email || ""}</p>
        <p><b>Datum:</b> ${booking.date || ""}</p>
        <p><b>Tid:</b> ${booking.time || ""}</p>
        <p><b>Gäster:</b> ${booking.guests || ""}</p>
        <p><b>Bord:</b> ${booking.table || ""}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Booking received",
    });
  } catch (error) {
    console.error("BOOKING API ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
