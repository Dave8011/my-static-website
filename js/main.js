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
        window.location.href = `search_results.html?q=${encodeURIComponent(query)}`;
    } else {
        // If query is empty, checking if we need to toggle (Mobile behavior)
        // If not active, activate. If active but empty, maybe close? 
        // Let's just toggle.
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
