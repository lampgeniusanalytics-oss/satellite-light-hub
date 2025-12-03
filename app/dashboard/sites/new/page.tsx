'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewSitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    template_type: 'nextjs',
    rss_feed_url: 'https://www.lampgenius.co.uk/wp-content/uploads/woo-feed/google/xml/maingoogleshoppingfeed-3.xml',
    anchor_text: 'Also available from Lamp Genius',
    deployment_platform: 'vercel',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        alert('Site created successfully!');
        router.push(`/dashboard/sites/${data.siteId}`);
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating site:', error);
      alert('Failed to create site');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Create New Site</h2>
        <p className="text-gray-600 mt-2">Set up a new satellite lighting website</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="e.g., Lighting Solutions UK"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domain *
          </label>
          <input
            type="text"
            value={formData.domain}
            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="e.g., lightingsolutions.co.uk"
            required
          />
          <p className="text-sm text-gray-500 mt-1">Enter the domain without http:// or https://</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Type *
          </label>
          <select
            value={formData.template_type}
            onChange={(e) => setFormData({ ...formData, template_type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="nextjs">Next.js (Recommended)</option>
            <option value="html">Static HTML</option>
            <option value="react">React SPA</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            RSS Feed URL
          </label>
          <input
            type="url"
            value={formData.rss_feed_url}
            onChange={(e) => setFormData({ ...formData, rss_feed_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="https://www.lampgenius.co.uk/..."
          />
          <p className="text-sm text-gray-500 mt-1">Default: Lamp Genius main feed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anchor Text for Product Links
          </label>
          <input
            type="text"
            value={formData.anchor_text}
            onChange={(e) => setFormData({ ...formData, anchor_text: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="e.g., Also available from Lamp Genius"
          />
          <p className="text-sm text-gray-500 mt-1">This text will appear on product pages linking to the main site</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deployment Platform
          </label>
          <select
            value={formData.deployment_platform}
            onChange={(e) => setFormData({ ...formData, deployment_platform: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="vercel">Vercel</option>
            <option value="netlify">Netlify</option>
            <option value="cloudflare">Cloudflare Pages</option>
            <option value="github-pages">GitHub Pages</option>
            <option value="cloudways">Cloudways</option>
            <option value="aws">Amazon AWS</option>
            <option value="oracle">Oracle Cloud</option>
            <option value="custom">Custom Domain</option>
          </select>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Site'}
          </button>
        </div>
      </form>
    </div>
  );
}
