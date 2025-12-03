import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/schema';

// Get all global categories
export async function GET() {
  try {
    const categories = db.prepare(`
      SELECT * FROM global_categories
      ORDER BY parent_id NULLS FIRST, name
    `).all();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching global categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// Update global category feed URL
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, feed_url } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID required' },
        { status: 400 }
      );
    }

    db.prepare(`
      UPDATE global_categories
      SET feed_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(feed_url || null, id);

    // Also update all site categories linked to this global category
    db.prepare(`
      UPDATE categories
      SET feed_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE global_category_id = ?
    `).run(feed_url || null, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}
