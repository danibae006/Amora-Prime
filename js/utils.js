/* ==================== UTILITY FUNCTIONS ==================== */

const Utils = {
    /**
     * Debounce function - limits the rate at which a function can fire
     * @param {Function} func - Function to debounce
     * @param {Number} wait - Wait time in milliseconds
     * @returns {Function}
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function - ensures a function is called at most once in a specified time period
     * @param {Function} func - Function to throttle
     * @param {Number} limit - Time limit in milliseconds
     * @returns {Function}
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Get element by selector
     * @param {String} selector - CSS selector
     * @returns {Element}
     */
    $(selector) {
        return document.querySelector(selector);
    },

    /**
     * Get all elements by selector
     * @param {String} selector - CSS selector
     * @returns {NodeList}
     */
    $$(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * Add event listener to element(s)
     * @param {String|Element} selector - CSS selector or element
     * @param {String} event - Event name
     * @param {Function} callback - Callback function
     */
    on(selector, event, callback) {
        const elements = typeof selector === 'string' ? this.$$(selector) : [selector];
        elements.forEach(el => el.addEventListener(event, callback));
    },

    /**
     * Remove class from element(s)
     * @param {String|Element} selector - CSS selector or element
     * @param {String} className - Class name to remove
     */
    removeClass(selector, className) {
        const elements = typeof selector === 'string' ? this.$$(selector) : [selector];
        elements.forEach(el => el.classList.remove(className));
    },

    /**
     * Add class to element(s)
     * @param {String|Element} selector - CSS selector or element
     * @param {String} className - Class name to add
     */
    addClass(selector, className) {
        const elements = typeof selector === 'string' ? this.$$(selector) : [selector];
        elements.forEach(el => el.classList.add(className));
    },

    /**
     * Toggle class on element(s)
     * @param {String|Element} selector - CSS selector or element
     * @param {String} className - Class name to toggle
     */
    toggleClass(selector, className) {
        const elements = typeof selector === 'string' ? this.$$(selector) : [selector];
        elements.forEach(el => el.classList.toggle(className));
    },

    /**
     * Check if element has class
     * @param {Element} element - DOM element
     * @param {String} className - Class name to check
     * @returns {Boolean}
     */
    hasClass(element, className) {
        return element.classList.contains(className);
    },

    /**
     * Smooth scroll to element
     * @param {String|Element} target - CSS selector or element
     * @param {Number} offset - Offset from top in pixels
     */
    scrollTo(target, offset = 0) {
        const element = typeof target === 'string' ? this.$(target) : target;
        if (!element) return;

        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Check if element is in viewport
     * @param {Element} element - DOM element
     * @param {Number} offset - Offset in pixels
     * @returns {Boolean}
     */
    isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -offset &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Get scroll position
     * @returns {Object} - {x, y}
     */
    getScrollPosition() {
        return {
            x: window.pageXOffset || document.documentElement.scrollLeft,
            y: window.pageYOffset || document.documentElement.scrollTop
        };
    },

    /**
     * Animate number counter
     * @param {Element} element - DOM element
     * @param {Number} target - Target number
     * @param {Number} duration - Animation duration in milliseconds
     */
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = Math.floor(target);
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    },

    /**
     * Format number with separator
     * @param {Number} num - Number to format
     * @param {String} separator - Separator character
     * @returns {String}
     */
    formatNumber(num, separator = ',') {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    },

    /**
     * Get random number between min and max
     * @param {Number} min - Minimum value
     * @param {Number} max - Maximum value
     * @returns {Number}
     */
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Shuffle array
     * @param {Array} array - Array to shuffle
     * @returns {Array}
     */
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    /**
     * Get cookie value
     * @param {String} name - Cookie name
     * @returns {String|null}
     */
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    },

    /**
     * Set cookie
     * @param {String} name - Cookie name
     * @param {String} value - Cookie value
     * @param {Number} days - Days until expiration
     */
    setCookie(name, value, days = 7) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    },

    /**
     * Delete cookie
     * @param {String} name - Cookie name
     */
    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    },

    /**
     * Get local storage item
     * @param {String} key - Storage key
     * @returns {*}
     */
    getStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error getting storage:', error);
            return null;
        }
    },

    /**
     * Set local storage item
     * @param {String} key - Storage key
     * @param {*} value - Value to store
     */
    setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error setting storage:', error);
        }
    },

    /**
     * Remove local storage item
     * @param {String} key - Storage key
     */
    removeStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing storage:', error);
        }
    },

    /**
     * Create element with attributes
     * @param {String} tag - HTML tag name
     * @param {Object} attributes - Element attributes
     * @param {String} content - Inner HTML content
     * @returns {Element}
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'class') {
                element.className = attributes[key];
            } else if (key === 'style' && typeof attributes[key] === 'object') {
                Object.assign(element.style, attributes[key]);
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        if (content) {
            element.innerHTML = content;
        }
        
        return element;
    },

    /**
     * Wait for specified time
     * @param {Number} ms - Milliseconds to wait
     * @returns {Promise}
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Copy text to clipboard
     * @param {String} text - Text to copy
     * @returns {Promise}
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Failed to copy:', error);
            return false;
        }
    },

    /**
     * Validate email address
     * @param {String} email - Email to validate
     * @returns {Boolean}
     */
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Validate phone number
     * @param {String} phone - Phone to validate
     * @returns {Boolean}
     */
    isValidPhone(phone) {
        const regex = /^[\d\s\-\+\(\)]+$/;
        return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    /**
     * Truncate text
     * @param {String} text - Text to truncate
     * @param {Number} length - Maximum length
     * @param {String} suffix - Suffix to add
     * @returns {String}
     */
    truncate(text, length = 100, suffix = '...') {
        if (text.length <= length) return text;
        return text.substring(0, length).trim() + suffix;
    },

    /**
     * Capitalize first letter
     * @param {String} string - String to capitalize
     * @returns {String}
     */
    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },

    /**
     * Get URL parameters
     * @returns {Object}
     */
    getUrlParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');
        
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        });
        
        return params;
    },

    /**
     * Check if device is mobile
     * @returns {Boolean}
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Check if device is touch enabled
     * @returns {Boolean}
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Get browser name
     * @returns {String}
     */
    getBrowser() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        if (userAgent.includes('Opera')) return 'Opera';
        return 'Unknown';
    },

    /**
     * Preload image
     * @param {String} src - Image source
     * @returns {Promise}
     */
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    /**
     * Lazy load images
     * @param {String} selector - Image selector
     * @param {Number} offset - Offset from viewport
     */
    lazyLoadImages(selector = '[data-lazy]', offset = 200) {
        const images = this.$$(selector);
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-lazy');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-lazy');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: `${offset}px`
        });
        
        images.forEach(img => imageObserver.observe(img));
    },
};

// Export utils
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}