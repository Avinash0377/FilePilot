'use client';

import { useEffect } from 'react';

interface AdBannerProps {
    adSlot: string;
    adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
    fullWidth?: boolean;
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

export default function AdBanner({
    adSlot,
    adFormat = 'auto',
    fullWidth = true,
    className = ''
}: AdBannerProps) {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && window.adsbygoogle) {
                window.adsbygoogle.push({});
            }
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className={`ad-container ${className}`}>
            <ins
                className="adsbygoogle"
                style={{
                    display: 'block',
                    textAlign: 'center',
                }}
                data-ad-client="ca-pub-2751388946281871"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidth ? 'true' : 'false'}
            />
        </div>
    );
}

// Wrapper for in-article ads
export function InArticleAd({ className = '' }: { className?: string }) {
    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && window.adsbygoogle) {
                window.adsbygoogle.push({});
            }
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className={`my-6 ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', textAlign: 'center' }}
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client="ca-pub-2751388946281871"
                data-ad-slot=""
            />
        </div>
    );
}
