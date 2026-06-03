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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--surface-bright)",
      }}
    >
      <main
        className="login-card-shadow"
        style={{
          width: "100%",
          maxWidth: 1200,
          height: 800,
          maxHeight: "90vh",
          background: "var(--surface-container-lowest)",
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          border: "1px solid var(--outline-variant)",
        }}
      >
        {/* Left Side: Hero */}
        <section
          className="hidden md:flex"
          style={{
            width: "50%",
            height: "100%",
            position: "relative",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 48,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(0,104,95,0.85) 0%, rgba(0,131,120,0.7) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 48,
              left: 48,
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "rgba(137,245,231,0.15)",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 120,
              right: 48,
              width: 128,
              height: 128,
              borderRadius: "50%",
              background: "rgba(107,216,203,0.15)",
              filter: "blur(40px)",
            }}
          />
          <div style={{ position: "relative", zIndex: 10, color: "#fff" }}>
            <div style={{ marginBottom: 24 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 14px",
                  borderRadius: 99,
                  background: "rgba(218,225,255,0.15)",
                  border: "1px solid rgba(179,197,255,0.3)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  className="material-symbols-outlined fill"
                  style={{ fontSize: 18, color: "#b3c5ff" }}
                >
                  auto_awesome
                </span>
                <span className="text-label-sm" style={{ color: "#dae1ff" }}>
                  Join 50k+ Educators & Students
                </span>
              </span>
            </div>
            <h1 className="text-headline-xl" style={{ marginBottom: 8 }}>
              Begin your learning journey.
            </h1>
            <p className="text-body-lg" style={{ opacity: 0.9, maxWidth: 420 }}>
              Create your account and unlock a world of interactive lessons, quizzes, and rewards.
            </p>
          </div>
        </section>

        {/* Right Side: Form */}
        <section
          className="md:w-1/2"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "24px 32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <SiteLogo className="h-8 w-8" color="var(--primary)" />
            <span className="text-headline-md" style={{ color: "var(--primary)", fontWeight: 700 }}>
              Learni
            </span>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              maxWidth: 400,
              margin: "0 auto",
              width: "100%",
            }}
          >
            <div style={{ marginBottom: 32 }}>
              <h1 className="text-headline-lg" style={{ color: "var(--on-surface)", marginBottom: 8 }}>
                Create Account
              </h1>
              <p className="text-body-md" style={{ color: "var(--on-surface-variant)" }}>
                Join Learni as a teacher or student
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div
                  style={{
                    background: "var(--error-container)",
                    border: "1px solid var(--error)",
                    color: "var(--on-error-container)",
                    padding: "10px 14px",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                >
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-6">
                {/* Name */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label className="text-label-md" style={{ color: "var(--on-surface)" }}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <span
                      className="material-symbols-outlined"
                      style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--outline)", fontSize: 18 }}
                    >person</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 38px",
                        background: "var(--surface-container-high)",
                        border: "2px solid transparent",
                        borderRadius: 10,
                        fontSize: 14,
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => { e.currentTarget.style.background = "var(--surface-container-lowest)"; e.currentTarget.style.borderColor = "var(--primary)" }}
                      onBlur={(e) => { e.currentTarget.style.background = "var(--surface-container-high)"; e.currentTarget.style.borderColor = "transparent" }}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label className="text-label-md" style={{ color: "var(--on-surface)" }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <span
                      className="material-symbols-outlined"
                      style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--outline)", fontSize: 18 }}
                    >mail</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 38px",
                        background: "var(--surface-container-high)",
                        border: "2px solid transparent",
                        borderRadius: 10,
                        fontSize: 14,
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => { e.currentTarget.style.background = "var(--surface-container-lowest)"; e.currentTarget.style.borderColor = "var(--primary)" }}
                      onBlur={(e) => { e.currentTarget.style.background = "var(--surface-container-high)"; e.currentTarget.style.borderColor = "transparent" }}
                      placeholder="name@school.edu"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label className="text-label-md" style={{ color: "var(--on-surface)" }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <span
                      className="material-symbols-outlined"
                      style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--outline)", fontSize: 18 }}
                    >lock</span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 38px",
                        background: "var(--surface-container-high)",
                        border: "2px solid transparent",
                        borderRadius: 10,
                        fontSize: 14,
                        outline: "none",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => { e.currentTarget.style.background = "var(--surface-container-lowest)"; e.currentTarget.style.borderColor = "var(--primary)" }}
                      onBlur={(e) => { e.currentTarget.style.background = "var(--surface-container-high)"; e.currentTarget.style.borderColor = "transparent" }}
                      placeholder="Min 6 characters"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                {/* Role */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label className="text-label-md" style={{ color: "var(--on-surface)" }}>I am a</label>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      type="button"
                      onClick={() => setRole("TEACHER")}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: role === "TEACHER" ? "2px solid var(--primary)" : "2px solid var(--outline-variant)",
                        background: role === "TEACHER" ? "var(--primary-fixed)" : "var(--surface-container-high)",
                        color: role === "TEACHER" ? "var(--on-primary-fixed-variant)" : "var(--on-surface-variant)",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>school</span>
                      Teacher
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("STUDENT")}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: role === "STUDENT" ? "2px solid var(--primary)" : "2px solid var(--outline-variant)",
                        background: role === "STUDENT" ? "var(--primary-fixed)" : "var(--surface-container-high)",
                        color: role === "STUDENT" ? "var(--on-primary-fixed-variant)" : "var(--on-surface-variant)",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
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
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "none",
                  background: loading ? "var(--primary-container)" : "var(--primary)",
                  color: loading ? "var(--on-primary-container)" : "var(--on-primary)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(0,104,95,0.2)",
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.9" }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity = "1" }}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

              <div style={{ textAlign: "center" }}>
                <a href="/login" className="text-label-sm" style={{ color: "var(--on-surface-variant)", textDecoration: "none" }}>
                  Already have an account?{" "}
                  <span style={{ color: "var(--primary)", fontWeight: 600 }}>Sign in</span>
                </a>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
