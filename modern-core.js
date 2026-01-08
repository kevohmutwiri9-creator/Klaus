/**
 * Modern Core Framework - Professional Portfolio Website
 * Enhanced with latest web standards, performance optimizations, and modern patterns
 * @author Klaus
 * @version 2.0.0
 */

class ModernPortfolioCore {
    constructor() {
        this.version = '2.0.0';
        this.isReady = false;
        this.modules = new Map();
        this.performance = {
            startTime: performance.now(),
            metrics: {}
        };
        
        // Modern feature detection
        this.features = {
            intersectionObserver: 'IntersectionObserver' in window,
            resizeObserver: 'ResizeObserver' in window,
            webp: this.supportsWebP(),
            darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            serviceWorker: 'serviceWorker' in navigator,
            pushNotifications: 'PushManager' in window,
            webAuthn: 'credentials' in navigator
        };

        this.init();
    }

    async init() {
        try {
            console.log(`🚀 Modern Portfolio Core v${this.version} initializing...`);
            
            // Initialize core systems
            await this.initializeCore();
            await this.initializeModules();
            await this.optimizePerformance();
            
            this.isReady = true;
            this.emit('core:ready');
            
            // Log performance metrics
            this.logPerformance();
            
        } catch (error) {
            console.error('❌ Core initialization failed:', error);
            this.handleCriticalError(error);
        }
    }

    async initializeCore() {
        // Modern theme system
        this.theme = new ModernThemeManager();
        
        // Enhanced performance monitoring
        this.performanceMonitor = new PerformanceMonitor();
        
        // Modern navigation
        this.navigation = new ModernNavigation();
        
        // Accessibility manager
        this.accessibility = new AccessibilityManager();
        
        // Error boundary
        this.errorBoundary = new ErrorBoundary();
    }

    async initializeModules() {
        const modules = [
            'animations',
            'lazyLoading', 
            'analytics',
            'search',
            'contact',
            'portfolio',
            'blog',
            'pwa'
        ];

        for (const moduleName of modules) {
            try {
                const module = await this.loadModule(moduleName);
                this.modules.set(moduleName, module);
                console.log(`✅ Module loaded: ${moduleName}`);
            } catch (error) {
                console.warn(`⚠️ Module ${moduleName} failed to load:`, error);
            }
        }
    }

    async loadModule(name) {
        const moduleMap = {
            animations: () => import('./modules/animations.js'),
            lazyLoading: () => import('./modules/lazy-loading.js'),
            analytics: () => import('./modules/analytics.js'),
            search: () => import('./modules/search.js'),
            contact: () => import('./modules/contact.js'),
            portfolio: () => import('./modules/portfolio.js'),
            blog: () => import('./modules/blog.js'),
            pwa: () => import('./modules/pwa.js')
        };

        if (moduleMap[name]) {
            const module = await moduleMap[name]();
            return new module.default();
        }
        
        throw new Error(`Module ${name} not found`);
    }

    async optimizePerformance() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Initialize lazy loading
        this.initializeLazyLoading();
        
        // Optimize images
        this.optimizeImages();
        
