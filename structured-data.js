// Enhanced Structured Data Manager
class StructuredDataManager {
    constructor() {
        this.siteData = {
            name: 'Klaus Portfolio',
            description: 'Computer Science graduate specializing in scalable web applications, AI integration, and user-centered product development',
            url: 'https://klaus-portifolio-website.netlify.app/',
            author: {
                name: 'Klaus',
                email: 'kevohmutwiri35@gmail.com',
                jobTitle: 'Software Developer',
                sameAs: [
                    'https://github.com/kevohmutwiri9-creator',
                    'https://www.linkedin.com/in/kevohmutwiri/',
                    'https://web.facebook.com/kevohx2071',
                    'https://x.com/kevohmutwiri9',
                    'https://www.instagram.com/kevohx2071/'
                ]
            }
        };
        
        this.init();
    }

    init() {
        this.setupBasicStructuredData();
        this.setupPageSpecificData();
        this.setupOrganizationData();
        this.setupWebsiteData();
    }

    setupBasicStructuredData() {
        // Person schema for the author
        const personSchema = {
            '@context': 'https://schema.org',
            '@type': 'Person',
            'name': this.siteData.author.name,
            'jobTitle': this.siteData.author.jobTitle,
            'description': this.siteData.description,
            'url': this.siteData.url,
            'email': this.siteData.author.email,
            'sameAs': this.siteData.author.sameAs,
            'knowsAbout': [
                'Web Development',
                'JavaScript',
                'React',
                'Node.js',
                'Python',
                'Machine Learning',
                'Full-Stack Development',
                'API Design',
                'Database Design',
                'Cloud Computing'
            ],
            'skills': [
                'Frontend Development',
                'Backend Development',
                'Database Management',
                'API Development',
                'UI/UX Design',
                'Performance Optimization',
                'Security Implementation',
                'Agile Methodologies'
            ]
        };

        this.addStructuredData(personSchema, 'person');
    }

