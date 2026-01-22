function loadHeader() {
    // Check if we are in a subfolder (e.g. /blogs/)
    const isSubfolder = window.location.pathname.includes('/blogs/');
    const basePath = isSubfolder ? '../' : '';

    const headerHTML = `
    <header>
        <div class="logo">
            <a href="${basePath}index.html">
                <img src="${basePath}images/logo.png" alt="The Rehab House Logo">
            </a>
        </div>

        <nav>
            <ul>
                <li><a href="${basePath}index.html">Home</a></li>
                <li><a href="${basePath}about_us.html">About Us</a></li>
                <li><a href="${basePath}services.html">Our Services</a></li>
                <li><a href="${basePath}blog.html">Blog</a></li>
                <li><a href="${basePath}contact.html">Contact Us</a></li>
            </ul>
        </nav>
        
        <div class="header-actions">
            <!-- Hamburger Menu (Now before Search) -->
            <button class="hamburger" onclick="toggleMobileMenu()">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <!-- Search Box with Icon (Last) -->
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="Search..." onkeypress="handleSearch(event)">
                <button onclick="triggerSearch()"><img src="${basePath}images/search-icon.png" alt="Search"></button>
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
                    <li><a href="${basePath}blog.html" style="color: inherit; text-decoration: none;">Blog</a></li>
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
                <h3>Follow Us</h3>
                <a href="https://www.instagram.com/the_rehab_house/" class="social-icon"><img
                        src="${basePath}images/instagram-icon.png" alt="Instagram"></a>
            </div>
        </div>
    </footer>
    
    <!-- Mobile Sticky CTA (Hidden by default, shown via JS on proper pages) -->
    <div class="mobile-sticky-cta" id="mobileStickyCTA">
        <a href="${basePath}contact.html#booking">Book Appointment</a>
    </div>

    <!-- WhatsApp Floating Button -->
    <a href="https://wa.me/919653699526" class="whatsapp-float" target="_blank">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp">
    </a>
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
