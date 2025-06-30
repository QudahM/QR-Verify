# QR Nexus

A professional QR code generation and analytics platform built with React, TypeScript, and Supabase. Create beautiful, trackable QR codes with real-time analytics and advanced customization options.

![QR Nexus](https://qrnexus.site/og-image.png)

## 🌟 Features

### Core Functionality
- **Instant QR Generation** - Create high-quality QR codes in milliseconds
- **Advanced Customization** - Professional design templates, colors, gradients, and logo embedding
- **Security Verification** - Built-in URL safety checking with Google Safe Browsing API
- **Real-time Analytics** - Track scans, user behavior, and performance metrics
- **Multi-format Export** - Download as PNG, SVG, or PDF with various resolutions

### Analytics & Tracking
- **Real-time Scan Tracking** - Live updates when QR codes are scanned
- **Detailed Analytics Dashboard** - Comprehensive metrics and visualizations
- **Privacy-First Approach** - No location tracking, minimal data collection
- **Session Analysis** - Unique visitor tracking and engagement metrics
- **Historical Data** - 30-day scan history with trend analysis

### User Experience
- **Responsive Design** - Optimized for all devices and screen sizes
- **Dark/Light Mode** - Automatic theme switching with system preference
- **Glass Morphism UI** - Modern, professional interface design
- **Progressive Web App** - Fast loading with offline capabilities
- **Accessibility** - WCAG compliant with keyboard navigation support

## 🚀 Live Demo

Visit [QR Nexus](https://qrnexus.site) to try the application.

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with full IntelliSense
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Lucide React** - Beautiful, customizable SVG icons

### Backend & Database
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Row Level Security** - Database-level security policies
- **Edge Functions** - Serverless functions for API endpoints
- **Real-time Subscriptions** - Live data updates via WebSockets

### QR Code Technology
- **QRCode.js** - High-quality QR code generation
- **QR Scanner** - Client-side QR code reading and verification
- **Custom Renderer** - Advanced styling and logo embedding
- **Multiple Formats** - Support for text, URLs, and custom content

### Security & Privacy
- **Google Safe Browsing** - URL threat detection and verification
- **Privacy-First Design** - Minimal data collection, no location tracking
- **Secure Authentication** - Supabase Auth with email/password
- **HTTPS Everywhere** - End-to-end encryption for all communications

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Safe Browsing API key (optional)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/qr-nexus.git
   cd qr-nexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Optional: Google Safe Browsing API
   VITE_GOOGLE_SAFE_BROWSING_KEY=your_api_key
   ```

4. **Database Setup**
   
   Run the Supabase migrations:
   ```bash
   # If using Supabase CLI
   supabase db reset
   
   # Or manually run the migration files in order:
   # supabase/migrations/*.sql
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open in Browser**
   ```
   http://localhost:5173
   ```

## 🗄️ Database Schema

### Core Tables

#### `qr_codes`
Stores QR code records with tracking information:
```sql
- id (uuid, primary key) - Unique QR code identifier
- user_id (uuid) - Owner of the QR code
- content (text) - Original content/URL
- type ('text' | 'url') - Content type
- qr_data_url (text) - Base64 encoded QR image
- tracking_url (text) - Tracking redirect URL
- original_qr_id (uuid) - Original QR identifier
- is_tracked (boolean) - Whether tracking is enabled
- scan_count (integer) - Total scan count
- last_scanned_at (timestamp) - Last scan timestamp
- created_at (timestamp) - Creation timestamp
- updated_at (timestamp) - Last update timestamp
```

#### `qr_scans`
Records individual scan events:
```sql
- id (uuid, primary key) - Unique scan identifier
- qr_code_id (uuid) - Reference to QR code
- user_agent (text) - Browser/device information
- ip_address (inet) - Scanner IP address
- referrer (text) - Referring page URL
- session_id (text) - Unique session identifier
- scanned_at (timestamp) - Scan timestamp
- location (jsonb) - Location data (not collected for privacy)
```

### Database Functions

#### Analytics Functions
- `get_scan_summary(qr_code_uuid)` - Returns comprehensive scan statistics
- `get_daily_scan_analytics(qr_code_uuid, days_back)` - Daily scan data for charts
- `create_tracked_qr_code()` - Creates trackable QR code records
- `update_qr_scan_stats()` - Updates scan counts via triggers

#### Security Policies
- Row Level Security (RLS) enabled on all tables
- Users can only access their own QR codes and scan data
- Public scan logging allowed for tracking functionality
- Authenticated access required for analytics and management

## 🎨 Customization Features

### Design Templates
- **Business Professional** - Clean, corporate styling
- **Modern Gradient** - Vibrant gradient designs
- **Event & Party** - Fun, colorful themes
- **Nature & Eco** - Earth-friendly green tones
- **Luxury Gold** - Premium golden styling
- **Creative Arts** - Artistic and expressive designs

### Styling Options
- **Colors** - Custom foreground, background, and eye colors
- **Gradients** - Linear and radial gradients with direction control
- **Shapes** - Square, circle, rounded, leaf, and diamond patterns
- **Logo Embedding** - Upload and position custom logos
- **Error Correction** - Adjustable error correction levels

### Export Formats
- **PNG** - High-resolution raster images (512px - 4096px)
- **SVG** - Scalable vector graphics for print
- **PDF** - Print-ready documents with metadata

## 📊 Analytics Dashboard

### Key Metrics
- **Total Scans** - Lifetime scan count
- **Today's Scans** - Current day activity
- **Weekly Trends** - 7-day performance
- **Unique Sessions** - Individual visitor count

### Visualizations
- **Daily Scan Charts** - 7-day and 30-day trend graphs
- **Real-time Updates** - Live scan notifications
- **Performance Metrics** - Engagement and usage patterns
- **Export Capabilities** - Data export for external analysis

### Privacy Features
- **No Location Tracking** - Geographic data not collected
- **Minimal Data Collection** - Only essential metrics stored
- **User Consent** - Clear privacy policies and opt-in tracking
- **Data Retention** - Configurable data retention policies

## 🔒 Security Features

### URL Safety Verification
- **Google Safe Browsing Integration** - Real-time threat detection
- **Malware Detection** - Protection against malicious URLs
- **Phishing Protection** - Social engineering attack prevention
- **Real-time Scanning** - Instant verification of uploaded QR codes

### Authentication & Authorization
- **Supabase Auth** - Secure email/password authentication
- **Row Level Security** - Database-level access controls
- **Session Management** - Secure session handling
- **API Security** - Protected endpoints with authentication

### Privacy Protection
- **GDPR Compliant** - European privacy regulation compliance
- **Data Minimization** - Collect only necessary information
- **User Control** - Users control their data and privacy settings
- **Transparent Policies** - Clear privacy and data usage policies

## 🚀 Deployment

### Netlify Deployment (Recommended)

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   # Using Netlify CLI
   netlify deploy --prod --dir=dist
   
   # Or connect your GitHub repository to Netlify
   ```

3. **Configure Environment Variables**
   Set the following in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_SAFE_BROWSING_KEY`

4. **Set up Redirects**
   The `public/_redirects` file handles SPA routing:
   ```
   /* /index.html 200
   ```

### Alternative Deployment Options

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Performance Testing
```bash
npm run lighthouse
```

## 📈 Performance Optimizations

### Frontend Optimizations
- **Code Splitting** - Lazy loading of components
- **Image Optimization** - WebP format with fallbacks
- **Bundle Analysis** - Webpack bundle analyzer integration
- **Caching Strategy** - Service worker for offline functionality

### Database Optimizations
- **Indexed Queries** - Optimized database indexes
- **Connection Pooling** - Efficient database connections
- **Query Optimization** - Efficient SQL queries and functions
- **Real-time Subscriptions** - WebSocket connections for live updates

### CDN & Caching
- **Static Asset CDN** - Global content delivery
- **Browser Caching** - Optimized cache headers
- **API Caching** - Redis caching for frequently accessed data
- **Image CDN** - Optimized image delivery

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code linting with custom rules
- **Prettier** - Code formatting standards
- **Conventional Commits** - Standardized commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure and real-time capabilities
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon library
- **QRCode.js** - QR code generation library
- **React Community** - Amazing ecosystem and tools

## 📞 Support

### Documentation
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Customization Guide](docs/customization.md)

### Community
- [GitHub Issues](https://github.com/yourusername/qr-nexus/issues)
- [Discussions](https://github.com/yourusername/qr-nexus/discussions)
- [Discord Community](https://discord.gg/qrnexus)

### Commercial Support
For enterprise support and custom development:
- Email: support@qrnexus.site
- Website: [qrnexus.site](https://qrnexus.site)

---

**Built with ❤️ by the QR Nexus Team**

*Making QR codes beautiful, secure, and insightful.*