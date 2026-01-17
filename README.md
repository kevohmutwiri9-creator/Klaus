# Klaus Portfolio

A modern, performant, and feature-rich portfolio website showcasing my work as a Full-Stack Developer & AI Engineer.

## ✨ Features

- 🚀 **Progressive Web App (PWA)** - Installable on devices
- 🌓 **Dark/Light Mode** - Automatic theme detection with manual toggle
- 📱 **Fully Responsive** - Optimized for all screen sizes
- ⚡ **Performance Optimized** - Lazy loading, service worker, optimized assets
- 📊 **Analytics Ready** - Google Analytics integration
- 🎨 **Modern Design** - Clean, professional, and accessible
- 🔍 **SEO Friendly** - Structured data, sitemap, meta tags
- 📝 **Blog Section** - Technical articles and tutorials
- 📈 **Ad Integration** - Google AdSense and Adsterra ready

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Variables, Flexbox, Grid
- **Performance**: Service Worker, Lazy Loading, Image Optimization
- **Deployment**: Netlify with CI/CD
- **Analytics**: Google Analytics
- **Monetization**: Google AdSense, Adsterra

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kevohmutwiri9-creator/Klaus.git
   cd Klaus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

   The site will open at `http://localhost:3000`

## 📦 Available Scripts

```bash
# Start development server
npm start

# Start development server with file watching
npm run dev

# Optimize images (place originals in img/originals/)
npm run optimize-images

# Deploy to production
npm run deploy

# Build and deploy
npm run build
```

## 📁 Project Structure

```
personal-website/
├── img/
│   ├── originals/          # Place original images here
│   └── optimized/         # Optimized images (auto-generated)
├── css/                  # Stylesheets
├── js/                   # JavaScript files
├── modules/               # Reusable modules
├── blog/                 # Blog posts
├── case-studies/          # Case studies
├── tutorials/             # Tutorials
├── index.html             # Homepage
├── projects.html          # Projects page
├── blog.html              # Blog listing
├── 404.html              # Custom 404 page
├── sw.js                 # Service worker
├── site.webmanifest       # PWA manifest
├── sitemap.xml           # SEO sitemap
├── robots.txt            # Search engine rules
├── netlify.toml          # Netlify configuration
└── package.json          # Project configuration
```

## 🎨 Customization

### Theme Colors

Edit the CSS variables in `styles.css`:

```css
:root {
  --primary: #00d4ff;        /* Primary accent color */
  --secondary: #ff6b6b;      /* Secondary accent */
  --accent: #4ecdc4;         /* Additional accent */
  /* ... more variables */
}
```

### Adding New Projects

1. Add project HTML in the projects section
2. Include relevant tags and descriptions
3. Add project images to `img/` directory
4. Update sitemap.xml if needed

### Blog Posts

1. Create new HTML file in `blog/` directory
2. Follow the existing template structure
3. Update blog.html with new post link
4. Update sitemap.xml

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```env
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXX
ADSTERRA_SITE_ID=XXXXXXXX
```

### Netlify Configuration

The `netlify.toml` file includes:
- Build settings
- Redirects
- Security headers
- Cache control
- Environment variables

## 📈 Performance

### Lighthouse Scores

- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Optimization Features

- **Service Worker**: Offline support and caching
- **Lazy Loading**: Images load on scroll
- **Minification**: CSS and JS optimization
- **Compression**: Gzip/Brotli on Netlify
- **CDN**: Netlify's global CDN

## 🚀 Deployment

### Automatic Deployment

1. Push to GitHub repository
2. Netlify automatically builds and deploys
3. Site is live at `https://klaus-portfolio-website.netlify.app`

### Manual Deployment

```bash
# Deploy to production
npm run deploy
```

## 🔍 SEO Features

- **Structured Data**: JSON-LD for rich snippets
- **Meta Tags**: Open Graph, Twitter Cards
- **Sitemap**: Automatic generation
- **Robots.txt**: Search engine instructions
- **Clean URLs**: Semantic HTML structure

## 📱 PWA Features

- **Installable**: Add to home screen
- **Offline Support**: Service worker caching
- **App-like**: Full-screen experience
- **Push Notifications**: Ready for implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Inter Font](https://rsms.me/inter/) - Beautiful typography
- [Netlify](https://www.netlify.com/) - Hosting and CI/CD
- [Google Fonts](https://fonts.google.com/) - Web fonts
- [Font Awesome](https://fontawesome.com/) - Icons

## 📞 Contact

- **Portfolio**: [https://klaus-portfolio-website.netlify.app](https://klaus-portfolio-website.netlify.app)
- **Email**: kevohmutwiri35@gmail.com
- **GitHub**: [@kevohmutwiri9-creator](https://github.com/kevohmutwiri9-creator)

---

Made with ❤️ and lots of ☕ by Klaus
