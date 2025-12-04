// Video Conversion Queue Manager
// Handles sequential processing of video conversions to prevent server overload

interface QueueJob {
    id: string;
    type: 'video-convert' | 'video-compress';
    status: 'queued' | 'processing' | 'completed' | 'error';
    addedAt: number;
    startedAt?: number;
    completedAt?: number;
    error?: string;
    userId: string; // IP address or session ID
}

interface QueueConfig {
    maxConcurrent: number;
    maxQueueSize: number;
    jobTimeout: number;
    cleanupInterval: number;
}

const QUEUE_CONFIG: QueueConfig = {
    maxConcurrent: 1,           // Process 1 video at a time
    maxQueueSize: 10,           // Max 10 videos in queue
    jobTimeout: 5 * 60 * 1000,  // 5 minute timeout
    cleanupInterval: 60 * 1000, // Cleanup every minute
};

class ConversionQueue {
    private queue: Map<string, QueueJob> = new Map();
    private processing: Set<string> = new Set();
    private cleanupTimer?: NodeJS.Timeout;

    constructor() {
        this.startCleanup();
    }

    /**
     * Add a job to the queue
     */
    addJob(jobId: string, type: QueueJob['type'], userId: string): { success: boolean; position?: number; error?: string } {
        // Check if queue is full
        if (this.queue.size >= QUEUE_CONFIG.maxQueueSize) {
            return {
                success: false,
                error: 'Queue is full. Please try again later.',
            };
        }

        // Check if job already exists
        if (this.queue.has(jobId)) {
            return {
                success: false,
                error: 'Job already in queue',
            };
        }

        // Add job to queue
        const job: QueueJob = {
            id: jobId,
            type,
            status: 'queued',
            addedAt: Date.now(),
            userId,
        };

        this.queue.set(jobId, job);

        // Try to process immediately if no jobs are processing
        if (this.processing.size < QUEUE_CONFIG.maxConcurrent) {
            this.processNext();
        }

        return {
            success: true,
            position: this.getPosition(jobId),
        };
    }

    /**
     * Mark job as processing
     */
    startProcessing(jobId: string): boolean {
        const job = this.queue.get(jobId);
        if (!job || job.status !== 'queued') {
            return false;
        }

        job.status = 'processing';
        job.startedAt = Date.now();
        this.processing.add(jobId);
        return true;
    }

    /**
     * Mark job as completed
     */
    completeJob(jobId: string, error?: string): void {
        const job = this.queue.get(jobId);
        if (!job) return;

        job.status = error ? 'error' : 'completed';
        job.completedAt = Date.now();
        job.error = error;
        this.processing.delete(jobId);

        // Process next job in queue
        setTimeout(() => this.processNext(), 100);
    }

    /**
     * Process next job in queue
     */
    private processNext(): void {
        if (this.processing.size >= QUEUE_CONFIG.maxConcurrent) {
            return;
        }

        // Find oldest queued job
        let oldestJob: QueueJob | null = null;
        for (const job of this.queue.values()) {
            if (job.status === 'queued') {
                if (!oldestJob || job.addedAt < oldestJob.addedAt) {
                    oldestJob = job;
                }
            }
        }

        if (oldestJob) {
            this.startProcessing(oldestJob.id);
        }
    }

    /**
     * Get job status
     */
    getStatus(jobId: string): QueueJob | null {
        return this.queue.get(jobId) || null;
    }

    /**
     * Get position in queue
     */
    getPosition(jobId: string): number {
        const job = this.queue.get(jobId);
        if (!job || job.status !== 'queued') {
            return 0;
        }

        let position = 1;
        for (const queuedJob of this.queue.values()) {
            if (queuedJob.status === 'queued' && queuedJob.addedAt < job.addedAt) {
                position++;
            }
        }

        return position;
    }

    /**
     * Get estimated wait time in seconds
     */
    getEstimatedWait(jobId: string): number {
        const position = this.getPosition(jobId);
        if (position === 0) return 0;

        // Estimate 2 minutes per video
        const avgProcessingTime = 2 * 60; // 2 minutes in seconds
        return position * avgProcessingTime;
    }

    /**
     * Get queue stats
     */
    getStats(): { total: number; queued: number; processing: number; completed: number } {
        let queued = 0;
        let completed = 0;

        for (const job of this.queue.values()) {
            if (job.status === 'queued') queued++;
            if (job.status === 'completed' || job.status === 'error') completed++;
        }

        return {
            total: this.queue.size,
            queued,
            processing: this.processing.size,
            completed,
        };
    }

    /**
     * Check if job can start processing
     */
    canProcess(jobId: string): boolean {
        const job = this.queue.get(jobId);
        if (!job) return false;

        return job.status === 'processing';
    }

    /**
     * Remove completed/errored jobs older than 5 minutes
     */
    private cleanup(): void {
        const now = Date.now();
        const maxAge = 5 * 60 * 1000; // 5 minutes

        for (const [jobId, job] of this.queue.entries()) {
            if (
                (job.status === 'completed' || job.status === 'error') &&
                job.completedAt &&
                now - job.completedAt > maxAge
            ) {
                this.queue.delete(jobId);
            }

            // Remove stuck jobs (processing for too long)
            if (
                job.status === 'processing' &&
                job.startedAt &&
                now - job.startedAt > QUEUE_CONFIG.jobTimeout
            ) {
                this.completeJob(jobId, 'Timeout: Processing took too long');
            }
        }
    }

    /**
     * Start periodic cleanup
     */
    private startCleanup(): void {
        this.cleanupTimer = setInterval(() => {
            this.cleanup();
        }, QUEUE_CONFIG.cleanupInterval);
    }

    /**
     * Stop cleanup timer
     */
    destroy(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
    }
}

// Singleton instance
const conversionQueue = new ConversionQueue();

export default conversionQueue;
export type { QueueJob };
