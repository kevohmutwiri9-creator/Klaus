/**
 * Modern Analytics System
 * Privacy-focused, performance-optimized analytics with multiple tracking options
 */

class AnalyticsManager {
    constructor() {
        this.config = {
            enabled: true,
            consent: false,
            trackingId: 'G-Y037Y95D4M',
            debug: false,
            sampleRate: 100,
            trackPerformance: true,
            trackErrors: true,
            trackInteractions: true
        };
        
        this.events = [];
        this.performanceMetrics = {};
        
        this.init();
    }

    async init() {
        // Check consent
        this.config.consent = this.getConsent();
        
        if (this.config.consent) {
            await this.initializeAnalytics();
        }
        
        this.setupConsentManagement();
        this.setupPerformanceTracking();
        this.setupErrorTracking();
        this.setupInteractionTracking();
    }

    getConsent() {
        return localStorage.getItem('analytics-consent') === 'granted';
    }

    setConsent(granted) {
        localStorage.setItem('analytics-consent', granted ? 'granted' : 'denied');
        this.config.consent = granted;
        
        if (granted) {
            this.initializeAnalytics();
        } else {
            this.disableAnalytics();
        }
    }

    async initializeAnalytics() {
        try {
            // Load Google Analytics
            await this.loadGoogleAnalytics();
            
            // Initialize custom tracking
            this.initializeCustomTracking();
            
            // Track page view
            this.trackPageView();
            
            console.log('✅ Analytics initialized');
            
        } catch (error) {
            console.warn('⚠️ Analytics initialization failed:', error);
        }
    }

    async loadGoogleAnalytics() {
        return new Promise((resolve, reject) => {
            // Create script element
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.trackingId}`;
            
            script.onload = () => {
                // Initialize gtag
                window.dataLayer = window.dataLayer || [];
                window.gtag = function() {
                    dataLayer.push(arguments);
                };
                
                gtag('js', new Date());
                gtag('config', this.config.trackingId, {
                    anonymize_ip: true,
                    send_page_view: false, // We'll handle this manually
                    sample_rate: this.config.sampleRate,
                    cookie_flags: 'SameSite=Lax;Secure'
                });
                
                resolve();
            };
            
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    initializeCustomTracking() {
        // Track Web Vitals
        if (this.config.trackPerformance) {
            this.trackWebVitals();
        }
        
        // Track user engagement
        this.trackEngagement();
        
        // Track scroll depth
        this.trackScrollDepth();
        
        // Track form interactions
        this.trackFormInteractions();
    }

    trackPageView(path = null) {
        const pagePath = path || window.location.pathname;
        
        if (this.config.consent && window.gtag) {
            gtag('event', 'page_view', {
                page_location: window.location.href,
                page_path: pagePath,
                page_title: document.title
            });
        }
        
        // Custom tracking
        this.trackEvent('page_view', {
            path: pagePath,
            title: document.title,
            referrer: document.referrer,
            timestamp: Date.now()
        });
    }

    trackEvent(eventName, parameters = {}) {
        if (!this.config.enabled || !this.config.consent) return;
        
        const event = {
            name: eventName,
            parameters: {
                ...parameters,
                timestamp: Date.now(),
                session_id: this.getSessionId(),
                user_agent: navigator.userAgent.substring(0, 200)
            }
        };
        
        this.events.push(event);
        
        // Send to Google Analytics
        if (window.gtag) {
            gtag('event', eventName, parameters);
        }
        
        // Send to custom endpoint if configured
        this.sendCustomEvent(event);
    }

    trackWebVitals() {
        // Load web-vitals library
        this.loadScript('https://unpkg.com/web-vitals@3/dist/web-vitals.js')
            .then(() => {
                // Track LCP
                webVitals.getLCP((metric) => {
                    this.trackPerformanceMetric('largest_contentful_paint', metric);
                });
                
                // Track FID
                webVitals.getFID((metric) => {
                    this.trackPerformanceMetric('first_input_delay', metric);
                });
                
                // Track CLS
                webVitals.getCLS((metric) => {
                    this.trackPerformanceMetric('cumulative_layout_shift', metric);
                });
                
                // Track FCP
                webVitals.getFCP((metric) => {
                    this.trackPerformanceMetric('first_contentful_paint', metric);
                });
                
                // Track TTFB
                webVitals.getTTFB((metric) => {
                    this.trackPerformanceMetric('time_to_first_byte', metric);
                });
            })
            .catch(error => {
                console.warn('Failed to load web-vitals:', error);
            });
    }

    trackPerformanceMetric(name, metric) {
        this.performanceMetrics[name] = {
            value: metric.value,
            rating: metric.rating,
            timestamp: metric.timestamp
        };
        
        this.trackEvent('performance_metric', {
            metric_name: name,
            value: metric.value,
            rating: metric.rating
        });
    }

    trackEngagement() {
        let startTime = Date.now();
        let isActive = true;
        
        // Track time on page
        const trackTime = () => {
            if (isActive) {
                const timeSpent = Date.now() - startTime;
                this.trackEvent('engagement', {
                    type: 'time_on_page',
                    duration: Math.floor(timeSpent / 1000)
                });
            }
        };
        
        // Track visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isActive = false;
                trackTime();
            } else {
                isActive = true;
                startTime = Date.now();
            }
        });
        
        // Track before unload
        window.addEventListener('beforeunload', trackTime);
    }

    trackScrollDepth() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 90, 100];
        const reached = new Set();
        
        const trackScroll = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                milestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !reached.has(milestone)) {
                        reached.add(milestone);
                        this.trackEvent('scroll_depth', {
                            percentage: milestone
                        });
                    }
                });
            }
        };
        
        window.addEventListener('scroll', trackScroll, { passive: true });
    }

    trackFormInteractions() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Track form starts
            form.addEventListener('focus', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    this.trackEvent('form_interaction', {
                        type: 'start',
                        form_name: form.name || 'unnamed',
                        field_name: e.target.name
                    });
                }
            }, true);
            
            // Track form submissions
            form.addEventListener('submit', (e) => {
                this.trackEvent('form_interaction', {
                    type: 'submit',
                    form_name: form.name || 'unnamed'
                });
            });
            
            // Track form errors
            form.addEventListener('invalid', (e) => {
                this.trackEvent('form_interaction', {
                    type: 'error',
                    form_name: form.name || 'unnamed',
                    field_name: e.target.name,
                    error_message: e.target.validationMessage
                });
            }, true);
        });
    }

    setupPerformanceTracking() {
        if (!this.config.trackPerformance) return;
        
        // Track navigation timing
        window.addEventListener('load', () => {
            setTimeout(() => {
                const nav = performance.getEntriesByType('navigation')[0];
                if (nav) {
                    this.trackEvent('navigation_timing', {
                        dom_content_loaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
                        load_complete: nav.loadEventEnd - nav.loadEventStart,
                        first_paint: nav.responseStart - nav.requestStart
                    });
                }
            }, 0);
        });
        
        // Track resource timing
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.transferSize > 0) {
                        this.trackEvent('resource_timing', {
                            name: entry.name,
                            size: entry.transferSize,
                            duration: entry.duration
                        });
                    }
                });
            });
            
            observer.observe({ entryTypes: ['resource'] });
        }
    }

    setupErrorTracking() {
        if (!this.config.trackErrors) return;
        
        // Track JavaScript errors
        window.addEventListener('error', (e) => {
            this.trackEvent('error', {
                type: 'javascript',
                message: e.message,
                filename: e.filename,
                line: e.lineno,
                column: e.colno,
                stack: e.stack?.substring(0, 500)
            });
        });
        
        // Track promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.trackEvent('error', {
                type: 'promise_rejection',
                message: e.reason?.message || 'Unknown promise rejection',
                stack: e.reason?.stack?.substring(0, 500)
            });
        });
        
        // Track resource errors
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                this.trackEvent('error', {
                    type: 'resource',
                    element: e.target.tagName,
                    source: e.target.src || e.target.href
                });
            }
        }, true);
    }

    setupInteractionTracking() {
        if (!this.config.trackInteractions) return;
        
        // Track clicks
        document.addEventListener('click', (e) => {
            const target = e.target;
            const element = target.closest('[data-track]');
            
            if (element) {
                this.trackEvent('click', {
                    element: element.tagName,
                    identifier: element.dataset.track,
                    text: element.textContent?.substring(0, 50)
                });
            }
        });
        
        // Track outbound links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && link.hostname !== window.location.hostname) {
                this.trackEvent('outbound_click', {
                    url: link.href,
                    text: link.textContent?.substring(0, 50)
                });
            }
        });
        
        // Track downloads
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[download]');
            if (link) {
                this.trackEvent('download', {
                    file: link.download,
                    url: link.href
                });
            }
        });
    }

    setupConsentManagement() {
        // Check if consent banner is needed
        if (!localStorage.getItem('analytics-consent')) {
            this.showConsentBanner();
        }
    }

    showConsentBanner() {
        const banner = document.createElement('div');
        banner.className = 'analytics-consent-banner';
        banner.innerHTML = `
            <div class="consent-content">
                <p>This website uses analytics to improve your experience and monitor performance.</p>
                <div class="consent-buttons">
                    <button class="btn btn-primary" id="accept-analytics">Accept</button>
                    <button class="btn btn-secondary" id="decline-analytics">Decline</button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .analytics-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--bg-secondary);
                border-top: 1px solid var(--border);
                padding: var(--space-lg);
                z-index: var(--z-modal);
                transform: translateY(100%);
                transition: transform var(--transition-normal);
            }
            
