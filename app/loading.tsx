import ToolCardSkeleton from '@/components/ToolCardSkeleton';

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Header Skeleton */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
                    <div className="h-10 w-64 bg-slate-200 rounded-lg mx-auto animate-pulse" />
                    <div className="h-6 w-96 bg-slate-200 rounded-lg mx-auto animate-pulse" />
                </div>

                {/* Tools Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ToolCardSkeleton count={9} />
                </div>
            </div>
        </div>
    );
}
