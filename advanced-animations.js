// Advanced Animation System
class AdvancedAnimations {
    constructor() {
        this.animations = new Map();
        this.observers = [];
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadingAnimations();
        this.setupMicroInteractions();
        this.setupPageTransitions();
        this.setupParticleEffects();
        this.setupMorphingAnimations();
    }

    setupIntersectionObserver() {
        // Observe elements for scroll-triggered animations
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe elements with animation classes
        document.querySelectorAll('[data-animate]').forEach(el => {
            animationObserver.observe(el);
        });

        this.observers.push(animationObserver);
    }

    setupScrollAnimations() {
        let ticking = false;
        
        const updateScrollAnimations = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollBasedAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', updateScrollAnimations, { passive: true });
    }

    setupHoverAnimations() {
        // Enhanced hover effects for interactive elements
        document.querySelectorAll('.btn, .card, .project-card, .tutorial-card').forEach(element => {
            this.addHoverEffect(element);
        });

        // Magnetic cursor effect
        this.setupMagneticCursor();
    }

    setupLoadingAnimations() {
        // Skeleton loading animations
        this.createSkeletonLoader();
        
        // Progress indicators
        this.setupProgressIndicators();
        
        // Staggered loading animations
        this.setupStaggeredLoading();
    }

    setupMicroInteractions() {
        // Button ripple effects
        this.setupRippleEffect();
        
        // Form field animations
        this.setupFormFieldAnimations();
        
        // Notification animations
        this.setupNotificationAnimations();
    }

    setupPageTransitions() {
        // Page transition effects
        this.setupPageTransition();
        
        // Route change animations
        this.setupRouteTransitions();
    }

    setupParticleEffects() {
        // Background particle system
        this.createParticleSystem();
        
        // Interactive particles on mouse move
        this.setupInteractiveParticles();
    }

    setupMorphingAnimations() {
        // Shape morphing effects
        this.setupShapeMorphing();
        
        // Text morphing animations
        this.setupTextMorphing();
    }