        // Enable resource hints
        this.addResourceHints();
    }

    preloadCriticalResources() {
        const criticalResources = [
            { href: '/fonts/inter-v12-latin-regular.woff2', as: 'font', type: 'font/woff2', crossorigin: true },
            { href: '/styles/critical.css', as: 'style' },
            { href: '/scripts/core.js', as: 'script' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            Object.assign(link, resource);
            document.head.appendChild(link);
        });
    }

    initializeLazyLoading() {
        if (!this.features.intersectionObserver) return;

        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" for modern browsers
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
            
            // Add error handling
            img.onerror = () => {
                img.src = '/img/placeholder.jpg';
                img.classList.add('error');
            };
        });
    }

    addResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: '//cdnjs.cloudflare.com' },
            { rel: 'preconnect', href: '//fonts.gstatic.com', crossorigin: true },
            { rel: 'preconnect', href: '//www.googletagmanager.com', crossorigin: true }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            Object.assign(link, hint);
            document.head.appendChild(link);
        });
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    handleCriticalError(error) {
        // Show user-friendly error message
        const errorUI = document.createElement('div');
        errorUI.className = 'critical-error';
        errorUI.innerHTML = `
            <div class="error-content">
                <h2>Oops! Something went wrong</h2>
                <p>We're having trouble loading the page. Please try refreshing.</p>
                <button onclick="window.location.reload()">Refresh Page</button>
            </div>
        `;
        document.body.appendChild(errorUI);
    }

    logPerformance() {
        const loadTime = performance.now() - this.performance.startTime;
        console.log(`📊 Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Log additional metrics
        if ('navigation' in performance) {
            const nav = performance.getEntriesByType('navigation')[0];
            console.log('🔍 Navigation metrics:', {
                domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
                loadComplete: nav.loadEventEnd - nav.loadEventStart,
                firstPaint: nav.responseStart - nav.requestStart
            });
        }
    }

    emit(event, data = {}) {
        document.dispatchEvent(new CustomEvent(event, { detail: data }));
    }

    on(event, callback) {
        document.addEventListener(event, callback);
    }
}

// Modern Theme Manager
class ModernThemeManager {
    constructor() {
        this.themes = ['light', 'dark', 'auto'];
        this.currentTheme = this.getStoredTheme() || 'auto';
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }

    getStoredTheme() {
        return localStorage.getItem('portfolio-theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('portfolio-theme', theme);
    }

    applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'auto') {
            const systemTheme = this.mediaQuery.matches ? 'dark' : 'light';
            root.setAttribute('data-theme', systemTheme);
        } else {
            root.setAttribute('data-theme', theme);
        }
        
        this.currentTheme = theme;
        this.setStoredTheme(theme);
    }

    setupEventListeners() {
        // Listen for system theme changes
        this.mediaQuery.addEventListener('change', (e) => {
            if (this.currentTheme === 'auto') {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });

        // Theme toggle button
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.applyTheme(this.themes[nextIndex]);
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observers = [];
        
        if ('PerformanceObserver' in window) {
            this.setupObservers();
        }
    }

    setupObservers() {
        // Core Web Vitals
        this.observeWebVitals();
        
        // Resource timing
        this.observeResources();
        
        // Long tasks
        this.observeLongTasks();
    }

    observeWebVitals() {
        const vitalsObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                switch (entry.entryType) {
                    case 'largest-contentful-paint':
                        this.metrics.lcp = entry.startTime;
                        break;
                    case 'first-input':
                        this.metrics.fid = entry.processingStart - entry.startTime;
                        break;
                    case 'layout-shift':
                        if (!entry.hadRecentInput) {
                            this.metrics.cls = (this.metrics.cls || 0) + entry.value;
                        }
                        break;
                }
            });
        });

        vitalsObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }

    observeResources() {
        const resourceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.transferSize > 0) {
                    console.log(`Resource loaded: ${entry.name} (${entry.transferSize} bytes)`);
                }
            });
        });

        resourceObserver.observe({ entryTypes: ['resource'] });
    }

    observeLongTasks() {
        const longTaskObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                console.warn(`Long task detected: ${entry.duration}ms`);
            });
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
}

// Modern Navigation
class ModernNavigation {
    constructor() {
        this.nav = document.querySelector('nav');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.setupScrollEffects();
    }

    setupEventListeners() {
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.nav.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    setupKeyboardNavigation() {
        const navItems = this.nav.querySelectorAll('a, button');
        
        navItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextItem = navItems[index + 1];
                        if (nextItem) nextItem.focus();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevItem = navItems[index - 1];
                        if (prevItem) prevItem.focus();
                        break;
                }
            });
        });
    }

    setupScrollEffects() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                this.nav.classList.add('nav-hidden');
            } else {
                this.nav.classList.remove('nav-hidden');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.nav.classList.toggle('nav-open', this.isOpen);
        this.menuToggle.setAttribute('aria-expanded', this.isOpen);
        
        if (this.isOpen) {
            this.menuToggle.focus();
        }
    }

    closeMenu() {
        this.isOpen = false;
        this.nav.classList.remove('nav-open');
        this.menuToggle.setAttribute('aria-expanded', 'false');
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.announcer = null;
        this.setupAnnouncer();
        this.setupFocusManagement();
        this.setupSkipLinks();
    }

    setupAnnouncer() {
        this.announcer = document.createElement('div');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.className = 'sr-only';
        document.body.appendChild(this.announcer);
    }

    announce(message) {
        if (this.announcer) {
            this.announcer.textContent = message;
            setTimeout(() => {
                this.announcer.textContent = '';
            }, 1000);
        }
    }

    setupFocusManagement() {
        // Focus trap for modals
        document.addEventListener('keydown', (e) => {
            const modal = document.querySelector('.modal[aria-hidden="false"]');
            if (modal && e.key === 'Tab') {
                this.trapFocus(e, modal);
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
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    setupSkipLinks() {
        const skipLinks = document.querySelectorAll('.skip-link');
        
        skipLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        });
    }
}

// Error Boundary
class ErrorBoundary {
    constructor() {
        this.errors = [];
        this.setupErrorHandlers();
    }

    setupErrorHandlers() {
        window.addEventListener('error', (e) => {
            this.handleError(e.error, e.filename, e.lineno, e.colno);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.handleError(e.reason, 'Promise', 0, 0);
        });
    }

    handleError(error, filename, lineno, colno) {
        const errorInfo = {
            message: error.message,
            filename,
            lineno,
            colno,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        this.errors.push(errorInfo);
        console.error('Error caught by boundary:', errorInfo);

        // Send to analytics if available
        if (window.gtag) {
            gtag('event', 'exception', {
                description: error.message,
                fatal: false
            });
        }
    }
}

// Initialize the modern core
const portfolio = new ModernPortfolioCore();

// Export for global access
window.ModernPortfolio = ModernPortfolioCore;
window.portfolio = portfolio;
