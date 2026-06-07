# Sweet & Salao — Deploy & Setup Guide

## 1. Fixing the blank page on sweetnsalao.com

The website code is healthy. A blank page on the custom domain almost always means the
domain is not fully connected to the Netlify site (DNS or SSL not finished). Work through
this in order:

### Step 1 — Confirm the deploy itself works
1. Netlify dashboard -> your site -> **Deploys**. Latest should say **Published**.
2. Click the auto-generated URL at the top (looks like `name-12345.netlify.app`).
3. If that URL shows the site, the code/deploy is fine and the problem is the domain (Step 2).

### Step 2 — Connect the custom domain
1. Netlify -> **Domain management** -> add `sweetnsalao.com` and `www.sweetnsalao.com`.
2. At your domain registrar, point DNS to Netlify, EITHER:
   - Use **Netlify DNS** (change nameservers to the ones Netlify lists), OR
   - Add an **A record** for the root domain to `75.2.60.5`
     and a **CNAME** for `www` to your `name-12345.netlify.app`.
3. Wait for **HTTPS/SSL** to provision (Netlify does this automatically once DNS resolves;
   can take 15 minutes to a few hours). The "Not secure" warning disappears when this finishes.

### Step 3 — If the .netlify.app URL is ALSO blank
This means the ordering functions did not bundle. Use a Git deploy instead of drag-and-drop
(see Section 3), because the backend needs `npm install` to run, which drag-and-drop skips.

---

## 2. The site works WITHOUT a backend

The menu, cart, checkout, payment QR codes, and WhatsApp ordering all work as a pure static
site. The Netlify Functions only add: the admin editor and automatic email/SMS notifications.
If functions are not running, customers can still order (WhatsApp + payment still work).

---

## 3. Two ways to deploy

### A) Drag-and-drop (simplest, static only)
Drag the unzipped folder onto Netlify. Menu + ordering + WhatsApp + QR all work.
The admin editor and auto-email/SMS will NOT work this way (functions need npm install).

### B) Git-connected (recommended — enables everything)
1. Push this folder to a GitHub repo.
2. Netlify -> Add new site -> Import from Git -> pick the repo.
3. Build command: leave blank. Publish directory: `.` (root).
4. Netlify auto-installs dependencies and bundles the functions.

---

## 4. Turning on order notifications (the trifecta)

Orders always reach the truck by **WhatsApp** (free, built in — the customer taps "Send order
on WhatsApp" after paying). To also get **email** and **SMS**, add these environment variables
in Netlify -> Site settings -> Environment variables:

### Email (free tier via Resend.com)
- `RESEND_API_KEY` = your Resend API key (this is the ONE thing required to turn email on)
- `ORDER_EMAIL_TO` = optional. Orders already go to sweetandsalaobychefcarmen@gmail.com by default. Set this only to change or add recipients (comma-separate for more than one).
- `ORDER_EMAIL_FROM` = a verified sender (e.g. orders@sweetandsalao.com)

### SMS (paid — Twilio; optional, switch on when ready)
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM` = your Twilio number, e.g. +1386XXXXXXX
- `ORDER_SMS_TO` = 13862156720,13862156381 (comma-separated; both lines)

Every notification includes the **payment method the customer chose** (Zelle or Cash App),
the full item list, total, and the customer's name + phone, so Chef Carmen can confirm
payment before cooking.

---

## 5. Payment QR codes
- Cash App QR -> opens cash.app/$SweetSalao (fully working).
- Zelle QR -> encodes 386-215-6720. For the most reliable Zelle experience, you can replace
  `/assets/qr-zelle.png` with the official "My Zelle QR code" exported from the bank app.
