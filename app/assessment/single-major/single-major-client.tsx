"use client"

import { useState, useEffect, type ReactElement } from "react"
import { useRouter } from "next/navigation"
import {
  Loader2,
  AlertCircle,
  ChevronDown,
  AlertTriangle,
  TrendingUp,
  RefreshCcw,
  Zap,
  BookOpen,
  Brain,
  CheckCircle2,
  ArrowLeft,
  FileText,
} from "lucide-react"
import type { EducationData, MajorNode } from "@/lib/education-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

const PRIMARY_COLOR = "#1A4099" // 深蓝色
const ACCENT_POSITIVE = "text-green-600" // 积极/加分
const ACCENT_NEGATIVE = "text-red-600" // 消极/减分
const BG_POSITIVE = "bg-green-50"
const BG_NEGATIVE = "bg-red-50"
const BORDER_POSITIVE = "border-green-200"
const BORDER_NEGATIVE = "border-red-200"

interface SingleMajorClientProps {
  educationData: EducationData
}

interface MajorDetailData {
  code: string
  name: string
  edu_level: string
  level: number
  parent_id?: string
  majorElementAnalyses?: number[]
  [key: string]: any // Allow for additional fields from API
}

interface QuestionOption {
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
  options: QuestionOption[]
}

interface QuestionnaireModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  elementIds: number[]
}

function QuestionnaireModal({ open, onOpenChange, elementIds }: QuestionnaireModalProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    if (open && elementIds.length > 0) {
      loadQuestions()
    }
  }, [open, elementIds])

  const loadQuestions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/data/questionnaire.json")
      if (!response.ok) {
        throw new Error(`Failed to fetch questionnaire: ${response.status}`)
      }
      const allQuestions: Question[] = await response.json()

      const filtered = allQuestions.filter((q) => elementIds.includes(q.elementId))
      setQuestions(filtered)
      setCurrentQuestionIndex(0)
      setAnswers({})
    } catch (error) {
      console.error("Error loading questionnaire:", error)
      setQuestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = (questionId: number, optionValue: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionValue }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1) // Fixed the decrement logic here
    }
  }

  const handleSubmit = () => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
    alert(`问卷完成！总分：${totalScore}`)
    onOpenChange(false)
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">专业匹配度测试</DialogTitle>
          <DialogDescription className="text-base">
            共 {questions.length} 道题，当前第 {currentQuestionIndex + 1} 题
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3">加载问卷中...</span>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">暂无相关问卷</div>
        ) : (
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
                            <div>{option.optionName}</div>
                            {option.additionalInfo && (
                              <div className="text-xs text-muted-foreground mt-1">{option.additionalInfo}</div>
                            )}
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

              {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={handleNext} disabled={answers[currentQuestion?.id] === undefined}>
                  下一题
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length}>
                  提交问卷
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function findMajorPath(nodes: MajorNode[], targetId: number, path: string[] = []): string[] | null {
  for (const node of nodes) {
    const currentPath = [...path, node.name]
    if (node.id === targetId) {
      return currentPath
    }
    if (node.children && node.children.length > 0) {
      const found = findMajorPath(node.children, targetId, currentPath)
      if (found) return found
    }
  }
  return null
}

function filterMajorTree(nodes: MajorNode[], searchQuery: string): MajorNode[] {
  if (!searchQuery.trim()) return nodes

  const query = searchQuery.toLowerCase()
  const filtered: MajorNode[] = []

  for (const node of nodes) {
    const matchesName = node.name.toLowerCase().includes(query)
    const filteredChildren = node.children ? filterMajorTree(node.children, searchQuery) : []

    if (matchesName || filteredChildren.length > 0) {
      filtered.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
      })
    }
  }

  return filtered
}

function CoreValueDisplay({ value }: { value: any }) {
  if (!value) {
    return <span className="text-muted-foreground italic">无数据</span>
  }

  return (
    <div className="p-1 bg-primary/5 rounded-xl border border-primary/20 shadow-sm">
      <div className="space-y-0">
        <h3 className="text-sm font-semibold text-primary flex items-center mb-0.5">
          <BookOpen className="w-4 h-4 mr-2" />
          核心价值
        </h3>
        <p className="text-sm leading-relaxed text-gray-700">{value}</p>
      </div>
    </div>
  )
}

