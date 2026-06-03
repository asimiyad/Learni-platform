"use client"

import Link from "next/link"
import { SiteLogo } from "@/components/SiteLogo"

export default function LoginPage() {
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
              background: "linear-gradient(135deg, rgba(0, 78, 198, 0.85) 0%, rgba(0, 101, 139, 0.7) 100%)",
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
              background: "rgba(104, 250, 221, 0.15)",
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
              background: "rgba(28, 189, 254, 0.15)",
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
                  background: "rgba(218, 225, 255, 0.15)",
                  border: "1px solid rgba(179, 197, 255, 0.3)",
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
              Empower your learning journey.
            </h1>
            <p className="text-body-lg" style={{ opacity: 0.9, maxWidth: 420 }}>
              Seamlessly connect with your academic community and track your progress with Learni's intuitive platform.
            </p>
          </div>
        </section>

        {/* Right Side: Role Selector */}
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
                Welcome Back
              </h1>
              <p className="text-body-md" style={{ color: "var(--on-surface-variant)" }}>
                Choose how you'd like to sign in
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Link href="/login/teacher" style={{ textDecoration: "none" }}>
                <div className="bg-surface p-6 rounded-2xl border border-outline-variant flex items-center gap-5 cursor-pointer ambient-glow hover:border-primary hover:-translate-y-1 transition-all duration-300 group">
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: "var(--primary-fixed)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 28, color: "var(--primary)" }}
                    >
                      school
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 className="text-headline-md" style={{ color: "var(--on-surface)", margin: 0, fontSize: 20 }}>
                      I'm a Teacher
                    </h2>
                    <p className="text-body-sm" style={{ color: "var(--on-surface-variant)", marginTop: 4 }}>
                      Manage subjects, create lessons, and track student progress.
                    </p>
                  </div>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "var(--primary)", fontSize: 20 }}
                  >
                    arrow_forward_ios
                  </span>
                </div>
              </Link>

              <Link href="/login/student" style={{ textDecoration: "none" }}>
                <div className="bg-surface p-6 rounded-2xl border border-outline-variant flex items-center gap-5 cursor-pointer ambient-glow hover:border-tertiary hover:-translate-y-1 transition-all duration-300 group">
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: "var(--tertiary-fixed)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 28, color: "var(--tertiary)" }}
                    >
                      psychology
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 className="text-headline-md" style={{ color: "var(--on-surface)", margin: 0, fontSize: 20 }}>
                      I'm a Student
                    </h2>
                    <p className="text-body-sm" style={{ color: "var(--on-surface-variant)", marginTop: 4 }}>
                      Explore lessons, earn points, and level up your knowledge!
                    </p>
                  </div>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "var(--tertiary)", fontSize: 20 }}
                  >
                    arrow_forward_ios
                  </span>
                </div>
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 24,
              paddingTop: 16,
            }}
          >
            <Link
              href="/register"
              className="text-label-sm"
              style={{ color: "var(--outline)", textDecoration: "none" }}
            >
              Don't have an account?{" "}
              <span style={{ color: "var(--primary)", fontWeight: 600 }}>Register</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
