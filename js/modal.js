/* ==================== MODAL / POPUP ==================== */

class Modal {
    constructor(element, options = {}) {
        this.modal = element;
        this.isOpen = false;
        this.focusedElementBeforeOpen = null;
        this.focusableElements = [];
        
        // Default options
        this.options = {
            closeOnBackdrop: true,
            closeOnEsc: true,
            showCloseButton: true,
            backdrop: true,
            backdropClass: 'modal__backdrop',
            animation: 'fade',
            animationDuration: 300,
            onOpen: null,
            onClose: null,
            ...options
        };
        
        this.init();
    }
    
    /**
     * Initialize modal
     */
    init() {
        if (!this.modal) {
            console.error('Modal element not found');
            return;
        }
        
        // Add ARIA attributes
        this.modal.setAttribute('role', 'dialog');
        this.modal.setAttribute('aria-modal', 'true');
        this.modal.setAttribute('aria-hidden', 'true');
        
        // Create backdrop
        if (this.options.backdrop) {
            this.createBackdrop();
        }
        
        // Create close button
        if (this.options.showCloseButton) {
            this.createCloseButton();
        }
        
        // Setup event listeners
        this.setupEvents();
        
        // Find focusable elements
        this.updateFocusableElements();
    }
    
    /**
     * Create backdrop element
     */
    createBackdrop() {
        this.backdrop = document.createElement('div');
        this.backdrop.className = this.options.backdropClass;
        this.backdrop.setAttribute('data-modal-backdrop', '');
        
        // Insert backdrop before modal
        this.modal.parentNode.insertBefore(this.backdrop, this.modal);
    }
    
