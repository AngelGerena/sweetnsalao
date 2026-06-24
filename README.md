# Sweet & Salao

Static landing page and owner-editable food truck website with Netlify Functions for content, uploads, and order intake.

## What Is Editable

The owner portal at `/admin.html` can update:

- Business name, tagline, intro, hours, contact details, and hero image
- Menu items, prices, categories, descriptions, availability, and photos
- Zelle, Cash App, pickup, and DoorDash checkout messaging
- Gallery images, page copy, and SEO metadata

Owner edits are saved in Netlify Blobs at runtime. The committed `defaults.js` file is only a fallback seed, so future deploys update code without overwriting live menu edits.

## Required Netlify Environment Variables

- `SWEET_SALAO_ADMIN_PASSWORD`: owner portal password
- `SWEET_SALAO_SESSION_SECRET`: long random string used to sign admin sessions

## DoorDash

DoorDash delivery is represented as a checkout option and can open a DoorDash Storefront URL when one is added in admin settings. A true DoorDash Drive handoff requires a DoorDash merchant/developer account and API credentials; those credentials should be added server-side before automated courier dispatch is enabled.

## Local Development

Install dependencies and run Netlify Dev:

```bash
npm install
npm run dev
```

Then open:

- Site: `http://localhost:8888`
- Admin: `http://localhost:8888/admin.html`

For local admin login, set the required environment variables before starting Netlify Dev.
