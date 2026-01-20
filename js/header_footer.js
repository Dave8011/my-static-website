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
        <div class="footer-content">
            <p class="footer-left">&copy; 2025 The Rehab House | <a href="${basePath}admin/login.html"
                    style="color: inherit; text-decoration: none;">Admin Login</a></p>

            <!-- Social Media -->
            <div class="footer-right">
                <h2>Follow Us</h2>
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
