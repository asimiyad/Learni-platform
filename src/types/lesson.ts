export type LessonStatus = "DRAFT" | "PUBLISHED"

export interface Lesson {
  id: string
  title: string
  passThreshold?: number | null
  timeLimit?: number | null
  thumbnail?: string | null
  status: LessonStatus
  totalPoints: number
  estimatedDuration?: number | null
  blockGap: number
  teacherId: string
  subjectId: string
  createdAt: Date
  updatedAt: Date
}

export interface LessonWithSections extends Lesson {
  sections: import("./block").Section[]
}

export interface Subject {
  id: string
  name: string
  grade: number
  icon?: string | null
  teacherId: string
}
