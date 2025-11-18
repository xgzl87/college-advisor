"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ChevronDown, Award, Building2, MapPin, GraduationCap, ArrowUp, Search, Trash2, ArrowDown, Plus } from "lucide-react"

interface Major {
  code: string
  name: string
  displayName: string
  developmentPotential: string
  score: string
  opportunityScore: string
  academicDevelopmentScore: string
  careerDevelopmentScore: string
  growthPotentialScore: string
  industryProspectsScore: string
  lexueScore: string
  shanxueScore: string
  yanxueDeduction: string
  tiaozhanDeduction: string
  eduLevel?: string
}

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
}

interface IntentionMajor {
  major: Major
  schools: School[]
}

interface IntendedMajorsClientProps {
  activeTab: "专业赛道" | "意向志愿"
}

export default function IntendedMajorsClient({ activeTab }: IntendedMajorsClientProps) {
  const [data, setData] = useState<IntentionMajor[]>([])
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [wishlistItems, setWishlistItems] = useState<any[]>([]) // 保存完整的志愿数据
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({})
  const [wishlistCounts, setWishlistCounts] = useState<Record<string, number>>({})
  const [alternatives, setAlternatives] = useState<any[]>([])
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [expandedHistoryScores, setExpandedHistoryScores] = useState<Set<number>>(new Set())
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)

  useEffect(() => {
    fetch("/data/intention.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Error loading intention data:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetch("/data/alternatives.json")
      .then((res) => res.json())
      .then((json) => {
        if (json.data?.alternatives) {
          setAlternatives(json.data.alternatives)
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
    if (typeof window === "undefined") return
    
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    
    try {
      const saved = localStorage.getItem("school-wishlist")
      if (saved) {
        setWishlist(new Set(JSON.parse(saved)))
      }
      // 加载保存的志愿数据
      const savedItems = localStorage.getItem("wishlist-items")
      if (savedItems) {
        try {
          const items = JSON.parse(savedItems)
          setWishlistItems(items)
          // 计算每个专业的志愿数量
          const counts: Record<string, number> = {}
          items.forEach((item: any) => {
            if (item.majorCode) {
              counts[item.majorCode] = (counts[item.majorCode] || 0) + 1
            }
          })
          setWishlistCounts(counts)
        } catch (error) {
          console.error("Error loading wishlist items:", error)
        }
      }
    } catch (error) {
      console.error("Error loading wishlist data:", error)
    }
  }, [])
  
  // 监听 wishlistItems 变化，更新志愿数量
  useEffect(() => {
    const counts: Record<string, number> = {}
    wishlistItems.forEach((item: any) => {
      if (item.majorCode) {
        counts[item.majorCode] = (counts[item.majorCode] || 0) + 1
      }
    })
    setWishlistCounts(counts)
  }, [wishlistItems])

  const toggleWishlist = (schoolKey: string, schoolData?: any) => {
    if (typeof window === "undefined") return
    
    setWishlist((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(schoolKey)) {
        newSet.delete(schoolKey)
        // 从 wishlistItems 中移除
        setWishlistItems((prevItems) => {
          const newItems = prevItems.filter((item) => item.key !== schoolKey)
          try {
            localStorage.setItem("wishlist-items", JSON.stringify(newItems))
          } catch (error) {
            console.error("Error saving wishlist items:", error)
          }
          return newItems
        })
      } else {
        newSet.add(schoolKey)
        // 添加到 wishlistItems
        if (schoolData) {
          let wishlistItem: any
          
          // 如果 schoolData 已经有完整数据（从志愿预览点击），直接使用
          if (schoolData.majorCode && schoolData.schoolName) {
            wishlistItem = {
              ...schoolData,
              key: schoolKey,
              selected: true,
            }
          } else if (selectedMajor) {
            // 从 Dialog 中点击，需要组合数据
            // 获取 batch 和 majorGroupName
            const batch = schoolData.historyScores?.[0]?.batch || null
            const majorGroupName = schoolData.majorGroupName || null
            
            wishlistItem = {
              key: schoolKey,
              majorCode: selectedMajor.major.code,
              majorName: selectedMajor.major.name,
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
              score: selectedMajor.major.score || "0",
              developmentPotential: selectedMajor.major.developmentPotential || "0",
              selected: true,
              batch: batch || "本科",
              majorGroupName: majorGroupName,
            }
          }
          
          if (wishlistItem) {
            setWishlistItems((prevItems) => {
              // 检查是否已存在，避免重复添加
              const exists = prevItems.some((item) => item.key === schoolKey)
              if (!exists) {
                const newItems = [...prevItems, wishlistItem]
                try {
                  localStorage.setItem("wishlist-items", JSON.stringify(newItems))
                } catch (error) {
                  console.error("Error saving wishlist items:", error)
                }
                return newItems
              }
              return prevItems
            })
          }
        }
      }
      try {
        localStorage.setItem("school-wishlist", JSON.stringify(Array.from(newSet)))
      } catch (error) {
        console.error("Error saving wishlist:", error)
      }
      return newSet
    })
  }


  // 打开删除确认对话框
  const handleDeleteClick = (index: number) => {
    console.log("handleDeleteClick被调用，索引:", index)
    setItemToDelete(index)
    setDeleteConfirmOpen(true)
    console.log("已设置deleteConfirmOpen为true，itemToDelete为:", index)
  }

  // 确认删除志愿项
  const confirmDeleteWishlistItem = () => {
    if (typeof window === "undefined" || itemToDelete === null) {
      console.log("删除失败: window未定义或itemToDelete为null", itemToDelete)
      return
    }
    
    console.log("开始删除，索引:", itemToDelete)
    
    setWishlistItems((prevItems) => {
      console.log("删除前的items:", prevItems.length)
      const deletedItem = prevItems[itemToDelete]
      console.log("要删除的item:", deletedItem)
      
      const newItems = prevItems.filter((_, i) => i !== itemToDelete)
      console.log("删除后的items:", newItems.length)
      
      try {
        localStorage.setItem("wishlist-items", JSON.stringify(newItems))
        console.log("已保存到localStorage")
      } catch (error) {
        console.error("Error saving wishlist items:", error)
      }
      
      // 同时更新 wishlist Set
      if (deletedItem?.key) {
        setWishlist((prev) => {
          const newSet = new Set(prev)
          newSet.delete(deletedItem.key)
          try {
            localStorage.setItem("school-wishlist", JSON.stringify(Array.from(newSet)))
          } catch (error) {
            console.error("Error saving wishlist:", error)
          }
          return newSet
        })
      }
      
      return newItems
    })
    
    setDeleteConfirmOpen(false)
    setItemToDelete(null)
    console.log("删除完成")
  }

  // 上移志愿项
  const moveWishlistItemUp = (index: number) => {
    if (typeof window === "undefined" || index === 0) return // 已经是第一个，无法上移
    setWishlistItems((prevItems) => {
      const newItems = [...prevItems]
      ;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
      try {
        localStorage.setItem("wishlist-items", JSON.stringify(newItems))
      } catch (error) {
        console.error("Error saving wishlist items:", error)
      }
      return newItems
    })
  }

  // 下移志愿项
  const moveWishlistItemDown = (index: number) => {
    if (typeof window === "undefined") return
    
    setWishlistItems((prevItems) => {
      if (index === prevItems.length - 1) return prevItems // 已经是最后一个，无法下移
      const newItems = [...prevItems]
      ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
      try {
        localStorage.setItem("wishlist-items", JSON.stringify(newItems))
      } catch (error) {
        console.error("Error saving wishlist items:", error)
      }
      return newItems
    })
  }

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  // 删除确认对话框 - 放在组件顶层，两个tab都能访问
  const deleteDialog = (
    <AlertDialog open={deleteConfirmOpen} onOpenChange={(open) => {
      setDeleteConfirmOpen(open)
      if (!open) {
        setItemToDelete(null)
      }
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            确定要删除此志愿项吗？此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDeleteWishlistItem}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            确定删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  if (activeTab === "意向志愿") {
    // 只显示用户保存的志愿数据，不显示默认的 alternatives 数据
    const displayItems = wishlistItems

    if (displayItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 p-4 space-y-4">
          <div className="text-center space-y-2">
            <Search className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
            <p className="text-muted-foreground text-base">暂无志愿数据</p>
            <p className="text-sm text-muted-foreground/80">请先进行院校探索，添加心仪的志愿</p>
          </div>
          <Link href="/majors/intended?tab=专业赛道">
            <Button className="bg-[#1A4099] hover:bg-[#1A4099]/90 text-white">
              前往院校探索
            </Button>
          </Link>
        </div>
      )
    }

    // 使用 /majors 里面的数据计算前20%的专业
    // 从所有专业数据中获取热爱能量分数
    const allMajorsWithScores = data
      .map(item => ({
        code: item.major.code,
        name: item.major.name,
        score: parseFloat(item.major.score || "0")
      }))
      .filter(major => major.score > 0)
    
    // 按热爱能量分数降序排列
    const sortedAllMajors = [...allMajorsWithScores].sort((a, b) => b.score - a.score)
    
    // 计算前20%的数量（向上取整）
    const top20PercentThresholdIndex = sortedAllMajors.length > 0 
      ? Math.ceil(sortedAllMajors.length * 0.2) 
      : 0
    
    // 获取前20%的专业代码集合
    const top20PercentMajorCodes = new Set(
      sortedAllMajors.slice(0, top20PercentThresholdIndex).map(m => m.code)
    )
    
    // 找出用户志愿中属于前20%的专业
    const top20PercentInWishlist = displayItems.filter(item => {
      return top20PercentMajorCodes.has(item.majorCode)
    })
    
    const top20PercentCount = top20PercentInWishlist.length
    
    // 获取前20%的专业详细信息（用于展开显示）
    const top20PercentMajors = top20PercentInWishlist.map(item => ({
      ...item,
      displayScore: item.score || item.developmentPotential || "0"
    }))

    // 调试信息
    console.log("=== 提醒信息调试 ===")
    console.log("activeTab:", activeTab)
    console.log("displayItems.length:", displayItems.length)
    console.log("displayItems:", displayItems)
    console.log("allMajorsWithScores.length:", allMajorsWithScores.length)
    console.log("top20PercentMajorCodes.size:", top20PercentMajorCodes.size)
    console.log("top20PercentCount:", top20PercentCount)
    console.log("top20PercentMajors:", top20PercentMajors)
    console.log("显示条件:", displayItems.length > 0)

    return (
      <>
        <div className="flex-1 overflow-auto p-2 space-y-2">
          {displayItems.map((item, idx) => {
            const itemKey = item.key || `${item.majorCode}-${item.schoolName}-${idx}`
            return (
            <Card key={itemKey} className="p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    {/* 序号 */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1A4099] text-white flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-1 flex-wrap">
                        <h3 className="font-semibold text-base">{item.schoolName}</h3>
                        {item.schoolFeature && (
                          <div className="flex flex-wrap gap-1 ml-1">
                            {item.schoolFeature.split(",").slice(0, 3).map((feature: string, i: number) => (
                              <span key={i} className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-wrap mt-1">
                        <span className="text-xs text-muted-foreground font-semibold">
                          {item.majorName} ({item.majorCode})
                        </span>
                        {item.majorGroupName && (
                          <span className="text-xs text-muted-foreground">
                            专业组:{item.majorGroupName}
                          </span>
                        )}
                        {item.score && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">热爱能量:</span>
                            <span className="text-xs font-semibold text-blue-600">{item.score}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* 操作按钮 */}
                  <div 
                    className="flex items-center gap-1 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    {/* 上移按钮 */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        moveWishlistItemUp(idx)
                      }}
                      disabled={idx === 0}
                      className="h-8 w-8 p-0 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="上移"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    {/* 下移按钮 */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        moveWishlistItemDown(idx)
                      }}
                      disabled={idx === displayItems.length - 1}
                      className="h-8 w-8 p-0 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="下移"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    {/* 删除按钮 */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log("删除按钮onClick被触发，idx:", idx, "itemKey:", itemKey)
                        handleDeleteClick(idx)
                      }}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 text-muted-foreground"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {item.provinceName} · {item.cityName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>{item.belong}</span>
                  </div>
                </div>


                {item.historyScore && item.historyScore.length > 0 && item.historyScore[0].historyScore && (
                  <div className="mt-2 pt-2 border-t">
                    <button
                      onClick={() => {
                        setExpandedHistoryScores((prev) => {
                          const newSet = new Set(prev)
                          if (newSet.has(idx)) {
                            newSet.delete(idx)
                          } else {
                            newSet.add(idx)
                          }
                          return newSet
                        })
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>历年分数</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          expandedHistoryScores.has(idx) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedHistoryScores.has(idx) && (
                      <>
                        <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                          <div className="text-muted-foreground">年份</div>
                          <div className="text-muted-foreground">最低分</div>
                          <div className="text-muted-foreground">最低位次</div>
                          <div className="text-muted-foreground">招生数</div>
                          {item.historyScore[0].historyScore.slice(0, 3).map((score: any, i: number) => {
                            const [year, data] = Object.entries(score)[0]
                            const [minScore, minRank, planNum] = String(data).split(",")
                            return (
                              <React.Fragment key={i}>
                                <div className="font-medium">{year}</div>
                                <div>{minScore}</div>
                                <div>{minRank}</div>
                                <div>{planNum}</div>
                              </React.Fragment>
                            )
                          })}
                        </div>
                        {/* 批次和备注信息 */}
                        {(item.historyScore[0].batch || item.historyScore[0].remark) && (
                          <div className="mt-2">
                            <div className="p-1 border rounded text-xs text-muted-foreground">
                              {item.historyScore[0].batch && (
                                <span className="font-bold whitespace-nowrap">{item.historyScore[0].batch}</span>
                              )}
                              {item.historyScore[0].remark && (
                                <span className={item.historyScore[0].batch ? "ml-2" : ""}>{item.historyScore[0].remark}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
        {/* 添加更多志愿链接 */}
        <div className="p-2">
          <Link href="/majors/intended?tab=专业赛道">
            <Card className="p-4 border-2 border-dashed border-gray-300 hover:border-[#1A4099] hover:bg-[#1A4099]/5 transition-all cursor-pointer">
              <div className="flex items-center justify-center gap-2 text-[#1A4099]">
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">热爱能量高的专业({top20PercentCount}个)较少,继续添加</span>
              </div>
            </Card>
          </Link>
        </div>
        </div>
        {deleteDialog}
      </>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">暂无意向专业</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {data.map((item) => {
          return (
            <Card key={item.major.code} className="p-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <h3 className="font-semibold text-sm">{item.major.name}</h3>
                    <span className="text-xs text-muted-foreground">({item.major.code})</span>
                    {wishlistCounts[item.major.code] > 0 && (
                      <span className="inline-flex items-center text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {wishlistCounts[item.major.code]} 个志愿
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/majors/intended/schools?majorCode=${item.major.code}`}
                      className="flex items-center gap-1 text-base font-bold text-primary hover:underline"
                    >
                      <span>{item.schools.length}所</span>
                      <ChevronDown className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold">
                      本科
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-blue-600" />
                    <span className="text-muted-foreground">热爱能量:</span>
                    <span className="font-semibold text-blue-600">{item.major.score}</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50 transition-transform hover:scale-110"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      {deleteDialog}
    </div>
  )
}
