// Splash Screen functionality - shows only once per session
document.addEventListener('DOMContentLoaded', function() {
    const splash = document.getElementById('splash');
    
    if (splash) {
        // Check if splash has already been shown in this session
        const splashShown = sessionStorage.getItem('splashShown');
        
        if (splashShown) {
            // If splash was already shown, hide it immediately
            splash.style.display = 'none';
        } else {
            // Show splash screen for first time in session
            // Mark as shown in sessionStorage
            sessionStorage.setItem('splashShown', 'true');
            
            // Preload critical assets from all pages
            const assetsToPreload = [
                './assets/sand-texture-overlay.png', // Critical background texture
                './assets/wood-texture-overlay.png',
                './assets/Logo.svg',
                './assets/cat-sleep-sticker.png',
                './assets/Vine1.svg',
                './assets/Vine2.svg',
                './assets/about me.png',
                './assets/cat-sticker.png',
                './assets/shell-star.svg',
                './assets/project1.svg', // Add project images
                './assets/Linkedin icon.svg',
                './assets/Whatsapp icon.svg'
            ];
            
            // Preload images
            let loadedCount = 0;
            const totalAssets = assetsToPreload.length;
            let sandTextureLoaded = false;
            
            assetsToPreload.forEach(src => {
                const img = new Image();
                img.onload = img.onerror = () => {
                    loadedCount++;
                    
                    // Track sand texture specifically
                    if (src.includes('sand-texture-overlay.png')) {
                        sandTextureLoaded = true;
                        console.log('Sand texture loaded');
                    }
                    
                    // Only hide splash when all assets are loaded AND sand texture is ready
                    if (loadedCount === totalAssets && sandTextureLoaded) {
                        console.log('All critical assets loaded including sand texture');
                        hideSplash();
                    }
                };
                img.src = src;
            });
            
            // Fallback: hide splash after 5 seconds regardless of loading status
            setTimeout(hideSplash, 5000);
            
            function hideSplash() {
                if (splash.style.display !== 'none') {
                    splash.classList.add('fade-out');
                    
                    // Remove splash screen from DOM after fade animation
                    setTimeout(function() {
                        splash.style.display = 'none';
                    }, 1000);
                }
            }
        }
    }
});

// Smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Simulate form submission
            alert('Thank you for your message! I\'ll get back to you soon.');
            this.reset();
        });
    }
});

// Gallery image lightbox effect (for about page)
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            // Create lightbox overlay
            const lightbox = document.createElement('div');
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                cursor: pointer;
            `;
            
            const lightboxImg = document.createElement('img');
            lightboxImg.src = this.src;
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            `;
            
            lightbox.appendChild(lightboxImg);
            document.body.appendChild(lightbox);
            
            // Close lightbox on click
            lightbox.addEventListener('click', function() {
                document.body.removeChild(lightbox);
            });
        });
    });
});

// Add loading animation to navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default for external links
            if (this.getAttribute('href').startsWith('http')) {
                return;
            }
            
            // Add loading state
            this.style.opacity = '0.7';
            this.style.transform = 'scale(0.95)';
            
            // Reset after a short delay
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
});

