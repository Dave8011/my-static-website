const state = {
  token: localStorage.getItem("cms_token"),
  user: null,
  view: "dashboard",
  pages: [],
  blogs: [],
  faqs: [],
  banners: [],
  gallery: [],
  settings: [],
  seo: { pages: [], blogs: [] },
  users: [],
  media: [],
  selected: {
    pages: null,
    blogs: null,
    faqs: null,
    banners: null,
    gallery: null,
  },
};

const navItems = [
  ["dashboard", "Dashboard"],
  ["pages", "Pages"],
  ["blogs", "Blogs"],
  ["gallery", "Gallery"],
  ["faqs", "FAQs"],
  ["banners", "Banners"],
  ["media", "Media Library"],
  ["settings", "Theme Settings"],
  ["seo", "SEO"],
  ["users", "Users"],
];

const contentConfigs = {
  pages: {
    key: "pages",
    title: "Pages",
    endpoint: "/api/admin/pages",
    fields(record = {}) {
      return `
        <div class="split">
          <label><span>Title</span><input name="title" value="${escapeHtml(record.title || "")}" required></label>
          <label><span>Slug</span><input name="slug" value="${escapeHtml(record.slug || "")}" required></label>
        </div>
        <div class="split">
          <label><span>Template</span><input name="template" value="${escapeHtml(record.template || "default")}"></label>
          <label><span>Status</span>
            <select name="status">
              <option value="draft" ${record.status !== "published" ? "selected" : ""}>Draft</option>
              <option value="published" ${record.status === "published" ? "selected" : ""}>Published</option>
            </select>
          </label>
        </div>
        <label><span>Content (HTML allowed)</span><textarea name="content">${escapeHtml(record.content || "")}</textarea></label>
        <label><span>SEO Title</span><input name="seoTitle" value="${escapeHtml(record.seoTitle || "")}"></label>
        <label><span>SEO Description</span><textarea name="seoDescription">${escapeHtml(record.seoDescription || "")}</textarea></label>
      `;
    },
    preview(record) {
      return `<article><h1>${escapeHtml(record.title || "")}</h1>${record.content || "<p>No content yet.</p>"}</article>`;
    },
  },
  blogs: {
    key: "blogs",
    title: "Blogs",
    endpoint: "/api/admin/blogs",
    fields(record = {}) {
      return `
        <div class="split">
          <label><span>Title</span><input name="title" value="${escapeHtml(record.title || "")}" required></label>
          <label><span>Slug</span><input name="slug" value="${escapeHtml(record.slug || "")}" required></label>
        </div>
        <div class="split">
          <label><span>Category</span><input name="category" value="${escapeHtml(record.category || "")}"></label>
          <label><span>Featured Image URL</span><input name="featuredImage" value="${escapeHtml(record.featuredImage || "")}" placeholder="/uploads/file.jpg"></label>
        </div>
        <label><span>Excerpt</span><textarea name="excerpt">${escapeHtml(record.excerpt || "")}</textarea></label>
        <div class="split">
          <label><span>Status</span>
            <select name="status">
              <option value="draft" ${record.status !== "published" ? "selected" : ""}>Draft</option>
              <option value="published" ${record.status === "published" ? "selected" : ""}>Published</option>
            </select>
          </label>
          <div></div>
        </div>
        <label><span>Content (HTML allowed)</span><textarea name="content">${escapeHtml(record.content || "")}</textarea></label>
        <label><span>SEO Title</span><input name="seoTitle" value="${escapeHtml(record.seoTitle || "")}"></label>
        <label><span>SEO Description</span><textarea name="seoDescription">${escapeHtml(record.seoDescription || "")}</textarea></label>
      `;
    },
    preview(record) {
      const image = record.featuredImage ? `<img src="${record.featuredImage}" alt="">` : "";
      return `<article>${image}<h1>${escapeHtml(record.title || "")}</h1><p>${escapeHtml(record.excerpt || "")}</p>${record.content || "<p>No content yet.</p>"}</article>`;
    },
  },
  faqs: {
    key: "faqs",
    title: "FAQs",
    endpoint: "/api/admin/faqs",
    fields(record = {}) {
      return `
        <label><span>Question</span><input name="question" value="${escapeHtml(record.question || "")}" required></label>
        <label><span>Answer</span><textarea name="answer" required>${escapeHtml(record.answer || "")}</textarea></label>
        <div class="split">
          <label><span>Order</span><input type="number" name="sortOrder" value="${escapeHtml(String(record.sortOrder ?? 0))}"></label>
          <label><span>Status</span>
            <select name="status">
              <option value="published" ${record.status !== "draft" ? "selected" : ""}>Published</option>
              <option value="draft" ${record.status === "draft" ? "selected" : ""}>Draft</option>
            </select>
          </label>
        </div>
      `;
    },
    preview(record) {
      return `<article><h1>${escapeHtml(record.question || "")}</h1><p>${escapeHtml(record.answer || "")}</p></article>`;
    },
  },
  banners: {
    key: "banners",
    title: "Banners",
    endpoint: "/api/admin/banners",
    fields(record = {}) {
      return `
        <div class="split">
          <label><span>Page Slug</span><input name="page" value="${escapeHtml(record.page || "")}" required></label>
          <label><span>Image URL</span><input name="image" value="${escapeHtml(record.image || "")}" placeholder="/uploads/file.jpg" required></label>
        </div>
        <label><span>Title</span><input name="title" value="${escapeHtml(record.title || "")}"></label>
        <label><span>Subtitle</span><textarea name="subtitle">${escapeHtml(record.subtitle || "")}</textarea></label>
        <div class="split">
          <label><span>CTA Text</span><input name="ctaText" value="${escapeHtml(record.ctaText || "")}"></label>
          <label><span>CTA Link</span><input name="ctaLink" value="${escapeHtml(record.ctaLink || "")}"></label>
        </div>
        <label><span>Status</span>
          <select name="status">
            <option value="published" ${record.status !== "draft" ? "selected" : ""}>Published</option>
            <option value="draft" ${record.status === "draft" ? "selected" : ""}>Draft</option>
          </select>
        </label>
      `;
    },
    preview(record) {
      const image = record.image ? `<img src="${record.image}" alt="">` : "";
      return `<section>${image}<h1>${escapeHtml(record.title || "")}</h1><p>${escapeHtml(record.subtitle || "")}</p><p><strong>${escapeHtml(record.ctaText || "")}</strong> ${escapeHtml(record.ctaLink || "")}</p></section>`;
    },
  },
  gallery: {
    key: "gallery",
    title: "Gallery",
    endpoint: "/api/admin/gallery",
    fields(record = {}) {
      const pageOptions = [
        `<option value="">No page</option>`,
        ...state.pages.map((page) => `<option value="${page.id}" ${Number(record.pageId) === page.id ? "selected" : ""}>${escapeHtml(page.title)}</option>`),
      ].join("");
      return `
        <label><span>Image URL</span><input name="image" value="${escapeHtml(record.image || "")}" placeholder="/uploads/file.jpg" required></label>
        <label><span>Caption</span><textarea name="caption">${escapeHtml(record.caption || "")}</textarea></label>
        <div class="split">
          <label><span>Order</span><input type="number" name="sortOrder" value="${escapeHtml(String(record.sortOrder ?? 0))}"></label>
          <label><span>Attach To Page</span><select name="pageId">${pageOptions}</select></label>
        </div>
      `;
    },
    preview(record) {
      const image = record.image ? `<img src="${record.image}" alt="">` : "";
      return `<figure>${image}<figcaption>${escapeHtml(record.caption || "")}</figcaption></figure>`;
    },
  },
};

