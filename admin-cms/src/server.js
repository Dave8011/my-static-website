require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("./db");

const app = express();

const PORT = Number(process.env.PORT || 4000);
const SITE_URL = process.env.SITE_URL || "https://therehabhouse.in";
const ADMIN_URL = process.env.ADMIN_URL || "https://admin.therehabhouse.in";
const JWT_SECRET = process.env.JWT_SECRET || "replace-this-in-production";
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@therehabhouse.in";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!";
const DEFAULT_ADMIN_NAME = process.env.ADMIN_NAME || "Site Admin";

const uploadsDir = path.join(__dirname, "..", "uploads");
const publicDir = path.join(__dirname, "..", "public");

fs.mkdirSync(uploadsDir, { recursive: true });

const allowedOrigins = [SITE_URL, ADMIN_URL, process.env.LOCAL_ADMIN_URL].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed"));
    },
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadsDir),
  filename: (_req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-")}`);
  },
});

const upload = multer({ storage });

function toSlug(value = "") {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "12h" }
  );
}

async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await db.get("SELECT id, name, email, role FROM `User` WHERE id = ?", [payload.sub]);

    if (!user) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    req.user = user;
    next();
  } catch (_error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  next();
}

async function ensureDefaultAdmin() {
  const user = await db.get("SELECT id FROM `User` LIMIT 1");
  if (user) {
    return;
  }

  const password = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
  await db.run(
    "INSERT INTO `User` (name, email, password, role) VALUES (?, ?, ?, ?)",
    [DEFAULT_ADMIN_NAME, DEFAULT_ADMIN_EMAIL, password, "admin"]
  );
}

function cleanNullableString(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : null;
}

function parsePageInput(body) {
  return {
    title: String(body.title || "").trim(),
    slug: toSlug(body.slug || body.title || ""),
    template: cleanNullableString(body.template) || "default",
    content: cleanNullableString(body.content),
    status: body.status === "published" ? "published" : "draft",
    seo_title: cleanNullableString(body.seoTitle),
    seo_description: cleanNullableString(body.seoDescription),
    updated_at: new Date().toISOString(),
  };
}

function parseBlogInput(body) {
  const status = body.status === "published" ? "published" : "draft";
  return {
    title: String(body.title || "").trim(),
    slug: toSlug(body.slug || body.title || ""),
    content: cleanNullableString(body.content),
    excerpt: cleanNullableString(body.excerpt),
    featured_image: cleanNullableString(body.featuredImage),
    category: cleanNullableString(body.category),
    status,
    seo_title: cleanNullableString(body.seoTitle),
    seo_description: cleanNullableString(body.seoDescription),
    published_at: status === "published" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };
}

function parseFaqInput(body) {
  return {
    question: String(body.question || "").trim(),
    answer: String(body.answer || "").trim(),
    order: Number(body.sortOrder || 0),
    status: body.status === "draft" ? "draft" : "published",
  };
}

function parseBannerInput(body) {
  return {
    page: String(body.page || "").trim(),
    image: String(body.image || "").trim(),
    title: cleanNullableString(body.title),
    subtitle: cleanNullableString(body.subtitle),
    cta_text: cleanNullableString(body.ctaText),
    cta_link: cleanNullableString(body.ctaLink),
    status: body.status === "draft" ? "draft" : "published",
  };
}

function parseGalleryInput(body) {
  return {
    image: String(body.image || "").trim(),
    caption: cleanNullableString(body.caption),
    order: Number(body.sortOrder || 0),
    page_id: body.pageId ? Number(body.pageId) : null,
  };
}

