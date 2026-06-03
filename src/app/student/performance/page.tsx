"use client"

import { useState, useEffect, useRef } from "react"

interface SubjectGrade {
  subject: string
  grade: string
  score: number
  maxScore: number
  trend: "up" | "down" | "stable"
  color: string
}

const SUBJECT_GRADES: SubjectGrade[] = [
  { subject: "Mathematics", grade: "A-", score: 88, maxScore: 100, trend: "up", color: "var(--primary)" },
  { subject: "Science", grade: "B+", score: 82, maxScore: 100, trend: "up", color: "var(--inverse-primary)" },
  { subject: "English Literature", grade: "A", score: 93, maxScore: 100, trend: "stable", color: "var(--tertiary)" },
  { subject: "History", grade: "B", score: 76, maxScore: 100, trend: "down", color: "var(--secondary)" },
  { subject: "Arabic Language", grade: "A-", score: 87, maxScore: 100, trend: "up", color: "var(--primary-container)" },
  { subject: "Geography", grade: "B+", score: 83, maxScore: 100, trend: "stable", color: "var(--tertiary-container)" },
  { subject: "Islamic Studies", grade: "A", score: 95, maxScore: 100, trend: "stable", color: "var(--primary-fixed-dim)" },
  { subject: "ICT", grade: "A-", score: 90, maxScore: 100, trend: "up", color: "var(--secondary-container)" },
  { subject: "Physical Education", grade: "B", score: 78, maxScore: 100, trend: "down", color: "var(--on-primary-fixed-variant)" },
  { subject: "Art", grade: "A", score: 92, maxScore: 100, trend: "up", color: "var(--tertiary-fixed-dim)" },
]

const WEEKLY_SCORES = [72, 75, 80, 78, 85, 88, 84, 90, 92, 95, 91, 94]

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(false)

  useEffect(() => {
    if (ref.current) return
    ref.current = true
    let start = 0
    const duration = 1000
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value])

  return <>{display}{suffix}</>
}

export default function PerformancePage() {
  const totalScore = Math.round(SUBJECT_GRADES.reduce((acc, s) => acc + s.score, 0) / SUBJECT_GRADES.length)
  const maxScore = 100
  const avgGrade = totalScore >= 90 ? "A" : totalScore >= 80 ? "B+" : totalScore >= 70 ? "B" : "C"

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ambient-glow">
        <div>
          <h2 className="text-headline-md font-headline-md text-on-background mb-1">Performance Overview</h2>
          <p className="text-body-main font-body-main text-on-secondary-container">Track your grades, progress, and academic trends</p>
        </div>
        <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-lg border border-outline-variant w-fit">
          <span className="material-symbols-outlined text-primary">calendar_month</span>
          <span className="text-lesson-title font-lesson-title text-sm text-on-background">Term 3 Report</span>
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant flex flex-col gap-3 ambient-glow">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-1">Overall Average</p>
            <p className="text-stat-value font-stat-value text-on-background"><AnimatedNumber value={totalScore} suffix="%" /></p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant flex flex-col gap-3 ambient-glow">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined">grade</span>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-1">Overall Grade</p>
            <p className="text-stat-value font-stat-value text-on-background">{avgGrade}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant flex flex-col gap-3 ambient-glow">
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-1">Trend</p>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-success" style={{ fontSize: "18px" }}>arrow_upward</span>
              <p className="text-stat-value font-stat-value text-success">+12%</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant flex flex-col gap-3 ambient-glow">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined">assignment</span>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-1">Subjects</p>
            <p className="text-stat-value font-stat-value text-on-background">{SUBJECT_GRADES.length}</p>
          </div>
        </div>
      </section>

      {/* Weekly Trend Chart + Subject Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-glow">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lesson-title font-lesson-title text-on-background">Weekly Performance Trend</h3>
            <span className="text-label-caps font-label-caps text-on-surface-variant">This Term</span>
          </div>
          <div className="flex items-end gap-2" style={{ height: "160px" }}>
            {WEEKLY_SCORES.map((score, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-label-caps font-label-caps text-[9px] text-on-surface-variant">{score}%</span>
                <div
                  className="w-full rounded-t-md transition-all duration-500 ease-out hover:opacity-80"
                  style={{
                    height: `${(score / maxScore) * 100}%`,
                    background: score >= 90 ? "var(--primary)" : score >= 80 ? "var(--inverse-primary)" : score >= 70 ? "var(--secondary-container)" : "var(--tertiary-fixed-dim)",
                    minHeight: "8px",
                  }}
                />
                <span className="text-label-caps font-label-caps text-[9px] text-on-surface-variant">W{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-glow">
          <h3 className="text-lesson-title font-lesson-title text-on-background mb-4">Subject Breakdown</h3>
          <div className="flex flex-col gap-4">
            {SUBJECT_GRADES.map((s) => (
              <div key={s.subject} className="flex items-center gap-3">
                <div className="w-2 h-8 rounded-full shrink-0" style={{ background: s.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-on-background truncate">{s.subject}</span>
                    <span className="text-label-caps font-label-caps text-xs text-on-surface-variant">{s.grade}</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary-container rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(s.score / s.maxScore) * 100}%`, background: s.color }} />
                  </div>
                </div>
                <div className="flex items-center gap-0.5 w-6 shrink-0">
                  {s.trend === "up" ? (
                    <span className="material-symbols-outlined text-success" style={{ fontSize: "16px" }}>arrow_upward</span>
                  ) : s.trend === "down" ? (
                    <span className="material-symbols-outlined text-tertiary" style={{ fontSize: "16px" }}>arrow_downward</span>
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "16px" }}>horizontal_rule</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Subjects Card */}
      <div className="bg-primary rounded-xl p-6 text-on-primary relative overflow-hidden ambient-glow">
        <div className="absolute -right-6 -bottom-6 opacity-10">
          <span className="material-symbols-outlined" style={{ fontSize: "120px" }}>emoji_events</span>
        </div>
        <div className="relative z-10">
          <h3 className="text-lesson-title font-lesson-title mb-3">Top Performing Subjects</h3>
          <div className="flex flex-wrap gap-3">
            {SUBJECT_GRADES.filter((s) => s.score >= 90).map((s) => (
              <div
                key={s.subject}
                className="flex items-center gap-2 bg-white/15 rounded-lg px-4 py-2 backdrop-blur-sm"
              >
                <span className="text-label-caps font-label-caps text-on-primary">{s.subject}</span>
                <span className="font-bold">{s.grade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
