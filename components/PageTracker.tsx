'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Track page view on route change
        const trackView = async () => {
            try {
                await fetch('/api/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path: pathname })
                });
            } catch (error) {
                // Silently fail - analytics shouldn't break the app
                console.debug('[Tracker] Failed to track:', error);
            }
        };

        trackView();
    }, [pathname]);

    // This component renders nothing
    return null;
}
