export default function PaymentMethodsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Payment Methods</h1>

      <div className="prose max-w-none space-y-6">
        <section>
          <p className="text-lg text-gray-600 mb-6">
            We accept all major payment methods for your convenience and security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accepted Payment Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">💳 Credit & Debit Cards</h3>
              <ul className="text-gray-600 space-y-1">
                <li>Visa</li>
                <li>Mastercard</li>
                <li>American Express</li>
                <li>Maestro</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">🔒 Secure Payment Options</h3>
              <ul className="text-gray-600 space-y-1">
                <li>PayPal</li>
                <li>Apple Pay</li>
                <li>Google Pay</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Security</h2>
          <p className="text-gray-600">
            All transactions are encrypted and processed through secure payment gateways.
            We never store your complete payment details. Your financial information is protected
            with industry-standard security measures.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing</h2>
          <p className="text-gray-600">
            All prices are displayed in British Pounds (£) and include VAT where applicable.
            What you see is what you pay - no hidden fees.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Issues?</h2>
          <p className="text-gray-600">
            If you experience any payment problems, please contact our customer service team
            through our contact page for assistance.
          </p>
        </section>
      </div>
    </div>
  )
}
