"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Sparkles } from "lucide-react"

/**
 * 测评开始前的引导模态框
 */
interface AssessmentIntroModalProps {
  /** 是否显示 */
  open: boolean
  /** 开始测评的回调 */
  onStart: () => void
}

export function AssessmentIntroModal({ open, onStart }: AssessmentIntroModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gradient-to-br from-white to-[#f5f5f5] p-8 max-w-md w-full rounded-2xl shadow-2xl border-2 border-[#2563eb]/20">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2563eb]/10 to-[#ff8c5a]/10 flex items-center justify-center">
              <Heart className="w-10 h-10 text-[#ff8c5a]" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">欢迎开始天赋探索之旅</h2>
            <div className="bg-gradient-to-r from-[#2563eb]/5 to-[#ff8c5a]/5 rounded-xl p-4 border border-[#2563eb]/10">
              <p className="text-base text-gray-700 leading-relaxed">
                这不是一场考试，没有"对错"之分。
                <br />
                这是一次与自己的对话，请放松，
                <br />
                选择最让你心动的答案。
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4 text-[#ff8c5a]" />
            <span>我们将通过你的回答，绘制专属你的天赋图谱</span>
          </div>

          <Button
            onClick={onStart}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#ff8c5a] to-[#ff8c5a]/90 hover:from-[#ff8c5a]/90 hover:to-[#ff8c5a] text-white shadow-lg transition-all duration-300"
          >
            开始探索 <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

