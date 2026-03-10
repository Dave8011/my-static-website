require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("./db");

async function ensureSetting(key, value) {
  const existing = await db.get("SELECT id FROM `Setting` WHERE `key` = ?", [key]);
  if (existing) {
    await db.run("UPDATE `Setting` SET value = ? WHERE `key` = ?", [value, key]);
    return;
  }

  await db.run("INSERT INTO `Setting` (`key`, value) VALUES (?, ?)", [key, value]);
}

async function seed() {
  await db.ensureSchema();

  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || "ChangeMe123!", 10);
  const adminEmail = process.env.ADMIN_EMAIL || "admin@therehabhouse.in";
  const adminUser = await db.get("SELECT id FROM `User` WHERE email = ?", [adminEmail]);

  if (!adminUser) {
    await db.run(
      "INSERT INTO `User` (name, email, password, role) VALUES (?, ?, ?, ?)",
      [process.env.ADMIN_NAME || "Site Admin", adminEmail, password, "admin"]
    );
  }

  const homePage = await db.get("SELECT id FROM `Page` WHERE slug = ?", ["home"]);
  let homePageId = homePage?.id;

  if (!homePage) {
    const created = await db.run(
      "INSERT INTO `Page` (title, slug, template, content, status, seo_title, seo_description, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "Home",
        "home",
        "homepage",
        "<section><h1>The Rehab House</h1><p>Update this homepage content from the CMS dashboard.</p></section>",
        "published",
        "The Rehab House | Neuro Rehab Centre",
        "Recovery-focused rehabilitation and therapy services.",
        new Date().toISOString(),
      ]
    );
    homePageId = created.lastID;
  }

  const blog = await db.get("SELECT id FROM `Blog` WHERE slug = ?", ["welcome-to-the-cms"]);
  if (!blog) {
    await db.run(
      "INSERT INTO `Blog` (title, slug, content, excerpt, featured_image, category, status, seo_title, seo_description, published_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "Welcome To The CMS",
        "welcome-to-the-cms",
        "<p>This sample blog is managed from the admin dashboard.</p>",
        "This sample post shows how blog content can be managed without touching code.",
        "/uploads/sample-blog.jpg",
        "Updates",
        "published",
        "Welcome To The CMS",
        "Introductory post for the custom content dashboard.",
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );
  }

  const banner = await db.get("SELECT id FROM `Banner` WHERE id = 1");
  if (!banner) {
    await db.run(
      "INSERT INTO `Banner` (page, image, title, subtitle, cta_text, cta_link, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        "home",
        "/uploads/sample-banner.jpg",
        "Edit website content without touching code",
        "Banners, blogs, pages, FAQs and gallery can all be managed here.",
        "Book Consultation",
        "/contact.html",
        "published",
      ]
    );
  }

  const faq = await db.get("SELECT id FROM `Faq` WHERE id = 1");
  if (!faq) {
    await db.run(
      "INSERT INTO `Faq` (question, answer, `order`, status) VALUES (?, ?, ?, ?)",
      [
        "Can staff update website content without editing files?",
        "Yes. They can log in to the dashboard, preview changes, and publish content safely.",
        1,
        "published",
      ]
    );
  }

  const gallery = await db.get("SELECT id FROM `Gallery` WHERE id = 1");
  if (!gallery) {
    await db.run(
      "INSERT INTO `Gallery` (image, caption, `order`, page_id) VALUES (?, ?, ?, ?)",
      ["/uploads/sample-gallery.jpg", "Sample gallery item", 1, homePageId]
    );
  }

  const settings = [
    ["site_name", "The Rehab House"],
    ["brand_tagline", "Neuro rehab care with measurable recovery plans"],
    ["contact_phone", "+91-00000-00000"],
    ["contact_email", "hello@therehabhouse.in"],
    ["primary_color", "#0F6A73"],
    ["secondary_color", "#F5B041"],
    ["footer_address", "Your clinic address goes here"],
  ];

  for (const [key, value] of settings) {
    await ensureSetting(key, value);
  }
}

seed()
  .then(() => {
    console.log("Seed complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
