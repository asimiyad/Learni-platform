import { SubjectCardSkeleton } from "@/components/ui/skeleton"

export default function SubjectsLoading() {
  return (
    <div className="min-h-full">
      <div className="flex flex-col md:flex-row items-end justify-between mb-8 pb-6 border-b border-border gap-6">
        <div>
          <div className="h-9 w-60 skeleton-shimmer rounded-md" />
          <div className="h-5 w-72 skeleton-shimmer rounded-md mt-2" />
        </div>
        <div className="h-11 w-36 skeleton-shimmer rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SubjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
