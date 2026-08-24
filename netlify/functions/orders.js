import { json, requireAdmin } from "./lib/auth.js";
import { readOrders, deleteOrder } from "./lib/store.js";

// Admin-only: list saved orders (GET) or delete one by id (DELETE ?id=...).
// Powers the "Recent Orders" dashboard and its per-row trash button.
export default async (request) => {
  if (!requireAdmin(request)) return json({ error: "Admin session required." }, 401);

  if (request.method === "GET") {
    return json({ orders: await readOrders(100) });
  }

  if (request.method === "DELETE") {
    const id = new URL(request.url).searchParams.get("id") || "";
    if (!id) return json({ error: "Missing order id." }, 400);
    const ok = await deleteOrder(id);
    return json({ ok }, ok ? 200 : 500);
  }

  return json({ error: "Method not allowed." }, 405);
};
