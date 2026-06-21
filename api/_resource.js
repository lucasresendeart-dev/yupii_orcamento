import { Pool } from "pg";
import { verifyAuthHeader } from "./_auth.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

function createId() {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

const allowedTables = new Set(["clients", "themes", "quotes"]);

export function createResourceHandler(table) {
  if (!allowedTables.has(table)) {
    throw new Error(`Tabela nao permitida: ${table}`);
  }

  return async function handler(req, res) {
    try {
      if (!verifyAuthHeader(req.headers.authorization || "")) {
        return res.status(401).json({ error: "Nao autorizado" });
      }

      if (req.method === "GET") {
        const { rows } = await pool.query(`SELECT data FROM ${table} ORDER BY id`);
        return res.status(200).json(rows.map((r) => r.data));
      }

      if (req.method === "POST" || req.method === "PUT") {
        const item = req.body || {};
        if (!item.id) item.id = createId();
        await pool.query(
          `INSERT INTO ${table} (id, data) VALUES ($1, $2)
           ON CONFLICT (id) DO UPDATE SET data = $2`,
          [item.id, item]
        );
        return res.status(200).json(item);
      }

      if (req.method === "DELETE") {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: "id e obrigatorio" });
        await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
        return res.status(204).end();
      }

      res.setHeader("Allow", "GET, POST, PUT, DELETE");
      return res.status(405).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };
}
