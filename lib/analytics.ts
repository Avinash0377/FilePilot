// Google Analytics Configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

// Log page view
export const pageview = (url: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }
};

// Log specific events
export const event = ({ action, category, label, value }: {
    action: string;
    category: string;
    label?: string;
    value?: number;
}) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Track file conversions
export const trackConversion = (toolName: string, fileType: string) => {
    event({
        action: 'file_conversion',
        category: 'Conversion',
        label: `${toolName} - ${fileType}`,
    });
};

// Track file downloads
export const trackDownload = (fileName: string) => {
    event({
        action: 'file_download',
        category: 'Download',
        label: fileName,
    });
};

// Track tool usage
export const trackToolUsage = (toolName: string) => {
    event({
        action: 'tool_used',
        category: 'Tool Usage',
        label: toolName,
    });
};
