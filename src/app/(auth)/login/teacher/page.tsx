"use client"

import { LoginForm } from "../login-form"
import Link from "next/link"
import { SiteLogo } from "@/components/SiteLogo"

export default function TeacherLoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "var(--surface-bright)",
      }}
    >
      {/* Left form panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 40px",
          background: "var(--surface-container-lowest)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Subtle background decoration */}
        <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(0,104,95,0.03)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -50, right: -50, width: 300, height: 300, borderRadius: "50%", background: "rgba(107,216,203,0.05)", filter: "blur(60px)", pointerEvents: "none" }} />

        {/* Top-left absolute header */}
        <div style={{ position: "absolute", top: 40, left: 48 }}>
          <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" style={{ textDecoration: "none" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
            All Roles
          </Link>
        </div>

        <div style={{ width: "100%", maxWidth: 380, position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: "var(--primary-fixed)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(107,216,203,0.2)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: "var(--primary)" }}>school</span>
            </div>
            <div>
              <h1 className="text-headline-lg" style={{ color: "var(--on-surface)", margin: 0, fontSize: 28, fontWeight: 700 }}>
                Teacher Portal
              </h1>
              <p className="text-body-md" style={{ color: "var(--on-surface-variant)", marginTop: 4 }}>
                Welcome back, educator.
              </p>
            </div>
          </div>

          <div className="bento-card bg-surface" style={{ padding: "32px 28px", borderRadius: 20, border: "1px solid var(--outline-variant)", boxShadow: "0 8px 24px rgba(0,0,0,0.02)" }}>
            <div style={{ height: 4, background: "linear-gradient(90deg, var(--primary) 0%, var(--inverse-primary) 100%)", borderRadius: 99, marginBottom: 24 }} />
            <LoginForm />
          </div>

          <div style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--on-surface-variant)", fontSize: 13, fontWeight: 500 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--primary)" }}>verified_user</span>
            Secure login with 256-bit encryption
          </div>
        </div>
      </div>

      {/* Right decorative panel */}
      <div
        className="flex"
        style={{
          background: "linear-gradient(to bottom, rgba(0, 32, 29, 0.6), rgba(0, 32, 29, 0.9)), url('/teacher-bg.jpg?v=2')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 52px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(107,216,203,0.1)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 80, left: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, right: 40, width: 160, height: 160, borderRadius: "50%", background: "rgba(107,216,203,0.08)", pointerEvents: "none" }} />

        <div>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <div className="flex items-center gap-2.5">
              <SiteLogo className="h-10 w-10" color="#fff" />
              <span className="text-headline-md" style={{ color: "#fff", fontWeight: 700 }}>Learni</span>
            </div>
          </Link>
        </div>

        <div>
          <div style={{ width: 40, height: 3, background: "var(--inverse-primary)", borderRadius: 99, marginBottom: 24 }} />
          <p className="text-headline-lg" style={{ color: "#fff", lineHeight: 1.3, margin: 0 }}>
            &ldquo;Teaching is the greatest act of optimism.&rdquo;
          </p>
          <p className="text-label-sm" style={{ marginTop: 16, color: "rgba(255,255,255,0.7)", letterSpacing: "0.04em" }}>
            — Colleen Wilcox
          </p>
        </div>

        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 99, background: "rgba(107,216,203,0.12)", border: "1px solid rgba(107,216,203,0.3)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--inverse-primary)" }}>school</span>
            <span className="text-label-sm" style={{ color: "var(--inverse-primary)", letterSpacing: "0.06em" }}>
              TEACHER PORTAL
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
