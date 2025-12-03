export default function DeliveryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Delivery Information</h1>

      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">UK Delivery</h2>
          <p className="text-gray-600 mb-4">
            We offer fast and reliable delivery across the UK on all our ceiling lights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Times</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <ul className="space-y-3 text-gray-600">
              <li><strong>Standard Delivery:</strong> 3-5 working days</li>
              <li><strong>Express Delivery:</strong> 1-2 working days</li>
              <li><strong>Next Day Delivery:</strong> Available on selected items</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Costs</h2>
          <p className="text-gray-600">
            Delivery costs vary depending on the size and weight of your order. Full details are provided at checkout.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tracking</h2>
          <p className="text-gray-600">
            You'll receive tracking information once your order is dispatched, allowing you to monitor your delivery every step of the way.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Coverage</h2>
          <p className="text-gray-600">
            We deliver to all UK mainland addresses. For deliveries to Scottish Highlands, Islands, and Northern Ireland,
            please contact us for a delivery quote.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
          <p className="text-gray-600">
            For delivery queries, please contact our customer service team via our contact page.
          </p>
        </section>
      </div>
    </div>
  )
}
