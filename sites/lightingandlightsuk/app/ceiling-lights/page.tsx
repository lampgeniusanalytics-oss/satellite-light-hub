import { fetchCeilingLights } from '@/lib/products'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 3600 // Revalidate every hour

export default async function CeilingLightsPage() {
  const products = await fetchCeilingLights()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Ceiling Lights</h1>
        <p className="text-lg text-gray-600">
          Browse our extensive collection of premium ceiling lights. {products.length} products available.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="aspect-square relative bg-gray-100">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition">
                  {product.title}
                </h3>
                <p className="text-2xl font-bold text-primary">{product.price}</p>
                {product.brand && (
                  <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
