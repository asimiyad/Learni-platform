"use client"

import { useState } from "react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

const TIMESLOTS = [
  "08:00 – 08:45",
  "08:45 – 09:30",
  "09:30 – 10:15",
  "10:15 – 10:45",
  "10:45 – 11:30",
  "11:30 – 12:15",
  "12:15 – 13:00",
]

const SCHEDULE: Record<string, { subject: string; teacher: string; room: string }[]> = {
  Monday: [
    { subject: "Mathematics", teacher: "Mr. Anderson", room: "Room 204" },
    { subject: "Science", teacher: "Ms. Chen", room: "Lab 3" },
    { subject: "English Literature", teacher: "Mrs. Davis", room: "Room 112" },
    { subject: "Break", teacher: "", room: "" },
    { subject: "History", teacher: "Mr. Brown", room: "Room 305" },
    { subject: "Physical Education", teacher: "Coach Taylor", room: "Sports Hall" },
    { subject: "Study Hall", teacher: "Mr. Wilson", room: "Library" },
  ],
  Tuesday: [
    { subject: "Science", teacher: "Ms. Chen", room: "Lab 3" },
    { subject: "Mathematics", teacher: "Mr. Anderson", room: "Room 204" },
    { subject: "Arabic Language", teacher: "Ms. Hassan", room: "Room 108" },
    { subject: "Break", teacher: "", room: "" },
    { subject: "Geography", teacher: "Mrs. Parker", room: "Room 302" },
    { subject: "Art", teacher: "Ms. Lee", room: "Art Studio" },
    { subject: "ICT", teacher: "Mr. Garcia", room: "Computer Lab" },
  ],
  Wednesday: [
    { subject: "English Literature", teacher: "Mrs. Davis", room: "Room 112" },
    { subject: "History", teacher: "Mr. Brown", room: "Room 305" },
    { subject: "Mathematics", teacher: "Mr. Anderson", room: "Room 204" },
    { subject: "Break", teacher: "", room: "" },
    { subject: "Science", teacher: "Ms. Chen", room: "Lab 3" },
    { subject: "Islamic Studies", teacher: "Mr. Ali", room: "Room 201" },
    { subject: "Study Hall", teacher: "Mr. Wilson", room: "Library" },
  ],
  Thursday: [
    { subject: "Geography", teacher: "Mrs. Parker", room: "Room 302" },
    { subject: "Arabic Language", teacher: "Ms. Hassan", room: "Room 108" },
    { subject: "Mathematics", teacher: "Mr. Anderson", room: "Room 204" },
    { subject: "Break", teacher: "", room: "" },
    { subject: "English Literature", teacher: "Mrs. Davis", room: "Room 112" },
    { subject: "Science", teacher: "Ms. Chen", room: "Lab 3" },
    { subject: "Physical Education", teacher: "Coach Taylor", room: "Sports Hall" },
  ],
  Friday: [
    { subject: "History", teacher: "Mr. Brown", room: "Room 305" },
    { subject: "Mathematics", teacher: "Mr. Anderson", room: "Room 204" },
    { subject: "Art", teacher: "Ms. Lee", room: "Art Studio" },
    { subject: "Break", teacher: "", room: "" },
    { subject: "Islamic Studies", teacher: "Mr. Ali", room: "Room 201" },
    { subject: "ICT", teacher: "Mr. Garcia", room: "Computer Lab" },
    { subject: "Study Hall", teacher: "Mr. Wilson", room: "Library" },
  ],
}

const SUBJECT_ICONS: Record<string, string> = {
  Mathematics: "calculate",
  Science: "science",
  "English Literature": "book",
  History: "history_edu",
  "Physical Education": "exercise",
  "Study Hall": "auto_stories",
  "Arabic Language": "translate",
  Geography: "explore",
  Art: "palette",
  "Islamic Studies": "mosque",
  ICT: "computer",
  Break: "coffee",
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "var(--primary)",
  Science: "var(--inverse-primary)",
  "English Literature": "var(--tertiary)",
  History: "var(--secondary)",
  "Physical Education": "var(--on-primary-fixed-variant)",
  "Study Hall": "var(--on-surface-variant)",
  "Arabic Language": "var(--primary-container)",
  Geography: "var(--tertiary-container)",
  Art: "var(--tertiary-fixed-dim)",
  "Islamic Studies": "var(--primary-fixed-dim)",
  ICT: "var(--secondary-container)",
  Break: "var(--outline-variant)",
}

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState("Monday")

  const todayIndex = new Date().getDay()
  const todayName = DAYS[todayIndex - 1]
  if (todayName && !activeDay) {
    // handled via state default
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ambient-glow">
        <div>
          <h2 className="text-headline-md font-headline-md text-on-background mb-1">Class Schedule</h2>
          <p className="text-body-main font-body-main text-on-secondary-container">Your weekly timetable at a glance</p>
        </div>
        <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-lg border border-outline-variant w-fit">
          <span className="material-symbols-outlined text-primary">today</span>
          <span className="text-lesson-title font-lesson-title text-sm text-on-background">
            Term 3, {new Date().getFullYear()}
          </span>
        </div>
      </section>

      {/* Day Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              activeDay === day
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-low border border-outline-variant text-on-secondary-container hover:border-primary hover:text-primary"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timetable */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant divide-y divide-outline-variant ambient-glow overflow-hidden">
        {TIMESLOTS.map((time, i) => {
          const entry = SCHEDULE[activeDay]?.[i]
          const isBreak = entry?.subject === "Break"
          const icon = entry ? SUBJECT_ICONS[entry.subject] || "menu_book" : "more_horiz"
          const color = entry ? SUBJECT_COLORS[entry.subject] || "var(--on-surface-variant)" : "var(--outline-variant)"

          return (
            <div
              key={time}
              className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-container-low ${
                isBreak ? "bg-surface-container opacity-60" : ""
              }`}
            >
              <div className="w-28 shrink-0">
                <span className="text-label-caps font-label-caps text-on-surface-variant">{time}</span>
              </div>
              {isBreak ? (
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>coffee</span>
                  <span className="text-sm font-medium">Break / Recess</span>
                </div>
              ) : entry ? (
                <>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${color}20` }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "20px", color }}>{icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lesson-title font-lesson-title text-sm text-on-background truncate">{entry.subject}</p>
                    <p className="text-xs text-on-secondary-container">{entry.teacher}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-on-surface-variant">
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>pin_drop</span>
                    <span className="text-xs font-medium">{entry.room}</span>
                  </div>
                </>
              ) : (
                <span className="text-sm text-outline">—</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary Card */}
      <div className="bg-surface-container-low rounded-xl border border-outline-variant p-5 ambient-glow">
        <div className="flex items-center gap-3 mb-3">
          <span className="material-symbols-outlined text-primary">summarize</span>
          <h3 className="text-lesson-title font-lesson-title text-sm text-on-background">Weekly Summary</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">Subjects</p>
            <p className="text-stat-value font-stat-value text-on-background">8</p>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">Class Periods</p>
            <p className="text-stat-value font-stat-value text-on-background">30</p>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">Study Halls</p>
            <p className="text-stat-value font-stat-value text-on-background">3</p>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">PE Sessions</p>
            <p className="text-stat-value font-stat-value text-on-background">2</p>
          </div>
        </div>
      </div>
    </div>
  )
}
