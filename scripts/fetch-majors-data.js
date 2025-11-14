// Script to fetch and analyze majors data from CSV
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/data-1760626614500-oohOM3ml1TK3ck6N5Y3D5DPgWyKj5F.csv"

async function fetchAndAnalyzeData() {
  try {
    console.log("[v0] Fetching CSV data...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("[v0] Parsing CSV...")
    const lines = csvText.split("\n")
    const headers = lines[0].split(",")

    const data = []
    const eduLevels = new Set()
    const levelCounts = {}

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue

      const values = lines[i].split(",")
      const row = {
        name: values[0]?.trim() || "",
        code: values[1]?.trim() || "",
        edu_level: values[2]?.trim() || "",
        level: Number.parseInt(values[3]) || 0,
        parent_id: values[4]?.trim() || "",
      }

      data.push(row)
      eduLevels.add(row.edu_level)
      levelCounts[row.level] = (levelCounts[row.level] || 0) + 1
    }

    console.log("[v0] Data Analysis:")
    console.log(`Total records: ${data.length}`)
    console.log(`Education levels: ${Array.from(eduLevels).join(", ")}`)
    console.log(`Level distribution:`, levelCounts)
    console.log("\n[v0] Sample records:")
    console.log(data.slice(0, 5))

    // Group by edu_level
    const byEduLevel = {}
    eduLevels.forEach((level) => {
      byEduLevel[level] = data.filter((item) => item.edu_level === level)
    })

    console.log("\n[v0] Records by education level:")
    Object.keys(byEduLevel).forEach((level) => {
      console.log(`${level}: ${byEduLevel[level].length} records`)
    })
  } catch (error) {
    console.error("[v0] Error:", error)
  }
}

fetchAndAnalyzeData()
