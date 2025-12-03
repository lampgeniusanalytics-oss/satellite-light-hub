/**
 * Next.js Site Generator
 * Generates a complete Next.js site structure for a satellite site
 */

import fs from 'fs';
import path from 'path';
import type { Site, Category, Page } from '../database/queries';

interface GeneratorOptions {
  site: Site;
  categories: Category[];
  pages: Page[];
  outputDir: string;
}

/**
 * Generate a complete Next.js satellite site
 */
export async function generateNextJSSite(options: GeneratorOptions): Promise<void> {
  const { site, categories, pages, outputDir } = options;

  const siteDir = path.join(outputDir, site.domain);

  // Create directory structure
  createDirectoryStructure(siteDir);

  // Generate package.json
  generatePackageJson(siteDir, site);

  // Generate Next.js config
  generateNextConfig(siteDir);

  // Generate TypeScript config
  generateTsConfig(siteDir);

  // Generate Tailwind config
  generateTailwindConfig(siteDir);

  // Generate app directory files
  generateAppLayout(siteDir, site);
  generateHomePage(siteDir, site, pages.find((p) => p.page_type === 'home'));
  generateGlobalStyles(siteDir);

  // Generate category pages
  generateCategoryPages(siteDir, categories);

  // Generate standard pages
  generateStandardPages(siteDir, pages, site);

  // Generate product page template
  generateProductPage(siteDir, site);

  // Generate sitemap routes
  generateSitemapRoutes(siteDir, site);

  // Generate README
  generateSiteReadme(siteDir, site);

  console.log(`✅ Next.js site generated: ${siteDir}`);
}

