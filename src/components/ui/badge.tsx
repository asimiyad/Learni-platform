import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "purple" | "amber" | "gray"
  className?: string
}

const variants = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary-light text-primary",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  purple: "bg-purple-50 text-purple-700",
  amber: "bg-amber-50 text-amber-700",
  gray: "bg-gray-100 text-gray-600",
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("eyebrow inline-flex px-2.5 py-0.5 rounded-full", variants[variant], className)}>
      {children}
    </span>
  )
}
