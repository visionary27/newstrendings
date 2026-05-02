/**
 * NewsTrendings - Analytics Integration
 * Configure your analytics tracking here
 */

// ============================================
// GOOGLE ANALYTICS 4 (GA4) CONFIGURATION
// ============================================

/**
 * SETUP INSTRUCTIONS:
 * 1. Create a GA4 property at https://analytics.google.com
 * 2. Get your Measurement ID (format: G-XXXXXXXXXX)
 * 3. Replace 'GA_MEASUREMENT_ID' below with your actual ID
 * 4. Uncomment the configuration code below
 * 5. Uncomment the script tag in your HTML files
 */

// Configuration
const GA_MEASUREMENT_ID = 'GA_MEASUREMENT_ID'; // Replace with your actual ID

// Initialize Google Analytics 4
/*
(function() {
    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        'send_page_view': true,
        'anonymize_ip': true // GDPR compliance
    });

    console.log('Google Analytics initialized:', GA_MEASUREMENT_ID);
})();
*/

// ============================================
// CLOUDFLARE WEB ANALYTICS (Alternative - Privacy-Friendly)
// ============================================

/**
 * SETUP INSTRUCTIONS:
 * 1. Go to Cloudflare Dashboard → Analytics → Web Analytics
 * 2. Add your site (newstrendings.com)
 * 3. Get the beacon token
 * 4. Replace 'YOUR_BEACON_TOKEN' below
 * 5. Uncomment the code
 */

/*
(function() {
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.setAttribute('data-cf-beacon', '{"token": "YOUR_BEACON_TOKEN"}');
    document.head.appendChild(script);
    
    console.log('Cloudflare Analytics initialized');
})();
*/

// ============================================
// CUSTOM EVENT TRACKING
// ============================================

/**
 * Track custom events
 * @param {string} category - Event category (e.g., 'Article', 'Social', 'Ads')
 * @param {string} action - Event action (e.g., 'Click', 'View', 'Share')
 * @param {string} label - Event label (e.g., article title, button name)
 * @param {number} value - Optional numeric value
 */
function trackEvent(category, action, label, value = null) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        const eventParams = {
            'event_category': category,
            'event_label': label
        };
        if (value !== null) {
            eventParams.value = value;
        }
        gtag('event', action, eventParams);
    }

    // Console log for debugging
    console.log('Event tracked:', { category, action, label, value });

    // Custom analytics endpoint (optional)
    // sendToCustomAnalytics({ category, action, label, value });
}

/**
 * Track page views (for SPAs)
 * @param {string} url - Page URL
 * @param {string} title - Page title
 */
function trackPageView(url, title) {
    if (typeof gtag !== 'undefined') {
        gtag('config', GA_MEASUREMENT_ID, {
            'page_path': url,
            'page_title': title
        });
    }
    console.log('Page view tracked:', url, title);
}

/**
 * Track article reads
 * @param {string} articleTitle - Article title
 * @param {string} category - Article category
 * @param {number} readDepth - Percentage read (0-100)
 */
function trackArticleRead(articleTitle, category, readDepth) {
    trackEvent('Article', 'Read', articleTitle, readDepth);
    
    // Additional tracking for milestone percentages
    if (readDepth >= 25 && !window._tracked25) {
        trackEvent('Article', 'Read25%', articleTitle);
        window._tracked25 = true;
    }
    if (readDepth >= 50 && !window._tracked50) {
        trackEvent('Article', 'Read50%', articleTitle);
        window._tracked50 = true;
    }
    if (readDepth >= 75 && !window._tracked75) {
        trackEvent('Article', 'Read75%', articleTitle);
        window._tracked75 = true;
    }
    if (readDepth >= 100 && !window._tracked100) {
        trackEvent('Article', 'Read100%', articleTitle);
        window._tracked100 = true;
    }
}

/**
 * Track ad impressions (for RollerAds or other ad networks)
 * @param {string} adZone - Ad zone identifier
 * @param {string} adType - Type of ad
 */
function trackAdImpression(adZone, adType) {
    trackEvent('Ads', 'Impression', `${adZone} - ${adType}`);
}

/**
 * Track ad clicks
 * @param {string} adZone - Ad zone identifier
 * @param {string} adType - Type of ad
 */
function trackAdClick(adZone, adType) {
    trackEvent('Ads', 'Click', `${adZone} - ${adType}`);
}

/**
 * Track social shares
 * @param {string} platform - Social platform (Facebook, Twitter, etc.)
 * @param {string} articleTitle - Article being shared
 */
function trackSocialShare(platform, articleTitle) {
    trackEvent('Social', 'Share', `${platform} - ${articleTitle}`);
}

/**
 * Track outbound links
 * @param {string} url - Destination URL
 * @param {string} linkText - Link text/context
 */
function trackOutboundLink(url, linkText) {
    trackEvent('Outbound', 'Click', `${linkText} - ${url}`);
}

