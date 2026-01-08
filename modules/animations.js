/**
 * Modern Animation System
 * Hardware-accelerated, performance-optimized animations
 */

class AnimationManager {
    constructor() {
        this.observer = null;
        this.animations = new Map();
        this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        if (!this.isReduced) {
            this.setupIntersectionObserver();
            this.initializeScrollAnimations();
            this.initializeHoverAnimations();
            this.initializeLoadAnimations();
        }
    }

    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    }

    animateElement(element) {
        const animationType = element.dataset.animation;
        
        switch (animationType) {
            case 'fade-up':
                this.fadeUp(element);
                break;
            case 'fade-in':
                this.fadeIn(element);
                break;
            case 'slide-left':
                this.slideLeft(element);
                break;
            case 'slide-right':
                this.slideRight(element);
                break;
            case 'scale-up':
                this.scaleUp(element);
                break;
            case 'rotate-in':
                this.rotateIn(element);
                break;
            default:
                this.fadeUp(element);
        }
    }

    fadeUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    fadeIn(element) {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    slideLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    slideRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    scaleUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }

    rotateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'rotate(-5deg) scale(0.9)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'rotate(0deg) scale(1)';
        });
    }

    initializeScrollAnimations() {
        let ticking = false;
        
        const updateScrollAnimations = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', updateScrollAnimations, { passive: true });
    }

    updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Update navigation
        const nav = document.querySelector('.nav');
        if (nav) {
            if (scrolled > 100) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        }
    }

    initializeHoverAnimations() {
        // Card hover effects
        document.addEventListener('mouseover', (e) => {
            const card = e.target.closest('.card, .project-card, .article-card');
            if (card) {
                this.addHoverEffect(card);
            }
        });

        document.addEventListener('mouseout', (e) => {
            const card = e.target.closest('.card, .project-card, .article-card');
            if (card) {
                this.removeHoverEffect(card);
            }
        });
    }

    addHoverEffect(element) {
        element.style.transform = 'translateY(-8px) scale(1.02)';
        element.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.2)';
    }

    removeHoverEffect(element) {
        element.style.transform = '';
        element.style.boxShadow = '';
    }

    initializeLoadAnimations() {
        // Animate elements on page load
        const animatedElements = document.querySelectorAll('[data-animation]');
        animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }

    // Staggered animation for lists
    staggerAnimate(elements, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.animateElement(element);
            }, index * delay);
        });
    }

    // Typing animation
    typeText(element, text, speed = 50) {
        let index = 0;
        element.textContent = '';
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    // Counting animation
    countUp(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const update = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        };
        
        update();
    }

    // Morphing animation
    morph(element, from, to, duration = 1000) {
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeProgress = this.easeInOutCubic(progress);
            
            // Interpolate between from and to
            const current = this.interpolate(from, to, easeProgress);
            
            // Apply to element
            if (typeof current === 'object') {
                Object.assign(element.style, current);
            } else {
                element.style.transform = current;
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    interpolate(from, to, progress) {
        if (typeof from === 'object' && typeof to === 'object') {
            const result = {};
            for (const key in from) {
                result[key] = from[key] + (to[key] - from[key]) * progress;
            }
            return result;
        }
        return from + (to - from) * progress;
    }

    // Particle effects
    createParticles(container, count = 50) {
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: var(--primary);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.5};
                animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
            `;
            
            container.appendChild(particle);
            particles.push(particle);
        }
        
        return particles;
    }

    // Magnetic effect
    addMagneticEffect(element) {
        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 100;
            
            if (distance < maxDistance) {
                const strength = (1 - distance / maxDistance) * 20;
                element.style.transform = `translate(${x * strength / maxDistance}px, ${y * strength / maxDistance}px)`;
            }
        };

        const handleMouseLeave = () => {
            element.style.transform = '';
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);
    }

    // Glitch effect
    addGlitchEffect(element, intensity = 0.1) {
        const originalText = element.textContent;
        const characters = '!<>-_\\[]{}—=+*^?#________';
        
        const glitch = () => {
            let glitchedText = '';
            
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < intensity) {
                    glitchedText += characters.charAt(Math.floor(Math.random() * characters.length));
                } else {
                    glitchedText += originalText[i];
                }
            }
            
            element.textContent = glitchedText;
        };

        const restore = () => {
            element.textContent = originalText;
        };

        const interval = setInterval(() => {
            glitch();
            setTimeout(restore, 50);
        }, 3000);

        return () => clearInterval(interval);
    }

    // Cleanup
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.animations.clear();
    }
}

export default AnimationManager;
