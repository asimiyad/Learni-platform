"use client"

import { useEffect, useState } from "react"

interface ShopData {
  points: number
  spendablePoints: number
  couponAvailable: boolean
  couponPending: boolean
  couponApproved: boolean
  couponBarcode: string | null
  couponPointsCost: number
  termEligible: boolean
  termPending: boolean
  termApproved: boolean
  termRequirements: {
    points: { current: number; needed: number; met: boolean }
    streak: { current: number; needed: number; met: boolean }
    mastery: { current: number; needed: number; met: boolean }
  }
}

export default function ShopPage() {
  const [data, setData] = useState<ShopData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState("")

  const fetchShop = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/student/shop")
      const json = await res.json()
      setData(json)
    } catch {
      setError("Failed to load shop")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchShop() }, [])

  const requestCoupon = async () => {
    setActionLoading("coupon")
    try {
      const res = await fetch("/api/student/shop/coupon/request", { method: "POST" })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error ?? "Request failed")
      } else {
        fetchShop()
      }
    } catch {
      setError("Network error")
    } finally {
      setActionLoading("")
    }
  }

  const requestTermly = async () => {
    setActionLoading("termly")
    try {
      const res = await fetch("/api/student/shop/termly/request", { method: "POST" })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error ?? "Request failed")
      } else {
        fetchShop()
      }
    } catch {
      setError("Network error")
    } finally {
      setActionLoading("")
    }
  }

  if (loading) {
    return <div className="text-sm text-on-surface-variant">Loading shop...</div>
  }

  if (!data) {
    return <div className="text-sm text-on-surface-variant">{error || "Could not load shop"}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Points Balance Header */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-glow flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-label-caps font-label-caps text-secondary mb-2">CURRENT BALANCE</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-display-lg-mobile md:text-display-lg font-display-lg text-primary">{data.spendablePoints}</span>
            <span className="text-stat-value font-stat-value text-secondary">pts</span>
          </div>
        </div>
        <div className="flex-1 w-full max-w-md">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-secondary font-semibold">Progress to Grand Prize</span>
            <span className="text-primary font-bold">2,000 pts</span>
          </div>
          <div className="h-4 bg-secondary-container rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min(100, (data.points / 2000) * 100)}%` }}></div>
          </div>
          <p className="text-xs text-secondary mt-2 text-right">{2000 - data.points} pts to go!</p>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Rewards Grid */}
      <section>
        <h3 className="text-headline-md font-headline-md text-on-background mb-4">Available Rewards</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Canteen Coupon */}
          <article className="bg-surface-container-lowest rounded-xl border-2 border-primary-container p-6 ambient-glow flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary-container text-on-primary-container px-4 py-1 rounded-bl-lg font-bold text-sm">
              {data.couponPointsCost} pts
            </div>
            <div className="flex flex-col sm:flex-row gap-6 items-start h-full">
              <div className="w-full sm:w-1/3 aspect-square rounded-lg overflow-hidden shrink-0 bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "64px" }}>redeem</span>
              </div>
              <div className="flex flex-col flex-1 h-full justify-between">
                <div>
                  <h4 className="text-lesson-title font-lesson-title text-on-background mb-2">Canteen Lunch Voucher</h4>
                  <p className="text-sm text-secondary mb-4">Redeem for a free meal or 50% off at the school canteen. Valid for one week after purchase.</p>
                </div>
                <div className="mt-auto">
                  {data.couponApproved ? (
                    <div className="rounded-lg border border-success/20 bg-success/10 p-3 text-center">
                      <p className="text-sm font-medium text-success">Approved!</p>
                      {data.couponBarcode && (
                        <>
                          <p className="mt-2 text-xs text-secondary">Show this code at the canteen:</p>
                          <p className="mt-1 text-lg font-bold tracking-widest text-on-background" style={{ fontFamily: "monospace" }}>{data.couponBarcode}</p>
                        </>
                      )}
                    </div>
                  ) : data.couponPending ? (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center">
                      <p className="text-sm text-primary">Request sent to teacher</p>
                      <p className="mt-1 text-xs text-secondary">Waiting for approval</p>
                    </div>
                  ) : data.couponAvailable ? (
                    <div className="space-y-2">
                      <button
                        onClick={requestCoupon}
                        disabled={actionLoading === "coupon" || data.spendablePoints < data.couponPointsCost}
                        className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-primary-container transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {actionLoading === "coupon" ? "Sending..." : "Buy Reward"}
                      </button>
                      {data.spendablePoints < data.couponPointsCost && (
                        <p className="text-xs text-red-500">Need {data.couponPointsCost - data.spendablePoints} more spendable points</p>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-outline-variant bg-surface p-3 text-center">
                      <p className="text-xs text-secondary">Already purchased this month</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* Grand Prize */}
          <article className="bg-surface-container-lowest rounded-xl border-2 border-tertiary p-6 ambient-glow flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-tertiary text-on-tertiary px-4 py-1 rounded-bl-lg font-bold text-sm">2,000 pts</div>
            <div className="flex flex-col sm:flex-row gap-6 items-start h-full">
              <div className="w-full sm:w-1/3 aspect-square rounded-lg overflow-hidden shrink-0 bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary" style={{ fontSize: "64px" }}>workspace_premium</span>
              </div>
              <div className="flex flex-col flex-1 h-full">
                <div>
                  <h4 className="text-lesson-title font-lesson-title text-on-background mb-2">End of Term Grand Prize</h4>
                  <p className="text-sm text-secondary mb-4">Exclusive school merchandise pack and certificate of excellence.</p>
                  <div className="bg-surface rounded-lg p-4 mb-4 border border-outline-variant">
                    <h5 className="text-label-caps font-label-caps text-secondary mb-3 uppercase">REQUIREMENTS</h5>
                    <ul className="space-y-2">
                      {(["points", "streak", "mastery"] as const).map((key) => {
                        const req = data.termRequirements[key]
                        const labels: Record<string, string> = {
                          points: `${req.needed} points balance`,
                          streak: `${req.needed}-day login streak`,
                          mastery: `Complete ${req.needed} Mastery Lessons`,
                        }
                        return (
                          <li key={key} className="flex items-center gap-2 text-sm">
                            <span className={`material-symbols-outlined ${req.met ? "text-primary" : "text-outline"}`} style={{ fontSize: "18px" }}>
                              {req.met ? "check_circle" : "lock"}
                            </span>
                            <span className={req.met ? "text-outline line-through" : "text-on-surface-variant"}>{labels[key]}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
                <div className="mt-auto">
                  {data.termApproved ? (
                    <div className="rounded-lg border border-success/20 bg-success/10 p-3 text-center">
                      <p className="text-sm font-medium text-success">Approved!</p>
                      <p className="mt-1 text-xs text-secondary">Check with your teacher to redeem</p>
                    </div>
                  ) : data.termPending ? (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center">
                      <p className="text-sm text-primary">Request sent to teacher</p>
                      <p className="mt-1 text-xs text-secondary">Waiting for approval</p>
                    </div>
                  ) : (
                    <button
                      onClick={requestTermly}
                      disabled={!data.termEligible || actionLoading === "termly"}
                      className="w-full bg-surface-variant text-outline py-3 rounded-lg font-bold cursor-not-allowed flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined">lock</span>
                      {data.termEligible ? "Request Grand Prize" : "Locked"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
