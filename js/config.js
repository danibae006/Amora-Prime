/* ==================== CONFIGURATION ==================== */

const CONFIG = {
    // Site Information
    site: {
        name: 'AmoraPrime',
        tagline: 'Innovative Digital Solutions',
        description: 'Premium Web Development, AI Solutions, and Digital Innovation Services',
        url: 'https://amoraprime.com',
        email: 'hello@amoraprime.com',
        phone: '+1 (234) 567-890',
    },

    // Social Media Links
    social: {
        facebook: 'https://facebook.com/amoraprime',
        instagram: 'https://instagram.com/amoraprime',
        linkedin: 'https://linkedin.com/company/amoraprime',
        twitter: 'https://twitter.com/amoraprime',
        github: 'https://github.com/amoraprime',
    },

    // Theme Settings
    theme: {
        defaultTheme: 'system', // 'light', 'dark', or 'system'
        enableTransitions: true,
        animationDuration: 300,
    },

    // Animation Settings
    animations: {
        enabled: true,
        duration: 600,
        delay: 100,
        easing: 'ease-out',
    },

    // Scroll Settings
    scroll: {
        offset: 80, // Header height offset
        smooth: true,
        duration: 800,
    },

    // AOS (Animate On Scroll) Settings
    aos: {
        duration: 800,
        delay: 100,
        offset: 120,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false,
    },

    // Counter Animation Settings
    counter: {
        duration: 2000,
        startDelay: 200,
    },

    // Form Settings
    forms: {
        validateOnBlur: true,
        validateOnSubmit: true,
        showErrorMessages: true,
    },

    // API Endpoints (if needed)
    api: {
        contact: '/api/contact',
        newsletter: '/api/newsletter',
        portfolio: '/api/portfolio',
    },

    // Feature Flags
    features: {
        darkMode: true,
        newsletter: true,
        blog: true,
        animations: true,
        lazyLoading: true,
    },

    // Performance Settings
    performance: {
        lazyLoadImages: true,
        lazyLoadOffset: 200,
        deferNonCriticalCSS: false,
    },

    // SEO Settings
    seo: {
        keywords: ['web development', 'AI solutions', 'custom software', 'digital innovation'],
        author: 'AmoraPrime Team',
        twitterCard: 'summary_large_image',
        ogType: 'website',
    },
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}