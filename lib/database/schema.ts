import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database path
const dbPath = path.join(process.cwd(), 'database', 'satellite-hub.db');

// Ensure database directory exists
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// Initialize database
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Database schema initialization
export function initializeDatabase() {
  // Sites table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      domain TEXT UNIQUE NOT NULL,
      template_type TEXT NOT NULL CHECK(template_type IN ('html', 'nextjs', 'react')),
      rss_feed_url TEXT,
      anchor_text TEXT DEFAULT 'Also available from Lamp Genius',
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      deployment_platform TEXT CHECK(deployment_platform IN ('vercel', 'netlify', 'cloudways', 'aws', 'cloudflare', 'github-pages', 'custom', 'oracle')),
      github_repo_url TEXT,
      deployment_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Pages table - custom content per site
  db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_id INTEGER NOT NULL,
      page_type TEXT NOT NULL CHECK(page_type IN ('home', 'about', 'contact', 'terms', 'privacy', 'payment-methods', 'delivery', 'trade-customers')),
      title TEXT NOT NULL,
      content TEXT,
      meta_title TEXT,
      meta_description TEXT,
      h1 TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
      UNIQUE(site_id, page_type)
    )
  `);

  // Global Categories (master list shared across all sites)
  db.exec(`
    CREATE TABLE IF NOT EXISTS global_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      parent_id INTEGER,
      feed_url TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES global_categories(id) ON DELETE SET NULL
    )
  `);

  // Categories table (per-site instances linked to global categories)
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_id INTEGER NOT NULL,
      global_category_id INTEGER,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      parent_id INTEGER,
      feed_url TEXT,
      description TEXT,
      meta_title TEXT,
      meta_description TEXT,
      h1 TEXT,
      schema_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
      FOREIGN KEY (global_category_id) REFERENCES global_categories(id) ON DELETE SET NULL,
      FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
      UNIQUE(site_id, slug)
    )
  `);

  // Products table - cached from RSS feeds
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_id INTEGER NOT NULL,
      external_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      price TEXT,
      image_url TEXT,
      category TEXT,
      product_url TEXT NOT NULL,
      gtin TEXT,
      brand TEXT,
      availability TEXT,
      condition TEXT,
      last_synced DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
      UNIQUE(site_id, external_id)
    )
  `);

  // Site settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_id INTEGER NOT NULL,
      key TEXT NOT NULL,
      value TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
      UNIQUE(site_id, key)
    )
  `);

  // Users table for authentication
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin' CHECK(role IN ('admin', 'editor')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Feed sync logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS feed_sync_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_id INTEGER NOT NULL,
      products_synced INTEGER DEFAULT 0,
      status TEXT NOT NULL CHECK(status IN ('success', 'failed', 'partial')),
      error_message TEXT,
      synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_sites_status ON sites(status);
    CREATE INDEX IF NOT EXISTS idx_products_site_id ON products(site_id);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_categories_site_id ON categories(site_id);
    CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
    CREATE INDEX IF NOT EXISTS idx_pages_site_id ON pages(site_id);
  `);

  console.log('✅ Database schema initialized');
}

// Seed default admin user
export function seedDefaultUser() {
  const bcrypt = require('bcryptjs');
  const username = 'admin';
  const password = 'James1234';
  const passwordHash = bcrypt.hashSync(password, 10);

  const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);

  if (!existingUser) {
    db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(
      username,
      passwordHash,
      'admin'
    );
    console.log('✅ Default admin user created');
  }
}

// Seed global categories (master list with feed URLs)
export function seedGlobalCategories() {
  const categories = [
    // Indoor Lighting (parent)
    { name: 'Indoor Lighting', slug: 'indoor-lighting', parent_id: null, feed_url: null },

    // Indoor subcategories - each can have its own feed URL
    { name: 'Ceiling Lights', slug: 'ceiling-lights', parent: 'indoor-lighting', feed_url: null },
    { name: 'Pendant Lighting', slug: 'pendant-lighting', parent: 'indoor-lighting', feed_url: null },
    { name: 'Chandeliers', slug: 'chandeliers', parent: 'indoor-lighting', feed_url: null },
    { name: 'Ceiling Spotlights', slug: 'ceiling-spotlights', parent: 'indoor-lighting', feed_url: null },
    { name: 'Wall Lights', slug: 'wall-lights', parent: 'indoor-lighting', feed_url: null },
    { name: 'Table Lamps', slug: 'table-lamps', parent: 'indoor-lighting', feed_url: null },
    { name: 'Floor Lamps', slug: 'floor-lamps', parent: 'indoor-lighting', feed_url: null },

    // Outdoor Lighting (parent)
    { name: 'Outdoor Lighting', slug: 'outdoor-lighting', parent_id: null, feed_url: null },

    // Outdoor subcategories - each can have its own feed URL
    { name: 'Outdoor Wall Lights', slug: 'outdoor-wall-lights', parent: 'outdoor-lighting', feed_url: null },
    { name: 'Outdoor Pendant Lights', slug: 'outdoor-pendant-lights', parent: 'outdoor-lighting', feed_url: null },
    { name: 'Outdoor Ceiling Lights', slug: 'outdoor-ceiling-lights', parent: 'outdoor-lighting', feed_url: null },
  ];

  const categoryMap: { [key: string]: number } = {};

  for (const cat of categories) {
    // Check if already exists
    const existing = db.prepare('SELECT id FROM global_categories WHERE slug = ?').get(cat.slug) as { id: number } | undefined;

    if (existing) {
      categoryMap[cat.slug] = existing.id;
      continue;
    }

    let parentId = cat.parent_id;
    if ('parent' in cat && cat.parent) {
      parentId = categoryMap[cat.parent];
    }

    const result = db.prepare(`
      INSERT INTO global_categories (name, slug, parent_id, feed_url, description)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      cat.name,
      cat.slug,
      parentId || null,
      cat.feed_url,
      `Shop our wide range of ${cat.name.toLowerCase()} with free UK delivery.`
    );

    categoryMap[cat.slug] = Number(result.lastInsertRowid);
  }

  console.log('✅ Global categories seeded');
}

