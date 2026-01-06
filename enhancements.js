// Enhanced JavaScript - Non-critical features loaded after core functionality
class Enhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupLightbox();
        this.setupAnimations();
        this.setupFormValidation();
        this.setupSearch();
        this.setupKeyboardNavigation();
        this.setupPrintStyles();
    }

    setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const closeLightbox = document.querySelector('.close-lightbox');

        if (!lightbox || !lightboxImg) return;

        // Open lightbox when clicking on images with data-lightbox attribute
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-lightbox]')) {
                const img = e.target;
                const caption = img.dataset.caption || img.alt || '';
                
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxCaption.textContent = caption;
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                // Focus management
                lightbox.setAttribute('tabindex', '-1');
                lightbox.focus();
            }
        });

        // Close lightbox
        const closeLightboxFn = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        };

        if (closeLightbox) {
            closeLightbox.addEventListener('click', closeLightboxFn);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightboxFn();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                if (e.key === 'Escape') {
                    closeLightboxFn();
                }
            }
        });
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('[data-animate]').forEach(el => {
            animationObserver.observe(el);
        });

        // Add animation classes dynamically
        this.addAnimationClasses();
    }

    addAnimationClasses() {
        const animations = ['fade-in-up', 'fade-in', 'slide-in-left', 'slide-in-right'];
        
        document.querySelectorAll('.section-title, .project-card, .skill-card, .about-text').forEach((el, index) => {
            const animation = animations[index % animations.length];
            el.setAttribute('data-animate', animation);
            el.style.opacity = '0';
        });
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${fieldName} is required`;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Min length validation
        if (field.hasAttribute('minlength') && value) {
            const minLength = parseInt(field.getAttribute('minlength'));
            if (value.length < minLength) {
                isValid = false;
                errorMessage = `${fieldName} must be at least ${minLength} characters`;
            }
        }

        this.showFieldError(field, errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);

        if (message) {
            field.classList.add('error');
            
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.setAttribute('role', 'alert');
            
            field.parentNode.appendChild(errorElement);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        if (!searchInput) return;

        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                this.hideSearchResults();
                return;
            }

            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                this.hideSearchResults();
            }
        });
    }

    performSearch(query) {
        const searchableElements = document.querySelectorAll('h1, h2, h3, p, .project-title, .skill-name');
        const results = [];

        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                results.push({
                    element: element,
                    text: element.textContent,
                    url: this.getElementUrl(element)
                });
            }
        });

        this.displaySearchResults(results, query);
    }

    getElementUrl(element) {
        // Find the nearest section with an ID
        let parent = element.closest('section[id]');
        if (parent) {
            return `#${parent.id}`;
        }
        
        // If no section, try to find any parent with an ID
        parent = element.closest('[id]');
        if (parent) {
            return `#${parent.id}`;
        }
        
        return '#';
    }

    displaySearchResults(results, query) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
        } else {
            const html = results.map(result => `
                <div class="search-result">
                    <a href="${result.url}" class="search-result-link">
                        <div class="search-result-text">${this.highlightText(result.text, query)}</div>
                    </a>
                </div>
            `).join('');
            
            searchResults.innerHTML = html;
        }

        searchResults.style.display = 'block';
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    hideSearchResults() {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    setupKeyboardNavigation() {
        // Tab trapping for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const lightbox = document.getElementById('lightbox');
                if (lightbox && lightbox.style.display === 'block') {
                    this.trapFocus(e, lightbox);
                }
            }
        });
    }

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    setupPrintStyles() {
        const printButton = document.getElementById('printButton');
        if (printButton) {
            printButton.addEventListener('click', () => {
                window.print();
            });
        }

        // Add print-specific styles
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                .navbar, .back-to-top, .loading-screen, .lightbox {
                    display: none !important;
                }
                body {
                    font-size: 12pt;
                    line-height: 1.4;
                }
                .section {
                    page-break-inside: avoid;
                }
                .project-card, .skill-card {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
            }
        `;
        document.head.appendChild(printStyles);
    }

    // Utility methods
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                window.core.announceToScreenReader('Text copied to clipboard');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            window.core.announceToScreenReader('Text copied to clipboard');
        }
    }
}

// Initialize enhancements after core functionality
document.addEventListener('DOMContentLoaded', () => {
    // Load enhancements after a small delay to prioritize core functionality
    setTimeout(() => {
        window.enhancements = new Enhancements();
    }, 100);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Enhancements;
}