document.addEventListener("DOMContentLoaded", async () => {
  bindGlobalEvents();
  renderNav();

  if (state.token) {
    try {
      await fetchMe();
      await loadAll();
      showApp();
      renderCurrentView();
      return;
    } catch (_error) {
      logout();
    }
  }

  showLogin();
});

function bindGlobalEvents() {
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document.getElementById("logout-btn").addEventListener("click", logout);
  document.getElementById("close-preview").addEventListener("click", () => {
    document.getElementById("preview-modal").close();
  });
}

function renderNav() {
  const nav = document.getElementById("nav-items");
  nav.innerHTML = navItems
    .map(
      ([key, label]) =>
        `<button class="nav-item ${state.view === key ? "active" : ""}" data-view="${key}">${label}</button>`
    )
    .join("");

  nav.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      renderNav();
      renderCurrentView();
    });
  });
}

async function handleLogin(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payload = { email: form.get("email"), password: form.get("password") };
  const errorEl = document.getElementById("login-error");
  errorEl.textContent = "";

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    state.token = data.token;
    state.user = data.user;
    localStorage.setItem("cms_token", state.token);
    await loadAll();
    showApp();
    renderCurrentView();
  } catch (error) {
    errorEl.textContent = error.message;
  }
}

async function fetchMe() {
  const data = await api("/api/auth/me");
  state.user = data.user;
}

