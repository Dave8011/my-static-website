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
        <div class="footer-content" style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 20px;">
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><a href="${basePath}index.html" style="color: inherit; text-decoration: none;">Home</a></li>
                    <li><a href="${basePath}about_us.html" style="color: inherit; text-decoration: none;">About Us</a></li>
                    <li><a href="${basePath}services.html" style="color: inherit; text-decoration: none;">Our Services</a></li>
                    <li><a href="${basePath}achievements.html" style="color: inherit; text-decoration: none;">Achievements</a></li>
                    <li><a href="${basePath}blog.html" style="color: inherit; text-decoration: none;">Blogs</a></li>
                    <li><a href="${basePath}gallery.html" style="color: inherit; text-decoration: none;">Gallery</a></li>
                    <li><a href="${basePath}contact.html" style="color: inherit; text-decoration: none;">Contact Us</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Visit Us</h3>
                 <p><a href="https://www.google.com/maps/dir//Purandare+Diagnostic+Centre,+Dr+Purandare+Hospital,+Opposite+Girgaon+Chowpatty,+Charni+Road,+Mumbai" target="_blank" style="color: inherit; text-decoration: underline;">Get Directions 📍</a></p>
                 <p>&copy; 2025 The Rehab House | <a href="${basePath}admin/login.html"
                    style="color: inherit; text-decoration: none;">Admin Login</a></p>
            </div>

            <!-- Social Media -->
            <div class="footer-section">
                <h3>Social Media</h3>
                <div class="social-buttons-container" style="justify-content: flex-start; margin-top: 10px;">
                     <!-- Call -->
                    <a href="tel:+919653699526" class="circle-btn">
                        <div class="icon-container">
                            <span class="material-icons">call</span>
                        </div>
                        <span class="btn-text">Call Now</span>
                    </a>
                    
                    <!-- WhatsApp -->
                    <a href="https://wa.me/919653699526" class="circle-btn" target="_blank">
                        <div class="icon-container">
                             <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp">
                        </div>
                        <span class="btn-text">WhatsApp</span>
                    </a>

                    <!-- Instagram -->
                    <a href="https://www.instagram.com/the_rehab_house/" class="circle-btn" target="_blank">
                        <div class="icon-container">
                             <img src="${basePath}images/instagram-icon.webp" alt="Instagram">
                        </div>
                        <span class="btn-text">Instagram</span>
                    </a>

                    <!-- Google Profile -->
                    <a href="https://www.google.com/maps/dir//Purandare+Diagnostic+Centre,+Dr+Purandare+Hospital,+Opposite+Girgaon+Chowpatty,+Charni+Road,+Mumbai" class="circle-btn" target="_blank">
                         <div class="icon-container">
                            <!-- Using a Google 'G' icon or Map icon -->
                            <svg class="google-icon-svg" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.35 11.1h-9.17v2.98h5.69c-.59 2.77-2.86 4.45-5.29 4.45-3.27 0-5.91-2.63-5.91-5.91s2.64-5.91 5.91-5.91c1.29 0 2.52.41 3.49 1.15l2.25-2.25C16.96 4.24 14.8 3.5 12.18 3.5 7.4 3.5 3.5 7.4 3.5 12.18s3.9 8.68 8.68 8.68c4.68 0 8.84-3.4 8.84-8.84 0-.61-.06-1.3-.17-1.92z"/>
                            </svg>
                        </div>
                        <span class="btn-text">Google Profile</span>
                    </a>
                </div>
            </div>
        </div>
    </footer>
    
    <!-- Mobile Sticky CTA (Hidden by default, shown via JS on proper pages) -->
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
