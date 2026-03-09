import nodemailer from "nodemailer";

export default async function handler(request, response) {

  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  try {

    const booking = await request.json();

    const transporter = nodemailer.createTransport({
      host: "mailcluster.loopia.se",
      port: 465,
      secure: true,
      auth: {
        user: "order@caribhut.se",
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: "order@caribhut.se",
      to: "order@caribhut.se",
      subject: "Ny bordsbokning – Carib Hut",
      html: `
        <h2>Ny bokning</h2>
        <p><b>Namn:</b> ${booking.name}</p>
        <p><b>Telefon:</b> ${booking.phone}</p>
        <p><b>Email:</b> ${booking.email}</p>
        <p><b>Datum:</b> ${booking.date}</p>
        <p><b>Tid:</b> ${booking.time}</p>
        <p><b>Gäster:</b> ${booking.guests}</p>
        <p><b>Bord:</b> ${booking.table}</p>
      `
    });

    return response.status(200).json({ success: true });

  } catch (error) {

    console.error(error);

    return response.status(500).json({
      success: false,
      message: "Server error"
    });

  }
}
