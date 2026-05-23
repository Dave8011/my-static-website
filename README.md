# The Rehab House Website

## Overview
This is the static website for The Rehab House, a neuro-rehabilitation center.

## Admin API Setup
This project now includes an Express backend for secure admin login and appointment storage in a local JSON file.

1. Copy `.env.example` to `.env`
2. Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, and `ALLOWED_ORIGINS`
3. Install dependencies with `npm install`
4. Start the server with `npm start`

The server will:

- serve the static website
- accept public appointment submissions at `POST /api/appointments`
- handle admin login at `POST /api/admin/login`
- return protected appointment data at `GET /api/admin/appointments`

For your split-domain setup:

- `therehabhouse.in` submits to `https://api.therehabhouse.in/api/appointments`
- `admin.therehabhouse.in` calls the backend API at `https://api.therehabhouse.in`
- the backend must allow credentialed CORS for the website and admin origins

For production on your home server, run it behind HTTPS and set `COOKIE_SECURE=true`.

## Performance & Optimization (New!)
The website has been aggressively optimized for speed, accessibility, and Technical SEO (Lighthouse Score > 95/100).

### Key Features
- **Modern Image Formats & CLS Prevention**: All local images are converted to **WebP** for faster loading. Additionally, all `<img>` tags have explicit `width` and `height` attributes to prevent Cumulative Layout Shift (CLS).
- **SEO & Social Sharing**: Every page features a self-referencing **Canonical Tag** to prevent duplicate content issues, and **Open Graph (OG) Tags** so links display beautifully with images/titles when shared on WhatsApp, Facebook, or Twitter.
- **Sitemap Enhancements**: The `sitemap.xml` uses `<lastmod>` tags to notify Google of fresh content.
- **Lazy Loading**: Images below the fold load only when scrolled into view.
- **Resource Prioritization**: Critical assets (like the LCP hero banner) are preloaded.
- **Accessibility**: High contrast colors, proper ARIA labels, and semantic HTML structure (`<main>`, landmarks).
- **Fast Scripts**: Non-critical JavaScript is deferred.

### How to Maintain SEO Standards
When adding **new pages** or **new content**, follow these rules to maintain the site's high optimization:
1. **New HTML Pages**: Always copy the `<head>` meta tags from an existing page. Be sure to update the `<link rel="canonical" href="...">` and `<meta property="og:url" content="...">` to match the exact new URL.
2. **New Images**: Always define explicit `width` and `height` attributes matching the image's true dimensions (e.g., `<img src="..." width="600" height="600">`). Whenever possible, use `.webp` format instead of `.png` or `.jpg`.
3. **Sitemap**: If you add a new page or significantly update an existing one, update the `<lastmod>` date in `sitemap.xml`.

---

## Content Management

### Updating Testimonials
1. Open `js/testimonials.js`.
2. Add a new object to the `testimonialsData` array:
   ```javascript
   {
       text: "Your testimonial text here.",
       author: "Patient Name"
   }
   ```
3. Save the file.

**To Adjust Testimonial Marquee Speed:**
1. Open `css/components.css`.
2. Locate the `.marquee-content` class.
3. Adjust the seconds in the `animation` property (e.g., change `40s` to `30s` for faster scrolling, or `60s` for slower):
   ```css
   .marquee-content {
       animation: scroll 27s linear infinite;
   }
   ```

### Updating FAQs
1. Open `js/faqs.js`.
2. Add a new object to the `faqsData` array:
   ```javascript
   {
       question: "New Question?",
       answer: "New Answer."
   }
   ```
3. Save the file.

### Updating Services
1. Open `js/services_data.js`.
2. Locate the `servicesData` object.
3. You can edit existing services or add a new one.
   *   **Key**: A unique ID (e.g., `"service7"`).
   *   **Title**: The name of the service.
   *   **Image**: Path to the image (e.g., `"images/new-service.webp"`).
   *   **Description**: Short summary for the list view.
   *   **detailsHTML**: The full content for the detail page. You can use standard HTML tags like `<h4>`, `<p>`, and `<ul>` here.

   ```javascript
   "service7": {
       "title": "New Service Name",
       "image": "images/new-service.webp",
       "description": "Short description.",
       "detailsHTML": `
           <h4>Overview</h4>
           <p>Detailed description...</p>
           <h4>Benefits</h4>
           <ul>
               <li>Benefit 1</li>
               <li>Benefit 2</li>
           </ul>
       `
   }
   ```