async function loadAll() {
  const [dashboard, pages, blogs, faqs, banners, gallery, settings, seo, users, media] = await Promise.all([
    api("/api/admin/dashboard"),
    api("/api/admin/pages"),
    api("/api/admin/blogs"),
    api("/api/admin/faqs"),
    api("/api/admin/banners"),
    api("/api/admin/gallery"),
    api("/api/admin/settings"),
    api("/api/admin/seo"),
    state.user.role === "admin" ? api("/api/admin/users") : Promise.resolve([]),
    api("/api/admin/media"),
  ]);

  state.dashboard = dashboard;
  state.pages = pages;
  state.blogs = blogs;
  state.faqs = faqs;
  state.banners = banners;
  state.gallery = gallery;
  state.settings = settings;
  state.seo = seo;
  state.users = users;
  state.media = media;
}

function showApp() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-shell").classList.remove("hidden");
  document.getElementById("user-pill").textContent = `${state.user.name} · ${state.user.role}`;
}

function showLogin() {
  document.getElementById("app-shell").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
}

function renderCurrentView() {
  document.getElementById("view-title").textContent =
    navItems.find(([key]) => key === state.view)?.[1] || "Dashboard";

  document.querySelectorAll(".view-panel").forEach((panel) => panel.classList.add("hidden"));

  if (state.view === "dashboard") {
    document.getElementById("dashboard-view").classList.remove("hidden");
    renderDashboard();
    return;
  }

  if (["pages", "blogs", "faqs", "banners", "gallery"].includes(state.view)) {
    document.getElementById("content-view").classList.remove("hidden");
    renderContentView(state.view);
    return;
  }

  if (state.view === "settings") {
    document.getElementById("settings-view").classList.remove("hidden");
    renderSettingsView();
    return;
  }

  if (state.view === "seo") {
    document.getElementById("seo-view").classList.remove("hidden");
    renderSeoView();
    return;
  }

  if (state.view === "users") {
    document.getElementById("users-view").classList.remove("hidden");
    renderUsersView();
    return;
  }

  if (state.view === "media") {
    document.getElementById("media-view").classList.remove("hidden");
    renderMediaView();
  }
}

function renderDashboard() {
  const el = document.getElementById("dashboard-view");
  el.innerHTML = `
    <div class="stats-grid">
      ${Object.entries(state.dashboard)
        .map(
          ([key, value]) => `
            <article class="stat-card">
              <strong>${value}</strong>
              <span>${startCase(key)}</span>
            </article>
          `
        )
        .join("")}
    </div>
    <div class="table-card">
      <p class="eyebrow">Publishing flow</p>
      <h3>Preview before publish</h3>
      <p>Editors can save drafts first, preview rendered content in the dashboard, then publish when they are satisfied.</p>
    </div>
  `;
}

