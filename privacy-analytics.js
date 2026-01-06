// Privacy-Focused Analytics System
class PrivacyAnalytics {
    constructor() {
        this.consentGiven = false;
        this.analyticsEnabled = false;
        this.sessionData = {
            sessionId: this.generateSessionId(),
            startTime: Date.now(),
            pageViews: [],
            events: [],
            performance: {}
        };
        this.init();
    }

    init() {
        this.checkConsent();
        this.setupConsentManager();
        this.setupLocalAnalytics();
        this.setupPerformanceMonitoring();
        this.setupPrivacyControls();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    checkConsent() {
        // Check if user has already given consent
        const consent = localStorage.getItem('analytics_consent');
        if (consent === 'granted') {
            this.consentGiven = true;
            this.enableAnalytics();
        } else if (consent === 'denied') {
            this.consentGiven = false;
        } else {
            // Show consent banner
            this.showConsentBanner();
        }
    }

    setupConsentManager() {
        // Create consent banner if it doesn't exist
        if (!document.getElementById('consent-banner')) {
            const banner = document.createElement('div');
            banner.id = 'consent-banner';
            banner.className = 'consent-banner';
            banner.innerHTML = `
                <div class="consent-content">
                    <div class="consent-text">
                        <h4>Privacy & Analytics</h4>
                        <p>This site uses privacy-focused analytics to understand usage patterns and improve your experience. No personal data is collected or shared.</p>
                    </div>
                    <div class="consent-actions">
                        <button class="consent-accept" data-consent="accept">Accept</button>
                        <button class="consent-deny" data-consent="deny">Decline</button>
                        <button class="consent-settings" data-consent="settings">Settings</button>
                    </div>
                </div>
            `;

            // Add styles
            banner.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--bg-secondary);
                border-top: 1px solid var(--border-color);
                padding: 1.5rem;
                z-index: 10000;
                transform: translateY(100%);
                transition: transform 0.3s ease;
            `;

            document.body.appendChild(banner);

            // Add event listeners
            banner.addEventListener('click', (e) => {
                const action = e.target.dataset.consent;
                if (action) {
                    this.handleConsent(action);
                }
            });

            // Show banner with animation
            setTimeout(() => {
                banner.style.transform = 'translateY(0)';
            }, 1000);
        }
    }

    handleConsent(action) {
        const banner = document.getElementById('consent-banner');
        
        switch (action) {
            case 'accept':
                this.consentGiven = true;
                localStorage.setItem('analytics_consent', 'granted');
                this.enableAnalytics();
                this.hideConsentBanner();
                this.showNotification('Thank you for supporting privacy-focused analytics!', 'success');
                break;
                
            case 'deny':
                this.consentGiven = false;
                localStorage.setItem('analytics_consent', 'denied');
                this.disableAnalytics();
                this.hideConsentBanner();
                this.showNotification('Analytics disabled. Your privacy is respected.', 'info');
                break;
                
            case 'settings':
                this.showConsentSettings();
                break;
        }
    }

    showConsentSettings() {
        // Create settings modal
        const modal = document.createElement('div');
        modal.className = 'consent-settings-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Privacy Settings</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" id="anonymous-analytics" checked>
                            <span>Anonymous Analytics</span>
                        </label>
                        <p class="setting-description">Helps understand usage patterns without collecting personal data</p>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" id="performance-monitoring" checked>
                            <span>Performance Monitoring</span>
                        </label>
                        <p class="setting-description">Monitors site performance to improve user experience</p>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" id="error-tracking">
                            <span>Error Tracking</span>
                        </label>
                        <p class="setting-description">Helps identify and fix technical issues</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="save-settings">Save Settings</button>
                    <button class="cancel-settings">Cancel</button>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        `;

        document.body.appendChild(modal);

        // Handle modal interactions
        const closeBtn = modal.querySelector('.modal-close');
        const saveBtn = modal.querySelector('.save-settings');
        const cancelBtn = modal.querySelector('.cancel-settings');

        closeBtn.addEventListener('click', () => this.closeConsentSettings(modal));
        cancelBtn.addEventListener('click', () => this.closeConsentSettings(modal));
        saveBtn.addEventListener('click', () => this.saveConsentSettings(modal));

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeConsentSettings(modal);
            }
        });
    }

    saveConsentSettings(modal) {
        const anonymousAnalytics = modal.querySelector('#anonymous-analytics').checked;
        const performanceMonitoring = modal.querySelector('#performance-monitoring').checked;
        const errorTracking = modal.querySelector('#error-tracking').checked;

        const settings = {
            anonymousAnalytics,
            performanceMonitoring,
            errorTracking,
            timestamp: Date.now()
        };

        localStorage.setItem('analytics_settings', JSON.stringify(settings));
        
        if (anonymousAnalytics) {
            this.consentGiven = true;
            localStorage.setItem('analytics_consent', 'granted');
            this.enableAnalytics();
        } else {
            this.consentGiven = false;
            localStorage.setItem('analytics_consent', 'denied');
            this.disableAnalytics();
        }

        this.closeConsentSettings(modal);
        this.hideConsentBanner();
        this.showNotification('Privacy settings saved', 'success');
    }

    closeConsentSettings(modal) {
        modal.remove();
    }

    hideConsentBanner() {
        const banner = document.getElementById('consent-banner');
        if (banner) {
            banner.style.transform = 'translateY(100%)';
            setTimeout(() => banner.remove(), 300);
        }
    }

    enableAnalytics() {
        this.analyticsEnabled = true;
        this.trackPageView();
        this.setupEventTracking();
        this.setupPerformanceTracking();
        console.log('Privacy-focused analytics enabled');
    }

    disableAnalytics() {
        this.analyticsEnabled = false;
        console.log('Analytics disabled');
    }

    setupLocalAnalytics() {
        // Track page views locally
        this.trackPageView();
        
        // Track session duration
        window.addEventListener('beforeunload', () => {
            this.trackSessionEnd();
        });

        // Track visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('page_hidden');
            } else {
                this.trackEvent('page_visible');
            }
        });
    }

    setupPerformanceMonitoring() {
        if ('performance' in window) {
            // Track page load performance
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.trackPerformance();
                }, 1000);
            });

            // Track Core Web Vitals
            this.trackCoreWebVitals();
        }
    }

    trackCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.sessionData.performance.lcp = lastEntry.renderTime || lastEntry.loadTime;
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.sessionData.performance.fid = entry.processingStart - entry.startTime;
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.sessionData.performance.cls = clsValue;
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    trackPageView() {
        if (!this.analyticsEnabled) return;

        const pageData = {
            url: window.location.href,
            title: document.title,
            timestamp: Date.now(),
            referrer: document.referrer,
            userAgent: this.getAnonymousUserAgent()
        };

        this.sessionData.pageViews.push(pageData);
        this.saveLocalData();
    }

    trackEvent(eventName, data = {}) {
        if (!this.analyticsEnabled) return;

        const eventData = {
            name: eventName,
            data: this.sanitizeData(data),
            timestamp: Date.now(),
            page: window.location.href
        };

        this.sessionData.events.push(eventData);
        this.saveLocalData();
    }

    trackPerformance() {
        if (!this.analyticsEnabled) return;

        const navigation = performance.getEntriesByType('navigation')[0];
        const perfData = {
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
            firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime,
            ...this.sessionData.performance
        };

        this.sessionData.performance = perfData;
        this.saveLocalData();
    }

    trackSessionEnd() {
        if (!this.analyticsEnabled) return;

        const sessionDuration = Date.now() - this.sessionData.startTime;
        this.sessionData.duration = sessionDuration;
        this.saveLocalData();
        this.sendDataToServer();
    }

    setupEventTracking() {
        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                this.trackEvent('form_submit', {
                    formId: form.id || 'unknown',
                    formName: form.name || 'unknown'
                });
            }
        });

        // Track link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href) {
                this.trackEvent('link_click', {
                    linkUrl: this.sanitizeUrl(link.href),
                    linkText: link.textContent.trim().substring(0, 50)
                });
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    this.trackEvent('scroll_depth', { percent: maxScroll });
                }
            }
        });
    }

    setupPrivacyControls() {
        // Add privacy controls to footer
        const footer = document.querySelector('.footer');
        if (footer) {
            const privacyLink = document.createElement('a');
            privacyLink.href = '#';
            privacyLink.textContent = 'Privacy Settings';
            privacyLink.className = 'privacy-settings-link';
            privacyLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showConsentSettings();
            });

            const footerMeta = footer.querySelector('.footer-meta');
            if (footerMeta) {
                footerMeta.appendChild(privacyLink);
            }
        }
    }

    getAnonymousUserAgent() {
        const ua = navigator.userAgent;
        // Extract only browser and OS info, remove unique identifiers
        const browserInfo = ua.match(/(Chrome|Firefox|Safari|Edge)\/[\d.]+/);
        const osInfo = ua.match(/(Windows|Mac|Linux|Android|iOS)/);
        
        return {
            browser: browserInfo ? browserInfo[0] : 'Unknown',
            os: osInfo ? osInfo[0] : 'Unknown'
        };
    }

    sanitizeData(data) {
        // Remove any potentially sensitive information
        const sanitized = { ...data };
        
        // Remove email addresses
        if (sanitized.email) {
            delete sanitized.email;
        }
        
        // Remove phone numbers
        if (sanitized.phone) {
            delete sanitized.phone;
        }
        
        // Remove personal identifiers
        if (sanitized.name) {
            delete sanitized.name;
        }
        
        return sanitized;
    }

    sanitizeUrl(url) {
        // Remove query parameters and fragments that might contain sensitive data
        const urlObj = new URL(url);
        return urlObj.origin + urlObj.pathname;
    }

    saveLocalData() {
        // Save data to localStorage for local analysis
        const dataKey = `analytics_${this.sessionData.sessionId}`;
        localStorage.setItem(dataKey, JSON.stringify(this.sessionData));
        
        // Clean up old data (keep only last 10 sessions)
        this.cleanupOldData();
    }

    cleanupOldData() {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('analytics_'));
        if (keys.length > 10) {
            const sortedKeys = keys.sort((a, b) => {
                const dataA = JSON.parse(localStorage.getItem(a));
                const dataB = JSON.parse(localStorage.getItem(b));
                return dataB.startTime - dataA.startTime;
            });
            
            // Remove oldest sessions
            const keysToRemove = sortedKeys.slice(10);
            keysToRemove.forEach(key => localStorage.removeItem(key));
        }
    }

    async sendDataToServer() {
        // In a real implementation, this would send data to your privacy-focused analytics server
        // For now, we'll just log it locally
        console.log('Analytics data:', this.sessionData);
        
        // Example of how you might send to a server:
        /*
        try {
            const response = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.sessionData)
            });
            
            if (response.ok) {
                console.log('Analytics data sent successfully');
            }
        } catch (error) {
            console.error('Error sending analytics data:', error);
        }
        */
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `privacy-notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            z-index: 10000;
            max-width: 300px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Public API methods
    track(eventName, data) {
        this.trackEvent(eventName, data);
    }

    page() {
        this.trackPageView();
    }

    getAnalyticsData() {
        return this.sessionData;
    }

    resetConsent() {
        localStorage.removeItem('analytics_consent');
        localStorage.removeItem('analytics_settings');
        this.consentGiven = false;
        this.analyticsEnabled = false;
        this.showConsentBanner();
    }
}

// Initialize privacy analytics
document.addEventListener('DOMContentLoaded', () => {
    window.privacyAnalytics = new PrivacyAnalytics();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrivacyAnalytics;
}
