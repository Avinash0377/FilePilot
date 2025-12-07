export const config = {
    // Resource Management
    resources: {
        maxMemoryMB: 1500, // Safe limit for 2GB server (leaves 500MB for OS)
        maxTempFilesMB: 5120, // 5GB temp storage
        cleanupIntervalMs: 30000,
        maxConcurrentConversions: 10, // Increased global limit
    },

    // Queue Configuration
    queue: {
        maxConcurrent: {
            pdf: 3, // Can now run 3 LibreOffice instances (3x300MB = 900MB)
            image: 5, // Fast image processing
            video: 2, // Allow 2 simultaneous video conversions
            audio: 3,
            archive: 3,
            default: 3,
        },
        maxQueueSize: 50,
        jobTimeout: 300000,
        cleanupInterval: 60000,
    },
};
