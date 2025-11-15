"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { Search, Star, ChevronDown, ChevronUp, Loader2, Trash2, Eye, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TopNav } from "@/components/top-nav"

interface MajorScore {
  majorCode: string
  majorName: string
  majorBrief: string
  eduLevel: string
  score: string
  lexueScore: string
  shanxueScore: string
  schoolCount: string
}

interface UserScoreData {
  userId: string
  scores: MajorScore[]
}

export default function FavoriteMajorsClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [intendedMajors, setIntendedMajors] = useState<Set<string>>(new Set())
  const [allMajorsData, setAllMajorsData] = useState<UserScoreData | null>(null)
  const [expandedBriefs, setExpandedBriefs] = useState<Set<string>>(new Set())
  const [completedExplorations, setCompletedExplorations] = useState<Set<string>>(new Set())
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [majorToDelete, setMajorToDelete] = useState<string | null>(null)

  // 从 localStorage 读取心动专业列表
  useEffect(() => {
    const stored = localStorage.getItem("intendedMajors")
    if (stored) {
      try {
        setIntendedMajors(new Set(JSON.parse(stored)))
      } catch (error) {
        console.error("[v0] Error loading intended majors:", error)
      }
    }
  }, [])

  // 加载所有专业数据
  useEffect(() => {
    fetch("/data/user-score.json")
      .then((res) => res.json())
      .then((json) => {
        setAllMajorsData(json.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Error loading user score data:", error)
        setLoading(false)
      })
  }, [])

  // 监听 localStorage 变化
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("intendedMajors")
      if (stored) {
        try {
          setIntendedMajors(new Set(JSON.parse(stored)))
        } catch (error) {
          console.error("[v0] Error loading intended majors:", error)
        }
      } else {
        setIntendedMajors(new Set())
      }
    }

    // 监听 storage 事件（跨标签页）
    window.addEventListener("storage", handleStorageChange)
    
    // 定期检查（同标签页内）
    const interval = setInterval(handleStorageChange, 500)
    
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // 打开删除确认对话框
  const handleDeleteClick = (majorCode: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setMajorToDelete(majorCode)
    setDeleteConfirmOpen(true)
  }

  // 确认删除心动专业
  const confirmDelete = () => {
    if (majorToDelete) {
      setIntendedMajors((prev) => {
        const newSet = new Set(prev)
        newSet.delete(majorToDelete)
        localStorage.setItem("intendedMajors", JSON.stringify(Array.from(newSet)))
        return newSet
      })
    }
    setDeleteConfirmOpen(false)
    setMajorToDelete(null)
  }

  const toggleBrief = (majorCode: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setExpandedBriefs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(majorCode)) {
        newSet.delete(majorCode)
      } else {
        newSet.add(majorCode)
      }
      return newSet
    })
  }

  // 获取心动专业列表
  const favoriteMajors = allMajorsData?.scores.filter((major) => intendedMajors.has(major.majorCode)) || []

  // 过滤搜索结果
  const filteredMajors = favoriteMajors.filter((major) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return major.majorName.toLowerCase().includes(query) || major.majorCode.toLowerCase().includes(query)
  })

  // 默认设置前两个专业为已完成职业探索（用于展示）
  useEffect(() => {
    if (filteredMajors.length > 0 && completedExplorations.size === 0) {
      const firstTwo = filteredMajors.slice(0, 2).map((major) => major.majorCode)
      setCompletedExplorations(new Set(firstTwo))
    }
  }, [filteredMajors.length])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">加载中...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <TopNav />
      {/* Header with curved bottom - 模仿 /majors 页面 */}
      <div className="bg-[#1A4099] text-white px-4 pt-6 pb-8 relative">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-xl font-bold">心动专业列表</h1>
            <p className="text-white/90 text-xs">共 {intendedMajors.size} 个心动专业</p>
          </div>
        </div>
        {/* Wave effect at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-4 bg-background"
          style={{
            clipPath: "ellipse(70% 100% at 50% 100%)",
          }}
        ></div>
      </div>
      
      {/* 固定按钮 - 当有数据时显示 */}
      {intendedMajors.size > 0 && (
        <div className="fixed bottom-20 right-4 z-40">
          <Link href="/majors">
            <Button
              className="bg-[#1A4099] hover:bg-[#2563eb] text-white shadow-lg rounded-full w-16 h-16 p-0 flex items-center justify-center"
              size="sm"
            >
              <span className="text-xs font-medium leading-tight">所有专业</span>
            </Button>
          </Link>
        </div>
      )}
      
      <div className="max-w-lg mx-auto">
        <div className="px-4 pt-4 pb-6 space-y-4">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索专业名称或代码..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {/* 心动专业列表 */}
        {filteredMajors.length === 0 ? (
          <Card className="p-8 text-center">
            {intendedMajors.size === 0 ? (
              <div className="space-y-4">
                <Star className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">暂无心动专业</p>
                <p className="text-xs text-muted-foreground mb-4">
                  在专业列表页面点击星星图标可以添加心动专业
                </p>
                <Link href="/majors" className="text-[#1A4099] hover:text-[#FF7F50] font-medium text-sm underline transition-colors">
                  前往所有专业页面探索 →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <Search className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">未找到匹配的专业</p>
                <p className="text-xs text-muted-foreground">请尝试其他搜索关键词</p>
              </div>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredMajors.map((major) => (
              <Card key={major.majorCode} className="p-4 border">
                <div className="space-y-3">
                  <Link href={`/assessment/single-major?code=${major.majorCode}`}>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-base text-[#1A4099] hover:text-[#FF7F50] transition-colors">
                              {major.majorName}
                            </h3>
                            <span className="text-xs text-muted-foreground">({major.majorCode})</span>
                            <span className="inline-flex items-center text-xs font-bold bg-[#FF7F50]/10 text-[#FF7F50] px-2 py-0.5 rounded-full">
                              热爱能量: {major.score}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-1">
                        <p
                          className={`text-xs text-muted-foreground leading-snug flex-1 ${
                            expandedBriefs.has(major.majorCode) ? "" : "line-clamp-1"
                          }`}
                        >
                          {major.majorBrief}
                        </p>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleBrief(major.majorCode, e)
                          }}
                          className="flex-shrink-0 text-[#1A4099] hover:text-[#FF7F50] transition-colors"
                          aria-label={expandedBriefs.has(major.majorCode) ? "收起" : "展开"}
                        >
                          {expandedBriefs.has(major.majorCode) ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </Link>

                  {/* 操作按钮区域 */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleDeleteClick(major.majorCode, e)}
                      className="flex-1 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      删除
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        router.push(`/assessment/career-exploration?code=${major.majorCode}`)
                      }}
                      className="flex-1 text-[#1A4099] border-[#1A4099] hover:bg-[#1A4099]/10 relative"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      深度了解
                      {completedExplorations.has(major.majorCode) && (
                        <CheckCircle2 className="w-4 h-4 ml-2 text-green-600 fill-green-600" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要从心动专业列表中删除此专业吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              确定删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