    triggerAnimation(element) {
        const animationType = element.dataset.animate;
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
            element.classList.add('animated', animationType);
            
            // Add animation end listener
            element.addEventListener('animationend', () => {
                element.classList.add('animation-complete');
            }, { once: true });
        }, delay);
    }

    updateScrollBasedAnimations() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Parallax effects
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const rect = element.getBoundingClientRect();
            
            if (rect.bottom >= 0 && rect.top <= windowHeight) {
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            }
        });

        // Progress indicators
        document.querySelectorAll('[data-scroll-progress]').forEach(element => {
            const rect = element.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
            element.style.setProperty('--scroll-progress', progress);
        });
    }

    addHoverEffect(element) {
        element.addEventListener('mouseenter', (e) => {
            if (this.isReducedMotion) return;
            
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            element.style.setProperty('--mouse-x', `${x}px`);
            element.style.setProperty('--mouse-y', `${y}px`);
            
            element.classList.add('hover-active');
        });

        element.addEventListener('mouseleave', () => {
            element.classList.remove('hover-active');
        });
    }

    setupMagneticCursor() {
        const magneticElements = document.querySelectorAll('[data-magnetic]');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                if (this.isReducedMotion) return;
                
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const strength = parseFloat(element.dataset.magnetic) || 0.3;
                
                element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }

    createSkeletonLoader() {
        const skeletonHTML = `
            <div class="skeleton-loader">
                <div class="skeleton-header"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-line"></div>
                </div>
            </div>
        `;

        // Add skeleton CSS if not present
        if (!document.querySelector('#skeleton-styles')) {
            const style = document.createElement('style');
            style.id = 'skeleton-styles';
            style.textContent = `
                .skeleton-loader {
                    padding: 1rem;
                    background: var(--bg-secondary);
                    border-radius: 8px;
                }
                
                .skeleton-header {
                    height: 40px;
                    background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--border-color) 50%, var(--bg-tertiary) 75%);
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s infinite;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                }
                
                .skeleton-line {
                    height: 16px;
                    background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--border-color) 50%, var(--bg-tertiary) 75%);
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s infinite;
                    border-radius: 4px;
                    margin-bottom: 0.5rem;
                }
                
                .skeleton-line.short {
                    width: 60%;
                }
                
                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupProgressIndicators() {
        document.querySelectorAll('[data-progress]').forEach(element => {
            const progress = parseFloat(element.dataset.progress) || 0;
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar-fill';
            progressBar.style.width = '0%';
            
            element.appendChild(progressBar);
            
            // Animate progress after a short delay
            setTimeout(() => {
                progressBar.style.width = `${progress}%`;
            }, 100);
        });
    }

    setupStaggeredLoading() {
        document.querySelectorAll('[data-stagger]').forEach(container => {
            const items = container.children;
            const delay = parseFloat(container.dataset.stagger) || 100;
            
            Array.from(items).forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * delay);
            });
        });
    }

    setupRippleEffect() {
        document.querySelectorAll('.btn, .ripple-effect').forEach(element => {
            element.addEventListener('click', (e) => {
                if (this.isReducedMotion) return;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                
                const rect = element.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                element.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    setupFormFieldAnimations() {
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
            const label = field.previousElementSibling;
            
            if (label && label.tagName === 'LABEL') {
                field.addEventListener('focus', () => {
                    label.classList.add('focused');
                });
                
                field.addEventListener('blur', () => {
                    if (!field.value) {
                        label.classList.remove('focused');
                    }
                });
                
                // Check initial state
                if (field.value) {
                    label.classList.add('focused');
                }
            }
        });
    }

    setupNotificationAnimations() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('notification')) {
                        node.classList.add('notification-enter');
                        
                        setTimeout(() => {
                            node.classList.remove('notification-enter');
                            node.classList.add('notification-enter-active');
                        }, 10);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true });
    }

    setupPageTransition() {
        // Add page transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);

        // Handle page navigation
        document.querySelectorAll('a[href]').forEach(link => {
            if (link.hostname === window.location.hostname) {
                link.addEventListener('click', (e) => {
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        this.transitionToPage(link.href);
                    }
                });
            }
        });
    }

    transitionToPage(url) {
        const overlay = document.querySelector('.page-transition-overlay');
        
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    setupRouteTransitions() {
        // Listen for route changes in SPA
        window.addEventListener('popstate', () => {
            this.animatePageEntry();
        });
    }

    createParticleSystem() {
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        `;
        
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
        
        const animate = () => {
            if (this.isReducedMotion) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = 'var(--primary-color)';
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    setupInteractiveParticles() {
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (this.isReducedMotion) return;
            
            this.createParticleBurst(mouseX, mouseY);
        });
    }

    createParticleBurst(x, y) {
        const particleCount = 3;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'interactive-particle';
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                left: ${x}px;
                top: ${y}px;
                animation: particle-float 1s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }

    setupShapeMorphing() {
        document.querySelectorAll('[data-morph]').forEach(element => {
            const shapes = element.dataset.morph.split(',');
            let currentShape = 0;
            
            element.addEventListener('click', () => {
                currentShape = (currentShape + 1) % shapes.length;
                element.style.borderRadius = shapes[currentShape];
            });
        });
    }

    setupTextMorphing() {
        document.querySelectorAll('[data-text-morph]').forEach(element => {
            const texts = element.dataset.textMorph.split('|');
            let currentIndex = 0;
            
            setInterval(() => {
                currentIndex = (currentIndex + 1) % texts.length;
                this.morphText(element, texts[currentIndex]);
            }, 3000);
        });
    }

    morphText(element, newText) {
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.textContent = newText;
            element.style.opacity = '1';
        }, 300);
    }

    animatePageEntry() {
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    }

    // Public API methods
    animate(element, animationType, options = {}) {
        if (this.isReducedMotion && !options.ignoreReducedMotion) return;
        
        element.classList.add('animated', animationType);
        
        if (options.duration) {
            element.style.animationDuration = options.duration;
        }
        
        if (options.delay) {
            element.style.animationDelay = options.delay;
        }
        
        element.addEventListener('animationend', () => {
            element.classList.remove('animated', animationType);
        }, { once: true });
    }

    stagger(elements, animationType, delay = 100) {
        Array.from(elements).forEach((element, index) => {
            setTimeout(() => {
                this.animate(element, animationType);
            }, index * delay);
        });
    }

    setReducedMotion(enabled) {
        this.isReducedMotion = enabled;
        
        if (enabled) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// Add animation CSS
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animated {
        animation-fill-mode: both;
    }
    
    .fade-in {
        animation-name: fadeIn;
    }
    
    .slide-up {
        animation-name: slideUp;
    }
    
    .slide-down {
        animation-name: slideDown;
    }
    
    .scale-in {
        animation-name: scaleIn;
    }
    
    .rotate-in {
        animation-name: rotateIn;
    }
    
    .bounce-in {
        animation-name: bounceIn;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideDown {
        from { transform: translateY(-30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes scaleIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes rotateIn {
        from { transform: rotate(-10deg); opacity: 0; }
        to { transform: rotate(0); opacity: 1; }
    }
    
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes particle-float {
        to {
            transform: translate(var(--tx, 50px), var(--ty, -50px));
            opacity: 0;
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification-enter {
        opacity: 0;
        transform: translateX(100%);
    }
    
    .notification-enter-active {
        opacity: 1;
        transform: translateX(0);
        transition: all 0.3s ease;
    }
    
    .hover-active {
        transition: all 0.3s ease;
    }
    
    .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
`;
document.head.appendChild(animationStyles);

// Initialize advanced animations
document.addEventListener('DOMContentLoaded', () => {
    window.advancedAnimations = new AdvancedAnimations();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedAnimations;
}
