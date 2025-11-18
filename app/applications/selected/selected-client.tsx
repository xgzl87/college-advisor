"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Info, CheckCircle2 } from "lucide-react"

interface AlternativeItem {
  id: number
  majorCode: string
  majorName: string
  schoolCode: string
  schoolName: string
  schoolFeature: string
  belong: string
  schoolNature: string
  group: number
  historyScore: Array<Record<string, string>>
  selected: boolean
  enrollmentRate: number
  employmentRate: number
  Rankdiff: number
  RankdiffPer: number
  score: string
  developmentPotential: string
  provinceName: string
  cityName: string
  admissionsSite?: string
  admissionsPhone?: string
}

interface AlternativesData {
  total: number
  volunteerCount: number
  alternatives: AlternativeItem[]
}

export default function SelectedApplicationsClient() {
  const [data, setData] = useState<AlternativesData | null>(null)
  const [expandedMoreInfo, setExpandedMoreInfo] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string>("")

  useEffect(() => {
    fetch("/data/alternatives.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((json) => {
        if (!json.data) {
          throw new Error("Invalid data structure: missing 'data' field")
        }
        setData(json.data)
      })
      .catch((err) => {
        console.error("[v0] Error loading alternatives data:", err)
        setError(err.message || "加载数据失败")
      })
  }, [])

  useEffect(() => {
  }, [])

  const toggleMoreInfo = (id: number) => {
    const newExpanded = new Set(expandedMoreInfo)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedMoreInfo(newExpanded)
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-destructive">加载失败: {error}</p>
        <p className="text-sm text-muted-foreground mt-2">请确保 public/data/alternatives.json 文件存在</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  const selectedItems = data.alternatives.filter((item) => item.selected)

  return (
    <div className="flex flex-col h-full">
      <div className="bg-secondary text-secondary-foreground px-6 pt-8 pb-12">
        <h1 className="text-2xl font-bold mb-2">入选志愿</h1>
        <p className="text-secondary-foreground/90 text-sm">共 {selectedItems.length} 个入选志愿</p>
      </div>

      <div className="flex-1 overflow-auto p-4 -mt-6">
        <div className="space-y-2">
          {selectedItems.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-sm text-muted-foreground">暂无入选志愿</p>
              <p className="text-xs mt-2 text-muted-foreground">从备选志愿中选择专业添加到入选志愿</p>
            </Card>
          ) : (
            selectedItems.map((item) => {
              const isMoreInfoExpanded = expandedMoreInfo.has(item.id)
              const firstHistoryScore = item.historyScore[0]

              return (
                <Card key={item.id} className="overflow-hidden">
                  <div className="p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="font-medium text-base">{item.schoolName}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{item.majorName}</span>
                          {item.RankdiffPer >= 0 ? (
                            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              item.RankdiffPer >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {item.RankdiffPer.toFixed(1)}%
                          </span>
                        </div>

                        <div className="pt-1 space-y-0.5">
                          <div className="text-sm font-semibold">逆袭指数：</div>
                          <div className="flex items-center gap-1 text-xs pl-4">
                            <span className="text-muted-foreground">热爱能量</span>
                            <span className="font-semibold text-blue-600">{item.score}</span>
                          </div>
                        </div>
                      </div>

                      {firstHistoryScore && (
                        <div className="flex-shrink-0 w-80">
                          <table className="border-collapse w-full text-xs">
                            <thead>
                              <tr className="border-b">
                                <th className="px-2 py-1 text-left font-medium text-muted-foreground">年份</th>
                                <th className="px-2 py-1 text-right font-medium text-muted-foreground">最低分数</th>
                                <th className="px-2 py-1 text-right font-medium text-muted-foreground">最低位次</th>
                                <th className="px-2 py-1 text-right font-medium text-muted-foreground">招生人数</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(firstHistoryScore).map(([year, scoreData]) => {
                                const parts = scoreData.split(",")
                                const score = parts[0] || "-"
                                const rank = parts[1] || "-"
                                const planNum = parts[2] || "-"

                                return (
                                  <tr key={year} className="border-b last:border-b-0">
                                    <td className="px-2 py-1">{year}</td>
                                    <td className="px-2 py-1 text-right">{score}</td>
                                    <td className="px-2 py-1 text-right">{rank}</td>
                                    <td className="px-2 py-1 text-right">{planNum}</td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => toggleMoreInfo(item.id)}
                      className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Info className="w-3 h-3" />
                      更多信息
                      {isMoreInfoExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {isMoreInfoExpanded && (
                    <div className="px-3 pb-3 pt-0 bg-muted/20 text-xs space-y-1">
                      <div className="flex gap-2">
                        <span className="text-muted-foreground min-w-16">专业代码:</span>
                        <span>{item.majorCode}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-muted-foreground min-w-16">省份:</span>
                        <span>{item.provinceName}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-muted-foreground min-w-16">城市:</span>
                        <span>{item.cityName}</span>
                      </div>
                      {item.schoolFeature && (
                        <div className="flex gap-2">
                          <span className="text-muted-foreground min-w-16">学校特色:</span>
                          <span>{item.schoolFeature}</span>
                        </div>
                      )}
                      {item.belong && (
                        <div className="flex gap-2">
                          <span className="text-muted-foreground min-w-16">隶属:</span>
                          <span>{item.belong}</span>
                        </div>
                      )}
                      {item.enrollmentRate > 0 && (
                        <div className="flex gap-2">
                          <span className="text-muted-foreground min-w-16">升学率:</span>
                          <span>{item.enrollmentRate}%</span>
                        </div>
                      )}
                      {item.employmentRate > 0 && (
                        <div className="flex gap-2">
                          <span className="text-muted-foreground min-w-16">就业率:</span>
                          <span>{item.employmentRate}%</span>
                        </div>
                      )}
                      {item.admissionsPhone && (
                        <div className="flex gap-2">
                          <span className="text-muted-foreground min-w-16">招生电话:</span>
                          <span>{item.admissionsPhone}</span>
                        </div>
                      )}
                      {item.admissionsSite && (
                        <div className="flex gap-2">
                          <span className="text-muted-foreground min-w-16">招生网站:</span>
                          <a
                            href={item.admissionsSite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {item.admissionsSite}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
