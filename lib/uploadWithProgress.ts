/**
 * Upload file with progress tracking using XMLHttpRequest
 * Returns a promise that resolves with the response
 */
export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
    speed?: number; // bytes per second
    timeRemaining?: number; // seconds
}

export async function uploadWithProgress(
    url: string,
    formData: FormData,
    onProgress?: (progress: UploadProgress) => void
): Promise<Response> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        let startTime = Date.now();
        let lastLoaded = 0;
        let lastTime = Date.now();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                const now = Date.now();
                const timeDiff = (now - lastTime) / 1000; // seconds
                const loadedDiff = e.loaded - lastLoaded;

                // Calculate speed (bytes per second)
                const speed = timeDiff > 0 ? loadedDiff / timeDiff : 0;

                // Calculate time remaining (seconds)
                const remaining = e.total - e.loaded;
                const timeRemaining = speed > 0 ? remaining / speed : 0;

                onProgress({
                    loaded: e.loaded,
                    total: e.total,
                    percentage: Math.round((e.loaded / e.total) * 100),
                    speed,
                    timeRemaining,
                });

                lastLoaded = e.loaded;
                lastTime = now;
            }
        });

        // Handle completion
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                // Create a Response object from XHR
                const response = new Response(xhr.response, {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: parseHeaders(xhr.getAllResponseHeaders()),
                });
                resolve(response);
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
            }
        });

        // Handle errors
        xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'));
        });

        xhr.addEventListener('abort', () => {
            reject(new Error('Upload aborted'));
        });

        // Open and send request
        xhr.open('POST', url);
        xhr.responseType = 'blob'; // For file downloads
        xhr.send(formData);
    });
}

/**
 * Parse XHR headers into Headers object
 */
function parseHeaders(headerString: string): Headers {
    const headers = new Headers();
    if (!headerString) return headers;

    const lines = headerString.trim().split(/[\r\n]+/);

    lines.forEach((line) => {
        // Split only on first ': ' to handle values that contain ': '
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const header = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            if (header && value) {
                headers.append(header, value);
            }
        }
    });

    return headers;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Format seconds to human-readable time
 */
export function formatTime(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
}
