import { defaultContent } from "./defaults.js";
import { i18n, getLang, setLang } from "./i18n.js";

let lang = getLang();
const t = (key) => (i18n[lang] && i18n[lang][key]) || i18n.en[key] || key;

let content = structuredClone(defaultContent);
let visibleCategory = "All";
const cart = new Map();

const money = (value) => Number.isFinite(Number(value))
  ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value))
  : "MP";
const byId = (id) => document.getElementById(id);
const catClass = (category) => "cat-" + String(category).replace(/[^a-z0-9]/gi, "");

async function loadContent() {
  try {
    const response = await fetch("/api/content", { headers: { Accept: "application/json" } });
    if (response.ok) {
      const data = await response.json();
      content = mergeContent(defaultContent, data.content || data);
    }
  } catch {
    content = structuredClone(defaultContent);
  }
  renderSite();
}

function mergeContent(base, live) {
  if (Array.isArray(base)) return Array.isArray(live) ? live : base;
  if (!base || typeof base !== "object") return live ?? base;
  const result = { ...base };
  for (const [key, value] of Object.entries(live || {})) {
    result[key] = value && typeof value === "object" && !Array.isArray(value)
      ? mergeContent(base[key] || {}, value)
      : value;
  }
  return result;
}

function renderSite() {
  document.title = content.seo?.title || content.business.name;
  const metaDesc = document.querySelector("meta[name='description']");
  if (metaDesc) metaDesc.content = content.seo?.description || content.business.intro;

  byId("hero-bg").style.backgroundImage = `url("${content.business.heroImage}")`;
  byId("nav-logo").src = content.business.logoImage;
  byId("hero-logo").src = content.business.logoImage;
  byId("business-name").textContent = content.business.name;
  byId("tagline").textContent = content.business.tagline;
  const hoursEl = byId("hours");
  if (hoursEl) hoursEl.textContent = content.business.hours || "";
  byId("location").textContent = content.business.location;
  byId("location-2").textContent = content.business.location;
  byId("featured-title").textContent = content.sections.featuredTitle;
  byId("story-title").textContent = content.sections.storyTitle;
  byId("story-text").textContent = content.sections.storyText;
  byId("zelle-handle").textContent = content.ordering.zelleHandle;
  byId("cashapp-handle").textContent = content.ordering.cashAppHandle;
  byId("delivery-note").textContent = content.ordering.pickupInstructions;
  byId("contact-link").href = `mailto:${content.business.email}`;

  // Phone link (first number)
  const firstPhone = String(content.business.phone || "").split("/")[0].replace(/[^0-9]/g, "");
  const phoneLink = byId("phone-link");
  if (firstPhone) { phoneLink.href = `tel:${firstPhone}`; phoneLink.textContent = content.business.phone.split("/")[0].trim(); }

  // Verse
  if (content.business.verse) {
    byId("hero-verse").textContent = content.business.verse;
  }

  // DoorDash links everywhere
  wireDoorDash();
  renderHours();
  renderAddress();
  renderSocial();
  renderMarquee();
  renderFilters();
  renderMenu();
  renderGallery();
  renderReviews();
  renderCart();
  applyLang();
  applyAvailability();
}

function wireDoorDash() {
  const url = content.ordering.doorDashStoreUrl;
  ["dd-topbar", "dd-nav", "dd-hero", "dd-order", "dd-story", "dd-continue"].forEach((id) => {
    const el = byId(id);
    if (!el) return;
    if (url) { el.href = url; el.style.display = ""; }
    else { el.style.display = "none"; }
  });
}

