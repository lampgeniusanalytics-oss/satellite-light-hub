/**
 * Server-side RSS/XML Feed Parser
 * Uses regex-based parsing to avoid DOMParser issues on server
 * Handles Google Shopping feed format with namespaced tags
 */

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  productUrl: string;
  gtin?: string;
  brand?: string;
  availability?: string;
  condition?: string;
}

/**
 * Extract value from XML tag, handling CDATA sections and namespaces
 */
function extractXMLValue(xml: string, tagName: string): string | null {
  const patterns = [
    // Pattern 1: CDATA wrapped content
    new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([^\\]]+)\\]\\]></${tagName}>`, 'i'),
    // Pattern 2: Regular content
    new RegExp(`<${tagName}[^>]*>([^<]+)</${tagName}>`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = xml.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
}

/**
 * Extract value trying multiple tag name variations (with and without namespace)
 */
function extractValue(xml: string, ...tagNames: string[]): string {
  for (const tagName of tagNames) {
    const value = extractXMLValue(xml, tagName);
    if (value) return value;
  }
  return '';
}

/**
 * Format price to £XX.XX format
 */
function formatPrice(price: string): string {
  if (!price) return '£0.00';

  // Remove currency symbols and extract numeric value
  const numericPrice = price.replace(/[^\d.]/g, '');
  const priceNum = parseFloat(numericPrice);

  if (isNaN(priceNum)) return '£0.00';

  return `£${priceNum.toFixed(2)}`;
}

/**
 * Normalize category for flexible matching
 */
export function normalizeCategory(cat: string): string {
  return cat
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, '-')        // Spaces to hyphens
    .trim();
}

/**
 * Parse individual product item from XML
 */
function parseProductItem(itemXML: string): Product | null {
  try {
    // Extract all fields with namespace variations
    const id = extractValue(itemXML, 'g:id', 'id');
    const title = extractValue(itemXML, 'g:title', 'title');
    const description = extractValue(itemXML, 'g:description', 'description');
    const price = extractValue(itemXML, 'g:price', 'price');
    const imageUrl = extractValue(itemXML, 'g:image_link', 'image_link', 'g:image', 'image');
    const productUrl = extractValue(itemXML, 'g:link', 'link');
    const category = extractValue(itemXML, 'g:product_type', 'product_type', 'g:google_product_category', 'category');
    const gtin = extractValue(itemXML, 'g:gtin', 'gtin');
    const brand = extractValue(itemXML, 'g:brand', 'brand');
    const availability = extractValue(itemXML, 'g:availability', 'availability');
    const condition = extractValue(itemXML, 'g:condition', 'condition');

    // Validate required fields
    if (!id || !title || !productUrl) {
      return null;
    }

    return {
      id,
      title,
      description: description || '',
      price: formatPrice(price),
      imageUrl: imageUrl || '',
      category: category || 'Uncategorized',
      productUrl,
      gtin: gtin || undefined,
      brand: brand || undefined,
      availability: availability || undefined,
      condition: condition || undefined,
    };
  } catch (error) {
    console.error('Error parsing product item:', error);
    return null;
  }
}

/**
 * Parse entire RSS/XML feed
 */
export async function parseRSSFeed(feedUrl: string): Promise<Product[]> {
  try {
    console.log('📡 Fetching RSS feed:', feedUrl);

    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SatelliteLightHub/1.0)',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();

    console.log('📄 Feed fetched, parsing products...');

    // Extract all <item> or <entry> elements
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/gi;

    let items: string[] = [];
    let match;

    // Try <item> tags first (RSS)
    while ((match = itemRegex.exec(xmlText)) !== null) {
      items.push(match[1]);
    }

    // If no items found, try <entry> tags (Atom)
    if (items.length === 0) {
      while ((match = entryRegex.exec(xmlText)) !== null) {
        items.push(match[1]);
      }
    }

    console.log(`📦 Found ${items.length} items in feed`);

    // Parse each item
    const products: Product[] = [];
    for (const itemXML of items) {
      const product = parseProductItem(itemXML);
      if (product) {
        products.push(product);
      }
    }

    console.log(`✅ Successfully parsed ${products.length} products`);

    return products;
  } catch (error) {
    console.error('❌ Error parsing RSS feed:', error);
    throw error;
  }
}

/**
 * Filter products by category (flexible matching)
 */
export function filterByCategory(products: Product[], categorySlug: string): Product[] {
  if (!categorySlug) return products;

  const normalizedSearchCat = normalizeCategory(categorySlug);

  return products.filter((product) => {
    const normalizedProductCat = normalizeCategory(product.category);
    return normalizedProductCat.includes(normalizedSearchCat);
  });
}

/**
 * Get fallback products (for testing/development)
 */
export function getFallbackProducts(): Product[] {
  return [
    {
      id: 'fallback-1',
      title: 'Modern LED Ceiling Light',
      description: 'Contemporary LED ceiling light with adjustable brightness',
      price: '£89.99',
      imageUrl: '/images/placeholder-light.jpg',
      category: 'Ceiling Lights',
      productUrl: 'https://www.lampgenius.co.uk/product/led-ceiling-light',
      brand: 'Lamp Genius',
      availability: 'in stock',
      condition: 'new',
    },
    {
      id: 'fallback-2',
      title: 'Crystal Chandelier',
      description: 'Elegant crystal chandelier perfect for dining rooms',
      price: '£299.99',
      imageUrl: '/images/placeholder-chandelier.jpg',
      category: 'Chandeliers',
      productUrl: 'https://www.lampgenius.co.uk/product/crystal-chandelier',
      brand: 'Lamp Genius',
      availability: 'in stock',
      condition: 'new',
    },
    {
      id: 'fallback-3',
      title: 'Outdoor Wall Light',
      description: 'Weather-resistant outdoor wall light with motion sensor',
      price: '£65.99',
      imageUrl: '/images/placeholder-outdoor.jpg',
      category: 'Outdoor Wall Lights',
      productUrl: 'https://www.lampgenius.co.uk/product/outdoor-wall-light',
      brand: 'Lamp Genius',
      availability: 'in stock',
      condition: 'new',
    },
  ];
}
