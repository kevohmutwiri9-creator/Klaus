// Advanced Performance Monitoring System
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            navigation: {},
            resources: [],
            vitals: {},
            memory: {},
            network: {},
            errors: [],
            userInteractions: []
        };
        this.observers = [];
        this.thresholds = {
            lcp: 2500,      // Largest Contentful Paint
            fid: 100,       // First Input Delay
            cls: 0.1,       // Cumulative Layout Shift
            fcp: 1800,      // First Contentful Paint
            ttfb: 600       // Time to First Byte
        };
        this.init();
    }

    init() {
        this.setupNavigationTiming();
        this.setupResourceTiming();
        this.setupCoreWebVitals();
        this.setupMemoryMonitoring();
        this.setupNetworkMonitoring();
        this.setupErrorTracking();
        this.setupUserInteractionTracking();
        this.setupPerformanceObserver();
        this.startContinuousMonitoring();
    }

    setupNavigationTiming() {
        if ('performance' in window && 'timing' in performance) {
            const timing = performance.timing;
            
            this.metrics.navigation = {
                dns: timing.domainLookupEnd - timing.domainLookupStart,
                tcp: timing.connectEnd - timing.connectStart,
                ssl: timing.secureConnectionStart > 0 ? timing.connectEnd - timing.secureConnectionStart : 0,
                ttfb: timing.responseStart - timing.navigationStart,
                domLoad: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
                windowLoad: timing.loadEventEnd - timing.loadEventStart,
                totalLoadTime: timing.loadEventEnd - timing.navigationStart
            };

            this.checkThresholds();
        }
    }

    setupResourceTiming() {
        if ('performance' in window && 'getEntriesByType' in performance) {
            const resources = performance.getEntriesByType('resource');
            
            this.metrics.resources = resources.map(resource => ({
                name: this.sanitizeUrl(resource.name),
                type: this.getResourceType(resource.name),
                size: resource.transferSize || 0,
                duration: resource.duration,
                startTime: resource.startTime,
                responseEnd: resource.responseEnd
            }));

            this.analyzeResourcePerformance();
        }
    }

    setupCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        this.observeLCP();
        
        // First Input Delay (FID)
        this.observeFID();
        
        // Cumulative Layout Shift (CLS)
        this.observeCLS();
        
        // First Contentful Paint (FCP)
        this.observeFCP();
    }

    observeLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.metrics.vitals.lcp = {
                    value: lastEntry.renderTime || lastEntry.loadTime,
                    element: this.getElementSelector(lastEntry.element),
                    timestamp: Date.now()
                };

                this.checkVitalThreshold('lcp', this.metrics.vitals.lcp.value);
                this.reportMetric('LCP', this.metrics.vitals.lcp.value);
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.push(observer);
        }
    }

    observeFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.vitals.fid = {
                        value: entry.processingStart - entry.startTime,
                        eventType: entry.name,
                        timestamp: Date.now()
                    };

                    this.checkVitalThreshold('fid', this.metrics.vitals.fid.value);
                    this.reportMetric('FID', this.metrics.vitals.fid.value);
                });
            });
            
            observer.observe({ entryTypes: ['first-input'] });
            this.observers.push(observer);
        }
    }

    observeCLS() {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            let clsEntries = [];
            
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        clsEntries.push({
                            value: entry.value,
                            source: this.getElementSelector(entry.source),
                            timestamp: entry.startTime
                        });
                    }
                });
                
                this.metrics.vitals.cls = {
                    value: clsValue,
                    entries: clsEntries,
                    timestamp: Date.now()
                };

                this.checkVitalThreshold('cls', this.metrics.vitals.cls.value);
                this.reportMetric('CLS', this.metrics.vitals.cls.value);
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(observer);
        }
    }

    observeFCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
                
                if (fcpEntry) {
                    this.metrics.vitals.fcp = {
                        value: fcpEntry.startTime,
                        timestamp: Date.now()
                    };

                    this.checkVitalThreshold('fcp', this.metrics.vitals.fcp.value);
                    this.reportMetric('FCP', this.metrics.vitals.fcp.value);
                }
            });
            
            observer.observe({ entryTypes: ['paint'] });
            this.observers.push(observer);
        }
    }

    setupMemoryMonitoring() {
        if ('memory' in performance) {
            const updateMemoryInfo = () => {
                this.metrics.memory = {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
                    timestamp: Date.now()
                };

                this.checkMemoryUsage();
            };

            // Update memory info every 5 seconds
            setInterval(updateMemoryInfo, 5000);
            updateMemoryInfo();
        }
    }

    setupNetworkMonitoring() {
        if ('connection' in navigator) {
            const updateNetworkInfo = () => {
                this.metrics.network = {
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink,
                    rtt: navigator.connection.rtt,
                    saveData: navigator.connection.saveData,
                    timestamp: Date.now()
                };
            };

            updateNetworkInfo();
            
            // Listen for network changes
            navigator.connection.addEventListener('change', updateNetworkInfo);
        }
    }

    setupErrorTracking() {
        // Track JavaScript errors
        window.addEventListener('error', (event) => {
            this.metrics.errors.push({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: Date.now()
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.metrics.errors.push({
                type: 'promise',
                reason: event.reason,
                timestamp: Date.now()
            });
        });

        // Track resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.metrics.errors.push({
                    type: 'resource',
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    timestamp: Date.now()
                });
            }
        }, true);
    }

    setupUserInteractionTracking() {
        // Track click events
        document.addEventListener('click', (event) => {
            this.metrics.userInteractions.push({
                type: 'click',
                target: this.getElementSelector(event.target),
                timestamp: Date.now(),
                page: window.location.href
            });
        });

        // Track scroll events (throttled)
        let scrollTimeout;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.metrics.userInteractions.push({
                    type: 'scroll',
                    depth: this.getScrollDepth(),
                    timestamp: Date.now(),
                    page: window.location.href
                });
            }, 100);
        });
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            // Observe long tasks
            try {
                const longTaskObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        this.reportLongTask(entry);
                    });
                });
                
                longTaskObserver.observe({ entryTypes: ['longtask'] });
                this.observers.push(longTaskObserver);
            } catch (e) {
                console.log('Long task observation not supported');
            }

            // Observe measure events
            const measureObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.reportCustomMeasure(entry);
                });
            });
            
            measureObserver.observe({ entryTypes: ['measure'] });
            this.observers.push(measureObserver);
        }
    }

    startContinuousMonitoring() {
        // Collect metrics every 30 seconds
        setInterval(() => {
            this.collectMetrics();
        }, 30000);

        // Send metrics to server every 5 minutes
        setInterval(() => {
            this.sendMetrics();
        }, 300000);
    }

    collectMetrics() {
        // Update resource timing
        this.setupResourceTiming();
        
        // Check for performance issues
        this.checkPerformanceIssues();
        
        // Log current state
        console.log('Performance metrics collected:', this.getSummary());
    }

    checkThresholds() {
        const issues = [];
        
        // Check navigation timing
        if (this.metrics.navigation.ttfb > this.thresholds.ttfb) {
            issues.push({
                type: 'slow-server',
                metric: 'ttfb',
                value: this.metrics.navigation.ttfb,
                threshold: this.thresholds.ttfb
            });
        }
        
        if (issues.length > 0) {
            this.reportPerformanceIssues(issues);
        }
    }

    checkVitalThreshold(vital, value) {
        if (value > this.thresholds[vital]) {
            this.reportPerformanceIssue({
                type: 'slow-vital',
                vital,
                value,
                threshold: this.thresholds[vital]
            });
        }
    }

    checkMemoryUsage() {
        if (this.metrics.memory.usedJSHeapSize > this.metrics.memory.jsHeapSizeLimit * 0.8) {
            this.reportPerformanceIssue({
                type: 'high-memory',
                usage: this.metrics.memory.usedJSHeapSize,
                limit: this.metrics.memory.jsHeapSizeLimit
            });
        }
    }

    checkPerformanceIssues() {
        const issues = [];
        
        // Check for slow resources
        const slowResources = this.metrics.resources.filter(r => r.duration > 3000);
        if (slowResources.length > 0) {
            issues.push({
                type: 'slow-resources',
                resources: slowResources
            });
        }
        
        // Check for large resources
        const largeResources = this.metrics.resources.filter(r => r.size > 1000000); // 1MB
        if (largeResources.length > 0) {
            issues.push({
                type: 'large-resources',
                resources: largeResources
            });
        }
        
        if (issues.length > 0) {
            this.reportPerformanceIssues(issues);
        }
    }

    analyzeResourcePerformance() {
        const resourceTypes = {};
        
        this.metrics.resources.forEach(resource => {
            if (!resourceTypes[resource.type]) {
                resourceTypes[resource.type] = {
                    count: 0,
                    totalSize: 0,
                    totalDuration: 0,
                    averageDuration: 0
                };
            }
            
            resourceTypes[resource.type].count++;
            resourceTypes[resource.type].totalSize += resource.size;
            resourceTypes[resource.type].totalDuration += resource.duration;
        });
        
        // Calculate averages
        Object.keys(resourceTypes).forEach(type => {
            const stats = resourceTypes[type];
            stats.averageDuration = stats.totalDuration / stats.count;
            stats.averageSize = stats.totalSize / stats.count;
        });
        
        this.metrics.resourceAnalysis = resourceTypes;
    }

    reportMetric(name, value) {
        console.log(`Performance Metric - ${name}: ${value}ms`);
        
        // Send to analytics if available
        if (window.privacyAnalytics) {
            window.privacyAnalytics.track('performance_metric', {
                metric: name,
                value: value
            });
        }
    }

    reportLongTask(entry) {
        console.warn(`Long task detected: ${entry.duration}ms`);
        
        if (window.privacyAnalytics) {
            window.privacyAnalytics.track('long_task', {
                duration: entry.duration,
                startTime: entry.startTime
            });
        }
    }

    reportCustomMeasure(entry) {
        console.log(`Custom measure - ${entry.name}: ${entry.duration}ms`);
    }

    reportPerformanceIssue(issue) {
        console.warn('Performance issue detected:', issue);
        
        if (window.privacyAnalytics) {
            window.privacyAnalytics.track('performance_issue', issue);
        }
    }

    reportPerformanceIssues(issues) {
        console.warn('Multiple performance issues detected:', issues);
        
        if (window.privacyAnalytics) {
            window.privacyAnalytics.track('performance_issues', { issues });
        }
    }

    getResourceType(url) {
        if (url.includes('.css')) return 'stylesheet';
        if (url.includes('.js')) return 'script';
        if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
        if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
        if (url.includes('/api/')) return 'api';
        return 'other';
    }

    sanitizeUrl(url) {
        const urlObj = new URL(url);
        return urlObj.origin + urlObj.pathname;
    }

    getElementSelector(element) {
        if (!element) return 'unknown';
        
        if (element.id) return `#${element.id}`;
        if (element.className) return `.${element.className.split(' ')[0]}`;
        return element.tagName.toLowerCase();
    }

    getScrollDepth() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.round((scrollTop / scrollHeight) * 100);
    }

    getSummary() {
        return {
            vitals: this.metrics.vitals,
            navigation: this.metrics.navigation,
            resourceCount: this.metrics.resources.length,
            errorCount: this.metrics.errors.length,
            memoryUsage: this.metrics.memory.usedJSHeapSize,
            networkType: this.metrics.network.effectiveType
        };
    }

    async sendMetrics() {
        // Send metrics to server for analysis
        try {
            const response = await fetch('/api/performance-metrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    metrics: this.metrics,
                    userAgent: navigator.userAgent,
                    timestamp: Date.now()
                })
            });
            
            if (response.ok) {
                console.log('Performance metrics sent successfully');
            }
        } catch (error) {
            console.error('Error sending performance metrics:', error);
        }
    }

    // Public API methods
    measure(name, fn) {
        const startTime = performance.now();
        const result = fn();
        const endTime = performance.now();
        
        performance.mark(`${name}-start`);
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        console.log(`Custom measure - ${name}: ${endTime - startTime}ms`);
        return result;
    }

    mark(name) {
        performance.mark(name);
    }

    getMetrics() {
        return this.metrics;
    }

    getReport() {
        return {
            summary: this.getSummary(),
            vitals: this.metrics.vitals,
            navigation: this.metrics.navigation,
            resourceAnalysis: this.metrics.resourceAnalysis,
            errors: this.metrics.errors,
            recommendations: this.getRecommendations()
        };
    }

    getRecommendations() {
        const recommendations = [];
        
        // LCP recommendations
        if (this.metrics.vitals.lcp?.value > this.thresholds.lcp) {
            recommendations.push({
                metric: 'LCP',
                issue: 'Slow largest contentful paint',
                suggestions: [
                    'Optimize images (use WebP, lazy loading)',
                    'Remove render-blocking resources',
                    'Improve server response time'
                ]
            });
        }
        
        // FID recommendations
        if (this.metrics.vitals.fid?.value > this.thresholds.fid) {
            recommendations.push({
                metric: 'FID',
                issue: 'Slow first input delay',
                suggestions: [
                    'Reduce JavaScript execution time',
                    'Code split JavaScript',
                    'Use web workers for heavy computations'
                ]
            });
        }
        
        // CLS recommendations
        if (this.metrics.vitals.cls?.value > this.thresholds.cls) {
            recommendations.push({
                metric: 'CLS',
                issue: 'High cumulative layout shift',
                suggestions: [
                    'Include size attributes for images and videos',
                    'Reserve space for dynamic content',
                    'Avoid inserting content above existing content'
                ]
            });
        }
        
        return recommendations;
    }

    destroy() {
        // Disconnect all observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// Initialize performance monitor
document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitor = new PerformanceMonitor();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}
