export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Premium Ceiling Lights
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Discover our extensive range of high-quality ceiling lights. From modern LED designs to classic styles.
        </p>
        <a
          href="/ceiling-lights"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-secondary transition"
        >
          Browse Ceiling Lights
        </a>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Products</h3>
          <p className="text-gray-600">Premium ceiling lights from trusted brands</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">🚚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
          <p className="text-gray-600">Quick dispatch across the UK</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">💷</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Great Prices</h3>
          <p className="text-gray-600">Competitive pricing on all products</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Find Your Perfect Ceiling Light</h2>
        <p className="text-xl mb-6">Browse our full collection of premium ceiling lights</p>
        <a
          href="/ceiling-lights"
          className="inline-block bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
        >
          View All Products
        </a>
      </div>
    </div>
  )
}
