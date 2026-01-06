// Comprehensive Accessibility Enhancement System
class AccessibilityManager {
    constructor() {
        this.announcer = null;
        this.focusTrapElements = [];
        this.skipLinks = [];
        this.keyboardUsers = false;
        this.init();
    }

    init() {
        this.setupAnnouncer();
        this.setupSkipLinks();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLabels();
        this.setupScreenReaderSupport();
        this.setupColorContrast();
        this.setupReducedMotion();
        this.setupHighContrast();
        this.detectKeyboardUser();
    }

    setupAnnouncer() {
        // Create screen reader announcer
        this.announcer = document.createElement('div');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.className = 'sr-only accessibility-announcer';
        this.announcer.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(this.announcer);
    }

    setupSkipLinks() {
        // Create skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: var(--bg-primary);
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            z-index: 10000;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content id if it doesn't exist
        const mainContent = document.querySelector('main') || document.querySelector('.section-hero');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }

        this.skipLinks.push(skipLink);
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for all interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        
        interactiveElements.forEach(element => {
            // Ensure all interactive elements have focus styles
            if (!element.style.outline) {
                element.style.outline = '2px solid var(--primary-color)';
                element.style.outlineOffset = '2px';
            }

            // Add keyboard event listeners
            element.addEventListener('keydown', (e) => this.handleKeyboardEvents(e, element));
        });

