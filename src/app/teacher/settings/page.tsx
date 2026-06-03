"use client"

import { useState } from "react"
import { generateUploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthing"
import { toast } from "sonner"

const UploadButton = generateUploadButton<OurFileRouter>()

export default function SettingsPage() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!logoUrl) return
    setSaving(true)
    try {
      const res = await fetch("/api/teacher/logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: logoUrl }),
      })
      if (!res.ok) throw new Error("Failed to save")
      toast.success("Logo saved")
    } catch {
      toast.error("Failed to save logo")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 pb-4 border-b border-outline-variant">
        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-background">Settings</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Configure your platform preferences.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <h2 className="text-headline-md font-headline-md text-on-background mb-1">Site Logo</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Upload a logo to replace the "L" placeholder across the platform.
        </p>

        <div className="flex items-center gap-4 mb-4">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Preview"
              className="w-16 h-16 rounded-lg object-cover border border-outline-variant"
            />
          )}
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res?.[0]?.url) setLogoUrl(res[0].url)
            }}
            onUploadError={(err) => { toast.error(err.message) }}
          />
        </div>

        {logoUrl && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
          >
            {saving ? "Saving..." : "Save Logo"}
          </button>
        )}
      </div>
    </div>
  )
}
