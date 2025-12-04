interface SkeletonProps {
    className?: string;
}

export function SkeletonBox({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded ${className}`}
            aria-busy="true"
            aria-label="Loading..."
        />
    );
}

export function SkeletonCircle({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded-full ${className}`}
            aria-busy="true"
            aria-label="Loading..."
        />
    );
}

export function SkeletonText({ className = '', lines = 1 }: SkeletonProps & { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={`animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded h-4 ${className}`}
                    style={{ width: i === lines - 1 ? '80%' : '100%' }}
                    aria-busy="true"
                    aria-label="Loading..."
                />
            ))}
        </div>
    );
}

export default function Skeleton({ className = '' }: SkeletonProps) {
    return <SkeletonBox className={className} />;
}
