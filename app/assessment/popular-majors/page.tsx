"use client"

import { PageContainer } from "@/components/page-container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { RefreshCcw, Zap } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Major {
  id: string
  name: string
  code: string
  degree: string
  limit_year: string
  boy_rate: string
  girl_rate: string
  salaryavg: string
  fivesalaryavg: number
}

interface HotMajorsData {
  ben: Major[]
  gz_ben: Major[]
  zhuan: Major[]
}

interface Question {
  id: number
  content: string
  elementId: number
  type: string
  dimension: string
  options: Array<{
    id: number
    optionName: string
    optionValue: number
  }>
}

export default function PopularMajorsPage() {
  const [hotMajors, setHotMajors] = useState<HotMajorsData | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<"ben" | "gz_ben" | "zhuan">("ben")
  const [loading, setLoading] = useState(true)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [loveEnergy, setLoveEnergy] = useState<number | null>(null)
  // 保存每个专业的测评结果 { majorCode: loveEnergy }
  const [majorResults, setMajorResults] = useState<Record<string, number>>({})

  useEffect(() => {
    // 确保在客户端执行
    if (typeof window === "undefined") return
    
    fetch("/data/hot.json")
      .then((res) => res.json())
      .then((data) => {
        setHotMajors(data.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("[v0] Failed to load hot majors:", err)
        setLoading(false)
      })
    
    // 从localStorage加载已保存的测评结果
    try {
      const savedResults = localStorage.getItem("popularMajorsResults")
      if (savedResults) {
        setMajorResults(JSON.parse(savedResults))
      }
    } catch (error) {
      console.error("Error loading saved results:", error)
    }
  }, [])

  const categories = [
    { key: "ben" as const, label: "本科" },
    { key: "gz_ben" as const, label: "高职本科" },
    { key: "zhuan" as const, label: "专科" },
  ]

  // 调换高职本科和专科的数据显示
  const getDisplayCategory = (category: "ben" | "gz_ben" | "zhuan"): "ben" | "gz_ben" | "zhuan" => {
    if (category === "gz_ben") return "zhuan" // 高职本科tab显示专科数据
    if (category === "zhuan") return "gz_ben" // 专科tab显示高职本科数据
    return category // 本科tab显示本科数据
  }
  
  const currentMajors = hotMajors?.[getDisplayCategory(selectedCategory)] || []

  // 随机选择8道题目
  const loadRandomQuestions = async () => {
    try {
      const response = await fetch("/data/questionnaire.json")
      if (!response.ok) throw new Error("Failed to fetch questionnaire")
      const allQuestions: Question[] = await response.json()
      
      // 随机打乱并选择8道题目
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
      const selectedQuestions = shuffled.slice(0, 8)
      
      setQuestions(selectedQuestions)
      setCurrentQuestionIndex(0)
      setAnswers({})
      setIsCompleted(false)
      setLoveEnergy(null)
    } catch (error) {
      console.error("Error loading questions:", error)
      setQuestions([])
    }
  }

  // 处理开始测评
  const handleStartAssessment = (major: Major) => {
    setSelectedMajor(major)
    setShowQuestionnaire(true)
    loadRandomQuestions()
  }

  // 处理答题
  const handleAnswer = (questionId: number, optionValue: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionValue }))
  }

  // 处理下一题
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      // 完成测评，计算热爱能量
      handleComplete()
    }
  }

  // 处理上一题
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  // 完成测评
  const handleComplete = () => {
    // 计算总分（所有选项值的总和）
    // 选项值范围通常是 -2 到 2，需要映射到 0-1 范围
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
    // 计算平均分（范围可能是 -2 到 2）
    const avgScore = totalScore / questions.length
    // 将 -2 到 2 的范围映射到 0 到 1 的范围
    // 公式: (value - min) / (max - min) = (avgScore - (-2)) / (2 - (-2)) = (avgScore + 2) / 4
    const energy = Math.min(1, Math.max(0, (avgScore + 2) / 4))
    setLoveEnergy(energy)
    setIsCompleted(true)
    
    // 保存测评结果到状态和localStorage
    if (selectedMajor && typeof window !== "undefined") {
      const newResults = {
        ...majorResults,
        [selectedMajor.code]: energy
      }
      setMajorResults(newResults)
      try {
        localStorage.setItem("popularMajorsResults", JSON.stringify(newResults))
      } catch (error) {
        console.error("Error saving results:", error)
      }
    }
    
    // 延迟关闭对话框，让用户看到完成状态
    setTimeout(() => {
      setShowQuestionnaire(false)
      setIsCompleted(false)
      setLoveEnergy(null)
    }, 2000)
  }

  // 重新测评
  const handleRetake = () => {
    loadRandomQuestions()
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  return (
    <PageContainer>
      <div className="bg-[#1A4099] text-white px-4 pt-6 pb-16 relative">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">
            热门专业测评 <span className="text-base font-normal">选择热门专业，进行专业匹配度测评</span>
          </h1>
        </div>

        {/* Wave effect at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-4 bg-background"
          style={{
            clipPath: "ellipse(70% 100% at 50% 100%)",
          }}
        />
      </div>

      <div className="px-4 mt-2 pb-6 relative z-10">
        <Card className="p-1 mb-4 shadow-lg -mt-8">
          <div className="grid grid-cols-3 gap-1">
            {categories.map((category) => {
              const isActive = selectedCategory === category.key
              return (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`py-2.5 px-3 rounded-lg transition-all text-sm font-medium ${
                    isActive
                      ? "bg-[#FF7F50] text-white shadow-md"
                      : "bg-transparent hover:bg-[#1A4099]/5 text-[#1A4099]"
                  }`}
                >
                  {category.label}
                </button>
              )
            })}
          </div>
        </Card>

        {/* Majors List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>加载中...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentMajors.map((major, index) => {
              const hasResult = majorResults[major.code] !== undefined
              const resultEnergy = majorResults[major.code]
              
              return (
                <Card key={major.id} className="p-3 hover:shadow-lg transition-all border hover:border-[#FF7F50]/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1A4099]/10 flex items-center justify-center flex-shrink-0 text-[#1A4099] font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold mb-1">{major.name}</h3>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-1">
                        {major.degree && <span>{major.degree}</span>}
                        {major.limit_year && <span>{major.limit_year}</span>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {major.fivesalaryavg > 0 && <span>毕业5年薪资: ¥{major.fivesalaryavg}</span>}
                        {major.boy_rate && major.girl_rate && (
                          <span>
                            男女比: {major.boy_rate}:{major.girl_rate}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                      {/* 显示测评结果 */}
                      {hasResult && (
                        <div className="flex items-center gap-2 px-2 py-1 bg-[#FF7F50]/10 rounded-lg border border-[#FF7F50]/20">
                          <Zap className="w-4 h-4 text-[#FF7F50]" />
                          <span className="text-sm font-semibold text-[#FF7F50]">
                            {resultEnergy.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {hasResult ? (
                        <Button 
                          size="sm" 
                          className="h-7 text-xs bg-[#1A4099] hover:bg-[#1A4099]/90 text-white"
                          onClick={() => handleStartAssessment(major)}
                        >
                          <RefreshCcw className="w-3 h-3 mr-1" />
                          重新测评
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="h-7 text-xs bg-[#FF7F50] hover:bg-[#FF7F50]/90 text-white"
                          onClick={() => handleStartAssessment(major)}
                        >
                          测评
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {!loading && currentMajors.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>暂无数据</p>
          </div>
        )}
      </div>

      {/* 测评对话框 */}
      <Dialog open={showQuestionnaire} onOpenChange={setShowQuestionnaire}>
        <DialogContent className="max-w-3xl rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedMajor?.name} - 专业匹配度测评
            </DialogTitle>
            <DialogDescription className="text-base">
              {isCompleted ? "测评完成" : `共 ${questions.length} 道题，当前第 ${currentQuestionIndex + 1} 题`}
            </DialogDescription>
          </DialogHeader>

          {isCompleted ? (
            // 完成状态：显示热爱能量和重新测评按钮
            <div className="space-y-6 py-4">
              <div className="text-center space-y-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF7F50] to-[#FF6A3D] flex items-center justify-center shadow-lg">
                    <Zap className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <div className="text-5xl font-extrabold text-[#FF7F50] mb-2">
                      {loveEnergy !== null ? loveEnergy.toFixed(2) : "0.00"}
                    </div>
                    <p className="text-lg font-semibold text-gray-700">热爱能量</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  基于您的回答，我们计算出您对该专业的匹配度
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleRetake}
                  className="flex-1 h-12 text-base font-bold bg-gradient-to-r from-[#1A4099] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1A4099] text-white"
                >
                  <RefreshCcw className="w-5 h-5 mr-2" />
                  重新测评
                </Button>
                <Button
                  onClick={() => setShowQuestionnaire(false)}
                  variant="outline"
                  className="flex-1 h-12 text-base"
                >
                  关闭
                </Button>
              </div>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>加载题目中...</p>
            </div>
          ) : (
            // 答题状态
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="w-full bg-secondary rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-right text-muted-foreground">{Math.round(progress)}% 完成</p>
              </div>

              {currentQuestion && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {currentQuestion.dimension} · {currentQuestion.type}
                    </p>
                    <h3 className="text-lg font-medium leading-relaxed">{currentQuestion.content}</h3>
                  </div>

                  <RadioGroup
                    value={String(answers[currentQuestion.id] ?? "")}
                    onValueChange={(value) => handleAnswer(currentQuestion.id, Number(value))}
                  >
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => {
                        const isAnswered = answers[currentQuestion.id] === option.optionValue
                        return (
                          <div
                            key={option.id}
                            className={`flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                              isAnswered ? "bg-primary/10 border-primary shadow-sm" : "hover:bg-accent"
                            }`}
                            onClick={() => handleAnswer(currentQuestion.id, option.optionValue)}
                          >
                            <RadioGroupItem
                              value={String(option.optionValue)}
                              id={`option-${option.id}`}
                              className="mt-1 flex-shrink-0"
                            />
                            <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer leading-relaxed">
                              {option.optionName}
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                  上一题
                </Button>

                <Button 
                  onClick={handleNext} 
                  disabled={answers[currentQuestion?.id] === undefined}
                  className="bg-[#FF7F50] hover:bg-[#FF7F50]/90 text-white"
                >
                  {currentQuestionIndex < questions.length - 1 ? "下一题" : "完成测评"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
