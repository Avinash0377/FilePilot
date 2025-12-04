import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://filepilot.com";

  // Path to tools directory
  const toolsDir = path.join(process.cwd(), "app", "tools");

  // Read all tool folders dynamically
  const toolFolders = fs
    .readdirSync(toolsDir, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => `/tools/${item.name}`);

  // Include homepage
  const urls = ["", ...toolFolders];

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
      .map(
        (path) => `
        <url>
          <loc>${baseUrl}${path}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>
      `
      )
      .join("")}
    </urlset>
  `;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
