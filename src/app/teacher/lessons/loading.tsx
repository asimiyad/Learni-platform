import { CardSkeleton } from "@/components/ui/skeleton"

export default function LessonsLoading() {
  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-outline-variant gap-4">
        <div>
          <div className="h-9 w-40 skeleton-shimmer rounded-md" />
          <div className="h-4 w-64 skeleton-shimmer rounded-md mt-2" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