    setupPageSpecificData() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'home':
                this.setupHomePageData();
                break;
            case 'projects':
                this.setupProjectsPageData();
                break;
            case 'blog':
            case 'blog-index':
                this.setupBlogPageData();
                break;
            case 'tutorials':
                this.setupTutorialsPageData();
                break;
            case 'case-studies':
                this.setupCaseStudiesPageData();
                break;
            case 'resume':
                this.setupResumePageData();
                break;
            default:
                this.setupDefaultPageData(currentPage);
        }
    }

    setupHomePageData() {
        const homePageSchema = {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': 'Klaus - Full-Stack Developer & Machine Learning Enthusiast',
            'description': this.siteData.description,
            'url': this.siteData.url,
            'inLanguage': 'en',
            'isPartOf': {
                '@type': 'WebSite',
                'name': this.siteData.name,
                'url': this.siteData.url
            },
            'about': [
                {
                    '@type': 'Thing',
                    'name': 'Web Development'
                },
                {
                    '@type': 'Thing', 
                    'name': 'Machine Learning'
                },
                {
                    '@type': 'Thing',
                    'name': 'Software Engineering'
                }
            ],
            'mainEntity': {
                '@type': 'Person',
                'name': this.siteData.author.name,
                'jobTitle': this.siteData.author.jobTitle,
                'sameAs': this.siteData.author.sameAs
            }
        };

        this.addStructuredData(homePageSchema, 'homepage');
    }

    setupProjectsPageData() {
        const projectsSchema = {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            'name': 'Projects - Klaus Portfolio',
            'description': 'Explore my portfolio of software development projects, including web applications, APIs, and machine learning solutions.',
            'url': `${this.siteData.url}projects.html`,
            'inLanguage': 'en',
            'isPartOf': {
                '@type': 'WebSite',
                'name': this.siteData.name,
                'url': this.siteData.url
            },
            'mainEntity': {
                '@type': 'ItemList',
                'itemListElement': this.getProjectItems()
            }
        };

        this.addStructuredData(projectsSchema, 'projects');
    }

    setupBlogPageData() {
        const blogSchema = {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            'name': 'Technical Blog - Klaus',
            'description': 'Technical insights, tutorials, and best practices in web development, machine learning, and software engineering.',
            'url': `${this.siteData.url}blog-index.html`,
            'inLanguage': 'en',
            'author': {
                '@type': 'Person',
                'name': this.siteData.author.name,
                'sameAs': this.siteData.author.sameAs
            },
            'publisher': {
                '@type': 'Organization',
                'name': this.siteData.name,
                'url': this.siteData.url
            },
            'blogPost': this.getBlogPosts()
        };

        this.addStructuredData(blogSchema, 'blog');
    }

    setupTutorialsPageData() {
        const tutorialsSchema = {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            'name': 'Tutorials - Klaus',
            'description': 'Step-by-step tutorials covering web development, React, Node.js, CSS, performance optimization, and modern development practices.',
            'url': `${this.siteData.url}tutorials.html`,
            'inLanguage': 'en',
            'isPartOf': {
                '@type': 'WebSite',
                'name': this.siteData.name,
                'url': this.siteData.url
            },
            'mainEntity': {
                '@type': 'ItemList',
                'itemListElement': this.getTutorialItems()
            },
            'teaches': [
                'Web Development',
                'JavaScript Programming',
                'React Framework',
                'Node.js Development',
                'CSS Design',
                'Performance Optimization',
                'API Development'
            ]
        };

        this.addStructuredData(tutorialsSchema, 'tutorials');
    }

    setupCaseStudiesPageData() {
        const caseStudiesSchema = {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            'name': 'Case Studies - Klaus',
            'description': 'Detailed case studies showcasing problem-solving, technical solutions, and measurable outcomes in software development projects.',
            'url': `${this.siteData.url}case-studies.html`,
            'inLanguage': 'en',
            'isPartOf': {
                '@type': 'WebSite',
                'name': this.siteData.name,
                'url': this.siteData.url
            },
            'mainEntity': {
                '@type': 'ItemList',
                'itemListElement': this.getCaseStudyItems()
            }
        };

        this.addStructuredData(caseStudiesSchema, 'case-studies');
    }

    setupResumePageData() {
        const resumeSchema = {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': 'Resume - Klaus',
            'description': 'Professional resume and CV for Klaus, showcasing skills, experience, and qualifications in software development.',
            'url': `${this.siteData.url}resume.html`,
            'inLanguage': 'en',
            'isPartOf': {
                '@type': 'WebSite',
                'name': this.siteData.name,
                'url': this.siteData.url
            },
            'mainEntity': {
                '@type': 'Person',
                'name': this.siteData.author.name,
                'jobTitle': this.siteData.author.jobTitle,
                'description': this.siteData.description,
                'email': this.siteData.author.email,
                'sameAs': this.siteData.author.sameAs,
                'knowsAbout': this.getSkills(),
                'alumniOf': {
                    '@type': 'EducationalOrganization',
                    'name': 'Baringo National Polytechnic'
                },
                'hasOccupation': {
                    '@type': 'Occupation',
                    'name': 'Software Developer',
                    'description': 'Full-stack developer specializing in web applications and machine learning',
                    'occupationalCategory': 'Software Development'
                }
            }
        };

        this.addStructuredData(resumeSchema, 'resume');
    }

    setupDefaultPageData(page) {
        const defaultSchema = {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': `${this.getPageTitle(page)} - ${this.siteData.name}`,
            'description': this.getPageDescription(page),
            'url': this.getCurrentPageUrl(),
            'inLanguage': 'en',
            'isPartOf': {
                '@type': 'WebSite',
                'name': this.siteData.name,
                'url': this.siteData.url
            }
        };

        this.addStructuredData(defaultSchema, `page-${page}`);
    }

    setupOrganizationData() {
        const organizationSchema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': this.siteData.name,
            'description': this.siteData.description,
            'url': this.siteData.url,
            'logo': `${this.siteData.url}img/profile.jpg`,
            'sameAs': this.siteData.author.sameAs,
            'contactPoint': {
                '@type': 'ContactPoint',
                'telephone': '+254791674888',
                'contactType': 'professional',
                'availableLanguage': ['English']
            },
            'founder': {
                '@type': 'Person',
                'name': this.siteData.author.name,
                'sameAs': this.siteData.author.sameAs
            }
        };

        this.addStructuredData(organizationSchema, 'organization');
    }

    setupWebsiteData() {
        const websiteSchema = {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': this.siteData.name,
            'description': this.siteData.description,
            'url': this.siteData.url,
            'inLanguage': 'en',
            'author': {
                '@type': 'Person',
                'name': this.siteData.author.name,
                'sameAs': this.siteData.author.sameAs
            },
            'publisher': {
                '@type': 'Organization',
                'name': this.siteData.name,
                'url': this.siteData.url
            },
            'potentialAction': {
                '@type': 'SearchAction',
                'target': {
                    '@type': 'EntryPoint',
                    'urlTemplate': `${this.siteData.url}?q={search_term_string}`
                },
                'query-input': 'required name=search_term_string'
            }
        };

        this.addStructuredData(websiteSchema, 'website');
    }

    getProjectItems() {
        return [
            {
                '@type': 'SoftwareApplication',
                'name': 'Twiga Threads Marketplace',
                'description': 'E-commerce platform for textile trading with real-time inventory management',
                'url': `${this.siteData.url}projects.html#twiga-threads`,
                'applicationCategory': 'BusinessApplication',
                'operatingSystem': 'Web Browser',
                'offers': {
                    '@type': 'Offer',
                    'price': '0',
                    'priceCurrency': 'USD'
                }
            },
            {
                '@type': 'SoftwareApplication',
                'name': 'ChurnGuard ML',
                'description': 'Machine learning powered customer churn prediction and analytics dashboard',
                'url': `${this.siteData.url}projects.html#churnguard`,
                'applicationCategory': 'BusinessApplication',
                'operatingSystem': 'Web Browser'
            },
            {
                '@type': 'SoftwareApplication',
                'name': 'QuestMate',
                'description': 'Mobile workflow management application for task automation',
                'url': `${this.siteData.url}projects.html#questmate`,
                'applicationCategory': 'ProductivityApplication',
                'operatingSystem': 'iOS, Android'
            }
        ];
    }

    getBlogPosts() {
        return [
            {
                '@type': 'BlogPosting',
                'headline': 'Web Performance Optimization: A Comprehensive Guide',
                'url': `${this.siteData.url}blog/web-performance-optimization.html`,
                'datePublished': '2024-01-15',
                'author': {
                    '@type': 'Person',
                    'name': this.siteData.author.name
                },
                'publisher': {
                    '@type': 'Organization',
                    'name': this.siteData.name
                }
            },
            {
                '@type': 'BlogPosting',
                'headline': 'Understanding JavaScript Promises and Async/Await',
                'url': `${this.siteData.url}blog/async-javascript-promises.html`,
                'datePublished': '2024-01-10',
                'author': {
                    '@type': 'Person',
                    'name': this.siteData.author.name
                },
                'publisher': {
                    '@type': 'Organization',
                    'name': this.siteData.name
                }
            }
        ];
    }

    getTutorialItems() {
        return [
            {
                '@type': 'Course',
                'name': 'CSS Grid: Responsive Layouts',
                'description': 'Master CSS Grid to create complex, responsive layouts with ease',
                'url': `${this.siteData.url}tutorials/css-grid-responsive-layouts.html`,
                'provider': {
                    '@type': 'Person',
                    'name': this.siteData.author.name
                },
                'educationalLevel': 'Intermediate',
                'teaches': 'CSS Grid Layout',
                'timeRequired': 'PT45M'
            },
            {
                '@type': 'Course',
                'name': 'React Performance Optimization',
                'description': 'Optimize React applications for maximum performance',
                'url': `${this.siteData.url}tutorials/react-performance-optimization.html`,
                'provider': {
                    '@type': 'Person',
                    'name': this.siteData.author.name
                },
                'educationalLevel': 'Advanced',
                'teaches': 'React Optimization',
                'timeRequired': 'PT60M'
            }
        ];
    }

    getCaseStudyItems() {
        return [
            {
                '@type': 'Article',
                'headline': 'Driving Faster Deliveries for SwiftShip',
                'url': `${this.siteData.url}case-studies.html#swiftship`,
                'author': {
                    '@type': 'Person',
                    'name': this.siteData.author.name
                },
                'publisher': {
                    '@type': 'Organization',
                    'name': this.siteData.name
                },
                'datePublished': '2024-01-01',
                'articleSection': 'Logistics SaaS'
            },
            {
                '@type': 'Article',
                'headline': 'Boosting Retention for FinEdge',
                'url': `${this.siteData.url}case-studies.html#finedge`,
                'author': {
                    '@type': 'Person',
                    'name': this.siteData.author.name
                },
                'publisher': {
                    '@type': 'Organization',
                    'name': this.siteData.name
                },
                'datePublished': '2024-01-01',
                'articleSection': 'FinTech Analytics'
            }
        ];
    }

    getSkills() {
        return [
            'JavaScript', 'React', 'Node.js', 'Python', 'TypeScript',
            'HTML5', 'CSS3', 'MongoDB', 'PostgreSQL', 'Redis',
            'Docker', 'Kubernetes', 'AWS', 'Git', 'Agile',
            'REST APIs', 'GraphQL', 'Machine Learning', 'Data Analysis'
        ];
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

        return pageMap[filename] || 'unknown';
    }

    getPageTitle(page) {
        const titles = {
            'home': 'Home',
            'projects': 'Projects',
            'blog': 'Blog',
            'tutorials': 'Tutorials',
            'case-studies': 'Case Studies',
            'resume': 'Resume',
            'insights': 'Insights',
            'privacy': 'Privacy Policy',
            'terms': 'Terms of Service',
            'disclaimer': 'Disclaimer'
        };

        return titles[page] || 'Page';
    }

    getPageDescription(page) {
        const descriptions = {
            'home': this.siteData.description,
            'projects': 'Explore my portfolio of software development projects, including web applications, APIs, and machine learning solutions.',
            'blog': 'Technical insights, tutorials, and best practices in web development, machine learning, and software engineering.',
            'tutorials': 'Step-by-step tutorials covering web development, React, Node.js, CSS, performance optimization, and modern development practices.',
            'case-studies': 'Detailed case studies showcasing problem-solving, technical solutions, and measurable outcomes in software development projects.',
            'resume': 'Professional resume and CV showcasing skills, experience, and qualifications in software development.',
            'privacy': 'Privacy policy for Klaus portfolio website, describing data collection and usage practices.',
            'terms': 'Terms of service for Klaus portfolio website, outlining usage rights and limitations.',
            'disclaimer': 'Disclaimer for Klaus portfolio website, limiting liability for content and services.'
        };

        return descriptions[page] || this.siteData.description;
    }

    getCurrentPageUrl() {
        return window.location.href;
    }

    addStructuredData(data, id) {
        // Remove existing structured data with same ID
        const existing = document.querySelector(`script[type="application/ld+json"][data-structured="${id}"]`);
        if (existing) {
            existing.remove();
        }

        // Create new structured data script
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-structured', id);
        script.textContent = JSON.stringify(data, null, 2);
        
        document.head.appendChild(script);
    }

    // Method to dynamically update structured data
    updateStructuredData(id, newData) {
        this.addStructuredData(newData, id);
    }
}

// Initialize structured data manager
document.addEventListener('DOMContentLoaded', () => {
    window.structuredDataManager = new StructuredDataManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StructuredDataManager;
}
