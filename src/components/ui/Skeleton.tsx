import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={clsx(
      'animate-pulse rounded-lg bg-surface-elevated',
      className
    )}
    aria-hidden="true"
  />
);

export const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <div className={clsx('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={clsx('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className }: SkeletonProps) => (
  <div className={clsx('bg-surface-card rounded-2xl border border-surface-border p-5 space-y-4', className)}>
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

export const SkeletonAvatar = ({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14' };
  return <Skeleton className={clsx('rounded-full shrink-0', sizes[size], className)} />;
};
