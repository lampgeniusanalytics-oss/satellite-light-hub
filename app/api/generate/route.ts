import { NextRequest, NextResponse } from 'next/server';
import { getSiteById, getCategoriesBySite, getPagesBySite } from '@/lib/database/queries';
import { generateNextJSSite } from '@/lib/site-generators/nextjs-generator';
import path from 'path';

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

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    console.log(`🔨 Generating site: ${site.name}...`);

    const categories = getCategoriesBySite(site.id);
    const pages = getPagesBySite(site.id);

    const outputDir = path.join(process.cwd(), 'generated-sites');

    switch (site.template_type) {
      case 'nextjs':
        await generateNextJSSite({
          site,
          categories,
          pages,
          outputDir,
        });
        break;
      case 'html':
        // HTML generator will be implemented next
        return NextResponse.json(
          { error: 'HTML generator not yet implemented' },
          { status: 501 }
        );
      case 'react':
        // React generator will be implemented next
        return NextResponse.json(
          { error: 'React generator not yet implemented' },
          { status: 501 }
        );
      default:
        return NextResponse.json(
          { error: 'Invalid template type' },
          { status: 400 }
        );
    }

    console.log(`✅ Site generated successfully: ${site.name}`);

    return NextResponse.json({
      success: true,
      message: `Site generated at generated-sites/${site.domain}`,
      path: `generated-sites/${site.domain}`,
    });
  } catch (error) {
    console.error('❌ Error generating site:', error);
    return NextResponse.json(
      { error: 'Failed to generate site', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
