function loadHeader() {
    // Check if we are in a subfolder (e.g. /blogs/)
    const isSubfolder = window.location.pathname.includes('/blogs/');
    const basePath = isSubfolder ? '../' : '';

    const headerHTML = `
    <header>
        <div class="logo">
            <a href="${basePath}index.html">
                <img src="${basePath}images/logo.webp" alt="The Rehab House Logo" width="250" height="41">
            </a>
        </div>

        <nav>
            <ul>
                <li><a href="${basePath}index.html">Home</a></li>
                <li><a href="${basePath}about_us.html">About Us</a></li>
                <li><a href="${basePath}services.html">Our Services</a></li>
                <li><a href="${basePath}achievements.html">Achievements</a></li>
                <li><a href="${basePath}blog.html">Blogs</a></li>
                <li><a href="${basePath}gallery.html">Gallery</a></li>
                <li><a href="${basePath}contact.html">Contact Us</a></li>
            </ul>
        </nav>
        
        <div class="header-actions">
            <!-- Hamburger Menu (Now before Search) -->
            <button class="hamburger" onclick="toggleMobileMenu()" aria-label="Toggle Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <!-- Search Box with Icon (Last) -->
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="Search..." onkeypress="handleSearch(event)">
                <button onclick="triggerSearch()" aria-label="Search"><img src="${basePath}images/search-icon.webp" alt="Search" width="24" height="24"></button>
            </div>
        </div>
    </header>`;
    document.getElementById('header-placeholder').innerHTML = headerHTML;
}

function loadFooter() {
    const isSubfolder = window.location.pathname.includes('/blogs/');
    const basePath = isSubfolder ? '../' : '';

    const footerHTML = `
    <footer>
        <div class="footer-container">
            <!-- 1. Brand Section -->
            <div class="footer-brand">
                <a href="${basePath}index.html" class="footer-logo">
                    <img src="${basePath}images/logo.webp" alt="The Rehab House" width="200" height="auto">
                </a>
                <p class="brand-desc">South Mumbai’s premier Neuro & Ortho Rehabilitation Centre. Restoring independence through expert care and advanced technology.</p>
                
                <div class="social-icons-row">
                     <a href="tel:+919653699526" aria-label="Call"><span class="material-icons">call</span></a>
                     <a href="https://wa.me/919653699526" target="_blank" aria-label="WhatsApp"><img src="${basePath}images/whatsapp.svg" alt="WA"></a>
                     <a href="https://www.instagram.com/the_rehab_house/" target="_blank" aria-label="Instagram">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                     </a>
                     <a href="https://www.google.com/search?q=The+Rehab+House+Girgaon+Chowpatty" target="_blank" aria-label="Google"><svg class="google-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M21.35 11.1h-9.17v2.98h5.69c-.59 2.77-2.86 4.45-5.29 4.45-3.27 0-5.91-2.63-5.91-5.91s2.64-5.91 5.91-5.91c1.29 0 2.52.41 3.49 1.15l2.25-2.25C16.96 4.24 14.8 3.5 12.18 3.5 7.4 3.5 3.5 7.4 3.5 12.18s3.9 8.68 8.68 8.68c4.68 0 8.84-3.4 8.84-8.84 0-.61-.06-1.3-.17-1.92z"/></svg></a>
                </div>
            </div>

            <!-- 2. Quick Links -->
            <div class="footer-col accordion-col">
                <h3 onclick="toggleFooterAccordion(this)">Quick Links <span class="accordion-icon">+</span></h3>
                <ul>
                    <li><a href="${basePath}index.html">Home</a></li>
                    <li><a href="${basePath}about_us.html">About Us</a></li>
                    <li><a href="${basePath}services.html">Our Services</a></li>
                    <li><a href="${basePath}achievements.html">Achievements</a></li>
                    <li><a href="${basePath}blog.html">Blogs</a></li>
                    <li><a href="${basePath}gallery.html">Gallery</a></li>
                    <li><a href="${basePath}contact.html">Contact Us</a></li>
                </ul>
            </div>

            <!-- 3. Our Services -->
            <div class="footer-col accordion-col">
                <h3 onclick="toggleFooterAccordion(this)">Our Services <span class="accordion-icon">+</span></h3>
                <ul>
                    <li><a href="${basePath}services.html">Physiotherapy</a></li>
                    <li><a href="${basePath}services.html">Occupational Therapy</a></li>
                    <li><a href="${basePath}services.html">Speech Therapy</a></li>
                    <li><a href="${basePath}services.html">Robotic Rehab</a></li>
                    <li><a href="${basePath}services.html">Neuro Rehabilitation</a></li>
                </ul>
            </div>

            <!-- 4. Contact Info -->
            <div class="footer-col contact-col">
                <h3>Contact Us</h3>
                <p>
                    <span class="material-icons">location_on</span> 
                    <a href="https://www.google.com/search?q=The+Rehab+House+Girgaon+Chowpatty" target="_blank">
                        The Rehab House, Girgaon Chowpatty, Mumbai
                    </a>
                </p>
                <p><span class="material-icons">phone</span> <a href="tel:+919653699526">+91 96536 99526</a></p>
                <p><span class="material-icons">email</span> <a href="mailto:info@therehabhouse.in">info@therehabhouse.in</a></p>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; 2025 The Rehab House. All Rights Reserved.</p>
            <p><a href="${basePath}admin/login.html" class="admin-link">Admin Login</a></p>
        </div>
    </footer>

    <!-- Mobile Sticky CTA -->
    <div class="mobile-sticky-cta" id="mobileStickyCTA">
        <a href="${basePath}contact.html#booking">Book Appointment</a>
    </div>
    `;
    document.getElementById('footer-placeholder').innerHTML = footerHTML;

    initStickyCTA();
}

function initStickyCTA() {
    const stickyCTA = document.getElementById('mobileStickyCTA');
    if (!stickyCTA) return;

    // Logic: 
    // 1. Hide on Contact Page (contacts.html)
    // 2. Hide on Home Page (index.html or root)

    const path = window.location.pathname;
    const pageName = path.split("/").pop();

    // Check if Home or Contact
    const isHome = pageName === "" || pageName === "index.html";
    const isContact = pageName === "contact.html";

    if (isHome || isContact) {
        // Remove completely
        stickyCTA.remove();
        return;
    }

    // Scroll Logic: Show after scrolling 300px
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            stickyCTA.classList.add('show');
        } else {
            stickyCTA.classList.remove('show');
        }
    });
}

// Auto-load on script run
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('header-placeholder')) loadHeader();
    if (document.getElementById('footer-placeholder')) loadFooter();
});

// Sticky Header Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

function toggleFooterAccordion(header) {
    if (window.innerWidth > 768) return; // Disable on desktop
    const parent = header.parentElement;
    parent.classList.toggle('active');
}
