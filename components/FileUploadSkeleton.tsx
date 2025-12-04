import { SkeletonBox, SkeletonText } from './Skeleton';

export default function FileUploadSkeleton() {
    return (
        <div className="space-y-4">
            {/* Upload area skeleton */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
                <SkeletonBox className="w-16 h-16 mx-auto mb-4" />
                <SkeletonText lines={2} className="max-w-md mx-auto" />
            </div>

            {/* File list skeleton */}
            <div className="space-y-2">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <SkeletonBox className="w-10 h-10" />
                        <div className="flex-1">
                            <SkeletonBox className="h-4 w-48 mb-2" />
                            <SkeletonBox className="h-3 w-24" />
                        </div>
                        <SkeletonBox className="w-8 h-8 rounded-full" />
                    </div>
                ))}
            </div>

            {/* Button skeleton */}
            <SkeletonBox className="h-12 w-full rounded-xl" />
        </div>
    );
}
