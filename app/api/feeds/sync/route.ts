import { NextRequest, NextResponse } from 'next/server';
import { getSiteById } from '@/lib/database/queries';
import { upsertProduct, clearProducts, logFeedSync } from '@/lib/database/queries';
import { parseRSSFeed } from '@/lib/rss-parser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteId } = body;

    if (!siteId) {
      return NextResponse.json(
        { error: 'Site ID required' },
        { status: 400 }
      );
    }

    const site = getSiteById(parseInt(siteId));

    if (!site || !site.rss_feed_url) {
      return NextResponse.json(
        { error: 'Site not found or no RSS feed URL configured' },
        { status: 404 }
      );
    }

    console.log(`🔄 Starting RSS sync for site ${site.name}...`);

    try {
      // Parse RSS feed
      const products = await parseRSSFeed(site.rss_feed_url);

      // Clear existing products
      clearProducts(site.id);

      // Insert new products
      let syncedCount = 0;
      for (const product of products) {
        try {
          upsertProduct(site.id, {
            external_id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            image_url: product.imageUrl,
            category: product.category,
            product_url: product.productUrl,
            gtin: product.gtin,
            brand: product.brand,
            availability: product.availability,
            condition: product.condition,
          });
          syncedCount++;
        } catch (error) {
          console.error(`Error inserting product ${product.id}:`, error);
        }
      }

      // Log sync
      logFeedSync(site.id, {
        products_synced: syncedCount,
        status: syncedCount === products.length ? 'success' : 'partial',
      });

      console.log(`✅ Synced ${syncedCount} products for site ${site.name}`);

      return NextResponse.json({
        success: true,
        products_synced: syncedCount,
        total_products: products.length,
      });
    } catch (error) {
      // Log failed sync
      logFeedSync(site.id, {
        products_synced: 0,
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  } catch (error) {
    console.error('Error syncing feed:', error);
    return NextResponse.json(
      { error: 'Failed to sync feed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
