export default function TradeCustomersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Trade Customers</h1>

      <div className="prose max-w-none space-y-6">
        <section>
          <p className="text-lg text-gray-600 mb-6">
            Are you a trade customer? Get access to exclusive pricing and benefits designed for professionals.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trade Benefits</h2>
          <div className="bg-primary/10 p-8 rounded-lg mb-6">
            <ul className="space-y-3 text-gray-800">
              <li className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <span><strong>Exclusive Trade Pricing</strong> - Special discounted rates for trade professionals</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <span><strong>Volume Discounts</strong> - Better prices for larger orders</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <span><strong>Dedicated Account Manager</strong> - Personal support for your projects</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <span><strong>Priority Service</strong> - Fast dispatch for urgent projects</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <span><strong>Credit Accounts</strong> - Available for approved trade customers</span>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Qualifies?</h2>
          <p className="text-gray-600 mb-4">
            Trade accounts are available to:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Electricians and electrical contractors</li>
            <li>Interior designers and architects</li>
            <li>Building contractors and developers</li>
            <li>Retail stores and showrooms</li>
            <li>Property management companies</li>
            <li>Facilities management teams</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Apply for a Trade Account</h2>
          <p className="text-gray-600 mb-6">
            To apply for a trade account and access exclusive pricing, please contact our trade team
            via our contact page with your company details and requirements.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-secondary transition"
          >
            Contact Trade Team →
          </a>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
          <p className="text-gray-600">
            For trade enquiries and bespoke pricing, get in touch with our team who will be happy to discuss your requirements.
          </p>
        </section>
      </div>
    </div>
  )
}
