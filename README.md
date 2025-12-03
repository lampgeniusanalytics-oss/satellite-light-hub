# 🌟 Satellite Light Hub

**Multi-Site Admin Dashboard for Managing Satellite Lighting Websites**

A comprehensive admin dashboard system to create, manage, and deploy up to 25 satellite lighting websites. Each site is powered by category-specific RSS feeds from your main site (Lamp Genius), creating a network of referring domains with synchronized product catalogs.

---

## 🚀 Features

### Admin Dashboard
- **User Authentication**: Secure admin login
- **Multi-Site Management**: Create and manage up to 25 satellite sites
- **RSS Feed Configuration**: Category-specific feed URLs shared across all sites
- **Real-Time Product Sync**: Sync products from RSS feeds with one click
- **Deployment Management**: Support for multiple hosting platforms

### Satellite Sites
- **Multiple Templates**: HTML, Next.js, React
- **Full SEO**: Meta tags, schema markup, HTML & XML sitemaps
- **Standard Pages**: Home, About, Contact, Terms, Privacy, Payment Methods, Delivery, Trade Customers
- **Category Structure**:
  - **Indoor Lighting**: Ceiling Lights, Pendant Lighting, Chandeliers, Ceiling Spotlights, Wall Lights, Table Lamps, Floor Lamps
  - **Outdoor Lighting**: Outdoor Wall Lights, Outdoor Pendant Lights, Outdoor Ceiling Lights
- **Product Pages**: Full product schema, tables, prices, "Also available from Lamp Genius" link
- **Cart Integration**: Add to cart redirects to main Lamp Genius site

### RSS Feed System
- **Category-Specific Feeds**: Each category/subcategory has its own dedicated feed URL
- **Shared Across Sites**: Feed URLs are configured once and applied to all sites
- **Server-Side Parsing**: Regex-based XML parser (no DOMParser issues)
- **Flexible Matching**: Handles Google Shopping feed format with namespaced tags
- **CDATA Support**: Properly handles CDATA sections and special characters

---

## 📋 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: SQLite (PostgreSQL-ready schema)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **RSS Parsing**: Custom server-side regex-based parser

---

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd satellite-light-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   npm run init-db
   ```

   This will:
   - Create SQLite database
   - Set up schema
   - Create default admin user
   - Seed global categories

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the dashboard**
   - Open http://localhost:3000
   - Login with:
     - Username: `admin`
     - Password: `James1234`

---

## 📦 Database Schema

### Global Categories
Master list of categories with feed URLs (shared across all sites):
- Indoor Lighting (parent)
  - Ceiling Lights
  - Pendant Lighting
  - Chandeliers
  - Ceiling Spotlights
  - Wall Lights
  - Table Lamps
  - Floor Lamps
- Outdoor Lighting (parent)
  - Outdoor Wall Lights
  - Outdoor Pendant Lights
  - Outdoor Ceiling Lights

### Key Tables
- `global_categories`: Master category list with feed URLs
- `sites`: Satellite site configurations
- `categories`: Per-site categories (linked to global categories)
- `products`: Cached products from RSS feeds
- `pages`: Custom page content per site
- `users`: Admin authentication
- `site_settings`: Site-specific settings
- `feed_sync_logs`: RSS sync history

---

## 🎯 Usage Guide

### Creating a New Satellite Site

1. **Navigate to Dashboard** → Sites → "Create New Site"
2. **Fill in details**:
   - Site Name (e.g., "Lighting Solutions UK")
   - Domain (e.g., "lightingsolutions.co.uk")
   - Template Type (Next.js, HTML, React)
   - Anchor Text (default: "Also available from Lamp Genius")
   - Deployment Platform (Vercel, Netlify, etc.)
3. **Click "Create Site"**
   - Automatically creates default categories
   - Creates default pages
   - Ready for product sync

### Configuring RSS Feeds

1. **Navigate to Dashboard** → RSS Feeds
2. **For each category/subcategory**:
   - Click "Add Feed" or "Edit"
   - Enter the RSS feed URL
   - Click "Save"
3. **Feed URL applies to all sites** for that category

**Example Feed URLs:**
```
Indoor Lighting → Ceiling Lights:
https://www.lampgenius.co.uk/feed/ceiling-lights.xml

Outdoor Lighting → Outdoor Wall Lights:
https://www.lampgenius.co.uk/feed/outdoor-wall-lights.xml
```

### Syncing Products

1. **Navigate to Dashboard** → Sites
2. **Click "Sync"** next to any site
3. **System will**:
   - Fetch products from category-specific RSS feeds
   - Parse and import products
   - Update product cache
   - Log sync results

### Product Page Features

Each product page includes:
- **Full Product Details**: Title, description, price, images
- **Product Schema Markup**: Google-friendly structured data
- **Product Data Table**: Specifications, pricing, availability
- **"Also Available from Lamp Genius"**: Link box with custom anchor text
- **Add to Cart**: Redirects to main site product page

---

## 🌐 Deployment Platforms

Supported hosting platforms:
- **Vercel**: Recommended for Next.js sites
- **Netlify**: Great for static sites
- **Cloudflare Pages**: Fast global CDN
- **GitHub Pages**: Free static hosting
- **Cloudways**: Managed cloud hosting
- **Amazon AWS**: S3 + CloudFront
- **Oracle Cloud**: Free tier available
- **Custom Domain**: Self-hosted options

---

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this

# Database
DATABASE_PATH=./database/satellite-hub.db

# Lamp Genius Feed
LAMP_GENIUS_FEED_URL=https://www.lampgenius.co.uk/wp-content/uploads/woo-feed/google/xml/maingoogleshoppingfeed-3.xml
LAMP_GENIUS_SITE_URL=https://www.lampgenius.co.uk
```

