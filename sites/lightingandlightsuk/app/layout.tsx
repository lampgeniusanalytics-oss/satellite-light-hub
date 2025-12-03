import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lighting and Lights UK | Premium Ceiling Lights',
  description: 'Discover our premium collection of ceiling lights. Quality lighting solutions with fast UK delivery.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white shadow-sm border-b border-gray-200">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="text-2xl font-bold text-primary">
                Lighting and Lights UK
              </a>
              <div className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-700 hover:text-primary transition">Home</a>
                <a href="/ceiling-lights" className="text-gray-700 hover:text-primary transition">Ceiling Lights</a>
                <a href="/about" className="text-gray-700 hover:text-primary transition">About</a>
                <a href="/contact" className="text-gray-700 hover:text-primary transition">Contact</a>
              </div>
            </div>
          </nav>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Lighting and Lights UK</h3>
                <p className="text-gray-400">Premium ceiling lights for your home and business.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
                  <li><a href="/delivery" className="text-gray-400 hover:text-white">Delivery</a></li>
                  <li><a href="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</a></li>
                  <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Categories</h4>
                <ul className="space-y-2">
                  <li><a href="/ceiling-lights" className="text-gray-400 hover:text-white">Ceiling Lights</a></li>
                  <li><a href="/ceiling-lights" className="text-gray-400 hover:text-white">LED Ceiling Lights</a></li>
                  <li><a href="/ceiling-lights" className="text-gray-400 hover:text-white">Modern Ceiling Lights</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Lighting and Lights UK. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