/* ---------- Hours grid ---------- */
function renderHours() {
  const grid = byId("hours-grid");
  if (!grid) return;
  const sched = content.business?.hoursSchedule;
  const note = byId("hours");

  // If no structured schedule, fall back to the legacy single-line note.
  if (!sched || typeof sched !== "object") {
    grid.innerHTML = "";
    if (note) { note.hidden = false; note.textContent = content.business?.hours || ""; }
    return;
  }
  if (note) note.hidden = true;

  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const labels = {
    en: { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" },
    es: { mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom" }
  };
  const closedWord = { en: "Closed", es: "Cerrado" };
  const todayIdx = (new Date().getDay() + 6) % 7; // JS Sun=0 -> our Mon=0 index

  grid.innerHTML = dayKeys.map((key, i) => {
    let value = String(sched[key] || "").trim();
    const isClosed = /^closed$|^cerrado$/i.test(value);
    if (isClosed) value = closedWord[lang] || "Closed";
    const isToday = i === todayIdx;
    return `<div class="hours-day ${isToday ? "is-today" : ""} ${isClosed ? "is-closed" : ""}">
      <span class="hours-dow">${labels[lang]?.[key] || labels.en[key]}</span>
      <span class="hours-time">${escapeHtml(value)}</span>
    </div>`;
  }).join("");
}

/* ---------- Address ---------- */
function renderAddress() {
  const addr = content.business?.address || {};
  const parts = [addr.placedAt, addr.street, addr.cityStateZip].map((p) => String(p || "").trim()).filter(Boolean);
  const oneLine = parts.join(" · ");
  const mapUrl = String(addr.mapUrl || "").trim()
    || (parts.length ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([addr.street, addr.cityStateZip].filter(Boolean).join(" "))}` : "");

  const link = byId("address-link");
  if (link) {
    if (oneLine) { link.textContent = oneLine; link.href = mapUrl || "#"; link.style.display = ""; }
    else { link.style.display = "none"; }
  }
  const foot = byId("footer-address");
  if (foot) foot.textContent = oneLine;
}

/* ---------- Social icons ---------- */
function socialSvg(kind) {
  if (kind === "facebook") {
    return `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>`;
  }
  return `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.52.01-4.76.07-.99.05-1.53.21-1.89.35-.47.18-.81.4-1.17.76-.36.36-.58.7-.76 1.17-.14.36-.3.9-.35 1.89-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.05.99.21 1.53.35 1.89.18.47.4.81.76 1.17.36.36.7.58 1.17.76.36.14.9.3 1.89.35 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.99-.05 1.53-.21 1.89-.35.47-.18.81-.4 1.17-.76.36-.36.58-.7.76-1.17.14-.36.3-.9.35-1.89.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.05-.99-.21-1.53-.35-1.89a3.15 3.15 0 0 0-.76-1.17 3.15 3.15 0 0 0-1.17-.76c-.36-.14-.9-.3-1.89-.35-1.24-.06-1.61-.07-4.76-.07zm0 3.06a5.12 5.12 0 1 1 0 10.24 5.12 5.12 0 0 1 0-10.24zm0 1.8a3.32 3.32 0 1 0 0 6.64 3.32 3.32 0 0 0 0-6.64zm5.34-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg>`;
}

function renderSocial() {
  const social = content.business?.social || {};
  const links = [];
  if (String(social.facebook || "").trim()) links.push({ kind: "facebook", url: social.facebook.trim(), label: "Facebook" });
  if (String(social.instagram || "").trim()) links.push({ kind: "instagram", url: social.instagram.trim(), label: "Instagram" });

  const html = links.map((l) => `<a class="social-link social-${l.kind}" href="${escapeAttr(l.url)}" target="_blank" rel="noopener noreferrer" aria-label="${l.label}">${socialSvg(l.kind)}</a>`).join("");
  ["social-row-top", "social-row-footer"].forEach((id) => {
    const el = byId(id);
    if (el) el.innerHTML = html;
  });
}

function renderMarquee() {
  const items = ["Loaded Fries", "Churrasco", "Seafood Cups", "Pastelillos", "Pinchos", "Mofongo", "Flan", "Alcapurrias", "Mar y Tierra", "Jugos Naturales"];
  const run = items.map((t) => `<span>${escapeHtml(t)}</span>`).join("");
  byId("marquee-track").innerHTML = run + run; // doubled for seamless loop
}

/* ---------- Availability (Away / Closed) ---------- */
function isAway() {
  return !!(content.availability && content.availability.away);
}

function formatBack() {
  const a = content.availability || {};
  if (!a.backDate) return "";
  // Build a readable, locale-aware date from YYYY-MM-DD without timezone drift
  const [y, m, d] = String(a.backDate).split("-").map(Number);
  if (!y || !m || !d) return "";
  const date = new Date(y, m - 1, d);
  const locale = lang === "es" ? "es-ES" : "en-US";
  const dateStr = date.toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric" });
  let timeStr = "";
  if (a.backTime) {
    const [hh, mm] = String(a.backTime).split(":").map(Number);
    if (!Number.isNaN(hh)) {
      const td = new Date(2000, 0, 1, hh, mm || 0);
      timeStr = td.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
    }
  }
  return timeStr ? `${dateStr} ${t("at")} ${timeStr}` : dateStr;
}

function applyAvailability() {
  const away = isAway();
  const a = content.availability || {};
  const msg = (lang === "es" && a.message_es) ? a.message_es : (a.message || "");
  const backLine = formatBack();
  const backText = backLine ? `${t("backOn")} ${backLine}.` : "";

  // Banner
  const banner = byId("closed-banner");
  if (banner) {
    banner.hidden = !away;
    if (away) {
      byId("closed-banner-title").textContent = msg || t("closedTitle");
      byId("closed-banner-back").textContent = backText;
    }
  }

  // Overlay (only auto-show once per closure state per session)
  const overlay = byId("closed-overlay");
  if (overlay) {
    if (away) {
      byId("closed-modal-title").textContent = t("closedTitle");
      byId("closed-modal-msg").textContent = msg;
      byId("closed-modal-back").textContent = backText;
      byId("closed-modal-close").textContent = t("closedGotIt");
      const seenKey = "ss_closed_seen_" + (a.backDate || "") + (a.backTime || "");
      if (!sessionStorage.getItem(seenKey)) {
        overlay.hidden = false;
        document.body.classList.add("no-scroll");
      }
      byId("closed-modal-close").onclick = () => {
        overlay.hidden = true;
        document.body.classList.remove("no-scroll");
        sessionStorage.setItem(seenKey, "1");
      };
    } else {
      overlay.hidden = true;
      document.body.classList.remove("no-scroll");
    }
  }

  // Lock down ALL ordering when away
  document.body.classList.toggle("is-closed", away);
  lockOrdering(away);
}

function lockOrdering(locked) {
  // Add-to-order buttons
  document.querySelectorAll(".add-btn[data-add]").forEach((b) => {
    b.disabled = locked;
    b.title = locked ? t("orderingDisabled") : "";
  });
  // Cart submit, WhatsApp sends, DoorDash links, pay step, sticky cart, cart toggle
  ["order-form", "wa-send-1", "wa-send-2", "dd-continue", "dd-topbar", "dd-nav", "dd-hero", "dd-order", "dd-story", "sticky-cart"].forEach((id) => {
    const el = byId(id);
    if (!el) return;
    if (id === "order-form") {
      el.querySelectorAll("input, textarea, button").forEach((f) => { f.disabled = locked; });
    } else if (el.tagName === "A") {
      el.style.pointerEvents = locked ? "none" : "";
      el.style.opacity = locked ? ".45" : "";
      if (locked) el.setAttribute("aria-disabled", "true"); else el.removeAttribute("aria-disabled");
    } else {
      el.disabled = locked;
    }
  });
}


function renderFilters() {
  const categories = ["All", ...new Set(content.products.filter((item) => item.available).map((item) => item.category))];
  byId("category-filters").innerHTML = categories.map((category) => (
    `<button class="${category === visibleCategory ? "active" : ""}" data-category="${escapeAttr(category)}">${category === "All" ? escapeHtml(t("all")) : escapeHtml(category)}</button>`
  )).join("");
  byId("category-filters").querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      visibleCategory = button.dataset.category;
      renderFilters();
      renderMenu();
    });
  });
}

function renderMenu() {
  const products = content.products.filter((item) => item.available && (visibleCategory === "All" || item.category === visibleCategory));
  byId("menu-grid").innerHTML = products.map((item, i) => `
    <article class="menu-card ${item.image ? "" : "no-photo"}" style="animation-delay:${Math.min(i * 45, 400)}ms">
      ${item.image ? `
      <div class="menu-media">
        <img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.name)}" loading="lazy">
        <span class="cat-tag ${catClass(item.category)}">${escapeHtml(item.category)}</span>
        ${item.featured ? `<span class="fav-star" title="Customer favorite">★</span>` : ""}
      </div>` : ""}
      <div class="menu-body">
        ${item.image ? "" : `<span class="cat-tag inline ${catClass(item.category)}">${escapeHtml(item.category)}</span>`}
        <div class="menu-meta">
          <h3>${escapeHtml(item.name)}</h3>
          <span class="price ${item.marketPrice ? "mp" : ""}">${item.marketPrice ? t("marketPriceLabel") : money(item.price)}</span>
        </div>
        <p>${escapeHtml(lang === "es" && item.description_es ? item.description_es : item.description)}</p>
        ${item.note ? `<p class="menu-note">${escapeHtml(lang === "es" && item.note_es ? item.note_es : item.note)}</p>` : ""}
        ${isOrderable(item)
          ? `<button class="add-btn" data-add="${escapeAttr(item.id)}">${t("addToOrder")}</button>`
          : `<button class="add-btn" type="button" disabled>${t("callForPrice")}</button>`}
      </div>
    </article>
  `).join("");
  byId("menu-grid").querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      if (isAway()) return;
      addToCart(button.dataset.add);
      button.classList.add("added");
      button.textContent = t("added");
      setTimeout(() => { button.classList.remove("added"); button.textContent = t("addToOrder"); }, 1100);
    });
  });
  if (isAway()) lockOrdering(true);
}

let galleryImages = [];
let galleryIndex = 0;
let galleryTimer = null;
let lightboxIndex = 0;

function renderGallery() {
  galleryImages = (content.gallery || []).filter(Boolean);
  const wrap = byId("gallery");
  if (!galleryImages.length) { wrap.innerHTML = ""; return; }

  wrap.innerHTML = `
    <div class="carousel" id="carousel">
      <div class="carousel-track" id="carousel-track">
        ${galleryImages.map((src, i) => `
          <button class="carousel-slide" data-lb="${i}" aria-label="View image ${i + 1}">
            <img src="${escapeAttr(src)}" alt="Sweet & Salao food" loading="lazy">
          </button>`).join("")}
      </div>
      <button class="carousel-arrow car-prev" id="car-prev" aria-label="Previous">&#8249;</button>
      <button class="carousel-arrow car-next" id="car-next" aria-label="Next">&#8250;</button>
      <div class="carousel-dots" id="carousel-dots">
        ${galleryImages.map((_, i) => `<button class="car-dot ${i === 0 ? "active" : ""}" data-dot="${i}" aria-label="Go to image ${i + 1}"></button>`).join("")}
      </div>
    </div>`;

  galleryIndex = 0;
  updateCarousel();
  startGalleryAuto();

  const track = byId("carousel-track");
  byId("car-prev").addEventListener("click", () => { stepCarousel(-1); restartGalleryAuto(); });
  byId("car-next").addEventListener("click", () => { stepCarousel(1); restartGalleryAuto(); });
  wrap.querySelectorAll("[data-dot]").forEach((d) => d.addEventListener("click", () => { galleryIndex = Number(d.dataset.dot); updateCarousel(); restartGalleryAuto(); }));
  wrap.querySelectorAll("[data-lb]").forEach((s) => s.addEventListener("click", () => openLightbox(Number(s.dataset.lb))));

  // Pause auto-rotate on hover; resume on leave
  const car = byId("carousel");
  car.addEventListener("mouseenter", stopGalleryAuto);
  car.addEventListener("mouseleave", startGalleryAuto);
}

function updateCarousel() {
  const track = byId("carousel-track");
  if (track) track.style.transform = `translateX(-${galleryIndex * 100}%)`;
  document.querySelectorAll("#carousel-dots .car-dot").forEach((d, i) => d.classList.toggle("active", i === galleryIndex));
}
function stepCarousel(dir) {
  galleryIndex = (galleryIndex + dir + galleryImages.length) % galleryImages.length;
  updateCarousel();
}
function startGalleryAuto() {
  stopGalleryAuto();
  if (galleryImages.length > 1) galleryTimer = setInterval(() => stepCarousel(1), 4000);
}
function stopGalleryAuto() { if (galleryTimer) { clearInterval(galleryTimer); galleryTimer = null; } }
function restartGalleryAuto() { startGalleryAuto(); }

/* ---------- Reviews / Testimonials ---------- */
let reviewItems = [];
let reviewIndex = 0;
let reviewTimer = null;

function renderReviews() {
  const section = byId("reviews");
  if (!section) return;
  const reviews = content.reviews || {};
  reviewItems = Array.isArray(reviews.items) ? reviews.items.filter((r) => r && (r.text || r.text_es)) : [];

  // Hide the whole section if there are no reviews to show.
  if (!reviewItems.length) { section.hidden = true; return; }
  section.hidden = false;

  // Section title (bilingual)
  const titleEl = byId("reviews-title");
  if (titleEl) titleEl.textContent = (lang === "es" && reviews.titleEs) ? reviews.titleEs : (reviews.title || titleEl.textContent);

  // Build the carousel slides
  const wrap = byId("reviews-carousel");
  wrap.innerHTML = `
    <div class="review-viewport">
      <div class="review-track" id="review-track">
        ${reviewItems.map((r) => {
          const body = (lang === "es" && r.text_es) ? r.text_es : (r.text || r.text_es || "");
          const name = escapeHtml(r.name || "Guest");
          return `
          <figure class="review-slide">
            <div class="review-stars" aria-hidden="true">★★★★★</div>
            <blockquote class="review-text">${escapeHtml(body)}</blockquote>
            <figcaption class="review-name">— ${name}</figcaption>
          </figure>`;
        }).join("")}
      </div>
    </div>
    ${reviewItems.length > 1 ? `
    <button class="review-nav review-prev" id="review-prev" aria-label="Previous review">&#8249;</button>
    <button class="review-nav review-next" id="review-next" aria-label="Next review">&#8250;</button>
    <div class="review-dots" id="review-dots">
      ${reviewItems.map((_, i) => `<button class="review-dot ${i === 0 ? "active" : ""}" data-rdot="${i}" aria-label="Go to review ${i + 1}"></button>`).join("")}
    </div>` : ""}
  `;

  reviewIndex = 0;
  updateReviews();
  startReviewAuto();

  if (reviewItems.length > 1) {
    byId("review-prev").addEventListener("click", () => { stepReviews(-1); restartReviewAuto(); });
    byId("review-next").addEventListener("click", () => { stepReviews(1); restartReviewAuto(); });
    wrap.querySelectorAll("[data-rdot]").forEach((d) => d.addEventListener("click", () => { reviewIndex = Number(d.dataset.rdot); updateReviews(); restartReviewAuto(); }));
    wrap.addEventListener("mouseenter", stopReviewAuto);
    wrap.addEventListener("mouseleave", startReviewAuto);
  }

  // Wire the Google review button + QR
  const url = String(reviews.reviewUrl || "").trim();
  const valid = url && /^https?:\/\//i.test(url) && !/REPLACE_WITH/i.test(url);
  const btn = byId("review-btn");
  const qr = byId("review-qr");
  const qrImg = byId("review-qr-img");
  if (valid) {
    if (btn) { btn.href = url; btn.style.display = ""; }
    if (qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${encodeURIComponent(url)}`;
    if (qr) qr.style.display = "";
  } else {
    // No valid link yet — hide button + QR so customers never hit a dead end.
    if (btn) btn.style.display = "none";
    if (qr) qr.style.display = "none";
  }
}

function updateReviews() {
  const track = byId("review-track");
  if (track) track.style.transform = `translateX(-${reviewIndex * 100}%)`;
  document.querySelectorAll("#review-dots .review-dot").forEach((d, i) => d.classList.toggle("active", i === reviewIndex));
}
function stepReviews(dir) {
  if (!reviewItems.length) return;
  reviewIndex = (reviewIndex + dir + reviewItems.length) % reviewItems.length;
  updateReviews();
}
function startReviewAuto() {
  stopReviewAuto();
  if (reviewItems.length > 1) reviewTimer = setInterval(() => stepReviews(1), 6000);
}
function stopReviewAuto() { if (reviewTimer) { clearInterval(reviewTimer); reviewTimer = null; } }
function restartReviewAuto() { startReviewAuto(); }

function openLightbox(i) {
  lightboxIndex = i;
  stopGalleryAuto();
  const lb = byId("lightbox");
  updateLightbox();
  lb.hidden = false;
  document.body.classList.add("no-scroll");
}
function updateLightbox() {
  byId("lb-image").src = galleryImages[lightboxIndex] || "";
  byId("lb-counter").textContent = `${lightboxIndex + 1} / ${galleryImages.length}`;
}
function closeLightbox() {
  byId("lightbox").hidden = true;
  document.body.classList.remove("no-scroll");
  if (!isAway()) startGalleryAuto();
}
function lightboxStep(dir) {
  lightboxIndex = (lightboxIndex + dir + galleryImages.length) % galleryImages.length;
  updateLightbox();
}
byId("lb-close").addEventListener("click", closeLightbox);
byId("lb-prev").addEventListener("click", () => lightboxStep(-1));
byId("lb-next").addEventListener("click", () => lightboxStep(1));
byId("lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (byId("lightbox").hidden) return;
  if (e.key === "Escape") closeLightbox();
  else if (e.key === "ArrowLeft") lightboxStep(-1);
  else if (e.key === "ArrowRight") lightboxStep(1);
});