/**
 * Track search queries (if you add site search)
 * @param {string} query - Search query
 * @param {number} results - Number of results
 */
function trackSearch(query, results) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'search', {
            'search_term': query,
            'num_results': results
        });
    }
}

/**
 * Track time on page
 */
function trackTimeOnPage() {
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        trackEvent('Engagement', 'TimeOnPage', document.title, timeSpent);
    });
}

// ============================================
// AUTOMATIC TRACKING INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Track time on page
    trackTimeOnPage();

    // Track scroll depth for articles
    if (document.querySelector('.article-content')) {
        initScrollTracking();
    }

    // Track outbound links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.addEventListener('click', function() {
                trackOutboundLink(this.href, this.textContent.trim());
            });
        }
    });

    // Track newsletter signups
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function() {
            trackEvent('Newsletter', 'Subscribe', 'Footer Form');
        });
    }

});

// ============================================
// SCROLL DEPTH TRACKING
// ============================================

function initScrollTracking() {
    const article = document.querySelector('.article-content');
    if (!article) return;

    let maxScroll = 0;

    window.addEventListener('scroll', debounce(function() {
        const windowHeight = window.innerHeight;
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const scrollPercent = Math.min(
            Math.max(
                ((scrollTop + windowHeight - articleTop) / articleHeight) * 100,
                0
            ),
            100
        );

        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            const articleTitle = document.querySelector('.article-title')?.textContent || document.title;
            const category = document.querySelector('.article-category')?.textContent || 'Uncategorized';
            trackArticleRead(articleTitle, category, Math.floor(scrollPercent));
        }
    }, 1000));
}

// ============================================
// USER ENGAGEMENT METRICS
// ============================================

/**
 * Track session duration
 */
let sessionStart = Date.now();

window.addEventListener('beforeunload', function() {
    const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);
    trackEvent('Engagement', 'SessionDuration', 'Total', sessionDuration);
});

/**
 * Track user interactions
 */
let interactionCount = 0;

document.addEventListener('click', function() {
    interactionCount++;
});

document.addEventListener('scroll', debounce(function() {
    interactionCount++;
}, 1000));

/**
 * Bounce rate calculation helper
 */
function isEngaged() {
    const timeOnSite = (Date.now() - sessionStart) / 1000;
    return timeOnSite > 30 || interactionCount > 5;
}

// ============================================
// PERFORMANCE TRACKING
// ============================================

window.addEventListener('load', function() {
    setTimeout(function() {
        if ('performance' in window) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const dnsTime = perfData.domainLookupEnd - perfData.domainLookupStart;
            const tcpTime = perfData.connectEnd - perfData.connectStart;
            const ttfb = perfData.responseStart - perfData.navigationStart;
            
            // Track page load performance
            trackEvent('Performance', 'PageLoad', window.location.pathname, pageLoadTime);
            trackEvent('Performance', 'TTFB', window.location.pathname, ttfb);
            
            console.log('Performance metrics:', {
                pageLoadTime,
                dnsTime,
                tcpTime,
                ttfb
            });
        }
    }, 0);
});

// ============================================
// ERROR TRACKING
// ============================================

window.addEventListener('error', function(e) {
    trackEvent('Error', 'JavaScript', `${e.message} - ${e.filename}:${e.lineno}`);
});

// ============================================
// CUSTOM ANALYTICS ENDPOINT (Optional)
// ============================================

/**
 * Send data to your own analytics endpoint
 * Useful if you want to store analytics data in your own database
 */
function sendToCustomAnalytics(data) {
    // Example: Send to your own API
    /*
    fetch('/api/analytics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...data,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent
        })
    }).catch(err => console.error('Analytics error:', err));
    */
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// EXPORT FUNCTIONS (for use in other scripts)
// ============================================

// Make tracking functions globally available
window.trackEvent = trackEvent;
window.trackPageView = trackPageView;
window.trackArticleRead = trackArticleRead;
window.trackAdImpression = trackAdImpression;
window.trackAdClick = trackAdClick;
window.trackSocialShare = trackSocialShare;
window.trackOutboundLink = trackOutboundLink;
window.trackSearch = trackSearch;

// ============================================
// PRIVACY & GDPR COMPLIANCE
// ============================================

/**
 * Check if user has consented to analytics
 * Implement based on your cookie consent solution
 */
function hasAnalyticsConsent() {
    // Check cookie consent
    // return document.cookie.includes('analytics_consent=true');
    return true; // Default: assume consent (update based on your needs)
}

/**
 * Disable analytics if user opts out
 */
function disableAnalytics() {
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'denied'
        });
    }
    console.log('Analytics disabled by user');
}

// ============================================
// INITIALIZATION CHECK
// ============================================

console.log('Analytics script loaded');
if (hasAnalyticsConsent()) {
    console.log('Analytics consent granted');
} else {
    console.log('Analytics consent not granted');
    disableAnalytics();
}
