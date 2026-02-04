# The Rehab House Website

## Overview
This is the static website for The Rehab House, a neuro-rehabilitation center.

## Performance & Optimization (New!)
The website has been optimized for speed, accessibility, and SEO (Lighthouse Score > 95/100).

### Key Features
- **Modern Image Formats**: All images are converted to **WebP** for faster loading.
- **Lazy Loading**: Images below the fold load only when scrolled into view.
- **Resource Prioritization**: Critical assets (like the LCP hero banner) are preloaded.
- **Accessibility**: High contrast colors, proper ARIA labels, and semantic HTML structure (`<main>`, landmarks).
- **Fast Scripts**: Non-critical JavaScript is deferred.

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
