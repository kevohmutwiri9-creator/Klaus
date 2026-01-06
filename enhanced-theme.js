// Enhanced Theme System with Advanced Dark Mode
class EnhancedThemeManager {
    constructor() {
        this.themes = {
            light: {
                name: 'Light',
                icon: 'fa-sun',
                colors: {
                    '--bg-primary': '#ffffff',
                    '--bg-secondary': '#f8f9fa',
                    '--bg-tertiary': '#e9ecef',
                    '--text-primary': '#212529',
                    '--text-secondary': '#6c757d',
                    '--text-muted': '#adb5bd',
                    '--border-color': '#dee2e6',
                    '--primary-color': '#00d4ff',
                    '--secondary-color': '#6c63ff',
                    '--accent-color': '#ff6b6b',
                    '--success-color': '#51cf66',
                    '--warning-color': '#ffd43b',
                    '--danger-color': '#ff6b6b',
                    '--shadow-light': 'rgba(0, 0, 0, 0.1)',
                    '--shadow-medium': 'rgba(0, 0, 0, 0.15)',
                    '--shadow-heavy': 'rgba(0, 0, 0, 0.2)'
                }
            },
            dark: {
                name: 'Dark',
                icon: 'fa-moon',
                colors: {
                    '--bg-primary': '#0a0a0a',
                    '--bg-secondary': '#1a1a1a',
                    '--bg-tertiary': '#2a2a2a',
                    '--text-primary': '#ffffff',
                    '--text-secondary': '#b3b3b3',
                    '--text-muted': '#808080',
                    '--border-color': '#333333',
                    '--primary-color': '#00d4ff',
                    '--secondary-color': '#6c63ff',
                    '--accent-color': '#ff6b6b',
                    '--success-color': '#51cf66',
                    '--warning-color': '#ffd43b',
                    '--danger-color': '#ff6b6b',
                    '--shadow-light': 'rgba(0, 0, 0, 0.3)',
                    '--shadow-medium': 'rgba(0, 0, 0, 0.5)',
                    '--shadow-heavy': 'rgba(0, 0, 0, 0.7)'
                }
            },
            auto: {
                name: 'Auto',
                icon: 'fa-adjust',
                colors: null // Uses system preference
            },
            sepia: {
                name: 'Sepia',
                icon: 'fa-coffee',
                colors: {
                    '--bg-primary': '#f4ecd8',
                    '--bg-secondary': '#e8dcc0',
                    '--bg-tertiary': '#d4c4a8',
                    '--text-primary': '#3d2c1d',
                    '--text-secondary': '#5d4037',
                    '--text-muted': '#8d6e63',
                    '--border-color': '#c4a57b',
                    '--primary-color': '#00796b',
                    '--secondary-color': '#5d4037',
                    '--accent-color': '#d84315',
                    '--success-color': '#2e7d32',
                    '--warning-color': '#f57c00',
                    '--danger-color': '#c62828',
                    '--shadow-light': 'rgba(61, 44, 29, 0.1)',
                    '--shadow-medium': 'rgba(61, 44, 29, 0.2)',
                    '--shadow-heavy': 'rgba(61, 44, 29, 0.3)'
                }
            },
            highContrast: {
                name: 'High Contrast',
                icon: 'fa-eye',
                colors: {
                    '--bg-primary': '#000000',
                    '--bg-secondary': '#1a1a1a',
                    '--bg-tertiary': '#333333',
                    '--text-primary': '#ffffff',
                    '--text-secondary': '#cccccc',
                    '--text-muted': '#999999',
                    '--border-color': '#ffffff',
                    '--primary-color': '#00ffff',
                    '--secondary-color': '#ffff00',
                    '--accent-color': '#ff00ff',
                    '--success-color': '#00ff00',
                    '--warning-color': '#ffff00',
                    '--danger-color': '#ff0000',
                    '--shadow-light': 'rgba(255, 255, 255, 0.1)',
                    '--shadow-medium': 'rgba(255, 255, 255, 0.2)',
                    '--shadow-heavy': 'rgba(255, 255, 255, 0.3)'
                }
            }
        };
        
        this.currentTheme = 'auto';
        this.customThemes = [];
        this.init();
    }

