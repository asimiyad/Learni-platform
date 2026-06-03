"use client"

import { LoginForm, DemoButton } from "../login-form"
import Link from "next/link"
import { SiteLogo } from "@/components/SiteLogo"

export default function StudentLoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
        background: "var(--surface-bright)",
      }}
    >
      {/* Decorative background */}
      <div style={{ position: "absolute", top: -100, left: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, var(--primary-fixed) 0%, transparent 70%)", opacity: 0.4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, var(--tertiary-fixed) 0%, transparent 70%)", opacity: 0.15, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative" }}>
        <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--on-surface-variant)", textDecoration: "none", marginBottom: 24 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Back
        </Link>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <SiteLogo className="h-16 w-16 mx-auto mb-3" color="var(--primary)" />
          <h1 className="text-headline-lg" style={{ color: "var(--on-surface)", margin: 0 }}>
            Welcome back!
          </h1>
          <p className="text-body-md" style={{ marginTop: 6, color: "var(--on-surface-variant)" }}>
            Sign in to continue your learning adventure
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {["Learn", "Earn Points", "Win Badges"].map((pill) => (
            <span
              key={pill}
              className="text-label-sm"
              style={{
                padding: "5px 14px",
                borderRadius: 99,
                background: "var(--primary-fixed)",
                border: "1.5px solid var(--primary-fixed-dim)",
                color: "var(--on-primary-fixed-variant)",
              }}
            >
              {pill}
            </span>
          ))}
        </div>

        <div className="bento-card" style={{ padding: "32px 28px" }}>
          <div style={{ height: 4, borderRadius: 99, background: "linear-gradient(90deg, var(--primary-fixed) 0%, var(--primary) 50%, var(--primary-fixed) 100%)", marginBottom: 24 }} />
          <LoginForm />

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--outline-variant)" }}>
            <p className="text-label-sm" style={{ color: "var(--on-surface-variant)", marginBottom: 8, textAlign: "center" }}>Demo Account</p>
            <DemoButton email="student@learni.edu" password="password123" label="Login as Demo Student" />
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/register" className="text-label-sm" style={{ color: "var(--on-surface-variant)", textDecoration: "none" }}>
            New to Learni?{" "}
            <span style={{ color: "var(--primary)", fontWeight: 600 }}>Create an account</span>
          </Link>
        </p>
      </div>
    </div>
  )
}
