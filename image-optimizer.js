// Advanced Image Optimization and Lazy Loading System
class ImageOptimizer {
    constructor() {
        this.imageCache = new Map();
        this.intersectionObserver = null;
        this.loadedImages = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.optimizeExistingImages();
        this.setupImageErrorHandling();
        this.preloadCriticalImages();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0.01
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.intersectionObserver.unobserve(entry.target);
                }
            });
        }, options);
    }

    optimizeExistingImages() {
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        images.forEach(img => {
            if (!this.loadedImages.has(img.src)) {
                this.intersectionObserver.observe(img);
            }
        });
    }

    loadImage(img) {
        const src = img.dataset.src || img.src;
        if (this.loadedImages.has(src)) return;

        // Add loading state
        img.classList.add('loading');
        
        // Create new image to test loading
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = src;
            img.classList.remove('loading');
            img.classList.add('loaded');
            this.loadedImages.add(src);
            this.addFadeInAnimation(img);
        };
        
        tempImg.onerror = () => {
            this.handleImageError(img);
        };
        
        tempImg.src = src;
    }

    addFadeInAnimation(img) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        setTimeout(() => {
            img.style.opacity = '1';
        }, 10);
    }

    setupImageErrorHandling() {
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);
    }

    handleImageError(img) {
        img.classList.add('error');
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMWEyQTNEIi8+CjxwYXRoIGQ9Ik04NSA4NUgxMTVWMTIwSDg1Vjg1WiIgZmlsbD0iIzM0NDI1NSIvPgo8cGF0aCBkPSJNODUgMTA1SDEwNUwxMTUgODVWMTA1SDg1WiIgZmlsbD0iIzM0NDI1NSIvPgo8L3N2Zz4K';
        img.alt = 'Image failed to load';
    }

    preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('img[data-critical="true"]');
        criticalImages.forEach(img => {
            const src = img.dataset.src || img.src;
            if (src && !this.loadedImages.has(src)) {
                const tempImg = new Image();
                tempImg.onload = () => {
                    img.src = src;
                    this.loadedImages.add(src);
                };
                tempImg.src = src;
            }
        });
    }

    // Generate responsive image sources
    generateResponsiveSources(baseSrc, formats = ['webp', 'avif', 'jpg']) {
        const sources = [];
        formats.forEach(format => {
            sources.push({
                srcset: `${baseSrc}.${format}`,
                type: `image/${format === 'jpg' ? 'jpeg' : format}`
            });
        });
        return sources;
    }

    // Create picture element with multiple formats
    createPictureElement(baseSrc, alt, sizes = null, classList = []) {
        const picture = document.createElement('picture');
        
        // Add WebP source
        const webpSource = document.createElement('source');
        webpSource.srcset = `${baseSrc}.webp`;
        webpSource.type = 'image/webp';
        picture.appendChild(webpSource);
        
        // Add AVIF source if supported
        if (this.supportsFormat('avif')) {
            const avifSource = document.createElement('source');
            avifSource.srcset = `${baseSrc}.avif`;
            avifSource.type = 'image/avif';
            picture.appendChild(avifSource);
        }
        
        // Fallback to JPEG
        const img = document.createElement('img');
        img.src = `${baseSrc}.jpg`;
        img.alt = alt;
        img.loading = 'lazy';
        img.decoding = 'async';
        
        if (sizes) {
            img.sizes = sizes;
        }
        
        if (classList.length > 0) {
            img.classList.add(...classList);
        }
        
        picture.appendChild(img);
        return picture;
    }

    supportsFormat(format) {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL(`image/${format}`).indexOf(`data:image/${format}`) === 0;
    }

    // Progressive image loading
    loadProgressiveImage(img) {
        const lowQualitySrc = img.dataset.lowQuality;
        const highQualitySrc = img.dataset.highQuality || img.dataset.src;
        
        if (lowQualitySrc) {
            // Load low quality first
            img.src = lowQualitySrc;
            img.classList.add('low-quality');
            
            // Then load high quality
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = highQualitySrc;
                img.classList.remove('low-quality');
                img.classList.add('high-quality');
            };
            tempImg.src = highQualitySrc;
        }
    }

    // Add blur-up effect for progressive loading
    addBlurUpEffect(img) {
        img.style.filter = 'blur(10px)';
        img.style.transition = 'filter 0.3s ease-in-out';
        
        img.onload = () => {
            setTimeout(() => {
                img.style.filter = 'blur(0)';
            }, 100);
        };
    }
}

// Initialize image optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.imageOptimizer = new ImageOptimizer();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageOptimizer;
}