4. **Important**: If you add a new service ID (e.g., `service7`), you must also add a card for it in `services.html` that links to `service_detail.html?id=service7`.

### Updating Book Appointment Service Types
To update the "Service Type" dropdown in the Book an Appointment form:
1. Open `contact.html`.
2. Locate the `<select id="serviceType" name="serviceType" required>` element.
3. Add, edit, or remove the `<option value="TypeName">TypeName</option>` tags inside it.

### Updating Doctors Section
1. Open `js/doctors_data.js`.
2. Locate the `doctorsData` array.
3. Add a new object for the new doctor:
   ```javascript
   {
       id: "unique_id", // e.g., "dr-name"
       name: "Dr. Name Surname",
       specialty: "Specialization details...",
       image: "images/dr-photo.webp",
       profileLink: "profiles/dr-name.html" // Optional if profile page exists
   }
   ```
4. Save the file. The contact page will automatically update.

### Adding a New Blog Post
1. **Create the Post**:
   - Duplicate an existing blog file in the `blogs/` folder (e.g., `blogs/stroke-recovery.html`).
   - Rename it (e.g., `blogs/new-topic.html`) and update the content (Title, Date, Body, Image).
   - **Note**: Ensure you use `.webp` images for best performance.

2. **Update the Blog List**:
   - Open `blog.html`.
   - Add a new line at the top of the `#blog-container` list:
     ```html
     <div class="blog-placeholder" data-src="blogs/new-topic.html"></div>
     ```
   - That's it! The site will automatically read the Title, Date, Image, and Excerpt from your new file.

3. **Homepage Update**:
   - The Homepage (`index.html`) automatically fetches the first 3 posts from `blog.html`. You do **not** need to edit the homepage.

## Development
- **Styles**: Located in `css/`. Mobile styles are in `css/responsive.css`.
- **Scripts**: located in `js/`. `main.js` handles dynamic loading.

## Image Assets & Dimensions

To ensure the best visual quality, please use images with the following dimensions:

| Component | Recommended Size | Aspect Ratio | Usage |
| :--- | :--- | :--- | :--- |
| **Main Hero Banner** | 1920 x 800 px | 2.4:1 | Homepage top banner |
| **Page Banners** | 1920 x 600 px | 3:1 | About, Services, Contact, Blog headers |
| **Service Cards** | 600 x 600 px | 1:1 | Service listing images (Resized for Perf) |
| **Blog Cards** | 800 x 450 px | 16:9 | Blog post thumbnails |
| **Team Photos** | 400 x 400 px | 1:1 (Square) | Doctor profiles |

### How to Change Page Banners

Each page uses a specific CSS class for its banner image. To change a banner:

1.  **Upload the Image**: Save your new image in the `images/` folder (e.g., `new-banner.webp`).
2.  **Update CSS**:
    *   Open `css/pages.css`.
    *   Search for the relevant class:
        *   `.hero-home` (Homepage)
        *   `.hero-about` (About Us)
        *   `.hero-services` (Our Services)
        *   `.hero-contact` (Contact Us)
        *   `.hero-blog` (Blog)
    *   Update the `url(...)` property:
        ```css
        /* Example for Contact Page */
        .hero-contact {
            /* Keep the gradient for text readability */
            background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('../images/new-banner.webp') center/cover no-repeat;
        }
        ```

## Customization

### Updating Social Media & External Links
The links for WhatsApp, Instagram, Google Profile, and Phone numbers appear in two primary locations. To update them:

1. **Homepage Hero Banner:**
   - Open `index.html`.
   - Locate the `<div class="social-buttons-container">` section (around line 45).
   - Update the `href` attributes inside the `<a>` tags.
   - Example: `<a href="https://www.instagram.com/your_new_handle" ...>`

2. **Global Footer:**
   - Open `js/header_footer.js`.
   - Locate the `loadFooter()` function.
   - Look for the `<div class="social-icons-row">` (around line 57).
   - Update the `href` attributes for WhatsApp, Instagram, Google Search, and the Phone number.

### Changing Fonts
The website uses a centralized CSS variable system for fonts. To change the font family:

1.  **Import the Font**: Ensure your desired font is loaded in the `head` of your HTML files (e.g., via Google Fonts).
    *   Example: `<link href="https://fonts.googleapis.com/..." rel="stylesheet">`
