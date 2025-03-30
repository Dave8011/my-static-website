document.addEventListener("DOMContentLoaded", function () {
    const arms = document.querySelectorAll(".arm");
    const infoBox = document.getElementById("infoBox");
    const mainCircle = document.getElementById("mainCircle");

    arms.forEach(arm => {
        arm.addEventListener("click", function () {
            // Reset all arms
            arms.forEach(a => a.style.transform = "scale(0.8)");
            this.style.transform = "scale(1.2)";
            
            // Show info box with details
            infoBox.textContent = this.getAttribute("data-info");
            infoBox.classList.remove("hidden");
        });
    });

    // Reset all when clicking outside
    document.addEventListener("click", function (e) {
        if (!e.target.classList.contains("arm")) {
            arms.forEach(a => a.style.transform = "scale(1)");
            infoBox.classList.add("hidden");
        }
    });
});
