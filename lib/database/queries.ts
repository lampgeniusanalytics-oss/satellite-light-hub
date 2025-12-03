import { db } from './schema';

// Types
export interface Site {
  id: number;
  name: string;
  domain: string;
  template_type: 'html' | 'nextjs' | 'react';
  rss_feed_url: string | null;
  anchor_text: string;
  status: 'draft' | 'published' | 'archived';
  deployment_platform: string | null;
  github_repo_url: string | null;
  deployment_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: number;
  site_id: number;
  page_type: string;
  title: string;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  h1: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  site_id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  h1: string | null;
  schema_data: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductDB {
  id: number;
  site_id: number;
  external_id: string;
  title: string;
  description: string | null;
  price: string | null;
  image_url: string | null;
  category: string | null;
  product_url: string;
  gtin: string | null;
  brand: string | null;
  availability: string | null;
  condition: string | null;
  last_synced: string;
}

// ========== SITES ==========

export function getAllSites(): Site[] {
  return db.prepare('SELECT * FROM sites ORDER BY created_at DESC').all() as Site[];
}

export function getSiteById(id: number): Site | undefined {
  return db.prepare('SELECT * FROM sites WHERE id = ?').get(id) as Site | undefined;
}

export function getSiteByDomain(domain: string): Site | undefined {
  return db.prepare('SELECT * FROM sites WHERE domain = ?').get(domain) as Site | undefined;
}

export function createSite(data: {
  name: string;
  domain: string;
  template_type: string;
  rss_feed_url?: string;
  anchor_text?: string;
  deployment_platform?: string;
}) {
  const result = db.prepare(`
    INSERT INTO sites (name, domain, template_type, rss_feed_url, anchor_text, deployment_platform)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    data.name,
    data.domain,
    data.template_type,
    data.rss_feed_url || null,
    data.anchor_text || 'Also available from Lamp Genius',
    data.deployment_platform || null
  );

  return result.lastInsertRowid;
}

export function updateSite(id: number, data: Partial<Site>) {
  const fields: string[] = [];
  const values: any[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'created_at' && value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const sql = `UPDATE sites SET ${fields.join(', ')} WHERE id = ?`;
  return db.prepare(sql).run(...values);
}

export function deleteSite(id: number) {
  return db.prepare('DELETE FROM sites WHERE id = ?').run(id);
}

// ========== PAGES ==========

export function getPagesBySite(siteId: number): Page[] {
  return db.prepare('SELECT * FROM pages WHERE site_id = ? ORDER BY page_type').all(siteId) as Page[];
}

export function getPage(siteId: number, pageType: string): Page | undefined {
  return db.prepare('SELECT * FROM pages WHERE site_id = ? AND page_type = ?').get(siteId, pageType) as Page | undefined;
}

export function upsertPage(siteId: number, pageType: string, data: {
  title: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  h1?: string;
}) {
  return db.prepare(`
    INSERT INTO pages (site_id, page_type, title, content, meta_title, meta_description, h1)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(site_id, page_type) DO UPDATE SET
      title = excluded.title,
      content = excluded.content,
      meta_title = excluded.meta_title,
      meta_description = excluded.meta_description,
      h1 = excluded.h1,
      updated_at = CURRENT_TIMESTAMP
  `).run(
    siteId,
    pageType,
    data.title,
    data.content || null,
    data.meta_title || null,
    data.meta_description || null,
    data.h1 || null
  );
}

// ========== CATEGORIES ==========

export function getCategoriesBySite(siteId: number): Category[] {
  return db.prepare('SELECT * FROM categories WHERE site_id = ? ORDER BY parent_id, name').all(siteId) as Category[];
}

export function getCategoryBySlug(siteId: number, slug: string): Category | undefined {
  return db.prepare('SELECT * FROM categories WHERE site_id = ? AND slug = ?').get(siteId, slug) as Category | undefined;
}

export function getSubcategories(siteId: number, parentId: number): Category[] {
  return db.prepare('SELECT * FROM categories WHERE site_id = ? AND parent_id = ?').all(siteId, parentId) as Category[];
}

export function getRootCategories(siteId: number): Category[] {
  return db.prepare('SELECT * FROM categories WHERE site_id = ? AND parent_id IS NULL').all(siteId) as Category[];
}

// ========== PRODUCTS ==========

export function getProductsBySite(siteId: number, limit: number = 100): ProductDB[] {
  return db.prepare('SELECT * FROM products WHERE site_id = ? ORDER BY last_synced DESC LIMIT ?').all(siteId, limit) as ProductDB[];
}

export function getProductsByCategory(siteId: number, category: string, limit: number = 50): ProductDB[] {
  return db.prepare('SELECT * FROM products WHERE site_id = ? AND category LIKE ? ORDER BY last_synced DESC LIMIT ?')
    .all(siteId, `%${category}%`, limit) as ProductDB[];
}

export function upsertProduct(siteId: number, product: {
  external_id: string;
  title: string;
  description?: string;
  price?: string;
  image_url?: string;
  category?: string;
  product_url: string;
  gtin?: string;
  brand?: string;
  availability?: string;
  condition?: string;
}) {
  return db.prepare(`
    INSERT INTO products (
      site_id, external_id, title, description, price, image_url,
      category, product_url, gtin, brand, availability, condition
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(site_id, external_id) DO UPDATE SET
      title = excluded.title,
      description = excluded.description,
      price = excluded.price,
      image_url = excluded.image_url,
      category = excluded.category,
      product_url = excluded.product_url,
      gtin = excluded.gtin,
      brand = excluded.brand,
      availability = excluded.availability,
      condition = excluded.condition,
      last_synced = CURRENT_TIMESTAMP
  `).run(
    siteId,
    product.external_id,
    product.title,
    product.description || null,
    product.price || null,
    product.image_url || null,
    product.category || null,
    product.product_url,
    product.gtin || null,
    product.brand || null,
    product.availability || null,
    product.condition || null
  );
}

export function clearProducts(siteId: number) {
  return db.prepare('DELETE FROM products WHERE site_id = ?').run(siteId);
}

// ========== SITE SETTINGS ==========

export function getSiteSetting(siteId: number, key: string): string | null {
  const result = db.prepare('SELECT value FROM site_settings WHERE site_id = ? AND key = ?')
    .get(siteId, key) as { value: string } | undefined;
  return result?.value || null;
}

export function setSiteSetting(siteId: number, key: string, value: string) {
  return db.prepare(`
    INSERT INTO site_settings (site_id, key, value)
    VALUES (?, ?, ?)
    ON CONFLICT(site_id, key) DO UPDATE SET
      value = excluded.value,
      updated_at = CURRENT_TIMESTAMP
  `).run(siteId, key, value);
}

// ========== FEED SYNC LOGS ==========

export function logFeedSync(siteId: number, data: {
  products_synced: number;
  status: 'success' | 'failed' | 'partial';
  error_message?: string;
}) {
  return db.prepare(`
    INSERT INTO feed_sync_logs (site_id, products_synced, status, error_message)
    VALUES (?, ?, ?, ?)
  `).run(
    siteId,
    data.products_synced,
    data.status,
    data.error_message || null
  );
}

export function getRecentSyncLogs(siteId: number, limit: number = 10) {
  return db.prepare(`
    SELECT * FROM feed_sync_logs
    WHERE site_id = ?
    ORDER BY synced_at DESC
    LIMIT ?
  `).all(siteId, limit);
}
