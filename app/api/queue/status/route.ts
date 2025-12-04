import { NextRequest, NextResponse } from 'next/server';
import conversionQueue from '@/lib/conversionQueue';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get('jobId');

        if (!jobId) {
            return NextResponse.json(
                { error: 'Job ID is required' },
                { status: 400 }
            );
        }

        const status = conversionQueue.getStatus(jobId);

        if (!status) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        const position = conversionQueue.getPosition(jobId);
        const estimatedWait = conversionQueue.getEstimatedWait(jobId);
        const stats = conversionQueue.getStats();

        return NextResponse.json({
            jobId: status.id,
            status: status.status,
            position,
            estimatedWait,
            queueStats: stats,
            addedAt: status.addedAt,
            startedAt: status.startedAt,
            completedAt: status.completedAt,
            error: status.error,
        });
    } catch (error) {
        console.error('Queue status error:', error);
        return NextResponse.json(
            { error: 'Failed to get queue status' },
            { status: 500 }
        );
    }
}
