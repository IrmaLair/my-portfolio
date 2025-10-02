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
            
            // Detect if we're in a subdirectory (projects folder)
            const isInSubdirectory = window.location.pathname.includes('/projects/');
            const assetPath = isInSubdirectory ? '../assets/' : './assets/';
            
            // Preload critical sand texture first, then other assets
            const sandTextureImg = new Image();
            let sandTextureLoaded = false;
            let otherAssetsLoaded = false;
            
            // Load sand texture with highest priority
            sandTextureImg.onload = () => {
                sandTextureLoaded = true;
                console.log('Sand texture preloaded successfully');
                
                // Force apply the background to ensure it's rendered
                document.body.style.backgroundImage = `url('${assetPath}sand-texture-overlay.png')`;
                
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
            
            sandTextureImg.src = `${assetPath}sand-texture-overlay.png`;
            
            // Preload other critical assets
            const otherAssets = [
                `${assetPath}wood-texture-overlay.png`,
                `${assetPath}Logo.svg`,
                `${assetPath}cat-sleep-sticker.png`,
                `${assetPath}Vine1.svg`,
                `${assetPath}Vine2.svg`,
                `${assetPath}about me.png`,
                `${assetPath}cat-sticker.png`,
                `${assetPath}shell-star.svg`,
                `${assetPath}project1.svg`,
                `${assetPath}Linkedin icon.svg`,
                `${assetPath}Whatsapp icon.svg`,
                `${assetPath}beach-bg.mp3` // Add background music to preload
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
            
            // Play shell sound effect
            try {
                const shellSound = new Audio('./assets/shell.mp3');
                shellSound.volume = 0.6;
                shellSound.play().catch(() => {});
            } catch (e) {}
            
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
        
        // Add click handlers for navigation with throwing animation
        shellButtons.forEach(button => {
            button.addEventListener('click', async function(e) {
                e.preventDefault();
                const href = this.getAttribute('data-href');
                if (!href) return;
                
                // Create a clone for the throwing animation
                const rect = this.getBoundingClientRect();
                const clone = this.cloneNode(true);
                
                // Hide the original button
                this.classList.add('shell-hidden');
                this.style.pointerEvents = 'none';
                
                // Position the clone exactly where the original button is
                const cs = getComputedStyle(this);
                let baseW = Math.round(parseFloat(cs.width) || this.offsetWidth);
                let baseH = Math.round(parseFloat(cs.height) || this.offsetHeight);
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const left = Math.round(centerX - baseW / 2);
                const top = Math.round(centerY - baseH / 2);
                
                // Style the clone
                clone.style.transform = 'none';
                clone.style.position = 'fixed';
                clone.style.left = left + 'px';
                clone.style.top = top + 'px';
                clone.style.width = baseW + 'px';
                clone.style.height = baseH + 'px';
                clone.style.boxSizing = cs.boxSizing || 'border-box';
                clone.style.margin = '0';
                clone.style.zIndex = 9999;
                clone.style.pointerEvents = 'none';
                
                // Remove any nested transforms
                try {
                    clone.querySelectorAll && clone.querySelectorAll('*').forEach(n => {
                        if (n.style) n.style.transform = 'none';
                    });
                } catch (e) {}
                
                document.body.appendChild(clone);
                
                // Start the throwing animation
                const THROW_ANIM_MS = 1200; // Increased from 600ms to 1200ms for splash sound
                clone.style.transition = `transform ${THROW_ANIM_MS}ms cubic-bezier(.2,.8,.2,1), left ${THROW_ANIM_MS}ms, top ${THROW_ANIM_MS}ms, opacity .6s`;
                
                // Play shell splash sound if available
                try {
                    const shellSplash = new Audio('./assets/shell-splash.mp3');
                    shellSplash.volume = 0.8;
                    shellSplash.play().catch(() => {});
                } catch (e) {}
                
                // Animate to the waves area
                requestAnimationFrame(() => {
                    clone.classList.add('throwing');
                    clone.style.left = '50%';
                    clone.style.top = '8%';
                    clone.style.transform = 'translate(-50%, -10%)';
                    clone.style.opacity = '1';
                });
                
                // Clean up and navigate after animation
                setTimeout(async () => {
                    try {
                        clone.style.opacity = '0';
                        await new Promise(r => setTimeout(r, 400));
                        try { clone.remove(); } catch (e) {}
                        
                        // Restore original button and navigate
                        this.classList.remove('shell-hidden');
                        this.style.pointerEvents = '';
                        window.location.href = href;
                    } catch (e) {
                        console.error(e);
                        window.location.href = href;
                    }
                }, THROW_ANIM_MS);
            }, { passive: false });
            
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

/* Footprint canvas: spawn footprint shapes following the cursor and expire after fade time */
function initFootprints() {
    const canvas = document.getElementById('footprint-canvas');
    if (!canvas) return { start: () => {}, stop: () => {} };
    
    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    let w = 0, h = 0;
    const footprints = [];
    const baseMinStride = 96;
    let lastX = -9999, lastY = -9999, mirror = 0;
    let raf = null;
    
    function resize() {
        dpr = window.devicePixelRatio || 1;
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    
    function addFoot(x, y, angle) {
        const now = performance.now();
        mirror += 1;
        footprints.push({ x, y, angle, mirror, ts: now });
    }
    
    let isTracking = false; // Track if we should create footprints
    let isTouchDevice = false;
    
    function onPointerMove(ev) {
        // Don't create footprints in the waves area
        const wavesEl = document.querySelector('.waves-wrapper');
        if (wavesEl) {
            const wr = wavesEl.getBoundingClientRect();
            if (ev.clientY <= wr.bottom) return;
        }
        
        // For touch devices, only create footprints if actively tracking
        if (isTouchDevice && !isTracking) return;
        
        const x = ev.clientX;
        const y = ev.clientY;
        const footprintScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--footprint-scale')) || 1;
        const minStride = baseMinStride * footprintScale;
        const dist = Math.hypot(x - lastX, y - lastY);
        
        if (dist > minStride) {
            const angle = Math.atan2(y - lastY || 0, x - lastX || 0) + Math.PI / 2;
            addFoot(x, y, angle);
            lastX = x;
            lastY = y;
        }
    }
    
    function onPointerDown(ev) {
        // Check if this is a touch device
        isTouchDevice = ev.pointerType === 'touch';
        
        if (isTouchDevice) {
            isTracking = true;
            // Start tracking immediately on touch
            const wavesEl = document.querySelector('.waves-wrapper');
            if (wavesEl) {
                const wr = wavesEl.getBoundingClientRect();
                if (ev.clientY <= wr.bottom) return;
            }
            
            lastX = ev.clientX;
            lastY = ev.clientY;
        }
    }
    
    function onPointerUp(ev) {
        if (isTouchDevice) {
            isTracking = false;
        }
    }
    
    function drawFoot(f, age) {
        const alpha = Math.max(0, 1 - age / 1000);
        ctx.save();
        
        const footprintScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--footprint-scale')) || 1;
        const gapPx = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--footprint-gap')) || 20) * footprintScale;
        
        const perpX = Math.cos((f.angle || 0) - Math.PI / 2);
        const perpY = Math.sin((f.angle || 0) - Math.PI / 2);
        const lateral = (f.mirror % 2 === 0) ? -gapPx / 2 : gapPx / 2;
        
        ctx.translate(f.x + perpX * lateral, f.y + perpY * lateral);
        ctx.rotate(f.angle || 0);
        
        const footprintBaseWidth = 235;
        const footprintSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--footprint-size')) || 24;
        let s = footprintSize / footprintBaseWidth;
        s = s * footprintScale;
        ctx.scale(s, s);
        
        if (f.mirror % 2 === 0) ctx.scale(-1, 1);
        
        const footCenterX = 180;
        const bridgeY = 300;
        const pts = [];
        
        // Foot shape points
        pts.push({ x: footCenterX + 10, y: bridgeY - 1.72 * 200 });
        pts.push({ x: footCenterX - 235 / 2.0 + 35, y: bridgeY - 1.7 * 200 });
        pts.push({ x: footCenterX - 235 / 2.0, y: bridgeY - 1.2 * 200 });
        pts.push({ x: footCenterX - 150 / 2.0 + 15, y: bridgeY - 70 });
        pts.push({ x: footCenterX - 160 / 2.0, y: bridgeY + 100 });
        pts.push({ x: footCenterX - 80 / 2.0, y: bridgeY + 185 });
        pts.push({ x: footCenterX + 80 / 2.0, y: bridgeY + 185 });
        pts.push({ x: footCenterX + 160 / 2.0, y: bridgeY + 120 });
        pts.push({ x: footCenterX + 150 / 2.0 + 10, y: bridgeY - 20 });
        pts.push({ x: footCenterX + 235 / 2.0, y: bridgeY - 200 });
        pts.push({ x: footCenterX + 235 / 2.0 - 30, y: bridgeY - 1.45 * 200 });
        
        const local = pts.map(p => ({ x: p.x - footCenterX, y: p.y - bridgeY }));
        
        ctx.fillStyle = `rgba(176,140,104,${0.75 * alpha})`;
        ctx.strokeStyle = `rgba(0,0,0,${0.06 * alpha})`;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        const last = local[local.length - 1];
        ctx.moveTo(last.x, last.y);
        
        for (let i = 0; i < local.length; i++) {
            const p = local[i];
            const next = local[(i + 1) % local.length];
            const cx = (p.x + next.x) / 2;
            const cy = (p.y + next.y) / 2;
            ctx.quadraticCurveTo(p.x, p.y, cx, cy);
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    
    function frame() {
        ctx.clearRect(0, 0, w, h);
        const now = performance.now();
        
        for (let i = footprints.length - 1; i >= 0; i--) {
            const f = footprints[i];
            const age = now - f.ts;
            
            if (age > 1000) {
                footprints.splice(i, 1);
                continue;
            }
            
            drawFoot(f, age);
        }
        
        raf = requestAnimationFrame(frame);
    }
    
    function start() {
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerdown', onPointerDown, { passive: true });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
        raf = requestAnimationFrame(frame);
    }
    
    function stop() {
        try {
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onPointerMove, { passive: true });
            window.removeEventListener('pointerdown', onPointerDown, { passive: true });
            window.removeEventListener('pointerup', onPointerUp, { passive: true });
        } catch (e) {}
        if (raf) {
            cancelAnimationFrame(raf);
            raf = null;
        }
        ctx.clearRect(0, 0, w, h);
        footprints.length = 0;
        isTracking = false;
    }
    
    start();
    return { start, stop };
}

// Initialize footprints on homepage and cat paws on about page
let footprintController = null;
let catPawController = null;

function ensureFootprintsForCurrentPage() {
    const isHomepage = document.body.classList.contains('homepage');
    const isAboutPage = window.location.pathname.includes('about.html') || 
                       (window.location.pathname === '/' && document.getElementById('cat-paw-canvas'));
    
    try {
        if (footprintController && !isHomepage) {
            footprintController.stop();
            footprintController = null;
        }
        if (catPawController && !isAboutPage) {
            catPawController.stop();
            catPawController = null;
        }
    } catch (e) {}
    
    if (!footprintController && isHomepage) {
        footprintController = initFootprints();
    }
    
    if (!catPawController && isAboutPage) {
        catPawController = initCatPawFootprints();
        if (catPawController) catPawController.start();
    }
}

// Start footprints when page loads
document.addEventListener('DOMContentLoaded', () => {
    ensureFootprintsForCurrentPage();
});

/* Logo sparkle particle effect */
(function() {
    function findLogos() {
        return Array.from(document.querySelectorAll('.logo-nav a, .splash-logo'));
    }

    const __activeSparkleIntervals = new Set();
    const __activeSparkleTimeouts = new Set();
    
    try {
        window.__activeSparkleIntervals = __activeSparkleIntervals;
        window.__activeSparkleTimeouts = __activeSparkleTimeouts;
    } catch (e) {}

    function spawnSparklesAt(el, count, duration = 15000) {
        if (!el || !(el.getBoundingClientRect)) return;
        const rect = el.getBoundingClientRect();
        if (!rect || (!rect.width && !rect.height)) return;
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2 - 15; // Position slightly above center

        for (let i = 0; i < count; i++) {
            const startDelay = Math.random() * 220;
            const tid = setTimeout(() => {
                try {
                    __activeSparkleTimeouts.delete(tid);
                } catch (e) {}
                
                const s = document.createElement('div');
                s.className = 'logo-sparkle';
                const size = 4 + Math.floor(Math.random() * 3); // 4..6px
                s.style.width = size + 'px';
                s.style.height = size + 'px';
                s.style.left = (centerX - size / 2) + 'px';
                s.style.top = (centerY - size / 2) + 'px';
                s.style.opacity = '1';
                document.body.appendChild(s);

                const deg = (Math.random() * 60 - 30) * (Math.PI / 180);
                const minDist = 80;
                const maxDist = 300;
                const dist = minDist + Math.random() * (maxDist - minDist);

                // Color palette variations
                const palette = Math.floor(Math.random() * 3);
                if (palette === 1) {
                    s.style.background = 'radial-gradient(circle at 50% 50%, #ffffff 0px, #ffffff 2px, rgba(189,230,255,0.95) 30%, rgba(130,200,255,0.6) 60%, rgba(130,200,255,0) 85%)';
                    s.style.boxShadow = '0 0 2px #ffffff, 0 0 10px rgba(120,190,255,0.95), 0 0 30px rgba(60,150,255,0.55)';
                } else if (palette === 2) {
                    s.style.background = 'radial-gradient(circle at 50% 50%, #ffffff 0px, #ffffff 2px, rgba(191,255,199,0.95) 30%, rgba(160,255,160,0.6) 60%, rgba(160,255,160,0) 85%)';
                    s.style.boxShadow = '0 0 2px #ffffff, 0 0 10px rgba(160,255,160,0.95), 0 0 30px rgba(100,230,120,0.55)';
                } else {
                    s.style.background = 'radial-gradient(circle at 50% 50%, #ffffff 0px, #ffffff 2px, rgba(255,250,230,0.95) 30%, rgba(255,235,200,0.6) 60%, rgba(255,235,200,0) 85%)';
                    s.style.boxShadow = '0 0 2px #ffffff, 0 0 10px rgba(255,235,200,0.95), 0 0 30px rgba(255,200,120,0.55)';
                }

                const dx = Math.sin(deg) * dist;
                const dy = Math.cos(deg) * dist;
                const dur = Math.max(8000, Math.round(duration + (Math.random() * 4000 - 2000)));

                s.classList.add('logo-sparkle--pulse');
                const sway = (Math.random() * 10) - 5;
                const rotate = (Math.random() * 80) - 40;
                
                const anim = s.animate([
                    { transform: 'translate(0px, 0px) rotate(0deg) scale(1)', opacity: 1 },
                    { transform: `translate(${dx / 2 + sway}px, ${dy / 2}px) rotate(${rotate / 2}deg) scale(0.9)`, opacity: 0.95, offset: 0.5 },
                    { transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg) scale(0.35)`, opacity: 0 }
                ], { duration: dur, easing: 'cubic-bezier(.2,.8,.25,1)', fill: 'forwards' });

                anim.onfinish = () => {
                    try { s.remove(); } catch (e) {}
                };
            }, startDelay);
            __activeSparkleTimeouts.add(tid);
        }
    }

    function attachHandlersTo(el) {
        if (!el || el.dataset.__sparkleAttached) return;
        el.dataset.__sparkleAttached = '1';
        
        let sparkleInterval = null;
        
        function startSparks() {
            // Start spawning single particles continuously at shorter intervals
            sparkleInterval = setInterval(() => spawnSparklesAt(el, 1, 14000), 300);
            try {
                el.dataset.__sparkleInterval = String(sparkleInterval);
                __activeSparkleIntervals.add(sparkleInterval);
            } catch (e) {}
            
            // Play sparkle sound if available
            try {
                const sparkleSound = new Audio('./assets/logo-sparkle.mp3');
                sparkleSound.volume = 0.9;
                sparkleSound.play().catch(() => {});
            } catch (e) {}
        }
        
        function stopSparks() {
            try {
                if (sparkleInterval) {
                    clearInterval(sparkleInterval);
                    __activeSparkleIntervals.delete(sparkleInterval);
                    sparkleInterval = null;
                }
            } catch (e) {}
        }
        
        // Attach hover events
        el.addEventListener('pointerenter', startSparks);
        el.addEventListener('pointerleave', stopSparks);
        el.addEventListener('focus', startSparks, true);
        el.addEventListener('blur', stopSparks, true);
        
        console.debug('Sparkle: attached to', el);
    }

    // Initial attach for any logos already in the DOM
    findLogos().forEach(attachHandlersTo);

    // Watch for dynamically added logos
    const mo = new MutationObserver((records) => {
        for (const rec of records) {
            if (!rec.addedNodes) continue;
            rec.addedNodes.forEach(node => {
                if (!(node instanceof Element)) return;
                if (node.matches && node.matches('.logo-nav a, .splash-logo')) {
                    attachHandlersTo(node);
                }
                // Check descendants
                if (node.querySelectorAll) {
                    node.querySelectorAll('.logo-nav a, .splash-logo').forEach(attachHandlersTo);
                }
            });
        }
    });
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
})();

/* Cat Paw Footprints for About Page */
function initCatPawFootprints() {
    const canvas = document.getElementById('cat-paw-canvas');
    if (!canvas) return { start: () => {}, stop: () => {} };
    
    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    let w = 0, h = 0;
    const pawPrints = [];
    const baseMinStride = 60; // Smaller stride for cat paws
    let lastX = -9999, lastY = -9999, mirror = 0;
    let raf = null;
    let catPawImage = null;
    
    // Load cat paw SVG
    const img = new Image();
    img.onload = function() {
        catPawImage = img;
    };
    img.src = './assets/cat-paw.svg';
    
    function resize() {
        dpr = window.devicePixelRatio || 1;
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    
    function addPaw(x, y, angle) {
        const now = performance.now();
        mirror += 1;
        pawPrints.push({ x, y, angle, mirror, ts: now });
    }
    
    let isTracking = false;
    let isTouchDevice = false;
    
    function onPointerMove(ev) {
        // For touch devices, only create paw prints if actively tracking
        if (isTouchDevice && !isTracking) return;
        
        const x = ev.clientX;
        const y = ev.clientY;
        const pawScale = 1; // Cat paws are smaller
        const minStride = baseMinStride * pawScale;
        const dist = Math.hypot(x - lastX, y - lastY);
        
        if (dist > minStride) {
            const angle = Math.atan2(y - lastY || 0, x - lastX || 0) + Math.PI / 2;
            addPaw(x, y, angle);
            lastX = x;
            lastY = y;
        }
    }
    
    function onPointerDown(ev) {
        isTouchDevice = ev.pointerType === 'touch';
        
        if (isTouchDevice) {
            isTracking = true;
            lastX = ev.clientX;
            lastY = ev.clientY;
        }
    }
    
    function onPointerUp(ev) {
        if (isTouchDevice) {
            isTracking = false;
        }
    }
    
    function drawPaw(paw, age) {
        if (!catPawImage) return;
        
        const alpha = Math.max(0, 1 - age / 1500); // Slightly longer fade
        ctx.save();
        
        const pawSize = 20; // Size in pixels
        const gapPx = 15; // Gap between left and right paws
        
        const perpX = Math.cos((paw.angle || 0) - Math.PI / 2);
        const perpY = Math.sin((paw.angle || 0) - Math.PI / 2);
        const lateral = (paw.mirror % 2 === 0) ? -gapPx / 2 : gapPx / 2;
        
        ctx.translate(paw.x + perpX * lateral, paw.y + perpY * lateral);
        ctx.rotate(paw.angle || 0);
        
        if (paw.mirror % 2 === 0) ctx.scale(-1, 1);
        
        ctx.globalAlpha = alpha * 0.7; // Semi-transparent cat paws
        
        // Draw cat paw centered
        ctx.drawImage(catPawImage, -pawSize/2, -pawSize/2, pawSize, pawSize);
        
        ctx.restore();
    }
    
    function frame() {
        ctx.clearRect(0, 0, w, h);
        const now = performance.now();
        
        for (let i = pawPrints.length - 1; i >= 0; i--) {
            const paw = pawPrints[i];
            const age = now - paw.ts;
            
            if (age > 1500) { // Slightly longer duration
                pawPrints.splice(i, 1);
                continue;
            }
            
            drawPaw(paw, age);
        }
        
        raf = requestAnimationFrame(frame);
    }
    
    function start() {
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerdown', onPointerDown, { passive: true });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
        raf = requestAnimationFrame(frame);
    }
    
    function stop() {
        try {
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onPointerMove, { passive: true });
            window.removeEventListener('pointerdown', onPointerDown, { passive: true });
            window.removeEventListener('pointerup', onPointerUp, { passive: true });
        } catch (e) {}
        if (raf) {
            cancelAnimationFrame(raf);
            raf = null;
        }
    }
    
    return { start, stop };
}

// Add shell sound to View Work button on about page
document.addEventListener('DOMContentLoaded', function() {
    const viewWorkBtn = document.querySelector('.view-work-btn');
    if (viewWorkBtn) {
        viewWorkBtn.addEventListener('click', function() {
            try {
                const shellSound = new Audio('./assets/shell.mp3');
                shellSound.volume = 0.6;
                shellSound.play().catch(() => {});
            } catch (e) {}
        });
    }
});

// Add shell sound to Submit button on contact page
document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            try {
                const shellSound = new Audio('./assets/shell.mp3');
                shellSound.volume = 0.6;
                shellSound.play().catch(() => {});
            } catch (e) {}
        });
    }
});

// Add shell sound to Resume button on homepage
document.addEventListener('DOMContentLoaded', function() {
    const resumeBtn = document.querySelector('.resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function() {
            try {
                const shellSound = new Audio('./assets/shell.mp3');
                shellSound.volume = 0.6;
                shellSound.play().catch(() => {});
            } catch (e) {}
        });
    }
});

// Add shell sound to Shell navigation button on project subpages
document.addEventListener('DOMContentLoaded', function() {
    const shellNavBtn = document.querySelector('.shell-nav-btn');
    if (shellNavBtn) {
        shellNavBtn.addEventListener('click', function() {
            try {
                const shellSound = new Audio('./assets/shell.mp3');
                shellSound.volume = 0.6;
                shellSound.play().catch(() => {});
            } catch (e) {}
        });
    }
});

// Play project opening sound on project subpages
document.addEventListener('DOMContentLoaded', function() {
    // Add project opening sound to project card clicks
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        projectCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Play project opening sound when clicking to enter a project
                try {
                    const projectOpeningSound = new Audio('./assets/project-opening.mp3');
                    projectOpeningSound.volume = 0.7;
                    projectOpeningSound.play().catch(() => {});
                } catch (e) {}
            });
        });
    }
    
    // Also try to play on project subpages (with user gesture fallback)
    const isProjectSubpage = window.location.pathname.includes('/projects/') && 
                             window.location.pathname.endsWith('.html') &&
                             !window.location.pathname.endsWith('/projects.html');
    
    if (isProjectSubpage) {
        // Try to play immediately (may be blocked)
        setTimeout(() => {
            try {
                const projectOpeningSound = new Audio('../assets/project-opening.mp3');
                projectOpeningSound.volume = 0.7;
                projectOpeningSound.play().catch(() => {
                    // If blocked, wait for any user interaction
                    document.addEventListener('click', function playOnClick() {
                        projectOpeningSound.play().catch(() => {});
                        document.removeEventListener('click', playOnClick);
                    }, { once: true });
                });
            } catch (e) {}
        }, 100);
    }
});