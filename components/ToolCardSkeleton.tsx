import { SkeletonBox, SkeletonCircle, SkeletonText } from './Skeleton';

export default function ToolCardSkeleton({ count = 6 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-xl p-6 shadow-clean hover:shadow-clean-lg transition-all duration-200 border border-slate-200"
                >
                    {/* Icon skeleton */}
                    <div className="flex items-center gap-4 mb-4">
                        <SkeletonCircle className="w-12 h-12" />
                        <div className="flex-1">
                            <SkeletonBox className="h-6 w-32 mb-2" />
                        </div>
                    </div>

                    {/* Description skeleton */}
                    <SkeletonText lines={2} className="mb-4" />

                    {/* Badges skeleton */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <SkeletonBox className="h-6 w-20" />
                        <SkeletonBox className="h-6 w-24" />
                    </div>

                    {/* Max file size skeleton */}
                    <SkeletonBox className="h-4 w-28" />
                </div>
            ))}
        </>
    );
}
