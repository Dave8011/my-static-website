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
