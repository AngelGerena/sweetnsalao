import { defaultContent } from "./defaults.js";
import { i18n, getLang, setLang } from "./i18n.js";

let content = structuredClone(defaultContent);
let lang = getLang();
let search = "";
const byId = (id) => document.getElementById(id);
const t = (key) => (i18n[lang] && i18n[lang][key]) || i18n.en[key] || key;

/* ---------- i18n application ---------- */
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
  document.querySelectorAll(".lang-toggle button").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
}
document.querySelectorAll(".lang-toggle button").forEach((b) => {
  b.addEventListener("click", () => {
    lang = b.dataset.lang === "es" ? "es" : "en";
    setLang(lang);
    applyLang();
    if (!byId("admin-shell").classList.contains("hidden")) {
      renderProducts();
      renderGalleryEditor();
      renderReviewsEditor();
    }
  });
});
applyLang();

/* ---------- Login ---------- */
byId("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = new FormData(event.target).get("password");
  const status = byId("login-status");
  status.classList.remove("err");
  status.textContent = t("checking");
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Login failed.");
    byId("login-panel").classList.add("hidden");
    byId("admin-shell").classList.remove("hidden");
    applyLang();
    await loadContent();
  } catch (error) {
    status.textContent = error.message;
    status.classList.add("err");
  }
});

byId("logout-button").addEventListener("click", async () => {
  await fetch("/api/admin/logout", { method: "POST" });
  location.reload();
});

/* ---------- Sidebar active state ---------- */
document.querySelectorAll(".sidebar nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".sidebar nav a").forEach((a) => a.classList.remove("active"));
    link.classList.add("active");
  });
});

/* ---------- Load content ---------- */
async function loadContent() {
  try {
    const response = await fetch("/api/content");
    if (response.ok) {
      const data = await response.json();
      content = mergeContent(defaultContent, data.content || data);
    }
  } catch { /* fall back to defaults */ }
  bindFields();
  renderProducts();
  renderGalleryEditor();
  renderReviewsEditor();
  setStatus("readyToEdit", "saved");
}

function bindFields() {
  document.querySelectorAll("[data-path]").forEach((field) => {
    if (field.type === "checkbox") {
      field.checked = !!getPath(content, field.dataset.path);
      field.onchange = () => {
        setPath(content, field.dataset.path, field.checked);
        setStatus("unsaved", "unsaved");
        if (field.id === "away-toggle") updateAwayFields();
      };
    } else {
      field.value = getPath(content, field.dataset.path) || "";
      field.oninput = () => {
        setPath(content, field.dataset.path, field.value);
        setStatus("unsaved", "unsaved");
      };
    }
  });
  updateAwayFields();
}

function updateAwayFields() {
  const toggle = byId("away-toggle");
  const fields = byId("away-fields");
  if (toggle && fields) fields.hidden = !toggle.checked;
}

/* ---------- Categories ---------- */
function categories() {
  return [...new Set(content.products.map((p) => p.category))];
}

