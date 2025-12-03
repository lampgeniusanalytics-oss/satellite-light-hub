/**
 * SEO Schema Markup Generators
 * Generates JSON-LD structured data for products, categories, and organization
 */

import type { Product } from '../rss-parser';

interface SchemaOrgProduct {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description?: string;
  image?: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  brand?: {
    '@type': 'Brand';
    name: string;
  };
  gtin?: string;
  sku?: string;
}

interface SchemaOrgItemList {
  '@context': 'https://schema.org';
  '@type': 'ItemList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    item: {
      '@type': 'Product';
      name: string;
      url: string;
      image?: string;
    };
  }>;
}

interface SchemaOrgOrganization {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

interface SchemaOrgBreadcrumbList {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * Generate Product Schema
 */
export function generateProductSchema(
  product: Product,
  siteUrl: string
): SchemaOrgProduct {
  // Extract numeric price
  const priceMatch = product.price.match(/[\d.]+/);
  const numericPrice = priceMatch ? priceMatch[0] : '0';

  // Map availability
  const availabilityMap: { [key: string]: string } = {
    'in stock': 'https://schema.org/InStock',
    'in_stock': 'https://schema.org/InStock',
    'out of stock': 'https://schema.org/OutOfStock',
    'out_of_stock': 'https://schema.org/OutOfStock',
    'preorder': 'https://schema.org/PreOrder',
    'pre-order': 'https://schema.org/PreOrder',
  };

  const availability = product.availability
    ? availabilityMap[product.availability.toLowerCase()] || 'https://schema.org/InStock'
    : 'https://schema.org/InStock';

  const schema: SchemaOrgProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || undefined,
    image: product.imageUrl || undefined,
    offers: {
      '@type': 'Offer',
      price: numericPrice,
      priceCurrency: 'GBP',
      availability: availability,
      url: `${siteUrl}/products/${product.id}`,
    },
  };

  if (product.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: product.brand,
    };
  }

  if (product.gtin) {
    schema.gtin = product.gtin;
  }

  if (product.id) {
    schema.sku = product.id;
  }

  return schema;
}

/**
 * Generate Category/Collection Item List Schema
 */
export function generateCategorySchema(
  categoryName: string,
  products: Product[],
  siteUrl: string
): SchemaOrgItemList {
  const schema: SchemaOrgItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        url: `${siteUrl}/products/${product.id}`,
        image: product.imageUrl || undefined,
      },
    })),
  };

  return schema;
}

/**
 * Generate Organization Schema
 */
export function generateOrganizationSchema(
  siteName: string,
  siteUrl: string,
  logoUrl?: string,
  socialLinks?: string[]
): SchemaOrgOrganization {
  const schema: SchemaOrgOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
  };

  if (logoUrl) {
    schema.logo = logoUrl;
  }

  if (socialLinks && socialLinks.length > 0) {
    schema.sameAs = socialLinks;
  }

  return schema;
}

/**
 * Generate Breadcrumb Schema
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url?: string }>
): SchemaOrgBreadcrumbList {
  const schema: SchemaOrgBreadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return schema;
}

/**
 * Convert schema object to JSON-LD script tag
 */
export function schemaToScriptTag(schema: any): string {
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

/**
 * Generate meta tags for a page
 */
export function generateMetaTags(data: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
}): string {
  const { title, description, url, image, type = 'website' } = data;

  return `
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="${type}" />
    ${image ? `<meta property="og:image" content="${image}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${image ? `<meta name="twitter:image" content="${image}" />` : ''}
  `.trim();
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
