"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Building2, GraduationCap, ArrowUp, ArrowDown } from "lucide-react"

interface HistoryScore {
  year: number
  historyScore: Array<{ [key: string]: string }>
  remark: string
  planNum: number
  batch?: string
  majorGroupName?: string | null
}

interface School {
  schoolName: string
  schoolNature: string
  rankDiffPer: number
  group: number
  historyScores: HistoryScore[]
  schoolFeature: string
  belong: string
  provinceName: string
  cityName: string
  enrollmentRate: string
  employmentRate: string
  majorGroupName?: string | null
  majorGroupId?: number
}

interface IntentionMajor {
  major: {
    code: string
    name: string
  }
  schools: School[]
}

export default function IntendedMajorsSchoolsClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const majorCode = searchParams.get("majorCode")
  const [data, setData] = useState<IntentionMajor | null>(null)
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [groupData, setGroupData] = useState<any[]>([])
  const [selectedGroupInfo, setSelectedGroupInfo] = useState<{
    schoolName: string
    majorGroupName: string
    majorGroupInfo?: string
    schoolCode?: string
  } | null>(null)
  const [groupDialogOpen, setGroupDialogOpen] = useState(false)

  useEffect(() => {
    // 加载数据
    const loadData = async () => {
      try {
        const response = await fetch("/data/intention.json")
        const allData: IntentionMajor[] = await response.json()
        const majorData = allData.find((item) => item.major.code === majorCode)
        setData(majorData || null)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    // 加载专业组数据
    const loadGroupData = async () => {
      try {
        const response = await fetch("/data/group.json")
        const groupJson = await response.json()
        console.log("group.json 加载结果:", groupJson)
        if (groupJson.data && Array.isArray(groupJson.data)) {
          console.log("设置 groupData，数量:", groupJson.data.length)
          setGroupData(groupJson.data)
        } else {
          console.warn("group.json 数据格式不正确:", groupJson)
        }
      } catch (error) {
        console.error("Error loading group data:", error)
      }
    }

    // 无论是否有 majorCode，都加载专业组数据
    loadGroupData()
    
    if (majorCode) {
      loadData()
    }

    // 加载志愿列表
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("school-wishlist")
        if (saved) {
          setWishlist(new Set(JSON.parse(saved)))
        }
      } catch (error) {
        console.error("Error loading wishlist:", error)
      }
    }
  }, [majorCode])

  const toggleWishlist = (schoolKey: string, schoolData: School) => {
    if (typeof window === "undefined") return

    setWishlist((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(schoolKey)) {
        newSet.delete(schoolKey)
      } else {
        newSet.add(schoolKey)
      }

      // 保存到本地存储
      try {
        localStorage.setItem("school-wishlist", JSON.stringify(Array.from(newSet)))
      } catch (error) {
        console.error("Error saving wishlist:", error)
      }

      // 更新 wishlist-items
      if (newSet.has(schoolKey)) {
        // 添加到 wishlist-items
        try {
          const existingItems = JSON.parse(localStorage.getItem("wishlist-items") || "[]")
          const wishlistItem = {
            key: schoolKey,
            majorCode: majorCode,
            majorName: data?.major.name || "",
            schoolName: schoolData.schoolName,
            schoolCode: schoolData.schoolName,
            provinceName: schoolData.provinceName,
            cityName: schoolData.cityName,
            belong: schoolData.belong,
            schoolFeature: schoolData.schoolFeature || "",
            schoolNature: schoolData.schoolNature || "public",
            group: schoolData.group || 0,
            historyScore: schoolData.historyScores || [],
            enrollmentRate: schoolData.enrollmentRate || "0",
            employmentRate: schoolData.employmentRate || "0",
            Rankdiff: 0,
            RankdiffPer: schoolData.rankDiffPer || 0,
            score: "0",
            developmentPotential: "0",
            selected: true,
            batch: schoolData.historyScores?.[0]?.batch || null,
            majorGroupName: schoolData.majorGroupName || null,
          }
          const exists = existingItems.some((item: any) => item.key === schoolKey)
          if (!exists) {
            existingItems.push(wishlistItem)
            localStorage.setItem("wishlist-items", JSON.stringify(existingItems))
          }
        } catch (error) {
          console.error("Error saving wishlist items:", error)
        }
      } else {
        // 从 wishlist-items 中删除
        try {
          const existingItems = JSON.parse(localStorage.getItem("wishlist-items") || "[]")
          const newItems = existingItems.filter((item: any) => item.key !== schoolKey)
          localStorage.setItem("wishlist-items", JSON.stringify(newItems))
        } catch (error) {
          console.error("Error removing wishlist items:", error)
        }
      }

      return newSet
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  if (!data || !majorCode) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-4 space-y-4">
        <p className="text-muted-foreground">未找到专业信息</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1A4099] via-[#2563eb] to-[#2563eb]/80 text-white px-4 pt-6 pb-8 relative">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold">
            {data.major.name} ({data.major.code}) - 院校列表
          </h1>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-4 bg-background"
          style={{
            clipPath: "ellipse(70% 100% at 50% 100%)",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-lg mx-auto space-y-2">
          {data.schools.map((school, idx) => {
            const schoolKey = `${majorCode}-${school.schoolName}`
            const isInWishlist = wishlist.has(schoolKey)

            return (
              <Card key={idx} className="p-2 bg-muted/30">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-sm">{school.schoolName}</h4>
                      {school.majorGroupName && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log("点击专业组按钮，schoolName:", school.schoolName, "majorGroupName:", school.majorGroupName)
                            console.log("当前 groupData.length:", groupData.length)
                            setSelectedGroupInfo({
                              schoolName: school.schoolName,
                              majorGroupName: school.majorGroupName || "",
                            })
                            setGroupDialogOpen(true)
                            console.log("设置 groupDialogOpen 为 true")
                          }}
                          className="text-xs text-muted-foreground hover:text-primary hover:underline cursor-pointer"
                        >
                          专业组:{school.majorGroupName}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold flex items-center gap-1 ${
                          school.rankDiffPer > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        您的位次比去年
                        {school.rankDiffPer > 0 ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )}
                        {Math.abs(school.rankDiffPer).toFixed(1)}%
                      </span>
                      <Button
                        variant={isInWishlist ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleWishlist(schoolKey, school)}
                        className={`font-bold ${
                          isInWishlist
                            ? "border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600"
                            : "bg-[#1A4099] text-white hover:bg-[#1A4099]/90"
                        }`}
                      >
                        {isInWishlist ? "已加入志愿" : "加入志愿"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {school.provinceName} · {school.cityName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span>{school.belong}</span>
                    </div>
                  </div>

                  {school.schoolFeature && (
                    <div className="flex flex-wrap gap-1">
                      {school.schoolFeature.split(",").map((feature, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-blue-600" />
                      <span className="text-muted-foreground">升学率:</span>
                      <span className="font-semibold">{school.enrollmentRate}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">就业率:</span>
                      <span className="font-semibold">{school.employmentRate}%</span>
                    </div>
                  </div>

                  {school.historyScores.length > 0 && school.historyScores[0].historyScore && (
                    <div className="mt-1">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-1 text-muted-foreground font-normal">年份</th>
                            <th className="text-left py-1 text-muted-foreground font-normal">最低分数</th>
                            <th className="text-left py-1 text-muted-foreground font-normal">最低位次</th>
                            <th className="text-left py-1 text-muted-foreground font-normal">招生人数</th>
                          </tr>
                        </thead>
                        <tbody>
                          {school.historyScores[0].historyScore.map((score, i) => {
                            const [year, data] = Object.entries(score)[0]
                            const [minScore, minRank, planNum] = data.split(",")
                            return (
                              <tr key={i} className="border-b last:border-0">
                                <td className="py-1">{year}</td>
                                <td className="py-1">{minScore}</td>
                                <td className="py-1">{minRank}</td>
                                <td className="py-1">{planNum}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                      {(school.historyScores[0].batch || school.historyScores[0].remark) && (
                        <div className="mt-1 p-1 border rounded text-xs text-muted-foreground">
                          {school.historyScores[0].batch && (
                            <span className="font-bold whitespace-nowrap">{school.historyScores[0].batch}</span>
                          )}
                          {school.historyScores[0].remark && (
                            <span className={school.historyScores[0].batch ? "ml-2" : ""}>{school.historyScores[0].remark}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* 专业组信息弹出框 */}
      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedGroupInfo?.schoolName} - {selectedGroupInfo?.majorGroupName} 专业组信息
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {(() => {
              // 显示所有专业组数据，不进行筛选
              console.log("Dialog 内容渲染，groupData.length:", groupData.length)
              console.log("groupData 示例:", groupData.slice(0, 2))
              
              if (groupData.length === 0) {
                return (
                  <div className="text-center text-muted-foreground py-8">
                    <div>暂无专业组信息</div>
                    <div className="text-xs mt-2">数据未加载或为空</div>
                  </div>
                )
              }

              // 按 majorGroupInfo 分组
              const groupedByInfo = groupData.reduce((acc, item) => {
                const key = item.majorGroupInfo || "未分组"
                if (!acc[key]) {
                  acc[key] = []
                }
                acc[key].push(item)
                return acc
              }, {} as Record<string, typeof groupData>)

              return Object.entries(groupedByInfo).map(([groupInfo, majors]) => {
                // 找出最低的热爱能量分数
                const scores = majors
                  .map(m => parseInt(m.developmentPotential || "0"))
                  .filter(s => s > 0)
                const minScore = scores.length > 0 ? Math.min(...scores) : null
                
                // 找出所有最低分数的专业（包括并列最低的，如51和52都是最低时）
                // 如果最低分数存在，找出所有分数 <= 最低分数+1 的专业（用于标记51和52这种情况）
                const lowestScoreMajors = minScore !== null 
                  ? majors.filter(m => {
                      const score = parseInt(m.developmentPotential || "0")
                      return score > 0 && (score === minScore || score === minScore + 1)
                    })
                  : []
                
                // 获取需要提醒的分数范围
                const warningScores = minScore !== null 
                  ? [minScore, minScore + 1].filter(s => s > 0)
                  : []
                
                return (
                  <div key={groupInfo} className="mb-6">
                    {lowestScoreMajors.length > 0 && (
                      <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                        <div className="font-semibold mb-1">⚠️ 提醒</div>
                        <div>该专业组中包含热爱能量低的专业，选择该专业组可能会被调剂到这些专业，请谨慎选择。</div>
                      </div>
                    )}
                    <h3 className="font-semibold text-sm mb-3">{groupInfo}</h3>
                    <div className="border rounded">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left py-2 px-2 font-medium">专业</th>
                            <th className="text-left py-2 px-2 font-medium">批次</th>
                            <th className="text-left py-2 px-2 font-medium">招生人数</th>
                            <th className="text-left py-2 px-2 font-medium">学费</th>
                            <th className="text-left py-2 px-2 font-medium">学制</th>
                            <th className="text-left py-2 px-2 font-medium">热爱能量</th>
                          </tr>
                        </thead>
                        <tbody>
                          {majors.map((major, idx) => {
                            const score = parseInt(major.developmentPotential || "0")
                            const isLowest = minScore !== null && score > 0 && (score === minScore || score === minScore + 1)
                            
                            return (
                              <tr 
                                key={idx} 
                                className={`border-b last:border-0 hover:bg-muted/30 ${isLowest ? "bg-yellow-50/50" : ""}`}
                              >
                                <td className="py-2 px-2">
                                  <div className="font-medium">{major.majorName}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">{major.majorCode}</div>
                                </td>
                                <td className="py-2 px-2 text-muted-foreground">{major.batch || "-"}</td>
                                <td className="py-2 px-2 text-muted-foreground">{major.num || "-"}</td>
                                <td className="py-2 px-2 text-muted-foreground">{major.tuition ? `${major.tuition}元` : "-"}</td>
                                <td className="py-2 px-2 text-muted-foreground">{major.studyPeriod || "-"}</td>
                                <td className={`py-2 px-2 font-medium ${isLowest ? "text-red-600" : "text-blue-600"}`}>
                                  {major.developmentPotential || "-"}
                                  {isLowest && <span className="ml-1 text-red-500">⚠️</span>}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