/* ---------- Menu items ---------- */
function renderProducts() {
  const editor = byId("product-editor");
  const cats = categories();
  const filtered = content.products
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => !search || p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search));

  editor.innerHTML = filtered.map(({ p, i }) => `
    <div class="item-card ${p.available ? "" : "unavailable"}">
      <div class="item-row">
        <div class="item-image-col">
          ${p.image
            ? `<img class="item-thumb" src="${escapeAttr(p.image)}" alt="">`
            : `<div class="item-thumb empty">🍽️</div>`}
          <input type="file" class="item-upload-input" id="item-upload-${i}" accept="image/png,image/jpeg,image/webp" hidden>
          <div class="item-image-actions">
            <button class="btn-img-upload" type="button" data-upload-for="${i}" title="${t("uploadImage")}">${t("upload")}</button>
            ${p.image ? `<button class="btn-img-trash" type="button" data-clear-image="${i}" title="${t("removeImage")}" aria-label="${t("removeImage")}">🗑</button>` : ""}
          </div>
        </div>
        <div class="item-fields">
          <div class="triple">
            <input data-product="${i}" data-field="name" value="${escapeAttr(p.name)}" placeholder="${t("name")}">
            <select data-product="${i}" data-field="category">
              ${cats.map((c) => `<option value="${escapeAttr(c)}" ${c === p.category ? "selected" : ""}>${escapeHtml(c)}</option>`).join("")}
            </select>
            <input data-product="${i}" data-field="price" type="number" step="0.01" value="${escapeAttr(p.price ?? "")}" placeholder="${t("price")}">
          </div>
          <input data-product="${i}" data-field="image" value="${escapeAttr(p.image || "")}" placeholder="${t("imageUrlField")}">
          <textarea data-product="${i}" data-field="description" placeholder="${t("description")} (EN)">${escapeHtml(p.description || "")}</textarea>
          <textarea data-product="${i}" data-field="description_es" placeholder="${t("description")} (ES)">${escapeHtml(p.description_es || "")}</textarea>
          <div class="item-flags">
            <label><input data-product="${i}" data-field="available" type="checkbox" ${p.available ? "checked" : ""}> ${t("available")}</label>
            <label><input data-product="${i}" data-field="marketPrice" type="checkbox" ${p.marketPrice ? "checked" : ""}> ${t("marketPrice")}</label>
            <label><input data-product="${i}" data-field="featured" type="checkbox" ${p.featured ? "checked" : ""}> ${t("featured")}</label>
          </div>
        </div>
        <div class="item-actions">
          <button class="btn btn-ghost btn-sm" data-duplicate="${i}" type="button">${t("duplicate")}</button>
          <button class="btn btn-danger btn-sm" data-delete="${i}" type="button">${t("delete")}</button>
        </div>
      </div>
    </div>
  `).join("");

  editor.querySelectorAll("[data-product]").forEach((field) => {
    field.addEventListener("input", () => {
      const value = field.type === "checkbox" ? field.checked : field.type === "number" ? (field.value === "" ? null : Number(field.value)) : field.value;
      content.products[Number(field.dataset.product)][field.dataset.field] = value;
      setStatus("unsaved", "unsaved");
      if (field.dataset.field === "image" || field.dataset.field === "available") renderProducts();
    });
  });
  editor.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      if (confirm(t("confirmDelete"))) {
        content.products.splice(Number(button.dataset.delete), 1);
        renderProducts();
        setStatus("unsaved", "unsaved");
      }
    });
  });
  editor.querySelectorAll("[data-duplicate]").forEach((button) => {
    button.addEventListener("click", () => {
      const original = content.products[Number(button.dataset.duplicate)];
      content.products.push({ ...original, id: `${slug(original.name)}-${Date.now()}`, name: `${original.name} Copy` });
      renderProducts();
      setStatus("unsaved", "unsaved");
    });
  });
  // Per-card image: Upload button triggers that card's file input
  editor.querySelectorAll("[data-upload-for]").forEach((button) => {
    const idx = Number(button.dataset.uploadFor);
    const input = byId(`item-upload-${idx}`);
    button.addEventListener("click", () => input && input.click());
    if (input) {
      input.addEventListener("change", async () => {
        const file = input.files[0];
        if (!file) return;
        setStatus("uploading", "");
        try {
          const url = await uploadFile(file);
          if (!url) return setStatus("uploadFailed", "error");
          content.products[idx].image = url; // auto-overwrites existing image
          renderProducts();
          setStatus("uploaded", "saved");
        } catch {
          setStatus("uploadFailed", "error");
        }
      });
    }
  });
  // Per-card image: trash icon clears the image (becomes text-only card)
  editor.querySelectorAll("[data-clear-image]").forEach((button) => {
    button.addEventListener("click", () => {
      const idx = Number(button.dataset.clearImage);
      content.products[idx].image = null;
      renderProducts();
      setStatus("unsaved", "unsaved");
    });
  });
}

byId("items-search").addEventListener("input", (e) => {
  search = e.target.value.toLowerCase().trim();
  renderProducts();
});

byId("add-product").addEventListener("click", () => {
  content.products.push({
    id: `new-item-${Date.now()}`,
    name: "New Menu Item",
    category: categories()[0] || "Entrees",
    price: 0,
    description: "",
    image: null,
    available: true,
    marketPrice: false,
    featured: false
  });
  search = "";
  byId("items-search").value = "";
  renderProducts();
  setStatus("unsaved", "unsaved");
  byId("product-editor").lastElementChild?.scrollIntoView({ behavior: "smooth", block: "center" });
});

