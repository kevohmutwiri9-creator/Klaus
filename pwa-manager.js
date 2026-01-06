// Progressive Web App Manager
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = null;
        this.isInstalled = false;
        this.init();
    }

    init() {
        this.setupInstallPrompt();
        this.setupServiceWorkerUpdates();
        this.setupOfflineIndicator();
        this.setupInstallButton();
        this.checkInstallationStatus();
        this.setupShareAPI();
        this.setupPushNotifications();
    }

    setupInstallPrompt() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
            this.trackEvent('pwa_install_prompt_shown');
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.hideInstallButton();
            this.showInstallationSuccess();
            this.trackEvent('pwa_install_completed');
        });
    }

    setupServiceWorkerUpdates() {
        // Check for service worker updates
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                // New service worker is active, show refresh notification
                this.showUpdateNotification();
            });

            // Listen for messages from service worker
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
                    this.showUpdateNotification();
                }
            });
        }
    }

    setupOfflineIndicator() {
        // Show/hide offline indicator based on connection status
        window.addEventListener('online', () => {
            this.hideOfflineIndicator();
            this.showOnlineNotification();
        });

        window.addEventListener('offline', () => {
            this.showOfflineIndicator();
        });

        // Check initial status
        if (!navigator.onLine) {
            this.showOfflineIndicator();
        }
    }

    setupInstallButton() {
        // Create install button if it doesn't exist
        if (!document.getElementById('pwa-install-button')) {
            this.installButton = document.createElement('button');
            this.installButton.id = 'pwa-install-button';
            this.installButton.className = 'pwa-install-button';
            this.installButton.innerHTML = `
                <i class="fas fa-download"></i>
                <span>Install App</span>
            `;
            this.installButton.addEventListener('click', () => this.installPWA());
            
            // Add styles
            this.installButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--gradient-primary);
                color: var(--bg-primary);
                border: none;
                padding: 12px 20px;
                border-radius: 50px;
                cursor: pointer;
                font-weight: 600;
                box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
                z-index: 9999;
                display: none;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            `;

            this.installButton.addEventListener('mouseenter', () => {
                this.installButton.style.transform = 'translateY(-2px)';
                this.installButton.style.boxShadow = '0 15px 40px rgba(0, 212, 255, 0.4)';
            });

            this.installButton.addEventListener('mouseleave', () => {
                this.installButton.style.transform = 'translateY(0)';
                this.installButton.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.3)';
            });

            document.body.appendChild(this.installButton);
        }
    }

    showInstallButton() {
        if (this.installButton && !this.isInstalled) {
            this.installButton.style.display = 'flex';
            
            // Animate in
            setTimeout(() => {
                this.installButton.style.opacity = '1';
                this.installButton.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    hideInstallButton() {
        if (this.installButton) {
            this.installButton.style.opacity = '0';
            this.installButton.style.transform = 'translateY(100px)';
            
            setTimeout(() => {
                this.installButton.style.display = 'none';
            }, 300);
        }
    }

    async installPWA() {
        if (!this.deferredPrompt) {
            console.log('PWA installation prompt not available');
            return;
        }

        try {
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for user response
            const result = await this.deferredPrompt.userChoice;
            
            if (result.outcome === 'accepted') {
                this.trackEvent('pwa_install_accepted');
                console.log('PWA installation accepted');
            } else {
                this.trackEvent('pwa_install_rejected');
                console.log('PWA installation rejected');
            }
            
            // Clear the deferred prompt
            this.deferredPrompt = null;
            
        } catch (error) {
            console.error('Error during PWA installation:', error);
            this.trackEvent('pwa_install_error', { error: error.message });
        }
    }

    checkInstallationStatus() {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            this.hideInstallButton();
        }

        // Check if running in PWA mode
        if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
            document.body.classList.add('pwa-mode');
            this.trackEvent('pwa_mode_active');
        }
    }

    showInstallationSuccess() {
        this.showNotification('App installed successfully!', 'success', 5000);
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-sync-alt"></i>
                <span>A new version is available!</span>
                <button class="update-button">Update</button>
                <button class="dismiss-button">Dismiss</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--primary-color);
            border-radius: 10px;
            padding: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 300px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Handle buttons
        const updateButton = notification.querySelector('.update-button');
        const dismissButton = notification.querySelector('.dismiss-button');

        updateButton.addEventListener('click', () => {
            window.location.reload();
        });

        dismissButton.addEventListener('click', () => {
            this.hideNotification(notification);
        });

        // Auto-hide after 10 seconds
        setTimeout(() => {
            this.hideNotification(notification);
        }, 10000);
    }

    showOfflineIndicator() {
        if (!document.getElementById('offline-indicator')) {
            const indicator = document.createElement('div');
            indicator.id = 'offline-indicator';
            indicator.className = 'offline-indicator';
            indicator.innerHTML = `
                <i class="fas fa-wifi-slash"></i>
                <span>You're offline. Some features may be limited.</span>
            `;

            indicator.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: var(--warning-color);
                color: var(--bg-primary);
                padding: 0.75rem;
                text-align: center;
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                font-weight: 500;
                transform: translateY(-100%);
                transition: transform 0.3s ease;
            `;

            document.body.appendChild(indicator);

            // Animate in
            setTimeout(() => {
                indicator.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    hideOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                indicator.remove();
            }, 300);
        }
    }

    showOnlineNotification() {
        this.showNotification('You\'re back online!', 'success', 3000);
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `pwa-notification pwa-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="close-button">×</button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid ${this.getNotificationColor(type)};
            border-radius: 10px;
            padding: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 300px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Handle close button
        const closeButton = notification.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            this.hideNotification(notification);
        });

        // Auto-hide
        setTimeout(() => {
            this.hideNotification(notification);
        }, duration);
    }

    hideNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            'success': 'var(--success-color)',
            'error': 'var(--danger-color)',
            'warning': 'var(--warning-color)',
            'info': 'var(--primary-color)'
        };
        return colors[type] || 'var(--primary-color)';
    }

    setupShareAPI() {
        // Add share functionality if Web Share API is available
        if (navigator.share) {
            this.addShareButton();
        }
    }

    addShareButton() {
        const shareButton = document.createElement('button');
        shareButton.className = 'share-button';
        shareButton.innerHTML = `
            <i class="fas fa-share-alt"></i>
            <span>Share</span>
        `;
        shareButton.addEventListener('click', () => this.shareContent());

        shareButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
            padding: 12px 20px;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(shareButton);
    }

    async shareContent() {
        try {
            await navigator.share({
                title: 'Klaus - Full-Stack Developer Portfolio',
                text: 'Check out my portfolio showcasing web development projects and technical expertise.',
                url: window.location.href
            });
            this.trackEvent('content_shared');
        } catch (error) {
            console.log('Share cancelled or failed:', error);
        }
    }

    setupPushNotifications() {
        // Request notification permission and setup push notifications
        if ('Notification' in window && 'serviceWorker' in navigator) {
            this.requestNotificationPermission();
        }
    }

    async requestNotificationPermission() {
        if (Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    this.trackEvent('notification_permission_granted');
                    console.log('Notification permission granted');
                }
            } catch (error) {
                console.error('Error requesting notification permission:', error);
            }
        }
    }

    trackEvent(eventName, data = {}) {
        // Google Analytics 4 event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }

        // Custom analytics tracking
        console.log('PWA Analytics Event:', eventName, data);
    }

    // Public API methods
    async install() {
        return this.installPWA();
    }

    isPWAInstalled() {
        return this.isInstalled;
    }

    isOffline() {
        return !navigator.onLine;
    }

    async showInstallPrompt() {
        if (this.deferredPrompt) {
            return this.installPWA();
        }
        return false;
    }
}

// Initialize PWA manager
document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWAManager;
}
