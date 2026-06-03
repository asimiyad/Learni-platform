"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm",
  secondary: "bg-muted text-card-foreground hover:bg-border",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  outline: "bg-transparent text-foreground border border-border hover:bg-muted hover:border-border-hover",
  dark: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
  white: "bg-white text-primary hover:bg-white/90 shadow-sm",
}

const sizes = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2 gap-2",
  lg: "text-base px-6 py-2.5 gap-2",
  xl: "text-lg px-7 py-3 gap-2.5",
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
  icon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium leading-6 rounded-sm no-underline press cursor-pointer whitespace-nowrap",
          "disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          icon && !children && "p-2",
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        {children && <span>{children}</span>}
      </button>
    )
  }
)
Button.displayName = "Button"

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  icon?: React.ReactNode
}

export function ButtonLink({ className, variant = "primary", size = "md", icon, children, ...props }: ButtonLinkProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center font-medium leading-6 rounded-sm no-underline press cursor-pointer whitespace-nowrap",
        variants[variant],
        sizes[size],
        icon && !children && "p-2",
        className
      )}
      {...props}
    >
      {icon}
      {children && <span>{children}</span>}
    </a>
  )
}

export function IconButton({ className, variant = "ghost", size = "md", ...props }: ButtonProps) {
  return <Button variant={variant} size={size} className={cn("p-2", className)} {...props} />
}
