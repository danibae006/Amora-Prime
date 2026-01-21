/* ==================== LAZY LOADING IMAGES ==================== */

class LazyLoader {
    constructor() {
        this.images = [];
        this.observer = null;
        this.config = {
            rootMargin: '200px 0px',
            threshold: 0.01
        };
        
        this.init();
    }
    
    /**
     * Initialize lazy loading
     */
    init() {
        // Find all images with data-src attribute
        this.images = document.querySelectorAll('img[data-src], source[data-srcset], iframe[data-src]');
        
        if (this.images.length === 0) return;
        
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            this.createObserver();
            this.observeImages();
        } else {
            // Fallback: load all images immediately
            this.loadAllImages();
        }
    }
    
    /**
     * Create IntersectionObserver
     */
    createObserver() {
        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, this.config);
    }
    
    /**
     * Start observing images
     */
    observeImages() {
        this.images.forEach(image => {
            this.observer.observe(image);
        });
    }
    
    /**
     * Load individual image
     * @param {Element} element - Image element to load
     */
    loadImage(element) {
        const isImage = element.tagName === 'IMG';
        const isIframe = element.tagName === 'IFRAME';
        const isSource = element.tagName === 'SOURCE';
        
        // Add loading class
        element.classList.add('lazy-loading');
        
        if (isImage) {
            const src = element.getAttribute('data-src');
            const srcset = element.getAttribute('data-srcset');
            
            if (src) {
                // Preload image
                const img = new Image();
                img.onload = () => {
                    element.src = src;
                    if (srcset) {
                        element.srcset = srcset;
                    }
                    this.onImageLoaded(element);
                };
                img.onerror = () => {
                    this.onImageError(element);
                };
                img.src = src;
            }
        } else if (isIframe) {
            const src = element.getAttribute('data-src');
            if (src) {
                element.src = src;
                this.onImageLoaded(element);
            }
        } else if (isSource) {
            const srcset = element.getAttribute('data-srcset');
            if (srcset) {
                element.srcset = srcset;
                
                // Trigger picture element to reload
                const picture = element.closest('picture');
                if (picture) {
                    const img = picture.querySelector('img');
                    if (img && img.getAttribute('data-src')) {
                        img.src = img.getAttribute('data-src');
                    }
                }
                this.onImageLoaded(element);
            }
        }
    }
    
    /**
     * Handle successful image load
     * @param {Element} element - Loaded element
     */
    onImageLoaded(element) {
        element.classList.remove('lazy-loading');
        element.classList.add('lazy-loaded');
        
        // Remove data attributes
        element.removeAttribute('data-src');
        element.removeAttribute('data-srcset');
        
        // Dispatch custom event
        const event = new CustomEvent('lazyloaded', {
            detail: { element }
        });
        element.dispatchEvent(event);
    }
    
    /**
     * Handle image load error
     * @param {Element} element - Failed element
     */
    onImageError(element) {
        element.classList.remove('lazy-loading');
        element.classList.add('lazy-error');
        
        // Set placeholder or error image
        const placeholder = element.getAttribute('data-placeholder');
        if (placeholder) {
            element.src = placeholder;
        }
        
        // Dispatch error event
        const event = new CustomEvent('lazyerror', {
            detail: { element }
        });
        element.dispatchEvent(event);
    }
    
    /**
     * Load all images immediately (fallback)
     */
    loadAllImages() {
        this.images.forEach(element => {
            this.loadImage(element);
        });
    }
    
    /**
     * Manually trigger lazy loading for new images
     * @param {Element|NodeList} elements - New images to lazy load
     */
    update(elements) {
        const newImages = elements instanceof NodeList ? 
            Array.from(elements) : [elements];
        
        newImages.forEach(image => {
            if (this.observer) {
                this.observer.observe(image);
            } else {
                this.loadImage(image);
            }
        });
    }
    
    /**
     * Stop observing and cleanup
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.images = [];
    }
}

/* ==================== BACKGROUND IMAGE LAZY LOADING ==================== */

class LazyBackground {
    constructor() {
        this.elements = [];
        this.observer = null;
        
        this.init();
    }
    
    init() {
        this.elements = document.querySelectorAll('[data-bg]');
        
        if (this.elements.length === 0) return;
        
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadBackground(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '200px 0px',
                threshold: 0.01
            });
            
            this.elements.forEach(el => this.observer.observe(el));
        } else {
            this.elements.forEach(el => this.loadBackground(el));
        }
    }
    
    loadBackground(element) {
        const bg = element.getAttribute('data-bg');
        if (bg) {
            element.style.backgroundImage = `url(${bg})`;
            element.classList.add('bg-loaded');
            element.removeAttribute('data-bg');
        }
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

/* ==================== VIDEO LAZY LOADING ==================== */

class LazyVideo {
    constructor() {
        this.videos = [];
        this.observer = null;
        
        this.init();
    }
    
    init() {
        this.videos = document.querySelectorAll('video[data-src]');
        
        if (this.videos.length === 0) return;
        
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadVideo(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '200px 0px',
                threshold: 0.01
            });
            
            this.videos.forEach(video => this.observer.observe(video));
        } else {
            this.videos.forEach(video => this.loadVideo(video));
        }
    }
    
    loadVideo(video) {
        const sources = video.querySelectorAll('source[data-src]');
        
        sources.forEach(source => {
            source.src = source.getAttribute('data-src');
            source.removeAttribute('data-src');
        });
        
        if (video.getAttribute('data-src')) {
            video.src = video.getAttribute('data-src');
            video.removeAttribute('data-src');
        }
        
        video.load();
        video.classList.add('lazy-loaded');
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

/* ==================== INITIALIZE ON PAGE LOAD ==================== */

let lazyLoader, lazyBackground, lazyVideo;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize lazy loaders
    lazyLoader = new LazyLoader();
    lazyBackground = new LazyBackground();
    lazyVideo = new LazyVideo();
});

/* ==================== EXPORT FOR MODULE USE ==================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LazyLoader, LazyBackground, LazyVideo };
}