// Splash Screen functionality - shows only once per session
document.addEventListener('DOMContentLoaded', function() {
    const splash = document.getElementById('splash');
    const sandOverlay = document.getElementById('sand-overlay');
    
    // Sand overlay logic - ensure it's hidden by default
    if (sandOverlay) {
        // Force hide initially
        sandOverlay.style.display = 'none';
        sandOverlay.classList.remove('show');
        
        // Check if this is truly a first visit (not just first in session)
        const hasEverVisited = localStorage.getItem('hasVisitedHomepage');
        
        // Ensure homepage body background is clean for first visit
        if (!hasEverVisited) {
            // Force clean background for first visit
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundBlendMode = 'normal';
        }
        
        // Only show sand overlay if user has visited before
        if (hasEverVisited) {
            // Small delay to ensure proper loading
            setTimeout(() => {
                sandOverlay.classList.add('show');
            }, 100);
        }
    }
    
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
            
            // Preload critical sand texture first, then other assets
            const sandTextureImg = new Image();
            let sandTextureLoaded = false;
            let otherAssetsLoaded = false;
            
            // Load sand texture with highest priority
            sandTextureImg.onload = () => {
                sandTextureLoaded = true;
                console.log('Sand texture preloaded successfully');
                
                // Force apply the background to ensure it's rendered
                document.body.style.backgroundImage = "url('./assets/sand-texture-overlay.png')";
                
                // Small delay to ensure rendering, then check if we can hide splash
                setTimeout(() => {
                    if (otherAssetsLoaded) {
                        hideSplash();
                    }
                }, 100);
            };
            
            sandTextureImg.onerror = () => {
                console.warn('Sand texture failed to load');
                sandTextureLoaded = true; // Continue anyway
                if (otherAssetsLoaded) {
                    hideSplash();
                }
            };
            
            sandTextureImg.src = './assets/sand-texture-overlay.png';
            
            // Preload other critical assets
            const otherAssets = [
                './assets/wood-texture-overlay.png',
                './assets/Logo.svg',
                './assets/cat-sleep-sticker.png',
                './assets/Vine1.svg',
                './assets/Vine2.svg',
                './assets/about me.png',
                './assets/cat-sticker.png',
                './assets/shell-star.svg',
                './assets/project1.svg',
                './assets/Linkedin icon.svg',
                './assets/Whatsapp icon.svg',
                './assets/beach-bg.mp3' // Add background music to preload
            ];
            
            // Preload other images
            let loadedCount = 0;
            const totalOtherAssets = otherAssets.length;
            
            
            otherAssets.forEach(src => {
                const img = new Image();
                img.onload = img.onerror = () => {
                    loadedCount++;
                    
                    // Check if all other assets are loaded
                    if (loadedCount === totalOtherAssets) {
                        otherAssetsLoaded = true;
                        console.log('All other assets loaded');
                        
                        // Only hide splash when sand texture is also ready
                        if (sandTextureLoaded) {
                            hideSplash();
                        }
                    }
                };
                img.src = src;
            });
            
            // Fallback: hide splash after 6 seconds regardless of loading status
            setTimeout(hideSplash, 6000);
            
            function hideSplash() {
                if (splash.style.display !== 'none') {
                    splash.classList.add('fade-out');
                    
                    // Remove splash screen from DOM after fade animation
                    setTimeout(function() {
                        splash.style.display = 'none';
                        
                        // Mark as visited only after splash screen is completely hidden
                        // This ensures first-time visitors don't get sand overlay
                        localStorage.setItem('hasVisitedHomepage', 'true');
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

// Background Music System
document.addEventListener('DOMContentLoaded', function() {
    // Create audio element for background music
    let backgroundMusic = null;
    const musicSrc = './assets/beach-bg.mp3';
    
    // Initialize background music
    function initBackgroundMusic() {
        if (!backgroundMusic) {
            backgroundMusic = new Audio(musicSrc);
            backgroundMusic.loop = true;
            backgroundMusic.volume = 0.3; // Set to 30% volume for ambient background
            
            // Handle loading and playback
            backgroundMusic.addEventListener('canplaythrough', () => {
                console.log('Background music loaded and ready');
                playMusicBasedOnPage();
            });
            
            backgroundMusic.addEventListener('error', (e) => {
                console.warn('Background music failed to load:', e);
            });
            
            // Load the audio
            backgroundMusic.load();
        }
    }
    
    // Determine if current page should have music
    function shouldPlayMusic() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        // Only play music on the home page
        const isHomePage = currentPage === 'index.html' || 
                          currentPage === '' || 
                          currentPath === '/' || 
                          currentPath.endsWith('/');
        
        console.log('Current path:', currentPath, 'Current page:', currentPage, 'Is home page:', isHomePage);
        
        return isHomePage;
    }
    
    // Play or pause music based on current page
    function playMusicBasedOnPage() {
        if (!backgroundMusic) return;
        
        if (shouldPlayMusic()) {
            // Try to play music (may be blocked by browser autoplay policy)
            const playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Background music started playing');
                }).catch((error) => {
                    console.log('Autoplay was prevented. Music will start on user interaction:', error);
                    
                    // Add click listener to start music on first user interaction
                    const startMusicOnInteraction = () => {
                        backgroundMusic.play().then(() => {
                            console.log('Background music started after user interaction');
                        }).catch(console.error);
                        document.removeEventListener('click', startMusicOnInteraction);
                        document.removeEventListener('keydown', startMusicOnInteraction);
                    };
                    
                    document.addEventListener('click', startMusicOnInteraction);
                    document.addEventListener('keydown', startMusicOnInteraction);
                });
            }
        } else {
            // Pause music on all pages except home page
            if (!backgroundMusic.paused) {
                backgroundMusic.pause();
                console.log('Background music paused - not on home page');
            }
        }
    }
    
    // Store music state in localStorage for persistence across pages
    function saveMusicState() {
        if (backgroundMusic) {
            localStorage.setItem('musicCurrentTime', backgroundMusic.currentTime);
            localStorage.setItem('musicWasPlaying', !backgroundMusic.paused);
        }
    }
    
    // Restore music state when navigating between pages
    function restoreMusicState() {
        const savedTime = localStorage.getItem('musicCurrentTime');
        const wasPlaying = localStorage.getItem('musicWasPlaying') === 'true';
        
        if (backgroundMusic && savedTime) {
            backgroundMusic.currentTime = parseFloat(savedTime);
            
            if (wasPlaying && shouldPlayMusic()) {
                backgroundMusic.play().catch(console.error);
            }
        }
    }
    
    // Save music state before page unload
    window.addEventListener('beforeunload', saveMusicState);
    
    // Initialize music system
    initBackgroundMusic();
    
    // Also check for music state restoration after a short delay
    setTimeout(() => {
        restoreMusicState();
    }, 1000);
    
    // Handle navigation for single-page-like behavior (if using client-side routing)
    window.addEventListener('popstate', () => {
        setTimeout(playMusicBasedOnPage, 100);
    });
    
    // Volume control function (can be called from console for testing)
    window.setMusicVolume = function(volume) {
        if (backgroundMusic) {
            backgroundMusic.volume = Math.max(0, Math.min(1, volume));
            console.log('Music volume set to:', backgroundMusic.volume);
        }
    };
    
    // Manual music control functions for debugging
    window.musicControls = {
        play: () => backgroundMusic && backgroundMusic.play(),
        pause: () => backgroundMusic && backgroundMusic.pause(),
        setVolume: (vol) => backgroundMusic && (backgroundMusic.volume = vol),
        getState: () => backgroundMusic ? {
            paused: backgroundMusic.paused,
            volume: backgroundMusic.volume,
            currentTime: backgroundMusic.currentTime,
            duration: backgroundMusic.duration
        } : null
    };
});

// Beach Homepage Shell Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Available shell images (6 different shells)
    const shellImages = [
        './assets/shell-star.svg',
        './assets/shell-conchsharp.svg',
        './assets/shell-conchsmooth.svg',
        './assets/shell-spiral.svg',
        './assets/shell-spiralcone.svg',
        './assets/shell-clam.svg'
    ];
    
    // Function to get 3 random unique shells
    function getRandomShells() {
        const shuffled = [...shellImages].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }
    
    // Initialize shell navigation if we're on the homepage
    const shellButtons = document.querySelectorAll('.shell-btn');
    
    if (shellButtons.length === 3) {
        const randomShells = getRandomShells();
        
        shellButtons.forEach((button, index) => {
            const shellImage = button.querySelector('.shell-image');
            if (shellImage && randomShells[index]) {
                shellImage.src = randomShells[index];
                console.log(`Shell ${index + 1} assigned: ${randomShells[index]}`);
            }
        });
        
        // Add click handlers for navigation
        shellButtons.forEach(button => {
            button.addEventListener('click', function() {
                const href = this.getAttribute('data-href');
                if (href) {
                    // Add a small delay for the click animation
                    setTimeout(() => {
                        window.location.href = href;
                    }, 200);
                }
            });
            
            // Add hover sound effect
            button.addEventListener('mouseenter', function() {
                const shellSound = new Audio('./assets/shell.mp3');
                shellSound.volume = 0.3; // Set volume to 30%
                shellSound.play().catch(error => {
                    console.log('Shell sound failed to play:', error);
                });
            });
        });
    }
});