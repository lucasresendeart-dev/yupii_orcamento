const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

app.use(express.json());

const SESSION_TTL_MS = 15 * 60 * 1000;

function configuredUsers() {
  return [
    { role: "admin", password: process.env.APP_ADMIN_PASSWORD },
    { role: "user", password: process.env.APP_USER_PASSWORD },
  ].filter((user) => user.password);
}

function sessionSecret() {
  return process.env.AUTH_SESSION_SECRET || process.env.APP_ADMIN_PASSWORD || process.env.APP_USER_PASSWORD || "";
}

function sign(payload) {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function authenticatePassword(password) {
  if (!sessionSecret()) return null;
  const user = configuredUsers().find((item) => item.password === password);
  if (!user) return null;
  const payload = Buffer.from(JSON.stringify({
    role: user.role,
    exp: Date.now() + SESSION_TTL_MS,
  })).toString("base64url");
  return { role: user.role, token: `${payload}.${sign(payload)}` };
}

function verifyAuthHeader(header = "") {
  if (!sessionSecret()) return false;
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const [payload, signature] = token.split(".");
  if (!payload || !signature || sign(payload) !== signature) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Number(session.exp || 0) > Date.now();
  } catch {
    return false;
  }
}

function requireAuth(req, res, next) {
  if (!verifyAuthHeader(req.headers.authorization || "")) {
    return res.status(401).json({ error: "Nao autorizado" });
  }
  next();
}

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

app.get("/api/auth", (req, res) => res.json({ ok: true }));
app.post("/api/auth", (req, res) => {
  const session = authenticatePassword(req.body?.password);
  if (!session) return res.status(401).json({ error: "Senha incorreta" });
  return res.json(session);
});

app.use("/api/clients", requireAuth, createResourceRouter("clients"));
app.use("/api/themes", requireAuth, createResourceRouter("themes"));
app.use("/api/quotes", requireAuth, createResourceRouter("quotes"));

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
