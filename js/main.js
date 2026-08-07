/**
 * Portfolio Site - Main JavaScript
 * Handles navigation, animations, and interactions
 */

// ============================================
// Navigation Toggle
// ============================================

const navToggler = document.querySelector('.nav-toggler');
const navMenu = document.querySelector('.navbar__menu');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize event listeners
function initNavigation() {
    if (navToggler) {
        navToggler.addEventListener('click', togglerClick);
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', navLinkClick);
    });
}

function togglerClick() {
    navToggler.classList.toggle('toggler-open');
    navMenu.classList.toggle('open');
    navToggler.setAttribute('aria-expanded', 
        navToggler.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
    );
}

function navLinkClick() {
    if (navMenu.classList.contains('open')) {
        navToggler.click();
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navToggler && navMenu.classList.contains('open')) {
        if (!e.target.closest('.navbar')) {
            navToggler.click();
        }
    }
});

// ============================================
// Stat Counter Animation
// ============================================

class StatCounter {
    constructor(element, target) {
        this.element = element;
        this.target = parseInt(target) || 0;
        this.current = 0;
        this.duration = 2000; // milliseconds
        this.startTime = null;
        this.isAnimating = false;
    }

    animate(currentTime) {
        if (!this.startTime) {
            this.startTime = currentTime;
        }

        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);

        // Easing function (easeOutCubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        this.current = Math.floor(this.target * easeProgress);
        this.element.textContent = this.current;

        if (progress < 1) {
            requestAnimationFrame(this.animate.bind(this));
        } else {
            this.element.textContent = this.target;
            this.isAnimating = false;
        }
    }

    start() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.startTime = null;
            requestAnimationFrame(this.animate.bind(this));
        }
    }
}

const statCounters = [];
let hasAnimatedStats = false;

function initStatCounters() {
    const statNumbers = document.querySelectorAll('[data-target]');
    
    statNumbers.forEach(element => {
        const target = element.getAttribute('data-target');
        const counter = new StatCounter(element, target);
        statCounters.push(counter);
    });

    // Intersection Observer to trigger animation when section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimatedStats) {
                hasAnimatedStats = true;
                statCounters.forEach(counter => counter.start());
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        observer.observe(heroSection);
    }
}

// ============================================
// Scroll Animations
// ============================================

function initScrollAnimations() {
    const elements = document.querySelectorAll('.project-card, .featured__project');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                entry.target.style.opacity = '0';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

// ============================================
// Smooth Scroll Enhancement
// ============================================

function initSmoothScroll() {
    // Add smooth scroll behavior for hash links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// Navbar Background on Scroll
// ============================================

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        if (window.scrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
    });
}

// ============================================
// Theme & Accessibility
// ============================================

function initAccessibility() {
    // Ensure all interactive elements have proper ARIA labels
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (!btn.getAttribute('aria-label') && !btn.textContent.trim()) {
            console.warn('Button missing aria-label:', btn);
        }
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            navToggler.click();
        }
    });
}

// ============================================
// Performance Monitoring
// ============================================

function initPerformanceMonitoring() {
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page load time:', pageLoadTime, 'ms');
        });
    }
}

// ============================================
// Lazy Loading Images
// ============================================

function initLazyLoading() {
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Images are already visible via src, but we can add loading attribute
                    if (!img.hasAttribute('loading')) {
                        img.setAttribute('loading', 'lazy');
                    }
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => observer.observe(img));
    }
}

// ============================================
// Expandable Content
// ============================================

function initExpandable() {
    const expandButtons = document.querySelectorAll('[class*="__expand"]');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const detailsId = this.getAttribute('aria-controls');
            const details = document.getElementById(detailsId);
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                details.hidden = true;
                this.setAttribute('aria-expanded', 'false');
                this.textContent = 'Show Details';
            } else {
                details.hidden = false;
                this.setAttribute('aria-expanded', 'true');
                this.textContent = 'Show Less';
            }
        });
    });
}

// ============================================
// Initialize Everything
// ============================================

function init() {
    console.log('Initializing portfolio site...');
    
    initNavigation();
    initStatCounters();
    initScrollAnimations();
    initSmoothScroll();
    initNavbarScroll();
    initAccessibility();
    initPerformanceMonitoring();
    initLazyLoading();
    initExpandable();
    
    console.log('Portfolio site initialized.');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// Utility Functions
// ============================================

/**
 * Throttle function to limit execution frequency
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * Debounce function to delay execution
 */
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    }
}

// ============================================
// Service Worker Registration (Optional)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}