2.  **Update Variables**:
    *   Open `css/variables.css`.
    *   Update `--font-heading` for headings (h1, h2, h3...).
    *   Update `--font-body` for main text.
    ```css
    :root {
        --font-heading: 'Your New Font', sans-serif;
        --font-body: 'Your New Font', sans-serif;
    }
    ```
    *   This will automatically update the font across the entire website, including the Admin Dashboard and Blog.

### Changing Text Colors
Colors are also managed globally in `css/variables.css`.

1.  Open `css/variables.css`.
2.  Locate the color variables:
    *   `--primary-color`: Main brand color (Gold/Yellow). used for headings and buttons.
    *   `--dark-color`: Main text color for paragraphs and body text.
    *   `--gold-text`: Accent text color.
    *   `--white-color`: Backgrounds and inverse text.
3.  Update the Hex code to your desired color:
    ```css
    :root {
        --dark-color: #333333; /* Change this for main body text color */
        --gold-text: #DEAC01;  /* Change this for accent text color */
    }
    ```

### Customizing Icons in Rehab Sections
The "7 Unique Sections" in `services.html` use Google Material Icons.

1.  **Choose an Icon**: Visit [Google Material Icons](https://fonts.google.com/icons) and find a suitable icon name (e.g., `fitness_center`, `psychology`).
2.  **Update HTML**:
    *   Open `services.html`.
    *   Locate the `rehab-pointers` section (approx line 108).
    *   Find the `<span>` with class `material-icons`.
    *   Replace the text inside the span with your new icon name.
    
    ```html
    <div class="pointer-circle">
        <!-- Change 'fitness_center' to your desired icon name -->
        <span class="material-icons">fitness_center</span>
    </div>
    ```

## Managing About Us Content

The "How are we different" section in `about_us.html` is dynamically generated.

### **To Add or Edit Items:**
1.  Open **`js/aboutus.js`**.
2.  Locate the **`rehabDifferences`** array.
3.  Each item is an object with:
    -   `title`: The heading of the card.
    -   `content`: The full description text.
    -   `image`: Path to the image (e.g., `images/filename.jpg`).
    -   `alt`: Alt text for accessibility.

**Example Item:**
```javascript
{
    title: "New Service Feature",
    content: "Description of the new feature...",
    image: "images/new-image.jpg",
    alt: "Description of image"
}
```

### **Adding New Images:**
1.  Place your image file (JPG/PNG/WEBP) in the **`images/`** folder.
2.  Update the `image` path in `js/aboutus.js` to match the new filename.

---

## Homepage Announcement Strip (RE:SET Sessions)

A premium structural horizontal announcement strip is implemented on the homepage (`index.html`) to highlight special campaigns (e.g., Sunday RE:SET Sessions).

### **Homepage Announcement Strip (Below Hero & Above Testimonials)**
This is a sleek, dark horizontal strip placed right below the main homepage Hero and above the Patient Testimonials.
*   **To HIDE the strip:**
    Locate the `<div id="homepage-reset-strip">` element (near line 100) and add the `hidden` class:
    ```html
    <div id="homepage-reset-strip" class="homepage-reset-strip hidden">
    ```
*   **To SHOW the strip (Default):**
    Ensure the `hidden` class is absent:
    ```html
    <div id="homepage-reset-strip" class="homepage-reset-strip">
    ```

---

## Clean URL Architecture & Administrator Maintenance Guide

We have migrated **The Rehab House (TRH)** website to premium, clean, search-engine-optimized URLs (e.g. `/about-us` instead of `/about_us.html`).

### **How Clean URLs Work**

The server uses Vercel's native routing configuration defined in [`vercel.json`](file:///home/dave/dev/my-static-website/vercel.json):
1. **Clean URLs Enabled (`"cleanUrls": true`)**: Instantly strips all `.html` extensions from the address bar (e.g., loading `/about-us.html` automatically renders as `/about-us`).
2. **Permanent 301 Redirects**: Any legacy request targeting underscores or `.html` extensions (e.g. `/about_us.html`, `/services.html`, `/contact.html`, `/sunday-reset.html`) is permanently redirected with a 301 status code to its corresponding modern clean path.
3. **Hyphenated Standards**: All new clean URLs strictly use hyphens (`-`) rather than underscores (`_`) for modern aesthetic and standardized long-term SEO structure.

---

### **How to Add a New Page to the Website**

To create a new page under this modern structure, follow this simple checklist:

1. **Create the HTML File**:
   - Save the file using lowercase letters and hyphens (e.g., `our-philosophy.html`).
2. **Update the Head Metas**:
   - Set the `<link rel="canonical" href="https://www.therehabhouse.in/our-philosophy" />` (use the clean extension-less path).
3. **Configure Redirection**:
   - Open [`vercel.json`](file:///home/dave/dev/my-static-website/vercel.json).
   - Add a 301 redirect rule at the top of the `"redirects"` list:
     ```json
     { "source": "/our-philosophy.html", "destination": "/our-philosophy", "statusCode": 301 }
     ```
4. **Link to the Page**:
   - When linking to the page from any header, footer, or body button, link to `/our-philosophy` (do **NOT** include `.html` or underscores).

---

### **How to Edit the Sunday RE:SET Page (`reset-sessions.html`)**

The campaign page is fully optimized for custom styling, high-performance visual imagery, and conversion triggers. Here is how to maintain it:

#### **1. Swapping / Modifying Page Images**
*   **Hero Section Banner Background**:
    - The full-bleed background image is loaded in [`css/sunday-reset.css`](file:///home/dave/dev/my-static-website/css/sunday-reset.css) under `.reset-hero`.
    - To change it, upload your new image to the `images/` directory (e.g. `images/my-new-banner.jpg`) and replace line 69:
      ```css
      background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.7)), 
                  url('../images/my-new-banner.jpg') center/cover no-repeat;
      ```
*   **Assisted Stretch Section Image**:
    - Locate the `SECTION 6 — WHY TRH IS DIFFERENT` block in [`reset-sessions.html`](file:///home/dave/dev/my-static-website/reset-sessions.html).
    - Find the `<img>` tag at line 284:
      ```html
      <img src="images/pain-management.webp" alt="Therapist Guided Stretch Session" />
      ```
    - Replace `src="images/pain-management.webp"` with your new image path.
*   **Inside the Recovery Lounge Gallery Images**:
    - Locate `SECTION 7 — GALLERY / REAL PHOTOS` in `reset-sessions.html` (lines 290 to 326).
    - There are 4 grid cards containing `<img>` nodes. Simply upload your photos to `images/` and update the corresponding `src` attributes and `alt` text labels for instant refresh.

#### **2. Changing Text, Headers & Inclusions**
*   **Editing marketing copy**: Locate the text tag you want to modify in [`reset-sessions.html`](file:///home/dave/dev/my-static-website/reset-sessions.html) and replace the copy directly inside the tag (e.g. changing dynamic stretching bullet descriptions under `SECTION 3`).
*   **Adding/Updating Session Types (Packages)**:
    - In `reset-sessions.html` under `SECTION 3`, you will see two card panels: `RE:SET Recovery` and `Express Recovery`.
    - You can edit their durations, add details inside `<li>` nodes, or copy-paste a card to create a third customized tier.

#### **3. Updating Booking WhatsApp Links**
*   If you need to change the destination phone number or pre-filled message text on click:
    - Generate a new WhatsApp shortlink (e.g., via wa.link).
    - Find the three booking buttons in [`reset-sessions.html`](file:///home/dave/dev/my-static-website/reset-sessions.html) (search for `"https://wa.link/leqiek"`).
    - Replace all instances with your new link.

---

### **How to Update Client-Side Search Indexes**

When you create a new page, make sure users can easily find it using the search box:

1. **Static HTML Indexing**:
   - Open [`search-results.html`](file:///home/dave/dev/my-static-website/search-results.html).
   - Scroll to `siteIndex` array (around line 70).
   - Add a new object following this clean-URL layout:
     ```javascript
     {
         title: "Our Philosophy",
         url: "our-philosophy",
         content: "keywords, mission, vision, holistic rehabilitation details..."
     }
     ```
2. **Text Scanning Crawler**:
   - Open [`js/search.js`](file:///home/dave/dev/my-static-website/js/search.js).
   - Add the physical file reference to the `pages` fetching array (around line 13):
     ```javascript
     { name: "Our Philosophy", url: "our-philosophy.html" }
     ```
   - The search crawler will automatically fetch, index, and generate premium clean links for matching entries!

