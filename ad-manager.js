// Adsterra Ad Management System
class AdManager {
    constructor() {
        this.config = {
            adsterra: {
                enabled: true,
                siteId: '5513564',
                placements: {
                    header: {
                        id: 'ADSTERRA_HEADER_ID',
                        type: 'banner',
                        size: '728x90'
                    },
                    sidebar: {
                        id: 'ADSTERRA_SIDEBAR_ID', 
                        type: 'banner',
                        size: '300x250'
                    },
                    footer: {
                        id: 'ADSTERRA_FOOTER_ID',
                        type: 'banner',
                        size: '728x90'
                    },
                    inContent: {
                        id: 'ADSTERRA_CONTENT_ID',
                        type: 'banner',
                        size: '300x250'
                    },
                    popunder: {
                        id: '28307277',
                        type: 'popunder',
                        scriptUrl: 'https://pl28407776.effectivegatecpm.com/a9/0a/d8/a90ad83fff3a2fb6c15dfa1f5aed9bab.js'
                    },
                    socialBar: {
                        id: '28311817',
                        type: 'social',
                        scriptUrl: 'https://pl28412316.effectivegatecpm.com/8e/fc/93/8efc93e2ef8e5bf2533df1a79bad3c3c.js'
                    },
                    smartlink: {
                        id: '28311931',
                        type: 'smartlink',
                        scriptUrl: 'https://pl28412316.effectivegatecpm.com/8e/fc/93/8efc93e2ef8e5bf2533df1a79bad3c3c.js'
                    },
                    campaign: {
                        id: 'ADSTERRA_CAMPAIGN_ID',
                        type: 'campaign',
                        scriptUrl: 'https://www.effectivegatecpm.com/tw2mcdi42?key=b8ddddfa27ad2b5ea536c9f92f8cbf71'
                    }
                }
            },
            privacy: {
                requireConsent: true,
                respectDNT: true,
                gdprCompliant: true
            },
            performance: {
                lazyLoading: true,
                preloadCritical: true,
                maxRetries: 3,
                priorityLoading: true,
                adaptiveLoading: true
            }
        };
        
        this.consentGiven = false;
        this.adsLoaded = new Set();
        this.retryCount = new Map();
        this.init();
    }

    init() {
        this.checkUserConsent();
        this.setupAdContainers();
        this.setupPrivacyControls();
        this.setupPerformanceOptimization();
        this.loadAdsterraScript();
    }

    checkUserConsent() {
        // Check if user has given consent for ads
        const adConsent = localStorage.getItem('ad_consent');
        const dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1';
        
        if (this.config.privacy.respectDNT && dnt) {
            this.consentGiven = false;
            console.log('Ads disabled due to Do Not Track preference');
        } else if (adConsent === 'granted') {
            this.consentGiven = true;
        } else if (adConsent === 'denied') {
            this.consentGiven = false;
        } else if (this.config.privacy.requireConsent) {
            this.showConsentDialog();
        } else {
            this.consentGiven = true;
        }
    }

    setupAdContainers() {
        // Create ad containers for different placements
        Object.entries(this.config.adsterra.placements).forEach(([placement, config]) => {
            this.createAdContainer(placement, config);
        });
    }

    createAdContainer(placement, config) {
        const container = document.createElement('div');
        container.className = `ad-container ad-${placement}`;
        container.id = `ad-${placement}`;
        container.setAttribute('data-ad-placement', placement);
        container.setAttribute('data-ad-size', config.size || 'auto');
        
        // Add placeholder
        container.innerHTML = `
            <div class="ad-placeholder">
                <div class="ad-loading">
                    <i class="fas fa-ad"></i>
                    <span>Loading Advertisement...</span>
                </div>
                <div class="ad-info">
                    <button class="ad-info-btn" aria-label="Ad information">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>
        `;

        // Insert container in appropriate location
        this.insertAdContainer(container, placement);
    }

    insertAdContainer(container, placement) {
        const targetLocation = this.getAdLocation(placement);
        if (targetLocation) {
            targetLocation.parentNode.insertBefore(container, targetLocation.nextSibling);
        }
    }

