"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Info, Heart, Check, Trash2 } from "lucide-react"

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

export default function BackupApplicationsClient() {
  const [data, setData] = useState<AlternativesData | null>(null)
  const [expandedMoreInfo, setExpandedMoreInfo] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string>("")
  const [careerExplorationCompleted, setCareerExplorationCompleted] = useState(false)

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("backupScrollPosition", window.scrollY.toString())
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    const savedPosition = sessionStorage.getItem("backupScrollPosition")
    if (savedPosition) {
      window.scrollTo(0, Number.parseInt(savedPosition))
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

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
    const careerCompleted = localStorage.getItem("careerExplorationCompleted")
    setCareerExplorationCompleted(careerCompleted === "true")
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

  const handleSelect = (id: number) => {
    if (!data) return

    const updatedAlternatives = data.alternatives.map((item) => (item.id === id ? { ...item, selected: true } : item))

    setData({
      ...data,
      alternatives: updatedAlternatives,
    })
  }

  const handleDelete = (id: number) => {
    if (!data) return

    const updatedAlternatives = data.alternatives.filter((item) => item.id !== id)

    setData({
      ...data,
      alternatives: updatedAlternatives,
      total: updatedAlternatives.length,
    })
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

  const backupItems = data.alternatives.filter((item) => !item.selected)

  return (
    <div className="flex flex-col h-full">
      <div className="bg-secondary text-secondary-foreground px-6 pt-8 pb-12">
        <h1 className="text-2xl font-bold mb-2">备选志愿</h1>
        <p className="text-secondary-foreground/90 text-sm">共 {backupItems.length} 个备选志愿</p>
      </div>

      <div className="flex-1 overflow-auto p-4 -mt-6">
        <div className="space-y-2">
          {backupItems.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-sm text-muted-foreground">暂无备选志愿</p>
              <p className="text-xs mt-2 text-muted-foreground">浏览专业时点击收藏按钮添加到备选志愿</p>
            </Card>
          ) : (
            backupItems.map((item) => {
              const isMoreInfoExpanded = expandedMoreInfo.has(item.id)
              const firstHistoryScore = item.historyScore[0]

              return (
                <Card key={item.id} className="overflow-hidden relative">
                  <div className="p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Left side: School and major info */}
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
                          <div className="flex items-center gap-1 text-xs pl-4">
                            <span className="text-muted-foreground">职业探索:</span>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded ${
                                careerExplorationCompleted ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {careerExplorationCompleted ? "已完成" : "未完成"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side: History scores table */}
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

                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() => toggleMoreInfo(item.id)}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Info className="w-3 h-3" />
                        更多信息
                        {isMoreInfoExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleSelect(item.id)}
                          className="h-7 text-xs"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          入选
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                          className="h-7 text-xs"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          删除
                        </Button>
                      </div>
                    </div>
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
                          <span className="text-muted-foreground min-w-16">录取率:</span>
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
