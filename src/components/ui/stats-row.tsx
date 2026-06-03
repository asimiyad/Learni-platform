import { cn } from "@/lib/utils"

interface StatItem {
  number: string | number
  label: string
}

interface StatsRowProps {
  items: StatItem[]
  className?: string
  variant?: "light" | "dark"
}

export function StatsRow({ items, className, variant = "light" }: StatsRowProps) {
  return (
    <div className={cn("flex flex-wrap md:flex-nowrap", className)}>
      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 px-4 md:px-6 py-4",
            i > 0 && "border-t md:border-t-0 md:border-l",
            variant === "light" ? "border-border" : "border-white/20"
          )}
        >
          <p className={cn(
            "stat-number",
            variant === "dark" && "text-white"
          )}>
            {item.number}
          </p>
          <p className={cn(
            "stat-label",
            variant === "dark" && "text-white/70"
          )}>
            {item.label}
          </p>
        </div>
      ))}
    </div>
  )
}