    getAdLocation(placement) {
        switch (placement) {
            case 'header':
                return document.querySelector('.navbar') || document.querySelector('header');
            case 'sidebar':
                return document.querySelector('.sidebar') || document.querySelector('.section-hero');
            case 'footer':
                return document.querySelector('.footer');
            case 'inContent':
                return document.querySelector('.section-content') || document.querySelector('.about');
            default:
                return document.querySelector('main') || document.querySelector('.section-hero');
        }
    }

    setupPrivacyControls() {
        // Create ad privacy controls
        const controls = document.createElement('div');
        controls.className = 'ad-privacy-controls';
        controls.innerHTML = `
            <button class="ad-settings-btn" id="adSettingsBtn">
                <i class="fas fa-ad"></i>
                <span>Ad Settings</span>
            </button>
        `;

        document.body.appendChild(controls);

        // Add event listener
        document.getElementById('adSettingsBtn').addEventListener('click', () => {
            this.showAdSettings();
        });
    }

    showConsentDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'ad-consent-dialog';
        dialog.innerHTML = `
            <div class="consent-content">
                <div class="consent-header">
                    <h3>Advertisement Consent</h3>
                    <button class="consent-close">&times;</button>
                </div>
                <div class="consent-body">
                    <p>This website uses advertisements to support free content. Ads help us maintain and improve the site.</p>
                    <div class="consent-options">
                        <label class="consent-option">
                            <input type="radio" name="adConsent" value="accept" checked>
                            <span>Accept Ads</span>
                        </label>
                        <label class="consent-option">
                            <input type="radio" name="adConsent" value="reject">
                            <span>Reject Ads</span>
                        </label>
                    </div>
                    <div class="consent-info">
                        <p>You can change this preference anytime in settings.</p>
                    </div>
                </div>
                <div class="consent-footer">
                    <button class="btn btn-primary consent-save">Save Preference</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Add event listeners
        dialog.querySelector('.consent-close').addEventListener('click', () => {
            dialog.remove();
        });

        dialog.querySelector('.consent-save').addEventListener('click', () => {
            const choice = dialog.querySelector('input[name="adConsent"]:checked').value;
            this.handleConsentChoice(choice);
            dialog.remove();
        });
    }

    handleConsentChoice(choice) {
        if (choice === 'accept') {
            this.consentGiven = true;
            localStorage.setItem('ad_consent', 'granted');
            this.loadAllAds();
        } else {
            this.consentGiven = false;
            localStorage.setItem('ad_consent', 'denied');
            this.hideAllAds();
        }
    }

    showAdSettings() {
        const settings = document.createElement('div');
        settings.className = 'ad-settings-modal';
        settings.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Advertisement Settings</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="setting-group">
                        <h4>Ad Preferences</h4>
                        <label class="setting-item">
                            <input type="checkbox" id="personalizedAds" ${this.getPersonalizedAdsPreference() ? 'checked' : ''}>
                            <span>Personalized Ads</span>
                        </label>
                        <label class="setting-item">
                            <input type="checkbox" id="adAnalytics" ${this.getAdAnalyticsPreference() ? 'checked' : ''}>
                            <span>Ad Analytics</span>
                        </label>
                    </div>
                    <div class="setting-group">
                        <h4>Ad Types</h4>
                        <label class="setting-item">
                            <input type="checkbox" id="bannerAds" checked disabled>
                            <span>Banner Ads</span>
                        </label>
                        <label class="setting-item">
                            <input type="checkbox" id="popunderAds" ${this.getPopunderPreference() ? 'checked' : ''}>
                            <span>Pop-under Ads</span>
                        </label>
                    </div>
                    <div class="setting-group">
                        <h4>Privacy</h4>
                        <button class="btn btn-secondary" id="resetAdConsent">Reset Consent</button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary save-settings">Save Settings</button>
                    <button class="btn btn-ghost cancel-settings">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(settings);

        // Add event listeners
        settings.querySelector('.modal-close').addEventListener('click', () => {
            settings.remove();
        });

        settings.querySelector('.cancel-settings').addEventListener('click', () => {
            settings.remove();
        });

        settings.querySelector('.save-settings').addEventListener('click', () => {
            this.saveAdSettings(settings);
            settings.remove();
        });

        settings.querySelector('#resetAdConsent').addEventListener('click', () => {
            localStorage.removeItem('ad_consent');
            localStorage.removeItem('ad_settings');
            this.checkUserConsent();
            settings.remove();
        });
    }

    getPersonalizedAdsPreference() {
        const settings = JSON.parse(localStorage.getItem('ad_settings') || '{}');
        return settings.personalizedAds !== false;
    }

    getAdAnalyticsPreference() {
        const settings = JSON.parse(localStorage.getItem('ad_settings') || '{}');
        return settings.adAnalytics !== false;
    }

    getPopunderPreference() {
        const settings = JSON.parse(localStorage.getItem('ad_settings') || '{}');
        return settings.popunderAds !== false;
    }

    saveAdSettings(modal) {
        const settings = {
            personalizedAds: modal.querySelector('#personalizedAds').checked,
            adAnalytics: modal.querySelector('#adAnalytics').checked,
            popunderAds: modal.querySelector('#popunderAds').checked,
            timestamp: Date.now()
        };

        localStorage.setItem('ad_settings', JSON.stringify(settings));
        
        // Apply settings
        if (settings.popunderAds) {
            this.enablePopunderAds();
        } else {
            this.disablePopunderAds();
        }
    }

    setupPerformanceOptimization() {
        // Setup lazy loading for ads
        if (this.config.performance.lazyLoading) {
            this.setupLazyLoading();
        }

        // Setup intersection observer for ad visibility
        this.setupVisibilityTracking();
    }

    setupLazyLoading() {
        const adObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.consentGiven) {
                    const placement = entry.target.getAttribute('data-ad-placement');
                    this.loadAd(placement);
                    adObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px'
        });

        document.querySelectorAll('.ad-container').forEach(container => {
            adObserver.observe(container);
        });
    }

    setupVisibilityTracking() {
        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const placement = entry.target.getAttribute('data-ad-placement');
                if (entry.isIntersecting) {
                    this.trackAdView(placement);
                }
            });
        }, {
            threshold: 0.5
        });

        document.querySelectorAll('.ad-container').forEach(container => {
            visibilityObserver.observe(container);
        });
    }

    loadCustomScript(scriptUrl, placement, container) {
        // Clear placeholder
        container.innerHTML = '';
        
        // Create script element
        const script = document.createElement('script');
        script.async = true;
        script.src = scriptUrl;
        
        script.onload = () => {
            console.log(`Custom script loaded for placement: ${placement}`);
            this.adsLoaded.add(placement);
            this.trackAdLoad(placement, 'success');
        };
        
        script.onerror = () => {
            console.error(`Failed to load custom script for placement: ${placement}`);
            this.handleAdLoadError(placement);
        };
        
        // Add script to container
        container.appendChild(script);
    }

    loadAdsterraScript() {
        if (!this.consentGiven) return;

        // Load Adsterra script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://a.magsrv.com/ad-provider.js`;
        script.setAttribute('data-siteid', this.config.adsterra.siteId);
        
