/**
 * Modern Portfolio Core - Enhanced with All Features
 * @author Klaus
 * @version 3.0.0
 */

class ModernPortfolioCore {
    constructor() {
        this.version = '3.0.0';
        this.init();
    }

    init() {
        console.log(`🚀 Modern Portfolio v${this.version} loading...`);
        
        // Remove loading screen immediately
        this.removeLoadingScreen();
        
        // Initialize core features
        this.initializeTheme();
        this.initializeNavigation();
        this.initializeAnimations();
        this.initializeScrollEffects();
        this.initializeBackToTop();
        this.initializeFormHandling();
        this.initializeMicroInteractions();
        this.initializeToastNotifications();
        this.initializeParallaxEffects();
        this.initializeMagneticButtons();
        this.initializeLazyLoading();
        
        // NEW: Initialize enhanced features
        this.initializeSearch();
        this.initializeReadingProgress();
        this.initializeNewsletter();
        this.initializeCurrentYear();
        this.initializeMobileMenu();
        this.initializeProjectFiltering();
        this.initializeEnhancedValidation();
        this.initializePerformanceMonitoring();
        this.initializeAccessibility();
        this.initializeErrorHandling();
        this.initializeImageOptimization();
        
        console.log('✅ All features initialized successfully!');
    }

    // NEW: Search functionality
    initializeSearch() {
        const searchInput = document.getElementById('siteSearch');
        const searchBtn = document.getElementById('searchBtn');
        const searchResults = document.getElementById('searchResults');
        
        if (!searchInput) return;
        
        const searchData = [
            { title: 'About Me', url: '#about', description: 'Learn more about my background and expertise' },
            { title: 'Projects', url: '#projects', description: 'View my featured projects and portfolio' },
            { title: 'Skills', url: '#skills', description: 'Explore my technical skills and expertise' },
            { title: 'Contact', url: '#contact', description: 'Get in touch with me' },
            { title: 'Blog', url: 'blog.html', description: 'Read my latest articles and insights' },
            { title: 'Tutorials', url: 'tutorials.html', description: 'Step-by-step guides and tutorials' },
            { title: 'Resume', url: 'resume.html', description: 'Download my resume' }
        ];
        
        const performSearch = (query) => {
            const results = searchData.filter(item => 
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase())
            );
            
            this.displaySearchResults(results, query);
        };
        
        this.displaySearchResults = (results, query) => {
            if (!searchResults) return;
            
            if (query.length < 2) {
                searchResults.classList.remove('active');
                return;
            }
            
            if (results.length === 0) {
                searchResults.innerHTML = `
                    <div class="search-result-item">
                        <div class="search-result-title">No results found</div>
                        <div class="search-result-description">Try searching for projects, skills, or contact</div>
                    </div>
                `;
            } else {
                searchResults.innerHTML = results.map(item => `
                    <div class="search-result-item" onclick="window.location.href='${item.url}'">
                        <div class="search-result-title">${item.title}</div>
                        <div class="search-result-description">${item.description}</div>
                    </div>
                `).join('');
            }
            
            searchResults.classList.add('active');
        };
        
        // Event listeners
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
        
