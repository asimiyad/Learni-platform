interface MediaResult {
  url: string
}

async function searchWikimediaCommons(query: string): Promise<MediaResult | null> {
  try {
    const searchRes = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=5&origin=*`,
      { headers: { "User-Agent": "Learni/1.0" } }
    )
    if (!searchRes.ok) return null
    const searchData = await searchRes.json()
    const pages = searchData?.query?.search
    if (!pages?.length) return null

    const titles = pages.slice(0, 3).map((p: any) => `File:${p.title.replace(/^File:/, "")}`).join("|")

    const imageRes = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*`,
      { headers: { "User-Agent": "Learni/1.0" } }
    )
    if (!imageRes.ok) return null
    const imageData = await imageRes.json()
    const imagePages = imageData?.query?.pages
    if (!imagePages) return null

    for (const id of Object.keys(imagePages)) {
      const page = imagePages[id]
      const info = page?.imageinfo?.[0]
      if (info?.url && !info.url.endsWith(".svg") && !info.url.includes(".svg")) {
        return { url: info.url }
      }
    }
    return null
  } catch {
    return null
  }
}

function extractSearchQuery(block: any, sectionTitle: string): string {
  return block.config?.altText || block.config?.searchQuery || sectionTitle || "image"
}

export async function resolveLessonMedia(lesson: any): Promise<any> {
  const sections = lesson.sections || []

  const tasks: Promise<void>[] = []

  for (const sec of sections) {
    for (const block of sec.blocks || []) {
      if (block.blockType === "IMAGE") {
        const query = extractSearchQuery(block, sec.title || "")
        tasks.push(
          searchWikimediaCommons(query).then((result) => {
            if (result?.url) {
              block.config.url = result.url
            }
          })
        )
      }
    }
  }

  await Promise.all(tasks)
  return lesson
}
