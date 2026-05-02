/**
 * NewsTrendings - Main JavaScript
 * RHIMS News Jacking Site
 */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('NewsTrendings initialized');
    
    // Initialize all components
    initSmoothScroll();
    initLazyLoading();
    initShareButtons();
    initMobileMenu();
    updateTimestamps();
});

// ============================================
// SMOOTH SCROLLING
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignore empty anchors
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// LAZY LOADING IMAGES
// ============================================

function initLazyLoading() {
    // Check if browser supports IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        // Observe all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// ============================================
// SOCIAL SHARING
// ============================================

function initShareButtons() {
    // Facebook share
    document.querySelectorAll('.share-btn.facebook').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            openShareWindow(shareUrl);
        });
    });

    // Twitter share
    document.querySelectorAll('.share-btn.twitter').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            openShareWindow(shareUrl);
        });
    });

    // LinkedIn share
    document.querySelectorAll('.share-btn.linkedin').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            openShareWindow(shareUrl);
        });
    });

    // WhatsApp share
    document.querySelectorAll('.share-btn.whatsapp').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const shareUrl = `https://wa.me/?text=${title}%20${url}`;
            window.open(shareUrl, '_blank');
        });
    });

    // Email share
    document.querySelectorAll('.share-btn.email').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const title = encodeURIComponent(document.title);
            const url = encodeURIComponent(window.location.href);
            const body = `Check out this article: ${decodeURIComponent(title)}%0D%0A%0D%0A${decodeURIComponent(url)}`;
            window.location.href = `mailto:?subject=${title}&body=${body}`;
        });
    });
}

function openShareWindow(url) {
    const width = 600;
    const height = 400;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`;
    window.open(url, 'share', features);
}

// ============================================
// MOBILE MENU (Optional - if you add hamburger menu later)
// ============================================

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.main-nav') && !e.target.closest('.menu-toggle')) {
                mainNav.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
            });
        });
    }
}

// ============================================
// TIMESTAMP UPDATES
// ============================================

function updateTimestamps() {
    document.querySelectorAll('.relative-time').forEach(element => {
        const timestamp = element.getAttribute('data-timestamp');
        if (timestamp) {
            element.textContent = getRelativeTime(new Date(timestamp));
        }
    });
}

function getRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// ============================================
// NEWSLETTER FORM (Optional)
// ============================================

const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('.newsletter-input').value;
        
        // TODO: Integrate with your email service provider
        console.log('Newsletter signup:', email);
        
        // Show success message (customize as needed)
        alert('Thank you for subscribing!');
        this.reset();
    });
}

// ============================================
// READ PROGRESS INDICATOR (Optional)
// ============================================

function initReadProgress() {
    const progressBar = document.querySelector('.read-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', function() {
        const article = document.querySelector('.article-content');
        if (!article) return;

        const windowHeight = window.innerHeight;
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const articleStart = articleTop - windowHeight;
        const articleEnd = articleTop + articleHeight;
        const scrollProgress = scrollTop - articleStart;
        const totalProgress = articleEnd - articleStart;
        
        const percentage = Math.min(Math.max((scrollProgress / totalProgress) * 100, 0), 100);
        
        progressBar.style.width = percentage + '%';
    });
}

// Initialize read progress if indicator exists
if (document.querySelector('.read-progress')) {
    initReadProgress();
}

// ============================================
// CLICK TRACKING (Optional - for analytics)
// ============================================

function trackClick(category, action, label) {
    // This will work with analytics.js when configured
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    console.log('Track:', category, action, label);
}

// Track article card clicks
document.querySelectorAll('.news-card, .related-card').forEach(card => {
    card.addEventListener('click', function(e) {
        const headline = this.querySelector('h3, .card-headline');
        if (headline) {
            trackClick('Article', 'Click', headline.textContent.trim());
        }
    });
});

// Track social share clicks
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const platform = this.classList.contains('facebook') ? 'Facebook' :
                        this.classList.contains('twitter') ? 'Twitter' :
                        this.classList.contains('linkedin') ? 'LinkedIn' :
                        this.classList.contains('whatsapp') ? 'WhatsApp' :
                        this.classList.contains('email') ? 'Email' : 'Unknown';
        trackClick('Social', 'Share', platform);
    });
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for performance optimization
 */
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

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard');
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page load time:', pageLoadTime + 'ms');
            
            // Send to analytics if needed
            trackClick('Performance', 'PageLoad', `${pageLoadTime}ms`);
        }, 0);
    });
}

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.message);
    // Optionally send error to analytics
});

// ============================================
// SERVICE WORKER (Optional - for PWA)
// ============================================

if ('serviceWorker' in navigator) {
    // Uncomment to enable service worker
    /*
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registered:', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed:', err);
        });
    });
    */
}

// ============================================
// EXPORT FUNCTIONS (if using modules)
// ============================================

// If you're using ES6 modules, you can export functions
// export { trackClick, copyToClipboard, getRelativeTime };
