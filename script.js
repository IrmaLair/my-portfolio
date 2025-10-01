// Splash Screen functionality
document.addEventListener('DOMContentLoaded', function() {
    const splash = document.getElementById('splash');
    
    if (splash) {
        // Hide splash screen after 3 seconds
        setTimeout(function() {
            splash.classList.add('fade-out');
            
            // Remove splash screen from DOM after fade animation
            setTimeout(function() {
                splash.style.display = 'none';
            }, 1000);
        }, 3000);
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

// Add hover effects to project cards
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
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