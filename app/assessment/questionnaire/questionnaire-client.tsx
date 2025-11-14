"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import questionsData from "@/data/questionnaire.json"
import { AssessmentIntroModal } from "@/components/assessment-intro-modal"
import { WarmProgressFeedback } from "@/components/warm-progress-feedback"
import { AssessmentCompletionModal } from "@/components/assessment-completion-modal"
import { TopNav } from "@/components/top-nav"

interface Question {
  id: number
  content: string
  elementId: number
  type: string
  direction: string
  dimension: string
  action: string
  options: Array<{
    id: number
    scaleId: number
    optionName: string
    optionValue: number
    displayOrder: number
    additionalInfo: string
  }>
}

export function QuestionnaireClient() {
  const router = useRouter()
  const [showIntroModal, setShowIntroModal] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [sliderValue, setSliderValue] = useState(50)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showDimensionToast, setShowDimensionToast] = useState(false)
  const [showMidpointModal, setShowMidpointModal] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [showProgressFeedback, setShowProgressFeedback] = useState(true)

  const questions = questionsData as Question[]
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Calculate current dimension progress
  const currentDimension = currentQuestion?.dimension || ""
  const dimensionQuestions = questions.filter((q) => q.dimension === currentDimension)
  const currentDimensionIndex = dimensionQuestions.findIndex((q) => q.id === currentQuestion?.id) + 1
  const totalDimensionQuestions = dimensionQuestions.length

  // 进度反馈持续显示，内容会根据进度自动更新
  // 在关键进度节点短暂高亮显示
  useEffect(() => {
    const keyProgressPoints = [10, 30, 50, 70, 90]
    const roundedProgress = Math.round(progress)
    
    // 在关键进度点短暂显示反馈（如果之前隐藏了）
    if (keyProgressPoints.some(point => roundedProgress >= point && roundedProgress < point + 2)) {
      setShowProgressFeedback(true)
    }
  }, [progress])

  const handleNext = () => {
    // Save answer
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: sliderValue,
    }))

    const nextIndex = currentQuestionIndex + 1

    // Check for dimension completion (every 24 questions)
    if (nextIndex % 24 === 0 && nextIndex < questions.length) {
      setShowDimensionToast(true)
      setTimeout(() => setShowDimensionToast(false), 3000)
    }

    // Check for midpoint (question 84)
    if (nextIndex === 84) {
      setShowMidpointModal(true)
      return
    }

    // Check for completion
    if (nextIndex >= questions.length) {
      setShowCompletionModal(true)
      return
    }

    // Move to next question
    setCurrentQuestionIndex(nextIndex)
    setSliderValue(50) // Reset slider
  }

  const handleContinueFromMidpoint = () => {
    setShowMidpointModal(false)
    setCurrentQuestionIndex(84)
    setSliderValue(50)
  }

  const handleExit = () => {
    if (confirm("确定要退出问卷吗？您的进度将不会保存。")) {
      router.push("/assessment")
    }
  }

  const handleStartAssessment = () => {
    setShowIntroModal(false)
  }

  const handleGenerateReport = () => {
    router.push("/assessment/report")
  }

  if (!currentQuestion && !showIntroModal) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>
  }

  // 显示引导模态框时，不渲染问卷内容
  if (showIntroModal) {
    return <AssessmentIntroModal open={showIntroModal} onStart={handleStartAssessment} />
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <TopNav />
      {/* Top Section - Progress & Dimension Tracking */}
      <div className="fixed top-14 left-0 right-0 bg-white shadow-sm z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={handleExit} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center flex-1">
              <div className="text-sm font-semibold text-gray-900">第 {currentQuestionIndex + 1} 题 / 168</div>
              <div className="text-xs text-gray-500 mt-0.5">
                当前：{currentDimension} 维度 {currentDimensionIndex}/{totalDimensionQuestions}
              </div>
            </div>
            <div className="w-5" /> {/* Spacer for alignment */}
          </div>
          <Progress
            value={progress}
            className="h-2.5 rounded-full"
            style={{
              backgroundColor: "#E5E7EB",
            }}
          />
        </div>
      </div>

      {/* Middle Section - Question & Answer */}
      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-32">
        <Card className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
          {/* Question Text */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 leading-relaxed text-center">{currentQuestion.content}</h2>
          </div>

          {/* Slider */}
          <div className="space-y-6">
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, #ff8c5a 0%, #ffa578 ${sliderValue}%, #E5E7EB ${sliderValue}%, #E5E7EB 100%)`,
                }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">完全不符合</span>
              <span className="text-2xl font-bold text-[#ff8c5a]">{sliderValue}</span>
              <span className="text-gray-600">非常符合</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Section - Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Button
          onClick={handleNext}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#ff8c5a] to-[#ff8c5a]/90 hover:from-[#ff8c5a]/90 hover:to-[#ff8c5a] text-white shadow-lg transition-all duration-300"
        >
          下一步 <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* 温暖的进度反馈 */}
      <WarmProgressFeedback
        progress={progress}
        dimension={currentDimension}
        show={showProgressFeedback}
      />

      {/* Dimension Completion Toast */}
      {showDimensionToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
          <Card className="bg-gradient-to-r from-[#ff8c5a]/10 to-[#ff8c5a]/5 px-6 py-4 shadow-xl rounded-xl border-2 border-[#ff8c5a]/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-semibold text-gray-900">维度解锁：{currentDimension}！</p>
                <p className="text-sm text-gray-600">天赋能量注入！</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Midpoint Modal */}
      {showMidpointModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#1e40af] p-8 max-w-md w-full text-white rounded-2xl shadow-2xl">
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">🎊</div>
              <h2 className="text-3xl font-bold">半程突破！</h2>
              <p className="text-xl">恭喜你已完成 50%！</p>
              <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-sm leading-relaxed">初步分析，你的天赋倾向于多个领域，潜力超过 85% 的用户！</p>
              </div>
              <Button
                onClick={handleContinueFromMidpoint}
                className="w-full h-14 text-lg font-semibold mt-4 bg-gradient-to-r from-[#ff8c5a] to-[#ff8c5a]/90 hover:from-[#ff8c5a]/90 hover:to-[#ff8c5a] text-white shadow-lg transition-all duration-300"
              >
                继续逆袭 <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 完成与提交模态框 */}
      <AssessmentCompletionModal
        open={showCompletionModal}
        onGenerateReport={handleGenerateReport}
      />

      <style jsx>{`
        :global([data-slot="progress-indicator"]) {
          background: linear-gradient(to right, #ff8c5a, #ffa578) !important;
          border-radius: 9999px;
          box-shadow: 0 2px 4px rgba(255, 140, 90, 0.3);
        }
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff8c5a, #ffa578);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255, 140, 90, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(255, 140, 90, 0.6);
        }
        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff8c5a, #ffa578);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(255, 140, 90, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(255, 140, 90, 0.6);
        }
      `}</style>
    </div>
  )
}
