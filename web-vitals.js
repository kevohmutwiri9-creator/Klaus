// Core Web Vitals monitoring
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'https://unpkg.com/web-vitals@3/dist/web-vitals.js?module';

function sendToAnalytics(metric) {
  // Send to Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
      custom_map: {
        'dimension1': 'web_vitals_rating'
      }
    });

    // Add rating dimension
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      'web_vitals_rating': metric.rating,
      non_interaction: true
    });
  }

  // Console logging for development
  console.log(`[Web Vitals] ${metric.name}: ${metric.value} (${metric.rating})`);
}

// Track all Core Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// PerformanceObserver for additional metrics
if ('PerformanceObserver' in window) {
  const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log(`[Performance] LCP: ${entry.startTime}ms`);
      }
      if (entry.entryType === 'first-input') {
        console.log(`[Performance] FID: ${entry.processingStart - entry.startTime}ms`);
      }
      if (entry.entryType === 'layout-shift') {
        if (!entry.hadRecentInput) {
          console.log(`[Performance] CLS: ${entry.value}`);
        }
      }
    }
  });

  perfObserver.observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});
}

// Page load performance
window.addEventListener('load', () => {
  setTimeout(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    if (perfData) {
      const pageLoadTime = perfData.loadEventEnd - perfData.loadEventStart;
      const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
      
      console.log(`[Performance] Page Load Time: ${pageLoadTime}ms`);
      console.log(`[Performance] DOM Content Loaded: ${domContentLoaded}ms`);
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'page_load_time', {
          event_category: 'Performance',
          value: Math.round(pageLoadTime),
          non_interaction: true
        });
      }
    }
  }, 0);
});
