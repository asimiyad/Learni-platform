"use client"

import { forwardRef, type ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

type PhosphorWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
type PhosphorIconComponent = React.ForwardRefExoticComponent<
  ComponentPropsWithoutRef<"svg"> & {
    alt?: string
    color?: string
    size?: number | string
    weight?: PhosphorWeight
    mirrored?: boolean
    children?: React.ReactNode
    weights?: Record<string, React.ReactNode>
  } & React.RefAttributes<SVGSVGElement>
>

interface PhosphorIconProps {
  icon: PhosphorIconComponent
  size?: number | string
  color?: string
  weight?: PhosphorWeight
  mirrored?: boolean
  className?: string
}

export function PhosphorIcon({
  icon: Icon,
  size = "1em",
  color = "currentColor",
  weight = "regular",
  mirrored = false,
  className,
}: PhosphorIconProps) {
  return (
    <Icon
      size={size}
      color={color}
      weight={weight}
      mirrored={mirrored}
      className={cn("inline-block shrink-0", className)}
    />
  )
}

export { PhosphorIcon as PI }