        // Handle Tab key navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.keyboardUsers = true;
                document.body.classList.add('keyboard-user');
            }
        });

        // Handle mouse usage
        document.addEventListener('mousedown', () => {
            this.keyboardUsers = false;
            document.body.classList.remove('keyboard-user');
        });
    }

    handleKeyboardEvents(event, element) {
        switch (event.key) {
            case 'Enter':
            case ' ':
                if (element.tagName === 'BUTTON' || (element.tagName === 'A' && element.href)) {
                    return; // Let default behavior handle these
                }
                if (element.role === 'button' || element.classList.contains('card')) {
                    event.preventDefault();
                    element.click();
                    this.announceToScreenReader(`${element.textContent} activated`);
                }
                break;

            case 'Escape':
                this.handleEscapeKey(element);
                break;

            case 'ArrowUp':
            case 'ArrowDown':
                if (element.role === 'menu' || element.classList.contains('dropdown')) {
                    event.preventDefault();
                    this.handleArrowKeyNavigation(event, element);
                }
                break;
        }
    }

    handleEscapeKey(element) {
        // Close modals, dropdowns, etc.
        const modal = element.closest('.modal, .lightbox, .dropdown-menu');
        if (modal) {
            const closeButton = modal.querySelector('.close, [aria-label="Close"]');
            if (closeButton) {
                closeButton.click();
                this.announceToScreenReader('Modal closed');
            }
        }
    }

    handleArrowKeyNavigation(event, element) {
        const items = element.querySelectorAll('[role="menuitem"], .dropdown-item');
        const currentIndex = Array.from(items).findIndex(item => item === document.activeElement);
        
        let newIndex;
        if (event.key === 'ArrowDown') {
            newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        } else {
            newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        }
        
        if (items[newIndex]) {
            items[newIndex].focus();
            this.announceToScreenReader(items[newIndex].textContent);
        }
    }

    setupFocusManagement() {
        // Focus trap for modals and lightboxes
        const modals = document.querySelectorAll('.modal, .lightbox');
        modals.forEach(modal => {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.trapFocus(e, modal);
                }
            });
        });

        // Manage focus for dynamic content
        this.observeFocusChanges();
    }

    trapFocus(event, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    observeFocusChanges() {
        // Announce focus changes for better context
        document.addEventListener('focusin', (e) => {
            const element = e.target;
            const label = this.getElementLabel(element);
            
            if (label && this.keyboardUsers) {
                setTimeout(() => {
                    this.announceToScreenReader(`Focused on ${label}`);
                }, 100);
            }
        }, true);
    }

    setupAriaLabels() {
        // Add comprehensive ARIA labels
        this.enhanceNavigationLabels();
        this.enhanceFormLabels();
        this.enhanceImageLabels();
        this.enhanceLinkLabels();
        this.enhanceButtonLabels();
    }

    enhanceNavigationLabels() {
        const nav = document.querySelector('nav');
        if (nav && !nav.getAttribute('aria-label')) {
            nav.setAttribute('aria-label', 'Main navigation');
        }

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            if (!link.getAttribute('aria-label')) {
                const label = link.textContent.trim();
                link.setAttribute('aria-label', `${label} navigation item ${index + 1}`);
            }
        });
    }

    enhanceFormLabels() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (!form.getAttribute('aria-label')) {
                form.setAttribute('aria-label', this.getFormPurpose(form));
            }
        });

        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            this.ensureInputLabel(input);
        });
    }

    ensureInputLabel(input) {
        // Check if input already has a label
        const hasLabel = document.querySelector(`label[for="${input.id}"]`) || 
                        input.getAttribute('aria-label') || 
                        input.getAttribute('aria-labelledby');
        
        if (!hasLabel) {
            const placeholder = input.getAttribute('placeholder');
            const name = input.getAttribute('name');
            
            if (placeholder) {
                input.setAttribute('aria-label', placeholder);
            } else if (name) {
                input.setAttribute('aria-label', name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
            }
        }

        // Add required indicator
        if (input.hasAttribute('required') && !input.getAttribute('aria-required')) {
            input.setAttribute('aria-required', 'true');
        }
    }

    enhanceImageLabels() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.alt && !img.getAttribute('role')) {
                // Try to infer alt text from context
                const parentText = img.parentElement?.textContent?.trim();
                const figcaption = img.nextElementSibling?.tagName === 'FIGCAPTION' ? 
                    img.nextElementSibling.textContent : '';
                
                if (figcaption) {
                    img.alt = figcaption;
                } else if (parentText && parentText.length < 100) {
                    img.alt = parentText;
                } else {
                    img.alt = 'Decorative image';
                    img.setAttribute('role', 'presentation');
                }
            }
        });
    }

    enhanceLinkLabels() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            // Ensure links have descriptive text
            if (link.textContent.trim() === '' && !link.getAttribute('aria-label')) {
                const href = link.getAttribute('href');
                if (href) {
                    link.setAttribute('aria-label', `Link to ${href}`);
                }
            }

            // Add external link indicators
            if (link.hostname !== window.location.hostname && !link.getAttribute('aria-label')?.includes('external')) {
                link.setAttribute('aria-label', `${link.textContent} (opens in new window)`);
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    enhanceButtonLabels() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label') && button.textContent.trim() === '') {
                // Try to infer button purpose from icons or classes
                const icon = button.querySelector('i, svg');
                if (icon) {
                    const iconClass = icon.className || icon.getAttribute('data-icon');
                    const label = this.getIconLabel(iconClass);
                    if (label) {
                        button.setAttribute('aria-label', label);
                    }
                }
            }
        });
    }

    getIconLabel(iconClass) {
        const iconLabels = {
            'fa-close': 'Close',
            'fa-times': 'Close',
            'fa-menu': 'Menu',
            'fa-bars': 'Menu',
            'fa-search': 'Search',
            'fa-download': 'Download',
            'fa-arrow-right': 'Next',
            'fa-arrow-left': 'Previous',
            'fa-chevron-up': 'Expand',
            'fa-chevron-down': 'Collapse'
        };

        for (const [className, label] of Object.entries(iconLabels)) {
            if (iconClass.includes(className)) {
                return label;
            }
        }
        
        return null;
    }

    setupScreenReaderSupport() {
        // Add landmarks for better navigation
        this.addLandmarks();
        
        // Enhance headings structure
        this.enhanceHeadings();
        
        // Add live regions for dynamic content
        this.addLiveRegions();
    }

    addLandmarks() {
        const landmarks = [
            { selector: 'header', role: 'banner' },
            { selector: 'nav', role: 'navigation' },
            { selector: 'main', role: 'main' },
            { selector: 'aside', role: 'complementary' },
            { selector: 'footer', role: 'contentinfo' }
        ];

        landmarks.forEach(({ selector, role }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!element.getAttribute('role')) {
                    element.setAttribute('role', role);
                }
            });
        });
    }

    enhanceHeadings() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            // Ensure headings have meaningful content
            if (heading.textContent.trim() === '') {
                heading.setAttribute('aria-hidden', 'true');
            }
        });

        // Check heading hierarchy
        this.validateHeadingHierarchy();
    }

    validateHeadingHierarchy() {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        let previousLevel = 0;
        
        headings.forEach(heading => {
            const currentLevel = parseInt(heading.tagName.charAt(1));
            
            if (currentLevel > previousLevel + 1) {
                console.warn('Heading hierarchy issue: Found h' + currentLevel + ' after h' + previousLevel);
            }
            
            previousLevel = currentLevel;
        });
    }

    addLiveRegions() {
        // Add live regions for form validation messages
        const formStatusElements = document.querySelectorAll('.form-status, .error-message, .success-message');
        formStatusElements.forEach(element => {
            if (!element.getAttribute('aria-live')) {
                element.setAttribute('aria-live', 'polite');
                element.setAttribute('aria-atomic', 'true');
            }
        });
    }

    setupColorContrast() {
        // Check and improve color contrast
        this.checkColorContrast();
        
        // Add high contrast mode support
        this.supportHighContrastMode();
    }

    checkColorContrast() {
        // Basic contrast checking for important elements
        const importantElements = document.querySelectorAll('h1, h2, h3, .btn, .nav-link');
        
        importantElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            // This is a simplified check - in production, you'd use a proper contrast calculation
            if (this.isLowContrast(color, backgroundColor)) {
                console.warn('Low contrast detected:', element);
                element.style.textShadow = '1px 1px 1px rgba(0,0,0,0.5)';
            }
        });
    }

    isLowContrast(color1, color2) {
        // Simplified contrast check
        // In production, use WCAG contrast ratio calculation
        return color1 === color2 || 
               (color1.includes('rgb(224, 224, 224)') && color2.includes('rgb(10, 10, 10)'));
    }

    supportHighContrastMode() {
        // Add styles for high contrast mode
        const style = document.createElement('style');
        style.textContent = `
            @media (prefers-contrast: high) {
                .btn, .nav-link, .card {
                    border: 2px solid currentColor;
                }
                
                img {
                    filter: contrast(1.2);
                }
                
                *:focus {
                    outline: 3px solid currentColor;
                    outline-offset: 2px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupReducedMotion() {
        // Respect user's motion preferences
        const style = document.createElement('style');
        style.textContent = `
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupHighContrast() {
        // Add high contrast toggle functionality
        const highContrastToggle = document.createElement('button');
        highContrastToggle.textContent = 'Toggle High Contrast';
        highContrastToggle.className = 'accessibility-toggle';
        highContrastToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            background: var(--primary-color);
            color: var(--bg-primary);
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
        `;

        highContrastToggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isActive = document.body.classList.contains('high-contrast');
            this.announceToScreenReader(`High contrast mode ${isActive ? 'enabled' : 'disabled'}`);
        });

        document.body.appendChild(highContrastToggle);
    }

    detectKeyboardUser() {
        // Detect if user is navigating with keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.keyboardUsers = true;
                document.body.classList.add('keyboard-user');
            }
        });

        document.addEventListener('mousedown', () => {
            this.keyboardUsers = false;
            document.body.classList.remove('keyboard-user');
        });
    }

    getFormPurpose(form) {
        const formId = form.id;
        const formClass = form.className;
        
        if (formClass.includes('contact')) return 'Contact form';
        if (formClass.includes('newsletter')) return 'Newsletter subscription form';
        if (formClass.includes('search')) return 'Search form';
        if (formId === 'contactForm') return 'Contact form';
        if (formId === 'newsletterForm') return 'Newsletter subscription form';
        
        return 'Form';
    }

    announceToScreenReader(message) {
        if (this.announcer) {
            this.announcer.textContent = message;
            
            // Clear the message after a delay
            setTimeout(() => {
                this.announcer.textContent = '';
            }, 1000);
        }
    }

    getElementLabel(element) {
        // Try various methods to get element label
        if (element.getAttribute('aria-label')) {
            return element.getAttribute('aria-label');
        }
        
        if (element.getAttribute('title')) {
            return element.getAttribute('title');
        }
        
        if (element.textContent.trim()) {
            return element.textContent.trim();
        }
        
        if (element.alt) {
            return element.alt;
        }
        
        if (element.placeholder) {
            return element.placeholder;
        }
        
        return 'Interactive element';
    }

    // Public API methods
    announce(message) {
        this.announceToScreenReader(message);
    }

    focusElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.focus();
            this.announceToScreenReader(`Focused on ${this.getElementLabel(element)}`);
        }
    }

    enableHighContrast() {
        document.body.classList.add('high-contrast');
        this.announceToScreenReader('High contrast mode enabled');
    }

    disableHighContrast() {
        document.body.classList.remove('high-contrast');
        this.announceToScreenReader('High contrast mode disabled');
    }
}

// Initialize accessibility manager
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityManager = new AccessibilityManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
}
