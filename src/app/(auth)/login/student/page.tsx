"use client"

import { LoginForm, DemoButton } from "../login-form"
import Link from "next/link"
import { SiteLogo } from "@/components/SiteLogo"

export default function StudentLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-surface-bright">
      <div className="absolute top-[-100px] left-[-80px] w-[320px] h-[320px] rounded-full opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle, var(--primary-fixed) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-80px] right-[-60px] w-[280px] h-[280px] rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, var(--tertiary-fixed) 0%, transparent 70%)" }} />

      <div className="w-full max-w-sm relative">
        <Link href="/login" className="inline-flex items-center gap-1 text-xs text-on-surface-variant no-underline mb-6 hover:text-primary transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Back
        </Link>

        <div className="text-center mb-7">
          <SiteLogo className="h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-3" color="var(--primary)" />
          <h1 className="text-xl sm:text-2xl font-bold text-on-background" style={{ margin: 0 }}>
            Welcome back!
          </h1>
          <p className="text-sm text-on-surface-variant mt-1.5">
            Sign in to continue your learning adventure
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {["Learn", "Earn Points", "Win Badges"].map((pill) => (
            <span
              key={pill}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full border"
              style={{
                background: "var(--primary-fixed)",
                borderColor: "var(--primary-fixed-dim)",
                color: "var(--on-primary-fixed-variant)",
              }}
            >
              {pill}
            </span>
          ))}
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 sm:p-7 shadow-sm">
          <div className="h-1 rounded-full mb-5" style={{ background: "linear-gradient(90deg, var(--primary-fixed) 0%, var(--primary) 50%, var(--primary-fixed) 100%)" }} />
          <LoginForm />

          <div className="mt-5 pt-5 border-t border-outline-variant">
            <p className="text-xs text-on-surface-variant mb-2 text-center font-medium">Demo Account</p>
            <DemoButton email="student@learni.edu" password="password123" label="Login as Demo Student" />
          </div>
        </div>

        <p className="text-center mt-4">
          <Link href="/register" className="text-xs text-on-surface-variant no-underline hover:text-primary transition-colors">
            New to Learni?{" "}
            <span className="text-primary font-semibold">Create an account</span>
          </Link>
        </p>
      </div>
    </div>
  )
}
