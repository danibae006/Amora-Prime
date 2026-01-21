/* ==================== SLIDER / CAROUSEL ==================== */

class Slider {
    constructor(element, options = {}) {
        this.slider = element;
        this.slides = null;
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.isAnimating = false;
        this.autoplayInterval = null;
        
        // Default options
        this.options = {
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 3000,
            infinite: true,
            dots: true,
            arrows: true,
            draggable: true,
            swipeThreshold: 50,
            speed: 300,
            easing: 'ease-out',
            pauseOnHover: true,
            responsive: [],
            ...options
        };
        
        this.init();
    }
    
    /**
     * Initialize slider
     */
    init() {
        if (!this.slider) {
            console.error('Slider element not found');
            return;
        }
        
        // Get slides
        this.track = this.slider.querySelector('.slider__track');
        this.slides = this.slider.querySelectorAll('.slider__slide');
        this.totalSlides = this.slides.length;
        
        if (this.totalSlides === 0) {
            console.error('No slides found');
            return;
        }
        
        // Setup
        this.setupSlider();
        this.createControls();
        this.setupEvents();
        
        // Show first slide
        this.goToSlide(0);
        
        // Start autoplay
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }
    
    /**
     * Setup slider structure
     */
    setupSlider() {
        // Add classes
        this.slider.classList.add('slider--initialized');
        
        // Set initial positions
        this.slides.forEach((slide, index) => {
            slide.style.transition = `transform ${this.options.speed}ms ${this.options.easing}`;
            slide.setAttribute('data-index', index);
        });
        
        // Clone slides for infinite loop
        if (this.options.infinite) {
            this.cloneSlides();
        }
    }
    
    /**
     * Clone first and last slides for infinite effect
     */
    cloneSlides() {
        const firstClone = this.slides[0].cloneNode(true);
        const lastClone = this.slides[this.totalSlides - 1].cloneNode(true);
        
        firstClone.classList.add('slider__slide--clone');
        lastClone.classList.add('slider__slide--clone');
        
        this.track.appendChild(firstClone);
        this.track.insertBefore(lastClone, this.slides[0]);
    }
    
    /**
     * Create navigation controls
     */
    createControls() {
        // Arrows
        if (this.options.arrows) {
            this.createArrows();
        }
        
        // Dots
        if (this.options.dots) {
            this.createDots();
        }
    }
    
    /**
     * Create arrow buttons
     */
    createArrows() {
        const prevArrow = document.createElement('button');
        prevArrow.className = 'slider__arrow slider__arrow--prev';
        prevArrow.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
        `;
        prevArrow.setAttribute('aria-label', 'Previous slide');
        
        const nextArrow = document.createElement('button');
        nextArrow.className = 'slider__arrow slider__arrow--next';
        nextArrow.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        `;
        nextArrow.setAttribute('aria-label', 'Next slide');
        
        this.slider.appendChild(prevArrow);
        this.slider.appendChild(nextArrow);
        
        this.prevArrow = prevArrow;
        this.nextArrow = nextArrow;
        
        // Event listeners
        prevArrow.addEventListener('click', () => this.prev());
        nextArrow.addEventListener('click', () => this.next());
    }
    
