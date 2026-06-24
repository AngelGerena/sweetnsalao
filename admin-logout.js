import { clearSessionCookie, json } from "./lib/auth.js";

export default async (request) => json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie(request) });
