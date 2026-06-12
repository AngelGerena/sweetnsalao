import crypto from "node:crypto";

const COOKIE_NAME = "sweet_salao_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

export function getEnv(name) {
  return globalThis.Netlify?.env?.get(name) || process.env[name] || "";
}

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...headers
    }
  });
}

export function createSessionCookie(request) {
  const secret = getSessionSecret();
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `admin.${expires}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  const token = `${payload}.${signature}`;
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${isHttps(request) ? "; Secure" : ""}`;
}

export function clearSessionCookie(request) {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isHttps(request) ? "; Secure" : ""}`;
}

export function requireAdmin(request) {
  const secret = getSessionSecret();
  const token = readCookie(request.headers.get("cookie") || "", COOKIE_NAME);
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expiry, signature] = parts;
  if (role !== "admin" || Number(expiry) < Math.floor(Date.now() / 1000)) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${role}.${expiry}`).digest("base64url");
  if (Buffer.byteLength(signature) !== Buffer.byteLength(expected)) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function verifyPassword(input) {
  const expected = getEnv("SWEET_SALAO_ADMIN_PASSWORD");
  if (!expected) return false;
  const cleanInput = normalizeSecret(input);
  const cleanExpected = normalizeSecret(expected);
  if (Buffer.byteLength(cleanInput) !== Buffer.byteLength(cleanExpected)) return false;
  return crypto.timingSafeEqual(Buffer.from(cleanInput), Buffer.from(cleanExpected));
}

function getSessionSecret() {
  return getEnv("SWEET_SALAO_SESSION_SECRET") || getEnv("SWEET_SALAO_ADMIN_PASSWORD") || "missing-session-secret";
}

function normalizeSecret(value = "") {
  return String(value).replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
}

function readCookie(cookieHeader, name) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function isHttps(request) {
  return new URL(request.url).protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
}
