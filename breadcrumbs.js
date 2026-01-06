// Breadcrumb Navigation System
class BreadcrumbManager {
    constructor() {
        this.breadcrumbs = [];
        this.homeUrl = 'index.html';
        this.homeLabel = 'Home';
        this.init();
    }

    init() {
        this.generateBreadcrumbs();
        this.renderBreadcrumbs();
        this.setupStructuredData();
    }

    generateBreadcrumbs() {
        const currentPage = this.getCurrentPage();
        const path = window.location.pathname;
        
        // Always start with home
        this.breadcrumbs = [
            { label: this.homeLabel, url: this.homeUrl }
        ];

        // Add current page if not home
        if (currentPage !== 'home') {
            this.breadcrumbs.push({
                label: this.getPageTitle(currentPage),
                url: this.getCurrentPageUrl()
            });
        }

        // Add additional breadcrumbs for nested content
        this.addNestedBreadcrumbs(currentPage);
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        if (filename === '' || filename === 'index.html') {
            return 'home';
        }
        
        const pageMap = {
            'projects.html': 'projects',
            'blog-index.html': 'blog',
            'blog.html': 'blog',
            'tutorials.html': 'tutorials',
            'case-studies.html': 'case-studies',
            'resume.html': 'resume',
            'insights.html': 'insights',
            'privacy.html': 'privacy',
            'terms.html': 'terms',
            'disclaimer.html': 'disclaimer'
        };

        // Check if it's a blog post
        if (filename.startsWith('blog/') || path.includes('/blog/')) {
            return 'blog-post';
        }

        // Check if it's a tutorial
        if (filename.startsWith('tutorials/') || path.includes('/tutorials/')) {
            return 'tutorial';
        }

        return pageMap[filename] || 'unknown';
    }

    getPageTitle(page) {
        const titles = {
            'home': 'Home',
            'projects': 'Projects',
            'blog': 'Blog',
            'blog-post': 'Article',
            'tutorials': 'Tutorials',
            'tutorial': 'Tutorial',
            'case-studies': 'Case Studies',
            'resume': 'Resume',
            'insights': 'Insights',
            'privacy': 'Privacy Policy',
            'terms': 'Terms of Service',
            'disclaimer': 'Disclaimer'
        };

        return titles[page] || 'Page';
    }

    getCurrentPageUrl() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }

    addNestedBreadcrumbs(currentPage) {
        const path = window.location.pathname;
        
        // Add category breadcrumbs for blog posts
        if (currentPage === 'blog-post') {
            this.breadcrumbs.splice(1, 0, {
                label: 'Blog',
                url: 'blog-index.html'
            });
        }

        // Add category breadcrumbs for tutorials
        if (currentPage === 'tutorial') {
            this.breadcrumbs.splice(1, 0, {
                label: 'Tutorials',
                url: 'tutorials.html'
            });
        }
    }

    renderBreadcrumbs() {
        // Remove existing breadcrumbs if any
        const existingBreadcrumbs = document.querySelector('.breadcrumbs');
        if (existingBreadcrumbs) {
            existingBreadcrumbs.remove();
        }

        // Don't show breadcrumbs on home page
        if (this.breadcrumbs.length <= 1) {
            return;
        }

        // Create breadcrumb container
        const breadcrumbContainer = document.createElement('nav');
        breadcrumbContainer.className = 'breadcrumbs';
        breadcrumbContainer.setAttribute('aria-label', 'Breadcrumb navigation');

        // Create breadcrumb list
        const breadcrumbList = document.createElement('ol');
        breadcrumbList.className = 'breadcrumb-list';

        // Add breadcrumb items
        this.breadcrumbs.forEach((crumb, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'breadcrumb-item';

            if (index === this.breadcrumbs.length - 1) {
                // Current page - not a link
                const span = document.createElement('span');
                span.className = 'breadcrumb-current';
                span.setAttribute('aria-current', 'page');
                span.textContent = crumb.label;
                listItem.appendChild(span);
            } else {
                // Navigable page
                const link = document.createElement('a');
                link.href = crumb.url;
                link.textContent = crumb.label;
                listItem.appendChild(link);

                // Add separator for all but last item
                if (index < this.breadcrumbs.length - 1) {
                    const separator = document.createElement('span');
                    separator.className = 'breadcrumb-separator';
                    separator.setAttribute('aria-hidden', 'true');
                    separator.textContent = '›';
                    listItem.appendChild(separator);
                }
            }

            breadcrumbList.appendChild(listItem);
        });

        breadcrumbContainer.appendChild(breadcrumbList);

        // Insert breadcrumbs after navigation or at the top of main content
        const targetLocation = this.findBreadcrumbLocation();
        if (targetLocation) {
            targetLocation.parentNode.insertBefore(breadcrumbContainer, targetLocation.nextSibling);
        } else {
            // Fallback: add at the top of body
            document.body.insertBefore(breadcrumbContainer, document.body.firstChild);
        }
    }

    findBreadcrumbLocation() {
        // Try to find the main content area
        const main = document.querySelector('main') || document.querySelector('.section-hero');
        if (main) {
            return main;
        }

        // Try to find the first section
        const firstSection = document.querySelector('section');
        if (firstSection) {
            return firstSection;
        }

        // Fallback to navigation
        return document.querySelector('.navbar');
    }

    setupStructuredData() {
        if (this.breadcrumbs.length <= 1) {
            return;
        }

        // Create structured data for breadcrumbs
        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': this.breadcrumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'name': crumb.label,
                'item': this.getAbsoluteUrl(crumb.url)
            }))
        };

        // Create or update structured data script
        let script = document.querySelector('script[type="application/ld+json"][data-breadcrumb]');
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-breadcrumb', 'true');
            document.head.appendChild(script);
        }

        script.textContent = JSON.stringify(structuredData, null, 2);
    }

    getAbsoluteUrl(relativeUrl) {
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
        return new URL(relativeUrl, baseUrl).href;
    }

    // Method to update breadcrumbs dynamically (for SPA-like behavior)
    updateBreadcrumbs(pageTitle, pageUrl) {
        this.breadcrumbs = [
            { label: this.homeLabel, url: this.homeUrl },
            { label: pageTitle, url: pageUrl }
        ];
        this.renderBreadcrumbs();
        this.setupStructuredData();
    }

    // Method to add custom breadcrumbs
    addCustomBreadcrumb(label, url, position = -1) {
        const newCrumb = { label, url };
        
        if (position === -1) {
            this.breadcrumbs.push(newCrumb);
        } else {
            this.breadcrumbs.splice(position, 0, newCrumb);
        }
        
        this.renderBreadcrumbs();
        this.setupStructuredData();
    }
}

// Initialize breadcrumb manager
document.addEventListener('DOMContentLoaded', () => {
    window.breadcrumbManager = new BreadcrumbManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BreadcrumbManager;
}
