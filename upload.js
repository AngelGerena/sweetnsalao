import crypto from "node:crypto";
import { json, requireAdmin } from "./lib/auth.js";
import { writeMedia } from "./lib/store.js";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

export default async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  if (!requireAdmin(request)) return json({ error: "Admin session required." }, 401);
  const body = await request.json().catch(() => ({}));
  const type = String(body.type || "");
  if (!ALLOWED_TYPES.has(type)) return json({ error: "Upload a JPG, PNG, or WebP image." }, 400);
  const bytes = Buffer.from(String(body.data || ""), "base64");
  if (!bytes.length || bytes.length > MAX_BYTES) return json({ error: "Image must be smaller than 5 MB." }, 400);
  const extension = type.split("/")[1].replace("jpeg", "jpg");
  const key = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  await writeMedia({ key, bytes, type });
  return json({ url: `/media/${key}` });
};
