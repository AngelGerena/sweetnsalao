import { json, requireAdmin } from "./lib/auth.js";
import { readOrders } from "./lib/store.js";

// Admin-only: returns saved orders (newest first) for the "Recent Orders" dashboard.
export default async (request) => {
  if (request.method !== "GET") return json({ error: "Method not allowed." }, 405);
  if (!requireAdmin(request)) return json({ error: "Admin session required." }, 401);
  const orders = await readOrders(100);
  return json({ orders });
};
