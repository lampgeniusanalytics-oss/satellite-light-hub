'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Site {
  id: number;
  name: string;
  domain: string;
  status: string;
  template_type: string;
  rss_feed_url: string | null;
  deployment_platform: string | null;
  deployment_url: string | null;
}

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await fetch('/api/sites');
      if (res.ok) {
        const data = await res.json();
        setSites(data.sites || []);
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this site?')) return;

    try {
      const res = await fetch(`/api/sites/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSites();
      }
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  const handleSync = async (id: number) => {
    try {
      const res = await fetch('/api/feeds/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: id }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Successfully synced ${data.products_synced} products!`);
      } else {
        const error = await res.json();
        alert(`Sync failed: ${error.details || error.error}`);
      }
    } catch (error) {
      console.error('Error syncing feed:', error);
      alert('Failed to sync feed');
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Sites</h2>
          <p className="text-gray-600 mt-2">Manage your satellite websites ({sites.length}/25)</p>
        </div>
        <Link
          href="/dashboard/sites/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create New Site
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading sites...</div>
      ) : sites.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">No sites created yet</p>
          <Link
            href="/dashboard/sites/new"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Your First Site
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Site
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sites.map((site) => (
                <tr key={site.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{site.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{site.domain}</div>
                    {site.deployment_url && (
                      <a href={site.deployment_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        View Live →
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{site.template_type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      site.status === 'published' ? 'bg-green-100 text-green-800' :
                      site.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {site.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{site.deployment_platform || 'Not deployed'}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                    <button
                      onClick={() => handleSync(site.id)}
                      className="text-green-600 hover:text-green-700"
                      title="Sync RSS Feed"
                    >
                      Sync
                    </button>
                    <Link href={`/dashboard/sites/${site.id}`} className="text-blue-600 hover:text-blue-700">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(site.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