const resourceConfig = {
  pages: {
    table: "Page",
    listSql:
      "SELECT id, title, slug, template, content, status, seo_title AS seoTitle, seo_description AS seoDescription, created_at AS createdAt, updated_at AS updatedAt FROM `Page` ORDER BY updated_at DESC",
    getSql:
      "SELECT id, title, slug, template, content, status, seo_title AS seoTitle, seo_description AS seoDescription, created_at AS createdAt, updated_at AS updatedAt FROM `Page` WHERE id = ?",
    parse: parsePageInput,
    required: ["title", "slug"],
  },
  blogs: {
    table: "Blog",
    listSql:
      "SELECT id, title, slug, content, excerpt, featured_image AS featuredImage, category, status, seo_title AS seoTitle, seo_description AS seoDescription, published_at AS publishedAt, created_at AS createdAt, updated_at AS updatedAt FROM `Blog` ORDER BY COALESCE(published_at, updated_at) DESC",
    getSql:
      "SELECT id, title, slug, content, excerpt, featured_image AS featuredImage, category, status, seo_title AS seoTitle, seo_description AS seoDescription, published_at AS publishedAt, created_at AS createdAt, updated_at AS updatedAt FROM `Blog` WHERE id = ?",
    parse: parseBlogInput,
    required: ["title", "slug"],
  },
  faqs: {
    table: "Faq",
    listSql:
      "SELECT id, question, answer, `order` AS sortOrder, status FROM `Faq` ORDER BY `order` ASC, id DESC",
    getSql:
      "SELECT id, question, answer, `order` AS sortOrder, status FROM `Faq` WHERE id = ?",
    parse: parseFaqInput,
    required: ["question", "answer"],
  },
  banners: {
    table: "Banner",
    listSql:
      "SELECT id, page, image, title, subtitle, cta_text AS ctaText, cta_link AS ctaLink, status FROM `Banner` ORDER BY id DESC",
    getSql:
      "SELECT id, page, image, title, subtitle, cta_text AS ctaText, cta_link AS ctaLink, status FROM `Banner` WHERE id = ?",
    parse: parseBannerInput,
    required: ["page", "image"],
  },
  gallery: {
    table: "Gallery",
    listSql:
      "SELECT g.id, g.image, g.caption, g.`order` AS sortOrder, g.page_id AS pageId, p.id AS linkedPageId, p.title AS pageTitle, p.slug AS pageSlug FROM `Gallery` g LEFT JOIN `Page` p ON p.id = g.page_id ORDER BY g.`order` ASC, g.id DESC",
    getSql:
      "SELECT g.id, g.image, g.caption, g.`order` AS sortOrder, g.page_id AS pageId, p.id AS linkedPageId, p.title AS pageTitle, p.slug AS pageSlug FROM `Gallery` g LEFT JOIN `Page` p ON p.id = g.page_id WHERE g.id = ?",
    parse: parseGalleryInput,
    required: ["image"],
  },
};

function validateRequired(data, fields) {
  for (const field of fields) {
    if (!data[field]) {
      return `${field} is required`;
    }
  }

  return null;
}