            .analytics-consent-banner.show {
                transform: translateY(0);
            }
            
            .consent-content {
                max-width: 600px;
                margin: 0 auto;
                text-align: center;
            }
            
            .consent-buttons {
                margin-top: var(--space-md);
                display: flex;
                gap: var(--space-md);
                justify-content: center;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(banner);
        
        // Show banner
        requestAnimationFrame(() => {
            banner.classList.add('show');
        });
        
        // Handle buttons
        document.getElementById('accept-analytics').addEventListener('click', () => {
            this.setConsent(true);
            banner.remove();
        });
        
        document.getElementById('decline-analytics').addEventListener('click', () => {
            this.setConsent(false);
            banner.remove();
        });
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics-session');
        if (!sessionId) {
            sessionId = this.generateId();
            sessionStorage.setItem('analytics-session', sessionId);
        }
        return sessionId;
    }

    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    sendCustomEvent(event) {
        // Send to custom analytics endpoint
        // This can be implemented with your own backend
        if (this.config.debug) {
            console.log('Analytics Event:', event);
        }
    }

    disableAnalytics() {
        this.config.enabled = false;
        
        // Disable Google Analytics
        if (window.gtag) {
            gtag('config', this.config.trackingId, {
                send_page_view: false
            });
        }
        
        console.log('🚫 Analytics disabled');
    }

    // Public methods
    page(path) {
        this.trackPageView(path);
    }
    
    event(name, parameters) {
        this.trackEvent(name, parameters);
    }
    
    consent(granted) {
        this.setConsent(granted);
    }
}

export default AnalyticsManager;
