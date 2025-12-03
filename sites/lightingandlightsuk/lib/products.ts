/**
 * RSS Feed Parser for Lamp Genius Products
 * Filters for ceiling lights category
 */

export interface Product {
  id: string
  title: string
  price: string
  imageUrl: string
  category: string
  productUrl: string
  gtin?: string
  brand?: string
  availability?: string
  condition?: string
}

function extractXMLValue(xml: string, tagName: string): string | null {
  const patterns = [
    new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([^\\]]+)\\]\\]></${tagName}>`, 'i'),
    new RegExp(`<${tagName}[^>]*>([^<]+)</${tagName}>`, 'i'),
  ]

  for (const pattern of patterns) {
    const match = xml.match(pattern)
    if (match) return match[1].trim()
  }
  return null
}

function extractValue(xml: string, ...tagNames: string[]): string {
  for (const tagName of tagNames) {
    const value = extractXMLValue(xml, tagName)
    if (value) return value
  }
  return ''
}

function formatPrice(price: string): string {
  if (!price) return '£0.00'
  const numericPrice = price.replace(/[^\d.]/g, '')
  const priceNum = parseFloat(numericPrice)
  if (isNaN(priceNum)) return '£0.00'
  return `£${priceNum.toFixed(2)}`
}

function parseProductItem(itemXML: string): Product | null {
  try {
    const id = extractValue(itemXML, 'g:id', 'id')
    const title = extractValue(itemXML, 'g:title', 'title')
    const price = extractValue(itemXML, 'g:price', 'price')
    const imageUrl = extractValue(itemXML, 'g:image_link', 'image_link', 'g:image', 'image')
    const productUrl = extractValue(itemXML, 'g:link', 'link')
    const category = extractValue(itemXML, 'g:product_type', 'product_type', 'g:google_product_category', 'category')
    const gtin = extractValue(itemXML, 'g:gtin', 'gtin')
    const brand = extractValue(itemXML, 'g:brand', 'brand')
    const availability = extractValue(itemXML, 'g:availability', 'availability')
    const condition = extractValue(itemXML, 'g:condition', 'condition')

    if (!id || !title || !productUrl) {
      return null
    }

    return {
      id,
      title,
      price: formatPrice(price),
      imageUrl: imageUrl || '',
      category: category || 'Uncategorized',
      productUrl,
      gtin: gtin || undefined,
      brand: brand || undefined,
      availability: availability || undefined,
      condition: condition || undefined,
    }
  } catch (error) {
    console.error('Error parsing product item:', error)
    return null
  }
}

export async function fetchCeilingLights(): Promise<Product[]> {
  try {
    const feedUrl = 'https://www.lampgenius.co.uk/wp-content/uploads/woo-feed/google/xml/maingoogleshoppingfeed-3.xml'

    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LightingAndLightsUK/1.0)',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status}`)
    }

    const xmlText = await response.text()

    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi
    const items: string[] = []
    let match

    while ((match = itemRegex.exec(xmlText)) !== null) {
      items.push(match[1])
    }

    const products: Product[] = []
    for (const itemXML of items) {
      const product = parseProductItem(itemXML)
      if (product) {
        // Filter for ceiling lights
        const categoryLower = product.category.toLowerCase()
        if (categoryLower.includes('ceiling') || categoryLower.includes('plafonier')) {
          products.push(product)
        }
      }
    }

    return products
  } catch (error) {
    console.error('Error fetching ceiling lights:', error)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await fetchCeilingLights()
  return products.find(p => p.id === id) || null
}