function buildInsert(table, data) {
  const columns = Object.keys(data);
  const placeholders = columns.map(() => "?").join(", ");
  return {
    sql: `INSERT INTO \`${table}\` (${columns.map((column) => `\`${column}\``).join(", ")}) VALUES (${placeholders})`,
    values: columns.map((column) => data[column]),
  };
}

function buildUpdate(table, data, id) {
  const columns = Object.keys(data);
  return {
    sql: `UPDATE \`${table}\` SET ${columns.map((column) => `\`${column}\` = ?`).join(", ")} WHERE id = ?`,
    values: [...columns.map((column) => data[column]), id],
  };
}

async function listResource(resourceName) {
  return db.query(resourceConfig[resourceName].listSql);
}

async function getResource(resourceName, id) {
  return db.get(resourceConfig[resourceName].getSql, [id]);
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "admin-cms", dbClient: db.client });
});

app.post("/api/auth/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const user = await db.get("SELECT * FROM `User` WHERE email = ?", [email]);

  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  res.json({
    token: signToken(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/admin/dashboard", authMiddleware, async (_req, res) => {
  const [pages, blogs, faqs, banners, gallery, users] = await Promise.all([
    db.get("SELECT COUNT(*) AS count FROM `Page`"),
    db.get("SELECT COUNT(*) AS count FROM `Blog`"),
    db.get("SELECT COUNT(*) AS count FROM `Faq`"),
    db.get("SELECT COUNT(*) AS count FROM `Banner`"),
    db.get("SELECT COUNT(*) AS count FROM `Gallery`"),
    db.get("SELECT COUNT(*) AS count FROM `User`"),
  ]);

  res.json({
    pages: pages.count,
    blogs: blogs.count,
    faqs: faqs.count,
    banners: banners.count,
    gallery: gallery.count,
    users: users.count,
  });
});

app.get("/api/admin/users", authMiddleware, requireAdmin, async (_req, res) => {
  const users = await db.query(
    "SELECT id, name, email, role, created_at AS createdAt FROM `User` ORDER BY created_at DESC"
  );
  res.json(users);
});

app.post("/api/admin/users", authMiddleware, requireAdmin, async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const role = req.body.role === "admin" ? "admin" : "editor";

  if (!name || !email || !password) {
    res.status(400).json({ error: "name, email and password are required" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await db.run(
    "INSERT INTO `User` (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );
  const user = await db.get(
    "SELECT id, name, email, role, created_at AS createdAt FROM `User` WHERE id = ?",
    [result.lastID]
  );
  res.status(201).json(user);
});

app.delete("/api/admin/users/:id", authMiddleware, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (id === req.user.id) {
    res.status(400).json({ error: "You cannot delete your own account" });
    return;
  }

  await db.run("DELETE FROM `User` WHERE id = ?", [id]);
  res.status(204).send();
});

app.get("/api/admin/settings", authMiddleware, async (_req, res) => {
  const settings = await db.query("SELECT id, `key` AS `key`, value FROM `Setting` ORDER BY `key` ASC");
  res.json(settings);
});

app.put("/api/admin/settings", authMiddleware, async (req, res) => {
  const payload = Array.isArray(req.body.settings) ? req.body.settings : [];

  await db.transaction(async (trx) => {
    for (const item of payload) {
      const key = String(item.key || "").trim();
      if (!key) {
        continue;
      }

      const existing = await trx.get("SELECT id FROM `Setting` WHERE `key` = ?", [key]);
      if (existing) {
        await trx.run("UPDATE `Setting` SET value = ? WHERE `key` = ?", [String(item.value || ""), key]);
      } else {
        await trx.run("INSERT INTO `Setting` (`key`, value) VALUES (?, ?)", [key, String(item.value || "")]);
      }
    }
  });

  const settings = await db.query("SELECT id, `key` AS `key`, value FROM `Setting` ORDER BY `key` ASC");
  res.json(settings);
});

app.get("/api/admin/seo", authMiddleware, async (_req, res) => {
  const [pages, blogs] = await Promise.all([
    db.query(
      "SELECT id, title, slug, status, seo_title AS seoTitle, seo_description AS seoDescription, updated_at AS updatedAt FROM `Page` ORDER BY updated_at DESC"
    ),
    db.query(
      "SELECT id, title, slug, status, seo_title AS seoTitle, seo_description AS seoDescription, updated_at AS updatedAt FROM `Blog` ORDER BY updated_at DESC"
    ),
  ]);

  res.json({ pages, blogs });
});

app.get("/api/admin/media", authMiddleware, async (_req, res) => {
  const files = fs
    .readdirSync(uploadsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const stats = fs.statSync(path.join(uploadsDir, entry.name));
      return {
        name: entry.name,
        url: `/uploads/${entry.name}`,
        size: stats.size,
        updatedAt: stats.mtime,
      };
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  res.json(files);
});

app.post("/api/admin/media", authMiddleware, upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "file is required" });
    return;
  }

  res.status(201).json({
    name: req.file.filename,
    url: `/uploads/${req.file.filename}`,
    size: req.file.size,
  });
});

app.delete("/api/admin/media/:name", authMiddleware, async (req, res) => {
  const fileName = path.basename(req.params.name);
  const target = path.join(uploadsDir, fileName);

  if (!fs.existsSync(target)) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  fs.unlinkSync(target);
  res.status(204).send();
});

app.get("/api/admin/:resource", authMiddleware, async (req, res) => {
  const resourceName = req.params.resource;
  if (!resourceConfig[resourceName]) {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  res.json(await listResource(resourceName));
});

app.get("/api/admin/:resource/:id", authMiddleware, async (req, res) => {
  const resourceName = req.params.resource;
  if (!resourceConfig[resourceName]) {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  const record = await getResource(resourceName, Number(req.params.id));
  if (!record) {
    res.status(404).json({ error: "Record not found" });
    return;
  }

  res.json(record);
});

app.post("/api/admin/:resource", authMiddleware, async (req, res) => {
  const resourceName = req.params.resource;
  const config = resourceConfig[resourceName];
  if (!config) {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  const data = config.parse(req.body);
  const validationError = validateRequired(data, config.required);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  const insert = buildInsert(config.table, data);
  const result = await db.run(insert.sql, insert.values);
  const record = await getResource(resourceName, result.lastID);
  res.status(201).json(record);
});

app.put("/api/admin/:resource/:id", authMiddleware, async (req, res) => {
  const resourceName = req.params.resource;
  const config = resourceConfig[resourceName];
  if (!config) {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  const id = Number(req.params.id);
  const data = config.parse(req.body);
  const validationError = validateRequired(data, config.required);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  const update = buildUpdate(config.table, data, id);
  await db.run(update.sql, update.values);
  const record = await getResource(resourceName, id);
  res.json(record);
});

app.delete("/api/admin/:resource/:id", authMiddleware, async (req, res) => {
  const resourceName = req.params.resource;
  const config = resourceConfig[resourceName];
  if (!config) {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  await db.run(`DELETE FROM \`${config.table}\` WHERE id = ?`, [Number(req.params.id)]);
  res.status(204).send();
});

