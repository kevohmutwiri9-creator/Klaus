// Advanced Search System
class AdvancedSearch {
    constructor() {
        this.searchIndex = [];
        this.searchResults = [];
        this.isSearching = false;
        this.searchHistory = [];
        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.setupSearchUI();
        this.setupEventListeners();
        this.loadSearchHistory();
    }

    buildSearchIndex() {
        // Index all searchable content
        const pages = [
            { url: 'index.html', title: 'Home', content: this.getPageContent('index.html') },
            { url: 'projects.html', title: 'Projects', content: this.getPageContent('projects.html') },
            { url: 'blog-index.html', title: 'Blog', content: this.getPageContent('blog-index.html') },
            { url: 'tutorials.html', title: 'Tutorials', content: this.getPageContent('tutorials.html') },
            { url: 'case-studies.html', title: 'Case Studies', content: this.getPageContent('case-studies.html') },
            { url: 'resume.html', title: 'Resume', content: this.getPageContent('resume.html') }
        ];

        // Add blog posts
        const blogPosts = this.getBlogPosts();
        blogPosts.forEach(post => {
            pages.push({
                url: post.url,
                title: post.title,
                content: post.content,
                category: 'blog',
                date: post.date,
                tags: post.tags
            });
        });

        // Add tutorials
        const tutorials = this.getTutorials();
        tutorials.forEach(tutorial => {
            pages.push({
                url: tutorial.url,
                title: tutorial.title,
                content: tutorial.content,
                category: 'tutorial',
                level: tutorial.level,
                topic: tutorial.topic
            });
        });

        this.searchIndex = pages.map(page => ({
            ...page,
            searchableText: `${page.title} ${page.content}`.toLowerCase(),
            keywords: this.extractKeywords(page.title + ' ' + page.content)
        }));
    }

    getPageContent(url) {
        // In a real implementation, this would fetch and parse the page
        // For now, return placeholder content
        const contentMap = {
            'index.html': 'Klaus portfolio full-stack developer web development machine learning projects contact',
            'projects.html': 'projects software development applications web apps mobile apps case studies',
            'blog-index.html': 'blog posts technical articles tutorials web development programming',
            'tutorials.html': 'tutorials guides how-to programming development techniques',
            'case-studies.html': 'case studies client work solutions implementations results',
            'resume.html': 'resume CV experience skills education qualifications'
        };
        
        return contentMap[url] || '';
    }

    getBlogPosts() {
        return [
            {
                url: 'blog/web-performance-optimization.html',
                title: 'Web Performance Optimization Guide',
                content: 'Learn how to optimize website performance with modern techniques',
                date: '2024-01-15',
                tags: ['performance', 'optimization', 'web']
            },
            {
                url: 'blog/async-javascript-promises.html',
                title: 'Understanding JavaScript Promises',
                content: 'Master async programming with JavaScript promises and async/await',
                date: '2024-01-10',
                tags: ['javascript', 'async', 'promises']
            }
        ];
    }

    getTutorials() {
        return [
            {
                url: 'tutorials/css-grid-responsive-layouts.html',
                title: 'CSS Grid Responsive Layouts',
                content: 'Create responsive layouts using CSS Grid',
                level: 'Intermediate',
                topic: 'CSS'
            },
            {
                url: 'tutorials/react-performance-optimization.html',
                title: 'React Performance Optimization',
                content: 'Optimize React applications for better performance',
                level: 'Advanced',
                topic: 'React'
            }
        ];
    }

    extractKeywords(text) {
        // Extract meaningful keywords from text
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2)
            .filter(word => !this.isStopWord(word));
        