    /**
     * Create close button
     */
    createCloseButton() {
        // Check if close button already exists
        let closeBtn = this.modal.querySelector('[data-modal-close]');
        
        if (!closeBtn) {
            closeBtn = document.createElement('button');
            closeBtn.className = 'modal__close';
            closeBtn.setAttribute('data-modal-close', '');
            closeBtn.setAttribute('aria-label', 'Close modal');
            closeBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            `;
            
            // Add to modal
            const modalContent = this.modal.querySelector('.modal__content');
            if (modalContent) {
                modalContent.appendChild(closeBtn);
            } else {
                this.modal.appendChild(closeBtn);
            }
        }
        
        this.closeButton = closeBtn;
    }
    
    /**
     * Setup event listeners
     */
    setupEvents() {
        // Close button click
        const closeBtns = this.modal.querySelectorAll('[data-modal-close]');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });
        
        // Backdrop click
        if (this.backdrop && this.options.closeOnBackdrop) {
            this.backdrop.addEventListener('click', () => this.close());
        }
        
        // ESC key
        if (this.options.closeOnEsc) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
        
        // Trap focus inside modal
        this.modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.trapFocus(e);
            }
        });
    }
    
    /**
     * Update list of focusable elements
     */
    updateFocusableElements() {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');
        
        this.focusableElements = Array.from(
            this.modal.querySelectorAll(focusableSelectors)
        );
    }
    
    /**
     * Trap focus inside modal
     * @param {Event} e - Keyboard event
     */
    trapFocus(e) {
        if (this.focusableElements.length === 0) return;
        
        const firstElement = this.focusableElements[0];
        const lastElement = this.focusableElements[this.focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
    
    /**
     * Open modal
     */
    open() {
        if (this.isOpen) return;
        
        // Store currently focused element
        this.focusedElementBeforeOpen = document.activeElement;
        
        // Update focusable elements
        this.updateFocusableElements();
        
        // Add classes
        this.modal.classList.add('modal--open');
        if (this.backdrop) {
            this.backdrop.classList.add('backdrop--open');
        }
        
        // Add animation class
        if (this.options.animation) {
            this.modal.classList.add(`modal--${this.options.animation}`);
        }
        
        // Update ARIA
        this.modal.setAttribute('aria-hidden', 'false');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
        
        // Focus first element
        setTimeout(() => {
            if (this.focusableElements.length > 0) {
                this.focusableElements[0].focus();
            } else {
                this.modal.focus();
            }
        }, this.options.animationDuration);
        
        this.isOpen = true;
        
        // Callback
        if (typeof this.options.onOpen === 'function') {
            this.options.onOpen(this);
        }
        
        // Dispatch event
        this.dispatchEvent('modalOpen');
    }
    
    /**
     * Close modal
     */
    close() {
        if (!this.isOpen) return;
        
        // Remove classes
        this.modal.classList.remove('modal--open');
        if (this.backdrop) {
            this.backdrop.classList.remove('backdrop--open');
        }
        
        // Update ARIA
        this.modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
        
        // Restore focus
        if (this.focusedElementBeforeOpen) {
            this.focusedElementBeforeOpen.focus();
        }
        
        this.isOpen = false;
        
        // Callback
        if (typeof this.options.onClose === 'function') {
            this.options.onClose(this);
        }
        
        // Dispatch event
        this.dispatchEvent('modalClose');
    }
    
    /**
     * Toggle modal
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    /**
     * Update modal content
     * @param {String|Element} content - New content
     */
    setContent(content) {
        const contentArea = this.modal.querySelector('.modal__body') || this.modal;
        
        if (typeof content === 'string') {
            contentArea.innerHTML = content;
        } else if (content instanceof Element) {
            contentArea.innerHTML = '';
            contentArea.appendChild(content);
        }
        
        // Update focusable elements
        this.updateFocusableElements();
    }
    
    /**
     * Dispatch custom event
     * @param {String} eventName - Event name
     * @param {Object} detail - Event detail
     */
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: {
                modal: this,
                ...detail
            }
        });
        this.modal.dispatchEvent(event);
    }
    
    /**
     * Destroy modal
     */
    destroy() {
        // Close if open
        if (this.isOpen) {
            this.close();
        }
        
        // Remove backdrop
        if (this.backdrop) {
            this.backdrop.remove();
        }
        
        // Remove close button
        if (this.closeButton) {
            this.closeButton.remove();
        }
        
        // Remove classes
        this.modal.classList.remove('modal--open');
        this.modal.removeAttribute('role');
        this.modal.removeAttribute('aria-modal');
        this.modal.removeAttribute('aria-hidden');
    }
}

/* ==================== MODAL MANAGER ==================== */

class ModalManager {
    constructor() {
        this.modals = new Map();
        this.init();
    }
    
    /**
     * Initialize all modals
     */
    init() {
        // Find all modal elements
        const modalElements = document.querySelectorAll('[data-modal]');
        
        modalElements.forEach(element => {
            const id = element.id || `modal-${this.modals.size}`;
            const modal = new Modal(element);
            this.modals.set(id, modal);
        });
        
        // Setup trigger buttons
        this.setupTriggers();
    }
    
    /**
     * Setup modal trigger buttons
     */
    setupTriggers() {
        const triggers = document.querySelectorAll('[data-modal-open]');
        
        triggers.forEach(trigger => {
            const targetId = trigger.getAttribute('data-modal-open');
            
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.open(targetId);
            });
        });
    }
    
    /**
     * Open modal by ID
     * @param {String} id - Modal ID
     */
    open(id) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.open();
        }
    }
    
    /**
     * Close modal by ID
     * @param {String} id - Modal ID
     */
    close(id) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.close();
        }
    }
    
    /**
     * Close all modals
     */
    closeAll() {
        this.modals.forEach(modal => modal.close());
    }
    
    /**
     * Get modal by ID
     * @param {String} id - Modal ID
     * @returns {Modal}
     */
    get(id) {
        return this.modals.get(id);
    }
    
    /**
     * Create dynamic modal
     * @param {Object} options - Modal options
     * @returns {Modal}
     */
    create(options = {}) {
        const {
            id = `modal-${Date.now()}`,
            title = '',
            content = '',
            size = 'medium',
            ...modalOptions
        } = options;
        
        // Create modal HTML
        const modalHTML = `
            <div id="${id}" class="modal modal--${size}" data-modal>
                <div class="modal__dialog">
                    <div class="modal__content">
                        ${title ? `<div class="modal__header"><h3 class="modal__title">${title}</h3></div>` : ''}
                        <div class="modal__body">${content}</div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert into DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Get element
        const element = document.getElementById(id);
        
        // Create modal instance
        const modal = new Modal(element, modalOptions);
        this.modals.set(id, modal);
        
        return modal;
    }
    
    /**
     * Destroy modal by ID
     * @param {String} id - Modal ID
     */
    destroy(id) {
        const modal = this.modals.get(id);
        if (modal) {
            modal.destroy();
            this.modals.delete(id);
        }
    }
}

/* ==================== CONFIRM DIALOG ==================== */

function confirmDialog(message, options = {}) {
    return new Promise((resolve) => {
        const {
            title = 'Confirm',
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            confirmClass = 'btn btn--primary',
            cancelClass = 'btn btn--secondary'
        } = options;
        
        const content = `
            <p style="margin-bottom: 1.5rem;">${message}</p>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="${cancelClass}" data-confirm-cancel>${cancelText}</button>
                <button class="${confirmClass}" data-confirm-ok>${confirmText}</button>
            </div>
        `;
        
        const modal = modalManager.create({
            title,
            content,
            size: 'small',
            closeOnBackdrop: false,
            closeOnEsc: false
        });
        
        modal.open();
        
        // Handle buttons
        const confirmBtn = modal.modal.querySelector('[data-confirm-ok]');
        const cancelBtn = modal.modal.querySelector('[data-confirm-cancel]');
        
        confirmBtn.addEventListener('click', () => {
            modal.close();
            setTimeout(() => modal.destroy(), 300);
            resolve(true);
        });
        
        cancelBtn.addEventListener('click', () => {
            modal.close();
            setTimeout(() => modal.destroy(), 300);
            resolve(false);
        });
    });
}

/* ==================== ALERT DIALOG ==================== */

function alertDialog(message, options = {}) {
    return new Promise((resolve) => {
        const {
            title = 'Alert',
            buttonText = 'OK',
            buttonClass = 'btn btn--primary'
        } = options;
        
        const content = `
            <p style="margin-bottom: 1.5rem;">${message}</p>
            <div style="display: flex; justify-content: flex-end;">
                <button class="${buttonClass}" data-alert-ok>${buttonText}</button>
            </div>
        `;
        
        const modal = modalManager.create({
            title,
            content,
            size: 'small'
        });
        
        modal.open();
        
        // Handle button
        const okBtn = modal.modal.querySelector('[data-alert-ok]');
        
        okBtn.addEventListener('click', () => {
            modal.close();
            setTimeout(() => modal.destroy(), 300);
            resolve();
        });
    });
}

/* ==================== INITIALIZE ON PAGE LOAD ==================== */

let modalManager;

document.addEventListener('DOMContentLoaded', () => {
    modalManager = new ModalManager();
});

/* ==================== EXPORT FOR MODULE USE ==================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Modal, ModalManager, confirmDialog, alertDialog };
}