import { MetadataRoute } from 'next';
import { tools } from '@/lib/tools';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://filepilot.online';
    const currentDate = new Date();

    // Static pages
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // Tool pages - high priority for SEO
    const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
        url: `${baseUrl}${tool.href}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.9, // Increased priority for tool pages
    }));

    return [...staticRoutes, ...toolRoutes];
}
