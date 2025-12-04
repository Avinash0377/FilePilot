import { SkeletonBox, SkeletonText } from './Skeleton';

export default function ConversionSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-clean border border-slate-200">
            {/* Status skeleton */}
            <div className="flex items-center gap-3 mb-4">
                <SkeletonBox className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                    <SkeletonBox className="h-5 w-32 mb-2" />
                    <SkeletonText lines={1} className="w-48" />
                </div>
            </div>

            {/* Progress bar skeleton */}
            <div className="mb-4">
                <SkeletonBox className="h-2 w-full rounded-full" />
            </div>

            {/* File preview skeleton */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <SkeletonBox className="h-4 w-20" />
                    <SkeletonBox className="h-32 w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                    <SkeletonBox className="h-4 w-20" />
                    <SkeletonBox className="h-32 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}
