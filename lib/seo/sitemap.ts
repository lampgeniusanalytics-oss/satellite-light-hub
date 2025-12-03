/**
 * Sitemap Generators
 * Creates XML and HTML sitemaps for satellite sites
 */

interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface SitemapSection {
  title: string;
  links: Array<{
    url: string;
    title: string;
  }>;
}

/**
 * Generate XML Sitemap
 */
export function generateXMLSitemap(urls: SitemapUrl[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((item) => `  <url>
    <loc>${escapeXml(item.url)}</loc>${item.lastmod ? `
    <lastmod>${item.lastmod}</lastmod>` : ''}${item.changefreq ? `
    <changefreq>${item.changefreq}</changefreq>` : ''}${item.priority !== undefined ? `
    <priority>${item.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

/**
 * Generate HTML Sitemap
 */
export function generateHTMLSitemap(
  siteName: string,
  sections: SitemapSection[]
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sitemap - ${escapeHtml(siteName)}</title>
  <meta name="description" content="Complete sitemap for ${escapeHtml(siteName)}. Browse all pages and products.">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: #f5f5f5;
    }
    header {
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #1a1a1a;
      margin-bottom: 0.5rem;
    }
    .intro {
      color: #666;
      font-size: 1.1rem;
    }
    .section {
      background: #fff;
      padding: 2rem;
      margin-bottom: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .section h2 {
      color: #2563eb;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }
    .links {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .links a {
      color: #2563eb;
      text-decoration: none;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      transition: all 0.2s;
      display: block;
      background: #f9fafb;
    }
    .links a:hover {
      background: #2563eb;
      color: #fff;
    }
    footer {
      text-align: center;
      color: #666;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }
    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }
      .links {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>Sitemap - ${escapeHtml(siteName)}</h1>
    <p class="intro">Browse all pages and products on our website</p>
  </header>

  <main>
${sections.map((section) => `    <section class="section">
      <h2>${escapeHtml(section.title)}</h2>
      <div class="links">
${section.links.map((link) => `        <a href="${escapeHtml(link.url)}">${escapeHtml(link.title)}</a>`).join('\n')}
      </div>
    </section>`).join('\n\n')}
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} ${escapeHtml(siteName)}. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

/**
 * Generate sitemap URLs for a satellite site
 */
export function generateSiteUrls(
  siteUrl: string,
  categories: Array<{ slug: string; name: string }>,
  products: Array<{ id: string; title: string; lastmod?: string }>,
  pages: string[] = []
): SitemapUrl[] {
  const urls: SitemapUrl[] = [];

  // Homepage
  urls.push({
    url: siteUrl,
    changefreq: 'daily',
    priority: 1.0,
  });

  // Standard pages
  const standardPages = [
    'about',
    'contact',
    'terms',
    'privacy',
    'payment-methods',
    'delivery',
    'trade-customers',
    ...pages,
  ];

  standardPages.forEach((page) => {
    urls.push({
      url: `${siteUrl}/${page}`,
      changefreq: 'monthly',
      priority: 0.6,
    });
  });

  // Category pages
  categories.forEach((category) => {
    urls.push({
      url: `${siteUrl}/categories/${category.slug}`,
      changefreq: 'weekly',
      priority: 0.8,
    });
  });

  // Product pages
  products.forEach((product) => {
    urls.push({
      url: `${siteUrl}/products/${product.id}`,
      lastmod: product.lastmod || new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.7,
    });
  });

  // Sitemap page itself
  urls.push({
    url: `${siteUrl}/sitemap`,
    changefreq: 'monthly',
    priority: 0.5,
  });

  return urls;
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
