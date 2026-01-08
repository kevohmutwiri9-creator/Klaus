/**
 * Modern Portfolio Core - Simplified & Fast Loading
 * @author Klaus
 * @version 2.0.0
 */

class ModernPortfolioCore {
    constructor() {
        this.version = '2.0.0';
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
        
        console.log('✅ Portfolio initialized successfully');
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
            if (!nav.contains(e.target) && navMenu.classList.contains('nav-open')) {
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
        const nav = document.querySelector('.nav');
        
        window.addEventListener('scroll', () => {
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
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ModernPortfolioCore();
    });
} else {
    new ModernPortfolioCore();
}
