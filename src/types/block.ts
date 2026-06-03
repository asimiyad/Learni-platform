export type BlockType =
  | "VIDEO"
  | "IMAGE"
  | "RICH_TEXT"
  | "PDF"
  | "AUDIO"
  | "QUOTE"
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "FILL_BLANK"
  | "ORDERING"
  | "MATCHING"
  | "DRAWING"
  | "HOMEWORK_UPLOAD"
  | "SECTION_DIVIDER"
  | "CONDITIONAL_LOCK"
  | "BONUS_POINTS"

export interface VideoConfig {
  sourceType: "youtube" | "upload"
  url?: string
  fileId?: string
  startTime?: number
  endTime?: number
  forceWatch?: boolean
  thumbnail?: string
}

export interface ImageConfig {
  fileId?: string
  url?: string
  altText?: string
  hotspots?: Array<{ x: number; y: number; label: string }>
}

export interface RichTextConfig {
  content: string
}

export interface PdfConfig {
  fileId: string
  pageRange?: string
}

export interface AudioConfig {
  sourceType: "upload" | "recording"
  fileId?: string
}

export interface QuoteConfig {
  text: string
  attribution: string
  style?: "modern" | "classic"
}

export interface MultipleChoiceConfig {
  question: string
  options: Array<{
    id: string
    text: string
    isCorrect: boolean
    feedback?: string
  }>
  points: number
  allowRetry?: boolean
  retryReducedPoints?: number
}

export interface TrueFalseConfig {
  statement: string
  correctAnswer: boolean
  feedbackCorrect?: string
  feedbackIncorrect?: string
  points: number
}

export interface FillBlankConfig {
  sentenceWithBlanks: string
  blanks: Array<{
    placeholderIndex: number
    acceptedAnswers: string[]
  }>
  points: number
}

export interface OrderingConfig {
  instruction: string
  items: Array<{
    id: string
    text: string
    correctOrder: number
  }>
  points: number
}

export interface MatchingConfig {
  instruction: string
  pairs: Array<{
    id: string
    left: string
    leftImage?: string
    right: string
    rightImage?: string
  }>
  points: number
}

export interface DrawingConfig {
  prompt: string
  completionPoints?: number
}

export interface HomeworkUploadConfig {
  instructions: string
  acceptedFileTypes: Array<"image" | "pdf">
  completionPoints?: number
}

export interface SectionDividerConfig {
  title: string
  emoji?: string
}

export interface ConditionalLockConfig {
  conditionType: "score_on_quiz" | "completion_of_block"
  targetBlockId: string
  threshold: number
}

export interface BonusPointsConfig {
  points: number
  celebratoryText?: string
}

export type BlockConfig =
  | VideoConfig
  | ImageConfig
  | RichTextConfig
  | PdfConfig
  | AudioConfig
  | QuoteConfig
  | MultipleChoiceConfig
  | TrueFalseConfig
  | FillBlankConfig
  | OrderingConfig
  | MatchingConfig
  | DrawingConfig
  | HomeworkUploadConfig
  | SectionDividerConfig
  | ConditionalLockConfig
  | BonusPointsConfig

export interface LessonBlock {
  id: string
  sectionId: string
  blockType: BlockType
  config: BlockConfig
  gridColumn: number
  gridRow: number
  gridWidth: number
  gridHeight: number
  stepOrder: number
}

export interface SectionConfig {
  backgroundColor?: string
  padding?: string
  columns?: number
}

export interface Section {
  id: string
  lessonId: string
  orderIndex: number
  config: SectionConfig
  blocks: LessonBlock[]
}
