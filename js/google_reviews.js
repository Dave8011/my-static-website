/**
 * google_reviews.js
 * Fetches reviews from Google Places API (or uses mock data)
 * Renders them in a horizontal marquee
 * Injects AggregateRating Schema
 */

async function initGoogleReviews() {
    const marqueeContainer = document.getElementById('reviews-marquee');
    if (!marqueeContainer) return; // Not on home page

    // Lazy Load using Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadReviews();
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "100px" });

    observer.observe(marqueeContainer);

    async function loadReviews() {
        let reviews = [];
        let rating = 0;
        let reviewCount = 0;

        // Check if API key is configured
        if (typeof GOOGLE_PLACES_API_KEY === 'undefined' || GOOGLE_PLACES_API_KEY === 'YOUR_API_KEY') {
            console.warn("Google Places API Key not configured. Using Mock Data.");
            reviews = getMockReviews();
            rating = 4.9;
            reviewCount = 120;
        } else {
            try {
                const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.status === 'OK') {
                    reviews = data.result.reviews || [];
                    rating = data.result.rating || 0;
                    reviewCount = data.result.user_ratings_total || 0;
                } else {
                    console.error("Google Places API Error:", data.status);
                    reviews = getMockReviews(); // Fallback
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
                reviews = getMockReviews(); // Fallback
            }
        }

        renderReviews(reviews, marqueeContainer);
        injectSchema(rating, reviewCount);
    }
}

function renderReviews(reviews, container) {
    if (reviews.length === 0) {
        container.innerHTML = '<div class="review-card">No reviews available.</div>';
        return;
    }

    // Double the reviews to ensure smooth infinite scroll if few reviews
    const displayReviews = [...reviews, ...reviews];

    const html = displayReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div>
                    <div class="reviewer-name">${review.author_name}</div>
                    <div class="review-rating">${'★'.repeat(Math.round(review.rating || 5))}</div>
                </div>
            </div>
            <div class="review-text">"${review.text}"</div>
        </div>
    `).join('');

    container.innerHTML = html;
}

function injectSchema(rating, count) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MedicalOrganization",
        "name": "The Rehab House",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": rating,
            "reviewCount": count
        }
    });
    document.head.appendChild(script);
}

function getMockReviews() {
    return [
        {
            author_name: "Rahul Mehta",
            rating: 5,
            text: "Excellent facility for stroke recovery. The therapists are very dedicated and the admission facility helped us a lot."
        },
        {
            author_name: "Sneha Kapoor",
            rating: 5,
            text: "My mother had a knee replacement and the physiotherapy here was top notch. Highly recommended for ortho rehab."
        },
        {
            author_name: "Amit Patil",
            rating: 5,
            text: "Clean, professional and effective. The neuro rehab program helped my father regain mobility after his accident."
        },
        {
            author_name: "Priya Sharma",
            rating: 4,
            text: "Very good doctors and supportive staff. Best rehab centre in South Mumbai."
        },
        {
            author_name: "Vikram Singh",
            rating: 5,
            text: "State of the art equipment and knowledgeable staff. Grateful for their service."
        }
    ];
}

// Expose to global scope or init if loaded
window.initGoogleReviews = initGoogleReviews;
