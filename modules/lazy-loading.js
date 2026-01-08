/**
 * Modern Lazy Loading System
 * Optimized for performance with intersection observers and progressive enhancement
 */

class LazyLoadingManager {
    constructor() {
        this.observer = null;
        this.loadedImages = new Set();
        this.placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.initializeImages();
        this.setupProgressiveLoading();
    }

    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            this.fallbackLoad();
            return;
        }

        const options = {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0.01
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    initializeImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            // Add placeholder
            if (!img.src) {
                img.src = this.placeholderSrc;
            }
            
            // Add loading class
            img.classList.add('lazy-loading');
            
            // Start observing
            this.observer.observe(img);
        });
    }

    async loadImage(img) {
        if (this.loadedImages.has(img)) return;
        
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        
        try {
            // Create new image to test loading
            const newImg = new Image();
            
            newImg.onload = () => {
                this.applyImage(img, newImg, src, srcset);
                this.loadedImages.add(img);
            };
            
            newImg.onerror = () => {
                this.handleImageError(img);
            };
            
            // Start loading
            if (srcset) {
                newImg.srcset = srcset;
            }
            newImg.src = src;
            
        } catch (error) {
            console.error('Error loading image:', error);
            this.handleImageError(img);
        }
    }

    applyImage(img, newImg, src, srcset) {
        // Add fade effect
        img.style.transition = 'opacity 0.3s ease';
        img.style.opacity = '0';
        
        // Apply sources
        if (srcset) {
            img.srcset = srcset;
        }
        img.src = src;
        
        // Remove loading class and add loaded class
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
        
        // Fade in
        requestAnimationFrame(() => {
            img.style.opacity = '1';
        });
        
        // Remove data attributes
        delete img.dataset.src;
        delete img.dataset.srcset;
        
        // Emit event
        img.dispatchEvent(new CustomEvent('imageloaded', {
            detail: { img, src }
        }));
    }

    handleImageError(img) {
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-error');
        
        // Try to load a fallback
        const fallback = img.dataset.fallback;
        if (fallback && fallback !== img.src) {
            img.src = fallback;
        } else {
            // Use default error image
            img.src = '/img/image-error.jpg';
        }
    }

    setupProgressiveLoading() {
        // Progressive image loading for large images
        const progressiveImages = document.querySelectorAll('img[data-progressive]');
        
        progressiveImages.forEach(img => {
            this.setupProgressiveImage(img);
        });
    }

    setupProgressiveImage(img) {
        const lowQualitySrc = img.dataset.progressive;
        const highQualitySrc = img.dataset.src;
        
        // Load low quality first
        const lowQualityImg = new Image();
        lowQualityImg.onload = () => {
            img.src = lowQualitySrc;
            img.classList.add('progressive-low');
            
            // Then load high quality
            setTimeout(() => {
                this.loadImage(img);
            }, 100);
        };
        lowQualityImg.src = lowQualitySrc;
    }

    fallbackLoad() {
        // Fallback for browsers without IntersectionObserver
        const images = document.querySelectorAll('img[data-src]');
        
        const loadImages = () => {
            images.forEach(img => {
                if (this.isInViewport(img)) {
                    this.loadImage(img);
                }
            });
            
            // Remove loaded images from list
            const remainingImages = Array.from(images).filter(img => 
                !this.loadedImages.has(img)
            );
            
            if (remainingImages.length > 0) {
                setTimeout(loadImages, 200);
            }
        };
        
        // Initial load
        loadImages();
        
        // Load on scroll
        window.addEventListener('scroll', loadImages, { passive: true });
        window.addEventListener('resize', loadImages);
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= window.innerHeight + 200 &&
            rect.bottom >= -200 &&
            rect.left <= window.innerWidth + 200 &&
            rect.right >= -200
        );
    }

    // Background image lazy loading
    lazyLoadBackgrounds() {
        const backgrounds = document.querySelectorAll('[data-bg]');
        
        const bgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const bg = element.dataset.bg;
                    
                    element.style.backgroundImage = `url(${bg})`;
                    element.classList.add('bg-loaded');
                    
                    delete element.dataset.bg;
                    bgObserver.unobserve(element);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        backgrounds.forEach(bg => bgObserver.observe(bg));
    }

    // Lazy load iframes
    lazyLoadIframes() {
        const iframes = document.querySelectorAll('iframe[data-src]');
        
        const iframeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    const src = iframe.dataset.src;
                    
                    iframe.src = src;
                    iframe.classList.add('iframe-loaded');
                    
                    delete iframe.dataset.src;
                    iframeObserver.unobserve(iframe);
                }
            });
        }, {
            rootMargin: '100px'
        });
        
        iframes.forEach(iframe => iframeObserver.observe(iframe));
    }

    // Preload critical images
    preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('img[data-critical]');
        
        criticalImages.forEach(img => {
            const src = img.dataset.src || img.src;
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            
            if (img.dataset.srcset) {
                link.imageSrcset = img.dataset.srcset;
                link.sizes = img.sizes;
            }
            
            document.head.appendChild(link);
        });
    }

    // Adaptive loading based on network
    setupAdaptiveLoading() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // Adjust loading strategy based on connection
            if (connection.saveData || connection.effectiveType === 'slow-2g') {
                this.enableDataSaver();
            } else if (connection.effectiveType === '2g') {
                this.enableSlowConnection();
            }
        }
    }

    enableDataSaver() {
        // Load smaller images, skip non-essential images
        const images = document.querySelectorAll('img[data-src]');
        
        images.forEach(img => {
            if (img.dataset.dataSaver) {
                img.dataset.src = img.dataset.dataSaver;
            }
            
            // Skip decorative images
            if (img.dataset.decorative) {
                img.src = this.placeholderSrc;
                img.classList.add('lazy-skipped');
            }
        });
    }

    enableSlowConnection() {
        // Increase root margin for earlier loading
        if (this.observer) {
            this.observer.disconnect();
            
            const options = {
                root: null,
                rootMargin: '200px 0px',
                threshold: 0.01
            };
            
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, options);
            
            this.initializeImages();
        }
    }

    // Performance monitoring
    monitorPerformance() {
        let loadedCount = 0;
        let errorCount = 0;
        let totalLoadTime = 0;
        
        document.addEventListener('imageloaded', (e) => {
            loadedCount++;
            // Track performance metrics
            if (window.performance && window.performance.mark) {
                const markName = `image-loaded-${loadedCount}`;
                window.performance.mark(markName);
            }
        });
        
        document.addEventListener('imageerror', (e) => {
            errorCount++;
            console.warn('Image failed to load:', e.detail.src);
        });
        
        // Report metrics
        setTimeout(() => {
            console.log(`Lazy loading performance: ${loadedCount} loaded, ${errorCount} errors`);
        }, 5000);
    }

    // Cleanup
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.loadedImages.clear();
    }
}

export default LazyLoadingManager;