function addToCart(id) {
  if (isAway()) return;
  const product = content.products.find((item) => item.id === id);
  if (!product || !isOrderable(product)) return;
  const existing = cart.get(id) || { product, quantity: 0 };
  existing.quantity += 1;
  cart.set(id, existing);
  renderCart();
}

function renderCart() {
  const rows = [...cart.values()];
  byId("cart-items").innerHTML = rows.length ? rows.map(({ product, quantity }) => `
    <div class="cart-row">
      <div>
        <strong>${escapeHtml(product.name)}</strong><br>
        <small>${money(product.price)} each</small>
      </div>
      <div class="qty">
        <button type="button" data-dec="${escapeAttr(product.id)}" aria-label="Decrease ${escapeAttr(product.name)}">−</button>
        <span>${quantity}</span>
        <button type="button" data-inc="${escapeAttr(product.id)}" aria-label="Increase ${escapeAttr(product.name)}">+</button>
      </div>
    </div>
  `).join("") : `<p class="fine-print">${t("cartEmpty")}</p>`;
  byId("cart-total").textContent = money(total());

  const count = rows.reduce((sum, r) => sum + r.quantity, 0);
  byId("cart-count").textContent = count;
  byId("sticky-cart-count").textContent = `${count} item${count === 1 ? "" : "s"}`;
  byId("sticky-cart-total").textContent = money(total());
  const sticky = byId("sticky-cart");
  sticky.hidden = count === 0;
  sticky.classList.toggle("show", count > 0);

  byId("cart-items").querySelectorAll("[data-inc]").forEach((button) => button.addEventListener("click", () => addToCart(button.dataset.inc)));
  byId("cart-items").querySelectorAll("[data-dec]").forEach((button) => button.addEventListener("click", () => decrease(button.dataset.dec)));
}

