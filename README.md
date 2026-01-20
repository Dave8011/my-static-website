# Site Maintenance Guide

## Structure
- **`js/data.js`**: Edit Testimonials, FAQs, and Blog Titles/Links here.
- **`js/header_footer.js`**: Edit the global Header and Footer HTML here.
- **`blogs/`**: Folder containing individual blog post HTML files.

## Adding a New Blog Post
1. Create a new HTML file in the `blogs/` folder (e.g., `blogs/new-topic.html`).
2. Copy the structure from an existing blog file.
3. Update `js/data.js`: Add a new entry to the `blogs` array.
   ```javascript
   {
       id: "new-topic",
       title: "New Blog Topic",
       date: "Jan 01, 2026",
       excerpt: "Short summary...",
       image: "images/placeholder.jpg",
       link: "blogs/new-topic.html"
   }
   ```

## Editing Testimonials or FAQs
- Open `js/data.js` and modify the text in the `testimonials` or `faqs` array. No HTML editing required.
