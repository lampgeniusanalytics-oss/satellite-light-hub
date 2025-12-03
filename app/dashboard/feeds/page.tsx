'use client';

import { useEffect, useState } from 'react';

interface GlobalCategory {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  feed_url: string | null;
  description: string | null;
}

export default function FeedsPage() {
  const [categories, setCategories] = useState<GlobalCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [feedUrls, setFeedUrls] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/feeds/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);

        // Initialize feed URLs
        const urls: { [key: number]: string } = {};
        data.categories.forEach((cat: GlobalCategory) => {
          urls[cat.id] = cat.feed_url || '';
        });
        setFeedUrls(urls);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (categoryId: number) => {
    setSaving(categoryId);

    try {
      const res = await fetch('/api/feeds/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: categoryId,
          feed_url: feedUrls[categoryId] || null,
        }),
      });

      if (res.ok) {
        alert('Feed URL updated successfully!');
        setEditingId(null);
        fetchCategories();
      } else {
        alert('Failed to update feed URL');
      }
    } catch (error) {
      console.error('Error updating feed URL:', error);
      alert('Failed to update feed URL');
    } finally {
      setSaving(null);
    }
  };

  const parentCategories = categories.filter((cat) => !cat.parent_id);
  const getSubcategories = (parentId: number) =>
    categories.filter((cat) => cat.parent_id === parentId);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">RSS Feed Management</h2>
        <p className="text-gray-600 mt-2">
          Configure category-specific RSS feed URLs. These feeds will be used across all satellite sites.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading categories...</div>
      ) : (
        <div className="space-y-8">
          {parentCategories.map((parent) => (
            <div key={parent.id} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">{parent.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{parent.description}</p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Parent category feed URL */}
                  <div className="pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Main Feed URL (Optional)
                      </label>
                      {editingId === parent.id ? (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleSave(parent.id)}
                            disabled={saving === parent.id}
                            className="text-sm text-green-600 hover:text-green-700 disabled:opacity-50"
                          >
                            {saving === parent.id ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-sm text-gray-600 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingId(parent.id)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <input
                      type="url"
                      value={feedUrls[parent.id] || ''}
                      onChange={(e) =>
                        setFeedUrls({ ...feedUrls, [parent.id]: e.target.value })
                      }
                      disabled={editingId !== parent.id}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="https://example.com/feed.xml"
                    />
                  </div>

                  {/* Subcategories */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Subcategories</h4>
                    <div className="space-y-3">
                      {getSubcategories(parent.id).map((sub) => (
                        <div key={sub.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">
                              {sub.name}
                            </label>
                            {editingId === sub.id ? (
                              <div className="space-x-2">
                                <button
                                  onClick={() => handleSave(sub.id)}
                                  disabled={saving === sub.id}
                                  className="text-sm text-green-600 hover:text-green-700 disabled:opacity-50"
                                >
                                  {saving === sub.id ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="text-sm text-gray-600 hover:text-gray-700"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingId(sub.id)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                {feedUrls[sub.id] ? 'Edit' : 'Add Feed'}
                              </button>
                            )}
                          </div>
                          <input
                            type="url"
                            value={feedUrls[sub.id] || ''}
                            onChange={(e) =>
                              setFeedUrls({ ...feedUrls, [sub.id]: e.target.value })
                            }
                            disabled={editingId !== sub.id}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="https://example.com/category-feed.xml"
                          />
                          {feedUrls[sub.id] && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ Feed URL configured - will be used across all sites
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">How Feed URLs Work</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Each category/subcategory can have its own dedicated RSS feed URL</li>
          <li>• Feed URLs are shared across all satellite sites</li>
          <li>• When you sync products, the system will use the category-specific feed</li>
          <li>• Products will be automatically categorized based on the feed source</li>
        </ul>
      </div>
    </div>
  );
}
