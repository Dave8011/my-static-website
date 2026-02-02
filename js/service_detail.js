document.addEventListener('DOMContentLoaded', () => {
    // 1. Get ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');

    // 2. Validate ID
    if (!serviceId || !servicesData[serviceId]) {
        // Redirect or show error
        document.getElementById('service-title').innerText = "Service Not Found";
        document.getElementById('service-intro').innerHTML = "<p>Sorry, the requested service could not be found.</p>";
        return;
    }

    // 3. Populate Data
    const service = servicesData[serviceId];

    // Title
    document.title = `${service.title} – The Rehab House`;
    document.getElementById('service-title').innerText = service.title;

    // Image
    const imgElement = document.getElementById('service-image');
    if (service.image) {
        imgElement.src = service.image;
        imgElement.alt = service.title;
        imgElement.style.display = 'block';
    }

    // Descriptions
    const introElement = document.getElementById('service-intro');
    introElement.innerHTML = `<p class="lead">${service.description}</p>`;

    // Detailed Body
    const bodyElement = document.getElementById('service-body');
    bodyElement.innerHTML = service.detailsHTML;
});
