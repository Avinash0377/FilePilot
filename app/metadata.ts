import { generateHomeMetadata } from '@/lib/seo';

export const metadata = generateHomeMetadata();

export default function HomePage() {
    // This file just exports metadata
    // The actual page content is in page.tsx
    return null;
}
