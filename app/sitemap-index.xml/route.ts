import { NextResponse } from "next/server";

export function GET() {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
      <loc>https://filepilot.com/sitemap.xml</loc>
    </sitemap>
  </sitemapindex>`;

    return new NextResponse(xml, {
        headers: { "Content-Type": "application/xml" },
    });
}
