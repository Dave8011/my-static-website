function loadHeader() {
    // Check if we are in a subfolder (e.g. /blogs/)
    const isSubfolder = window.location.pathname.includes('/blogs/');
    const basePath = isSubfolder ? '../' : '';

    const headerHTML = `
    <header>
        <div class="logo">
            <img src="${basePath}images/logo.png" alt="The Rehab House Logo">
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
    </footer>`;
    document.getElementById('footer-placeholder').innerHTML = footerHTML;
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
