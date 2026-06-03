import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: "sm" | "md" | "lg"
}

const paddings = {
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
}

export function Card({ children, className, hover = true, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "card-base",
        hover && "hover:border-border-hover hover:shadow-sm",
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardFeature({ children, className, padding = "lg" }: CardProps) {
  return (
    <div className={cn("card-feature", paddings[padding], className)}>
      {children}
    </div>
  )
}