        // Count word frequency
        const wordCount = {};
        words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });
        
        // Return top keywords
        return Object.entries(wordCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word]) => word);
    }

    isStopWord(word) {
        const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'];
        return stopWords.includes(word);
    }

    setupSearchUI() {
        // Create search interface
        const searchContainer = document.createElement('div');
        searchContainer.className = 'advanced-search-container';
        searchContainer.innerHTML = `
            <div class="search-overlay" id="searchOverlay"></div>
            <div class="search-modal" id="searchModal">
                <div class="search-header">
                    <div class="search-input-wrapper">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchInput" placeholder="Search pages, blog posts, tutorials..." autocomplete="off">
                        <button class="search-clear" id="searchClear" aria-label="Clear search">×</button>
                    </div>
                    <button class="search-close" id="searchClose" aria-label="Close search">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="search-filters">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="page">Pages</button>
                    <button class="filter-btn" data-filter="blog">Blog</button>
                    <button class="filter-btn" data-filter="tutorial">Tutorials</button>
                </div>
                <div class="search-results" id="searchResults">
                    <div class="search-placeholder">
                        <i class="fas fa-search"></i>
                        <p>Start typing to search...</p>
                    </div>
                </div>
                <div class="search-history" id="searchHistory"></div>
            </div>
        `;

        document.body.appendChild(searchContainer);
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        const searchClose = document.getElementById('searchClose');
        const searchOverlay = document.getElementById('searchOverlay');
        const filterBtns = document.querySelectorAll('.filter-btn');

        // Search input events
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeSearch();
            if (e.key === 'Enter') this.selectResult();
            if (e.key === 'ArrowDown') this.navigateResults('down');
            if (e.key === 'ArrowUp') this.navigateResults('up');
        });

        // Clear button
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            this.handleSearch('');
            searchInput.focus();
        });

        // Close events
        searchClose.addEventListener('click', () => this.closeSearch());
        searchOverlay.addEventListener('click', () => this.closeSearch());

        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterResults(btn.dataset.filter);
            });
        });

        // Global keyboard shortcut (Ctrl+K or Cmd+K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
        });
    }

    handleSearch(query) {
        if (query.trim() === '') {
            this.showPlaceholder();
            return;
        }

        this.isSearching = true;
        const searchQuery = query.toLowerCase();
        
        // Perform search with debouncing
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.performSearch(searchQuery);
        }, 300);
    }

    performSearch(query) {
        const results = this.searchIndex.filter(item => {
            return item.searchableText.includes(query) || 
                   item.keywords.some(keyword => keyword.includes(query));
        });

        // Rank results by relevance
        this.searchResults = this.rankResults(results, query);
        this.displayResults(this.searchResults);
        this.addToSearchHistory(query);
        this.isSearching = false;
    }

    rankResults(results, query) {
        return results.map(result => {
            let score = 0;
            
            // Title matches get higher score
            if (result.title.toLowerCase().includes(query)) {
                score += 10;
            }
            
            // Exact matches get highest score
            if (result.searchableText === query) {
                score += 20;
            }
            
            // Keyword matches
            result.keywords.forEach(keyword => {
                if (keyword.includes(query)) {
                    score += 5;
                }
            });
            
            // Content matches
            const contentMatches = (result.searchableText.match(new RegExp(query, 'g')) || []).length;
            score += contentMatches;
            
            return { ...result, score };
        }).sort((a, b) => b.score - a.score);
    }

    displayResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>No results found</p>
                    <p>Try different keywords or browse the site</p>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map((result, index) => `
            <div class="search-result" data-index="${index}" tabindex="0">
                <div class="result-content">
                    <h3 class="result-title">
                        <a href="${result.url}">${this.highlightMatch(result.title, this.currentQuery)}</a>
                    </h3>
                    <p class="result-excerpt">${this.getExcerpt(result.content, this.currentQuery)}</p>
                    <div class="result-meta">
                        <span class="result-category">${result.category || 'page'}</span>
                        ${result.date ? `<span class="result-date">${this.formatDate(result.date)}</span>` : ''}
                        ${result.level ? `<span class="result-level">${result.level}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        resultsContainer.innerHTML = resultsHTML;

        // Add click handlers to results
        resultsContainer.querySelectorAll('.search-result').forEach((result, index) => {
            result.addEventListener('click', () => this.selectResult(index));
            result.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.selectResult(index);
            });
        });
    }

    highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    getExcerpt(content, query) {
        if (!query) return content.substring(0, 150) + '...';
        
        const index = content.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return content.substring(0, 150) + '...';
        
        const start = Math.max(0, index - 50);
        const end = Math.min(content.length, index + query.length + 100);
        
        let excerpt = content.substring(start, end);
        if (start > 0) excerpt = '...' + excerpt;
        if (end < content.length) excerpt = excerpt + '...';
        
        return this.highlightMatch(excerpt, query);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    showPlaceholder() {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = `
            <div class="search-placeholder">
                <i class="fas fa-search"></i>
                <p>Start typing to search...</p>
            </div>
        `;
    }

    filterResults(filter) {
        if (!this.currentQuery) return;
        
        let filtered = this.searchResults;
        
        if (filter !== 'all') {
            filtered = this.searchResults.filter(result => 
                result.category === filter || 
                (filter === 'page' && !result.category)
            );
        }
        
        this.displayResults(filtered);
    }

    navigateResults(direction) {
        const results = document.querySelectorAll('.search-result');
        if (results.length === 0) return;
        
        const currentIndex = Array.from(results).findIndex(r => r.classList.contains('selected'));
        let newIndex;
        
        if (direction === 'down') {
            newIndex = currentIndex < results.length - 1 ? currentIndex + 1 : 0;
        } else {
            newIndex = currentIndex > 0 ? currentIndex - 1 : results.length - 1;
        }
        
        results.forEach(r => r.classList.remove('selected'));
        results[newIndex].classList.add('selected');
        results[newIndex].focus();
    }

    selectResult(index) {
        const results = document.querySelectorAll('.search-result');
        const selectedResult = index !== undefined ? results[index] : document.querySelector('.search-result.selected');
        
        if (selectedResult) {
            const link = selectedResult.querySelector('a');
            if (link) {
                this.trackSearchClick(link.href, this.currentQuery);
                window.location.href = link.href;
            }
        }
    }

    addToSearchHistory(query) {
        if (query.trim() === '') return;
        
        // Remove existing entry
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        
        // Add to beginning
        this.searchHistory.unshift(query);
        
        // Keep only last 10 searches
        this.searchHistory = this.searchHistory.slice(0, 10);
        
        // Save to localStorage
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        
        // Update display
        this.displaySearchHistory();
    }

    loadSearchHistory() {
        const saved = localStorage.getItem('searchHistory');
        if (saved) {
            this.searchHistory = JSON.parse(saved);
            this.displaySearchHistory();
        }
    }

    displaySearchHistory() {
        const historyContainer = document.getElementById('searchHistory');
        
        if (this.searchHistory.length === 0) {
            historyContainer.innerHTML = '';
            return;
        }
        
        const historyHTML = `
            <div class="search-history-header">
                <h4>Recent Searches</h4>
                <button class="clear-history" id="clearHistory">Clear</button>
            </div>
            <div class="search-history-list">
                ${this.searchHistory.map(query => `
                    <button class="history-item" data-query="${query}">
                        <i class="fas fa-clock"></i>
                        ${query}
                    </button>
                `).join('')}
            </div>
        `;
        
        historyContainer.innerHTML = historyHTML;
        
        // Add event listeners
        historyContainer.querySelector('.clear-history').addEventListener('click', () => {
            this.clearSearchHistory();
        });
        
        historyContainer.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const query = item.dataset.query;
                document.getElementById('searchInput').value = query;
                this.handleSearch(query);
            });
        });
    }

    clearSearchHistory() {
        this.searchHistory = [];
        localStorage.removeItem('searchHistory');
        document.getElementById('searchHistory').innerHTML = '';
    }

    openSearch() {
        const modal = document.getElementById('searchModal');
        const overlay = document.getElementById('searchOverlay');
        const input = document.getElementById('searchInput');
        
        modal.classList.add('active');
        overlay.classList.add('active');
        input.focus();
        
        // Track search open
        if (window.privacyAnalytics) {
            window.privacyAnalytics.track('search_opened');
        }
    }

    closeSearch() {
        const modal = document.getElementById('searchModal');
        const overlay = document.getElementById('searchOverlay');
        
        modal.classList.remove('active');
        overlay.classList.remove('active');
        
        // Clear search
        document.getElementById('searchInput').value = '';
        this.showPlaceholder();
    }

    trackSearchClick(url, query) {
        if (window.privacyAnalytics) {
            window.privacyAnalytics.track('search_result_click', {
                url: url,
                query: query,
                results_count: this.searchResults.length
            });
        }
    }

    // Public API
    search(query) {
        this.openSearch();
        document.getElementById('searchInput').value = query;
        this.handleSearch(query);
    }
}

// Initialize advanced search
document.addEventListener('DOMContentLoaded', () => {
    window.advancedSearch = new AdvancedSearch();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedSearch;
}
