import { getProductById, fetchCeilingLights } from '@/lib/products'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export const revalidate = 3600

export async function generateStaticParams() {
  const products = await fetchCeilingLights()
  return products.slice(0, 100).map((product) => ({
    id: product.id,
  }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>

          <div className="mb-6">
            <p className="text-4xl font-bold text-primary">{product.price}</p>
          </div>

          {/* Lamp Genius Link Box */}
          <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <p className="text-lg font-semibold text-gray-900 mb-3">
              Also available from Lamp Genius
            </p>
            <a
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition"
            >
              View on Lamp Genius →
            </a>
            <p className="text-sm text-gray-600 mt-3">
              Purchase directly from our partner for the best service and support.
            </p>
          </div>

          {/* Add to Cart (redirects to Lamp Genius) */}
          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gray-900 text-white text-center px-6 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition mb-8"
          >
            Buy Now on Lamp Genius
          </a>

          {/* Product Information Table */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Information</h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  {product.brand && (
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/3">Brand</td>
                      <td className="px-4 py-3 text-gray-900">{product.brand}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/3">Price</td>
                    <td className="px-4 py-3 text-gray-900">{product.price}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/3">Category</td>
                    <td className="px-4 py-3 text-gray-900">{product.category}</td>
                  </tr>
                  {product.availability && (
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/3">Availability</td>
                      <td className="px-4 py-3 text-gray-900">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          product.availability.toLowerCase().includes('in stock')
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.availability}
                        </span>
                      </td>
                    </tr>
                  )}
                  {product.condition && (
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/3">Condition</td>
                      <td className="px-4 py-3 text-gray-900">{product.condition}</td>
                    </tr>
                  )}
                  {product.gtin && (
                    <tr>
                      <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/3">GTIN</td>
                      <td className="px-4 py-3 text-gray-900 font-mono text-sm">{product.gtin}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-1/3">Product ID</td>
                    <td className="px-4 py-3 text-gray-900 font-mono text-sm">{product.id}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Back Link */}
          <a
            href="/ceiling-lights"
            className="inline-block text-primary hover:text-secondary font-semibold"
          >
            ← Back to Ceiling Lights
          </a>
        </div>
      </div>

      {/* Product Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            image: product.imageUrl,
            offers: {
              '@type': 'Offer',
              price: product.price.replace(/[^\d.]/g, ''),
              priceCurrency: 'GBP',
              availability: product.availability?.toLowerCase().includes('in stock')
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              url: `https://lightingandlightsuk.vercel.app/products/${product.id}`,
            },
            brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
            gtin: product.gtin,
            sku: product.id,
          }),
        }}
      />
    </div>
  )
}
