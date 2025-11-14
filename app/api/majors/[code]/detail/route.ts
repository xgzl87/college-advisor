import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "http://caihongzq.com:4000/api/majors"
const AUTH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsIm5pY2tuYW1lIjoi5aSc5bmV5bGl5Z-OIiwiYXZhdGFyVXJsIjoiaHR0cHM6Ly90aGlyZHd4LnFsb2dvLmNuL21tb3Blbi92aV8zMi9GYnpoYmttVGRxSmx0VFNpYUZjNkM2Ymh1ZkNrMXJ4TVNpYkV0Zm5pYzZVVDJ6MXNmZFJWZkV5SFpMbzFhVkU4NGliNUJHaFJzN3JFVmJWSHk5U3ZwWkpFd05EY3FkVEhqYWJEWXlZSUlxbE15RkEvMTMyIiwiaWF0IjoxNzU4NzE1ODEwLCJleHAiOjE3NjEzMDc4MTB9.9ZjcO8IEgcdPGxTWisI7fhh0sAje0Pv7ZwLJTatQGO0"

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params
    const apiUrl = `${API_BASE_URL}/${code}/detail`

    console.log("[v0] API Route: Fetching from:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: AUTH_TOKEN,
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "User-Agent": "PostmanRuntime/7.48.0",
      },
      cache: "no-store",
    })

    console.log("[v0] API Route: Response status:", response.status)

    const responseText = await response.text()
    console.log("[v0] API Route: Response length:", responseText.length)

    if (!responseText || responseText.trim() === "") {
      return NextResponse.json(
        {
          error: "API返回了空响应",
          details: { status: response.status },
        },
        { status: 500 },
      )
    }

    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(responseText)
      console.log("[v0] API Route: Successfully parsed JSON")
    } catch (parseError) {
      console.error("[v0] API Route: JSON parse error:", parseError)
      return NextResponse.json(
        {
          error: "API返回了非JSON格式的响应",
          message: responseText,
          details: {
            status: response.status,
            responsePreview: responseText.substring(0, 500),
          },
        },
        { status: 500 },
      )
    }

    if (!response.ok) {
      return NextResponse.json({ error: `API请求失败: ${response.status}`, message: data }, { status: response.status })
    }

    console.log("[v0] API Route: Success, returning data")
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] API Route: Caught error:", error)
    return NextResponse.json(
      {
        error: "网络请求失败",
        message: error instanceof Error ? error.message : "无法连接到外部API",
      },
      { status: 500 },
    )
  }
}
