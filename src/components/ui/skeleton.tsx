import { cn } from "@/lib/utils"

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-sm bg-[var(--surface-container-high)] animate-pulse", className)}
      {...props}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <div className="mt-auto pt-4 border-t border-[var(--outline-variant)]">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex gap-3 mt-2">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  )
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-xl p-4 flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  )
}

export function SubjectCardSkeleton() {
  return (
    <div className="bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-xl p-6">
      <div className="flex items-start justify-between mb-8">
        <Skeleton className="h-14 w-14 rounded-lg" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  )
}