### Changing Admin Password

```bash
node -e "console.log(require('bcryptjs').hashSync('YourNewPassword', 10))"
```

Copy the hash to `.env.local` → `ADMIN_PASSWORD_HASH`

---

## 📁 Project Structure

```
satellite-light-hub/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication
│   │   ├── sites/                # Site CRUD
│   │   └── feeds/                # RSS feed management
│   ├── dashboard/                # Admin Dashboard
│   │   ├── sites/                # Sites management
│   │   └── feeds/                # Feed configuration
│   └── login/                    # Login page
├── lib/
│   ├── database/                 # Database schema & queries
│   ├── rss-parser/               # RSS feed parser
│   ├── site-generators/          # Site template generators
│   ├── seo/                      # SEO utilities
│   └── auth/                     # Authentication utilities
├── components/                   # React components
├── templates/                    # Site templates
├── generated-sites/              # Generated site output
├── database/                     # SQLite database
└── scripts/                      # Utility scripts
```

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: NextAuth.js JWT sessions
- **SQL Injection Protection**: Prepared statements
- **CSRF Protection**: Built into Next.js
- **Input Validation**: Server-side validation

---

## 🐛 Troubleshooting

### Database Issues

**Reset database:**
```bash
rm database/satellite-hub.db
npm run init-db
```

### RSS Feed Not Syncing

1. Check feed URL is accessible
2. Verify feed format (Google Shopping XML)
3. Check feed sync logs in database
4. Enable debug logging in RSS parser

### Authentication Issues

1. Clear browser cookies
2. Verify password hash in database
3. Check NextAuth configuration
4. Restart development server

---

## ✅ Implementation Status

### Completed Features
1. ✅ **Admin Dashboard** - Full UI for site management
2. ✅ **Authentication System** - NextAuth with secure login
3. ✅ **Database Schema** - SQLite with global category architecture
4. ✅ **RSS Feed Management** - Category-specific feed configuration
5. ✅ **Product Sync** - RSS feed parsing and product import
6. ✅ **Site Generator** - Next.js template generator
7. ✅ **SEO Utilities** - Schema markup generators (Product, Category, Organization, Breadcrumb)
8. ✅ **Sitemap Generators** - XML and HTML sitemap creation
9. ✅ **Multi-Platform Deployment** - Config templates for Vercel, Netlify, Cloudflare, etc.

### Current Capabilities
- Create and manage up to 25 satellite sites
- Configure RSS feed URLs per category/subcategory
- Sync products from category-specific feeds
- Generate complete Next.js site structures
- SEO-optimized with schema markup
- Deploy to multiple hosting platforms

## 🚧 Roadmap

### Next Phase (Optional Enhancements)
- [ ] HTML static site generator
- [ ] React SPA generator
- [ ] Product page dynamic data loading
- [ ] Category page product grids
- [ ] GitHub automated deployment integration
- [ ] Bulk site creation wizard

### Future Enhancements
- [ ] Analytics dashboard
- [ ] A/B testing for anchor text
- [ ] Automated SEO reporting
- [ ] Multi-user support with roles
- [ ] Custom template editor
- [ ] Product availability tracking
- [ ] Automated deployment pipelines
- [ ] Real-time feed sync scheduling

---

## 📊 Key Concepts

### Satellite Site Strategy

The satellite site approach creates a network of topically-relevant sites that:
1. **Generate Referring Domains**: Each site links back to main Lamp Genius site
2. **Improve SEO**: Category-specific content with proper schema markup
3. **Expand Reach**: Different domains targeting similar keywords
4. **Drive Traffic**: "Also available from Lamp Genius" redirects users

### Feed Architecture

```
Main Site (Lamp Genius)
└── Generates Category-Specific RSS Feeds
    ├── Ceiling Lights Feed → All Satellite Sites (Ceiling Lights Category)
    ├── Pendant Lighting Feed → All Satellite Sites (Pendant Category)
    └── [12 category feeds total]

Satellite Sites (1-25)
├── Each has same category structure
├── Each syncs from same category feeds
└── Each provides unique referring domain
```

---

## 🤝 Contributing

This is a private project for Lamp Genius satellite site management.

---

## 📞 Support

For issues or questions:
- Check troubleshooting section
- Review database logs
- Inspect feed sync logs in `feed_sync_logs` table

---

## 📝 License

Proprietary - Lamp Genius

---

## ✨ Credits

Built with:
- Next.js
- TypeScript
- Tailwind CSS
- SQLite
- NextAuth.js

Developed for Lamp Genius multi-site SEO strategy.

---

**Made with ❤️ for Lamp Genius**
