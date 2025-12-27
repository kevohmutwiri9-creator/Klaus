// Enhanced Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (currentTheme === 'light' || (!currentTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        
        // Announce theme change to screen readers
        announceToScreenReader(`Theme changed to ${isDark ? 'light' : 'dark'} mode`);
    });
    
    // Listen for system theme changes
    prefersDarkScheme.addListener(e => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

// Global screen reader announcement function
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Accessibility Enhancements
function initAccessibility() {
    // Keyboard navigation for cards
    const interactiveCards = document.querySelectorAll('.project-card, .case-study-card, .insight-card, .tutorial-card');
    
    interactiveCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Project: ${card.querySelector('h3')?.textContent || 'Untitled'}`);
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('a');
                if (link) link.click();
            }
        });
    });

    // Focus trap for modals/lightbox
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    // Keyboard navigation hints
    let keyboardTimer;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            clearTimeout(keyboardTimer);
            const hint = document.querySelector('.keyboard-nav-hint');
            if (!hint) {
                const hintDiv = document.createElement('div');
                hintDiv.className = 'keyboard-nav-hint';
                hintDiv.textContent = 'Use Tab to navigate, Enter to select';
                document.body.appendChild(hintDiv);
                hintDiv.classList.add('visible');
            }
            
            keyboardTimer = setTimeout(() => {
                const hint = document.querySelector('.keyboard-nav-hint');
                if (hint) {
                    hint.classList.remove('visible');
                    setTimeout(() => hint.remove(), 300);
                }
            }, 3000);
        }
    });

    // Enhanced form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            let firstInvalidField = null;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.setAttribute('aria-invalid', 'true');
                    field.setAttribute('aria-describedby', `${field.id}-error`);
                    
                    if (!firstInvalidField) firstInvalidField = field;
                } else {
                    field.setAttribute('aria-invalid', 'false');
                }
            });

            if (!isValid) {
                e.preventDefault();
                announceToScreenReader('Please fill in all required fields');
                firstInvalidField?.focus();
            }
        });
    });

    // Make search results keyboard accessible
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.setAttribute('role', 'listbox');
        
        const observer = new MutationObserver(() => {
            const items = searchResults.querySelectorAll('.search-result-item');
            items.forEach((item, index) => {
                item.setAttribute('role', 'option');
                item.setAttribute('tabindex', '-1');
                
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const nextItem = items[index + 1];
                        if (nextItem) nextItem.focus();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prevItem = items[index - 1];
                        if (prevItem) prevItem.focus();
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
                        item.click();
                    }
                });
            });
        });
        
        observer.observe(searchResults, { childList: true });
    }
}

// Initialize accessibility features
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
    initAccessibility();
}

// Search and Filter Functionality
function initSearchAndFilter() {
    const searchInput = document.getElementById('blogSearch');
    const searchResults = document.getElementById('searchResults');
    const blogCards = document.querySelectorAll('.blog-card');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    if (!searchInput || !blogCards.length) return;

    // Blog data for search
    const blogData = Array.from(blogCards).map(card => ({
        title: card.querySelector('.blog-title')?.textContent || '',
        excerpt: card.querySelector('.blog-excerpt')?.textContent || '',
        category: card.querySelector('.blog-category')?.textContent || '',
        date: card.querySelector('.blog-date')?.textContent || '',
        url: card.querySelector('.blog-read-more')?.href || '',
        element: card
    }));

    // Search functionality
    function performSearch(query) {
        const results = blogData.filter(post => {
            const searchStr = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
            return searchStr.includes(query.toLowerCase());
        });

        displaySearchResults(results, query);
        filterBlogCards(query, 'all');
    }

    function displaySearchResults(results, query) {
        if (!query) {
            searchResults.classList.remove('active');
            return;
        }

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No blog posts found matching your search.</div>';
        } else {
            searchResults.innerHTML = results.map(post => `
                <div class="search-result-item" onclick="window.location.href='${post.url}'">
                    <h4>${highlightMatch(post.title, query)}</h4>
                    <p>${highlightMatch(post.excerpt.substring(0, 100) + '...', query)}</p>
                    <small style="color: #7be8ff;">${post.category} • ${post.date}</small>
                </div>
            `).join('');
        }
        
        searchResults.classList.add('active');
    }

    function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background: rgba(123, 232, 255, 0.3); color: #7be8ff;">$1</mark>');
    }

    function filterBlogCards(searchQuery = '', category = 'all') {
        let visibleCount = 0;
        
        blogCards.forEach(card => {
            const title = card.querySelector('.blog-title')?.textContent || '';
            const excerpt = card.querySelector('.blog-excerpt')?.textContent || '';
            const cardCategory = card.querySelector('.blog-category')?.textContent || '';
            
            const matchesSearch = !searchQuery || 
                title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = category === 'all' || 
                cardCategory.toLowerCase().includes(category.toLowerCase());
            
            if (matchesSearch && matchesCategory) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show no results message if needed
        const existingNoResults = document.querySelector('.no-results');
        if (existingNoResults) existingNoResults.remove();
        
        if (visibleCount === 0) {
            const blogGrid = document.querySelector('.blog-grid');
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.textContent = 'No blog posts found matching your criteria.';
            blogGrid.appendChild(noResultsDiv);
        }
    }

    // Event listeners
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });

    // Category filtering
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterBlogCards(searchInput.value, btn.dataset.category);
        });
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('active');
        }
    });
}

// Initialize search functionality on blog page
if (document.querySelector('.blog-grid')) {
    initSearchAndFilter();
}

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    function updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = Math.min(scrollPercentage, 100) + '%';
    }

    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

// Initialize scroll progress on all pages
if (document.body.classList.contains('blog-post') || document.querySelector('.blog-content')) {
    initScrollProgress();
}

// Analytics helper (hoisted before any usage)
function safeTrack(eventName, params = {}) {
    if (typeof gtag === 'function') {
        gtag('event', eventName, params);
    }
}

// Theme toggle functionality
const body = document.body;
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
    const themeIcon = themeToggle.querySelector('i');

    const toggleTheme = () => {
        body.classList.toggle('light-theme');
        const isLight = body.classList.contains('light-theme');
        if (themeIcon) {
            themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
        }
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    };

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
    }

    themeToggle.addEventListener('click', toggleTheme);
}

// Smooth scrolling for navigation links
const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
smoothScrollLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const selector = this.getAttribute('href');
        if (!selector || selector === '#') {
            return; // allow default behavior
        }

        const target = document.querySelector(selector);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Newsletter form handling (AJAX submit)
document.querySelectorAll('form[name^="newsletter"]').forEach(form => {
    const statusTargetId = form.id === 'newsletterFormInsights' ? 'newsletterStatusInsights' : 'newsletterStatus';
    const statusEl = document.getElementById(statusTargetId) || document.getElementById('newsletterStatus');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        const formData = new FormData(form);

        const setStatus = (message, tone = 'info') => {
            if (!statusEl) return;
            statusEl.textContent = message;
            statusEl.classList.remove('is-success', 'is-error', 'is-info');
            statusEl.classList.add(`is-${tone}`);
            statusEl.style.opacity = message ? '1' : '0';

            if (message && tone !== 'info') {
                statusEl.setAttribute('tabindex', '-1');
                requestAnimationFrame(() => {
                    statusEl.focus({ preventScroll: true });
                });
            } else if (!message) {
                statusEl.removeAttribute('tabindex');
            }
        };

        try {
            setStatus('Submitting…', 'info');
            const response = await fetch('/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setStatus('Thanks for subscribing! Watch your inbox for the next shipping note.', 'success');
            form.reset();
            safeTrack('newsletter_submit', { status: 'success', form: form.name });
        } catch (error) {
            console.error(error);
            setStatus('Unable to subscribe right now. Please try again later.', 'error');
            safeTrack('newsletter_submit', { status: 'error', form: form.name });
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            setTimeout(() => setStatus('', 'info'), 4000);
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a[data-nav-section]');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Section observer for active nav state
const sections = document.querySelectorAll('section[id]');
if (sections.length && navLinks.length) {
    const navMap = new Map();
    navLinks.forEach(link => {
        const sectionId = link.dataset.navSection;
        if (sectionId) {
            navMap.set(sectionId, link);
        }
    });

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const link = navMap.get(id);
            if (!link) return;

            if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
                navLinks.forEach(navLink => navLink.removeAttribute('aria-current'));
                link.setAttribute('aria-current', 'true');
                safeTrack('nav_section_visible', { section: id });
            }
        });
    }, { threshold: [0.5, 0.75], rootMargin: '-80px 0px -200px 0px' });

    sections.forEach(section => navObserver.observe(section));
}

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        }
    });
}

// Form validation and submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const contactStatus = document.getElementById('contactStatus');

    const setContactStatus = (message, tone = 'info') => {
        if (!contactStatus) return;
        contactStatus.textContent = message;
        contactStatus.classList.remove('is-success', 'is-error', 'is-info');
        contactStatus.classList.add(`is-${tone}`);
        contactStatus.style.opacity = message ? '1' : '0';

        if (message && tone !== 'info') {
            contactStatus.setAttribute('tabindex', '-1');
            requestAnimationFrame(() => {
                contactStatus.focus({ preventScroll: true });
            });
        } else if (!message) {
            contactStatus.removeAttribute('tabindex');
        }
    };

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (name === '' || email === '' || message === '') {
            setContactStatus('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            setContactStatus('Please enter a valid email address.', 'error');
            return;
        }

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            setContactStatus('Sending your message…', 'info');
            const response = await fetch('/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setContactStatus('Thank you! I will get back to you soon.', 'success');
            contactForm.reset();
            safeTrack('contact_form_submit', { method: 'netlify', status: 'success' });
        } catch (error) {
            console.error(error);
            setContactStatus('Something went wrong. Please try again or email kevohmutwiri35@gmail.com.', 'error');
            safeTrack('contact_form_submit', { method: 'netlify', status: 'error' });
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            setTimeout(() => setContactStatus('', 'info'), 5000);
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// AI project advisor form
const aiAdvisorForm = document.getElementById('aiAdvisorForm');
if (aiAdvisorForm) {
    const aiStatus = document.getElementById('aiStatus');
    const aiResponse = document.getElementById('aiResponse');
    const aiResponseContent = document.getElementById('aiResponseContent');
    const aiResetButton = document.getElementById('aiResetButton');
    const promptField = document.getElementById('aiPrompt');
    const submitBtn = aiAdvisorForm.querySelector('button[type="submit"]');

    const setAiStatus = (message, tone = 'info') => {
        if (!aiStatus) return;
        aiStatus.textContent = message;
        aiStatus.classList.remove('is-success', 'is-error', 'is-info');
        aiStatus.classList.add(`is-${tone}`);
        aiStatus.style.opacity = message ? '1' : '0';

        if (message && tone !== 'info') {
            aiStatus.setAttribute('tabindex', '-1');
            requestAnimationFrame(() => {
                aiStatus.focus({ preventScroll: true });
            });
        } else if (!message) {
            aiStatus.removeAttribute('tabindex');
        }
    };

    const resetAdvisor = () => {
        if (promptField) {
            promptField.value = '';
            promptField.focus();
        }
        aiAdvisorForm.reset();
        aiResponse.hidden = true;
        aiResponseContent.innerHTML = '';
        aiResetButton.hidden = true;
        setAiStatus('');
    };

    aiResetButton?.addEventListener('click', resetAdvisor);

    const generatePlan = (prompt) => {
        const lower = prompt.toLowerCase();
        const suggestions = [];

        if (lower.includes('mobile') || lower.includes('android') || lower.includes('ios')) {
            suggestions.push('Architecture & stack: React Native or Flutter with a cloud backend (Supabase/Firebase) so teens can sync across devices.');
            suggestions.push('Community & safety: Moderate content via Firestore security rules plus reporting workflows; add onboarding nudges that highlight community guidelines.');
        }

        if (lower.includes('habit') || lower.includes('tracker') || lower.includes('productivity')) {
            suggestions.push('Engagement loop: Implement weekly streaks, progress charts, and lightweight push reminders; validate with a 2-week pilot cohort.');
        }

        if (lower.includes('teens') || lower.includes('youth') || lower.includes('students')) {
            suggestions.push('Research & validation: Co-create with a small teen advisory group, run moderated tests for tone and privacy expectations.');
        }

        if (lower.includes('community')) {
            suggestions.push('Social features: Start with invite-only circles and shared challenges; add async leaderboards before live chat to keep moderation light.');
        }

        if (lower.includes('ai') || lower.includes('recommendation')) {
            suggestions.push('Personalization: Use rule-based onboarding first, then layer in a simple recommendation job (e.g., daily habit tips) once engagement data exists.');
        }

        if (lower.includes('web') || lower.includes('saas') || lower.includes('dashboard')) {
            suggestions.push('Web delivery: Ship as a responsive web app, gated behind email/SSO to let parents review usage insights.');
        }

        if (!suggestions.length) {
            suggestions.push('Discovery: Map the core user journey, define must-have outcomes, and validate with three user interviews before writing code.');
            suggestions.push('Execution: Build a slice that proves the primary value, instrument analytics, and ship within a 2-week sprint for quick feedback.');
            suggestions.push('Risks: Watch for scope creep—capture every nice-to-have in a backlog and focus on activating the first cohort.');
        } else {
            suggestions.push('Next steps: Time-box a prototype sprint, gather feedback from 5 early adopters, and expand the roadmap based on validated signals.');
        }

        return suggestions;
    };

    aiAdvisorForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const prompt = (promptField?.value || '').trim();

        if (!prompt) {
            setAiStatus('Please describe your project so I can help.', 'error');
            return;
        }

        if (prompt.length < 20) {
            setAiStatus('A bit more detail will help me tailor the plan. Aim for at least a couple of sentences.', 'error');
            return;
        }

        submitBtn?.classList.add('loading');
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        setAiStatus('Drafting your plan…', 'info');
        aiResponse.hidden = true;
        aiResponseContent.innerHTML = '';

        try {
            const suggestions = generatePlan(prompt);

            aiResponseContent.innerHTML = suggestions
                .map((item) => {
                    const [heading, ...rest] = item.split(':');
                    const details = rest.join(':').trim();
                    return `<p><strong>${heading.trim()}</strong>${details ? `: ${details}` : ''}</p>`;
                })
                .join('');

            aiResponse.hidden = false;
            aiResetButton.hidden = false;
            setAiStatus('Here’s a tailored plan using my internal playbook.', 'success');
            safeTrack('ai_advisor_submit', { status: 'success', mode: 'heuristic' });
        } catch (error) {
            console.error(error);
            setAiStatus('Something went wrong. Please try again shortly.', 'error');
            aiResponse.hidden = true;
            aiResponseContent.innerHTML = '';
            aiResetButton.hidden = true;
            safeTrack('ai_advisor_submit', { status: 'error', mode: 'heuristic' });
        } finally {
            submitBtn?.classList.remove('loading');
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Skill items animation
document.querySelectorAll('.skill-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    item.classList.add('fade-in-up');
});

// Parallax effect for decorative layers
const parallaxLayers = document.querySelectorAll('.parallax-layer');
window.addEventListener('mousemove', (event) => {
    const { innerWidth, innerHeight } = window;
    const x = (event.clientX / innerWidth) - 0.5;
    const y = (event.clientY / innerHeight) - 0.5;

    parallaxLayers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed || '0.05');
        const translateX = -x * 40 * speed;
        const translateY = -y * 40 * speed;
        layer.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
});

// Lightbox functionality
const lightboxOverlay = document.createElement('div');
lightboxOverlay.className = 'lightbox-overlay';
lightboxOverlay.innerHTML = `
    <div class="lightbox-content">
        <img src="" alt="Lightbox preview">
    </div>
    <button class="lightbox-close" aria-label="Close preview">&times;</button>
`;
document.body.appendChild(lightboxOverlay);

const lightboxImage = lightboxOverlay.querySelector('img');
const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');

function openLightbox(src, alt) {
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', (event) => {
    if (event.target === lightboxOverlay) {
        closeLightbox();
    }
});

document.querySelectorAll('[data-lightbox]').forEach(img => {
    img.addEventListener('click', () => {
        openLightbox(img.src, img.dataset.caption || img.alt);
    });
});

// Dynamic footer year
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

// Track social share interactions
document.querySelectorAll('.share-link').forEach(link => {
    link.addEventListener('click', () => {
        const network = link.dataset.share || 'unknown';
        safeTrack('insight_share_click', { network });
    });
});

// Project image loading shimmer toggle
document.querySelectorAll('.project-image[data-loading]').forEach(wrapper => {
    const image = wrapper.querySelector('img');
    if (!image) {
        wrapper.setAttribute('data-loading', 'false');
        return;
    }

    const markLoaded = () => wrapper.setAttribute('data-loading', 'false');

    if (image.complete) {
        markLoaded();
    } else {
        image.addEventListener('load', markLoaded, { once: true });
        image.addEventListener('error', markLoaded, { once: true });
    }
});

// Sticky CTA visibility
const stickyCta = document.createElement('div');
stickyCta.className = 'sticky-cta';
stickyCta.innerHTML = `<button type="button"><span class="cta-icon">⚡</span> Book a discovery call <span class="cta-badge">Open slots</span></button>`;
document.body.appendChild(stickyCta);

stickyCta.querySelector('button').addEventListener('click', () => {
    safeTrack('cta_click', { location: 'sticky' });
    window.open('https://cal.com/kevoh-mutwiri-ms633b/30min', '_blank');
});

const heroSection = document.getElementById('hero');
const footer = document.querySelector('footer.footer');
const contactSection = document.getElementById('contact');

const stickyVisibilityState = {
    pastHero: false,
    nearFooter: false,
    contactVisible: false
};

const refreshStickyVisibility = () => {
    const shouldHide = stickyVisibilityState.nearFooter || stickyVisibilityState.contactVisible;
    if (shouldHide) {
        stickyCta.classList.remove('visible');
        return;
    }

    stickyCta.classList.toggle('visible', stickyVisibilityState.pastHero);
};

if (heroSection) {
    const observerSticky = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            stickyVisibilityState.pastHero = !entry.isIntersecting;
            refreshStickyVisibility();
        });
    }, { threshold: 0, rootMargin: '-80px 0px 0px 0px' });

    observerSticky.observe(heroSection);
} else {
    stickyVisibilityState.pastHero = true;
    refreshStickyVisibility();
}

if (footer) {
    const footerObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            stickyVisibilityState.nearFooter = entry.isIntersecting;
            refreshStickyVisibility();
        });
    }, { threshold: 0.1 });

    footerObserver.observe(footer);
}

if (contactSection) {
    const contactObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            stickyVisibilityState.contactVisible = entry.isIntersecting;
            refreshStickyVisibility();
        });
    }, { threshold: 0.25 });

    contactObserver.observe(contactSection);
}

// Project carousel for standalone projects page
const projectsGrid = document.querySelector('body.section-page .projects-grid');
if (projectsGrid && window.innerWidth <= 768) {
    let currentIndex = 0;
    const cards = Array.from(projectsGrid.children);

    const carouselNav = document.createElement('div');
    carouselNav.className = 'carousel-nav';
    carouselNav.innerHTML = `
        <button class="carousel-btn prev" aria-label="Previous project"><i class="fas fa-chevron-left"></i></button>
        <button class="carousel-btn next" aria-label="Next project"><i class="fas fa-chevron-right"></i></button>
    `;
    projectsGrid.parentElement.appendChild(carouselNav);

    function updateCarousel(index) {
        cards.forEach((card, idx) => {
            card.style.display = idx === index ? 'block' : 'none';
        });
    }

    updateCarousel(currentIndex);

    carouselNav.querySelector('.prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel(currentIndex);
        safeTrack('projects_carousel', { action: 'prev', index: currentIndex });
    });

    carouselNav.querySelector('.next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel(currentIndex);
        safeTrack('projects_carousel', { action: 'next', index: currentIndex });
    });
}

// Project filtering functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter projects
        projectCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                const tech = card.querySelector('.project-tech').textContent.toLowerCase();
                if (filter === 'web' && (tech.includes('react') || tech.includes('node') || tech.includes('html') || tech.includes('css'))) {
                    card.style.display = 'block';
                } else if (filter === 'mobile' && (tech.includes('react native') || tech.includes('mobile'))) {
                    card.style.display = 'block';
                } else if (filter === 'ml' && (tech.includes('python') || tech.includes('machine learning') || tech.includes('scikit-learn'))) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});

// Project cards hover effect enhancement
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Back to Top Button functionality
const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Track the event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'back_to_top_click', {
                event_category: 'Navigation',
                event_label: 'Back to Top Button'
            });
        }
    });

    // Keyboard support
    backToTopButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            backToTopButton.click();
        }
    });
}

// Scroll to top button (optional)
const scrollToTopBtn = document.createElement('div');
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

// Typing effect for hero subtitle (optional)
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroSubtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    // Start typing effect after page load
    window.addEventListener('load', () => {
        setTimeout(typeWriter, 1000);
    });
}

// Prevent form submission on enter key for better UX
document.querySelectorAll('input, textarea').forEach(element => {
    element.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });
});

// Enhanced Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                
                // Add was-validated class to show validation messages
                form.classList.add('was-validated');
                
                // Focus first invalid field
                const firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    announceToScreenReader(`Please correct the ${firstInvalid.type || 'field'}: ${firstInvalid.validationMessage}`);
                }
            }
        }, false);
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
            
            input.addEventListener('blur', function() {
                if (this.value && !this.checkValidity()) {
                    this.classList.add('is-invalid');
                }
            });
        });
    });
}

// Cookie Consent Functionality
function initCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');
    
    // Check if user has already made a choice
    if (!localStorage.getItem('cookieConsent')) {
        // Show the banner with a slight delay
        setTimeout(() => {
            if (cookieConsent) {
                cookieConsent.classList.add('visible');
                if (typeof announceToScreenReader === 'function') {
                    announceToScreenReader('Cookie consent banner appeared');
                }
            }
        }, 2000);
    }
    
    // Handle accept
    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            if (cookieConsent) {
                cookieConsent.classList.remove('visible');
            }
            if (typeof announceToScreenReader === 'function') {
                announceToScreenReader('Cookies accepted');
            }
            
            // Initialize analytics or other tracking here if needed
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'analytics_storage': 'granted'
                });
            }
        });
    }
    
    // Handle decline
    if (declineCookies) {
        declineCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            if (cookieConsent) {
                cookieConsent.classList.remove('visible');
            }
            if (typeof announceToScreenReader === 'function') {
                announceToScreenReader('Cookies declined');
            }
            
            // Update consent settings
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'ad_storage': 'denied',
                    'analytics_storage': 'denied'
                });
            }
        });
    }
}

// Image Lightbox Functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-lightbox');
    
    // Add click event to all images with data-lightbox attribute
    document.querySelectorAll('img[data-lightbox]').forEach(img => {
        img.addEventListener('click', function() {
            lightbox.style.display = 'block';
            lightboxImg.src = this.src;
            lightboxCaption.textContent = this.getAttribute('data-caption') || '';
            lightboxImg.alt = this.alt || 'Enlarged image';
            
            // Prevent body scroll when lightbox is open
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            closeBtn.focus();
            announceToScreenReader('Image opened in lightbox');
        });
    });
    
    // Close lightbox when clicking the close button
    closeBtn.addEventListener('click', closeLightbox);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
        announceToScreenReader('Lightbox closed');
    }
}

// Copy to Clipboard Functionality
function initCopyToClipboard() {
    // Add copy buttons to all code blocks
    document.querySelectorAll('pre code').forEach(block => {
        const pre = block.parentElement;
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.title = 'Copy to clipboard';
        button.innerHTML = '<i class="far fa-copy"></i>';
        button.setAttribute('aria-label', 'Copy code to clipboard');
        
        button.addEventListener('click', () => {
            const code = block.innerText;
            navigator.clipboard.writeText(code).then(() => {
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.setAttribute('aria-label', 'Code copied to clipboard');
                announceToScreenReader('Code copied to clipboard');
                
                setTimeout(() => {
                    button.innerHTML = '<i class="far fa-copy"></i>';
                    button.setAttribute('aria-label', 'Copy code to clipboard');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                announceToScreenReader('Failed to copy code to clipboard');
            });
        });
        
        // Add the button to the pre element
        if (pre) {
            pre.style.position = 'relative';
            pre.insertBefore(button, block);
        }
    });
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initAccessibility();
    initFormValidation();
    initCopyToClipboard();
    initLightbox();
    initCookieConsent();
    
    // Add loading animation removal
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Initialize on page load
window.addEventListener('load', function() {
    // Remove loading screen if exists
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }
});
