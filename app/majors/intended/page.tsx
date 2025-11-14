"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { BottomNav } from "@/components/bottom-nav"
import { TopNav } from "@/components/top-nav"
import IntendedMajorsClient from "./intended-majors-client"
import Link from "next/link"
import { FileText, ArrowLeft, MapPin, Lightbulb } from "lucide-react"

// 高考信息对话框组件
function ExamInfoDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedProvince, setSelectedProvince] = useState<string>("四川")
  const [firstChoice, setFirstChoice] = useState<"物理" | "历史" | null>("历史")
  const [optionalSubjects, setOptionalSubjects] = useState<Set<string>>(new Set(["政治", "地理"]))
  const [totalScore, setTotalScore] = useState<string>("580")
  const [ranking, setRanking] = useState<string>("9150")

  // 从本地存储加载数据
  useEffect(() => {
    if (open && typeof window !== "undefined") {
      try {
        const savedProvince = localStorage.getItem("examProvince")
        if (savedProvince) {
          setSelectedProvince(savedProvince)
        }
        const savedFirstChoice = localStorage.getItem("examFirstChoice")
        if (savedFirstChoice) {
          setFirstChoice(savedFirstChoice as "物理" | "历史")
        }
        const savedOptional = localStorage.getItem("examOptionalSubjects")
        if (savedOptional) {
          try {
            setOptionalSubjects(new Set(JSON.parse(savedOptional)))
          } catch (error) {
            console.error("Error loading optional subjects:", error)
          }
        }
        const savedScore = localStorage.getItem("examTotalScore")
        if (savedScore) {
          setTotalScore(savedScore)
        }
        const savedRanking = localStorage.getItem("examRanking")
        if (savedRanking) {
          setRanking(savedRanking)
        }
      } catch (error) {
        console.error("Error loading exam data:", error)
      }
    }
  }, [open])

  const handleOptionalToggle = (subject: string) => {
    setOptionalSubjects((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(subject)) {
        newSet.delete(subject)
      } else {
        if (newSet.size < 2) {
          newSet.add(subject)
        }
      }
      return newSet
    })
  }

  const handleConfirm = () => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem("examProvince", selectedProvince)
      if (firstChoice) {
        localStorage.setItem("examFirstChoice", firstChoice)
      }
      localStorage.setItem("examOptionalSubjects", JSON.stringify(Array.from(optionalSubjects)))
      localStorage.setItem("examTotalScore", totalScore)
      localStorage.setItem("examRanking", ranking)
    } catch (error) {
      console.error("Error saving exam data:", error)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md w-[calc(100vw-2rem)] sm:w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-center">高考信息</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
          {/* 高考省份 */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium flex-shrink-0">高考省份</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-sm">{selectedProvince}</span>
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
          </div>

          {/* 选择科目 */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">选择科目</h3>
            
            {/* 首选 (2选1) */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-muted-foreground">首选 (2选1)</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFirstChoice("物理")}
                className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                  firstChoice === "物理"
                    ? "bg-[#1A4099] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                }`}
              >
                物理
              </button>
              <button
                onClick={() => setFirstChoice("历史")}
                className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                  firstChoice === "历史"
                    ? "bg-[#1A4099] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                }`}
              >
                历史
              </button>
            </div>

            {/* 可选 (4选2) */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-muted-foreground">可选 (4选2)</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["化学", "生物", "政治", "地理"].map((subject) => (
                <button
                  key={subject}
                  onClick={() => handleOptionalToggle(subject)}
                  disabled={!optionalSubjects.has(subject) && optionalSubjects.size >= 2}
                  className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${
                    optionalSubjects.has(subject)
                      ? "bg-[#1A4099] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* 预估或实际总分 */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium flex-shrink-0">预估或实际总分</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Input
                type="number"
                value={totalScore}
                onChange={(e) => setTotalScore(e.target.value)}
                className="w-20 sm:w-24 h-9 sm:h-8 text-sm text-right"
              />
              <span className="text-muted-foreground hidden sm:inline">»</span>
            </div>
          </div>

          {/* 高考排名 */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium flex-shrink-0">高考排名</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Input
                type="number"
                value={ranking}
                onChange={(e) => setRanking(e.target.value)}
                className="w-20 sm:w-24 h-9 sm:h-8 text-sm text-right"
              />
              <span className="text-muted-foreground hidden sm:inline">»</span>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="flex items-start gap-2 p-2.5 sm:p-2 bg-yellow-50 rounded-lg">
            <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800 leading-relaxed">
              输入分数后系统将自动获取排名位次
            </p>
          </div>

          {/* 确认按钮 */}
          <Button
            onClick={handleConfirm}
            className="w-full bg-[#1A4099] hover:bg-[#1A4099]/90 active:bg-[#1A4099]/80 text-white h-11 sm:h-12 text-sm sm:text-base font-semibold min-h-[44px]"
          >
            确认
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 使用 useSearchParams 的组件，需要用 Suspense 包裹
function IntendedMajorsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<"专业赛道" | "意向志愿">("专业赛道")
  const [showExamInfoDialog, setShowExamInfoDialog] = useState(false)
  const [currentScore, setCurrentScore] = useState<number>(580) // 当前高考得分（中间显示）
  const [scoreRange, setScoreRange] = useState<[number, number]>([500, 650]) // 分数区间 [最小值, 最大值]
  const [isDragging, setIsDragging] = useState(false) // 是否正在拖动滑块

  // 从 URL 参数读取 tab，如果没有则默认为"专业赛道"
  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam === "意向志愿") {
      setActiveTab("意向志愿")
    } else {
      setActiveTab("专业赛道")
    }
  }, [searchParams])

  // 从本地存储加载分数（仅在初始化时）
  useEffect(() => {
    if (typeof window === "undefined") return
    
    try {
      const savedScore = localStorage.getItem("examTotalScore")
      let parsedScore = 580
      
      if (savedScore) {
        const parsed = parseInt(savedScore, 10)
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 750) {
          parsedScore = parsed
        }
      }
      
      setCurrentScore(parsedScore)
      
      // 尝试加载已保存的区间
      const savedRange = localStorage.getItem("scoreRange")
      if (savedRange) {
        try {
          const range = JSON.parse(savedRange)
          if (Array.isArray(range) && range.length === 2 && 
              range[0] >= 0 && range[0] <= 750 && 
              range[1] >= 0 && range[1] <= 750 &&
              range[0] <= range[1]) {
            setScoreRange([range[0], range[1]])
            return
          }
        } catch (error) {
          console.error("Error parsing scoreRange:", error)
        }
      }
      
      // 如果没有保存的区间，以当前分数为中心，设置默认区间（当前分数±50分）
      const minScore = Math.max(0, parsedScore - 50)
      const maxScore = Math.min(750, parsedScore + 50)
      setScoreRange([minScore, maxScore])
    } catch (error) {
      console.error("Error loading score data:", error)
    }
  }, []) // 只在组件挂载时执行一次

  // 监听分数区间变化
  const handleScoreRangeChange = (value: number[]) => {
    if (value && value.length === 2) {
      const [min, max] = value
      // 确保最小值小于等于最大值
      if (min <= max) {
        setScoreRange([min, max])
        // 立即保存区间到localStorage
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("scoreRange", JSON.stringify([min, max]))
          } catch (error) {
            console.error("Error saving score range:", error)
          }
        }
      }
    }
  }

  // 处理滑块拖动开始
  const handleSliderPointerDown = () => {
    setIsDragging(true)
  }

  // 处理滑块拖动结束
  const handleSliderPointerUp = () => {
    setIsDragging(false)
    // 确保最终值保存
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("scoreRange", JSON.stringify(scoreRange))
      } catch (error) {
        console.error("Error saving score range:", error)
      }
    }
  }

  // 根据 tab 参数决定显示的标题
  const tabParam = searchParams.get("tab")
  const pageTitle = tabParam === "意向志愿" ? "志愿填报" : "院校探索"
  const pageDescription = tabParam === "意向志愿" 
    ? "基于天赋匹配的智能志愿推荐" 
    : "探索各专业对应的院校"
  const isProfessionalTrack = tabParam !== "意向志愿"

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16">
      <TopNav />
      <div className="bg-gradient-to-b from-[#1A4099] via-[#2563eb] to-[#2563eb]/80 text-white px-4 pt-6 pb-8 relative">
        <div className="max-w-lg mx-auto">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-1">
              <div>
                <h1 className="text-xl font-bold">{pageTitle}</h1>
                <p className="text-white/90 text-xs mt-1">{pageDescription}</p>
              </div>
            </div>
            <button
              onClick={() => setShowExamInfoDialog(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
            >
              <FileText className="w-4 h-4" />
              高考信息
            </button>
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

      {/* 分数区间筛选条 - 仅在专业赛道tab显示 */}
      {isProfessionalTrack && (
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="max-w-lg mx-auto">
            {/* 双滑块 - 区间筛选 */}
            <div 
              className="px-2 pb-1 relative"
              onPointerDown={handleSliderPointerDown}
              onPointerUp={handleSliderPointerUp}
              onPointerLeave={handleSliderPointerUp}
            >
              <Slider
                value={scoreRange}
                onValueChange={handleScoreRangeChange}
                min={0}
                max={750}
                step={1}
                className="w-full"
              />
              {/* 当前分数显示在滑块轴上，根据当前分数位置定位 */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-10"
                style={{
                  left: `calc(${(currentScore / 750) * 100}% - 12px)`,
                }}
              >
                <div className="bg-[#1A4099] text-white px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-sm">
                  {currentScore}
                </div>
              </div>
            </div>
            {/* 区间显示和左右标签 */}
            <div className="flex justify-between items-center text-[10px] mt-1 px-2">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">最低:</span>
                <span className="font-semibold text-[#1A4099]">{scoreRange[0]}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">区间:</span>
                <span className="font-semibold text-[#FF7F50]">
                  {scoreRange[0]}-{scoreRange[1]}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">最高:</span>
                <span className="font-semibold text-[#1A4099]">{scoreRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1">
        <div className="max-w-lg mx-auto">
          <IntendedMajorsClient activeTab={activeTab} />
        </div>
      </div>

      <BottomNav />
      <ExamInfoDialog open={showExamInfoDialog} onOpenChange={setShowExamInfoDialog} />
    </div>
  )
}

// 加载中的占位组件
function IntendedMajorsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-16">
      <TopNav />
      <div className="bg-[#1A4099] text-white px-4 pt-6 pb-8 relative">
        <div className="max-w-lg mx-auto">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-1">
              <div className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">
                  院校探索 <span className="text-base font-normal">探索各专业对应的院校</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-4 bg-background"
          style={{
            clipPath: "ellipse(70% 100% at 50% 100%)",
          }}
        ></div>
      </div>
      <div className="flex-1">
        <div className="max-w-lg mx-auto p-4">
          <div className="text-center text-muted-foreground">加载中...</div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

export default function IntendedMajorsPage() {
  return (
    <Suspense fallback={<IntendedMajorsLoading />}>
      <IntendedMajorsContent />
    </Suspense>
  )
}
