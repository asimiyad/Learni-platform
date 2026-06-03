"use client"

import { LoginForm, DemoButton } from "../login-form"
import Link from "next/link"
import { SiteLogo } from "@/components/SiteLogo"

export default function TeacherLoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-surface-bright">
      {/* Left form panel */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 bg-surface-container-lowest relative overflow-hidden order-2 md:order-1">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-[rgba(0,104,95,0.03)] blur-[60px] pointer-events-none" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] rounded-full bg-[rgba(107,216,203,0.05)] blur-[60px] pointer-events-none" />

        <div className="absolute top-6 left-6 md:top-10 md:left-12">
          <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors no-underline">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
            All Roles
          </Link>
        </div>

        <div className="w-full max-w-sm relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary-fixed flex items-center justify-center shadow-[0_4px_12px_rgba(107,216,203,0.2)] shrink-0">
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: "var(--primary)" }}>school</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-on-background" style={{ margin: 0 }}>
                Teacher Portal
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Welcome back, educator.
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-outline-variant p-6 md:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.02)]">
            <div className="h-1 rounded-full mb-6" style={{ background: "linear-gradient(90deg, var(--primary) 0%, var(--inverse-primary) 100%)" }} />
            <LoginForm />

            <div className="mt-5 pt-5 border-t border-outline-variant">
              <p className="text-xs text-on-surface-variant mb-2 text-center font-medium">Demo Account</p>
              <DemoButton email="teacher@learni.edu" password="password123" label="Login as Demo Teacher" />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-on-surface-variant">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 14 }}>verified_user</span>
            Secure login with 256-bit encryption
          </div>
        </div>
      </div>

      {/* Right decorative panel */}
      <div
        className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden order-1 md:order-2"
        style={{
          background: "linear-gradient(to bottom, rgba(0, 32, 29, 0.6), rgba(0, 32, 29, 0.9)), url('/teacher-bg.jpg?v=2')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full bg-[rgba(107,216,203,0.1)] pointer-events-none" />
        <div className="absolute bottom-20 left-[-40px] w-[220px] h-[220px] rounded-full bg-[rgba(255,255,255,0.04)] pointer-events-none" />
        <div className="absolute bottom-[-40px] right-10 w-[160px] h-[160px] rounded-full bg-[rgba(107,216,203,0.08)] pointer-events-none" />

        <div>
          <Link href="/login" className="no-underline">
            <div className="flex items-center gap-2.5">
              <SiteLogo className="h-10 w-10" color="#fff" />
              <span className="text-xl font-bold text-white">Learni</span>
            </div>
          </Link>
        </div>

        <div>
          <div className="w-10 h-[3px] rounded-full mb-6" style={{ background: "var(--inverse-primary)" }} />
          <p className="text-2xl md:text-3xl font-bold text-white leading-tight" style={{ margin: 0 }}>
            &ldquo;Teaching is the greatest act of optimism.&rdquo;
          </p>
          <p className="text-xs mt-4 text-white/70 tracking-wider">
            — Colleen Wilcox
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(107,216,203,0.3)]" style={{ background: "rgba(107,216,203,0.12)", width: "fit-content" }}>
          <span className="material-symbols-outlined text-sm" style={{ color: "var(--inverse-primary)" }}>school</span>
          <span className="text-xs tracking-wider font-medium" style={{ color: "var(--inverse-primary)" }}>
            TEACHER PORTAL
          </span>
        </div>
      </div>
    </div>
  )
}
