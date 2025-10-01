// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const contactForm = document.getElementById('contact-form');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
// Stripe/Deposit modal elements
const depositModal = document.getElementById('deposit-modal');
const depositCloseBtn = document.getElementById('deposit-close');
const depositCancelBtn = document.getElementById('deposit-cancel');
const depositPayBtn = document.getElementById('deposit-pay');
const depositAmountInput = document.getElementById('deposit-amount');
let stripe = undefined;
let stripeElements = undefined;
let stripeCard = undefined;
let currentBookingId = undefined;

// Portfolio data (using your local images under assets/images)
const portfolioData = [
    { id: 1, category: 'wedding',  title: 'Wedding Moment',    image: 'assets/images/wedding/IMG_2228.jpg', description: 'Signature wedding capture' },
    { id: 2, category: 'wedding',  title: 'Wedding Detail',    image: 'assets/images/wedding/IMG_3462.jpg', description: 'Details that tell the story' },
    { id: 3, category: 'wedding',  title: 'Wedding Portrait',  image: 'assets/images/wedding/IMG_3468.jpg', description: 'Timeless wedding portrait' },
    { id: 4, category: 'event',    title: 'Event Highlight',   image: 'assets/images/event/IMG_1413.jpg', description: 'Energy of the event' },
    { id: 5, category: 'event',    title: 'Conference Scene',  image: 'assets/images/event/PSX_20240508_155753.jpg', description: 'On-stage moment' },
    { id: 6, category: 'event',    title: 'Crowd & Vibes',     image: 'assets/images/event/PSX_20240508_162834.jpg', description: 'Audience in the moment' },
    { id: 7, category: 'portrait', title: 'Studio Portrait',   image: 'assets/images/potrait/IMG_5609.jpg', description: 'Clean studio look' },
    { id: 8, category: 'portrait', title: 'Outdoor Portrait',  image: 'assets/images/potrait/IMG_6006.jpg', description: 'Natural light portrait' }
];

let currentImageIndex = 0;
let filteredPortfolio = [...portfolioData];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').catch(console.error);
    }
    initializeConsentAndAnalytics();
});

function initializeWebsite() {
    // Initialize portfolio
    renderPortfolio();
    
    // Initialize event listeners
    setupEventListeners();
    
    // Initialize theme
    initializeTheme();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize animations
    initializeAnimations();
}

function initializeConsentAndAnalytics() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    const choice = localStorage.getItem('cookieConsent');

    const enableAnalytics = () => {
        // Example: load Plausible (privacy-first) only after consent
        const s = document.createElement('script');
        s.defer = true;
        s.setAttribute('data-domain', 'example.com');
        s.src = 'https://plausible.io/js/script.js';
        document.head.appendChild(s);
    };

    if (choice === 'accepted') {
        enableAnalytics();
        return;
    }
    if (choice === 'declined') {
        return;
    }
    if (banner) banner.classList.add('show');

    if (acceptBtn) acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        if (banner) banner.classList.remove('show');
        enableAnalytics();
    });
    if (declineBtn) declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        if (banner) banner.classList.remove('show');
    });
}

function setupEventListeners() {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Contact form
    contactForm.addEventListener('submit', handleContactForm);
    
    // Lightbox events
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPreviousImage);
    lightboxNext.addEventListener('click', showNextImage);
    
    // Close lightbox when clicking outside
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Portfolio filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterPortfolio(filter);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Testimonial slider
    initializeTestimonialSlider();

    // Deposit modal controls
    if (depositCloseBtn) depositCloseBtn.addEventListener('click', closeDepositModal);
    if (depositCancelBtn) depositCancelBtn.addEventListener('click', closeDepositModal);
    if (depositPayBtn) depositPayBtn.addEventListener('click', handleDepositPay);
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', (!expanded).toString());
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme toggle icon
    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update theme toggle icon
    const icon = themeToggle.querySelector('i');
    icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // Dark theme navbar
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(44, 62, 80, 0.98)';
        } else {
            navbar.style.background = 'rgba(44, 62, 80, 0.95)';
        }
    }
}

