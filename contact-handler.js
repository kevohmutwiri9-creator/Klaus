// Advanced Contact Form Handler with Email Integration
class ContactFormHandler {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.newsletterForm = document.getElementById('newsletterForm');
        this.aiAdvisorForm = document.getElementById('aiAdvisorForm');
        
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupNewsletterForm();
        this.setupAIAdvisor();
        this.setupFormValidation();
        this.setupAnalytics();
    }

    setupContactForm() {
        if (!this.contactForm) return;

        this.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(this.contactForm);
            const submitButton = this.contactForm.querySelector('button[type="submit"]');
            const statusElement = document.getElementById('contactStatus');
            
            // Show loading state
            this.setLoadingState(submitButton, true);
            this.showStatus(statusElement, 'Sending your message...', 'loading');
            
            try {
                // Validate form
                if (!this.validateForm(this.contactForm)) {
                    throw new Error('Please fill in all required fields correctly.');
                }

                // Submit to Netlify
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });

                if (!response.ok) {
                    throw new Error('Failed to send message. Please try again.');
                }

                // Success
                this.showStatus(statusElement, 'Message sent successfully! I\'ll get back to you soon.', 'success');
                this.contactForm.reset();
                
                // Track conversion
                this.trackEvent('contact_form_submit', {
                    form_name: 'contact',
                    success: true
                });

                // Send confirmation email (if configured)
                await this.sendConfirmationEmail(formData);

            } catch (error) {
                console.error('Contact form error:', error);
                this.showStatus(statusElement, error.message, 'error');
                
                // Track error
                this.trackEvent('contact_form_error', {
                    form_name: 'contact',
                    error: error.message
                });
            } finally {
                this.setLoadingState(submitButton, false);
            }
        });
    }

    setupNewsletterForm() {
        if (!this.newsletterForm) return;

        this.newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(this.newsletterForm);
            const submitButton = this.newsletterForm.querySelector('button[type="submit"]');
            const statusElement = document.getElementById('newsletterStatus');
            
            this.setLoadingState(submitButton, true);
            this.showStatus(statusElement, 'Subscribing...', 'loading');
            
            try {
                if (!this.validateForm(this.newsletterForm)) {
                    throw new Error('Please enter a valid email address.');
                }

                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });

                if (!response.ok) {
                    throw new Error('Failed to subscribe. Please try again.');
                }

                this.showStatus(statusElement, 'Successfully subscribed! Check your email for confirmation.', 'success');
                this.newsletterForm.reset();
                
                this.trackEvent('newsletter_subscribe', {
                    success: true
                });

            } catch (error) {
                console.error('Newsletter form error:', error);
                this.showStatus(statusElement, error.message, 'error');
                
                this.trackEvent('newsletter_error', {
                    error: error.message
                });
            } finally {
                this.setLoadingState(submitButton, false);
            }
        });
    }

    setupAIAdvisor() {
        if (!this.aiAdvisorForm) return;

        this.aiAdvisorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const prompt = document.getElementById('aiPrompt').value.trim();
            const submitButton = this.aiAdvisorForm.querySelector('button[type="submit"]');
            const statusElement = document.getElementById('aiStatus');
            const responseElement = document.getElementById('aiResponse');
            const responseContent = document.getElementById('aiResponseContent');
            const resetButton = document.getElementById('aiResetButton');
            
            if (!prompt) {
                this.showStatus(statusElement, 'Please describe your project idea.', 'error');
                return;
            }

            this.setLoadingState(submitButton, true);
            this.showStatus(statusElement, 'Generating suggestions...', 'loading');
            responseElement.hidden = true;
            
            try {
                // Simulate AI response (in production, this would call an actual AI API)
                const suggestions = await this.generateAISuggestions(prompt);
                
                responseContent.innerHTML = this.formatAIResponse(suggestions);
                responseElement.hidden = false;
                this.showStatus(statusElement, '', 'success');
                
                // Show reset button
                resetButton.hidden = false;
                submitButton.hidden = true;
                
                this.trackEvent('ai_advisor_query', {
                    prompt_length: prompt.length,
                    success: true
                });

            } catch (error) {
                console.error('AI Advisor error:', error);
                this.showStatus(statusElement, 'Failed to generate suggestions. Please try again.', 'error');
                
                this.trackEvent('ai_advisor_error', {
                    error: error.message
                });
            } finally {
                this.setLoadingState(submitButton, false);
            }
        });

        // Reset button handler
        const resetButton = document.getElementById('aiResetButton');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.aiAdvisorForm.reset();
                document.getElementById('aiResponse').hidden = true;
                document.getElementById('aiStatus').textContent = '';
                resetButton.hidden = true;
                this.aiAdvisorForm.querySelector('button[type="submit"]').hidden = false;
            });
        }
    }

    async generateAISuggestions(prompt) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate contextual suggestions based on prompt keywords
        const suggestions = {
            scope: this.analyzeScope(prompt),
            techStack: this.suggestTechStack(prompt),
            timeline: this.estimateTimeline(prompt),
            features: this.suggestFeatures(prompt),
            nextSteps: this.suggestNextSteps(prompt)
        };

        return suggestions;
    }

    analyzeScope(prompt) {
        const keywords = prompt.toLowerCase();
        if (keywords.includes('mvp') || keywords.includes('minimum')) {
            return 'MVP Development - Focus on core functionality only';
        } else if (keywords.includes('enterprise') || keywords.includes('large')) {
            return 'Enterprise Solution - Comprehensive feature set with scalability';
        } else {
            return 'Standard Application - Balanced feature set for general use';
        }
    }

    suggestTechStack(prompt) {
        const keywords = prompt.toLowerCase();
        let stack = [];
        
        if (keywords.includes('ecommerce') || keywords.includes('shop')) {
            stack = ['React/Next.js', 'Node.js', 'PostgreSQL', 'Stripe API', 'Redis'];
        } else if (keywords.includes('mobile') || keywords.includes('app')) {
            stack = ['React Native', 'Firebase', 'Redux', 'TypeScript'];
        } else if (keywords.includes('dashboard') || keywords.includes('analytics')) {
            stack = ['React', 'D3.js', 'Node.js', 'MongoDB', 'WebSocket'];
        } else {
            stack = ['React', 'Node.js', 'Express', 'MongoDB/PostgreSQL', 'REST API'];
        }
        
        return stack;
    }

    estimateTimeline(prompt) {
        const keywords = prompt.toLowerCase();
        if (keywords.includes('mvp') || keywords.includes('simple')) {
            return '4-6 weeks for MVP, 8-12 weeks for full version';
        } else if (keywords.includes('complex') || keywords.includes('enterprise')) {
            return '12-16 weeks for MVP, 6+ months for full implementation';
        } else {
            return '6-8 weeks for MVP, 12-16 weeks for full version';
        }
    }

    suggestFeatures(prompt) {
        const keywords = prompt.toLowerCase();
        let features = [];
        
        if (keywords.includes('user') || keywords.includes('account')) {
            features.push('User Authentication', 'Profile Management', 'Role-based Access');
        }
        if (keywords.includes('payment') || keywords.includes('ecommerce')) {
            features.push('Payment Processing', 'Order Management', 'Inventory Tracking');
        }
        if (keywords.includes('notification') || keywords.includes('alert')) {
            features.push('Real-time Notifications', 'Email Templates', 'Push Notifications');
        }
        
        if (features.length === 0) {
            features = ['Core CRUD Operations', 'User Authentication', 'Data Analytics Dashboard', 'API Documentation'];
        }
        
        return features;
    }

    suggestNextSteps(prompt) {
        return [
            '1. Define detailed user stories and acceptance criteria',
            '2. Create wireframes and UI/UX designs',
            '3. Set up development environment and CI/CD pipeline',
            '4. Implement core backend API and database schema',
            '5. Develop frontend components and integrate with API',
            '6. Set up testing framework and write test cases',
            '7. Deploy to staging environment for user testing',
            '8. Production deployment and monitoring setup'
        ];
    }

    formatAIResponse(suggestions) {
        return `
            <div class="ai-suggestion">
                <h4>📋 Project Scope</h4>
                <p>${suggestions.scope}</p>
            </div>
            <div class="ai-suggestion">
                <h4>🛠️ Recommended Tech Stack</h4>
                <ul>${suggestions.techStack.map(tech => `<li>${tech}</li>`).join('')}</ul>
            </div>
            <div class="ai-suggestion">
                <h4>⏱️ Estimated Timeline</h4>
                <p>${suggestions.timeline}</p>
            </div>
            <div class="ai-suggestion">
                <h4>✨ Key Features to Consider</h4>
                <ul>${suggestions.features.map(feature => `<li>${feature}</li>`).join('')}</ul>
            </div>
            <div class="ai-suggestion">
                <h4>🚀 Next Steps</h4>
                <ol>${suggestions.nextSteps.map(step => `<li>${step}</li>`).join('')}</ol>
            </div>
        `;
    }

    setupFormValidation() {
        // Add real-time validation
        const inputs = document.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Min length validation
        if (field.hasAttribute('minlength') && value) {
            const minLength = parseInt(field.getAttribute('minlength'));
            if (value.length < minLength) {
                isValid = false;
                errorMessage = `Minimum ${minLength} characters required`;
            }
        }

        this.showFieldError(field, errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);

        if (message) {
            field.classList.add('error');
            
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.setAttribute('role', 'alert');
            
            field.parentNode.appendChild(errorElement);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    setLoadingState(button, loading) {
        if (loading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || button.textContent;
        }
    }

    showStatus(element, message, type) {
        if (!element) return;
        
        element.textContent = message;
        element.className = `form-status ${type}`;
        
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                element.textContent = '';
                element.className = 'form-status';
            }, 5000);
        }
    }

    async sendConfirmationEmail(formData) {
        // In a real implementation, this would call your backend service
        // to send a confirmation email to the user
        console.log('Confirmation email would be sent to:', formData.get('email'));
    }

    setupAnalytics() {
        // Track form views
        this.trackEvent('form_view', {
            contact_form: !!this.contactForm,
            newsletter_form: !!this.newsletterForm,
            ai_advisor: !!this.aiAdvisorForm
        });
    }

    trackEvent(eventName, data) {
        // Google Analytics 4 event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }

        // Custom analytics tracking
        console.log('Analytics Event:', eventName, data);
    }
}

// Initialize contact form handler
document.addEventListener('DOMContentLoaded', () => {
    window.contactFormHandler = new ContactFormHandler();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactFormHandler;
}
