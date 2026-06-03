"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SiteLogo } from "@/components/SiteLogo"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"TEACHER" | "STUDENT">("TEACHER")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Registration failed")
      setLoading(false)
      return
    }

    router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-surface-bright">
      <main className="w-full max-w-[1200px] bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden flex flex-col md:flex-row shadow-sm" style={{ maxHeight: "90vh" }}>
        {/* Left Side: Hero */}
        <section className="hidden md:flex w-1/2 relative flex-col justify-end p-12 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,104,95,0.85) 0%, rgba(0,131,120,0.7) 100%)" }} />
          <div className="absolute top-12 left-12 w-24 h-24 rounded-full blur-[40px]" style={{ background: "rgba(137,245,231,0.15)" }} />
          <div className="absolute bottom-[120px] right-12 w-32 h-32 rounded-full blur-[40px]" style={{ background: "rgba(107,216,203,0.15)" }} />
          <div className="relative z-10 text-white">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border" style={{ background: "rgba(218,225,255,0.15)", borderColor: "rgba(179,197,255,0.3)" }}>
                <span className="material-symbols-outlined fill text-sm" style={{ color: "#b3c5ff" }}>auto_awesome</span>
                <span style={{ color: "#dae1ff" }}>Join 50k+ Educators & Students</span>
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Begin your learning journey.</h1>
            <p className="text-sm opacity-90 max-w-xs">Create your account and unlock a world of interactive lessons, quizzes, and rewards.</p>
          </div>
        </section>

        {/* Right Side: Form */}
        <section className="w-full md:w-1/2 flex flex-col p-6 sm:p-8 md:p-10 overflow-y-auto">
          <div className="flex items-center gap-2.5 mb-8">
            <SiteLogo className="h-7 w-7 sm:h-8 sm:w-8" color="var(--primary)" />
            <span className="text-lg font-bold text-primary">Learni</span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-on-background mb-1">Create Account</h1>
              <p className="text-sm text-on-surface-variant">Join Learni as a teacher or student</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
              {error && (
                <div className="text-sm px-3 py-2 rounded-lg" style={{ background: "var(--error-container)", border: "1px solid var(--error)", color: "var(--on-error-container)" }}>
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4 sm:gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-background">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: 18 }}>person</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                      style={{ background: "var(--surface-container-high)", border: "2px solid transparent" }}
                      onFocus={(e) => { e.currentTarget.style.background = "var(--surface-container-lowest)"; e.currentTarget.style.borderColor = "var(--primary)" }}
                      onBlur={(e) => { e.currentTarget.style.background = "var(--surface-container-high)"; e.currentTarget.style.borderColor = "transparent" }}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-background">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: 18 }}>mail</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                      style={{ background: "var(--surface-container-high)", border: "2px solid transparent" }}
                      onFocus={(e) => { e.currentTarget.style.background = "var(--surface-container-lowest)"; e.currentTarget.style.borderColor = "var(--primary)" }}
                      onBlur={(e) => { e.currentTarget.style.background = "var(--surface-container-high)"; e.currentTarget.style.borderColor = "transparent" }}
                      placeholder="name@school.edu"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-background">Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: 18 }}>lock</span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                      style={{ background: "var(--surface-container-high)", border: "2px solid transparent" }}
                      onFocus={(e) => { e.currentTarget.style.background = "var(--surface-container-lowest)"; e.currentTarget.style.borderColor = "var(--primary)" }}
                      onBlur={(e) => { e.currentTarget.style.background = "var(--surface-container-high)"; e.currentTarget.style.borderColor = "transparent" }}
                      placeholder="Min 6 characters"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-background">I am a</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("TEACHER")}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        border: role === "TEACHER" ? "2px solid var(--primary)" : "2px solid var(--outline-variant)",
                        background: role === "TEACHER" ? "var(--primary-fixed)" : "var(--surface-container-high)",
                        color: role === "TEACHER" ? "var(--on-primary-fixed-variant)" : "var(--on-surface-variant)",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>school</span>
                      Teacher
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("STUDENT")}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        border: role === "STUDENT" ? "2px solid var(--primary)" : "2px solid var(--outline-variant)",
                        background: role === "STUDENT" ? "var(--primary-fixed)" : "var(--surface-container-high)",
                        color: role === "STUDENT" ? "var(--on-primary-fixed-variant)" : "var(--on-surface-variant)",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>psychology</span>
                      Student
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-semibold border-none transition-all disabled:opacity-50"
                style={{
                  background: loading ? "var(--primary-container)" : "var(--primary)",
                  color: loading ? "var(--on-primary-container)" : "var(--on-primary)",
                  boxShadow: "0 4px 12px rgba(0,104,95,0.2)",
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.9" }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity = "1" }}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <div className="text-center">
                <a href="/login" className="text-xs text-on-surface-variant no-underline hover:text-primary transition-colors">
                  Already have an account?{" "}
                  <span className="text-primary font-semibold">Sign in</span>
                </a>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