function renderPortfolio() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    portfolioGrid.innerHTML = '';
    
    filteredPortfolio.forEach((item, index) => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item fade-in-up';
        portfolioItem.style.animationDelay = `${index * 0.1}s`;
        
        portfolioItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="portfolio-overlay">
                <i class="fas fa-search-plus"></i>
            </div>
            <div class="portfolio-caption">
                <h4>${item.title}</h4>
                <p>${item.description || ''}</p>
            </div>
        `;
        
        portfolioItem.addEventListener('click', () => openLightbox(index));
        portfolioGrid.appendChild(portfolioItem);
    });
}

function filterPortfolio(category) {
    if (category === 'all') {
        filteredPortfolio = [...portfolioData];
    } else {
        filteredPortfolio = portfolioData.filter(item => item.category === category);
    }
    renderPortfolio();
}

function openLightbox(index) {
    currentImageIndex = index;
    lightboxImage.src = filteredPortfolio[index].image;
    lightboxImage.alt = filteredPortfolio[index].title;
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + filteredPortfolio.length) % filteredPortfolio.length;
    lightboxImage.src = filteredPortfolio[currentImageIndex].image;
    lightboxImage.alt = filteredPortfolio[currentImageIndex].title;
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % filteredPortfolio.length;
    lightboxImage.src = filteredPortfolio[currentImageIndex].image;
    lightboxImage.alt = filteredPortfolio[currentImageIndex].title;
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    // Compose booking payload
    try {
        const date = document.getElementById('date')?.value;
        const startTime = document.getElementById('startTime')?.value;
        const service = document.getElementById('service')?.value;
        if (date && startTime && service) {
            const start = new Date(`${date}T${startTime}`);
            const end = new Date(start.getTime() + 60 * 60 * 1000); // default 1h slot
            data.start = start.toISOString();
            data.end = end.toISOString();
        }
    } catch {}
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<span class="loading"></span> Sending...';
    submitButton.disabled = true;
    
    // Submit to booking API
    fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: data.name,
            email: data.email,
            service: data.service,
            start: data.start,
            end: data.end,
            notes: data.message,
            subject: data.subject
        })
    }).then(async (resp) => {
        if (!resp.ok) throw new Error(await resp.text());
        return resp.json();
    }).then((json) => {
        currentBookingId = json.id;
        showNotification('Booking saved. Please pay a deposit to secure your slot.', 'info');
        openDepositModal();
    }).catch((err) => {
        console.error(err);
        showNotification('Sorry, something went wrong. Please try again.', 'error');
    }).finally(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
}

function ensureStripeInitialized() {
    if (!stripe) {
        const pk = window.STRIPE_PUBLISHABLE_KEY || 'pk_test_replace_me';
        if (!window.Stripe) {
            showNotification('Stripe.js failed to load.', 'error');
            return false;
        }
        stripe = window.Stripe(pk);
    }
    if (!stripeElements) {
        stripeElements = stripe.elements();
    }
    if (!stripeCard) {
        stripeCard = stripeElements.create('card', { hidePostalCode: true });
        const mountEl = document.getElementById('card-element');
        if (mountEl) stripeCard.mount(mountEl);
    }
    return true;
}

function openDepositModal() {
    if (!depositModal) return;
    if (!ensureStripeInitialized()) return;
    depositModal.style.display = 'block';
    depositModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeDepositModal() {
    if (!depositModal) return;
    depositModal.style.display = 'none';
    depositModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

async function handleDepositPay() {
    try {
        if (!currentBookingId) {
            showNotification('No booking found to attach payment.', 'error');
            return;
        }
        const amountUsd = parseFloat(depositAmountInput?.value || '0');
        if (!amountUsd || amountUsd < 1) {
            showNotification('Enter a valid deposit amount.', 'error');
            return;
        }
        const cents = Math.round(amountUsd * 100);
        const resp = await fetch('/api/payments/deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId: currentBookingId, amount: cents })
        });
        if (!resp.ok) throw new Error(await resp.text());
        const { clientSecret } = await resp.json();

        const cardErrors = document.getElementById('card-errors');
        if (!stripe || !stripeCard) ensureStripeInitialized();
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: stripeCard
            }
        });
        if (result.error) {
            if (cardErrors) cardErrors.textContent = result.error.message || 'Payment failed';
            showNotification('Payment failed. Please check your card details.', 'error');
            return;
        }
        showNotification('Deposit paid! Your booking is confirmed.', 'success');
        closeDepositModal();
    } catch (e) {
        console.error(e);
        showNotification('Payment error. Please try again.', 'error');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
}

function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .blog-card, .testimonial, .about-text, .about-image');
    animateElements.forEach(el => observer.observe(el));
}

function initializeTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
    
    // Auto-advance testimonials every 5 seconds
    setInterval(nextTestimonial, 5000);
    
    // Initialize first testimonial
    showTestimonial(0);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Add loading states for better UX
function addLoadingStates() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') return; // Skip form submit buttons
            
            this.style.opacity = '0.7';
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.pointerEvents = 'auto';
            }, 1000);
        });
    });
}

// Initialize loading states
document.addEventListener('DOMContentLoaded', addLoadingStates);

// Add keyboard navigation for lightbox
document.addEventListener('keydown', function(e) {
    if (lightbox.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            showPreviousImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    }
});

// Add touch/swipe support for mobile lightbox
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            showNextImage(); // Swipe left - next image
        } else {
            showPreviousImage(); // Swipe right - previous image
        }
    }
}

// Add scroll-to-top functionality
function addScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--gradient);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        box-shadow: var(--shadow);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    }, 100));
    
    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top
document.addEventListener('DOMContentLoaded', addScrollToTop);

// Add form validation
function addFormValidation() {
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error
    clearFieldError(e);
    
    // Validate based on field type
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 0.9rem;
        margin-top: 5px;
    `;
    
    field.style.borderColor = '#e74c3c';
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    const errorDiv = field.parentNode.querySelector('.field-error');
    
    if (errorDiv) {
        errorDiv.remove();
    }
    
    field.style.borderColor = '';
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', addFormValidation);

// Add performance monitoring
function addPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });
    
    // Monitor image load times
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            console.log(`Image loaded: ${img.src}`);
        });
    });
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', addPerformanceMonitoring);
