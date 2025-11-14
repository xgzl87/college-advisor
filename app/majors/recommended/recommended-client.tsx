"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Info } from "lucide-react"

interface SegmentStat {
  groupId: string
  name: string
  count: number
}

interface Major {
  name: string
  developmentPotential: string
  eduLevel?: string
}

interface HistoryScoreItem {
  historyScore: Array<Record<string, string>>
  planNum?: number
  remark?: string // Added remark field
}

interface TargetGroupItem {
  schoolName: string
  major: Major
  rankDiffPer: number
  historyScores: HistoryScoreItem[]
  provinceName?: string
  cityName?: string
  schoolFeature?: string
  belong?: string
  enrollmentRate?: string
  employmentRate?: string
}

interface TargetGroup {
  groupId: string
  count: number
  data: TargetGroupItem[]
}

interface NominateData {
  segmentStats: SegmentStat[]
  targetGroup: TargetGroup[]
}

export default function RecommendedClient() {
  const [data, setData] = useState<NominateData | null>(null)
  const [selectedSegment, setSelectedSegment] = useState<string>("")
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [expandedMoreInfo, setExpandedMoreInfo] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string>("")
  const [careerExplorationCompleted, setCareerExplorationCompleted] = useState(false)
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch("/data/nominate.json")
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
        if (json.data?.segmentStats?.length > 0) {
          setSelectedSegment(json.data.segmentStats[0].groupId)
          const allGroupIds = new Set(json.data.targetGroup.map((tg: TargetGroup) => tg.groupId))
          setExpandedGroups(allGroupIds)
        }
      })
      .catch((err) => {
        console.error("[v0] Error loading nominate data:", err)
        setError(err.message || "加载数据失败")
      })
  }, [])

  useEffect(() => {
    fetch("/data/alternatives.json")
      .then((res) => res.json())
      .then((json) => {
        if (json.data?.alternatives) {
          const counts: Record<string, number> = {}
          json.data.alternatives.forEach((item: { majorCode: string }) => {
            counts[item.majorCode] = (counts[item.majorCode] || 0) + 1
          })
          setApplicationCounts(counts)
        }
      })
      .catch((error) => {
        console.error("[v0] Error loading alternatives data:", error)
      })
  }, [])

  useEffect(() => {
    const careerCompleted = localStorage.getItem("careerExplorationCompleted")
    setCareerExplorationCompleted(careerCompleted === "true")
  }, [])

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  const toggleMoreInfo = (key: string) => {
    const newExpanded = new Set(expandedMoreInfo)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedMoreInfo(newExpanded)
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-destructive">加载失败: {error}</p>
        <p className="text-sm text-muted-foreground mt-2">请确保 public/data/nominate.json 文件存在</p>
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

  const filteredTargetGroups = selectedSegment
    ? data.targetGroup.filter((tg) => tg.groupId === selectedSegment)
    : data.targetGroup

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background border-b p-2">
        <div className="flex gap-2 flex-wrap">
          {data.segmentStats.map((stat, index) => (
            <Button
              key={stat.groupId}
              variant={selectedSegment === stat.groupId ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSegment(stat.groupId)}
            >
              {index === 0 ? `较你位次：${stat.name}` : stat.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-2">
          {filteredTargetGroups.map((targetGroup) => {
            const isExpanded = expandedGroups.has(targetGroup.groupId)
            const groupStat = data.segmentStats.find((s) => s.groupId === targetGroup.groupId)

            return (
              <Card key={targetGroup.groupId} className="overflow-hidden">
                <button
                  onClick={() => toggleGroup(targetGroup.groupId)}
                  className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{groupStat?.name || `组 ${targetGroup.groupId}`}</span>
                    <span className="text-sm text-muted-foreground">({targetGroup.count})</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isExpanded && (
                  <div className="border-t">
                    {targetGroup.data.map((item, index) => {
                      const itemKey = `${targetGroup.groupId}-${index}`
                      const isMoreInfoExpanded = expandedMoreInfo.has(itemKey)
                      const firstHistoryScore = item.historyScores[0]
                      const majorCodeMatch = item.major.name.match(/$$(\d+)$$/)
                      const majorCode = majorCodeMatch ? majorCodeMatch[1] : ""

                      return (
                        <div key={index} className="border-b last:border-b-0">
                          <div className="p-3 hover:bg-muted/30 transition-colors">
                            <div className="flex items-start gap-4">
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="font-medium text-base">{item.schoolName}</div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm text-muted-foreground">{item.major.name}</span>
                                  {majorCode && applicationCounts[majorCode] > 0 && (
                                    <span className="inline-flex items-center text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                      {applicationCounts[majorCode]} 个志愿
                                    </span>
                                  )}
                                  {item.rankDiffPer >= 0 ? (
                                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                                  ) : (
                                    <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                                  )}
                                  <span
                                    className={`text-sm font-medium ${
                                      item.rankDiffPer >= 0 ? "text-green-600" : "text-red-600"
                                    }`}
                                  >
                                    {item.rankDiffPer.toFixed(1)}%
                                  </span>
                                </div>

                                <div className="pt-1 space-y-0.5">
                                  <div className="text-sm font-semibold">逆袭指数：</div>
                                  <div className="flex items-center gap-1 text-xs pl-4">
                                    <span className="text-muted-foreground">热爱能量</span>
                                    <span className="font-semibold text-primary">
                                      {item.major.developmentPotential}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs pl-4">
                                    <span className="text-muted-foreground">职业探索:</span>
                                    <span
                                      className={`text-xs px-1.5 py-0.5 rounded ${
                                        careerExplorationCompleted
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {careerExplorationCompleted ? "已完成" : "未完成"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {firstHistoryScore && (
                                <div className="flex-shrink-0 w-80">
                                  <table className="border-collapse w-full text-xs">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="px-2 py-1 text-left font-medium text-muted-foreground">年份</th>
                                        <th className="px-2 py-1 text-right font-medium text-muted-foreground">
                                          最低分数
                                        </th>
                                        <th className="px-2 py-1 text-right font-medium text-muted-foreground">
                                          最低位次
                                        </th>
                                        <th className="px-2 py-1 text-right font-medium text-muted-foreground">
                                          招生人数
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {firstHistoryScore.historyScore.map((scoreObj, scoreIndex) => {
                                        const year = Object.keys(scoreObj)[0]
                                        const scoreData = scoreObj[year].split(",")
                                        const score = scoreData[0] || "-"
                                        const rank = scoreData[1] || "-"
                                        const planNum = scoreData[2] || firstHistoryScore.planNum || "-"

                                        return (
                                          <tr key={scoreIndex} className="border-b last:border-b-0">
                                            <td className="px-2 py-1">{year}</td>
                                            <td className="px-2 py-1 text-right">{score}</td>
                                            <td className="px-2 py-1 text-right">{rank}</td>
                                            <td className="px-2 py-1 text-right">{planNum}</td>
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </table>

                                  {firstHistoryScore.remark && (
                                    <div className="mt-2 p-2 border rounded text-xs text-muted-foreground break-words">
                                      {firstHistoryScore.remark}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => toggleMoreInfo(itemKey)}
                              className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <Info className="w-3 h-3" />
                              更多信息
                              {isMoreInfoExpanded ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          {isMoreInfoExpanded && (
                            <div className="px-3 pb-3 pt-0 bg-muted/20 text-xs space-y-1">
                              {item.provinceName && (
                                <div className="flex gap-2">
                                  <span className="text-muted-foreground min-w-16">省份:</span>
                                  <span>{item.provinceName}</span>
                                </div>
                              )}
                              {item.cityName && (
                                <div className="flex gap-2">
                                  <span className="text-muted-foreground min-w-16">城市:</span>
                                  <span>{item.cityName}</span>
                                </div>
                              )}
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
                              {item.enrollmentRate && (
                                <div className="flex gap-2">
                                  <span className="text-muted-foreground min-w-16">录取率:</span>
                                  <span>{item.enrollmentRate}%</span>
                                </div>
                              )}
                              {item.employmentRate && (
                                <div className="flex gap-2">
                                  <span className="text-muted-foreground min-w-16">就业率:</span>
                                  <span>{item.employmentRate}%</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
