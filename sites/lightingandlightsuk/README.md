# Lighting and Lights UK

**Premium ceiling lights satellite website**

## 🌟 Features

- ✅ **Ceiling Lights Focus** - Specialized in premium ceiling lighting
- ✅ **RSS Feed Integration** - Auto-sync with Lamp Genius product feed
- ✅ **Product Data Tables** - Clean product information (no duplicate content)
- ✅ **"Also available from Lamp Genius" Links** - Clear partner attribution
- ✅ **Full SEO** - Schema markup, meta tags, optimized structure
- ✅ **Responsive Design** - Mobile-friendly Tailwind CSS
- ✅ **Fast Performance** - Next.js 15 with optimized images
- ✅ **Standard Pages** - About, Contact, Terms, Privacy, Delivery, etc.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Deploy to Vercel

1. **Push to GitHub** (create new repo for this site)

2. **Import to Vercel**:
   - Go to vercel.com
   - Click "New Project"
   - Import your GitHub repo
   - Click "Deploy"

3. **Done!** Your site will be live at `lightingandlightsuk.vercel.app`

## 📋 Site Details

- **Name**: Lighting and Lights UK
- **Category**: Ceiling Lights
- **RSS Feed**: Lamp Genius main feed (filtered for ceiling lights)
- **Product Pages**: Data displayed in tables (no duplicate descriptions)
- **Anchor Text**: "Also available from Lamp Genius"

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: '#2563eb',    // Change main color
  secondary: '#1e40af',  // Change secondary color
},
```

### Change Site Name

Update in `app/layout.tsx`:
```typescript
<a href="/" className="text-2xl font-bold text-primary">
  Your New Name Here
</a>
```

### Change RSS Feed

Update in `lib/products.ts`:
```typescript
const feedUrl = 'your-feed-url-here'
```

## 📁 Structure

```
lightingandlightsuk/
├── app/
│   ├── page.tsx              # Home page
│   ├── ceiling-lights/       # Product listing
│   ├── products/[id]/        # Product detail pages
│   ├── about/                # About page
│   ├── contact/              # Contact page
│   └── ...                   # Other standard pages
├── lib/
│   └── products.ts           # RSS feed parser
└── components/               # Reusable components
```

## 🔄 Creating More Sites

To create another satellite site:

1. Copy this entire folder
2. Change the name (e.g., `premiumlightinguk`)
3. Update colors, branding, RSS feed
4. Deploy to Vercel
5. Done!

## 📊 SEO Features

- ✅ Product schema markup (Schema.org)
- ✅ Meta tags (title, description)
- ✅ OpenGraph tags
- ✅ Clean URL structure
- ✅ Fast loading times
- ✅ Mobile responsive

## 🔗 Links

- **Live Site**: https://lightingandlightsuk.vercel.app
- **Partner**: https://www.lampgenius.co.uk

## 📝 License

Private - Lamp Genius Satellite Network

---

**Built for Lamp Genius satellite site strategy** 🚀
