import { json } from "./lib/auth.js";
import { readContent, writeOrder } from "./lib/store.js";

export default async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  const body = await request.json().catch(() => ({}));
  const content = await readContent();
  const products = new Map((content.products || []).map((item) => [item.id, item]));
  const items = Array.isArray(body.items) ? body.items.map((item) => {
    const product = products.get(item.id);
    if (!product || !product.available || product.marketPrice || !Number.isFinite(Number(product.price))) return null;
    const quantity = Math.max(1, Math.min(20, Number(item.quantity || 1)));
    return { id: product.id, name: product.name, price: Number(product.price), quantity };
  }).filter(Boolean) : [];
  if (!items.length) return json({ error: "No available menu items were submitted." }, 400);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const customer = sanitizeCustomer(body.customer);
  if (!customer.name || !customer.phone) return json({ error: "Name and phone are required." }, 400);
  const fulfillment = body.fulfillment === "doordash" ? "doordash" : "pickup";
  const payment = ["zelle", "cashapp"].includes(body.payment) ? body.payment : null;

  const order = await writeOrder({ customer, fulfillment, payment, items, total });

  // Fire notifications (email + SMS) without blocking the customer response.
  const notify = buildNotification({ order, customer, fulfillment, payment, items, total });
  await Promise.allSettled([
    sendEmail(notify),
    sendSms(notify)
  ]);

  return json({
    ok: true,
    orderId: order.id,
    message: fulfillment === "doordash"
      ? "Order submitted. Complete delivery through DoorDash if prompted."
      : "Order placed! Your order is NOT confirmed until Chef Carmen verifies your payment. Send your payment now using the button below, then tap WhatsApp to notify us. We'll confirm and start cooking once the payment lands."
  });
};

function buildNotification({ order, customer, fulfillment, payment, items, total }) {
  const lines = items.map((i) => `  ${i.quantity}x ${i.name} ($${(i.price * i.quantity).toFixed(2)})`).join("\n");
  const payLabel = payment === "zelle" ? "ZELLE" : payment === "cashapp" ? "CASH APP" : "Not specified";
  const method = fulfillment === "doordash" ? "DoorDash delivery" : "PICKUP at window";
  const shortId = String(order.id).slice(-6).toUpperCase();
  const payWarning = fulfillment === "doordash"
    ? "Payment is handled by DoorDash for delivery orders."
    : `*** DO NOT START COOKING YET ***
Open your ${payLabel === "ZELLE" ? "Zelle" : payLabel === "CASH APP" ? "Cash App" : "payment"} app and confirm you actually received $${total.toFixed(2)} from this customer.
A placed order does NOT mean payment was sent. Verify the money landed before preparing this order.`;
  const text =
`NEW SWEET & SALAO ORDER #${shortId}
${method}
PAYMENT: ${payLabel}

${lines}

TOTAL: $${total.toFixed(2)}

Customer: ${customer.name}
Phone: ${customer.phone}${customer.notes ? `\nNotes: ${customer.notes}` : ""}

${payWarning}`;
  const subject = `New Order #${shortId} — $${total.toFixed(2)} — ${payLabel} (${fulfillment === "doordash" ? "DoorDash" : "Pickup"})`;
  return { text, subject, shortId };
}

// Email via Resend (free tier). Sends to the owner for every order.
async function sendEmail({ subject, text }) {
  const key = process.env.RESEND_API_KEY;
  // Owner notification inbox. Env var ORDER_EMAIL_TO can override/add more (comma-separated).
  const to = process.env.ORDER_EMAIL_TO || "sweetandsalaobychefcarmen@gmail.com";
  const from = process.env.ORDER_EMAIL_FROM || "orders@send.sweetnsalao.com";
  if (!key || !to) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), subject, text })
  }).catch(() => {});
}

// SMS via Twilio. No-op if env vars are not set (owner switches on when ready).
async function sendSms({ text }) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  const to = process.env.ORDER_SMS_TO;
  if (!sid || !token || !from || !to) return;
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  for (const dest of to.split(",").map((s) => s.trim())) {
    const params = new URLSearchParams({ From: from, To: dest, Body: text.slice(0, 1500) });
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    }).catch(() => {});
  }
}

function sanitizeCustomer(customer = {}) {
  return {
    name: clean(customer.name).slice(0, 80),
    phone: clean(customer.phone).slice(0, 40),
    address: clean(customer.address).slice(0, 180),
    notes: clean(customer.notes).slice(0, 400)
  };
}

function clean(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}
