"use client"

import { useEffect, useState } from "react"

interface SiteLogoProps {
  className?: string
  color?: string
  fallbackStyle?: React.CSSProperties
  textStyle?: React.CSSProperties
}

export function SiteLogo({ className, color, fallbackStyle, textStyle }: SiteLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/teacher/logo")
      .then((r) => r.json())
      .then((data) => {
        if (data.url) setLogoUrl(data.url)
      })
      .catch(() => {})
  }, [])

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Learni"
        className={className}
        style={{ objectFit: "contain", ...fallbackStyle }}
      />
    )
  }

  return (
    <div
      className={className}
      style={{
        width: 34,
        height: 34,
        borderRadius: 8,
        background: color || "var(--primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', Georgia, serif",
          color: "#fff",
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 1,
          ...textStyle,
        }}
      >
        L
      </span>
    </div>
  )
}
