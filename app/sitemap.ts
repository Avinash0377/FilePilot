import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://filepilot.com'; // Update with actual domain

    // Homepage
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // Tool pages
    const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
        url: `${baseUrl}${tool.href}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...toolRoutes];
}