// Project filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterChips = document.querySelectorAll('.filter-chip');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Check URL for category parameter, default to 'featured'
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category') || 'featured';
    
    if (filterChips.length > 0) {
        // Find and activate the corresponding filter chip
        const targetChip = Array.from(filterChips).find(chip => 
            chip.getAttribute('data-category') === initialCategory
        );
        
        if (targetChip) {
            // Remove active class from all chips
            filterChips.forEach(chip => chip.classList.remove('active'));
            // Add active class to target chip
            targetChip.classList.add('active');
            // Filter projects
            filterProjects(initialCategory);
        } else {
            // If category not found, default to featured
            filterProjects('featured');
        }
    }
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active state
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            filterProjects(category);
            
            // Update URL without page reload
            const newUrl = `${window.location.pathname}?category=${category}`;
            window.history.pushState({}, '', newUrl);
        });
    });
    
    function filterProjects(category) {
        projectCards.forEach(card => {
            const cardCategories = card.getAttribute('data-categories') || '';
            if (cardCategories.includes(category)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }
});

// Gallery auto-scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit more for all images to load
    setTimeout(() => {
        const galleryScroll = document.querySelector('.gallery-scroll');
        
        if (galleryScroll) {
            console.log('Gallery found, initializing auto-scroll');
            
            let userInteracted = false;
            let manualScrollPaused = false;
            let hoverPaused = false;
            let scrollDirection = 1; // 1 for right, -1 for left
            let autoScrollInterval;
            let pauseTimeout;
            const scrollSpeed = 2;
            const intervalDelay = 30;
            const pauseDuration = 1500; // 1.5 seconds pause after manual scroll
            
            function startAutoScroll() {
                if (userInteracted || manualScrollPaused || hoverPaused) return;
                
                const maxScroll = galleryScroll.scrollWidth - galleryScroll.clientWidth;
                
                if (maxScroll <= 0) {
                    console.log('No scrolling needed - content fits in container');
                    return;
                }
                
                console.log('Starting back-and-forth auto-scroll');
                
                autoScrollInterval = setInterval(() => {
                    if (userInteracted || manualScrollPaused || hoverPaused) {
                        clearInterval(autoScrollInterval);
                        return;
                    }
                    
                    const currentScroll = galleryScroll.scrollLeft;
                    
                    // Check if we need to change direction
                    if (scrollDirection === 1 && currentScroll >= maxScroll - 5) {
                        // Reached the end, scroll back left
                        scrollDirection = -1;
                        console.log('Reached end, scrolling back left');
                    } else if (scrollDirection === -1 && currentScroll <= 5) {
                        // Reached the beginning, scroll right
                        scrollDirection = 1;
                        console.log('Reached beginning, scrolling right');
                    }
                    
                    // Scroll in current direction
                    galleryScroll.scrollLeft += scrollSpeed * scrollDirection;
                }, intervalDelay);
            }
            
            function pauseAutoScroll() {
                console.log('Auto-scroll paused for manual gallery interaction');
                manualScrollPaused = true;
                if (autoScrollInterval) {
                    clearInterval(autoScrollInterval);
                }
                
                // Clear any existing timeout
                if (pauseTimeout) {
                    clearTimeout(pauseTimeout);
                }
                
                // Resume after pause duration
                pauseTimeout = setTimeout(() => {
                    if (!userInteracted && !hoverPaused) {
                        console.log('Resuming auto-scroll after manual pause');
                        manualScrollPaused = false;
                        startAutoScroll();
                    }
                }, pauseDuration);
            }
            
            // Pause auto-scroll when mouse hovers over gallery
            galleryScroll.addEventListener('mouseenter', () => {
                console.log('Mouse entered gallery - pausing auto-scroll');
                hoverPaused = true;
                if (autoScrollInterval) {
                    clearInterval(autoScrollInterval);
                }
            });
            
            // Resume auto-scroll when mouse leaves gallery
            galleryScroll.addEventListener('mouseleave', () => {
                console.log('Mouse left gallery - resuming auto-scroll');
                hoverPaused = false;
                if (!userInteracted && !manualScrollPaused) {
                    startAutoScroll();
                }
            });
            
            // Detect manual interaction with gallery scroll area
            galleryScroll.addEventListener('mousedown', () => {
                if (!userInteracted && !manualScrollPaused) {
                    pauseAutoScroll();
                }
            });
            
            galleryScroll.addEventListener('wheel', (e) => {
                if (!userInteracted && !manualScrollPaused) {
                    pauseAutoScroll();
                }
            });
            
            galleryScroll.addEventListener('touchstart', () => {
                if (!userInteracted && !manualScrollPaused) {
                    pauseAutoScroll();
                }
            });
            
            // Start auto-scroll after images have had time to load
            setTimeout(() => {
                console.log('About to start auto-scroll');
                startAutoScroll();
            }, 2000);
        } else {
            console.log('Gallery not found');
        }
    }, 1500);
});