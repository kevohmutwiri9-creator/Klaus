// Security Enhancement Manager
class SecurityManager {
    constructor() {
        this.securityConfig = {
            csp: {
                'default-src': ["'self'"],
                'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://pagead2.googlesyndication.com"],
                'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
                'img-src': ["'self'", "data:", "https:", "blob:"],
                'font-src': ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
                'connect-src': ["'self'", "https://www.google-analytics.com", "https://api.github.com"],
                'media-src': ["'self'"],
                'object-src': ["'none'"],
                'base-uri': ["'self'"],
                'form-action': ["'self'"],
                'frame-ancestors': ["'none'"],
                'upgrade-insecure-requests': []
            },
            securityHeaders: {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
            }
        };
        
        this.init();
    }

    init() {
        this.setupCSPPolicy();
        this.setupSecurityHeaders();
        this.setupContentSecurity();
        this.setupFormSecurity();
        this.setupXSSProtection();
        this.setupCSRFProtection();
        this.setupInputValidation();
        this.setupSecureCookies();
        this.setupSecurityMonitoring();
        this.setupSecurityUI();
    }

    setupCSPPolicy() {
        // Generate CSP header
        const cspDirectives = Object.entries(this.securityConfig.csp)
            .map(([directive, sources]) => {
                const sourceList = sources.length > 0 ? ' ' + sources.join(' ') : '';
                return directive + sourceList;
            })
            .join('; ');

        // Add CSP meta tag for client-side enforcement
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = 'Content-Security-Policy';
        cspMeta.content = cspDirectives;
        document.head.appendChild(cspMeta);

        // Log CSP for debugging
        console.log('CSP Policy:', cspDirectives);
    }

    setupSecurityHeaders() {
        // Note: These headers would typically be set server-side
        // This is for client-side awareness and monitoring
        
        Object.entries(this.securityConfig.securityHeaders).forEach(([header, value]) => {
            // Store for reference and potential client-side checks
            this.securityConfig.securityHeaders[header] = value;
        });

        // Add security meta tags where applicable
        this.addSecurityMetaTags();
    }

    addSecurityMetaTags() {
        const securityMetaTags = [
            { name: 'referrer', content: 'strict-origin-when-cross-origin' },
            { name: 'robots', content: 'index, follow' },
            { httpEquiv: 'X-UA-Compatible', content: 'IE=edge' }
        ];

        securityMetaTags.forEach(tag => {
            const meta = document.createElement('meta');
            if (tag.httpEquiv) {
                meta.httpEquiv = tag.httpEquiv;
            } else {
                meta.name = tag.name;
            }
            meta.content = tag.content;
            document.head.appendChild(meta);
        });
    }

    setupContentSecurity() {
        // Secure external links
        this.secureExternalLinks();
        
        // Prevent mixed content
        this.preventMixedContent();
        
        // Validate resource loading
        this.validateResourceLoading();
    }

    secureExternalLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.hostname.includes(window.location.hostname)) {
                link.rel = 'noopener noreferrer';
                link.target = '_blank';
                
                // Add external link indicator
                if (!link.querySelector('.external-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.className = 'external-indicator';
                    indicator.innerHTML = ' <i class="fas fa-external-link-alt" aria-hidden="true"></i>';
                    indicator.style.fontSize = '0.8em';
                    indicator.style.opacity = '0.7';
                    link.appendChild(indicator);
                }
            }
        });
    }

    preventMixedContent() {
        // Check for mixed content warnings
        if (location.protocol === 'https:') {
            document.querySelectorAll('img[src^="http:"], script[src^="http:"], link[href^="http:"]').forEach(element => {
                console.warn('Mixed content detected:', element.src || element.href);
                // Upgrade to HTTPS if possible
                const src = element.src || element.href;
                if (src.startsWith('http://')) {
                    const httpsSrc = src.replace('http://', 'https://');
                    try {
                        if (element.src) element.src = httpsSrc;
                        if (element.href) element.href = httpsSrc;
                    } catch (e) {
                        console.warn('Failed to upgrade to HTTPS:', e);
                    }
                }
            });
        }
    }

    validateResourceLoading() {
        // Monitor resource loading for security issues
        const originalCreateElement = document.createElement;
        
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(this, tagName);
            
            if (tagName === 'script' || tagName === 'iframe' || tagName === 'object') {
                element.addEventListener('error', (e) => {
                    console.warn('Security: Failed to load resource:', e.target.src || e.target.data);
                    window.securityManager?.logSecurityEvent('resource_load_failed', {
                        tag: tagName,
                        src: e.target.src || e.target.data
                    });
                });
            }
            
            return element;
        };
    }

    setupFormSecurity() {
        // Secure all forms
        document.querySelectorAll('form').forEach(form => {
            this.secureForm(form);
        });

        // Monitor for dynamically added forms
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'FORM') {
                            this.secureForm(node);
                        } else if (node.querySelectorAll) {
                            node.querySelectorAll('form').forEach(form => {
                                this.secureForm(form);
                            });
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    secureForm(form) {
        // Add CSRF protection
        this.addCSRFToken(form);
        
        // Add form validation
        this.enhanceFormValidation(form);
        
        // Prevent form submission to external domains
        form.addEventListener('submit', (e) => {
            const action = form.action || window.location.href;
            if (action && !this.isAllowedDomain(action)) {
                e.preventDefault();
                console.warn('Form submission to external domain blocked:', action);
                this.showSecurityWarning('Form submission to external domain is not allowed.');
            }
        });
    }

    addCSRFToken(form) {
        if (form.querySelector('input[name="csrf_token"]')) return;
        
        const token = this.generateCSRFToken();
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = 'csrf_token';
        tokenInput.value = token;
        form.appendChild(tokenInput);
    }

    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    enhanceFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Sanitize input on change
            input.addEventListener('input', () => {
                this.sanitizeInput(input);
            });
            
            // Validate on blur
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });
    }

    sanitizeInput(input) {
        if (input.type === 'text' || input.type === 'textarea' || input.tagName === 'TEXTAREA') {
            // Remove potentially dangerous characters
            let value = input.value;
            value = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            value = value.replace(/javascript:/gi, '');
            value = value.replace(/on\w+\s*=/gi, '');
            input.value = value;
        }
    }

    validateInput(input) {
        // Check for common attack patterns
        const value = input.value.toLowerCase();
        const patterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /expression\s*\(/i,
            /@import/i,
            /vbscript:/i
        ];

        const isSuspicious = patterns.some(pattern => pattern.test(value));
        
        if (isSuspicious) {
            input.classList.add('security-warning');
            this.showSecurityWarning('Input contains potentially dangerous content and has been sanitized.');
            this.logSecurityEvent('suspicious_input', {
                inputName: input.name,
                inputType: input.type,
                value: value.substring(0, 100)
            });
        } else {
            input.classList.remove('security-warning');
        }
    }

    isAllowedDomain(url) {
        try {
            const urlObj = new URL(url);
            const allowedDomains = [
                window.location.hostname,
                'netlify.com',
                'forms.netlify.com'
            ];
            return allowedDomains.includes(urlObj.hostname);
        } catch (e) {
            return false;
        }
    }

    setupXSSProtection() {
        // DOM-based XSS protection
        this.setupDOMXSSProtection();
        
        // Content Security Policy violation monitoring
        this.setupCSPViolationMonitoring();
    }

    setupDOMXSSProtection() {
        // Override dangerous DOM methods
        const dangerousMethods = ['innerHTML', 'outerHTML', 'insertAdjacentHTML'];
        
        dangerousMethods.forEach(method => {
            const original = Element.prototype[method];
            
            Element.prototype[method] = function(...args) {
                const content = args[0];
                
                if (typeof content === 'string') {
                    // Check for dangerous content
                    if (this.containsXSS(content)) {
                        console.warn('XSS attempt blocked:', content);
                        window.securityManager?.logSecurityEvent('xss_attempt_blocked', {
                            method,
                            content: content.substring(0, 200)
                        });
                        return;
                    }
                }
                
                return original.apply(this, args);
            };
        });
    }

    containsXSS(content) {
        const xssPatterns = [
            /<script[^>]*>.*?<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe[^>]*>/gi,
            /<object[^>]*>/gi,
            /<embed[^>]*>/gi,
            /vbscript:/gi,
            /data:text\/html/gi
        ];

        return xssPatterns.some(pattern => pattern.test(content));
    }

    setupCSPViolationMonitoring() {
        document.addEventListener('securitypolicyviolation', (e) => {
            this.logSecurityEvent('csp_violation', {
                violatedDirective: e.violatedDirective,
                blockedURI: e.blockedURI,
                sourceFile: e.sourceFile,
                lineNumber: e.lineNumber,
                columnNumber: e.columnNumber
            });
        });
    }

    setupCSRFProtection() {
        // Double submit cookie pattern
        this.setupDoubleSubmitCookie();
        
        // SameSite cookie enforcement
        this.enforceSameSiteCookies();
    }

    setupDoubleSubmitCookie() {
        // Generate CSRF token for cookie
        const token = this.generateCSRFToken();
        document.cookie = `csrf_token=${token}; SameSite=Strict; Secure; Path=/; Max-Age=3600`;
    }

    enforceSameSiteCookies() {
        // Monitor cookie setting
        const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
        
        Object.defineProperty(document, 'cookie', {
            get: originalCookieDescriptor.get,
            set: function(value) {
                // Ensure SameSite attribute is present
                if (!value.includes('SameSite')) {
                    value += '; SameSite=Strict';
                }
                return originalCookieDescriptor.set.call(this, value);
            }
        });
    }

    setupInputValidation() {
        // Global input validation
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea')) {
                this.validateInput(e.target);
            }
        });
    }

    setupSecureCookies() {
        // Ensure all cookies have secure attributes
        const cookies = document.cookie.split(';');
        
        cookies.forEach(cookie => {
            const [name] = cookie.trim().split('=');
            if (name && !document.cookie.includes(`${name}=;`)) {
                // Re-set cookie with secure attributes
                const value = cookie.split('=')[1];
                document.cookie = `${name}=${value}; SameSite=Strict; Secure; Path=/`;
            }
        });
    }

    setupSecurityMonitoring() {
        // Monitor security events
        this.setupClickjackingProtection();
        this.setupCryptoMonitoring();
        this.setupNetworkSecurity();
    }

    setupClickjackingProtection() {
        // Frame busting
        if (window.top !== window.self) {
            window.top.location = window.self.location;
        }

        // Style to prevent clickjacking
        const style = document.createElement('style');
        style.textContent = `
            body {
                display: none;
            }
            
            html {
                display: block !important;
            }
        `;
        
        // Only apply if not in same-origin frame
        if (window.top === window.self) {
            document.head.appendChild(style);
        }
    }

    setupCryptoMonitoring() {
        // Monitor for crypto mining
        const originalWorker = window.Worker;
        
        window.Worker = function(scriptURL) {
            if (typeof scriptURL === 'string' && this.isCryptoMiningScript(scriptURL)) {
                console.warn('Crypto mining script blocked:', scriptURL);
                window.securityManager?.logSecurityEvent('crypto_mining_blocked', { scriptURL });
                throw new Error('Crypto mining scripts are not allowed');
            }
            
            return new originalWorker(scriptURL);
        }.bind(this);
    }

    isCryptoMiningScript(scriptURL) {
        const cryptoMiningPatterns = [
            /coinhive/i,
            /cryptoloot/i,
            /jsecoin/i,
            /minergate/i,
            /crypto-loot/i
        ];

        return cryptoMiningPatterns.some(pattern => pattern.test(scriptURL));
    }

    setupNetworkSecurity() {
        // Monitor fetch/XHR requests
        const originalFetch = window.fetch;
        
        window.fetch = function(...args) {
            const url = args[0];
            
            if (typeof url === 'string' && !window.securityManager.isAllowedDomain(url)) {
                console.warn('External request blocked:', url);
                window.securityManager?.logSecurityEvent('external_request_blocked', { url });
                return Promise.reject(new Error('External requests are not allowed'));
            }
            
            return originalFetch.apply(this, args);
        };
    }

    setupSecurityUI() {
        // Create security dashboard
        this.createSecurityDashboard();
        
        // Add security indicators
        this.addSecurityIndicators();
    }

    createSecurityDashboard() {
        const dashboard = document.createElement('div');
        dashboard.className = 'security-dashboard';
        dashboard.innerHTML = `
            <div class="security-header">
                <h3>Security Status</h3>
                <button class="security-close">&times;</button>
            </div>
            <div class="security-content">
                <div class="security-status">
                    <div class="status-item">
                        <span class="status-label">CSP:</span>
                        <span class="status-value active">Active</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">XSS Protection:</span>
                        <span class="status-value active">Active</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">CSRF Protection:</span>
                        <span class="status-value active">Active</span>
                    </div>
                </div>
                <div class="security-events">
                    <h4>Recent Security Events</h4>
                    <div class="events-list" id="securityEventsList"></div>
                </div>
            </div>
        `;

        dashboard.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1rem;
            max-width: 400px;
            z-index: 10000;
            display: none;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(dashboard);

        // Add event listeners
        dashboard.querySelector('.security-close').addEventListener('click', () => {
            dashboard.style.display = 'none';
        });

        // Add keyboard shortcut (Ctrl+Shift+S)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.toggleSecurityDashboard();
            }
        });
    }

    addSecurityIndicators() {
        const indicator = document.createElement('div');
        indicator.className = 'security-indicator';
        indicator.innerHTML = `
            <i class="fas fa-shield-alt"></i>
            <span class="security-tooltip">Security: Protected</span>
        `;

        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            cursor: pointer;
            z-index: 9999;
            transition: all 0.3s ease;
        `;

        indicator.addEventListener('click', () => {
            this.toggleSecurityDashboard();
        });

        indicator.addEventListener('mouseenter', () => {
            indicator.style.transform = 'scale(1.1)';
        });

        indicator.addEventListener('mouseleave', () => {
            indicator.style.transform = 'scale(1)';
        });

        document.body.appendChild(indicator);
    }

    toggleSecurityDashboard() {
        const dashboard = document.querySelector('.security-dashboard');
        dashboard.style.display = dashboard.style.display === 'none' ? 'block' : 'none';
        
        if (dashboard.style.display === 'block') {
            this.updateSecurityEvents();
        }
    }

    logSecurityEvent(eventType, data = {}) {
        const event = {
            type: eventType,
            timestamp: new Date().toISOString(),
            data: data
        };

        // Store in localStorage
        const events = JSON.parse(localStorage.getItem('security_events') || '[]');
        events.unshift(event);
        
        // Keep only last 50 events
        if (events.length > 50) {
            events.splice(50);
        }
        
        localStorage.setItem('security_events', JSON.stringify(events));
        
        // Update dashboard if visible
        if (document.querySelector('.security-dashboard').style.display !== 'none') {
            this.updateSecurityEvents();
        }
    }

    updateSecurityEvents() {
        const eventsList = document.getElementById('securityEventsList');
        const events = JSON.parse(localStorage.getItem('security_events') || '[]');
        
        if (events.length === 0) {
            eventsList.innerHTML = '<p>No security events recorded.</p>';
            return;
        }

        const eventsHTML = events.slice(0, 10).map(event => `
            <div class="security-event">
                <div class="event-type">${event.type}</div>
                <div class="event-time">${new Date(event.timestamp).toLocaleString()}</div>
                ${event.data ? `<div class="event-details">${JSON.stringify(event.data, null, 2)}</div>` : ''}
            </div>
        `).join('');

        eventsList.innerHTML = eventsHTML;
    }

    showSecurityWarning(message) {
        const warning = document.createElement('div');
        warning.className = 'security-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button class="warning-close">&times;</button>
            </div>
        `;

        warning.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--warning-color);
            color: var(--bg-primary);
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10001;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            max-width: 500px;
        `;

        document.body.appendChild(warning);

        warning.querySelector('.warning-close').addEventListener('click', () => {
            warning.remove();
        });

        setTimeout(() => warning.remove(), 5000);
    }

    // Public API methods
    getSecurityStatus() {
        return {
            csp: 'Active',
            xssProtection: 'Active',
            csrfProtection: 'Active',
            secureCookies: 'Active',
            lastSecurityEvent: localStorage.getItem('last_security_event')
        };
    }

    generateSecureToken() {
        return this.generateCSRFToken();
    }

    validateURL(url) {
        return this.isAllowedDomain(url);
    }

    sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }
}

// Initialize security manager
document.addEventListener('DOMContentLoaded', () => {
    window.securityManager = new SecurityManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityManager;
}
