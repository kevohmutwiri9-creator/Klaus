// ===== ENHANCED UI/UX FUNCTIONALITY =====
// Modern interactions and animations for improved user experience

// ===== TYPING ANIMATION =====
class TypingAnimation {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.typeSpeed = options.typeSpeed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseDelay = options.pauseDelay || 2000;
        this.loop = options.loop !== false;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
    }

    start() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isPaused) {
            setTimeout(() => {
                this.isPaused = false;
                this.isDeleting = true;
                this.delete();
            }, this.pauseDelay);
            return;
        }

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                
                if (!this.loop && this.currentTextIndex === 0) {
                    return;
                }
                
                setTimeout(() => this.type(), this.typeSpeed);
            } else {
                setTimeout(() => this.type(), this.deleteSpeed);
            }
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentText.length) {
                this.isPaused = true;
                this.type();
            } else {
                setTimeout(() => this.type(), this.typeSpeed);
            }
        }
    }
}

// ===== SMART NAVIGATION =====
class SmartNavigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.lastScrollY = window.scrollY;
        this.ticking = false;
        
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }

    onScroll() {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.handleScroll();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            if (currentScrollY > this.lastScrollY) {
                // Scrolling down - hide nav
                this.nav.classList.add('nav-hidden');
                this.nav.classList.remove('nav-visible');
            } else {
                // Scrolling up - show nav
                this.nav.classList.remove('nav-hidden');
                this.nav.classList.add('nav-visible');
            }
        } else {
            // At top - always show
            this.nav.classList.remove('nav-hidden');
            this.nav.classList.add('nav-visible');
        }
        
        this.lastScrollY = currentScrollY;
    }
}

// ===== TOAST NOTIFICATIONS =====
class ToastManager {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 4000) {
        const toast = this.createToast(message, type);
        this.container.appendChild(toast);
        
        setTimeout(() => {
            this.hide(toast);
        }, duration);
    }

    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getIcon(type);
        
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;
        
        return toast;
    }

    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ',
            warning: '⚠'
        };
        return icons[type] || icons.info;
    }

    hide(toast) {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

// ===== CUSTOM CURSOR =====
class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'cursor-dot';
        
        this.cursor.style.display = 'none';
        this.cursorDot.style.display = 'none';
        
        this.init();
    }

    init() {
        // Only enable on desktop
        if (window.matchMedia('(pointer: fine)').matches) {
            document.body.appendChild(this.cursor);
            document.body.appendChild(this.cursorDot);
            
            document.addEventListener('mousemove', (e) => this.move(e));
            document.addEventListener('mousedown', () => this.click());
            document.addEventListener('mouseup', () => this.release());
            
            // Add hover effects to interactive elements
            this.addHoverEffects();
        }
    }

    move(e) {
        this.cursor.style.display = 'block';
        this.cursorDot.style.display = 'block';
        
        this.cursor.style.left = e.clientX - 10 + 'px';
        this.cursor.style.top = e.clientY - 10 + 'px';
        
        this.cursorDot.style.left = e.clientX - 2 + 'px';
        this.cursorDot.style.top = e.clientY - 2 + 'px';
    }

    click() {
        this.cursor.style.transform = 'scale(0.8)';
    }

    release() {
        this.cursor.style.transform = 'scale(1)';
    }

    addHoverEffects() {
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .btn');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
            });
        });
    }
}

// ===== SCROLL REVEAL ANIMATIONS =====
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.scroll-reveal');
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => this.observer.observe(el));
    }
}

// ===== PARALLAX EFFECT =====
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.parallax-element');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }

    onScroll() {
        const scrollY = window.scrollY;
        
        this.elements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            const yPos = -(scrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ===== MAGNETIC BUTTONS =====
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.magnetic-btn');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => this.move(e, btn));
            btn.addEventListener('mouseleave', (e) => this.reset(e, btn));
        });
    }

    move(e, btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    }

    reset(e, btn) {
        btn.style.transform = 'translate(0, 0)';
    }
}

// ===== ENHANCED SEARCH =====
class EnhancedSearch {
    constructor() {
        this.searchInput = document.getElementById('siteSearch');
        this.searchResults = document.getElementById('searchResults');
        this.searchData = this.buildSearchData();
        
        if (this.searchInput) {
            this.init();
        }
    }

    buildSearchData() {
        const data = [];
        
        // Projects
        document.querySelectorAll('.project-card').forEach(card => {
            const title = card.querySelector('.project-title')?.textContent || '';
            const description = card.querySelector('.project-description')?.textContent || '';
            const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent);
            
            data.push({
                type: 'project',
                title,
                description,
                tags,
                element: card
            });
        });
        