app.get("/api/public/bootstrap", async (_req, res) => {
  const [settings, pages, blogs] = await Promise.all([
    db.query("SELECT `key` AS `key`, value FROM `Setting` ORDER BY `key` ASC"),
    db.query("SELECT id, title, slug, template, updated_at AS updatedAt FROM `Page` WHERE status = ? ORDER BY updated_at DESC", ["published"]),
    db.query("SELECT id, title, slug, category, featured_image AS featuredImage, excerpt, published_at AS publishedAt, updated_at AS updatedAt FROM `Blog` WHERE status = ? ORDER BY COALESCE(published_at, updated_at) DESC LIMIT 10", ["published"]),
  ]);

  res.json({
    settings: settings.reduce((accumulator, item) => {
      accumulator[item.key] = item.value;
      return accumulator;
    }, {}),
    pages,
    blogs,
  });
});

app.get("/api/public/pages/:slug", async (req, res) => {
  const page = await db.get(
    "SELECT id, title, slug, template, content, status, seo_title AS seoTitle, seo_description AS seoDescription, created_at AS createdAt, updated_at AS updatedAt FROM `Page` WHERE slug = ? AND status = ?",
    [req.params.slug, "published"]
  );

  if (!page) {
    res.status(404).json({ error: "Page not found" });
    return;
  }

  const [gallery, banners] = await Promise.all([
    db.query(
      "SELECT id, image, caption, `order` AS sortOrder, page_id AS pageId FROM `Gallery` WHERE page_id = ? ORDER BY `order` ASC, id DESC",
      [page.id]
    ),
    db.query(
      "SELECT id, page, image, title, subtitle, cta_text AS ctaText, cta_link AS ctaLink, status FROM `Banner` WHERE page = ? AND status = ? ORDER BY id DESC",
      [page.slug, "published"]
    ),
  ]);

  res.json({ ...page, galleries: gallery, banners });
});

app.get("/api/public/blogs", async (_req, res) => {
  const blogs = await db.query(
    "SELECT id, title, slug, content, excerpt, featured_image AS featuredImage, category, status, seo_title AS seoTitle, seo_description AS seoDescription, published_at AS publishedAt, created_at AS createdAt, updated_at AS updatedAt FROM `Blog` WHERE status = ? ORDER BY COALESCE(published_at, updated_at) DESC",
    ["published"]
  );
  res.json(blogs);
});