function renderContentView(view) {
  const config = contentConfigs[view];
  const collection = state[config.key];
  if (!state.selected[view] && collection[0]) {
    state.selected[view] = collection[0].id;
  }

  const selectedRecord = collection.find((item) => item.id === state.selected[view]) || {};
  const el = document.getElementById("content-view");
  el.innerHTML = `
    <div class="editor-layout">
      <div class="list-card">
        <div class="toolbar">
          <div>
            <p class="eyebrow">Content list</p>
            <h3>${config.title}</h3>
          </div>
          <button class="btn btn-primary" id="new-record-btn">New</button>
        </div>
        <div class="record-list">
          ${collection
            .map(
              (item) => `
                <button class="record-item ${state.selected[view] === item.id ? "active" : ""}" data-id="${item.id}">
                  <strong>${escapeHtml(item.title || item.question || item.page || item.caption || "Untitled")}</strong>
                  <div class="record-meta">
                    <span>${escapeHtml(item.slug || item.category || item.page?.title || "")}</span>
                    <span class="status-badge ${item.status || "published"}">${item.status || "published"}</span>
                  </div>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="editor-card">
        <div class="toolbar">
          <div>
            <p class="eyebrow">Editor</p>
            <h3>${selectedRecord.id ? "Update record" : "Create record"}</h3>
          </div>
          <div class="inline-actions">
            <button class="btn btn-ghost" id="preview-record-btn" type="button">Preview</button>
            ${selectedRecord.id ? '<button class="btn btn-ghost" id="delete-record-btn" type="button">Delete</button>' : ""}
          </div>
        </div>
        <form id="content-form" class="form-grid">
          ${config.fields(selectedRecord)}
          <div class="inline-actions">
            <button class="btn btn-primary" type="submit">${selectedRecord.id ? "Save Changes" : "Create"}</button>
            <button class="btn btn-secondary" type="button" id="publish-record-btn">Save And Publish</button>
          </div>
        </form>
      </div>
    </div>
  `;

  el.querySelectorAll(".record-item").forEach((button) => {
    button.addEventListener("click", () => {
      state.selected[view] = Number(button.dataset.id);
      renderContentView(view);
    });
  });

  document.getElementById("new-record-btn").addEventListener("click", () => {
    state.selected[view] = null;
    renderContentView(view);
  });

  document.getElementById("content-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveContentRecord(view, false);
  });

  document.getElementById("publish-record-btn").addEventListener("click", async () => {
    await saveContentRecord(view, true);
  });

  document.getElementById("preview-record-btn").addEventListener("click", () => {
    const payload = Object.fromEntries(new FormData(document.getElementById("content-form")).entries());
    if (!payload.status) {
      payload.status = selectedRecord.status || "draft";
    }
    openPreview(config.preview(payload));
  });

  const deleteButton = document.getElementById("delete-record-btn");
  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      if (!confirm("Delete this record?")) {
        return;
      }

      await api(`${config.endpoint}/${selectedRecord.id}`, { method: "DELETE" });
      await loadContentCollection(view);
      state.selected[view] = state[config.key][0]?.id || null;
      renderContentView(view);
    });
  }
}

async function saveContentRecord(view, publish) {
  const config = contentConfigs[view];
  const formData = Object.fromEntries(new FormData(document.getElementById("content-form")).entries());
  if (publish) {
    formData.status = "published";
  }

  const selectedId = state.selected[view];
  const url = selectedId ? `${config.endpoint}/${selectedId}` : config.endpoint;
  const method = selectedId ? "PUT" : "POST";

  await api(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  await loadContentCollection(view);
  state.selected[view] = state[config.key][0]?.id || null;
  await refreshDashboardAndSeo();
  renderContentView(view);
}

async function loadContentCollection(view) {
  const config = contentConfigs[view];
  state[config.key] = await api(config.endpoint);
  if (view === "gallery") {
    state.pages = await api("/api/admin/pages");
  }
}

function renderSettingsView() {
  const defaults = [
    "site_name",
    "brand_tagline",
    "contact_phone",
    "contact_email",
    "primary_color",
    "secondary_color",
    "footer_address",
  ];
  const settingsMap = new Map(state.settings.map((item) => [item.key, item.value]));
  const rows = defaults.map((key) => ({ key, value: settingsMap.get(key) || "" }));
  const el = document.getElementById("settings-view");
  el.innerHTML = `
    <div class="table-card">
      <div class="toolbar">
        <div>
          <p class="eyebrow">Website-wide values</p>
          <h3>Theme settings</h3>
        </div>
      </div>
      <form id="settings-form" class="settings-grid">
        ${rows
          .map(
            (item) => `
              <label>
                <span>${startCase(item.key.replaceAll("_", " "))}</span>
                <input name="${item.key}" value="${escapeHtml(item.value)}">
              </label>
            `
          )
          .join("")}
        <div class="inline-actions">
          <button class="btn btn-primary" type="submit">Save Settings</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById("settings-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const settings = Array.from(form.entries()).map(([key, value]) => ({ key, value }));
    state.settings = await api("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    alert("Settings saved");
  });
}