function createDirectoryStructure(siteDir: string): void {
  const dirs = [
    '',
    'app',
    'app/(pages)',
    'app/(pages)/about',
    'app/(pages)/contact',
    'app/(pages)/terms',
    'app/(pages)/privacy',
    'app/(pages)/payment-methods',
    'app/(pages)/delivery',
    'app/(pages)/trade-customers',
    'app/categories',
    'app/categories/[slug]',
    'app/products',
    'app/products/[id]',
    'app/sitemap',
    'app/api',
    'app/api/products',
    'components',
    'lib',
    'public',
  ];

  dirs.forEach((dir) => {
    const fullPath = path.join(siteDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
}

function generatePackageJson(siteDir: string, site: Site): void {
  const packageJson = {
    name: site.domain.replace(/\./g, '-'),
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      next: '^15.0.0',
    },
    devDependencies: {
      '@types/node': '^20',
      '@types/react': '^18',
      '@types/react-dom': '^18',
      typescript: '^5',
      tailwindcss: '^3.4.0',
      postcss: '^8',
      autoprefixer: '^10.4.0',
    },
  };

  fs.writeFileSync(
    path.join(siteDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

function generateNextConfig(siteDir: string): void {
  const content = `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
`;

  fs.writeFileSync(path.join(siteDir, 'next.config.js'), content);
}

function generateTsConfig(siteDir: string): void {
  const tsConfig = {
    compilerOptions: {
      target: 'ES2017',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: {
        '@/*': ['./*'],
      },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  };

  fs.writeFileSync(
    path.join(siteDir, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );
}

function generateTailwindConfig(siteDir: string): void {
  const content = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

  fs.writeFileSync(path.join(siteDir, 'tailwind.config.js'), content);

  // PostCSS config
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

  fs.writeFileSync(path.join(siteDir, 'postcss.config.js'), postcssConfig);
}

function generateAppLayout(siteDir: string, site: Site): void {
  const content = `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '${site.name} | Premium Lighting Solutions',
  description: 'Browse our extensive range of indoor and outdoor lighting. Quality products with fast UK delivery.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">${site.name}</h1>
              <div className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
                <a href="/categories/indoor-lighting" className="text-gray-700 hover:text-blue-600">Indoor Lighting</a>
                <a href="/categories/outdoor-lighting" className="text-gray-700 hover:text-blue-600">Outdoor Lighting</a>
                <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
                <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>
              </div>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">${site.name}</h3>
                <p className="text-gray-400">Premium lighting solutions for your home and business.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
                  <li><a href="/delivery" className="text-gray-400 hover:text-white">Delivery</a></li>
                  <li><a href="/terms" className="text-gray-400 hover:text-white">Terms</a></li>
                  <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Categories</h4>
                <ul className="space-y-2">
                  <li><a href="/categories/ceiling-lights" className="text-gray-400 hover:text-white">Ceiling Lights</a></li>
                  <li><a href="/categories/pendant-lighting" className="text-gray-400 hover:text-white">Pendant Lighting</a></li>
                  <li><a href="/categories/chandeliers" className="text-gray-400 hover:text-white">Chandeliers</a></li>
                  <li><a href="/sitemap" className="text-gray-400 hover:text-white">Sitemap</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; ${new Date().getFullYear()} ${site.name}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
`;

  fs.writeFileSync(path.join(siteDir, 'app', 'layout.tsx'), content);
}

function generateGlobalStyles(siteDir: string): void {
  const content = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground: #171717;
  --background: #ffffff;
}

body {
  color: var(--foreground);
  background: var(--background);
}
`;

  fs.writeFileSync(path.join(siteDir, 'app', 'globals.css'), content);
}

function generateHomePage(siteDir: string, site: Site, homePage?: Page): void {
  const content = `export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ${homePage?.h1 || 'Premium Lighting Solutions'}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          ${homePage?.content || 'Discover our extensive range of indoor and outdoor lighting solutions.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <a href="/categories/indoor-lighting" className="group">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div className="h-64 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-white">Indoor Lighting</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Browse ceiling lights, pendant lights, chandeliers, and more.</p>
            </div>
          </div>
        </a>

        <a href="/categories/outdoor-lighting" className="group">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div className="h-64 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-white">Outdoor Lighting</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Explore outdoor wall lights, pendant lights, and ceiling lights.</p>
            </div>
          </div>
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="/categories/ceiling-lights" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
          <h3 className="font-semibold text-gray-900">Ceiling Lights</h3>
        </a>
        <a href="/categories/pendant-lighting" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
          <h3 className="font-semibold text-gray-900">Pendant Lighting</h3>
        </a>
        <a href="/categories/chandeliers" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
          <h3 className="font-semibold text-gray-900">Chandeliers</h3>
        </a>
        <a href="/categories/wall-lights" className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
          <h3 className="font-semibold text-gray-900">Wall Lights</h3>
        </a>
      </div>
    </div>
  )
}
`;

  fs.writeFileSync(path.join(siteDir, 'app', 'page.tsx'), content);
}

function generateCategoryPages(siteDir: string, categories: Category[]): void {
  // Category page template
  const categoryPageContent = `import { notFound } from 'next/navigation'

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // In a real implementation, fetch category data and products from API
  const { slug } = params

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Category: {slug}</h1>
      <p className="text-gray-600 mb-8">Products will be loaded here from the RSS feed.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product grid will be populated dynamically */}
      </div>
    </div>
  )
}
`;

  fs.writeFileSync(
    path.join(siteDir, 'app', 'categories', '[slug]', 'page.tsx'),
    categoryPageContent
  );
}

function generateStandardPages(siteDir: string, pages: Page[], site: Site): void {
  const pageTypes = ['about', 'contact', 'terms', 'privacy', 'payment-methods', 'delivery', 'trade-customers'];

  pageTypes.forEach((pageType) => {
    const page = pages.find((p) => p.page_type === pageType);

    const content = `export default function ${capitalize(pageType.replace(/-/g, ''))}Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        ${page?.h1 || capitalize(pageType.replace(/-/g, ' '))}
      </h1>
      <div className="prose max-w-none">
        <p>${page?.content || 'Content for this page.'}</p>
      </div>
    </div>
  )
}
`;

    fs.writeFileSync(
      path.join(siteDir, 'app', '(pages)', pageType, 'page.tsx'),
      content
    );
  });
}

function generateProductPage(siteDir: string, site: Site): void {
  const content = `import { notFound } from 'next/navigation'

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params

  // In production, fetch product data from API

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
          <p className="text-gray-500">Product Image</p>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Title</h1>
          <p className="text-2xl text-blue-600 font-semibold mb-6">£99.99</p>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>${site.anchor_text || 'Also available from Lamp Genius'}</strong>
            </p>
            <a
              href="https://www.lampgenius.co.uk"
              className="text-blue-600 hover:text-blue-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Lamp Genius →
            </a>
          </div>

          <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition mb-4">
            Add to Cart (Redirects to Lamp Genius)
          </button>

          <div className="prose max-w-none">
            <h2>Product Description</h2>
            <p>Product description will be loaded here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
`;

  fs.writeFileSync(
    path.join(siteDir, 'app', 'products', '[id]', 'page.tsx'),
    content
  );
}

function generateSitemapRoutes(siteDir: string, site: Site): void {
  const content = `export default function SitemapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Sitemap</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Main Pages</h2>
          <ul className="space-y-2">
            <li><a href="/" className="text-blue-600 hover:underline">Home</a></li>
            <li><a href="/about" className="text-blue-600 hover:underline">About Us</a></li>
            <li><a href="/contact" className="text-blue-600 hover:underline">Contact</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Indoor Lighting</h2>
          <ul className="space-y-2">
            <li><a href="/categories/ceiling-lights" className="text-blue-600 hover:underline">Ceiling Lights</a></li>
            <li><a href="/categories/pendant-lighting" className="text-blue-600 hover:underline">Pendant Lighting</a></li>
            <li><a href="/categories/chandeliers" className="text-blue-600 hover:underline">Chandeliers</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Outdoor Lighting</h2>
          <ul className="space-y-2">
            <li><a href="/categories/outdoor-wall-lights" className="text-blue-600 hover:underline">Outdoor Wall Lights</a></li>
            <li><a href="/categories/outdoor-pendant-lights" className="text-blue-600 hover:underline">Outdoor Pendant Lights</a></li>
            <li><a href="/categories/outdoor-ceiling-lights" className="text-blue-600 hover:underline">Outdoor Ceiling Lights</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
`;

  fs.writeFileSync(path.join(siteDir, 'app', 'sitemap', 'page.tsx'), content);
}

function generateSiteReadme(siteDir: string, site: Site): void {
  const content = `# ${site.name}

Satellite lighting website powered by Satellite Light Hub.

## Site Information

- **Domain**: ${site.domain}
- **Template**: Next.js
- **Status**: ${site.status}

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
npm run start
\`\`\`

## Deployment

Deploy to ${site.deployment_platform || 'your preferred platform'}.

---

Generated by Satellite Light Hub
`;

  fs.writeFileSync(path.join(siteDir, 'README.md'), content);
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