    /**
     * Create dot indicators
     */
    createDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider__dots';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider__dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        
        this.slider.appendChild(dotsContainer);
        this.dots = dotsContainer.querySelectorAll('.slider__dot');
    }
    
    /**
     * Setup event listeners
     */
    setupEvents() {
        // Keyboard navigation
        this.slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prev();
            } else if (e.key === 'ArrowRight') {
                this.next();
            }
        });
        
        // Pause on hover
        if (this.options.pauseOnHover && this.options.autoplay) {
            this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
            this.slider.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        // Touch/Drag events
        if (this.options.draggable) {
            this.setupDragEvents();
        }
        
        // Responsive breakpoints
        if (this.options.responsive.length > 0) {
            window.addEventListener('resize', () => this.handleResize());
        }
    }
    
    /**
     * Setup drag/swipe functionality
     */
    setupDragEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        const handleStart = (e) => {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            this.track.style.cursor = 'grabbing';
        };
        
        const handleMove = (e) => {
            if (!isDragging) return;
            
            currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            const diff = currentX - startX;
            
            // Visual feedback
            this.track.style.transform = `translateX(${diff}px)`;
        };
        
        const handleEnd = (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            this.track.style.cursor = 'grab';
            
            const diff = currentX - startX;
            
            // Determine direction
            if (Math.abs(diff) > this.options.swipeThreshold) {
                if (diff > 0) {
                    this.prev();
                } else {
                    this.next();
                }
            } else {
                // Reset position
                this.goToSlide(this.currentSlide);
            }
        };
        
        // Mouse events
        this.track.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        
        // Touch events
        this.track.addEventListener('touchstart', handleStart, { passive: true });
        this.track.addEventListener('touchmove', handleMove, { passive: true });
        this.track.addEventListener('touchend', handleEnd);
    }
    
    /**
     * Go to specific slide
     * @param {Number} index - Slide index
     */
    goToSlide(index) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentSlide = index;
        
        // Calculate position
        const slideWidth = this.slides[0].offsetWidth;
        const offset = -index * slideWidth;
        
        // Move track
        this.track.style.transform = `translateX(${offset}px)`;
        
        // Update active states
        this.updateActiveStates();
        
        // Reset animation lock
        setTimeout(() => {
            this.isAnimating = false;
            
            // Handle infinite loop
            if (this.options.infinite) {
                this.handleInfiniteLoop();
            }
        }, this.options.speed);
        
        // Dispatch event
        this.dispatchEvent('slideChange', { currentSlide: this.currentSlide });
    }
    
    /**
     * Go to next slide
     */
    next() {
        let nextSlide = this.currentSlide + this.options.slidesToScroll;
        
        if (nextSlide >= this.totalSlides) {
            if (this.options.infinite) {
                nextSlide = 0;
            } else {
                nextSlide = this.totalSlides - 1;
            }
        }
        
        this.goToSlide(nextSlide);
    }
    
    /**
     * Go to previous slide
     */
    prev() {
        let prevSlide = this.currentSlide - this.options.slidesToScroll;
        
        if (prevSlide < 0) {
            if (this.options.infinite) {
                prevSlide = this.totalSlides - 1;
            } else {
                prevSlide = 0;
            }
        }
        
        this.goToSlide(prevSlide);
    }
    
    /**
     * Update active states for slides and dots
     */
    updateActiveStates() {
        // Update slides
        this.slides.forEach((slide, index) => {
            if (index === this.currentSlide) {
                slide.classList.add('slider__slide--active');
            } else {
                slide.classList.remove('slider__slide--active');
            }
        });
        
        // Update dots
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                if (index === this.currentSlide) {
                    dot.classList.add('slider__dot--active');
                } else {
                    dot.classList.remove('slider__dot--active');
                }
            });
        }
    }
    
    /**
     * Handle infinite loop transition
     */
    handleInfiniteLoop() {
        if (this.currentSlide >= this.totalSlides) {
            this.currentSlide = 0;
            this.track.style.transition = 'none';
            this.goToSlide(0);
            setTimeout(() => {
                this.track.style.transition = `transform ${this.options.speed}ms ${this.options.easing}`;
            }, 50);
        } else if (this.currentSlide < 0) {
            this.currentSlide = this.totalSlides - 1;
            this.track.style.transition = 'none';
            this.goToSlide(this.totalSlides - 1);
            setTimeout(() => {
                this.track.style.transition = `transform ${this.options.speed}ms ${this.options.easing}`;
            }, 50);
        }
    }
    
    /**
     * Start autoplay
     */
    startAutoplay() {
        if (this.autoplayInterval) return;
        
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, this.options.autoplaySpeed);
    }
    
    /**
     * Stop autoplay
     */
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    /**
     * Handle responsive breakpoints
     */
    handleResize() {
        const windowWidth = window.innerWidth;
        
        this.options.responsive.forEach(breakpoint => {
            if (windowWidth <= breakpoint.breakpoint) {
                Object.assign(this.options, breakpoint.settings);
            }
        });
        
        this.goToSlide(this.currentSlide);
    }
    
    /**
     * Dispatch custom event
     * @param {String} eventName - Event name
     * @param {Object} detail - Event detail data
     */
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: {
                slider: this,
                ...detail
            }
        });
        this.slider.dispatchEvent(event);
    }
    
    /**
     * Destroy slider
     */
    destroy() {
        // Stop autoplay
        this.stopAutoplay();
        
        // Remove controls
        if (this.prevArrow) this.prevArrow.remove();
        if (this.nextArrow) this.nextArrow.remove();
        if (this.dots) this.dots.forEach(dot => dot.remove());
        
        // Remove classes
        this.slider.classList.remove('slider--initialized');
        
        // Reset styles
        this.track.style.transform = '';
        this.slides.forEach(slide => {
            slide.style.transition = '';
            slide.classList.remove('slider__slide--active');
        });
    }
}

/* ==================== INITIALIZE SLIDERS ==================== */

document.addEventListener('DOMContentLoaded', () => {
    // Auto-initialize sliders with data-slider attribute
    const sliders = document.querySelectorAll('[data-slider]');
    
    sliders.forEach(sliderElement => {
        const options = {
            autoplay: sliderElement.dataset.autoplay === 'true',
            autoplaySpeed: parseInt(sliderElement.dataset.autoplaySpeed) || 3000,
            infinite: sliderElement.dataset.infinite !== 'false',
            dots: sliderElement.dataset.dots !== 'false',
            arrows: sliderElement.dataset.arrows !== 'false',
        };
        
        new Slider(sliderElement, options);
    });
});

/* ==================== EXPORT FOR MODULE USE ==================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Slider;
}