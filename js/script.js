// ========================================
// Sal Negra Tenerife - Main JavaScript
// ========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // === MOBILE NAVIGATION ===
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // === NAVBAR SCROLL EFFECT ===
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // === SMOOTH SCROLL ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // === 3D CAROUSEL ===
    const carousel3d = document.getElementById('carousel3d');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    console.log('Carousel element:', carousel3d);

    // Gallery images
    const galleryImages = [
        {
            src: 'images/gallery1.jpg',
            alt: 'Plato 1'
        },
        {
            src: 'images/gallery2.jpg',
            alt: 'Plato 2'
        },
        {
            src: 'images/gallery3.jpg',
            alt: 'Plato 3'
        },
        {
            src: 'images/gallery4.jpg',
            alt: 'Restaurante 1'
        },
        {
            src: 'images/gallery5.jpg',
            alt: 'Restaurante 2'
        },
        {
            src: 'images/gallery6.jpg',
            alt: 'Restaurante 3'
        },
        {
            src: 'images/gallery7.jpg',
            alt: 'Plato 4'
        },
        {
            src: 'images/gallery8.jpg',
            alt: 'Plato 5'
        }
    ];

    let currentIndex = 0;

    // Create 3D Carousel
    if (carousel3d) {
        console.log('Creating carousel with', galleryImages.length, 'images');
        galleryImages.forEach((image, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            carouselItem.innerHTML = `
                <img src="${image.src}" alt="${image.alt}" loading="lazy">
            `;

            // Add click event to open lightbox
            carouselItem.addEventListener('click', function() {
                if (carouselItem.classList.contains('active')) {
                    openLightbox(image.src, image.alt);
                } else {
                    // Navigate to clicked item
                    const clickedIndex = Array.from(carousel3d.children).indexOf(carouselItem);
                    currentIndex = clickedIndex;
                    updateCarousel();
                }
            });

            carousel3d.appendChild(carouselItem);
        });

        console.log('Carousel items created:', carousel3d.children.length);
        updateCarousel();
        console.log('Carousel initialized');

        // Navigation buttons
        if (carouselPrev) {
            carouselPrev.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
                updateCarousel();
            });
        }

        if (carouselNext) {
            carouselNext.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % galleryImages.length;
                updateCarousel();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
                updateCarousel();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % galleryImages.length;
                updateCarousel();
            }
        });

        // Auto-rotate
        setInterval(function() {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateCarousel();
        }, 4000);
    }

    function updateCarousel() {
        const items = carousel3d.querySelectorAll('.carousel-item');
        const total = items.length;

        items.forEach((item, index) => {
            // Remove all classes
            item.classList.remove('active', 'left-1', 'left-2', 'right-1', 'right-2', 'hidden');

            // Calculate relative position
            let position = index - currentIndex;

            // Normalize position to be between -total/2 and total/2
            if (position < -Math.floor(total / 2)) {
                position += total;
            } else if (position > Math.floor(total / 2)) {
                position -= total;
            }

            // Apply classes based on position
            if (position === 0) {
                item.classList.add('active');
            } else if (position === -1) {
                item.classList.add('left-1');
            } else if (position === -2) {
                item.classList.add('left-2');
            } else if (position === 1) {
                item.classList.add('right-1');
            } else if (position === 2) {
                item.classList.add('right-2');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    // Open lightbox
    function openLightbox(src, alt) {
        if (lightbox && lightboxImg) {
            lightboxImg.src = src;
            lightboxImg.alt = alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Close lightbox
    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Lightbox close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close lightbox when clicking outside image
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Close lightbox with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    // === ACTIVE MENU LINK ===
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.nav-menu a');

    menuLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // === ANIMATIONS ON SCROLL ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe menu items and gallery items
    const animatedElements = document.querySelectorAll('.menu-item, .gallery-item, .info-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // === LAZY LOADING IMAGES ===
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports lazy loading
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // === PHONE NUMBER FORMATTING ===
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track phone clicks if analytics is set up
            console.log('Phone number clicked:', this.getAttribute('href'));
        });
    });

    // === FORM VALIDATION (if forms are added later) ===
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (isValid) {
                // Submit form
                console.log('Form is valid, submitting...');
                // Add actual form submission logic here
            }
        });
    });

    // === CONSOLE LOG ===
    console.log('%c🍽️ Sal Negra Tenerife', 'color: #8b6f5c; font-size: 20px; font-weight: bold;');
    console.log('%cWebsite loaded successfully!', 'color: #0a0a0a; font-size: 14px;');
});

// === COOKIE CONSENT BANNER ===
(function() {
    const COOKIE_CONSENT_KEY = 'salnegra_cookie_consent';
    
    // Check if user already made a choice
    const consentStatus = localStorage.getItem(COOKIE_CONSENT_KEY);
    
    if (!consentStatus) {
        // Show banner after a short delay
        setTimeout(function() {
            const banner = document.getElementById('cookieBanner');
            if (banner) {
                banner.classList.add('active');
            }
        }, 1000);
    }
    
    // Accept cookies
    window.acceptCookies = function() {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        hideBanner();
        // Here you can enable analytics, tracking, etc.
        console.log('Cookies accepted');
    };
    
    // Reject cookies
    window.rejectCookies = function() {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
        hideBanner();
        console.log('Cookies rejected');
    };
    
    function hideBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('active');
        }
    }
})();
