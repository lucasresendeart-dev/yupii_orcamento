import crypto from "crypto";

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

export function authenticatePassword(password) {
  if (!sessionSecret()) return null;
  const user = configuredUsers().find((item) => item.password === password);
  if (!user) return null;
  const payload = Buffer.from(JSON.stringify({
    role: user.role,
    exp: Date.now() + SESSION_TTL_MS,
  })).toString("base64url");
  return { role: user.role, token: `${payload}.${sign(payload)}` };
}

export function verifyAuthHeader(header = "") {
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