/* ---------- Gallery ---------- */
function renderGalleryEditor() {
  const editor = byId("gallery-editor");
  editor.innerHTML = (content.gallery || []).map((image, index) => `
    <div class="gallery-row">
      ${image ? `<img class="gallery-thumb" src="${escapeAttr(image)}" alt="">` : `<div class="gallery-thumb" style="display:grid;place-items:center">🖼️</div>`}
      <input data-gallery="${index}" value="${escapeAttr(image)}" placeholder="${t("imageUrlField")}">
      <button class="btn btn-danger btn-sm" data-remove-gallery="${index}" type="button">${t("remove")}</button>
    </div>
  `).join("");
  editor.querySelectorAll("[data-gallery]").forEach((input) => {
    input.addEventListener("input", () => {
      content.gallery[Number(input.dataset.gallery)] = input.value;
      setStatus("unsaved", "unsaved");
    });
    input.addEventListener("change", renderGalleryEditor);
  });
  editor.querySelectorAll("[data-remove-gallery]").forEach((button) => {
    button.addEventListener("click", () => {
      content.gallery.splice(Number(button.dataset.removeGallery), 1);
      renderGalleryEditor();
      setStatus("unsaved", "unsaved");
    });
  });
}

byId("add-gallery").addEventListener("click", () => {
  content.gallery = content.gallery || [];
  content.gallery.push("");
  renderGalleryEditor();
});

/* ---------- Reviews editor ---------- */
function renderReviewsEditor() {
  const editor = byId("reviews-editor");
  if (!editor) return;
  content.reviews = content.reviews || {};
  content.reviews.items = Array.isArray(content.reviews.items) ? content.reviews.items : [];
  editor.innerHTML = content.reviews.items.map((review, index) => `
    <div class="review-edit-row">
      <div class="field-grid">
        <div class="field">
          <label class="field-label"><span>${t("reviewNameLabel")}</span></label>
          <input data-review="${index}" data-rfield="name" value="${escapeAttr(review.name || "")}">
        </div>
        <div class="field" style="display:flex;align-items:flex-end">
          <button class="btn btn-danger btn-sm" data-remove-review="${index}" type="button">${t("remove")}</button>
        </div>
      </div>
      <div class="field">
        <label class="field-label"><span>${t("reviewTextEn")}</span></label>
        <textarea data-review="${index}" data-rfield="text">${escapeHtml(review.text || "")}</textarea>
      </div>
      <div class="field">
        <label class="field-label"><span>${t("reviewTextEs")}</span></label>
        <textarea data-review="${index}" data-rfield="text_es">${escapeHtml(review.text_es || "")}</textarea>
      </div>
    </div>
  `).join("");
  editor.querySelectorAll("[data-review]").forEach((input) => {
    input.addEventListener("input", () => {
      const idx = Number(input.dataset.review);
      content.reviews.items[idx][input.dataset.rfield] = input.value;
      setStatus("unsaved", "unsaved");
    });
  });
  editor.querySelectorAll("[data-remove-review]").forEach((button) => {
    button.addEventListener("click", () => {
      content.reviews.items.splice(Number(button.dataset.removeReview), 1);
      renderReviewsEditor();
      setStatus("unsaved", "unsaved");
    });
  });
}

byId("add-review").addEventListener("click", () => {
  content.reviews = content.reviews || {};
  content.reviews.items = Array.isArray(content.reviews.items) ? content.reviews.items : [];
  content.reviews.items.push({ name: "", text: "", text_es: "" });
  renderReviewsEditor();
  setStatus("unsaved", "unsaved");
});

/* ---------- Upload ---------- */
async function uploadFile(file) {
  // Auto-compress every image before upload: resize to web-optimal size and
  // re-encode, so a 10MB phone photo becomes a fast-loading ~200KB image.
  const prepared = await compressImage(file);
  const base64 = await toBase64(prepared.blob);
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: prepared.name, type: prepared.type, data: base64 })
  });
  const result = await response.json();
  if (!response.ok) return null;
  return result.url;
}

