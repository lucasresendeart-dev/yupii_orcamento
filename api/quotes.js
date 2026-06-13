import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const TABLE = "quotes";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { rows } = await pool.query(`SELECT data FROM ${TABLE} ORDER BY id`);
      return res.status(200).json(rows.map((r) => r.data));
    }

    if (req.method === "POST" || req.method === "PUT") {
      const item = req.body;
      if (!item.id) item.id = Date.now();
      await pool.query(
        `INSERT INTO ${TABLE} (id, data) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET data = $2`,
        [item.id, item]
      );
      return res.status(200).json(item);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "id é obrigatório" });
      await pool.query(`DELETE FROM ${TABLE} WHERE id = $1`, [id]);
      return res.status(204).end();
    }

    res.setHeader("Allow", "GET, POST, PUT, DELETE");
    return res.status(405).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
