/* ==================== MAIN APPLICATION ==================== */

class App {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        console.log('🚀 AmoraPrime initialized');
        
        this.initializeModules();
        this.setupEventListeners();
        this.initializeFeatures();
        this.handlePageLoad();
        
        this.isInitialized = true;
    }

    /**
     * Initialize all modules
     */
    initializeModules() {
        // Lazy load images
        if (CONFIG.performance.lazyLoadImages) {
            this.initLazyLoading();
        }

        // Initialize smooth scroll
        this.initSmoothScroll();

        // Initialize modal functionality
        this.initModals();

        // Initialize tooltips
        this.initTooltips();
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Handle external links
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.href.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });

        // Handle hash changes
        window.addEventListener('hashchange', () => this.handleHashChange());

        // Handle visibility change
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());

        // Handle online/offline status
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));

        // Handle print
        window.addEventListener('beforeprint', () => this.handlePrint());

        // Prevent right-click on images (optional)
        if (CONFIG.features && CONFIG.features.protectImages) {
            document.querySelectorAll('img').forEach(img => {
                img.addEventListener('contextmenu', (e) => e.preventDefault());
            });
        }
    }

    /**
     * Initialize features based on config
     */
    initializeFeatures() {
        // Newsletter form
        if (CONFIG.features.newsletter) {
            this.initNewsletter();
        }

        // Back to top button
        this.initBackToTop();

        // Cookie consent (if needed)
        if (CONFIG.features.cookieConsent) {
            this.initCookieConsent();
        }

        // Analytics (if configured)
        if (CONFIG.analytics) {
            this.initAnalytics();
        }
    }

    /**
     * Initialize lazy loading for images
     */
    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src') || img.getAttribute('src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: `${CONFIG.performance.lazyLoadOffset || 200}px`
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                const src = img.getAttribute('data-src');
                if (src) img.src = src;
            });
        }
    }

    /**
     * Initialize smooth scrolling
     */
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#') {
                    e.preventDefault();
                    return;
                }
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offset = CONFIG.scroll.offset || 80;
                    Utils.scrollTo(target, offset);
                }
            });
        });
    }

    /**
     * Initialize forms
     */
    initForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add novalidate to use custom validation
            form.setAttribute('novalidate', 'true');
            
            // Handle form submission
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
            
            // Real-time validation
            if (CONFIG.forms.validateOnBlur) {
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    input.addEventListener('blur', () => this.validateField(input));
                });
            }
        });
    }

    /**
     * Validate form field
     * @param {Element} field - Form field element
     * @returns {Boolean}
     */
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        let isValid = true;
        let errorMessage = '';

        // Check if required
        if (required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (type === 'email' && value && !Utils.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        // Phone validation
        if (type === 'tel' && value && !Utils.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }

        // URL validation
        if (type === 'url' && value) {
            try {
                new URL(value);
            } catch {
                isValid = false;
                errorMessage = 'Please enter a valid URL';
            }
        }

        // Min length
        const minLength = field.getAttribute('minlength');
        if (minLength && value.length < parseInt(minLength)) {
            isValid = false;
            errorMessage = `Minimum ${minLength} characters required`;
        }

        // Max length
        const maxLength = field.getAttribute('maxlength');
        if (maxLength && value.length > parseInt(maxLength)) {
            isValid = false;
            errorMessage = `Maximum ${maxLength} characters allowed`;
        }

        // Show/hide error
        this.showFieldError(field, isValid ? '' : errorMessage);

        return isValid;
    }

    /**
     * Show field error message
     * @param {Element} field - Form field element
     * @param {String} message - Error message
     */
    showFieldError(field, message) {
        // Remove existing error
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Remove error class
        field.classList.remove('error');

        if (message) {
            // Add error class
            field.classList.add('error');

            // Create error message
            const errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.style.cssText = `
                display: block;
                color: #EF4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            `;

            field.parentElement.appendChild(errorElement);
        }
    }

    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        let isValid = true;

        // Validate all fields
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            // Show error notification
            this.showNotification('Please fix the errors in the form', 'error');
            return;
        }

        // Get form action and method
        const action = form.getAttribute('action') || '#';
        const method = form.getAttribute('method') || 'POST';

        // Show loading state
        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset form
            form.reset();
            
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Show success message
            this.showNotification('Message sent successfully!', 'success');
        }, 1500);

        // For actual implementation, use fetch:
        /*
        fetch(action, {
            method: method,
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            this.showNotification('Message sent successfully!', 'success');
        })
        .catch(error => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            this.showNotification('Error sending message. Please try again.', 'error');
        });
        */
    }

    /**
     * Initialize newsletter subscription
     */
    initNewsletter() {
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const email = form.querySelector('input[type="email"]').value;
                
                if (!Utils.isValidEmail(email)) {
                    this.showNotification('Please enter a valid email address', 'error');
                    return;
                }

                // Handle newsletter subscription
                this.showNotification('Thanks for subscribing!', 'success');
                form.reset();
            });
        });
    }

    /**
     * Initialize back to top button
     */
    initBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        `;
        backToTop.setAttribute('aria-label', 'Back to top');
        
        // Add styles
        backToTop.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            z-index: 1000;
        `;

        backToTop.querySelector('svg').style.cssText = `
            width: 24px;
            height: 24px;
        `;

        document.body.appendChild(backToTop);

        // Show/hide button on scroll
        window.addEventListener('scroll', Utils.throttle(() => {
            if (window.pageYOffset > 500) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        }, 100));

        // Scroll to top on click
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Hover effect
        backToTop.addEventListener('mouseenter', () => {
            backToTop.style.transform = 'translateY(-5px)';
            backToTop.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
        });

        backToTop.addEventListener('mouseleave', () => {
            backToTop.style.transform = 'translateY(0)';
            backToTop.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });
    }

    /**
     * Initialize modals
     */
    initModals() {
        const modalTriggers = document.querySelectorAll('[data-modal]');
        
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                this.openModal(modalId);
            });
        });

        // Close modal on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                this.closeModal();
            }
        });

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    /**
     * Open modal
     * @param {String} modalId - Modal ID
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close modal
     */
    closeModal() {
        const activeModal = document.querySelector('.modal.active');
        if (!activeModal) return;

        activeModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Initialize tooltips
     */
    initTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        
        tooltips.forEach(element => {
            const text = element.getAttribute('data-tooltip');
            const position = element.getAttribute('data-tooltip-position') || 'top';
            
            element.addEventListener('mouseenter', () => {
                this.showTooltip(element, text, position);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    /**
     * Show tooltip
     * @param {Element} element - Target element
     * @param {String} text - Tooltip text
     * @param {String} position - Tooltip position
     */
    showTooltip(element, text, position) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            white-space: nowrap;
            z-index: 10000;
            pointer-events: none;
        `;

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let top, left;

        switch (position) {
            case 'top':
                top = rect.top - tooltipRect.height - 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = rect.bottom + 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - 8;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + 8;
                break;
        }

        tooltip.style.top = `${top + window.scrollY}px`;
        tooltip.style.left = `${left + window.scrollX}px`;
        tooltip.style.opacity = '1';
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    /**
     * Show notification
     * @param {String} message - Notification message
     * @param {String} type - Notification type (success, error, info)
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            info: '#3B82F6'
        };

        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Handle hash change
     */
    handleHashChange() {
        const hash = window.location.hash;
        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                setTimeout(() => {
                    Utils.scrollTo(target, CONFIG.scroll.offset);
                }, 100);
            }
        }
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            console.log('Page hidden');
        } else {
            console.log('Page visible');
        }
    }

    /**
     * Handle online/offline status
     * @param {Boolean} isOnline - Online status
     */
    handleOnlineStatus(isOnline) {
        const message = isOnline ? 'You are back online!' : 'You are offline';
        const type = isOnline ? 'success' : 'error';
        this.showNotification(message, type);
    }

    /**
     * Handle print
     */
    handlePrint() {
        console.log('Preparing to print...');
    }

    /**
     * Handle page load
     */
    handlePageLoad() {
        // Check if page loaded from hash
        if (window.location.hash) {
            this.handleHashChange();
        }

        // Hide loading screen (if exists)
        const loader = document.querySelector('.page-loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.remove();
                }, 300);
            }, 500);
        }
    }

    /**
     * Initialize cookie consent
     */
    initCookieConsent() {
        const consent = Utils.getCookie('cookie_consent');
        
        if (!consent) {
            // Show cookie banner
            const banner = document.createElement('div');
            banner.className = 'cookie-banner';
            banner.innerHTML = `
                <div class="cookie-content">
                    <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
                    <button class="btn btn--primary btn-accept">Accept</button>
                </div>
            `;
            
            banner.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--bg-card);
                border-top: 1px solid var(--border-color);
                padding: 1.5rem;
                z-index: 10000;
                box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
            `;

            document.body.appendChild(banner);

            banner.querySelector('.btn-accept').addEventListener('click', () => {
                Utils.setCookie('cookie_consent', 'accepted', 365);
                banner.remove();
            });
        }
    }

    /**
     * Initialize analytics
     */
    initAnalytics() {
        // Add your analytics code here
        // Example: Google Analytics, Mixpanel, etc.
        console.log('Analytics initialized');
    }
}

// Initialize application
const app = new App();