// Compress/resize an image file in the browser before it ever leaves the device.
// Falls back to the original file if anything goes wrong (e.g. non-raster types).
function compressImage(file, maxDim = 1600, quality = 0.82) {
  return new Promise((resolve) => {
    // Only attempt to compress raster images we can draw to canvas.
    if (!file || !/^image\/(jpeg|jpg|png|webp)$/i.test(file.type)) {
      return resolve({ blob: file, name: file.name, type: file.type });
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        let { width, height } = img;
        if (Math.max(width, height) > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // PNGs with transparency stay PNG; everything else becomes JPEG.
        const hasAlpha = /png/i.test(file.type);
        const outType = hasAlpha ? "image/png" : "image/jpeg";
        const baseName = file.name.replace(/\.[^.]+$/, "");
        const outName = hasAlpha ? `${baseName}.png` : `${baseName}.jpg`;

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            // If compression somehow made it bigger, keep the original.
            if (blob && blob.size < file.size) {
              resolve({ blob, name: outName, type: outType });
            } else {
              resolve({ blob: file, name: file.name, type: file.type });
            }
          },
          outType,
          hasAlpha ? undefined : quality
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        resolve({ blob: file, name: file.name, type: file.type });
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ blob: file, name: file.name, type: file.type });
    };
    img.src = url;
  });
}

byId("upload-button").addEventListener("click", async () => {
  const file = byId("upload-input").files[0];
  if (!file) return setStatus("chooseFirst", "unsaved");
  setStatus("uploading", "");
  try {
    const url = await uploadFile(file);
    if (!url) return setStatus("uploadFailed", "error");
    byId("uploaded-url").value = url;
    setStatus("uploaded", "saved");
  } catch {
    setStatus("uploadFailed", "error");
  }
});

/* ---------- Publish ---------- */
byId("save-button").addEventListener("click", async () => {
  setStatus("publishing", "");
  try {
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
    const result = await response.json();
    setStatus(response.ok ? "published" : "publishFailed", response.ok ? "saved" : "error");
  } catch {
    setStatus("publishFailed", "error");
  }
});

/* ---------- Helpers ---------- */
function mergeContent(base, live) {
  if (Array.isArray(base)) return Array.isArray(live) ? live : base;
  if (!base || typeof base !== "object") return live ?? base;
  const result = { ...base };
  for (const [key, value] of Object.entries(live || {})) {
    result[key] = value && typeof value === "object" && !Array.isArray(value) ? mergeContent(base[key] || {}, value) : value;
  }
  return result;
}
function getPath(object, path) { return path.split(".").reduce((current, part) => current?.[part], object); }
function setPath(object, path, value) {
  const parts = path.split(".");
  const last = parts.pop();
  const target = parts.reduce((current, part) => current[part] ||= {}, object);
  target[last] = value;
}
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function setStatus(key, cls) {
  const el = byId("save-status");
  el.textContent = t(key);
  el.className = "save-pill" + (cls ? " " + cls : "");
}
function slug(value) { return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function escapeHtml(value = "") { return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function escapeAttr(value = "") { return escapeHtml(value); }

/* ========================================================================
   INVOICE GENERATOR
   Branded PDF invoices with FL (Volusia 6.5%) tax and Zelle/Cash App payment.
   ======================================================================== */
let invItems = [];

function invMoney(n) { return "$" + (Math.round(n * 100) / 100).toFixed(2); }

function renderInvItems() {
  const wrap = byId("inv-items");
  if (!wrap) return;
  if (!invItems.length) invItems.push({ desc: "", qty: 1, price: 0 });
  wrap.innerHTML = invItems.map((it, i) => `
    <div class="inv-item-row">
      <input class="inv-desc" data-inv="${i}" data-f="desc" data-i18n-ph="invItemDesc" placeholder="Item description" value="${escapeAttr(it.desc || "")}">
      <input class="inv-qty" data-inv="${i}" data-f="qty" type="number" min="0" step="1" value="${escapeAttr(String(it.qty ?? 1))}">
      <input class="inv-price" data-inv="${i}" data-f="price" type="number" min="0" step="0.01" value="${escapeAttr(String(it.price ?? 0))}">
      <span class="inv-line-total">${invMoney((Number(it.qty) || 0) * (Number(it.price) || 0))}</span>
      <button class="btn btn-danger btn-sm inv-del" data-inv-del="${i}" type="button">×</button>
    </div>`).join("");
  wrap.querySelectorAll("[data-inv]").forEach((inp) => {
    inp.addEventListener("input", () => {
      const i = Number(inp.dataset.inv);
      const f = inp.dataset.f;
      invItems[i][f] = f === "desc" ? inp.value : Number(inp.value);
      invTotals();
      // update just the line total without full re-render (keeps focus)
      const row = inp.closest(".inv-item-row");
      const lt = row.querySelector(".inv-line-total");
      if (lt) lt.textContent = invMoney((Number(invItems[i].qty) || 0) * (Number(invItems[i].price) || 0));
    });
  });
  wrap.querySelectorAll("[data-inv-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      invItems.splice(Number(btn.dataset.invDel), 1);
      if (!invItems.length) invItems.push({ desc: "", qty: 1, price: 0 });
      renderInvItems(); invTotals();
    });
  });
  invTotals();
}

