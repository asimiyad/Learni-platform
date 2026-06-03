"use client"

import { useEffect, useState, useRef } from "react"
import { Loader2 } from "lucide-react"
import gsap from "gsap"

interface PendingCoupon {
  id: string
  studentId: string
  month: number
  year: number
  pointsCost: number
  student: { id: string; name: string | null; email: string }
  createdAt: string
}

interface PendingTermly {
  id: string
  studentId: string
  term: string
  student: { id: string; name: string | null; email: string }
  createdAt: string
}

interface Badge {
  id: string
  studentId: string
  title: string
  weekStart: string
  student: { id: string; name: string | null; email: string }
}

const BADGE_LABELS: Record<string, string> = {
  POINTS_CHAMPION: "Points Champion",
  ACCURACY_CHAMPION: "Accuracy Champion",
  PERSISTENCE_CHAMPION: "Persistence Champion",
  MOST_IMPROVED: "Most Improved",
}

export default function RewardsPage() {
  const [coupons, setCoupons] = useState<PendingCoupon[]>([])
  const [termly, setTermly] = useState<PendingTermly[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [weekLabel, setWeekLabel] = useState("")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [computeLoading, setComputeLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [rewardsRes, badgesRes] = await Promise.all([
        fetch("/api/teacher/rewards"),
        fetch("/api/teacher/badges"),
      ])
      const rewards = await rewardsRes.json()
      const badgesData = await badgesRes.json()
      setCoupons(rewards.coupons ?? [])
      setTermly(rewards.termly ?? [])
      setBadges(badgesData.badges ?? [])
      if (badgesData.weekStart) {
        const d = new Date(badgesData.weekStart)
        setWeekLabel(d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }))
      }
    } catch {
      setMessage("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    if (!loading && containerRef.current) {
      const sections = containerRef.current.querySelectorAll(".gsap-section")
      gsap.fromTo(sections, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" })
    }
  }, [loading])

  const approveCoupon = async (id: string) => {
    const res = await fetch(`/api/teacher/rewards/coupon/${id}/approve`, { method: "POST" })
    if (res.ok) fetchData()
    else setMessage("Failed to approve")
  }

  const rejectCoupon = async (id: string) => {
    const res = await fetch(`/api/teacher/rewards/coupon/${id}/reject`, { method: "POST" })
    if (res.ok) fetchData()
    else setMessage("Failed to reject")
  }

  const approveTermly = async (id: string) => {
    const res = await fetch(`/api/teacher/rewards/termly/${id}/approve`, { method: "POST" })
    if (res.ok) fetchData()
    else setMessage("Failed to approve")
  }

  const rejectTermly = async (id: string) => {
    const res = await fetch(`/api/teacher/rewards/termly/${id}/reject`, { method: "POST" })
    if (res.ok) fetchData()
    else setMessage("Failed to reject")
  }

  const computeBadges = async () => {
    setComputeLoading(true)
    setMessage("")
    try {
      const res = await fetch("/api/teacher/badges/compute", { method: "POST" })
      if (res.ok) {
        setMessage("Weekly badges computed!")
        fetchData()
      } else {
        const json = await res.json()
        setMessage(json.error ?? "Failed to compute badges")
      }
    } catch {
      setMessage("Network error")
    } finally {
      setComputeLoading(false)
    }
  }

  const printCertificates = () => {
    const win = window.open("", "_blank")
    if (!win) return
    const html = `<!DOCTYPE html>
<html><head><title>Weekly Badge Certificates</title>
<style>
  body { font-family: 'Georgia', serif; padding: 40px; }
  .certificate { border: 3px double #333; padding: 40px; margin-bottom: 40px; text-align: center; page-break-after: always; }
  h1 { font-size: 28px; margin-bottom: 8px; }
  .awarded { font-size: 18px; color: #666; margin: 16px 0; }
  .name { font-size: 36px; font-weight: bold; margin: 20px 0; }
  .badge { font-size: 24px; color: #b8860b; margin: 12px 0; }
  .date { font-size: 14px; color: #999; margin-top: 24px; }
</style></head><body>
${badges.map((b) => `
<div class="certificate">
  <h1>Certificate of Achievement</h1>
  <p class="awarded">Awarded to</p>
  <p class="name">${b.student.name ?? b.student.email}</p>
  <p class="badge">${BADGE_LABELS[b.title] || b.title}</p>
  <p class="date">Week of ${weekLabel}</p>
  <p style="margin-top:30px;font-size:13px;color:#666;">Presented by Learni &mdash; Keep learning!</p>
</div>`).join("\n")}
</body></html>`
    win.document.write(html)
    win.document.close()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-on-surface-variant">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p style={{ fontSize: 18 }}>Loading rewards data...</p>
      </div>
    )
  }

  return (
    <div ref={containerRef}>
      {/* Page Header */}
      <div className="gsap-section mb-6">
        <h2 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface">Rewards Management</h2>
        <p className="text-secondary mt-2">Approve student achievements and manage canteen coupons.</p>
      </div>

      {message && (
        <div className={`gsap-section mb-6 rounded-xl border p-4 text-sm flex items-center gap-3 ${
          message.includes("Failed") || message.includes("already") ? "border-red-500/20 bg-red-500/5 text-red-500" : "border-primary/40 bg-surface text-primary"
        }`}>
          <span className="material-symbols-outlined">{message.includes("Failed") || message.includes("already") ? "cancel" : "check_circle"}</span>
          <span className="font-medium">{message}</span>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Weekly Badges */}
        <div className="lg:col-span-4 space-y-4">
          <div className="gsap-section bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-ambient">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lesson-title font-lesson-title text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">emoji_events</span>
                Weekly Badges
              </h3>
            </div>
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={computeBadges}
                disabled={computeLoading}
                className="w-full bg-primary text-on-primary py-2.5 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50"
              >
                {computeLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Computing</>
                ) : (
                  <><span className="material-symbols-outlined">calculate</span> Compute Badges</>
                )}
              </button>
              {badges.length > 0 && (
                <button
                  onClick={printCertificates}
                  className="w-full bg-transparent text-primary border border-primary py-2.5 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined">print</span>
                  Print Certificates
                </button>
              )}
            </div>

            {badges.length === 0 ? (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-30 mb-3">emoji_events</span>
                <p className="text-sm font-medium text-on-surface">No badges awarded yet</p>
                <p className="text-xs mt-1 text-on-surface-variant">Click compute to automatically recognize top students.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="text-label-caps font-label-caps text-secondary uppercase tracking-wider">Preview (Top Earners)</h4>
                {badges.slice(0, 3).map((b) => (
                  <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant/50 bg-surface">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined fill">stars</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-on-surface truncate">{b.student.name ?? b.student.email}</p>
                      <p className="text-sm text-secondary truncate">{BADGE_LABELS[b.title] || b.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Requests Tables */}
        <div className="lg:col-span-8 space-y-4">
          {/* Coupon Requests */}
          <div className="gsap-section bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient overflow-hidden">
            <div className="p-6 border-b border-outline-variant bg-surface">
              <h3 className="text-lesson-title font-lesson-title text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_pizza</span>
                Canteen Coupon Requests
              </h3>
              <p className="text-sm text-secondary mt-1">Pending standard reward redemptions.</p>
            </div>
            {coupons.length === 0 ? (
              <div className="p-10 text-center border border-dashed border-outline-variant m-4 rounded-xl">
                <p className="text-sm text-secondary">All caught up! No pending requests.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-secondary text-label-caps font-label-caps uppercase">
                      <th className="px-6 py-4 font-bold border-b border-outline-variant/50">Student</th>
                      <th className="px-6 py-4 font-bold border-b border-outline-variant/50">Current Points</th>
                      <th className="px-6 py-4 font-bold border-b border-outline-variant/50">Date</th>
                      <th className="px-6 py-4 font-bold border-b border-outline-variant/50 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {coupons.map((c) => (
                      <tr key={c.id} className="hover:bg-surface-bright transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                              {(c.student.name ?? c.student.email)[0].toUpperCase()}
                            </div>
                            <span className="font-semibold text-on-surface">{c.student.name ?? c.student.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-stat-value font-stat-value text-primary">{c.pointsCost}</td>
                        <td className="px-6 py-4 text-secondary text-sm">{new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => rejectCoupon(c.id)} className="px-3 py-1.5 rounded bg-transparent border border-outline text-secondary hover:bg-surface-container hover:text-on-surface transition-colors text-sm font-bold">Reject</button>
                            <button onClick={() => approveCoupon(c.id)} className="px-3 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container transition-colors text-sm font-bold">Approve</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Grand Prize Requests */}
          <div className="gsap-section bg-surface-container-lowest rounded-xl border-2 border-tertiary/20 shadow-ambient overflow-hidden">
            <div className="p-6 border-b border-tertiary/20 bg-tertiary-fixed/30">
              <h3 className="text-lesson-title font-lesson-title text-tertiary flex items-center gap-2">
                <span className="material-symbols-outlined fill">diamond</span>
                Grand Prize Requests
              </h3>
              <p className="text-sm text-on-surface-variant mt-1">High-value physical rewards requiring administrative review.</p>
            </div>
            {termly.length === 0 ? (
              <div className="p-10 text-center border border-dashed border-outline-variant m-4 rounded-xl">
                <p className="text-sm text-secondary">No grand prize requests yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-secondary text-label-caps font-label-caps uppercase">
                      <th className="px-6 py-4 font-bold border-b border-outline-variant/50">Student</th>
                      <th className="px-6 py-4 font-bold border-b border-outline-variant/50">Requested Item</th>
                      <th className="px-6 py-4 font-bold border-b border-outline-variant/50">Points</th>
                      <th className="px-6 py-4 font-bold border-b border-outline-variant/50 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {termly.map((t) => (
                      <tr key={t.id} className="hover:bg-tertiary-fixed/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold text-sm">
                              {(t.student.name ?? t.student.email)[0].toUpperCase()}
                            </div>
                            <span className="font-semibold text-on-surface">{t.student.name ?? t.student.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tertiary-fixed text-on-tertiary-fixed-variant">
                            Term {t.term} Completion Reward
                          </span>
                        </td>
                        <td className="px-6 py-4 text-stat-value font-stat-value text-tertiary">2,000</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => rejectTermly(t.id)} className="px-3 py-1.5 rounded bg-transparent border border-outline text-secondary hover:bg-surface-container hover:text-on-surface transition-colors text-sm font-bold">Reject</button>
                            <button onClick={() => approveTermly(t.id)} className="px-3 py-1.5 rounded bg-tertiary text-on-tertiary hover:bg-tertiary-container hover:text-on-tertiary-container transition-colors text-sm font-bold shadow-sm">Approve</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
