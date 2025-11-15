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

// 查找所有未答题的题目索引
function findUnansweredQuestions(questions: Question[], answers: Record<number, number>): number[] {
  return questions
    .map((q, index) => (!(q.id in answers) ? index : -1))
    .filter((index) => index !== -1)
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
  const [showUnansweredDialog, setShowUnansweredDialog] = useState(false)
  const [showUnansweredBlink, setShowUnansweredBlink] = useState(false)
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false)

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

  // 当题目切换时，清除闪烁状态
  useEffect(() => {
    setShowUnansweredBlink(false)
  }, [currentIndex])

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

    // 清除闪烁状态
    setShowUnansweredBlink(false)

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
    setShowUnansweredBlink(false)
    setCurrentIndex(startIndex)
  }

  // 检查当前题目是否已回答
  const isCurrentQuestionAnswered = currentQuestion ? currentQuestion.id in answers : false

  // 获取所有未答题的题目索引
  const unansweredIndices = findUnansweredQuestions(sortedQuestions, answers)

  // 跳转到下一题（需要先答题）
  const handleNextQuestion = () => {
    if (!isCurrentQuestionAnswered) {
      // 触发闪烁提示
      setShowUnansweredBlink(true)
      // 3秒后自动停止闪烁
      setTimeout(() => {
        setShowUnansweredBlink(false)
      }, 3000)
      
      toast({
        title: "请先回答当前题目",
        description: "您需要先选择答案才能跳转到下一题",
        duration: 2000,
        className: "bg-white border-2 border-[#FF7F50] shadow-lg",
      })
      return
    }

    // 清除闪烁状态
    setShowUnansweredBlink(false)

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  // 跳转到第一个未答题的题目
  const handleJumpToFirstUnanswered = () => {
    if (unansweredIndices.length === 0) {
      toast({
        title: "所有题目已完成",
        description: "恭喜您，所有题目都已回答完毕！",
        duration: 2000,
        className: "bg-white border-2 border-[#FF7F50] shadow-lg",
      })
      return
    }

    const firstUnansweredIndex = unansweredIndices[0]
    setShowUnansweredBlink(false)
    setCurrentIndex(firstUnansweredIndex)
    setShowUnansweredDialog(false)
    toast({
      title: "已跳转到漏答题",
      description: `第 ${firstUnansweredIndex + 1} 题`,
      duration: 2000,
      className: "bg-white border-2 border-[#FF7F50] shadow-lg",
    })
  }

  // 跳转到指定的未答题题目
  const handleJumpToUnanswered = (index: number) => {
    setShowUnansweredBlink(false)
    setCurrentIndex(index)
    setShowUnansweredDialog(false)
    toast({
      title: "已跳转",
      description: `第 ${index + 1} 题`,
      duration: 1500,
      className: "bg-white border-2 border-[#FF7F50] shadow-lg",
    })
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
      {/* 闪烁动画样式 */}
      <style jsx global>{`
        @keyframes blink-unanswered {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(255, 127, 80, 0.7);
          }
          50% {
            opacity: 0.85;
            box-shadow: 0 0 0 10px rgba(255, 127, 80, 0);
          }
        }
        .blink-unanswered {
          animation: blink-unanswered 1.5s ease-in-out infinite;
          border: 2px solid #FF7F50 !important;
        }
        @keyframes progress-blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
        .blink-progress {
          animation: progress-blink 1.5s ease-in-out infinite;
        }
        @keyframes button-blink {
          0%, 100% {
            background-color: rgba(255, 127, 80, 0.2);
            color: rgba(255, 255, 255, 0.9);
          }
          50% {
            background-color: rgba(255, 127, 80, 0.4);
            color: rgba(255, 255, 255, 1);
          }
        }
        .blink-button {
          animation: button-blink 1.2s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed top-14 left-0 right-0 bg-[#1A4099] text-white px-4 py-3 z-50 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8"></div>
          <div className={`text-sm font-medium transition-all ${progressAnimation ? "scale-110 text-[#FF7F50]" : ""}`}>
            第 {currentIndex + 1} 题 / {totalQuestions}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowClearDataConfirm(true)}
            className="text-white/70 hover:text-white hover:bg-white/20 h-8 px-2 text-xs"
            title="清除答题数据"
          >
            清除
          </Button>
        </div>

        <div className="space-y-1">
          <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-white/20">
            {dimensionProgress.map((dim, index) => {
              // 检查该维度是否有未答题的题目
              const dimQuestions = sortedQuestions.filter((q) => q.dimension === dim.dimension)
              const dimUnanswered = dimQuestions.some((q) => !(q.id in answers))
              const hasUnanswered = dimUnanswered && dim.progress < 100
              
              return (
                <div
                  key={dim.dimension}
                  onClick={() => handleJumpToDimension(index)}
                  className={`flex-1 relative transition-all cursor-pointer hover:opacity-80 ${progressAnimation && dim.progress > 0 ? "animate-pulse" : ""} ${hasUnanswered ? "blink-progress" : ""}`}
                  style={{
                    backgroundColor: `rgba(255, 127, 80, 0.2)`, // Unified background color
                  }}
                  title={`跳转到${dim.dimension}维度${hasUnanswered ? '（有未答题）' : ''}`}
                >
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${dim.progress}%`,
                      backgroundColor: unifiedProgressColor, // Unified progress color
                    }}
                  />
                </div>
              )
            })}
          </div>

          <div className="flex justify-between text-xs text-white/70 px-0.5">
            {DIMENSION_ORDER.map((dim, index) => {
              // 检查该维度是否有未答题的题目
              const dimQuestions = sortedQuestions.filter((q) => q.dimension === dim)
              const dimUnanswered = dimQuestions.some((q) => !(q.id in answers))
              const hasUnanswered = dimUnanswered && dimensionProgress[index].progress < 100
              
              return (
                <div
                  key={dim}
                  onClick={() => handleJumpToDimension(index)}
                  className={`flex-1 text-center cursor-pointer hover:opacity-80 transition-opacity font-bold ${hasUnanswered ? "blink-progress" : ""}`}
                  style={{
                    color: dimensionProgress[index].progress > 0 ? unifiedProgressColor : "rgba(255,255,255,0.5)", // Unified label color
                  }}
                  title={`跳转到${dim}维度${hasUnanswered ? '（有未答题）' : ''}`}
                >
                  {dim}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-white/80">
            当前：{currentDimension} 维度 {answeredInCurrentDimension}/{totalInCurrentDimension}
          </div>
          {unansweredIndices.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUnansweredDialog(true)}
              className="text-xs h-6 px-2 text-white/90 hover:text-white hover:bg-white/20 blink-button"
            >
              漏答 {unansweredIndices.length} 题
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 pt-40 pb-32 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <Card className={`p-6 shadow-lg mb-4 ${showUnansweredBlink && !isCurrentQuestionAnswered ? 'blink-unanswered' : ''}`}>
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
                onClick={() => {
                  setShowUnansweredBlink(false)
                  setCurrentIndex((prev) => Math.max(0, prev - 1))
                }}
                disabled={currentIndex === 0}
                variant="outline"
                className="flex-1 h-12 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                上一题
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={currentIndex === totalQuestions - 1}
                className="flex-1 h-12 bg-[#FF7F50] hover:bg-[#FF6A3D] text-white disabled:opacity-50"
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

      {/* 漏答题提示对话框 */}
      <AlertDialog open={showUnansweredDialog} onOpenChange={setShowUnansweredDialog}>
        <AlertDialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <AlertDialogHeader>
            <AlertDialogTitle>漏答题提示</AlertDialogTitle>
            <AlertDialogDescription>
              检测到 {unansweredIndices.length} 道题目未回答，请完成所有题目后再提交。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex-1 overflow-y-auto py-4">
            {unansweredIndices.length > 0 ? (
              <div className="space-y-2">
                <Button
                  onClick={handleJumpToFirstUnanswered}
                  className="w-full bg-[#FF7F50] hover:bg-[#FF6A3D] text-white"
                >
                  跳转到第一道漏答题（第 {unansweredIndices[0] + 1} 题）
                </Button>
                <div className="text-sm text-muted-foreground mb-2">所有漏答题列表：</div>
                <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                  {unansweredIndices.map((index) => {
                    const question = sortedQuestions[index]
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleJumpToUnanswered(index)}
                        className="h-10 text-xs"
                      >
                        第 {index + 1} 题
                        <br />
                        <span className="text-[10px] opacity-70">{question.dimension}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                所有题目已完成！
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>关闭</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 清除数据确认对话框 */}
      <AlertDialog open={showClearDataConfirm} onOpenChange={setShowClearDataConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认清除数据</AlertDialogTitle>
            <AlertDialogDescription>
              确定要清除所有答题数据吗？此操作不可恢复，所有已保存的答案将被永久删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY)
                window.location.reload()
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              确定清除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
