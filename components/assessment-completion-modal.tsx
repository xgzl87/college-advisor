"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Star, Zap, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"

/**
 * 测评完成与提交时的反馈模态框
 */
interface AssessmentCompletionModalProps {
  /** 是否显示 */
  open: boolean
  /** 生成报告的回调 */
  onGenerateReport: () => void
}

const loadingMessages = [
  "正在点亮你的天赋星辰...",
  "正在为你连接最适合的未来赛道...",
  "我们即将完成这次探索之旅的最后一块拼图...",
]

export function AssessmentCompletionModal({
  open,
  onGenerateReport,
}: AssessmentCompletionModalProps) {
  const [stage, setStage] = useState<"submitting" | "generating" | "completed">("submitting")
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    if (!open) {
      // 重置状态
      setStage("submitting")
      setCurrentMessageIndex(0)
      return
    }

    // 提交阶段
    setStage("submitting")
    setCurrentMessageIndex(0)
    
    const submitTimer = setTimeout(() => {
      setStage("generating")
    }, 2000)

    // 生成报告阶段 - 循环显示消息
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)

    // 完成阶段
    const completeTimer = setTimeout(() => {
      setStage("completed")
      clearInterval(messageInterval)
    }, 6000)

    return () => {
      clearTimeout(submitTimer)
      clearTimeout(completeTimer)
      clearInterval(messageInterval)
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#1e40af] z-50 flex items-center justify-center">
      <div className="text-center text-white space-y-8 px-4 max-w-md w-full">
        {stage === "submitting" && (
          <div className="animate-in zoom-in-50 duration-500">
            <div className="text-6xl mb-6 animate-bounce">✨</div>
            <h1 className="text-3xl font-bold mb-4">所有答案已收到！</h1>
            <p className="text-lg text-white/90">
              我们正在为你整合信息，绘制专属你的天赋图谱。
            </p>
            <div className="flex justify-center gap-2 mt-8">
              <div
                className="w-3 h-3 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-3 h-3 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-3 h-3 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}

        {stage === "generating" && (
          <div className="animate-in zoom-in-50 duration-500">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-spin">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <Star className="w-8 h-8 text-[#ff8c5a] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">正在生成你的专属报告</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-lg">{loadingMessages[currentMessageIndex]}</p>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              <Zap className="w-5 h-5 text-[#ff8c5a] animate-pulse" />
              <span className="text-sm text-white/80">请稍候，精彩即将呈现...</span>
            </div>
          </div>
        )}

        {stage === "completed" && (
          <div className="animate-in zoom-in-50 duration-500">
            <div className="text-7xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold mb-4">恭喜你！</h1>
            <p className="text-xl mb-2">你完成了一次非常勇敢的自我探索。</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mt-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <CheckCircle2 className="w-6 h-6 text-[#ff8c5a]" />
                <p className="text-lg font-semibold">专属你的天赋洞察报告已准备就绪</p>
              </div>
              <p className="text-base text-white/90">
                我们一同来揭开你的闪光点吧！
              </p>
            </div>
            <Button
              onClick={onGenerateReport}
              className="w-full h-14 text-lg font-semibold mt-6 bg-gradient-to-r from-[#ff8c5a] to-[#ff8c5a]/90 hover:from-[#ff8c5a]/90 hover:to-[#ff8c5a] text-white shadow-xl transition-all duration-300"
            >
              查看我的报告 <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