// Seed default categories for a site (based on global categories)
export function seedDefaultCategories(siteId: number) {
  const globalCategories = db.prepare(`
    SELECT * FROM global_categories ORDER BY parent_id, name
  `).all() as any[];

  const categoryMap: { [key: number]: number } = {};

  for (const globalCat of globalCategories) {
    const result = db.prepare(`
      INSERT INTO categories (
        site_id, global_category_id, name, slug, parent_id, feed_url,
        description, h1, meta_title, meta_description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      siteId,
      globalCat.id,
      globalCat.name,
      globalCat.slug,
      categoryMap[globalCat.parent_id] || null,
      globalCat.feed_url,
      globalCat.description,
      globalCat.name,
      `${globalCat.name} | Premium Lighting Solutions`,
      `Shop our wide range of ${globalCat.name.toLowerCase()} with free UK delivery. Quality lighting at competitive prices.`
    );

    categoryMap[globalCat.id] = Number(result.lastInsertRowid);
  }

  console.log(`✅ Default categories seeded for site ${siteId}`);
}

// Seed default pages for a site
export function seedDefaultPages(siteId: number, siteName: string) {
  const pages = [
    {
      type: 'home',
      title: `Welcome to ${siteName}`,
      h1: 'Premium Lighting Solutions',
      content: 'Discover our extensive range of indoor and outdoor lighting solutions.',
      metaDescription: 'Premium lighting solutions for your home and business. Browse ceiling lights, pendant lights, chandeliers, and more.'
    },
    {
      type: 'about',
      title: 'About Us',
      h1: 'About Us',
      content: 'We are dedicated to providing high-quality lighting solutions.',
      metaDescription: 'Learn about our commitment to quality lighting solutions and customer service.'
    },
    {
      type: 'contact',
      title: 'Contact Us',
      h1: 'Get in Touch',
      content: 'Have questions? Contact our team for expert advice.',
      metaDescription: 'Contact us for lighting advice and support. Our expert team is here to help.'
    },
    {
      type: 'terms',
      title: 'Terms & Conditions',
      h1: 'Terms & Conditions',
      content: 'Please read our terms and conditions carefully.',
      metaDescription: 'Read our terms and conditions for purchases and services.'
    },
    {
      type: 'privacy',
      title: 'Privacy Policy',
      h1: 'Privacy Policy',
      content: 'Your privacy is important to us.',
      metaDescription: 'Our privacy policy explains how we handle your personal information.'
    },
    {
      type: 'payment-methods',
      title: 'Payment Methods',
      h1: 'Payment Methods',
      content: 'We accept all major payment methods.',
      metaDescription: 'Information about accepted payment methods and secure checkout.'
    },
    {
      type: 'delivery',
      title: 'Delivery Information',
      h1: 'Delivery Information',
      content: 'Fast and reliable delivery across the UK.',
      metaDescription: 'Delivery information including shipping times and costs.'
    },
    {
      type: 'trade-customers',
      title: 'Trade Customers',
      h1: 'Trade Customer Benefits',
      content: 'Special pricing and benefits for trade customers.',
      metaDescription: 'Trade customer accounts with special pricing and dedicated support.'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO pages (site_id, page_type, title, h1, content, meta_title, meta_description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const page of pages) {
    stmt.run(
      siteId,
      page.type,
      page.title,
      page.h1,
      page.content,
      page.title,
      page.metaDescription
    );
  }

  console.log(`✅ Default pages seeded for site ${siteId}`);
}

// Initialize everything
export function setupDatabase() {
  initializeDatabase();
  seedDefaultUser();
  seedGlobalCategories();
  console.log('✅ Database setup complete');
}
