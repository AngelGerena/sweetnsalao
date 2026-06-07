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

/* ---------- Upload ---------- */
async function uploadFile(file) {
  const base64 = await toBase64(file);
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: file.name, type: file.type, data: base64 })
  });
  const result = await response.json();
  if (!response.ok) return null;
  return result.url;
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