function decrease(id) {
  const existing = cart.get(id);
  if (!existing) return;
  existing.quantity -= 1;
  if (existing.quantity <= 0) cart.delete(id);
  renderCart();
}

function total() {
  return [...cart.values()].reduce((sum, row) => sum + Number(row.product.price) * row.quantity, 0);
}

function isOrderable(item) {
  return !item.marketPrice && Number.isFinite(Number(item.price));
}

/* ---------- Cart drawer (mobile) ---------- */
function openCart() { byId("cart-panel").classList.add("open"); document.body.classList.add("cart-open"); }
function closeCart() { byId("cart-panel").classList.remove("open"); document.body.classList.remove("cart-open"); }
byId("cart-toggle").addEventListener("click", () => {
  if (window.innerWidth <= 880) openCart();
  else byId("order").scrollIntoView({ behavior: "smooth" });
});
byId("cart-close").addEventListener("click", closeCart);
byId("sticky-cart").addEventListener("click", () => {
  if (window.innerWidth <= 880) openCart();
  else byId("order").scrollIntoView({ behavior: "smooth" });
});

/* ---------- Header scroll state ---------- */
const header = byId("site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Fulfillment: swap pickup form vs DoorDash hand-off ---------- */
function applyFulfillment(mode) {
  const isDD = mode === "doordash";
  byId("order-form").hidden = isDD;
  byId("dd-panel").hidden = !isDD;
  byId("pay-step").hidden = true; // reset pay step when switching
  const note = byId("delivery-note");
  if (note) note.textContent = isDD ? content.ordering.doorDashInstructions : content.ordering.pickupInstructions;
  byId("order-status").textContent = "";
}
document.querySelectorAll("input[name='fulfillment']").forEach((input) => {
  input.addEventListener("change", () => applyFulfillment(input.value));
});

/* ---------- Build the order text used for WhatsApp + on-screen ---------- */
function buildOrderText({ name, phone, notes, payment, shortId }) {
  const lines = [...cart.values()].map(({ product, quantity }) => `• ${quantity}x ${product.name} ($${(product.price * quantity).toFixed(2)})`).join("\n");
  const payLabel = payment === "zelle" ? "Zelle" : "Cash App";
  return (
`Hi Sweet & Salao! I'd like to place a PICKUP order${shortId ? ` (#${shortId})` : ""}:\n\n` +
`${lines}\n\n` +
`Total: $${total().toFixed(2)}\n` +
`Paying by: ${payLabel}\n\n` +
`Name: ${name}\n` +
`Phone: ${phone}` +
`${notes ? `\nNotes: ${notes}` : ""}`
  );
}

/* ---------- Pickup order submit ---------- */
byId("order-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (isAway()) { byId("order-status").textContent = t("orderingDisabled"); byId("order-status").className = "fine-print err"; return; }
  const status = byId("order-status");
  status.className = "fine-print";
  const items = [...cart.values()].map(({ product, quantity }) => ({ id: product.id, name: product.name, price: product.price, quantity }));
  if (!items.length) {
    status.textContent = "Add at least one item before placing your order.";
    status.classList.add("err");
    return;
  }
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  const payment = data.payment === "cashapp" ? "cashapp" : "zelle";
  const payload = { customer: { name: data.name, phone: data.phone, notes: data.notes }, fulfillment: "pickup", payment, items, total: total() };

  status.textContent = "Placing order…";
  let shortId = "";
  try {
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (result.orderId) shortId = String(result.orderId).slice(-6).toUpperCase();
    status.textContent = "";
  } catch {
    status.textContent = "";
  }

  // Reveal the pay + send step regardless (so the customer can always reach the truck).
  showPayStep({ ...data, payment, shortId });
});

function showPayStep({ name, phone, notes, payment, shortId }) {
  byId("order-form").hidden = true;
  const step = byId("pay-step");
  step.hidden = false;

  byId("pay-step-id").textContent = shortId ? `Order #${shortId}` : "";
  const amount = money(total());
  byId("pay-amount-zelle").textContent = amount;
  byId("pay-amount-cashapp").textContent = amount;

  // Show only the chosen payment block
  byId("pay-block-zelle").hidden = payment !== "zelle";
  byId("pay-block-cashapp").hidden = payment !== "cashapp";

  // Cash App deep link with amount prefilled
  if (payment === "cashapp" && content.ordering.cashAppUrl) {
    const tag = content.ordering.cashAppHandle.replace("$", "");
    byId("cashapp-link").href = `https://cash.app/$${tag}/${total().toFixed(2)}`;
  }

  // WhatsApp deep links to both numbers, pre-filled with the order
  const orderText = encodeURIComponent(buildOrderText({ name, phone, notes, payment, shortId }));
  const nums = content.ordering.whatsappNumbers || [];
  const wa1 = byId("wa-send-1");
  const wa2 = byId("wa-send-2");
  if (nums[0]) { wa1.href = `https://wa.me/${nums[0]}?text=${orderText}`; wa1.hidden = false; }
  if (nums[1]) { wa2.href = `https://wa.me/${nums[1]}?text=${orderText}`; wa2.hidden = false; }
  else { wa2.hidden = true; }

  step.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

byId("pay-step-done").addEventListener("click", () => {
  cart.clear();
  renderCart();
  byId("pay-step").hidden = true;
  byId("order-form").hidden = false;
  byId("order-form").reset();
  byId("order-status").textContent = "";
});

/* Initialize default fulfillment view */
applyFulfillment("pickup");

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
function escapeAttr(value = "") { return escapeHtml(value); }

/* ---------- Language toggle ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = t(el.dataset.i18n);
    if (v) el.textContent = v;
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const v = t(el.dataset.i18nPh);
    if (v) el.setAttribute("placeholder", v);
  });
  document.querySelectorAll("#lang-toggle button").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
}
document.querySelectorAll("#lang-toggle button").forEach((b) => {
  b.addEventListener("click", () => {
    lang = b.dataset.lang === "es" ? "es" : "en";
    setLang(lang);
    applyLang();
    renderFilters();
    renderMenu();
    renderCart();
    renderReviews();
    renderHours();
    applyAvailability();
  });
});

loadContent();