function renderSeoView() {
  const el = document.getElementById("seo-view");
  el.innerHTML = `
    <div class="table-card">
      <p class="eyebrow">Search metadata</p>
      <h3>Pages</h3>
      ${renderSeoTable(state.seo.pages)}
    </div>
    <div class="table-card" style="margin-top: 16px;">
      <h3>Blogs</h3>
      ${renderSeoTable(state.seo.blogs)}
    </div>
  `;
}

function renderSeoTable(records) {
  return `
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Slug</th>
          <th>Status</th>
          <th>SEO Title</th>
        </tr>
      </thead>
      <tbody>
        ${records
          .map(
            (record) => `
              <tr>
                <td>${escapeHtml(record.title)}</td>
                <td>${escapeHtml(record.slug)}</td>
                <td>${escapeHtml(record.status)}</td>
                <td>${escapeHtml(record.seoTitle || "Missing")}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderUsersView() {
  const el = document.getElementById("users-view");

  if (state.user.role !== "admin") {
    el.innerHTML = `<div class="table-card"><p>Only admin users can manage accounts.</p></div>`;
    return;
  }

  el.innerHTML = `
    <div class="table-card">
      <div class="toolbar">
        <div>
          <p class="eyebrow">Access control</p>
          <h3>Users</h3>
        </div>
      </div>
      <form id="user-form" class="settings-grid">
        <label><span>Name</span><input name="name" required></label>
        <label><span>Email</span><input name="email" type="email" required></label>
        <label><span>Password</span><input name="password" type="password" required></label>
        <label><span>Role</span>
          <select name="role">
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <div class="inline-actions">
          <button class="btn btn-primary" type="submit">Create User</button>
        </div>
      </form>
    </div>
    <div class="table-card" style="margin-top: 16px;">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${state.users
            .map(
              (user) => `
                <tr>
                  <td>${escapeHtml(user.name)}</td>
                  <td>${escapeHtml(user.email)}</td>
                  <td>${escapeHtml(user.role)}</td>
                  <td><button class="btn btn-ghost delete-user-btn" data-id="${user.id}" type="button">Delete</button></td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("user-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    await api("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    state.users = await api("/api/admin/users");
    renderUsersView();
  });

  el.querySelectorAll(".delete-user-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/admin/users/${button.dataset.id}`, { method: "DELETE" });
      state.users = await api("/api/admin/users");
      renderUsersView();
    });
  });
}

function renderMediaView() {
  const el = document.getElementById("media-view");
  el.innerHTML = `
    <div class="table-card">
      <div class="toolbar">
        <div>
          <p class="eyebrow">Uploads folder</p>
          <h3>Media library</h3>
        </div>
      </div>
      <form id="media-form" class="inline-actions">
        <input name="file" type="file" accept="image/*" required>
        <button class="btn btn-primary" type="submit">Upload</button>
      </form>
    </div>
    <div class="media-grid" style="margin-top: 16px;">
      ${state.media
        .map(
          (item) => `
            <article class="media-tile">
              <img src="${item.url}" alt="${escapeHtml(item.name)}">
              <div class="media-tile-content">
                <strong>${escapeHtml(item.name)}</strong>
                <small>${Math.round(item.size / 1024)} KB</small>
                <div class="inline-actions">
                  <button class="btn btn-ghost copy-media-btn" data-url="${item.url}" type="button">Copy URL</button>
                  <button class="btn btn-ghost delete-media-btn" data-name="${item.name}" type="button">Delete</button>
                </div>
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;

  document.getElementById("media-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await api("/api/admin/media", {
      method: "POST",
      body: data,
      raw: true,
    });
    state.media = await api("/api/admin/media");
    renderMediaView();
  });

  el.querySelectorAll(".copy-media-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(button.dataset.url);
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = "Copy URL";
      }, 1000);
    });
  });

  el.querySelectorAll(".delete-media-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/admin/media/${button.dataset.name}`, { method: "DELETE" });
      state.media = await api("/api/admin/media");
      renderMediaView();
    });
  });
}

async function refreshDashboardAndSeo() {
  state.dashboard = await api("/api/admin/dashboard");
  state.seo = await api("/api/admin/seo");
}

async function api(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

function openPreview(html) {
  document.getElementById("preview-body").innerHTML = html;
  document.getElementById("preview-modal").showModal();
}

function logout() {
  localStorage.removeItem("cms_token");
  state.token = null;
  state.user = null;
  showLogin();
}

function startCase(value) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
