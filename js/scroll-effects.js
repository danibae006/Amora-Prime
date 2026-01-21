/* ==================== SCROLL EFFECTS ==================== */

class ScrollEffects {
    constructor() {
        this.scrollPosition = 0;
        this.ticking = false;
        this.elements = [];
        
        this.init();
    }
    
    /**
     * Initialize scroll effects
     */
    init() {
        // Get scroll position
        this.updateScrollPosition();
        
        // Setup scroll listener
        this.setupScrollListener();
        
        // Initialize effects
        this.initParallax();
        this.initFadeIn();
        this.initScrollProgress();
        this.initStickyElements();
        this.initScrollToTop();
    }
    
    /**
     * Setup scroll listener with RAF
     */
    setupScrollListener() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.updateScrollPosition();
                    this.handleScroll();
                    this.ticking = false;
                });
                
                this.ticking = true;
            }
        }, { passive: true });
    }
    
    /**
     * Update scroll position
     */
    updateScrollPosition() {
        this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    }
    
    /**
     * Handle scroll event
     */
    handleScroll() {
        this.updateParallax();
        this.updateFadeIn();
        this.updateScrollProgress();
        this.updateScrollToTop();
    }
    
    /* ==================== PARALLAX EFFECT ==================== */
    
    /**
     * Initialize parallax elements
     */
    initParallax() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
    }
    
    /**
     * Update parallax positions
     */
    updateParallax() {
        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + this.scrollPosition;
            const elementHeight = rect.height;
            const windowHeight = window.innerHeight;
            
            // Check if element is in viewport
            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrolled = this.scrollPosition - elementTop + windowHeight;
                const parallaxValue = scrolled * speed;
                
                element.style.transform = `translateY(${parallaxValue}px)`;
            }
        });
    }
    
    /* ==================== FADE IN ON SCROLL ==================== */
    
    /**
     * Initialize fade in elements
     */
    initFadeIn() {
        this.fadeElements = document.querySelectorAll('[data-fade-in]');
        
        // Setup IntersectionObserver for better performance
        if ('IntersectionObserver' in window) {
            this.fadeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateFadeIn(entry.target);
                        this.fadeObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            this.fadeElements.forEach(element => {
                this.fadeObserver.observe(element);
            });
        } else {
            // Fallback for older browsers
            this.updateFadeIn();
        }
    }
    
    /**
     * Update fade in effect (fallback)
     */
    updateFadeIn() {
        if (this.fadeObserver) return; // Skip if using IntersectionObserver
        
        this.fadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight - 50) {
                this.animateFadeIn(element);
            }
        });
    }
    
    /**
     * Animate fade in
     * @param {Element} element - Element to fade in
     */
    animateFadeIn(element) {
        const direction = element.getAttribute('data-fade-in') || 'up';
        const delay = parseFloat(element.getAttribute('data-fade-delay')) || 0;
        
        setTimeout(() => {
            element.classList.add('fade-in-active');
            element.classList.add(`fade-from-${direction}`);
        }, delay);
    }
    
    /* ==================== SCROLL PROGRESS BAR ==================== */
    
    /**
     * Initialize scroll progress bar
     */
    initScrollProgress() {
        this.progressBar = document.querySelector('[data-scroll-progress]');
        
        if (!this.progressBar) {
            // Create progress bar if doesn't exist
            this.progressBar = document.createElement('div');
            this.progressBar.className = 'scroll-progress';
            this.progressBar.setAttribute('data-scroll-progress', '');
            document.body.appendChild(this.progressBar);
        }
    }
    
    /**
     * Update scroll progress bar
     */
    updateScrollProgress() {
        if (!this.progressBar) return;
        
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollableHeight = documentHeight - windowHeight;
        const scrollPercentage = (this.scrollPosition / scrollableHeight) * 100;
        
        this.progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
    }
    
    /* ==================== STICKY ELEMENTS ==================== */
    
    /**
     * Initialize sticky elements
     */
    initStickyElements() {
        this.stickyElements = document.querySelectorAll('[data-sticky]');
        
        this.stickyElements.forEach(element => {
            const offset = parseInt(element.getAttribute('data-sticky-offset')) || 0;
            const elementTop = element.offsetTop - offset;
            
            element.dataset.stickyTop = elementTop;
        });
    }
    
    /**
     * Update sticky elements
     */
    updateStickyElements() {
        this.stickyElements.forEach(element => {
            const stickyTop = parseInt(element.dataset.stickyTop);
            
            if (this.scrollPosition >= stickyTop) {
                element.classList.add('is-sticky');
            } else {
                element.classList.remove('is-sticky');
            }
        });
    }
    
    /* ==================== SCROLL TO TOP BUTTON ==================== */
    
    /**
     * Initialize scroll to top button
     */
    initScrollToTop() {
        this.scrollToTopBtn = document.querySelector('[data-scroll-top]');
        
        if (this.scrollToTopBtn) {
            this.scrollToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }
    }
    
    /**
     * Update scroll to top button visibility
     */
    updateScrollToTop() {
        if (!this.scrollToTopBtn) return;
        
        const showAfter = 500; // Show after scrolling 500px
        
        if (this.scrollPosition > showAfter) {
            this.scrollToTopBtn.classList.add('visible');
        } else {
            this.scrollToTopBtn.classList.remove('visible');
        }
    }
    
    /**
     * Scroll to top smoothly
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    /* ==================== SCROLL SPY (Navigation) ==================== */
    
    /**
     * Initialize scroll spy for navigation
     * @param {String} navSelector - Navigation selector
     * @param {String} sectionSelector - Section selector
     */
    initScrollSpy(navSelector = '.nav__link', sectionSelector = 'section[id]') {
        this.navLinks = document.querySelectorAll(navSelector);
        this.sections = document.querySelectorAll(sectionSelector);
        
        if (this.sections.length === 0) return;
        
        // Setup observer
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        };
        
        this.spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateActiveNavLink(entry.target.id);
                }
            });
        }, observerOptions);
        
        this.sections.forEach(section => {
            this.spyObserver.observe(section);
        });
    }
    
    /**
     * Update active navigation link
     * @param {String} sectionId - Active section ID
     */
    updateActiveNavLink(sectionId) {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href === `#${sectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    /* ==================== REVEAL ON SCROLL ==================== */
    
    /**
     * Initialize reveal on scroll
     * @param {String} selector - Elements selector
     */
    initReveal(selector = '[data-reveal]') {
        this.revealElements = document.querySelectorAll(selector);
        
        if (this.revealElements.length === 0) return;
        
        this.revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-reveal-delay') || 0;
                    
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                    
                    this.revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px'
        });
        
        this.revealElements.forEach(element => {
            this.revealObserver.observe(element);
        });
    }
    
    /* ==================== ANIMATE ON SCROLL ==================== */
    
    /**
     * Animate element on scroll into view
     * @param {Element} element - Element to animate
     * @param {String} animation - Animation class name
     */
    animateOnScroll(element, animation = 'fadeInUp') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(animation);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observer.observe(element);
    }
    
    /* ==================== SMOOTH SCROLL TO ELEMENT ==================== */
    
    /**
     * Smooth scroll to element
     * @param {String|Element} target - Target element or selector
     * @param {Number} offset - Offset from top (default: 80px)
     */
    scrollToElement(target, offset = 80) {
        const element = typeof target === 'string' ? 
            document.querySelector(target) : target;
        
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    /* ==================== GET SCROLL PERCENTAGE ==================== */
    
    /**
     * Get current scroll percentage
     * @returns {Number} Scroll percentage (0-100)
     */
    getScrollPercentage() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollableHeight = documentHeight - windowHeight;
        const scrollPercentage = (this.scrollPosition / scrollableHeight) * 100;
        
        return Math.min(Math.max(scrollPercentage, 0), 100);
    }
    
    /* ==================== CHECK IF ELEMENT IN VIEWPORT ==================== */
    
    /**
     * Check if element is in viewport
     * @param {Element} element - Element to check
     * @param {Number} threshold - Percentage of element visible (0-1)
     * @returns {Boolean}
     */
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementHeight = rect.height;
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visiblePercentage = visibleHeight / elementHeight;
        
        return visiblePercentage >= threshold;
    }
    
    /* ==================== DESTROY ==================== */
    
    /**
     * Cleanup and destroy
     */
    destroy() {
        if (this.fadeObserver) this.fadeObserver.disconnect();
        if (this.spyObserver) this.spyObserver.disconnect();
        if (this.revealObserver) this.revealObserver.disconnect();
        
        window.removeEventListener('scroll', this.handleScroll);
    }
}

/* ==================== SCROLL ANIMATIONS HELPER ==================== */

/**
 * Add scroll animation to element
 * @param {String} selector - Element selector
 * @param {String} animation - Animation name
 * @param {Object} options - Animation options
 */
function addScrollAnimation(selector, animation = 'fadeInUp', options = {}) {
    const elements = document.querySelectorAll(selector);
    const {
        threshold = 0.1,
        rootMargin = '0px 0px -50px 0px',
        once = true
    } = options;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated', animation);
                
                if (once) {
                    observer.unobserve(entry.target);
                }
            } else if (!once) {
                entry.target.classList.remove('animated', animation);
            }
        });
    }, { threshold, rootMargin });
    
    elements.forEach(element => observer.observe(element));
}

/* ==================== INITIALIZE ON PAGE LOAD ==================== */

let scrollEffects;

document.addEventListener('DOMContentLoaded', () => {
    scrollEffects = new ScrollEffects();
    
    // Initialize scroll spy for navigation
    scrollEffects.initScrollSpy();
    
    // Initialize reveal on scroll
    scrollEffects.initReveal();
});

/* ==================== EXPORT FOR MODULE USE ==================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScrollEffects, addScrollAnimation };
}