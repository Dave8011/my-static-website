# The Rehab House Website

## Overview
This is the static website for The Rehab House, a neuro-rehabilitation center.

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

### Adding a New Blog Post
1. **Create the Post**:
   - Duplicate an existing blog file in the `blogs/` folder (e.g., `blogs/stroke-recovery.html`).
   - Rename it (e.g., `blogs/new-topic.html`) and update the content (Title, Date, Body, Image).

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
| **Service Cards** | 600 x 450 px | 4:3 | Service listing images |
| **Blog Cards** | 800 x 450 px | 16:9 | Blog post thumbnails |
| **Team Photos** | 400 x 400 px | 1:1 (Square) | Doctor profiles |

### How to Change Page Banners

Each page uses a specific CSS class for its banner image. To change a banner:

1.  **Upload the Image**: Save your new image in the `images/` folder (e.g., `new-banner.jpg`).
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
            background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('../images/new-banner.jpg') center/cover no-repeat;
        }
        ```
