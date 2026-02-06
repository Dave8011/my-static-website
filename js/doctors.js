document.addEventListener('DOMContentLoaded', () => {
    const teamContainer = document.querySelector('.team-container');
    if (!teamContainer) return;

    if (typeof doctorsData === 'undefined') {
        console.error('doctorsData is not defined. Make sure doctors_data.js is included.');
        return;
    }

    teamContainer.innerHTML = doctorsData.map(doctor => `
        <div class="team-member">
            <img src="${doctor.image}" alt="${doctor.name}" loading="lazy">
            <h3>${doctor.name}</h3>
            <p>${doctor.specialty}</p>
            <button class="know-more-btn" onclick="openProfile('${doctor.id}')">Know More</button>
        </div>
    `).join('');
});
