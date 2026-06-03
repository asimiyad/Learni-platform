import { DashboardStatsSkeleton } from "@/components/ui/skeleton"

export default function StudentDashboardLoading() {
  return (
    <div>
      <div className="mb-8 rounded-2xl border-2 border-[var(--outline)] p-7" style={{ background: "var(--surface-container-lowest)" }}>
        <div className="h-7 w-48 skeleton-shimmer rounded-md" />
        <div className="h-4 w-72 skeleton-shimmer rounded-md mt-2" />
        <div className="h-7 w-40 skeleton-shimmer rounded-full mt-3" />
      </div>
      <DashboardStatsSkeleton />
    </div>
  )
}
