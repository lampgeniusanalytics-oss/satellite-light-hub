export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions about our ceiling lights? We're here to help!
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info@lightingandlightsuk.co.uk</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Service Hours</h3>
              <p className="text-gray-600">Monday - Friday: 9am - 5pm</p>
              <p className="text-gray-600">Saturday: 10am - 4pm</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our team is ready to assist you with product selection, technical questions, and order inquiries.
          </p>
          <div className="space-y-3">
            <a
              href="/about"
              className="block text-primary hover:text-secondary font-semibold"
            >
              About Us →
            </a>
            <a
              href="/delivery"
              className="block text-primary hover:text-secondary font-semibold"
            >
              Delivery Information →
            </a>
            <a
              href="/terms"
              className="block text-primary hover:text-secondary font-semibold"
            >
              Terms & Conditions →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