        // Blog posts
        document.querySelectorAll('.blog-card').forEach(card => {
            const title = card.querySelector('.blog-title')?.textContent || '';
            const excerpt = card.querySelector('.blog-excerpt')?.textContent || '';
            const category = card.querySelector('.blog-category')?.textContent || '';
            
            data.push({
                type: 'blog',
                title,
                excerpt,
                category,
                element: card
            });
        });
        
        return data;
    }

    init() {
        this.searchInput.addEventListener('input', (e) => this.search(e.target.value));
        this.searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.searchResults.classList.remove('active');
            }
        });
        
        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.searchInput.focus();
            }
        });
    }

    search(query) {
        if (!query.trim()) {
            this.searchResults.classList.remove('active');
            return;
        }
        
        const results = this.searchData.filter(item => {
            const searchStr = `${item.title} ${item.description || ''} ${item.excerpt || ''} ${item.tags?.join(' ') || ''} ${item.category || ''}`.toLowerCase();
            return searchStr.includes(query.toLowerCase());
        });
        
        this.displayResults(results, query);
    }

    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
        } else {
            this.searchResults.innerHTML = results.map(item => `
                <div class="search-result-item" data-type="${item.type}">
                    <div class="result-type">${item.type}</div>
                    <div class="result-title">${this.highlightText(item.title, query)}</div>
                    <div class="result-description">${this.highlightText((item.description || item.excerpt || '').substring(0, 100), query)}</div>
                </div>
            `).join('');
            
            // Add click handlers
            this.searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    const result = results[index];
                    result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    result.element.classList.add('highlighted');
                    setTimeout(() => result.element.classList.remove('highlighted'), 2000);
                    this.searchResults.classList.remove('active');
                });
            });
        }
        
        this.searchResults.classList.add('active');
    }

    highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    handleKeydown(e) {
        const items = this.searchResults.querySelectorAll('.search-result-item');
        const currentIndex = Array.from(items).findIndex(item => item.classList.contains('focused'));
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            this.focusItem(items, nextIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            this.focusItem(items, prevIndex);
        } else if (e.key === 'Enter' && currentIndex >= 0) {
            e.preventDefault();
            items[currentIndex].click();
        } else if (e.key === 'Escape') {
            this.searchResults.classList.remove('active');
        }
    }

    focusItem(items, index) {
        items.forEach(item => item.classList.remove('focused'));
        items[index].classList.add('focused');
        items[index].scrollIntoView({ block: 'nearest' });
    }
}

// ===== 3D CARD EFFECT =====
class Card3DEffect {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleLeave(e, card));
        });
    }

    handleMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    }

    handleLeave(e, card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    }
}

// ===== LAZY LOADING ENHANCEMENT =====
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            this.images.forEach(img => this.observer.observe(img));
        } else {
            // Fallback for older browsers
            this.images.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
        
        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
        }
        
        img.classList.add('loaded');
    }
}

// ===== FORM VALIDATION ENHANCEMENT =====
class FormValidator {
    constructor(form) {
        this.form = form;
        this.inputs = form.querySelectorAll('input, textarea');
        this.init();
    }

    init() {
        this.inputs.forEach(input => {
            input.addEventListener('blur', () => this.validate(input));
            input.addEventListener('input', () => this.clearError(input));
        });
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validate(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (input.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (input.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (input.minLength && value.length < input.minLength) {
            isValid = false;
            errorMessage = `Minimum ${input.minLength} characters required`;
        }
        
        if (!isValid) {
            this.showError(input, errorMessage);
        }
        
        return isValid;
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showError(input, message) {
        input.classList.add('error');
        
        let errorElement = input.parentElement.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearError(input) {
        input.classList.remove('error');
        const errorElement = input.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    handleSubmit(e) {
        let isValid = true;
        
        this.inputs.forEach(input => {
            if (!this.validate(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
        }
    }
}

// ===== SKELETON LOADING =====
class SkeletonLoader {
    constructor(element, template) {
        this.element = element;
        this.template = template;
        this.showSkeleton();
    }

    showSkeleton() {
        this.element.innerHTML = this.template;
        this.element.classList.add('skeleton-loading');
    }

    hideSkeleton() {
        this.element.classList.remove('skeleton-loading');
    }

    setContent(content) {
        this.hideSkeleton();
        this.element.innerHTML = content;
    }
}

// ===== INFINITE SCROLL =====
class InfiniteScroll {
    constructor(options) {
        this.container = options.container;
        this.loadMore = options.loadMore;
        this.threshold = options.threshold || 100;
        this.loading = false;
        
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    }

    onScroll() {
        if (this.loading) return;
        
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (scrollY + windowHeight >= documentHeight - this.threshold) {
            this.loadMore();
        }
    }

    setLoading(loading) {
        this.loading = loading;
    }
}

// ===== THEME ENHANCEMENT =====
class ThemeEnhancer {
    constructor() {
        this.html = document.documentElement;
        this.themeToggles = document.querySelectorAll('.theme-toggle, .nav-sidebar-theme-toggle');
        this.init();
    }

    init() {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light');
        }
        
        // Listen for toggle clicks
        this.themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.toggleTheme());
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        this.html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle icons
        this.themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
        });
    }

    toggleTheme() {
        const currentTheme = this.html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// ===== SIDEBAR NAVIGATION =====
class SidebarNavigation {
    constructor() {
        this.sidebar = document.getElementById('navSidebar');
        this.links = document.querySelectorAll('.nav-sidebar-link');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    init() {
        // Active state on scroll
        this.initScrollSpy();
        
        // Smooth scroll
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }

    initScrollSpy() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -200px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    this.setActiveLink(id);
                }
            });
        }, observerOptions);

        this.sections.forEach(section => observer.observe(section));
    }

    setActiveLink(sectionId) {
        this.links.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
}

// ===== PERFORMANCE MONITOR =====
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Measure page load time
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            this.metrics.pageLoadTime = pageLoadTime;
            
            console.log('Page load time:', pageLoadTime + 'ms');
        });
        
