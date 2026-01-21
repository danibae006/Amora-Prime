/* ==================== ANIMATIONS CONTROLLER ==================== */

class AnimationsController {
    constructor() {
        this.counters = document.querySelectorAll('.stat__number');
        this.scrollRevealElements = document.querySelectorAll('[data-aos]');
        this.floatingCards = document.querySelectorAll('.floating-card');
        
        this.hasAnimated = new Set();
        
        this.init();
    }

    init() {
        this.initAOS();
        this.setupScrollAnimations();
        this.initCounters();
        this.initFloatingCards();
        this.initParallaxEffect();
    }

    /**
     * Initialize AOS (Animate On Scroll) library
     */
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: CONFIG.aos.duration || 800,
                delay: CONFIG.aos.delay || 100,
                offset: CONFIG.aos.offset || 120,
                easing: CONFIG.aos.easing || 'ease-out-cubic',
                once: CONFIG.aos.once !== undefined ? CONFIG.aos.once : true,
                mirror: CONFIG.aos.mirror || false,
                anchorPlacement: 'top-bottom',
            });
        }
    }

    /**
     * Setup custom scroll animations
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements with scroll-reveal class
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Initialize counter animations
     */
    initCounters() {
        if (this.counters.length === 0) return;

        const observerOptions = {
            threshold: 0.5
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.hasAnimated.add(entry.target);
                }
            });
        }, observerOptions);

        this.counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    /**
     * Animate a single counter
     * @param {Element} element - Counter element
     */
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = CONFIG.counter.duration || 2000;
        const startDelay = CONFIG.counter.startDelay || 200;

        setTimeout(() => {
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                
                if (current >= target) {
                    element.textContent = target;
                } else {
                    element.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                }
            };

            updateCounter();
        }, startDelay);
    }

    /**
     * Initialize floating cards animation
     */
    initFloatingCards() {
        this.floatingCards.forEach((card, index) => {
            // Add random animation delay
            const delay = index * 0.5;
            card.style.animationDelay = `${delay}s`;
        });
    }

    /**
     * Initialize parallax scrolling effect
     */
    initParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length === 0) return;

        const handleParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };

        window.addEventListener('scroll', Utils.throttle(handleParallax, 10));
    }

    /**
     * Animate gradient orbs
     */
    animateGradientOrbs() {
        const orbs = document.querySelectorAll('.gradient-orb');
        
        orbs.forEach((orb, index) => {
            const duration = 15 + (index * 5);
            orb.style.animation = `float ${duration}s ease-in-out infinite`;
            orb.style.animationDelay = `${index * 2}s`;
        });
    }

    /**
     * Create ripple effect on click
     * @param {Event} e - Click event
     */
    createRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');

        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Stagger animation for multiple elements
     * @param {NodeList} elements - Elements to animate
     * @param {String} animationClass - Animation class to add
     * @param {Number} delay - Delay between each element
     */
    staggerAnimation(elements, animationClass, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, index * delay);
        });
    }

    /**
     * Entrance animation for page load
     */
    pageEntranceAnimation() {
        const heroContent = document.querySelector('.hero__content');
        const heroVisual = document.querySelector('.hero__visual');

        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                heroContent.style.transition = 'all 0.8s ease-out';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }

        if (heroVisual) {
            heroVisual.style.opacity = '0';
            heroVisual.style.transform = 'translateX(30px)';
            
            setTimeout(() => {
                heroVisual.style.transition = 'all 0.8s ease-out 0.3s';
                heroVisual.style.opacity = '1';
                heroVisual.style.transform = 'translateX(0)';
            }, 100);
        }
    }

    /**
     * Typewriter effect
     * @param {Element} element - Element to animate
     * @param {String} text - Text to type
     * @param {Number} speed - Typing speed in milliseconds
     */
    typewriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };

        type();
    }

    /**
     * Shake element animation
     * @param {Element} element - Element to shake
     */
    shake(element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }

    /**
     * Pulse element animation
     * @param {Element} element - Element to pulse
     */
    pulse(element) {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 1000);
    }

    /**
     * Fade in element
     * @param {Element} element - Element to fade in
     * @param {Number} duration - Animation duration
     */
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.transition = `opacity ${duration}ms`;
            element.style.opacity = '1';
        }, 10);
    }

    /**
     * Fade out element
     * @param {Element} element - Element to fade out
     * @param {Number} duration - Animation duration
     */
    fadeOut(element, duration = 300) {
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    /**
     * Slide in element
     * @param {Element} element - Element to slide in
     * @param {String} direction - Direction to slide from (top, bottom, left, right)
     */
    slideIn(element, direction = 'bottom') {
        const transforms = {
            top: 'translateY(-100%)',
            bottom: 'translateY(100%)',
            left: 'translateX(-100%)',
            right: 'translateX(100%)'
        };

        element.style.transform = transforms[direction];
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.transition = 'transform 0.4s ease-out';
            element.style.transform = 'translateY(0) translateX(0)';
        }, 10);
    }

    /**
     * Create particle effect
     * @param {Element} container - Container element
     * @param {Number} count - Number of particles
     */
    createParticles(container, count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Utils.random(3, 8);
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Utils.random(0, 100)}%`;
            particle.style.animationDelay = `${Utils.random(0, 3000)}ms`;
            particle.style.animationDuration = `${Utils.random(3000, 6000)}ms`;
            
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 6000);
        }
    }

    /**
     * Scroll progress indicator
     */
    initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #8B5CF6, #EC4899);
            z-index: 9999;
            transition: width 0.2s ease-out;
        `;
        document.body.appendChild(progressBar);

        const updateProgress = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${progress}%`;
        };

        window.addEventListener('scroll', Utils.throttle(updateProgress, 50));
    }

    /**
     * Magnetic button effect
     * @param {Element} button - Button element
     */
    magneticButton(button) {
        const strength = 20;

        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    }

    /**
     * Initialize hover tilt effect
     * @param {NodeList} elements - Elements to apply tilt effect
     */
    initTiltEffect(elements) {
        elements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animations = new AnimationsController();
    
    // Add page entrance animation
    animations.pageEntranceAnimation();
    
    // Initialize scroll progress (optional)
    if (CONFIG.features && CONFIG.features.scrollProgress) {
        animations.initScrollProgress();
    }
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn-ripple, .btn--primary').forEach(button => {
        button.addEventListener('click', (e) => animations.createRipple(e));
    });
    
    // Add magnetic effect to buttons (optional)
    document.querySelectorAll('.btn--magnetic').forEach(button => {
        animations.magneticButton(button);
    });
    
    // Add tilt effect to service cards
    const serviceCards = document.querySelectorAll('.service__card');
    if (serviceCards.length > 0) {
        animations.initTiltEffect(serviceCards);
    }
});