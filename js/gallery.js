document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('galleryGrid');
    
    // 1. Render Gallery Items
    if (galleryGrid && typeof galleryData !== 'undefined') {
        galleryData.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = `gallery-item ${item.category} ${item.span}`;
            
            if (item.type === 'video') {
                div.classList.add('videos');
                div.setAttribute('data-video-src', item.src);
                
                // For videos, if there's no thumbnail, use a generic one or the video itself (less ideal).
                // Usually we'd want a thumbnail, but if we just have the MP4, we can use a placeholder for now, 
                // or tell the user to provide a thumbnail. Let's use a generic video placeholder.
                div.innerHTML = `
                    <img src="https://placehold.co/600x400/222222/ffffff?text=Play+Video" alt="Video Thumbnail" loading="lazy" />
                    <div class="video-overlay"><span class="material-icons">play_circle_outline</span></div>
                `;
            } else {
                div.innerHTML = `
                    <img src="${item.src}" alt="Gallery Image ${index + 1}" loading="lazy" />
                `;
            }
            galleryGrid.appendChild(div);
        });
    }

    // 2. Gallery Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.classList.remove('hidden');
                    // Add slight delay for layout recalculation animation if needed
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300); // Wait for opacity transition
                }
            });
        });
    });

    // 3. Lightbox Logic
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const closeBtn = document.querySelector('.lightbox-close');

    if (!lightbox) return; // Prevent errors if not on gallery page

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoSrc = item.getAttribute('data-video-src');
            
            if (videoSrc) {
                // It's a video
                lightboxImg.style.display = 'none';
                lightboxVideo.style.display = 'block';
                lightboxVideo.src = videoSrc;
                lightbox.classList.add('active');
                lightboxVideo.play().catch(e => console.log("Autoplay prevented:", e));
            } else {
                // It's an image
                const img = item.querySelector('img');
                if (img) {
                    lightboxVideo.style.display = 'none';
                    lightboxImg.style.display = 'block';
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                }
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.currentTime = 0; // Reset video
        }
    }

    // Close on X click
    closeBtn.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});
