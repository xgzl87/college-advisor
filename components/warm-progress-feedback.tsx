"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Sparkles, Star, Zap } from "lucide-react"

/**
 * 温暖的进度反馈组件
 * 根据进度百分比显示不同的鼓励语
 */
interface WarmProgressFeedbackProps {
  /** 当前进度百分比 (0-100) */
  progress: number
  /** 当前维度名称 */
  dimension?: string
  /** 是否显示 */
  show?: boolean
}

export function WarmProgressFeedback({
  progress,
  dimension,
  show = true,
}: WarmProgressFeedbackProps) {
  const [currentMessage, setCurrentMessage] = useState("")
  const [icon, setIcon] = useState<"sparkles" | "star" | "zap">("sparkles")

  useEffect(() => {
    // 根据进度获取对应的鼓励语
    if (progress < 10) {
      setCurrentMessage("我们正在探索你的思维偏好...")
      setIcon("sparkles")
    } else if (progress < 30) {
      setCurrentMessage(
        dimension
          ? `您已解锁${dimension}的特质，已完成${Math.round(progress)}%，你做的很好！`
          : `已完成${Math.round(progress)}%，你做的很好！`
      )
      setIcon("star")
    } else if (progress < 50) {
      setCurrentMessage(
        dimension
          ? `您已解锁${dimension}的特质，已完成${Math.round(progress)}%，你真棒！`
          : `${Math.round(progress)}%，你真棒！`
      )
      setIcon("star")
    } else if (progress < 70) {
      setCurrentMessage(
        dimension
          ? `您已解锁${dimension}的特质，已完成${Math.round(progress)}%，行程过半！你是否对自己有了些新的发现？`
          : `${Math.round(progress)}%，行程过半！你是否对自己有了些新的发现？`
      )
      setIcon("zap")
    } else if (progress < 90) {
      setCurrentMessage(
        dimension
          ? `您已解锁${dimension}的特质，已完成${Math.round(progress)}%，胜利就在前方。`
          : `${Math.round(progress)}%，胜利就在前方。`
      )
      setIcon("zap")
    } else {
      setCurrentMessage(
        dimension
          ? `您已解锁${dimension}的特质，已完成${Math.round(progress)}%，即将抵达！感谢你坚持完成这次宝贵的自我探索。`
          : `${Math.round(progress)}%，即将抵达！感谢你坚持完成这次宝贵的自我探索。`
      )
      setIcon("sparkles")
    }
  }, [progress, dimension])

  if (!show || !currentMessage) return null

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <Card className="bg-gradient-to-r from-[#ff8c5a]/10 to-[#ff8c5a]/5 border-2 border-[#ff8c5a]/30 px-6 py-4 shadow-xl rounded-xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {icon === "sparkles" && (
              <Sparkles className="w-5 h-5 text-[#ff8c5a] animate-pulse" />
            )}
            {icon === "star" && (
              <Star className="w-5 h-5 text-[#ff8c5a] animate-pulse fill-[#ff8c5a]" />
            )}
            {icon === "zap" && (
              <Zap className="w-5 h-5 text-[#ff8c5a] animate-pulse fill-[#ff8c5a]" />
            )}
          </div>
          <p className="text-sm font-medium text-gray-800 leading-relaxed">
            {currentMessage}
          </p>
        </div>
      </Card>
    </div>
  )
}

