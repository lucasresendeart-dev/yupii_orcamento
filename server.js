const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

app.use(express.json());

function createId() {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

function createResourceRouter(table) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const { rows } = await pool.query(`SELECT data FROM ${table} ORDER BY id`);
      res.json(rows.map((r) => r.data));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const item = req.body;
      if (!item.id) item.id = createId();
      await pool.query(
        `INSERT INTO ${table} (id, data) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET data = $2`,
        [item.id, item]
      );
      res.json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  router.delete("/", async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "id é obrigatório" });
      await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  return router;
}

app.use("/api/clients", createResourceRouter("clients"));
app.use("/api/themes", createResourceRouter("themes"));
app.use("/api/quotes", createResourceRouter("quotes"));

app.use(express.static(path.join(__dirname), {
  dotfiles: "ignore",
  index: "index.html",
}));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
