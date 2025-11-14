import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params
    console.log("[v0] API: Loading major detail for code:", code)

    const cwd = process.cwd()
    const filePath = join(cwd, "data", `${code}.json`)
    console.log("[v0] API: Current working directory:", cwd)
    console.log("[v0] API: Attempting to read file:", filePath)

    const fileContent = await readFile(filePath, "utf-8")
    const jsonData = JSON.parse(fileContent)

    console.log("[v0] API: Successfully loaded major detail")
    return NextResponse.json(jsonData)
  } catch (error) {
    console.error("[v0] API: Error loading major detail:", error)
    console.error("[v0] API: Error type:", error?.constructor?.name)
    console.error("[v0] API: Error code:", (error as NodeJS.ErrnoException).code)
    console.error("[v0] API: Error message:", error instanceof Error ? error.message : String(error))

    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      const { code } = await params
      return NextResponse.json({ error: `专业数据文件不存在: data/${code}.json`, code }, { status: 404 })
    }

    return NextResponse.json(
      {
        error: "加载专业数据失败",
        message: error instanceof Error ? error.message : "未知错误",
        details: `请确保 data/${(await params).code}.json 文件存在于项目中`,
      },
      { status: 500 },
    )
  }
}
