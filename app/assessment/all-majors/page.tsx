"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { TopNav } from "@/components/top-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
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
import questionnaireData from "@/data/questionnaire.json"

interface Option {
  id: number
  scaleId: number
  optionName: string
  optionValue: number
  displayOrder: number
  additionalInfo: string
}

interface Question {
  id: number
  content: string
  elementId: number
  type: string
  direction: string
  dimension: string
  action: string
  options: Option[]
}

const STORAGE_KEY = "questionnaire_answers"
const PREVIOUS_ANSWERS_KEY = "questionnaire_previous_answers"

const DIMENSION_ORDER = ["看", "听", "说", "记", "想", "做", "运动"]

function sortQuestions(questions: Question[]): Question[] {
  return [...questions].sort((a, b) => {
    const aDimensionIndex = DIMENSION_ORDER.indexOf(a.dimension)
    const bDimensionIndex = DIMENSION_ORDER.indexOf(b.dimension)

    if (aDimensionIndex !== bDimensionIndex) {
      if (aDimensionIndex === -1) return 1
      if (bDimensionIndex === -1) return -1
      return aDimensionIndex - bDimensionIndex
    }

    if (a.type !== b.type) {
      return a.type === "like" ? -1 : 1
    }
    return a.id - b.id
  })
}

function loadAnswersFromStorage(): Record<number, number> {
  if (typeof window === "undefined") return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error("[v0] Failed to load answers from localStorage:", error)
    return {}
  }
}

function saveAnswersToStorage(answers: Record<number, number>) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  } catch (error) {
    console.error("[v0] Failed to save answers to localStorage:", error)
  }
}

function loadPreviousAnswersFromStorage(): Record<number, number> {
  if (typeof window === "undefined") return {}
  try {
    const stored = localStorage.getItem(PREVIOUS_ANSWERS_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error("[v0] Failed to load previous answers from localStorage:", error)
    return {}
  }
}

function savePreviousAnswersToStorage(answers: Record<number, number>) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(PREVIOUS_ANSWERS_KEY, JSON.stringify(answers))
  } catch (error) {
    console.error("[v0] Failed to save previous answers to localStorage:", error)
  }
}

function findFirstUnansweredIndex(questions: Question[], answers: Record<number, number>): number {
  const index = questions.findIndex((q) => !(q.id in answers))
  return index === -1 ? 0 : index
}

