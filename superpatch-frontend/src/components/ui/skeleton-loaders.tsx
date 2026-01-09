"use client";

import { cn } from "@/lib/utils";

// Base skeleton with shimmer animation
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted relative overflow-hidden",
        "after:absolute after:inset-0 after:-translate-x-full",
        "after:animate-[shimmer_2s_infinite]",
        "after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent",
        className
      )}
      {...props}
    />
  );
}

// Table row skeleton
export function TableRowSkeleton({ columns = 7 }: { columns?: number }) {
  return (
    <div className="flex items-center px-6 py-4 border-b gap-4">
      <Skeleton className="h-4 w-4 rounded" /> {/* Checkbox */}
      <div className="flex-1 min-w-[200px] space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-4 w-[100px]" /> {/* Type */}
      <Skeleton className="h-4 w-[80px]" /> {/* City */}
      <Skeleton className="h-4 w-[60px]" /> {/* Rating */}
      <Skeleton className="h-4 w-[100px]" /> {/* Phone */}
      <Skeleton className="h-6 w-[80px] rounded-full" /> {/* Status badge */}
    </div>
  );
}

// Table skeleton with multiple rows
export function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="w-full">
      {/* Header skeleton */}
      <div className="flex items-center px-6 py-3 border-b bg-muted/50 gap-4">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[80px]" />
        <Skeleton className="h-4 w-[80px]" />
        <Skeleton className="h-4 w-[60px]" />
        <Skeleton className="h-4 w-[80px]" />
        <Skeleton className="h-4 w-[60px]" />
      </div>
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </div>
  );
}

// KPI Card skeleton
export function KPICardSkeleton() {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
    </div>
  );
}

// KPI Cards row skeleton
export function KPICardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>
  );
}

// Chart skeleton
export function ChartSkeleton({ height = 250 }: { height?: number }) {
  return (
    <div className="border rounded-lg bg-card">
      <div className="p-4 border-b space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-60" />
      </div>
      <div className="p-4" style={{ height }}>
        <div className="h-full flex items-end justify-around gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-full"
              style={{ height: `${30 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Pie chart skeleton
export function PieChartSkeleton({ size = 200 }: { size?: number }) {
  return (
    <div className="border rounded-lg bg-card">
      <div className="p-4 border-b space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-60" />
      </div>
      <div className="p-4 flex items-center justify-center" style={{ height: size + 50 }}>
        <Skeleton 
          className="rounded-full" 
          style={{ width: size, height: size }}
        />
      </div>
    </div>
  );
}

// Activity feed item skeleton
export function ActivityItemSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3">
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-3 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

// Activity feed skeleton
export function ActivityFeedSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: items }).map((_, i) => (
        <ActivityItemSkeleton key={i} />
      ))}
    </div>
  );
}

// Pipeline column skeleton
export function PipelineColumnSkeleton() {
  return (
    <div className="w-72 flex-shrink-0 rounded-lg border bg-muted/20">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
      </div>
      <div className="p-2 space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Pipeline board skeleton
export function PipelineBoardSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {Array.from({ length: columns }).map((_, i) => (
        <PipelineColumnSkeleton key={i} />
      ))}
    </div>
  );
}

// Filter panel skeleton
export function FilterPanelSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between pb-3 border-b">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-7 w-14" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

// Map skeleton
export function MapSkeleton({ height = 400 }: { height?: number }) {
  return (
    <div className="border rounded-lg bg-card overflow-hidden" style={{ height }}>
      <Skeleton className="w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-10 w-10 rounded-full mx-auto mb-2" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}

// Stats summary skeleton
export function StatsSummarySkeleton() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 bg-card min-w-[150px]">
          <div className="flex items-center gap-2 mb-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-24 mt-1" />
        </div>
      ))}
    </div>
  );
}

// Full page loading skeleton for campaign page
export function CampaignPageSkeleton() {
  return (
    <div className="h-full flex flex-col">
      {/* Header skeleton */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8" />
            <div>
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-56 mt-1" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
        </div>
      </div>
      
      {/* KPI Cards skeleton */}
      <div className="border-b px-6 py-4 bg-muted/20">
        <KPICardsSkeleton />
      </div>
      
      {/* Tabs skeleton */}
      <div className="border-b px-6">
        <div className="flex gap-4 h-12 items-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-32 rounded-md" />
          ))}
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="flex-1 overflow-hidden">
        <TableSkeleton rows={8} />
      </div>
    </div>
  );
}

// Add shimmer keyframe to global styles
export const shimmerKeyframes = `
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
`;

export { Skeleton };
