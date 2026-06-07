import { createSessionCookie, json, verifyPassword } from "./lib/auth.js";

export default async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  const { password = "" } = await request.json().catch(() => ({}));
  if (!verifyPassword(password)) return json({ error: "Invalid admin password or missing SWEET_SALAO_ADMIN_PASSWORD." }, 401);
  return json({ ok: true }, 200, { "Set-Cookie": createSessionCookie(request) });
};