        // Measure Core Web Vitals
        this.measureCoreWebVitals();
    }

    measureCoreWebVitals() {
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lcp = entries[entries.length - 1];
                this.metrics.lcp = lcp.startTime;
                console.log('LCP:', lcp.startTime);
            });
            
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const fid = list.getEntries()[0];
                this.metrics.fid = fid.processingStart - fid.startTime;
                console.log('FID:', this.metrics.fid);
            });
            
            fidObserver.observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                list.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.metrics.cls = clsValue;
                console.log('CLS:', clsValue);
            });
            
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    getMetrics() {
        return this.metrics;
    }
}

// ===== INITIALIZE ALL ENHANCEMENTS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize typing animation
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const typingAnimation = new TypingAnimation(typingElement, [
            'Full-Stack Developer & AI Engineer',
            'Building scalable web applications',
            'Creating intelligent solutions',
            'Exploring cutting-edge technologies'
        ], {
            typeSpeed: 50,
            deleteSpeed: 30,
            pauseDelay: 2000,
            loop: true
        });
        typingAnimation.start();
    }
    
    // Initialize smart navigation
    new SmartNavigation();
    
    // Initialize sidebar navigation
    new SidebarNavigation();
    
    // Initialize toast manager
    window.toastManager = new ToastManager();
    
    // Initialize custom cursor
    new CustomCursor();
    
    // Initialize scroll reveal
    new ScrollReveal();
    
    // Initialize parallax effect
    new ParallaxEffect();
    
    // Initialize magnetic buttons
    new MagneticButtons();
    
    // Initialize enhanced search
    new EnhancedSearch();
    
    // Initialize 3D card effect
    new Card3DEffect();
    
    // Initialize lazy loading
    new LazyLoader();
    
    // Initialize form validators
    document.querySelectorAll('form').forEach(form => {
        new FormValidator(form);
    });
    
    // Initialize theme enhancer
    new ThemeEnhancer();
    
    // Initialize performance monitor (in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        new PerformanceMonitor();
    }
    
    // Add scroll-reveal class to elements that should animate
    const animateElements = document.querySelectorAll('.project-card, .skill-category, .contact-item, .about-content, .about-image');
    animateElements.forEach(el => {
        el.classList.add('scroll-reveal');
    });
    
    // Add parallax class to floating elements
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, index) => {
        el.classList.add('parallax-element');
        el.dataset.speed = 0.2 + (index * 0.1);
    });
    
    // Add magnetic class to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(btn => {
        btn.classList.add('magnetic-btn');
    });
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1000);
    }
    
    // Enhanced smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add keyboard navigation hint
    let keyboardHintShown = false;
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k' && !keyboardHintShown) {
            keyboardHintShown = true;
            if (window.toastManager) {
                window.toastManager.show('Press Ctrl+K to search', 'info', 2000);
            }
        }
    });
});

// Export for use in other files
window.UIEnhancements = {
    TypingAnimation,
    ToastManager,
    SmartNavigation,
    SidebarNavigation,
    CustomCursor,
    ScrollReveal,
    ParallaxEffect,
    MagneticButtons,
    EnhancedSearch,
    Card3DEffect,
    LazyLoader,
    FormValidator,
    SkeletonLoader,
    InfiniteScroll,
    ThemeEnhancer,
    PerformanceMonitor
};