    init() {
        this.loadThemePreference();
        this.setupThemeUI();
        this.setupSystemPreferenceDetection();
        this.setupKeyboardShortcuts();
        this.applyTheme(this.currentTheme);
        this.loadCustomThemes();
    }

    loadThemePreference() {
        const saved = localStorage.getItem('theme-preference');
        if (saved && this.themes[saved]) {
            this.currentTheme = saved;
        } else {
            // Check for system preference
            this.currentTheme = 'auto';
        }
    }

    setupThemeUI() {
        // Create theme selector
        const themeSelector = document.createElement('div');
        themeSelector.className = 'theme-selector';
        themeSelector.innerHTML = `
            <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
                <i class="fas ${this.getThemeIcon(this.currentTheme)}"></i>
            </button>
            <div class="theme-dropdown" id="themeDropdown">
                <div class="theme-dropdown-header">
                    <h4>Choose Theme</h4>
                    <button class="theme-close" id="themeClose" aria-label="Close theme selector">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="theme-options">
                    ${Object.entries(this.themes).map(([key, theme]) => `
                        <button class="theme-option ${this.currentTheme === key ? 'active' : ''}" 
                                data-theme="${key}" 
                                title="${theme.name}">
                            <i class="fas ${theme.icon}"></i>
                            <span>${theme.name}</span>
                            ${this.currentTheme === key ? '<i class="fas fa-check"></i>' : ''}
                        </button>
                    `).join('')}
                </div>
                <div class="theme-custom-section">
                    <h4>Custom Themes</h4>
                    <div class="custom-themes" id="customThemes"></div>
                    <button class="create-theme-btn" id="createThemeBtn">
                        <i class="fas fa-plus"></i>
                        Create Custom Theme
                    </button>
                </div>
                <div class="theme-settings">
                    <label class="setting-item">
                        <input type="checkbox" id="reduceAnimations" ${this.getAnimationPreference() ? 'checked' : ''}>
                        <span>Reduce Animations</span>
                    </label>
                    <label class="setting-item">
                        <input type="checkbox" id="highContrastMode" ${this.getHighContrastPreference() ? 'checked' : ''}>
                        <span>High Contrast Mode</span>
                    </label>
                </div>
            </div>
        `;

        document.body.appendChild(themeSelector);
        this.setupThemeEventListeners();
    }

    setupThemeEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        const themeDropdown = document.getElementById('themeDropdown');
        const themeClose = document.getElementById('themeClose');
        const themeOptions = document.querySelectorAll('.theme-option');
        const createThemeBtn = document.getElementById('createThemeBtn');
        const reduceAnimations = document.getElementById('reduceAnimations');
        const highContrastMode = document.getElementById('highContrastMode');

        // Toggle dropdown
        themeToggle.addEventListener('click', () => {
            themeDropdown.classList.toggle('active');
        });

        // Close dropdown
        themeClose.addEventListener('click', () => {
            themeDropdown.classList.remove('active');
        });