        searchInput.addEventListener('input', debounce((e) => {
            performSearch(e.target.value);
        }, 300));
        
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    }

    // NEW: Reading progress bar
    initializeReadingProgress() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;
        
        const updateProgress = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        };
        
        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial call
    }

    // NEW: Newsletter signup
    initializeNewsletter() {
        const newsletterForm = document.getElementById('newsletterForm');
        const newsletterStatus = document.getElementById('newsletterStatus');
        
        if (!newsletterForm) return;
        
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (!this.validateEmail(email)) {
                this.showValidationMessage(newsletterStatus, 'Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate newsletter signup
            this.showValidationMessage(newsletterStatus, 'Subscribing...', 'success');
            
            setTimeout(() => {
                this.showValidationMessage(newsletterStatus, 'Successfully subscribed! 🎉', 'success');
                newsletterForm.reset();
                
                // Track newsletter signup
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        event_category: 'engagement',
                        event_label: 'footer_newsletter'
                    });
                }
            }, 1500);
        });
    }

    // NEW: Auto-update current year
    initializeCurrentYear() {
        const currentYearElement = document.getElementById('currentYear');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        }
    }

    // NEW: Mobile menu toggle
    initializeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (!mobileMenuToggle || !navMenu) return;
        
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
            mobileMenuToggle.innerHTML = isExpanded ? '<span>✕</span>' : '<span>☰</span>';
        });
        
        // Close mobile menu when clicking on a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.innerHTML = '<span>☰</span>';
            });
        });
    }

    // NEW: Project filtering
    initializeProjectFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (filterButtons.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        setTimeout(() => card.style.opacity = '1', 10);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });
            });
        });
    }

    // NEW: Enhanced form validation
    initializeEnhancedValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('.form-input, .form-textarea');
            
            inputs.forEach(input => {
                // Real-time validation
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    if (input.parentElement.classList.contains('error')) {
                        this.validateField(input);
                    }
                });
            });
        });
    }

    validateField(field) {
        const formGroup = field.parentElement;
        const value = field.value.trim();
        let isValid = true;
        let message = '';
        
        // Email validation
        if (field.type === 'email') {
            if (!this.validateEmail(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        }
        
        // Message validation
        if (field.id === 'message' && value.length < 10) {
            isValid = false;
            message = 'Message must be at least 10 characters';
        }
        
        // Update UI
        if (isValid) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
            this.hideValidationMessage(formGroup);
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            this.showValidationMessage(formGroup, message, 'error');
        }
        
        return isValid;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showValidationMessage(container, message, type) {
        const existingMessage = container.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.textContent = message;
            existingMessage.className = `validation-message ${type}`;
        } else {
            const messageElement = document.createElement('div');
            messageElement.className = `validation-message ${type}`;
            messageElement.textContent = message;
            container.appendChild(messageElement);
        }
    }

    hideValidationMessage(container) {
        const message = container.querySelector('.validation-message');
        if (message) {
            message.style.display = 'none';
        }
    }

    // NEW: Performance monitoring
    initializePerformanceMonitoring() {
        // Track page load time
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    event_category: 'performance',
                    value: Math.round(loadTime)
                });
            }
            
            console.log(`⚡ Page loaded in ${loadTime}ms`);
        });
        
        // Track Core Web Vitals
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log(`🎨 LCP: ${entry.startTime}ms`);
                    }
                    if (entry.entryType === 'first-input') {
                        console.log(`⚡ FID: ${entry.processingStart - entry.startTime}ms`);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
        }
    }

    // NEW: Accessibility enhancements
    initializeAccessibility() {
        // Add keyboard navigation for search
        const searchInput = document.getElementById('siteSearch');
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    document.getElementById('searchResults').classList.remove('active');
                    searchInput.blur();
                }
            });
        }
        
        // Add focus management for mobile menu
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    mobileMenuToggle.click();
                }
            });
        }
        
        // Announce page changes to screen readers
        this.announceToScreenReader = (message) => {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            document.body.appendChild(announcement);
            setTimeout(() => document.body.removeChild(announcement), 1000);
        };
    }

    // NEW: Error handling
    initializeErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
            
            // Track errors
            if (typeof gtag !== 'undefined') {
                gtag('event', 'javascript_error', {
                    event_category: 'error',
                    event_label: e.error.message,
                    custom_map: { 'dimension1': e.filename, 'dimension2': e.lineno }
                });
            }
            
            // Show user-friendly error message
            this.showToast('Something went wrong. Please refresh the page.', 'error');
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'promise_rejection', {
                    event_category: 'error',
                    event_label: e.reason.toString()
                });
            }
        });
    }

    removeLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }

    initializeTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const savedTheme = localStorage.getItem('portfolio-theme') || 'auto';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const theme = savedTheme === 'dark' || (savedTheme === 'auto' && prefersDark) ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
        });
    }

    initializeNavigation() {
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('navMenu');
        if (!menuToggle || !navMenu) return;

        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('nav-open');
            const isOpen = navMenu.classList.contains('nav-open');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('nav-open')) {
                navMenu.classList.remove('nav-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('nav-open')) {
                navMenu.classList.remove('nav-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    initializeAnimations() {
        // Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('[data-animation]').forEach(el => {
                observer.observe(el);
            });
        }
    }

    initializeScrollEffects() {
        let lastScroll = 0;
        let ticking = false;
        const nav = document.querySelector('.nav');
        
        const updateScrollEffects = () => {
            const currentScroll = window.pageYOffset;
            
            // Hide/show navigation on scroll
            if (nav) {
                if (currentScroll > lastScroll && currentScroll > 100) {
                    nav.classList.add('nav-hidden');
                } else {
                    nav.classList.remove('nav-hidden');
                }
            }
            
            lastScroll = currentScroll;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }, { passive: true });
    }

    initializeBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    initializeFormHandling() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simple form submission (you can enhance this)
            console.log('Form submitted:', data);
            
            // Show success message
            this.showNotification('Message sent successfully!', 'success');
            contactForm.reset();
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Enhanced UI/UX Methods
    initializeMicroInteractions() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                this.appendChild(ripple);
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Add loading states to forms
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                }
            });
        });
    }
    
    initializeToastNotifications() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.className = 'toast-container';
        document.body.appendChild(this.toastContainer);
    }
    
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        this.toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    initializeParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length === 0) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.speed) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }
    
    initializeMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.magnetic-btn');
        
        magneticButtons.forEach(button => {
            let ticking = false;
            
            const updateMagneticEffect = (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                ticking = false;
            };
            
            button.addEventListener('mousemove', (e) => {
                if (!ticking) {
                    requestAnimationFrame(() => updateMagneticEffect(e));
                    ticking = true;
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    // Smooth scroll for anchor links
    initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Lazy loading for images
    initializeLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Load the image if it has data-src
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                img.classList.add('loaded');
            });
        }
    }
    
    // Enhanced scroll effects (renamed to avoid conflict)
    initializeScrollReveal() {
        const scrollElements = document.querySelectorAll('.scroll-reveal');
        
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });
        
        scrollElements.forEach(element => {
            elementObserver.observe(element);
        });
    }

    // NEW: Image optimization and lazy loading
    initializeImageOptimization() {
        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Add loaded class when image loads
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });
                        
                        // Handle image errors
                        img.addEventListener('error', () => {
                            img.classList.add('error');
                            console.warn(`Failed to load image: ${img.src}`);
                        });
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            // Observe all lazyload images
            document.querySelectorAll('.lazyload').forEach(img => {
                imageObserver.observe(img);
            });
        }
        
        // Add image error handling for all images
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('onerror')) {
                img.addEventListener('error', () => {
                    img.classList.add('error');
                    console.warn(`Image failed to load: ${img.src}`);
                });
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ModernPortfolioCore();
    });
} else {
    new ModernPortfolioCore();
}
