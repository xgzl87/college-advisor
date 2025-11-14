import { type NextRequest, NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")?.toLowerCase() || ""

    console.log("[v0] Search query:", query)

    if (!query) {
      return NextResponse.json([])
    }

    const filePath = join(process.cwd(), "public", "data", "majors.json")
    console.log("[v0] Reading file from:", filePath)

    let fileContent: string
    try {
      fileContent = readFileSync(filePath, "utf-8")
      console.log("[v0] File read successfully, length:", fileContent.length)
    } catch (fileError) {
      console.error("[v0] Error reading file:", fileError)
      return NextResponse.json({ error: "File not found", details: String(fileError) }, { status: 404 })
    }

    let majorsData: any[]
    try {
      majorsData = JSON.parse(fileContent)
      console.log("[v0] JSON parsed successfully, majors count:", majorsData.length)
    } catch (parseError) {
      console.error("[v0] Error parsing JSON:", parseError)
      return NextResponse.json({ error: "Invalid JSON", details: String(parseError) }, { status: 500 })
    }

    // Fuzzy search by name
    const results = majorsData
      .filter((major: any) => major.name && major.name.toLowerCase().includes(query))
      .slice(0, 10) // Limit to 10 results

    console.log("[v0] Search results count:", results.length)
    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Unexpected error in majors search API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
