export default async function handler(req, res) {
  if (req.method === "POST") {

    const booking = req.body;

    console.log("Ny bokning:", booking);

    return res.status(200).json({ success: true });
  }

  res.status(405).json({ message: "Method not allowed" });
}
