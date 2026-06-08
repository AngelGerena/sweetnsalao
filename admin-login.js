import { json, requireAdmin } from "./lib/auth.js";
import { readContent, sanitizeContent, writeContent } from "./lib/store.js";

export default async (request) => {
  if (request.method === "GET") {
    return json({ content: await readContent() });
  }
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  if (!requireAdmin(request)) return json({ error: "Admin session required." }, 401);
  const body = await request.json().catch(() => ({}));
  const payload = await writeContent(sanitizeContent(body.content));
  return json({ ok: true, updatedAt: payload.updatedAt });
};
