/* ==================== CONTACT FORM HANDLER ==================== */

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitButton = null;
        this.originalButtonHTML = '';

        this.init();
    }

    init() {
        if (!this.form) return;

        this.submitButton = this.form.querySelector('[type="submit"]');
        this.originalButtonHTML = this.submitButton.innerHTML;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation on blur
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            
            // Remove error on input
            field.addEventListener('input', () => this.removeFieldError(field));
        });
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        const required = field.hasAttribute('required');

        let isValid = true;
        let errorMessage = '';

        // Skip validation for hidden fields
        if (field.type === 'hidden' || name === '_honey') {
            return true;
        }

        // Required field check
        if (required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (name === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (name === 'phone' && value) {
            const digits = value.replace(/\D/g, '');
            if (digits.length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number (minimum 10 digits)';
            }
        }

        // Service selection
        if (name === 'service' && required && !value) {
            isValid = false;
            errorMessage = 'Please select a service';
        }

        // Message length
        if (name === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Please provide more details (minimum 10 characters)';
        }

        // Show/hide error
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.removeFieldError(field);
        }

        return isValid;
    }

    /**
     * Show field error message
     */
    showFieldError(field, message) {
        this.removeFieldError(field);

        field.classList.add('error');

        const error = document.createElement('span');
        error.className = 'field-error';
        error.textContent = message;

        field.parentElement.appendChild(error);
    }

    /**
     * Remove field error
     */
    removeFieldError(field) {
        field.classList.remove('error');

        const error = field.parentElement.querySelector('.field-error');
        if (error) error.remove();
    }

    /**
     * Handle form submission
     */
    handleSubmit(e) {
        // Validate all fields
        const fields = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // If validation fails, prevent submission
        if (!isValid) {
            e.preventDefault();

            this.showNotification('Please fix the errors in the form', 'error');

            // Scroll to first error
            const firstError = this.form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }

            return;
        }

        // ✅ VALID — Set loading state and allow native POST to FormSubmit
        this.setLoadingState(true);
        
        // Form will submit normally to FormSubmit
    }

    /**
     * Set loading state on submit button
     */
    setLoadingState(loading) {
        if (loading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = `
                <span>Sending Message...</span>
                <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 20px; height: 20px;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            `;
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = this.originalButtonHTML;
        }
    }

    /**
     * Show notification
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
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});