export default function AllMajorsAssessmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const sortedQuestions = sortQuestions(questionnaireData as Question[])
  const totalQuestions = sortedQuestions.length

  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [previousAnswers, setPreviousAnswers] = useState<Record<number, number>>({})
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [progressAnimation, setProgressAnimation] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)

  useEffect(() => {
    const storedAnswers = loadAnswersFromStorage()
    const storedPreviousAnswers = loadPreviousAnswersFromStorage()
    setAnswers(storedAnswers)
    setPreviousAnswers(storedPreviousAnswers)

    const firstUnanswered = findFirstUnansweredIndex(sortedQuestions, storedAnswers)
    setCurrentIndex(firstUnanswered)

    // 如果答案数量不等于总题目数，确保完成状态为 false
    const answeredCount = Object.keys(storedAnswers).length
    if (answeredCount !== totalQuestions) {
      setIsCompleted(false)
    }

    setIsInitialized(true)
  }, [totalQuestions])

  const currentQuestion = sortedQuestions[currentIndex]
  const currentDimension = currentQuestion?.dimension || ""
  const questionsInCurrentDimension = sortedQuestions.filter((q) => q.dimension === currentDimension)
  const answeredInCurrentDimension = questionsInCurrentDimension.filter((q) => q.id in answers).length
  const totalInCurrentDimension = questionsInCurrentDimension.length

  const answeredCount = Object.keys(answers).length
  const completedDimensions = DIMENSION_ORDER.filter((dim) => {
    const dimQuestions = sortedQuestions.filter((q) => q.dimension === dim)
    const dimAnswered = dimQuestions.filter((q) => q.id in answers).length
    return dimAnswered === dimQuestions.length
  }).length
  
  // 完成168题后解锁功能
  const UNLOCK_THRESHOLD = 168
  const isUnlocked = answeredCount >= UNLOCK_THRESHOLD

  // 处理重新探索：保存当前答案为上一次答案，清空当前答案，计数归零
  const handleRestartExploration = () => {
    // 显示确认对话框
    setShowRestartConfirm(true)
  }

  // 确认重新探索
  const confirmRestartExploration = () => {
    // 保存当前答案为上一次答案
    if (Object.keys(answers).length > 0) {
      savePreviousAnswersToStorage(answers)
      setPreviousAnswers(answers)
    }
    // 清空当前答案
    const emptyAnswers: Record<number, number> = {}
    setAnswers(emptyAnswers)
    saveAnswersToStorage(emptyAnswers)
    // 重置完成状态
    setIsCompleted(false)
    // 回到第一题
    setCurrentIndex(0)
    // 关闭确认对话框
    setShowRestartConfirm(false)
    // 显示提示
    toast({
      title: "已开始重新探索",
      description: "已保存上一次的答案作为参考，您可以查看提示",
      duration: 3000,
      className: "bg-white border-2 border-[#FF7F50] shadow-lg",
    })
  }

  const dimensionProgress = DIMENSION_ORDER.map((dim) => {
    const dimQuestions = sortedQuestions.filter((q) => q.dimension === dim)
    const dimAnswered = dimQuestions.filter((q) => q.id in answers).length
    const dimTotal = dimQuestions.length
    return {
      dimension: dim,
      answered: dimAnswered,
      total: dimTotal,
      progress: dimTotal > 0 ? (dimAnswered / dimTotal) * 100 : 0,
    }
  })

  const unifiedProgressColor = "#FF7F50" // Orange accent color

  const handleAnswer = (optionValue: number) => {
    if (!currentQuestion) return

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: optionValue,
    }
    setAnswers(newAnswers)
    saveAnswersToStorage(newAnswers)

    const answeredCount = Object.keys(newAnswers).length

    console.log("[v0] Question answered. Total answered:", answeredCount)

    if (answeredCount % 24 === 0 && answeredCount < totalQuestions) {
      const completedDimensionIndex = Math.floor(answeredCount / 24) - 1
      const dimensionName = DIMENSION_ORDER[completedDimensionIndex]

      console.log("[v0] Dimension completed! Dimension:", dimensionName, "Count:", answeredCount)

      setProgressAnimation(true)
      setTimeout(() => setProgressAnimation(false), 1000)

      // 计算个人特质解锁项数（已完成的维度数）
      const completedDimensionsCount = DIMENSION_ORDER.filter((dim) => {
        const dimQuestions = sortedQuestions.filter((q) => q.dimension === dim)
        const dimAnswered = dimQuestions.filter((q) => q.id in newAnswers).length
        return dimAnswered === dimQuestions.length
      }).length

      // 计算匹配专业数（每20题一个专业）
      const matchedMajorsCount = Math.floor(answeredCount / 20)

      toast({
        title: `🎉 维度解锁：${dimensionName}！`,
        description: `个人特质已解锁${completedDimensionsCount}项，已匹配专业${matchedMajorsCount}个`,
        duration: 3500,
        className: "bg-white border-2 border-[#FF7F50] shadow-lg",
      })
    }

    if (answeredCount === totalQuestions) {
      console.log("[v0] All questions completed! Showing celebration")
      setTimeout(() => {
        setIsCompleted(true)
        setTimeout(() => {
          router.push("/majors")
        }, 3000)
      }, 500)
      return
    }

    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, 200)
    }
  }

  const handleJumpToDimension = (dimensionIndex: number) => {
    const startIndex = dimensionIndex * 24
    setCurrentIndex(startIndex)
  }

  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#1A4099]/10 to-[#FF7F50]/10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: i % 2 === 0 ? "#FF7F50" : "#1A4099",
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <Card className="p-8 max-w-md w-full mx-4 text-center relative overflow-hidden shadow-2xl z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF7F50]/5 to-[#1A4099]/5" />

          <div className="relative z-10">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#FF7F50] to-[#1A4099] flex items-center justify-center mx-auto mb-6 animate-bounce shadow-2xl">
              <Sparkles className="w-16 h-16 text-white" />
            </div>

            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#1A4099] to-[#FF7F50] bg-clip-text text-transparent">
              🎉 评估完成！
            </h2>

            <p className="text-base text-muted-foreground mb-6 leading-relaxed">
              恭喜您完成所有168题评估！
              <br />
              系统正在为您生成专业匹配报告...
            </p>

            <div className="bg-gradient-to-r from-[#1A4099]/10 to-[#FF7F50]/10 rounded-lg p-5 mb-6 space-y-2">
              <p className="text-sm font-bold text-[#1A4099] mb-3">您将获得</p>
              <div className="space-y-2 text-sm text-muted-foreground text-left">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF7F50]" />
                  <p>完整的天赋画像分析</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF7F50]" />
                  <p>前10个最匹配专业推荐</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF7F50]" />
                  <p>详细的专业契合度报告</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-[#FF7F50] animate-pulse" />
              <span>正在跳转到专业推荐页面...</span>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <PageContainer>
        <div className="p-4">
          <p className="text-center text-muted-foreground">加载中...</p>
        </div>
      </PageContainer>
    )
  }

  const progress = ((currentIndex + 1) / totalQuestions) * 100
  const sortedOptions = [...currentQuestion.options].sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <Toaster />
      <TopNav />

      <div className="fixed top-14 left-0 right-0 bg-[#1A4099] text-white px-4 py-3 z-50 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8"></div>
          <div className={`text-sm font-medium transition-all ${progressAnimation ? "scale-110 text-[#FF7F50]" : ""}`}>
            第 {currentIndex + 1} 题 / {totalQuestions}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("确定要清除所有答题数据吗？此操作不可恢复。")) {
                localStorage.removeItem(STORAGE_KEY)
                window.location.reload()
              }
            }}
            className="text-white/70 hover:text-white hover:bg-white/20 h-8 px-2 text-xs"
            title="清除答题数据"
          >
            清除
          </Button>
        </div>

        <div className="space-y-1">
          <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-white/20">
            {dimensionProgress.map((dim, index) => (
              <div
                key={dim.dimension}
                onClick={() => handleJumpToDimension(index)}
                className={`flex-1 relative transition-all cursor-pointer hover:opacity-80 ${progressAnimation && dim.progress > 0 ? "animate-pulse" : ""}`}
                style={{
                  backgroundColor: `rgba(255, 127, 80, 0.2)`, // Unified background color
                }}
                title={`跳转到${dim.dimension}维度`}
              >
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${dim.progress}%`,
                    backgroundColor: unifiedProgressColor, // Unified progress color
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xs text-white/70 px-0.5">
            {DIMENSION_ORDER.map((dim, index) => (
              <div
                key={dim}
                onClick={() => handleJumpToDimension(index)}
                className="flex-1 text-center cursor-pointer hover:opacity-80 transition-opacity font-bold"
                style={{
                  color: dimensionProgress[index].progress > 0 ? unifiedProgressColor : "rgba(255,255,255,0.5)", // Unified label color
                }}
                title={`跳转到${dim}维度`}
              >
                {dim}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-white/80 mt-2 text-center">
          当前：{currentDimension} 维度 {answeredInCurrentDimension}/{totalInCurrentDimension}
        </div>
      </div>

      <div className="flex-1 px-4 pt-40 pb-32 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6 shadow-lg mb-4">
            <div className="mb-6">
              <div className="inline-block px-3 py-1 rounded-full bg-[#1A4099]/10 text-[#1A4099] text-xs font-medium mb-3">
                {currentQuestion.dimension} · {currentQuestion.type === "like" ? "喜欢" : "天赋"}
              </div>
              <h2 className="text-xl font-bold leading-relaxed text-[#1A4099]">{currentQuestion.content}</h2>
            </div>

            <div className="space-y-3">
              {sortedOptions.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.optionValue
                // 只有当该题目还没有被重新答题时，才显示"上次选择"标识
                const hasCurrentAnswer = currentQuestion.id in answers
                const wasPreviousAnswer = !hasCurrentAnswer && previousAnswers[currentQuestion.id] === option.optionValue
                return (
                  <Button
                    key={option.id}
                    onClick={() => handleAnswer(option.optionValue)}
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full h-auto py-4 px-4 text-left justify-start transition-all whitespace-normal relative ${
                      isSelected
                        ? "bg-[#FF7F50] hover:bg-[#FF6A3D] text-white border-[#FF7F50]"
                        : wasPreviousAnswer
                        ? "hover:border-[#1A4099] hover:bg-[#1A4099]/5 border-[#FF7F50]/50 bg-[#FF7F50]/5"
                        : "hover:border-[#1A4099] hover:bg-[#1A4099]/5"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base break-words">{option.optionName}</span>
                      {wasPreviousAnswer && (
                        <span className="text-xs px-2 py-0.5 bg-[#FF7F50]/20 text-[#FF7F50] font-medium rounded-full ml-2 flex-shrink-0">
                          上次选择
                        </span>
                      )}
                    </div>
                  </Button>
                )
              })}
            </div>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-3">
          {isUnlocked ? (
            <>
              <Button
                onClick={handleRestartExploration}
                variant="outline"
                className="flex-1 h-12 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                重新探索
              </Button>
              <Button
                onClick={() => router.push("/majors")}
                className="flex-1 h-12 bg-[#FF7F50] hover:bg-[#FF6A3D] text-white"
              >
                已完成，探索专业
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                variant="outline"
                className="flex-1 h-12 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                上一题
              </Button>
              <Button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                disabled={currentIndex === totalQuestions - 1}
                className="flex-1 h-12 bg-[#FF7F50] hover:bg-[#FF6A3D] text-white"
              >
                下一题
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 重新探索确认对话框 */}
      <AlertDialog open={showRestartConfirm} onOpenChange={setShowRestartConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认重新探索</AlertDialogTitle>
            <AlertDialogDescription>
              确定要重新探索吗？当前答案将被保存为参考，答题进度将归零重新开始。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRestartExploration}
              className="bg-[#FF7F50] hover:bg-[#FF6A3D] text-white"
            >
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
