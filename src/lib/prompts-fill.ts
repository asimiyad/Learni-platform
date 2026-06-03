const FILL_CONFIGS: Record<string, string> = {
  RICH_TEXT: '{"content":"<h2>Title</h2><p>Explanation with <strong>key terms</strong>.</p>"}',
  QUOTE: '{"text":"Quote","attribution":"- Author","style":"modern"}',
  MULTIPLE_CHOICE: '{"question":"Q?","options":[{"id":"o1","text":"A","isCorrect":true,"feedback":"f"},{"id":"o2","text":"B","isCorrect":false,"feedback":"f"},{"id":"o3","text":"C","isCorrect":false,"feedback":"f"},{"id":"o4","text":"D","isCorrect":false,"feedback":"f"}],"points":10}',
  TRUE_FALSE: '{"statement":"S","correctAnswer":true,"feedbackCorrect":"y","feedbackIncorrect":"n","points":10}',
  FILL_BLANK: '{"sentenceWithBlanks":"X is [blank].","blanks":[{"placeholderIndex":0,"acceptedAnswers":["a","A"]}],"points":10}',
  ORDERING: '{"instruction":"Order:","items":[{"id":"i1","text":"A","correctOrder":1},{"id":"i2","text":"B","correctOrder":2}],"points":10}',
  MATCHING: '{"instruction":"Match:","pairs":[{"id":"p1","left":"T","right":"D"},{"id":"p2","left":"T2","right":"D2"}],"points":10}',
  DRAWING: '{"prompt":"Draw and label...","completionPoints":5}',
  HOMEWORK_UPLOAD: '{"instructions":"Submit your work","acceptedFileTypes":["image","pdf"],"completionPoints":5}',
  VIDEO: '{"sourceType":"youtube","url":"","startTime":0,"endTime":0}',
  IMAGE: '{"altText":"description of the image"}',
  PDF: '{"fileId":"","pageRange":""}',
  AUDIO: '{"sourceType":"upload","fileId":""}',
}

function fillSystemPrompt(blockType: string, sectionTitle: string, lessonContext: string): string {
  const config = FILL_CONFIGS[blockType] || "{}"
  return `You are generating ONE block for a lesson. Output ONLY valid JSON for this block's config. No markdown, no backticks.

Block type: ${blockType}
Config shape: ${config}
Section: "${sectionTitle}"
Lesson: ${lessonContext}

Generate grade-appropriate, accurate educational content for this single block. Respond with ONLY the config JSON object.`
}

export { fillSystemPrompt }
