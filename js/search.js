document.addEventListener("DOMContentLoaded", function () {
    let urlParams = new URLSearchParams(window.location.search);
    let query = urlParams.get("q");

    if (query) {
        document.getElementById("searchQuery").textContent = query;
        performSearch(query.toLowerCase());
    }
});

// Function to Perform Search on All Pages
function performSearch(query) {
    let pages = [
        { name: "Home", url: "index.html" },
        { name: "About Us", url: "about_us.html" },
        { name: "Our Services", url: "services.html" },
        { name: "Contact Us", url: "contact.html" }
    ];

    let resultsList = document.getElementById("resultsList");
    resultsList.innerHTML = "<li>Searching...</li>";

    let searchTasks = pages.map(page => {
        return fetch(page.url)
            .then(response => response.text())
            .then(html => {
                if (html.toLowerCase().includes(query)) {
                    let resultItem = `<li><a href="${page.url}">${page.name}</a></li>`;
                    resultsList.innerHTML += resultItem;
                }
            })
            .catch(error => console.log(`Error loading ${page.url}:`, error));
    });

    Promise.all(searchTasks).then(() => {
        if (resultsList.innerHTML === "<li>Searching...</li>") {
            resultsList.innerHTML = "<li>No results found.</li>";
        }
    });
}