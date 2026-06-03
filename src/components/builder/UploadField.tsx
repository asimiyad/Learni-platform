"use client"

import { generateUploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthing"
import { X, FileType } from "lucide-react"

const UploadButton = generateUploadButton<OurFileRouter>()

interface UploadFieldProps {
  endpoint: keyof OurFileRouter
  onUpload: (url: string) => void
  currentUrl?: string | null
  acceptLabel?: string
}

export function UploadField({ endpoint, onUpload, currentUrl, acceptLabel }: UploadFieldProps) {
  return (
    <div className="space-y-2">
      {currentUrl ? (
        <div className="flex items-center gap-2 p-2 bg-indigo-50 border border-indigo-200 rounded-lg text-xs">
          <FileType className="h-4 w-4 text-indigo-500 shrink-0" />
          <span className="flex-1 truncate text-indigo-700">{currentUrl.split("/").pop() || "File uploaded"}</span>
          <button onClick={() => onUpload("")} className="p-0.5 rounded hover:bg-indigo-100 text-indigo-400 hover:text-red-500">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <UploadButton
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            if (res?.[0]?.url) onUpload(res[0].url)
          }}
          appearance={{
            button: "w-full !p-2 !text-xs !font-normal !rounded-lg !border !border-dashed !border-gray-300 !bg-transparent !text-gray-500 hover:!bg-gray-50 hover:!text-gray-700 !transition-colors !cursor-pointer !shadow-none !ring-0",
            allowedContent: "!text-[10px] !text-gray-400 !mt-1",
          }}
        />
      )}
      {acceptLabel && !currentUrl && <p className="text-[10px] text-gray-400">{acceptLabel}</p>}
    </div>
  )
}
