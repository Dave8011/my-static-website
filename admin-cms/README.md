# Admin CMS

Custom content dashboard for The Rehab House. It is designed to run as a separate app on `admin.therehabhouse.in` while the public website runs on `therehabhouse.in`.

## What it does

- Authenticated admin dashboard with sidebar sections for:
  - Dashboard
  - Pages
  - Blogs
  - Gallery
  - FAQs
  - Banners
  - Media Library
  - Theme Settings
  - SEO
  - Users
- Draft vs published content
- Preview before publish inside the dashboard
- Public read API for the website
- Media uploads to `/uploads`

## Local setup

1. Copy `.env.example` to `.env`.
2. Start with the bundled SQLite file:
   - `DB_CLIENT=sqlite`
   - `DATABASE_URL=file:./dev.db`
3. Seed starter data:
   - `npm run seed`
4. Start the app:
   - `npm run dev`

Default login after seed:

- Email: `admin@therehabhouse.in`
- Password: `ChangeMe123!`

Change these in `.env` before production.

## Production structure

Recommended same-server layout:

- `/var/www/site` -> public website repo
- `/var/www/admin` -> admin CMS repo

Recommended domains:

- `therehabhouse.in` -> website
- `admin.therehabhouse.in` -> CMS

Both apps should point to the same production database.

## Database modes

The CMS supports:

- `DB_CLIENT=sqlite` for local/dev
- `DB_CLIENT=mysql` for production shared database

For MySQL add these env vars:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

The app creates the required tables automatically on startup.

## Public API

The website can read from these endpoints:

- `GET /api/public/bootstrap`
- `GET /api/public/pages/:slug`
- `GET /api/public/blogs`
- `GET /api/public/blogs/:slug`
- `GET /api/public/faqs`
- `GET /api/public/banners/:page`
- `GET /api/public/gallery?pageSlug=home`
- `GET /api/public/settings`

## Admin API

Main authenticated endpoints:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/admin/dashboard`
- `GET/POST/PUT/DELETE /api/admin/pages`
- `GET/POST/PUT/DELETE /api/admin/blogs`
- `GET/POST/PUT/DELETE /api/admin/faqs`
- `GET/POST/PUT/DELETE /api/admin/banners`
- `GET/POST/PUT/DELETE /api/admin/gallery`
- `GET/PUT /api/admin/settings`
- `GET /api/admin/seo`
- `GET/POST/DELETE /api/admin/media`
- `GET/POST/DELETE /api/admin/users`

## Nginx shape

Public site:

```nginx
server {
    server_name therehabhouse.in www.therehabhouse.in;
    root /var/www/site;
    index index.html;
}
```

Admin CMS:

```nginx
server {
    server_name admin.therehabhouse.in;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Website integration path

The public site in this repo is still static and currently reads some content from local HTML/JS files. To finish the full migration safely:

1. Replace hardcoded FAQs with `GET /api/public/faqs`
2. Replace blog list rendering with `GET /api/public/blogs`
3. Replace banner content with `GET /api/public/banners/:page`
4. Replace page sections that need CMS control with `GET /api/public/pages/:slug`
5. Keep layout/templates in the website repo, but move editable content to the CMS

This gives the client content control without giving them access to source code.
