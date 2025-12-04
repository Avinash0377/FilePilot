import { Metadata } from 'next';
import { Tool } from './tools';

const SITE_NAME = 'FilePilot';
const SITE_URL = 'https://filepilot.com'; // Update with actual domain
const SITE_DESCRIPTION = 'Convert files online for free. PDF to Word, Image compression, Video conversion, and 20+ more tools. Fast, secure, and easy to use.';

export function generateMetadata({
    title,
    description,
    keywords,
    path = '',
    image,
}: {
    title: string;
    description: string;
    keywords?: string[];
    path?: string;
    image?: string;
}): Metadata {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;
    const ogImage = image || `${SITE_URL}/og-image.png`;

    return {
        title: fullTitle,
        description,
        keywords: keywords?.join(', '),
        authors: [{ name: SITE_NAME }],
        creator: SITE_NAME,
        publisher: SITE_NAME,
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
        openGraph: {
            type: 'website',
            url,
            title: fullTitle,
            description,
            siteName: SITE_NAME,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: url,
        },
    };
}

export function generateToolMetadata(tool: Tool): Metadata {
    const title = `${tool.title} - Free Online Converter`;
    const description = `${tool.description}. Convert ${tool.supportedFormats.join(', ')} files online for free. Fast, secure, and easy to use. No registration required.`;

    const keywords = [
        tool.title.toLowerCase(),
        ...tool.supportedFormats.map(f => f.toLowerCase()),
        'converter',
        'online',
        'free',
        tool.category,
        'file conversion',
    ];

    return generateMetadata({
        title,
        description,
        keywords,
        path: tool.href,
    });
}

export function generateHomeMetadata(): Metadata {
    return generateMetadata({
        title: 'FilePilot - Free Online File Converter',
        description: SITE_DESCRIPTION,
        keywords: [
            'file converter',
            'pdf converter',
            'image converter',
            'video converter',
            'audio converter',
            'online tools',
            'free converter',
            'pdf to word',
            'image compression',
            'file conversion',
        ],
        path: '/',
    });
}

export function generatePrivacyMetadata(): Metadata {
    return generateMetadata({
        title: 'Privacy Policy',
        description: 'FilePilot Privacy Policy. Learn how we protect your data and respect your privacy.',
        keywords: ['privacy policy', 'data protection', 'privacy'],
        path: '/privacy',
    });
}