        script.onload = () => {
            console.log('Adsterra script loaded successfully');
            this.loadAllAds();
        };
        
        script.onerror = () => {
            console.error('Failed to load Adsterra script');
            this.handleAdLoadError('adsterra_script');
        };

        document.head.appendChild(script);
    }

    loadAllAds() {
        if (!this.consentGiven) return;

        // Priority loading order for best performance
        const priorityOrder = ['campaign', 'smartlink', 'socialBar', 'popunder'];
        const standardPlacements = ['header', 'sidebar', 'footer', 'inContent'];

        // Load priority placements first
        priorityOrder.forEach(placement => {
            if (this.config.adsterra.placements[placement]) {
                if (!this.config.performance.lazyLoading || this.config.performance.preloadCritical) {
                    this.loadAd(placement);
                }
            }
        });

        // Load standard placements with lazy loading
        if (this.config.performance.lazyLoading) {
            standardPlacements.forEach(placement => {
                if (this.config.adsterra.placements[placement]) {
                    // Will load when in viewport
                }
            });
        } else {
            standardPlacements.forEach(placement => {
                if (this.config.adsterra.placements[placement]) {
                    this.loadAd(placement);
                }
            });
        }
    }

    loadAd(placement) {
        if (!this.consentGiven || this.adsLoaded.has(placement)) return;

        const config = this.config.adsterra.placements[placement];
        const container = document.getElementById(`ad-${placement}`);
        
        if (!container) return;

        try {
            // Handle custom script URLs (like popunder)
            if (config.scriptUrl) {
                this.loadCustomScript(config.scriptUrl, placement, container);
                return;
            }

            // Create Adsterra ad element
            const adElement = document.createElement('div');
            adElement.className = 'adsterra-ad';
            adElement.setAttribute('data-ad-slot', config.id);
            adElement.setAttribute('data-ad-format', config.type);
            
            if (config.size) {
                adElement.setAttribute('data-ad-size', config.size);
            }

            // Clear placeholder and add ad
            container.innerHTML = '';
            container.appendChild(adElement);

            // Initialize Adsterra ad
            if (window.AdProvider) {
                window.AdProvider.push([{
                    serve: {}
                }]);
            }

            this.adsLoaded.add(placement);
            this.trackAdLoad(placement, 'success');

        } catch (error) {
            console.error(`Failed to load ad for placement ${placement}:`, error);
            this.handleAdLoadError(placement);
        }
    }

    handleAdLoadError(placement) {
        const container = document.getElementById(`ad-${placement}`);
        if (!container) return;

        const retryCount = this.retryCount.get(placement) || 0;
        
        if (retryCount < this.config.performance.maxRetries) {
            this.retryCount.set(placement, retryCount + 1);
            
            // Retry after delay
            setTimeout(() => {
                this.loadAd(placement);
            }, 2000 * (retryCount + 1));
        } else {
            // Show error message
            container.innerHTML = `
                <div class="ad-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Advertisement unavailable</span>
                </div>
            `;
            
            this.trackAdLoad(placement, 'failed');
        }
    }

    hideAllAds() {
        document.querySelectorAll('.ad-container').forEach(container => {
            container.style.display = 'none';
        });
    }

    showAllAds() {
        document.querySelectorAll('.ad-container').forEach(container => {
            container.style.display = 'block';
        });
    }

    enablePopunderAds() {
        if (!this.consentGiven) return;

        const popunderConfig = this.config.adsterra.placements.popunder;
        
        // Initialize popunder ads
        if (window.AdProvider) {
            window.AdProvider.push([{
                serve: {
                    zoneId: popunderConfig.id
                }
            }]);
        }
    }

    disablePopunderAds() {
        // Disable popunder ads
        // This would typically require server-side configuration
        console.log('Popunder ads disabled');
    }

    trackAdLoad(placement, status) {
        if (window.privacyAnalytics) {
            window.privacyAnalytics.track('ad_load', {
                placement,
                status,
                retryCount: this.retryCount.get(placement) || 0
            });
        }
    }

    trackAdView(placement) {
        if (window.privacyAnalytics) {
            window.privacyAnalytics.track('ad_view', {
                placement,
                timestamp: Date.now()
            });
        }
    }

    trackAdClick(placement) {
        if (window.privacyAnalytics) {
            window.privacyAnalytics.track('ad_click', {
                placement,
                timestamp: Date.now()
            });
        }
    }

    // Public API methods
    updateConsent(consent) {
        this.consentGiven = consent;
        localStorage.setItem('ad_consent', consent ? 'granted' : 'denied');
        
        if (consent) {
            this.showAllAds();
            this.loadAllAds();
        } else {
            this.hideAllAds();
        }
    }

    getAdStatus() {
        return {
            consent: this.consentGiven,
            adsLoaded: Array.from(this.adsLoaded),
            totalPlacements: Object.keys(this.config.adsterra.placements).length
        };
    }

    refreshAds() {
        if (!this.consentGiven) return;

        this.adsLoaded.clear();
        this.retryCount.clear();
        this.loadAllAds();
    }
}

// Initialize ad manager
document.addEventListener('DOMContentLoaded', () => {
    window.adManager = new AdManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdManager;
}