function QuickScanDisplay({ value }: { value: any }) {
  if (!value) {
    return <span className="text-muted-foreground italic">无数据</span>
  }

  return (
    <div className="p-1 bg-primary/5 rounded-xl border border-primary/20 shadow-sm">
      <div className="space-y-0">
        <h3 className="text-sm font-semibold text-primary flex items-center mb-0.5">
          <Brain className="w-4 h-4 mr-2" />
          快速扫描
        </h3>
        <p className="text-sm leading-relaxed text-gray-700">{value}</p>
      </div>
    </div>
  )
}

// 查看问卷对话框组件
function QuestionnaireViewModal({ 
  open, 
  onOpenChange, 
  elementId 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  elementId: number | undefined
}) {
  const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && elementId) {
      loadQuestionsAndAnswers()
    }
  }, [open, elementId])

  const loadQuestionsAndAnswers = async () => {
    setIsLoading(true)
    try {
      // 加载问卷数据
      const response = await fetch("/data/questionnaire.json")
      if (!response.ok) throw new Error("Failed to fetch questionnaire")
      const allQuestions: any[] = await response.json()
      
      // 筛选与当前 element 相关的题目
      const filtered = allQuestions.filter((q) => q.elementId === elementId)
      setQuestions(filtered)

      // 从本地存储加载答案
      const stored = localStorage.getItem("questionnaire_answers")
      const storedAnswers = stored ? JSON.parse(stored) : {}
      setAnswers(storedAnswers)
    } catch (error) {
      console.error("Error loading questionnaire:", error)
      setQuestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const getAnswerText = (question: any, answerValue: number) => {
    const option = question.options?.find((opt: any) => opt.optionValue === answerValue)
    return option ? option.optionName : "未作答"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">问卷内容与答案</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">加载中...</div>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">暂无相关问卷题目</div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => {
              const answerValue = answers[question.id]
              const hasAnswer = answerValue !== undefined
              
              return (
                <Card key={question.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            题目 {index + 1}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {question.dimension} · {question.type}
                          </span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">{question.content}</p>
                      </div>
                      {hasAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>

                    {hasAnswer ? (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs font-medium text-green-700 mb-1">您的答案：</p>
                        <p className="text-sm text-green-800 font-medium">
                          {getAnswerText(question, answerValue)}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-xs text-muted-foreground">未作答</p>
                      </div>
                    )}

                    {question.options && question.options.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground mb-1">选项：</p>
                        <div className="space-y-1">
                          {question.options.map((option: any) => {
                            const isSelected = hasAnswer && option.optionValue === answerValue
                            return (
                              <div
                                key={option.id}
                                className={`text-xs p-2 rounded flex items-start gap-2 ${
                                  isSelected
                                    ? "bg-green-100 border-2 border-green-500 shadow-sm"
                                    : "bg-gray-50 border border-gray-200"
                                }`}
                              >
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className={isSelected ? "font-bold text-green-800" : "text-gray-700"}>
                                      {option.optionName}
                                    </span>
                                    {isSelected && (
                                      <span className="text-xs font-medium text-green-700 bg-green-200 px-1.5 py-0.5 rounded">
                                        您的选择
                                      </span>
                                    )}
                                  </div>
                                  {option.additionalInfo && (
                                    <span className="text-muted-foreground ml-0 block mt-1">
                                      {option.additionalInfo}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function MajorElementAnalysesDisplay({ analyses }: { analyses: any[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [selectedElementId, setSelectedElementId] = useState<number | undefined>(undefined)

  if (!Array.isArray(analyses) || analyses.length === 0) {
    return <span className="text-muted-foreground italic">无数据</span>
  }

  const grouped = analyses.reduce(
    (acc, analysis, index) => {
      const type = analysis.type || "未分类"

      if (type === "lexue" || type === "shanxue") {
        if (!acc["积极助力"]) {
          acc["积极助力"] = []
        }
        acc["积极助力"].push({ ...analysis, originalIndex: index })
      } else if (type === "tiaozhan" || type === "yanxue") {
        if (!acc["潜在挑战"]) {
          acc["潜在挑战"] = []
        }
        acc["潜在挑战"].push({ ...analysis, originalIndex: index })
      } else {
        if (!acc[type]) {
          acc[type] = []
        }
        acc[type].push({ ...analysis, originalIndex: index })
      }

      return acc
    },
    {} as Record<string, any[]>,
  )

  const sortedTypes = Object.keys(grouped).sort()

  return (
    <div className="space-y-1">
      {sortedTypes.map((type) => {
        const items = grouped[type]
        const isChallengeType = type === "潜在挑战"
        const isPositiveType = type === "积极助力"

        let typeIcon: ReactElement | null = null
        let typeColor = ""
        let typeBg = ""

        if (isPositiveType) {
          typeIcon = <TrendingUp className="w-5 h-5" />
          typeColor = ACCENT_POSITIVE
          typeBg = "bg-green-100"
        } else if (isChallengeType) {
          typeIcon = <AlertTriangle className="w-5 h-5" />
          typeColor = ACCENT_NEGATIVE
          typeBg = "bg-red-100"
        } else {
          typeIcon = <Zap className="w-5 h-5" />
          typeColor = "text-gray-600"
          typeBg = "bg-gray-100"
        }

        return (
          <div key={type} className="rounded-xl shadow-md border border-gray-200">
            <div className={`flex flex-row items-center space-x-2 px-2 py-0.5 ${typeBg}`}>
              <div className={`p-1 rounded-full ${typeColor} bg-white shadow-sm`}>{typeIcon}</div>
              <h3 className={`text-lg font-bold ${typeColor}`}>{type}</h3>
            </div>
            <div className="px-2 py-0.5 space-y-0">
              {items.map((item: any) => {
                const isExpanded = expandedIndex === item.originalIndex
                const itemBg = isExpanded ? "bg-primary/10" : "bg-secondary hover:bg-secondary/80"

                return (
                  <div key={item.originalIndex} className="w-full">
                    <button
                      onClick={() => {
                        setExpandedIndex(isExpanded ? null : item.originalIndex)
                      }}
                      className={`text-sm px-2 py-1 rounded-lg transition-colors text-left w-full flex items-center justify-between group border ${itemBg} ${isExpanded ? "border-primary shadow-sm" : "border-transparent"}`}
                    >
                      <span className="font-medium text-gray-800">{item.element?.name || "未命名"}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="mt-0.5 p-1 rounded-b-lg bg-primary/5 space-y-0.5 border border-t-0 border-primary/20">
                        {item.summary && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">摘要</p>
                            <p className="text-sm mt-0.5 leading-relaxed">{item.summary}</p>
                          </div>
                        )}
                        {item.matchReason && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">匹配原因</p>
                            <p className="text-sm mt-0.5 leading-relaxed">{item.matchReason}</p>
                          </div>
                        )}
                        {item.element?.status && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">状态</p>
                            <p className="text-sm mt-0.5">{item.element.status}</p>
                          </div>
                        )}
                        {item.element?.id && (
                          <div className="mt-2">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedElementId(item.element.id)
                                setShowQuestionnaire(true)
                              }}
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              查看问卷内容和答案
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      <QuestionnaireViewModal
        open={showQuestionnaire}
        onOpenChange={setShowQuestionnaire}
        elementId={selectedElementId}
      />
    </div>
  )
}

function MajorScoreDisplay({ majorData }: { majorData: any }) {
  if (!majorData || typeof majorData !== "object") {
    return <span className="text-muted-foreground italic">无数据</span>
  }

  return (
    <div className="space-y-3">
      {/* 热爱能量分数 */}
      {majorData.score !== undefined && (
        <div className="text-center">
          <div className="text-4xl font-extrabold text-[#FF7F50] mb-1">{majorData.score}</div>
          <p className="text-xs text-muted-foreground">热爱能量得分</p>
        </div>
      )}

      {/* 积极助力和潜在挑战 */}
      <div className="pt-2 border-t">
        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2 w-full text-left hover:opacity-80 transition-opacity">
            <h3 className="text-sm font-semibold text-[#1A4099]">详细分解</h3>
            <ChevronDown className="w-4 h-4 text-[#1A4099] transition-transform duration-200 data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {majorData.lexueScore !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">乐学:</span>
                  <span className="font-bold text-green-600">+{majorData.lexueScore}</span>
                </div>
              )}
              {majorData.shanxueScore !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">善学:</span>
                  <span className="font-bold text-green-600">+{majorData.shanxueScore}</span>
                </div>
              )}
              {majorData.yanxueDeduction !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">厌学:</span>
                  <span className="font-bold text-red-600">-{majorData.yanxueDeduction}</span>
                </div>
              )}
              {majorData.tiaozhanDeduction !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">阻学:</span>
                  <span className="font-bold text-red-600">-{majorData.tiaozhanDeduction}</span>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}

function DisplayValue({ value, depth = 0, fieldKey }: { value: any; depth?: number; fieldKey?: string }) {
  if (fieldKey === "majorElementAnalyses" && Array.isArray(value)) {
    return <MajorElementAnalysesDisplay analyses={value} />
  }

  if (fieldKey === "major" && typeof value === "object") {
    return <MajorScoreDisplay majorData={value} />
  }

  if (fieldKey === "majorBrief") {
    return <CoreValueDisplay value={value} />
  }

  if (fieldKey === "majorKey") {
    return <QuickScanDisplay value={value} />
  }

  if (value === null || value === undefined) {
    return <span className="text-muted-foreground italic">无数据</span>
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      if (typeof parsed === "object") {
        return <DisplayValue value={parsed} depth={depth} />
      }
    } catch {}
    return <span className="text-sm leading-relaxed whitespace-pre-wrap">{value}</span>
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return <span className="text-sm">{String(value)}</span>
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-muted-foreground italic">空列表</span>
    }
    return (
      <ul className="space-y-1 list-disc list-inside">
        {value.map((item, index) => (
          <li key={index} className="text-sm">
            <DisplayValue value={item} depth={depth + 1} />
          </li>
        ))}
      </ul>
    )
  }

  if (typeof value === "object") {
    const entries = Object.entries(value)
    if (entries.length === 0) {
      return <span className="text-muted-foreground italic">空对象</span>
    }
    return (
      <div className={`space-y-3 ${depth > 0 ? "pl-4" : ""}`}>
        {entries.map(([key, val]) => {
          const label = FIELD_LABELS[key] || key.replace(/_/g, " ")
          return (
            <div key={key} className="space-y-1">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <DisplayValue value={val} depth={depth + 1} />
            </div>
          )
        })}
      </div>
    )
  }

  return <span className="text-sm">{String(value)}</span>
}

const INLINE_FIELDS = ["educationLevel", "studyPeriod", "awardedDegree"]

const FIELD_LABELS: Record<string, string> = {
  educationLevel: "学历",
  studyPeriod: "学制",
  awardedDegree: "学位",
  majorBrief: "核心价值",
  majorKey: "快速扫描",
  opportunityScore: "现实机遇指数",
  academicDevelopmentScore: "学业发展指数",
  careerDevelopmentScore: "职业回报指数",
  growthPotentialScore: "成长空间指数",
  industryProspectsScore: "产业前景指数",
  academicDevelopmentTag: "学业发展标签",
  careerDevelopmentTag: "职业回报标签",
  growthPotentialTag: "成长空间标签",
  industryProspectsTag: "产业前景标签",
  studyContent: "学习内容",
  academicDevelopment: "学业发展",
  careerDevelopment: "职业回报",
  industryProspects: "产业前景",
  growthPotential: "成长空间",
  major: "专业匹配分",
  majorElementAnalyses: "专业匹配元素",
}

function InlineFieldsDisplay({ data }: { data: Record<string, any> }) {
  const inlineData = INLINE_FIELDS.filter((key) => data[key] !== undefined && data[key] !== null).map((key) => ({
    key,
    value: data[key],
    label: FIELD_LABELS[key] || key.replace(/([A-Z])/g, " $1").trim(),
  }))

  if (inlineData.length === 0) return null

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-0">
      {inlineData.map(({ key, value, label }) => (
        <div key={key} className="flex items-center gap-1">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{label}:</span>
          <span className="text-sm font-semibold text-gray-800">{String(value)}</span>
        </div>
      ))}
    </div>
  )
}

function getAnalysisCounts(analyses: any[]) {
  let positiveCount = 0
  let negativeCount = 0
  if (Array.isArray(analyses)) {
    analyses.forEach((a) => {
      if (a.type === "shanxue" || a.type === "lexue") {
        positiveCount++
      } else if (a.type === "tiaozhan" || a.type === "yanxue") {
        negativeCount++
      }
    })
  }
  return { positiveCount, negativeCount }
}

function MajorAnalysisActionCard({ analyses, onViewDetail, onRedoQuestionnaire }: any) {
  const { positiveCount, negativeCount } = getAnalysisCounts(analyses)
  const totalCount = positiveCount + negativeCount

  if (totalCount === 0) {
    return (
      <div className="border-dashed border border-gray-300 bg-gray-50 text-center p-2 rounded-xl shadow-sm">
        <p className="text-base font-medium text-gray-500">暂无天赋匹配度数据。请先完成问卷。</p>
        <Button onClick={onRedoQuestionnaire} className="mt-2">
          <RefreshCcw className="w-4 h-4 mr-2" /> 立即进行专业匹配问卷
        </Button>
      </div>
    )
  }

  return (
    <div className="border border-primary/20 rounded-xl shadow-sm">
      <div className="bg-primary/5 px-2 py-1.5">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
          <Brain className="w-5 h-5" />
          喜欢与天赋概览
        </h3>
      </div>
      <div className="space-y-0 px-2 py-1.5">
        <div className="flex justify-around items-center text-center">
          <button
            onClick={onViewDetail}
            className="space-y-0 py-2 rounded-xl w-full mx-0.5 shadow-md border border-green-200 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2">
              <p className={`text-2xl font-bold ${"text-green-600"}`}>{positiveCount}</p>
              <TrendingUp className={`w-6 h-6 ${"text-green-600"}`} />
            </div>
            <p className="text-sm text-muted-foreground">积极助力项</p>
          </button>
          <button
            onClick={onViewDetail}
            className="space-y-0 py-2 rounded-xl w-full mx-0.5 shadow-md border border-red-200 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2">
              <p className={`text-2xl font-bold ${"text-red-600"}`}>{negativeCount}</p>
              <AlertTriangle className={`w-6 h-6 ${"text-red-600"}`} />
            </div>
            <p className="text-sm text-muted-foreground">潜在挑战项</p>
          </button>
        </div>
      </div>
    </div>
  )
}

const SECTION_ORDER = ["studyContent", "academicDevelopment"]

export function SingleMajorClient({ educationData }: any) {
  const router = useRouter()
  const [selectedMajor, setSelectedMajor] = useState<any | null>(null)
  const [currentEduLevel, setCurrentEduLevel] = useState<"ben" | "gao_ben" | "zhuan">("ben")
  const [searchQuery, setSearchQuery] = useState("")
  const [majorDetailData, setMajorDetailData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    loadMajorByCode("010101")
  }, [])

  const loadMajorByCode = async (code: string) => {
    setIsLoading(true)
    setError(null)
    const apiUrl = `/data/010101.json`

    try {
      const response = await fetch(apiUrl)

      if (!response.ok) {
        if (response.status === 404) {
          setError(`未找到专业数据文件: 010101.json`)
        } else {
          setError(`加载失败 (${response.status}): ${response.statusText}`)
        }
        setMajorDetailData(null)
        return
      }

      const data = await response.json()

      const majorData = data.data || data
      setMajorDetailData(majorData)
    } catch (err) {
      console.error("Error loading major detail:", err)
      setError(`加载专业数据失败: ${err instanceof Error ? err.message : "未知错误"}`)
      setMajorDetailData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectMajor = async (major: any) => {
    setSelectedMajor(major)
    setError(null)

    if (major.level !== 3) {
      setMajorDetailData(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const apiUrl = `/data/${major.code}.json`

    try {
      const response = await fetch(apiUrl)

      if (!response.ok) {
        if (response.status === 404) {
          setError(`未找到专业数据文件: ${major.code}.json`)
        } else {
          setError(`加载失败 (${response.status}): ${response.statusText}`)
        }
        setMajorDetailData(null)
        return
      }

      const data = await response.json()

      const majorData = data.data || data
      setMajorDetailData(majorData)
    } catch (err) {
      console.error("Error loading major detail:", err)
      setError(`加载专业数据失败: ${err instanceof Error ? err.message : "未知错误"}`)
      setMajorDetailData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getBreadcrumbPath = () => {
    if (!selectedMajor) return []
    const nodes = educationData[currentEduLevel]
    return findMajorPath(nodes, selectedMajor.id) || [selectedMajor.name]
  }

  const breadcrumbPath = getBreadcrumbPath()

  const filteredBen = filterMajorTree(educationData.ben, searchQuery)
  const filteredGaoBen = filterMajorTree(educationData.gao_ben, searchQuery)
  const filteredZhuan = filterMajorTree(educationData.zhuan, searchQuery)

  const getElementIds = (): number[] => {
    if (!majorDetailData?.majorElementAnalyses) {
      return []
    }

    const ids = majorDetailData.majorElementAnalyses
      .map((analysis: any) => analysis?.element?.id)
      .filter((id: any) => id !== undefined && id !== null)

    return ids
  }

  return (
    <div className="w-full overflow-y-auto">
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">加载专业详情...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="border border-destructive/50 bg-destructive/5 rounded-xl shadow-sm p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-destructive mb-2">加载失败</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <p className="text-xs text-muted-foreground mt-3">请确保 data/010101.json 文件存在于项目中</p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && majorDetailData && (
        <div className="space-y-1.5 p-2">
          <div className="border-b bg-background sticky top-0 z-10 space-y-0 pb-2 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                返回
              </Button>
            </div>
            <h1 className="text-3xl font-extrabold text-primary">{majorDetailData.name}</h1>
            <InlineFieldsDisplay data={majorDetailData} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {majorDetailData.majorKey && <QuickScanDisplay value={majorDetailData.majorKey} />}
            {majorDetailData.majorBrief && <CoreValueDisplay value={majorDetailData.majorBrief} />}
          </div>

          {majorDetailData.major && (
            <div className="border border-primary/20 rounded-xl shadow-sm p-4">
              <MajorScoreDisplay majorData={majorDetailData.major} />
            </div>
          )}

          {majorDetailData.majorElementAnalyses && (
            <MajorAnalysisActionCard
              analyses={majorDetailData.majorElementAnalyses}
              onViewDetail={() => setShowDetailModal(true)}
              onRedoQuestionnaire={() => setShowQuestionnaire(true)}
            />
          )}

          {SECTION_ORDER.map((key) => {
            const value = majorDetailData[key]
            if (!value) return null

            const label = FIELD_LABELS[key] || key.replace(/_/g, " ")
            return (
              <div key={key} className="rounded-xl shadow-md border border-gray-200">
                <div className="px-2 py-1.5 bg-muted/40">
                  <h3 className="text-lg font-bold text-primary">{label}</h3>
                </div>
                <div className="px-2 py-1.5">
                  <DisplayValue value={value} fieldKey={key} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!isLoading && !error && !majorDetailData && (
        <div className="flex items-center justify-center h-full py-12">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">未找到专业数据</p>
            <p className="text-sm text-muted-foreground mt-2">请从专业列表中选择一个专业</p>
          </div>
        </div>
      )}

      <QuestionnaireModal open={showQuestionnaire} onOpenChange={setShowQuestionnaire} elementIds={getElementIds()} />

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-xl shadow-lg">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold">天赋匹配度详细分析</DialogTitle>
          </DialogHeader>
          {majorDetailData?.majorElementAnalyses && (
            <MajorElementAnalysesDisplay analyses={majorDetailData.majorElementAnalyses} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
