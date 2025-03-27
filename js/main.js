// Ensure DOM is fully loaded before running scripts
document.addEventListener("DOMContentLoaded", function () {
    console.log("Website Loaded Successfully!");
});

// Add scroll event listener for frosted glass effect
window.addEventListener("scroll", function() {
    let header = document.querySelector("header");
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// Function to Open Doctor Profile Popup
function openProfile(doctor) {
    let profilePopup = document.getElementById("profilePopup");
    let popupOverlay = document.getElementById("popupOverlay");
    let profileFrame = document.getElementById("profileFrame");

    if (doctor === "vidhi") {
        profileFrame.src = "profiles/dr-vidhi.html";
    } else if (doctor === "vinit") {
        profileFrame.src = "profiles/dr-vinit.html";
    }

    // Show popup
    profilePopup.style.display = "block";
    popupOverlay.style.display = "block";
}

// Function to Close Doctor Profile Popup
function closePopup() {
    document.getElementById("profilePopup").style.display = "none";
    document.getElementById("popupOverlay").style.display = "none";
    document.getElementById("profileFrame").src = ""; // Reset iframe
}

// Function to Redirect to Search Results Page
function handleSearch(event) {
    if (event.key === "Enter") {
        triggerSearch();
    }
}

function triggerSearch() {
    let query = document.getElementById("searchInput").value.trim();
    if (query !== "") {
        window.location.href = `search_results.html?q=${encodeURIComponent(query)}`;
    }
}
