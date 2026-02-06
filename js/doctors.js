document.addEventListener('DOMContentLoaded', () => {
    const foundersContainer = document.getElementById('founders-container');
    const teamGrid = document.getElementById('team-grid');

    if (typeof doctorsData === 'undefined') {
        console.error('doctorsData is not defined. Make sure doctors_data.js is included.');
        return;
    }

    // 1. Render Founders (Vidhi & Vinit)
    if (foundersContainer) {
        const founders = doctorsData.filter(d => d.id === 'vidhi' || d.id === 'vinit');
        foundersContainer.innerHTML = founders.map(doctor => `
            <div class="team-member founder-card">
                <img src="${doctor.image}" alt="${doctor.name}" loading="lazy">
                <h3>${doctor.name}</h3>
                <p>${doctor.specialty}</p>
                <button class="know-more-btn" onclick="openProfile('${doctor.id}')">Know More</button>
            </div>
        `).join('');
    }

    // 2. Render Specialists (Everyone else)
    if (teamGrid) {
        const specialists = doctorsData.filter(d => d.id !== 'vidhi' && d.id !== 'vinit');
        teamGrid.innerHTML = specialists.map(doctor => `
            <div class="specialist-card">
                <div class="specialist-img-wrapper">
                    <img src="${doctor.image}" alt="${doctor.name}" loading="lazy">
                </div>
                <div class="specialist-info">
                    <h4>${doctor.name}</h4>
                    <p>${doctor.specialty}</p>
                    <button class="know-more-btn small-btn" onclick="openProfile('${doctor.id}')">View Profile</button>
                </div>
            </div>
        `).join('');
    }
});
