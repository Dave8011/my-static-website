
// Data for "How are we different" section
const rehabDifferences = [
    {
        title: "Faster Recovery through Admission Facility",
        content: "Neurologically affected patients may take longer for recovery. It is only possible to take 2/3/4 treatment sessions per day in a Physiotherapy admission facility like ours. With multiple sessions per day, with each session focusing on a different problem (like walking, Balance training, cognitive rehabilitation, Hand strengthening, etc), the patient will recover faster with improvement in various domains all at once.",
        image: "images/balance-training.jpg",
        alt: "Admission Facility at The Rehab House"
    },
    {
        title: "Multispeciality Collaborative Approach",
        content: "Patients often get confused with different opinions coming from different specialists. At The Rehab House, the Rehabilitation team including the Physical, Cognitive, Occupational , Speech Therapists, the Neurologist, the Orthotist, the Dietician and the Psychologist work together to give a unified care plan.",
        image: "images/visual-therapy.jpg",
        alt: "Multispeciality Collaborative Approach"
    },
    {
        title: "Making Caregiving Easy",
        content: "Medical Conditions & Aging ring our bells and say 'Surprise!'. The family members and the caregivers are never prepared for this change. At The Rehab House, the caregivers get an insight of how to handle the patients, how to transfer/ dress/ motivate them. With the help of the support staff at The Rehab House, the sudden physical burden imposed on the family member is reduced and they can become emotionally and socially more available to take care of the patient well.",
        image: "images/contactus.webp", // keeping webp if jpg not available, or check validity? sticking to prompt plan but using safer extensions. User said "images/contactus.jpg" in plan.
        // Wait, directory list showed: contactus.jpg, contactus.webp. I'll use .jpg as per plan.
        alt: "Caregiver Support"
    },
    {
        title: "All Services under one roof",
        content: "Patients are often seen travelling from one place to another to seek consultations, treatments, blood tests, xrays, and other diagnostic tests. The Rehab House is a one stop solution with all the specialists and services available for the patient at one place.",
        image: "images/hero-banner.webp",
        alt: "All Services Under One Roof"
    },
    {
        title: "Specialized Rehabilitation Programs",
        content: "We do understand that this long journey of recovery can be boring. At The Rehab House, with our innovative and creative treatment strategies we assure better engagement and motivation for our patients.",
        image: "images/vestibular-therapy.jpg",
        alt: "Specialized Rehabilitation Programs"
    },
    {
        title: "Discharge Protocol for a Smooth Transition",
        content: "We believe Physiotherapy is a form of Medical Treatment and not a wellness program. And so, at The Rehab House, we aim at giving multiple treatment sessions per day for a faster recovery and a shorter hospitalisation stay, making it economically, socially and emotionally easier for the patient to get back to normalcy. We believe our patients must become independent soon and move ahead in their lives after getting treated and discharged from The Rehab House.",
        image: "images/achievements-banner.png",
        alt: "Discharge Protocol"
    }
];

// Check if images exist, fallback if needed? 
// The file listing showed:
// balance-training.jpg
// visual-therapy.jpg
// contactus.jpg
// hero-banner.webp (plan said jpg but listing showed webp was used before. listing has both hero-banner.jpg and webp. I'll use common ones)
// vestibular-therapy.jpg
// achievements-banner.png

// Updating image array based on actual available files
rehabDifferences[2].image = "images/contactus.jpg";
rehabDifferences[3].image = "images/hero-banner.jpg";

// Function to render the section
function renderDifferences() {
    const container = document.getElementById('differences-container');
    if (!container) return;

    container.innerHTML = ''; // Clear existing content

    rehabDifferences.forEach((item, index) => {
        const isReverse = index % 2 !== 0; // Odd index = reverse layout
        const row = document.createElement('div');
        row.className = `difference-row ${isReverse ? 'reverse' : ''}`;

        // Create Image Column
        const imageCol = `
            <div class="difference-image">
                <img src="${item.image}" alt="${item.alt}" loading="lazy">
            </div>
        `;

        // Check text length
        const charLimit = 150;
        const isLong = item.content.length > charLimit;

        const contentCol = `
            <div class="difference-content">
                <h3>${item.title}</h3>
                <div class="text-container ${isLong ? 'expandable' : ''}">
                    <!-- Mask effect wrapper -->
                    <p class="description-text">${item.content}</p>
                </div>
                ${isLong ? `<button class="know-more-btn toggle-btn">Know More</button>` : ''}
            </div>
        `;

        row.innerHTML = imageCol + contentCol;

        // Add event listener for button
        if (isLong) {
            const btn = row.querySelector('.toggle-btn');
            const textContainer = row.querySelector('.text-container');

            btn.addEventListener('click', () => {
                textContainer.classList.toggle('expanded');
                if (textContainer.classList.contains('expanded')) {
                    btn.textContent = 'Show Less';
                } else {
                    btn.textContent = 'Know More';
                }
            });
        }

        container.appendChild(row);
    });
}

// Run on load
document.addEventListener('DOMContentLoaded', renderDifferences);
