
import { v4 as uuidv4 } from 'uuid';
import { config } from './config';

export type JobType = 'pdf' | 'image' | 'video' | 'audio' | 'archive' | 'text';

/**
 * Production Queue (Semaphore Implementation)
 * 
 * In a serverless/Next.js environment, we cannot easily have long-running background workers 
 * that "pull" jobs from a queue. Instead, incoming requests act as their own workers.
 * 
 * This class acts as a central Semaphore to limit concurrency per tool type.
 * It tracks active jobs in memory (persists in warm lambdas).
 */
class ProductionQueue {
    // Track active jobs per type
    private activeJobsByType: Record<string, number> = {
        pdf: 0,
        image: 0,
        video: 0,
        audio: 0,
        archive: 0,
        text: 0
    };

    /**
     * Attempt to acquire a slot for a job type.
     * Returns a token ID if successful, or null if queue is full.
     */
    async acquireSlot(type: JobType): Promise<string | null> {
        const limits = config.queue.maxConcurrent as Record<string, number>;
        const typeLimit = limits[type] || limits.default || 2;
        const currentCount = this.activeJobsByType[type] || 0;

        if (currentCount >= typeLimit) {
            return null;
        }

        // Initialize if undefined (safety)
        if (this.activeJobsByType[type] === undefined) {
            this.activeJobsByType[type] = 0;
        }

        this.activeJobsByType[type]++;
        return uuidv4();
    }

    /**
     * Release a slot for a job type.
     */
    releaseSlot(type: JobType) {
        if (this.activeJobsByType[type] > 0) {
            this.activeJobsByType[type]--;
        }
    }

    /**
     * Get current queue stats
     */
    getStats() {
        return {
            activeByType: { ...this.activeJobsByType }
        };
    }
}

// Global instance
export const productionQueue = new ProductionQueue();
