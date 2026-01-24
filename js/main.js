// Search Functions
function handleSearch(event) {
    if (event.key === 'Enter') {
        triggerSearch();
    }
}

function triggerSearch() {
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    if (query) {
        // Redirect to search results page
        window.location.href = `search_results.html?q=${encodeURIComponent(query)}`;
    } else {
        // Toggle visibility
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
            searchInput.focus();
        }
    }
}

// Mobile Search Toggle (Intended usage: Add a toggle button in HTML or handle in CSS)
function toggleMobileSearch() {
    const searchBox = document.querySelector('.search-box');
    searchBox.classList.toggle('active');
    const input = document.getElementById('searchInput');
    if (searchBox.classList.contains('active')) {
        input.focus();
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
}


// Service Details Toggle
function toggleDetails(id) {
    const element = document.getElementById(id);
    if (!element) return;

    // Toggle the 'active' class on the parent card
    const card = element.closest('.service-card');
    if (card) {
        card.classList.toggle('active');
    }
}

// Profile Popup Functions
function openProfile(doctor) {
    const popup = document.getElementById('profilePopup');
    const overlay = document.getElementById('popupOverlay');
    const frame = document.getElementById('profileFrame');

    if (!popup || !overlay || !frame) return;

    if (doctor === 'vidhi') {
        frame.src = 'profiles/dr-vidhi.html';
    } else if (doctor === 'vinit') {
        frame.src = 'profiles/dr-vinit.html';
    }

    popup.classList.add('show');
    overlay.classList.add('show');
}

function closePopup() {
    const popup = document.getElementById('profilePopup');
    const overlay = document.getElementById('popupOverlay');
    const frame = document.getElementById('profileFrame');

    if (!popup || !overlay || !frame) return;

    popup.classList.remove('show');
    overlay.classList.remove('show');
    // frame.src = ''; // Optional: clear source to stop video playback etc if any
}

// Appointment System (Mock API)
// TODO: Replace this with real API call when server is ready
function saveAppointment(data) {
    // 1. Get existing appointments
    let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');

    // 2. Add new data with timestamp
    data.date = new Date().toISOString().split('T')[0]; // Simple YYYY-MM-DD
    data.timestamp = new Date().toISOString();
    appointments.unshift(data); // Add to top

    // 3. Save back to localStorage
    localStorage.setItem('appointments', JSON.stringify(appointments));

    return true; // Simulate success
}

function handleAppointmentSubmit(event) {
    event.preventDefault();
    const form = event.target;

    // Extract data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Save (Mock API call)
    saveAppointment(data);

    // Feedback
    alert("Appointment Request Sent! We will contact you shortly.");
    form.reset();

    // If inside popup (iframe), close it?
    // checking if we are inside the iframe logic or main page
    if (window.parent && window.parent.closePopup && window.frameElement) {
        window.parent.closePopup();
    }
}

// Back to Top functionality
window.onscroll = function () {
    const btn = document.getElementById("backToTop");
    if (btn) {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            btn.style.display = "flex";
        } else {
            btn.style.display = "none";
        }
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// FAQ Accordion
function toggleAccordion(header) {
    const content = header.nextElementSibling;

    // Toggle active classes
    header.classList.toggle('active');
    content.classList.toggle('active');

    // Close other items (optional - currently allowing multiple open)
}

// Load Testimonials
document.addEventListener('DOMContentLoaded', () => {
    const testimonialContainer = document.getElementById('testimonial-container');
    if (testimonialContainer) {
        if (typeof testimonialsData !== 'undefined') {
            testimonialContainer.innerHTML = testimonialsData.map(t => `
                <div class="testimonial-card">
                    <p>"${t.text}"</p>
                    <h4>- ${t.author}</h4>
                </div>
            `).join('');
        } else {
            console.error("Testimonials data missing.");
        }
    }
});

// Load FAQs
document.addEventListener('DOMContentLoaded', () => {
    const faqContainer = document.getElementById('faq-container');
    if (faqContainer && typeof faqsData !== 'undefined') {
        faqContainer.innerHTML = faqsData.map(faq => `
            <div class="accordion-item">
                <div class="accordion-header" onclick="toggleAccordion(this)">${faq.question}</div>
                <div class="accordion-content">
                    <p>${faq.answer}</p>
                </div>
            </div>
        `).join('');
    }
});

// Helper: Hydrate a single blog card from its source file
async function hydrateBlogCard(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract Metadata
        const title = doc.querySelector('h1')?.innerText || 'Untitled Post';
        const date = doc.querySelector('.text-muted')?.innerText || 'Date Unknown'; // Assumes date has this class
        let imageSrc = doc.querySelector('article img')?.getAttribute('src') || 'images/logo.png';
        const excerpt = doc.querySelector('article img + p')?.innerText.substring(0, 100) + '...' || 'Read more to find out...';

        // Fix relative image path (Assumes blog is in blogs/ and image is in ../images/)
        // If the source image is "../images/foo.jpg", and we are on index.html, we want "images/foo.jpg".
        if (imageSrc.startsWith('../')) {
            imageSrc = imageSrc.substring(3); // Remove "../"
        }

        return `
            <article class="blog-card">
                <div class="blog-img" style="background-image: url('${imageSrc}'); background-size: cover; background-position: center;"></div>
                <div class="blog-content">
                    <span class="blog-date">${date}</span>
                    <h3 class="blog-title">${title}</h3>
                    <p class="blog-excerpt">${excerpt}</p>
                    <a href="${url}" class="read-more">Read More →</a>
                </div>
            </article>
        `;
    } catch (err) {
        console.error(`Failed to load blog from ${url}:`, err);
        return '';
    }
}

// Load Blogs (Handles blog.html placeholders only)
document.addEventListener('DOMContentLoaded', async () => {
    const blogContainer = document.getElementById('blog-container');
    if (!blogContainer) return;

    // Case 1: We are on blog.html and see placeholders
    const placeholders = document.querySelectorAll('.blog-placeholder');
    if (placeholders.length > 0) {
        for (const ph of placeholders) {
            const src = ph.getAttribute('data-src');
            if (src) {
                const cardHTML = await hydrateBlogCard(src);
                if (cardHTML) {
                    ph.outerHTML = cardHTML; // Replace placeholder with real card
                }
            }
        }
    }
});

// =============================
// Schema.org Generator
// =============================
function createSchema() {
    // 1. FAQ Schema
    if (typeof faqsData !== 'undefined' && faqsData.length > 0) {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqsData.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };
        injectSchema(faqSchema);
    }

    // 2. MedicalBusiness Schema (Static with AggregateRating)
    const medicalSchema = {
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        "name": "The Rehab House",
        "url": "https://www.therehabhouse.in/",
        "image": window.location.origin + "/images/logo.png",
        "telephone": "+919653699526",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Purandare Diagnostic Centre, Dr Purandare Hospital, Opposite Girgaon Chowpatty, Charni Road",
            "addressLocality": "Mumbai",
            "postalCode": "400007",
            "addressCountry": "IN"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "17"
        }
    };
    injectSchema(medicalSchema);
}

function injectSchema(json) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(json);
    document.head.appendChild(script);
}

// Run Schema Generator
document.addEventListener('DOMContentLoaded', createSchema);