        // Theme selection
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.setTheme(theme);
                themeDropdown.classList.remove('active');
            });
        });

        // Create custom theme
        createThemeBtn.addEventListener('click', () => {
            this.openThemeCreator();
        });

        // Settings
        reduceAnimations.addEventListener('change', (e) => {
            this.setAnimationPreference(e.target.checked);
        });

        highContrastMode.addEventListener('change', (e) => {
            this.setHighContrastPreference(e.target.checked);
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!themeSelector.contains(e.target)) {
                themeDropdown.classList.remove('active');
            }
        });
    }

    setupSystemPreferenceDetection() {
        // Listen for system theme changes
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeQuery.addListener(() => {
                if (this.currentTheme === 'auto') {
                    this.applySystemTheme();
                }
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T for quick theme toggle
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.cycleTheme();
            }
            
            // Ctrl/Cmd + Shift + D for dark mode toggle
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleDarkMode();
            }
        });
    }

    setTheme(themeName) {
        if (!this.themes[themeName] && !this.customThemes.find(t => t.name === themeName)) {
            console.error(`Theme "${themeName}" not found`);
            return;
        }

        this.currentTheme = themeName;
        localStorage.setItem('theme-preference', themeName);
        this.applyTheme(themeName);
        this.updateThemeUI();
        this.announceThemeChange(themeName);
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName] || this.customThemes.find(t => t.name === themeName);
        
        if (!theme) return;

        if (themeName === 'auto') {
            this.applySystemTheme();
        } else if (theme.colors) {
            // Apply custom colors
            Object.entries(theme.colors).forEach(([property, value]) => {
                document.documentElement.style.setProperty(property, value);
            });
        }

        // Update theme class on body
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName.toLowerCase()}`);

        // Apply additional theme-specific settings
        this.applyThemeSettings(themeName);
    }

    applySystemTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = prefersDark ? 'dark' : 'light';
        
        const theme = this.themes[systemTheme];
        if (theme.colors) {
            Object.entries(theme.colors).forEach(([property, value]) => {
                document.documentElement.style.setProperty(property, value);
            });
        }
        
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${systemTheme}`);
    }

    applyThemeSettings(themeName) {
        // Apply animation preferences
        if (this.getAnimationPreference()) {
            document.body.classList.add('reduce-animations');
        } else {
            document.body.classList.remove('reduce-animations');
        }

        // Apply high contrast mode
        if (this.getHighContrastPreference()) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }

        // Theme-specific adjustments
        switch (themeName) {
            case 'highContrast':
                document.body.classList.add('high-contrast');
                break;
            case 'sepia':
                document.body.classList.add('sepia-mode');
                break;
        }
    }

    updateThemeUI() {
        const themeToggle = document.getElementById('themeToggle');
        const themeOptions = document.querySelectorAll('.theme-option');
        
        // Update toggle button icon
        if (themeToggle) {
            themeToggle.innerHTML = `<i class="fas ${this.getThemeIcon(this.currentTheme)}"></i>`;
        }
        
        // Update active state in dropdown
        themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === this.currentTheme);
        });
    }

    getThemeIcon(themeName) {
        const theme = this.themes[themeName];
        return theme ? theme.icon : 'fa-palette';
    }

    cycleTheme() {
        const themeNames = Object.keys(this.themes);
        const currentIndex = themeNames.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeNames.length;
        const nextTheme = themeNames[nextIndex];
        
        this.setTheme(nextTheme);
    }

    toggleDarkMode() {
        const isDark = this.currentTheme === 'dark' || 
                      (this.currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        this.setTheme(isDark ? 'light' : 'dark');
    }

    openThemeCreator() {
        const modal = document.createElement('div');
        modal.className = 'theme-creator-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Create Custom Theme</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="themeName">Theme Name</label>
                        <input type="text" id="themeName" placeholder="My Custom Theme">
                    </div>
                    <div class="color-controls">
                        ${Object.entries(this.themes.light.colors).map(([property, _]) => `
                            <div class="color-control">
                                <label for="${property}">${property}</label>
                                <input type="color" id="${property}" value="${this.getCurrentColor(property)}">
                                <input type="text" class="color-text" value="${this.getCurrentColor(property)}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="previewTheme">Preview</button>
                    <button class="btn btn-primary" id="saveTheme">Save Theme</button>
                    <button class="btn btn-ghost" id="cancelTheme">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupThemeCreatorEvents(modal);
    }

    setupThemeCreatorEvents(modal) {
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.getElementById('cancelTheme');
        const previewBtn = modal.getElementById('previewTheme');
        const saveBtn = modal.getElementById('saveTheme');
        const colorInputs = modal.querySelectorAll('input[type="color"]');
        const colorTexts = modal.querySelectorAll('.color-text');

        closeBtn.addEventListener('click', () => modal.remove());
        cancelBtn.addEventListener('click', () => modal.remove());

        // Sync color inputs
        colorInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                colorTexts[index].value = e.target.value;
            });
        });

        colorTexts.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                colorInputs[index].value = e.target.value;
            });
        });

        previewBtn.addEventListener('click', () => {
            this.previewCustomTheme(modal);
        });

        saveBtn.addEventListener('click', () => {
            this.saveCustomTheme(modal);
        });
    }

    previewCustomTheme(modal) {
        const colors = {};
        const colorInputs = modal.querySelectorAll('input[type="color"]');
        
        colorInputs.forEach(input => {
            colors[input.id] = input.value;
        });

        // Apply preview
        Object.entries(colors).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
    }

    saveCustomTheme(modal) {
        const themeName = modal.querySelector('#themeName').value.trim();
        if (!themeName) {
            alert('Please enter a theme name');
            return;
        }

        const colors = {};
        const colorInputs = modal.querySelectorAll('input[type="color"]');
        
        colorInputs.forEach(input => {
            colors[input.id] = input.value;
        });

        const customTheme = {
            name: themeName,
            icon: 'fa-palette',
            colors: colors
        };

        this.customThemes.push(customTheme);
        this.saveCustomThemes();
        this.updateCustomThemesUI();
        modal.remove();
        
        // Apply the new theme
        this.setTheme(themeName);
    }

    getCurrentColor(property) {
        return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
    }

    saveCustomThemes() {
        localStorage.setItem('custom-themes', JSON.stringify(this.customThemes));
    }

    loadCustomThemes() {
        const saved = localStorage.getItem('custom-themes');
        if (saved) {
            this.customThemes = JSON.parse(saved);
            this.updateCustomThemesUI();
        }
    }

    updateCustomThemesUI() {
        const container = document.getElementById('customThemes');
        if (!container) return;

        container.innerHTML = this.customThemes.map(theme => `
            <button class="theme-option custom-theme ${this.currentTheme === theme.name ? 'active' : ''}" 
                    data-theme="${theme.name}" 
                    title="${theme.name}">
                <i class="fas ${theme.icon}"></i>
                <span>${theme.name}</span>
                <button class="delete-theme" data-theme="${theme.name}" aria-label="Delete theme">
                    <i class="fas fa-trash"></i>
                </button>
                ${this.currentTheme === theme.name ? '<i class="fas fa-check"></i>' : ''}
            </button>
        `).join('');

        // Add event listeners for custom themes
        container.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-theme')) {
                    this.setTheme(option.dataset.theme);
                }
            });
        });

        container.querySelectorAll('.delete-theme').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteCustomTheme(btn.dataset.theme);
            });
        });
    }

    deleteCustomTheme(themeName) {
        if (confirm(`Delete theme "${themeName}"?`)) {
            this.customThemes = this.customThemes.filter(t => t.name !== themeName);
            this.saveCustomThemes();
            this.updateCustomThemesUI();
            
            // Switch to default theme if deleted theme was active
            if (this.currentTheme === themeName) {
                this.setTheme('light');
            }
        }
    }

    getAnimationPreference() {
        return localStorage.getItem('reduce-animations') === 'true' || 
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    setAnimationPreference(enabled) {
        localStorage.setItem('reduce-animations', enabled);
        this.applyThemeSettings(this.currentTheme);
    }

    getHighContrastPreference() {
        return localStorage.getItem('high-contrast-mode') === 'true';
    }

    setHighContrastPreference(enabled) {
        localStorage.setItem('high-contrast-mode', enabled);
        this.applyThemeSettings(this.currentTheme);
    }

    announceThemeChange(themeName) {
        const theme = this.themes[themeName] || this.customThemes.find(t => t.name === themeName);
        const message = `Theme changed to ${theme ? theme.name : themeName}`;
        
        // Announce to screen readers
        if (window.accessibilityManager) {
            window.accessibilityManager.announce(message);
        }
        
        // Track theme change
        if (window.privacyAnalytics) {
            window.privacyAnalytics.track('theme_change', { theme: themeName });
        }
    }

    // Public API
    getTheme() {
        return this.currentTheme;
    }

    getAvailableThemes() {
        return {
            ...this.themes,
            ...this.customThemes.reduce((acc, theme) => {
                acc[theme.name] = theme;
                return acc;
            }, {})
        };
    }

    addCustomTheme(theme) {
        this.customThemes.push(theme);
        this.saveCustomThemes();
        this.updateCustomThemesUI();
    }
}

// Initialize enhanced theme manager
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedThemeManager = new EnhancedThemeManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedThemeManager;
}
