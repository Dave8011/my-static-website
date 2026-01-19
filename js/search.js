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
    resultsList.innerHTML = "<li class='loading'>Searching...</li>";

    let searchTasks = pages.map(page => {
        return fetch(page.url)
            .then(response => response.text())
            .then(html => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html');
                let textNodes = getTextNodes(doc.body);
                let matches = [];

                textNodes.forEach(node => {
                    if (node.nodeValue.toLowerCase().includes(query)) {
                        // Find closest section ID
                        let parent = node.parentElement;
                        let sectionId = '';
                        while (parent && parent.tagName !== 'BODY') {
                            if (parent.id) {
                                sectionId = parent.id;
                                break;
                            }
                            parent = parent.parentElement;
                        }

                        // Extract snippet
                        let snippet = getSnippet(node.nodeValue, query);

                        // Avoid duplicate snippets for the same section
                        let existing = matches.find(m => m.sectionId === sectionId && m.snippet === snippet);
                        if (!existing) {
                            matches.push({
                                sectionId: sectionId,
                                snippet: snippet,
                                text: node.nodeValue.trim()
                            });
                        }
                    }
                });

                return { page: page, matches: matches };
            })
            .catch(error => {
                console.error(`Error loading ${page.url}:`, error);
                return { page: page, matches: [] };
            });
    });

    Promise.all(searchTasks).then(results => {
        resultsList.innerHTML = "";
        let hasResults = false;

        results.forEach(item => {
            if (item.matches.length > 0) {
                hasResults = true;

                // Group by Page
                let pageHeader = document.createElement("li");
                pageHeader.classList.add("result-page-header");
                pageHeader.innerHTML = `<h3>${item.page.name}</h3><ul></ul>`;
                let pageList = pageHeader.querySelector("ul");

                item.matches.forEach(match => {
                    let link = item.page.url;
                    if (match.sectionId) {
                        link += `#${match.sectionId}`;
                    }
                    // Add text fragment
                    link += `#:~:text=${encodeURIComponent(query)}`;

                    let li = document.createElement("li");
                    li.classList.add("result-item");
                    li.innerHTML = `<a href="${link}">...${match.snippet}...</a>`;
                    pageList.appendChild(li);
                });

                resultsList.appendChild(pageHeader);
            }
        });

        if (!hasResults) {
            resultsList.innerHTML = "<li class='no-results'>No results found.</li>";
        }
    });
}

// Helper to get all text nodes
function getTextNodes(node) {
    let textNodes = [];
    if (node.nodeType === 3) {
        if (node.nodeValue.trim() !== '') {
            textNodes.push(node);
        }
    } else {
        node.childNodes.forEach(child => {
            textNodes = textNodes.concat(getTextNodes(child));
        });
    }
    return textNodes;
}

// Helper to extract snippet around query
function getSnippet(text, query) {
    let index = text.toLowerCase().indexOf(query);
    let start = Math.max(0, index - 30);
    let end = Math.min(text.length, index + query.length + 30);
    return text.substring(start, end);
}