function invTotals() {
  const subtotal = invItems.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);
  const rate = Number(byId("inv-tax-rate").value) || 0;
  const tax = subtotal * (rate / 100);
  const total = subtotal + tax;
  byId("inv-subtotal").textContent = invMoney(subtotal);
  byId("inv-tax-amt").textContent = invMoney(tax);
  byId("inv-tax-pct").textContent = rate;
  byId("inv-total").textContent = invMoney(total);
  return { subtotal, tax, total, rate };
}

function nextInvoiceNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `INV-${ymd}-${seq}`;
}

async function loadLogoDataUrl() {
  // Fetch the logo and convert to a data URL for embedding in the PDF.
  try {
    const src = (content.business && content.business.logoImage) || "/assets/sweet-salao-logo.png";
    const res = await fetch(src);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch (e) { return null; }
}

async function generateInvoicePdf() {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) { setStatus("invNoPdfLib", "unsaved"); return; }

  const b = content.business || {};
  const o = content.ordering || {};
  const totals = invTotals();
  const invNo = nextInvoiceNumber();
  const dateVal = byId("inv-date").value || new Date().toISOString().slice(0, 10);

  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;            // margin
  const ink = [28, 22, 38];
  const gold = [197, 164, 75];
  const soft = [110, 110, 120];
  let y = M;

  // --- Logo (centered-left) ---
  const logo = await loadLogoDataUrl();
  if (logo) {
    try { doc.addImage(logo, "PNG", M, y, 120, 92); } catch (e) {}
  }

  // --- Business block (right side) ---
  doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(...ink);
  doc.text(b.name || "Sweet & Salao", W - M, y + 16, { align: "right" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(...soft);
  const addr = b.address || {};
  const bizLines = [
    addr.street || "",
    addr.cityStateZip || (b.location || ""),
    b.phone || "",
    b.email || "",
    "sweetnsalao.com"
  ].filter(Boolean);
  let by = y + 32;
  bizLines.forEach((ln) => { doc.text(String(ln), W - M, by, { align: "right" }); by += 13; });

  y = Math.max(y + 100, by + 8);

  // --- INVOICE title bar ---
  doc.setDrawColor(...gold); doc.setLineWidth(2);
  doc.line(M, y, W - M, y);
  y += 26;
  doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(...ink);
  doc.text("INVOICE", M, y);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(...soft);
  doc.text(`Invoice #: ${invNo}`, W - M, y - 10, { align: "right" });
  doc.text(`Date: ${dateVal}`, W - M, y + 4, { align: "right" });
  y += 28;

  // --- Bill To ---
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(...ink);
  doc.text("BILL TO", M, y);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); doc.setTextColor(...ink);
  y += 15;
  const billLines = [
    byId("inv-cust-name").value || "Customer",
    byId("inv-cust-phone").value || "",
    byId("inv-cust-email").value || ""
  ].filter(Boolean);
  billLines.forEach((ln) => { doc.text(String(ln), M, y); y += 14; });
  y += 10;

  // --- Items table header ---
  const colDesc = M, colQty = W - M - 200, colPrice = W - M - 110, colTot = W - M;
  doc.setFillColor(28, 22, 38); doc.rect(M, y - 12, W - 2 * M, 22, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(255, 255, 255);
  doc.text("DESCRIPTION", colDesc + 8, y + 3);
  doc.text("QTY", colQty, y + 3, { align: "right" });
  doc.text("PRICE", colPrice, y + 3, { align: "right" });
  doc.text("TOTAL", colTot - 6, y + 3, { align: "right" });
  y += 24;

  // --- Items rows ---
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(...ink);
  invItems.filter((it) => (it.desc || "").trim() || Number(it.price)).forEach((it) => {
    const qty = Number(it.qty) || 0, price = Number(it.price) || 0, lt = qty * price;
    const descLines = doc.splitTextToSize(String(it.desc || ""), colQty - colDesc - 20);
    doc.text(descLines, colDesc + 8, y);
    doc.text(String(qty), colQty, y, { align: "right" });
    doc.text(invMoney(price), colPrice, y, { align: "right" });
    doc.text(invMoney(lt), colTot - 6, y, { align: "right" });
    y += Math.max(16, descLines.length * 13);
    doc.setDrawColor(230, 230, 232); doc.setLineWidth(0.5); doc.line(M, y - 6, W - M, y - 6);
  });
  y += 8;

  // --- Totals ---
  const tx = W - M - 200;
  doc.setFontSize(10.5); doc.setTextColor(...ink);
  doc.text("Subtotal", tx, y); doc.text(invMoney(totals.subtotal), colTot - 6, y, { align: "right" }); y += 16;
  doc.text(`Tax (${totals.rate}%)`, tx, y); doc.text(invMoney(totals.tax), colTot - 6, y, { align: "right" }); y += 18;
  doc.setDrawColor(...gold); doc.setLineWidth(1.5); doc.line(tx, y - 8, colTot, y - 8);
  doc.setFont("helvetica", "bold"); doc.setFontSize(13);
  doc.text("TOTAL DUE", tx, y + 6); doc.text(invMoney(totals.total), colTot - 6, y + 6, { align: "right" });
  y += 36;

  // --- Payment instructions (Zelle / Cash App) ---
  doc.setFillColor(247, 243, 235); doc.rect(M, y, W - 2 * M, 76, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(...ink);
  doc.text("How to Pay", M + 12, y + 20);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(...ink);
  const zelle = o.zellePhone || o.zelleHandle || "";
  const cashapp = o.cashAppHandle || "";
  let py = y + 38;
  if (zelle) { doc.text(`Zelle:  ${zelle}`, M + 12, py); py += 15; }
  if (cashapp) { doc.text(`Cash App:  ${cashapp}`, M + 12, py); py += 15; }
  doc.setTextColor(...soft); doc.setFontSize(9);
  doc.text("Please include your name and invoice number with payment.", M + 12, y + 66);
  y += 92;

  // --- Notes / footer ---
  const notes = byId("inv-notes").value;
  if (notes) {
    doc.setFont("helvetica", "italic"); doc.setFontSize(10); doc.setTextColor(...ink);
    doc.text(doc.splitTextToSize(notes, W - 2 * M), M, y); y += 22;
  }
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(...soft);
  doc.text("Thank you for supporting Sweet & Salao by Chef Carmen LLC.", W / 2, doc.internal.pageSize.getHeight() - 36, { align: "center" });

  const safeCust = (byId("inv-cust-name").value || "customer").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`${invNo}-${safeCust}.pdf`);
  setStatus("invSaved", "saved");
}

// Wire up invoice events (guarded so it only runs if the panel exists)
if (byId("invoice-panel")) {
  byId("inv-add-item").addEventListener("click", () => { invItems.push({ desc: "", qty: 1, price: 0 }); renderInvItems(); });
  byId("inv-tax-rate").addEventListener("input", invTotals);
  byId("inv-generate").addEventListener("click", generateInvoicePdf);
  if (byId("inv-date")) byId("inv-date").value = new Date().toISOString().slice(0, 10);
  renderInvItems();
}
