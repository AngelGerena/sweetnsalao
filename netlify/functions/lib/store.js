import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { defaultContent } from "../../../defaults.js";

const CONTENT_KEY = "live";
const ORDER_PREFIX = "orders/";
const DATA_DIR = path.join(process.cwd(), ".data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

export async function readContent() {
  try {
    const store = getStore("sweet-salao-content");
    const live = await store.get(CONTENT_KEY, { type: "json" });
    return live?.content ? live.content : live || defaultContent;
  } catch {
    try {
      const raw = await fs.readFile(CONTENT_FILE, "utf8");
      return JSON.parse(raw).content;
    } catch {
      return defaultContent;
    }
  }
}

export async function writeContent(content) {
  const payload = { content, updatedAt: new Date().toISOString() };
  try {
    const store = getStore("sweet-salao-content");
    await store.setJSON(CONTENT_KEY, payload);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(CONTENT_FILE, JSON.stringify(payload, null, 2));
  }
  return payload;
}

export async function writeOrder(order) {
  const payload = { ...order, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  try {
    const store = getStore("sweet-salao-orders");
    await store.setJSON(`${ORDER_PREFIX}${payload.id}`, payload);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    let orders = [];
    try {
      orders = JSON.parse(await fs.readFile(ORDERS_FILE, "utf8"));
    } catch {
      orders = [];
    }
    orders.push(payload);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
  }
  return payload;
}

export async function writeMedia({ key, bytes, type }) {
  try {
    const store = getStore("sweet-salao-media");
    await store.set(key, bytes, {
      metadata: { type },
      contentType: type
    });
  } catch {
    await fs.mkdir(path.join(DATA_DIR, "media"), { recursive: true });
    await fs.writeFile(path.join(DATA_DIR, "media", key), bytes);
  }
}

export async function readMedia(key) {
  try {
    const store = getStore("sweet-salao-media");
    const blob = await store.get(key, { type: "arrayBuffer" });
    if (!blob) return null;
    return { bytes: Buffer.from(blob), type: mimeFromName(key) };
  } catch {
    try {
      const bytes = await fs.readFile(path.join(DATA_DIR, "media", key));
      return { bytes, type: mimeFromName(key) };
    } catch {
      return null;
    }
  }
}

export function sanitizeContent(input) {
  const safe = sanitizeValue(input || {});
  safe.products = Array.isArray(safe.products) ? safe.products.map(sanitizeProduct).filter((item) => item.name) : [];
  safe.gallery = Array.isArray(safe.gallery) ? safe.gallery.map(asString).filter(Boolean).slice(0, 12) : [];
  return safe;
}

function sanitizeProduct(product) {
  const hasPrice = product.price !== null && product.price !== undefined && product.price !== "" && Number.isFinite(Number(product.price));
  return {
    id: slug(product.id || product.name || crypto.randomUUID()),
    name: asString(product.name).slice(0, 80),
    category: asString(product.category || "Menu").slice(0, 40),
    price: hasPrice ? Math.max(0, Number(product.price)) : null,
    description: asString(product.description).slice(0, 400),
    description_es: asString(product.description_es).slice(0, 400),
    note: product.note ? asString(product.note).slice(0, 200) : undefined,
    note_es: product.note_es ? asString(product.note_es).slice(0, 200) : undefined,
    image: product.image ? asString(product.image).slice(0, 500) : null,
    available: Boolean(product.available),
    featured: Boolean(product.featured),
    marketPrice: Boolean(product.marketPrice)
  };
}

function asString(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

function sanitizeValue(value) {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, sanitizeValue(child)]));
  }
  if (typeof value === "string") return asString(value);
  return value;
}

function slug(value) {
  const clean = String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return clean || crypto.randomUUID();
}

function mimeFromName(name) {
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}
