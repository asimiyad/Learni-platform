"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export function DemoButton({ email, password, label }: { email: string; password: string; label: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDemoLogin() {
    setLoading(true)
    const result = await signIn("credentials", { email, password, redirect: false })
    if (result?.error) {
      setLoading(false)
      return
    }
    router.push("/")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleDemoLogin}
      disabled={loading}
      style={{
        width: "100%",
        padding: "10px 16px",
        borderRadius: 10,
        border: "1px solid var(--primary-fixed-dim)",
        background: "var(--primary-fixed)",
        color: "var(--on-primary-fixed-variant)",
        fontSize: 13,
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
      onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--primary-container)" }}
      onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--primary-fixed)" }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>preview</span>
      {loading ? "Signing in..." : label}
    </button>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label className="text-label-md" style={{ color: "var(--on-surface)" }}>Email Address</label>
        <div style={{ position: "relative" }}>
          <span
            className="material-symbols-outlined"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--outline)",
              fontSize: 18,
            }}
          >
            mail
          </span>
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
            onFocus={(e) => {
              e.currentTarget.style.background = "var(--surface-container-lowest)"
              e.currentTarget.style.borderColor = "var(--primary)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = "var(--surface-container-high)"
              e.currentTarget.style.borderColor = "transparent"
            }}
            placeholder="name@school.edu"
            required
          />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label className="text-label-md" style={{ color: "var(--on-surface)" }}>Password</label>
          <a href="#" className="text-label-sm" style={{ color: "var(--primary)", textDecoration: "none" }}>
            Forgot password?
          </a>
        </div>
        <div style={{ position: "relative" }}>
          <span
            className="material-symbols-outlined"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--outline)",
              fontSize: 18,
            }}
          >
            lock
          </span>
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
            onFocus={(e) => {
              e.currentTarget.style.background = "var(--surface-container-lowest)"
              e.currentTarget.style.borderColor = "var(--primary)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = "var(--surface-container-high)"
              e.currentTarget.style.borderColor = "transparent"
            }}
            placeholder="••••••••"
            required
          />
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
          boxShadow: "0 4px 12px rgba(0, 78, 198, 0.2)",
        }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.9" }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity = "1" }}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
      <div style={{ textAlign: "center" }}>
        <a href="/register" className="text-label-sm" style={{ color: "var(--on-surface-variant)", textDecoration: "none" }}>
          Don&apos;t have an account?{" "}
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>Register</span>
        </a>
      </div>
    </form>
  )
}
