const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DB_PATH = path.join(ROOT, ".local-db.json");
const RESOURCES = new Set(["clients", "themes", "quotes"]);
const SESSION_TTL_MS = 15 * 60 * 1000;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function createId() {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

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

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    return { clients: [], themes: [], quotes: [] };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    return {
      clients: Array.isArray(parsed.clients) ? parsed.clients : [],
      themes: Array.isArray(parsed.themes) ? parsed.themes : [],
      quotes: Array.isArray(parsed.quotes) ? parsed.quotes : [],
    };
  } catch {
    return { clients: [], themes: [], quotes: [] };
  }
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload muito grande"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body ? JSON.parse(body) : {}));
    req.on("error", reject);
  });
}

async function handleApi(req, res, url) {
  const [, , resource] = url.pathname.split("/");
  if (resource === "auth") {
    if (req.method === "GET") {
      sendJson(res, 200, { ok: true });
      return;
    }
    if (req.method === "POST") {
      const body = await readRequestBody(req);
      const session = authenticatePassword(body.password);
      if (!session) {
        sendJson(res, 401, { error: "Senha incorreta" });
        return;
      }
      sendJson(res, 200, session);
      return;
    }
    res.writeHead(405, { Allow: "GET, POST" });
    res.end();
    return;
  }

  if (!RESOURCES.has(resource)) {
    sendJson(res, 404, { error: "Recurso nao encontrado" });
    return;
  }

  if (!verifyAuthHeader(req.headers.authorization || "")) {
    sendJson(res, 401, { error: "Nao autorizado" });
    return;
  }

  const db = readDb();

  if (req.method === "GET") {
    sendJson(res, 200, db[resource]);
    return;
  }

  if (req.method === "POST" || req.method === "PUT") {
    const item = await readRequestBody(req);
    if (!item.id) item.id = createId();
    const index = db[resource].findIndex((saved) => String(saved.id) === String(item.id));
    if (index >= 0) db[resource][index] = item;
    else db[resource].push(item);
    writeDb(db);
    sendJson(res, 200, item);
    return;
  }

  if (req.method === "DELETE") {
    const id = url.searchParams.get("id");
    if (!id) {
      sendJson(res, 400, { error: "id e obrigatorio" });
      return;
    }
    db[resource] = db[resource].filter((item) => String(item.id) !== String(id));
    writeDb(db);
    res.writeHead(204);
    res.end();
    return;
  }

  res.writeHead(405, { Allow: "GET, POST, PUT, DELETE" });
  res.end();
}

function serveStatic(req, res, url) {
  const requestedPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.resolve(ROOT, `.${requestedPath}`);

  const relativePath = path.relative(ROOT, filePath);
  const hasDotSegment = relativePath.split(path.sep).some((part) => part.startsWith("."));
  if (!filePath.startsWith(ROOT) || hasDotSegment) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  const finalPath = fs.existsSync(filePath) && fs.statSync(filePath).isFile()
    ? filePath
    : path.join(ROOT, "index.html");

  fs.readFile(finalPath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mimeTypes[path.extname(finalPath).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Erro interno do servidor local" });
  }
});

server.listen(PORT, () => {
  console.log(`Servidor local rodando em http://localhost:${PORT}`);
  console.log(`Dados locais: ${DB_PATH}`);
});
