import { NextRequest, NextResponse } from 'next/server';
import { getAllSites, createSite } from '@/lib/database/queries';
import { seedDefaultCategories, seedDefaultPages } from '@/lib/database/schema';

export async function GET() {
  try {
    const sites = getAllSites();
    return NextResponse.json({ sites });
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, domain, template_type, rss_feed_url, anchor_text, deployment_platform } = body;

    // Validation
    if (!name || !domain || !template_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create site
    const siteId = createSite({
      name,
      domain,
      template_type,
      rss_feed_url: rss_feed_url || 'https://www.lampgenius.co.uk/wp-content/uploads/woo-feed/google/xml/maingoogleshoppingfeed-3.xml',
      anchor_text: anchor_text || 'Also available from Lamp Genius',
      deployment_platform: deployment_platform || 'vercel',
    });

    // Seed default categories and pages
    seedDefaultCategories(Number(siteId));
    seedDefaultPages(Number(siteId), name);

    return NextResponse.json(
      { success: true, siteId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating site:', error);
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    );
  }
}
