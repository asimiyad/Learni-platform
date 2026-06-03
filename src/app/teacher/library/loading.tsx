import { CardSkeleton } from "@/components/ui/skeleton"

export default function LibraryLoading() {
  return (
    <div>
      <div className="h-9 w-40 skeleton-shimmer rounded-md mb-2" />
      <div className="h-4 w-56 skeleton-shimmer rounded-md mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
