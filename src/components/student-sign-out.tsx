"use client"

import { signOut } from "next-auth/react"

export function StudentSignOut() {
  return (
    <button
      onClick={() => signOut()}
      className="rounded-lg px-2 sm:px-3 py-1.5 text-sm text-[var(--student-muted)] transition-colors hover:bg-[var(--student-surface-2)] hover:text-red-400"
      title="Sign out"
    >
      Sign Out
    </button>
  )
}
