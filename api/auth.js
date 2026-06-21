import { authenticatePassword } from "./_auth.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).end();
  }

  const { password } = req.body || {};
  const session = authenticatePassword(password);
  if (!session) {
    return res.status(401).json({ error: "Senha incorreta" });
  }

  return res.status(200).json(session);
}