app.get("/api/public/blogs/:slug", async (req, res) => {
  const blog = await db.get(
    "SELECT id, title, slug, content, excerpt, featured_image AS featuredImage, category, status, seo_title AS seoTitle, seo_description AS seoDescription, published_at AS publishedAt, created_at AS createdAt, updated_at AS updatedAt FROM `Blog` WHERE slug = ? AND status = ?",
    [req.params.slug, "published"]
  );

  if (!blog) {
    res.status(404).json({ error: "Blog not found" });
    return;
  }

  res.json(blog);
});

app.get("/api/public/faqs", async (_req, res) => {
  const faqs = await db.query(
    "SELECT id, question, answer, `order` AS sortOrder, status FROM `Faq` WHERE status = ? ORDER BY `order` ASC, id DESC",
    ["published"]
  );
  res.json(faqs);
});

app.get("/api/public/banners/:page", async (req, res) => {
  const banners = await db.query(
    "SELECT id, page, image, title, subtitle, cta_text AS ctaText, cta_link AS ctaLink, status FROM `Banner` WHERE page = ? AND status = ? ORDER BY id DESC",
    [req.params.page, "published"]
  );
  res.json(banners);
});

app.get("/api/public/gallery", async (req, res) => {
  if (req.query.pageSlug) {
    const page = await db.get("SELECT id FROM `Page` WHERE slug = ?", [String(req.query.pageSlug)]);
    const whereId = page ? page.id : -1;
    const rows = await db.query(
      "SELECT id, image, caption, `order` AS sortOrder, page_id AS pageId FROM `Gallery` WHERE page_id = ? ORDER BY `order` ASC, id DESC",
      [whereId]
    );
    res.json(rows);
    return;
  }

  const rows = await db.query(
    "SELECT id, image, caption, `order` AS sortOrder, page_id AS pageId FROM `Gallery` ORDER BY `order` ASC, id DESC"
  );
  res.json(rows);
});

app.get("/api/public/settings", async (_req, res) => {
  const settings = await db.query("SELECT `key` AS `key`, value FROM `Setting` ORDER BY `key` ASC");
  res.json(
    settings.reduce((accumulator, item) => {
      accumulator[item.key] = item.value;
      return accumulator;
    }, {})
  );
});

app.get("/api/appointments", authMiddleware, async (_req, res) => {
  const appointments = await db.query(
    "SELECT id, name, email, phone, location, issue, service, status, created_at AS date FROM `Appointment` ORDER BY created_at DESC"
  );
  res.json(appointments);
});

app.post("/api/appointments", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const phone = String(req.body.phone || "").trim();
  const location = String(req.body.location || "").trim();
  const issue = String(req.body.issue || "").trim();

  let service = String(req.body.service || "").trim();
  const serviceType = String(req.body.serviceType || "").trim();
  const serviceMode = String(req.body.serviceMode || "").trim();

  // Combine service details for display if present
  if (serviceType) {
    service = serviceType;
    if (serviceMode) {
      service += ` (${serviceMode})`;
    }
  }

  if (!name || !phone) {
    res.status(400).json({ error: "Name and phone are required" });
    return;
  }

  const result = await db.run(
    "INSERT INTO `Appointment` (name, email, phone, location, issue, service) VALUES (?, ?, ?, ?, ?, ?)",
    [name, email, phone, location, issue, service]
  );

  res.status(201).json({ success: true, id: result.lastID });
});

app.use(express.static(publicDir));

app.get(/^(?!\/api\/|\/uploads\/).*/, (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === "SQLITE_CONSTRAINT" || error.code === "ER_DUP_ENTRY") {
    res.status(409).json({ error: "A record with this unique value already exists" });
    return;
  }

  res.status(500).json({ error: error.message || "Internal server error" });
});

async function start() {
  await db.ensureSchema();
  await ensureDefaultAdmin();
  app.listen(PORT, () => {
    console.log(`Admin CMS listening on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start Admin CMS", error);
  process.exit(1);
});
