"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { TopNav } from "@/components/top-nav"
import {
  TrendingUp,
  AlertCircle,
  Heart,
  Target,
  CheckCircle2,
  AlertTriangle,
  Brain,
  RefreshCcw,
  ChevronDown,
  Zap,
  FileText,
  Eye,
} from "lucide-react"

interface MajorData {
  code: string
  educationLevel: string
  studyPeriod: string
  awardedDegree: string
  majorBrief: string
  majorKey: string
  opportunityScore: string
  academicDevelopmentScore: string
  careerDevelopmentScore: string
  growthPotentialScore: string
  industryProspectsScore: string
  academicDevelopmentTag: string
  careerDevelopmentTag: string
  growthPotentialTag: string
  industryProspectsTag: string
  careerDevelopment: any
  industryProspects: any
  growthPotential: any
}

interface Career {
  级别: number
  分类代码: number
  职业代码: number
  大类: string
  中类: string
  小类: string
  细类: string
  职业环境: string
  起薪及薪酬空间: string
  职业发展路径: string
  职业风险: string
  职业门槛条件: string
  人才供给情况: string
}

interface CareerData {
  id: number
  name: string
  code: string
  关联职业: Career[]
}

// 固定数据 - 用于展示
const fixedMajorData: MajorData = {
  code: "010101",
  educationLevel: "本科",
  studyPeriod: "四年",
  awardedDegree: "哲学学士",
  majorBrief: "探究世界本原与人类终极问题的'思想登山者'，通过严谨的逻辑思辨，构建认知世界、安顿自身的智慧体系。",
  majorKey: "逻辑思辨 批判性思维 价值观 形而上学",
  opportunityScore: "65.00",
  academicDevelopmentScore: "85.00",
  careerDevelopmentScore: "50.00",
  growthPotentialScore: "65.00",
  industryProspectsScore: "60.00",
  academicDevelopmentTag: "基础学科优势 / 顶尖学府必设 / 深造为主要出路",
  careerDevelopmentTag: "直接对口岗位少 / 起薪普遍不高 / 长期回报看转型",
  growthPotentialTag: "极强可塑性 / 高度依赖主动规划 / 转型成功天花板高",
  industryProspectsTag: "无直接对应产业 / 思想文化需求永恒 / AI伦理等新机遇",
  careerDevelopment: {
    指数得分: "50 ， 标签: 直接对口岗位少 / 起薪普遍不高 / 长期回报看转型",
    薪酬水平参考: {
      起薪区间: "毕业生起薪普遍不高，约为 ¥5000 - ¥8000。",
      "3-5年薪资区间": "薪资增长高度依赖于所进入的行业平台，在教师和公务员体系内按职称/级别稳定增长。",
    },
  },
  industryProspects: {
    指数得分: "60 ， 标签: 无直接对应产业 / 思想文化需求永恒 / AI伦理等新机遇",
    行业前景: "无直接对应的产业。但随着社会发展，对精神文化、逻辑思维和伦理规范的需求日益增长。人工智能伦理、企业文化建构等新兴领域为哲学毕业生提供了新的用武之地。",
    趋势性风险: {
      人才供需风险: "本科毕业生直接对口就业岗位有限，学历内卷严重，硕士及以上学历是进入理想岗位的普遍要求。",
      技术变革风险: "核心的思辨能力极难被AI替代，是其最大优势。",
      "行业周期/政策风险": "教育、文化、传媒行业受政策影响较大。",
    },
  },
  growthPotential: {
    指数得分: "65 ， 标签: 极强可塑性 / 高度依赖主动规划 / 转型成功天花板高",
    工作环境提示: "学术研究和大部分对口工作需要长期坐冷板凳，对耐得住寂寞、享受独立思考的能力要求很高。",
    横向发展可能: "职业可塑性极强。哲学训练出的批判性思维、逻辑分析和深度阅读能力是进入任何需要强大脑力行业的万能钥匙，但成功转型高度依赖个人主动规划和持续的跨领域学习。",
  },
}

const fixedCareers: Career[] = [
  {
    级别: 4,
    分类代码: 2,
    职业代码: 2100510,
    大类: "专业技术人员",
    中类: "文学艺术工作人员",
    小类: "电影电视制作及舞台专业人员",
    细类: "道具师",
    职业环境: "户外工作环境，需要经常出差，接触不同客户",
    起薪及薪酬空间: "起薪5000-8000元，3-5年经验可达12000-18000元，专家级25000-40000元",
    职业发展路径: "初级→中级→高级→专家→技术总监",
    职业风险: "人工智能替代风险，需要提升不可替代的核心技能",
    职业门槛条件: "本科及以上学历，相关专业背景，3年以上工作经验",
    人才供给情况: "新兴领域人才紧缺，传统领域人才过剩，需要转型",
  },
  {
    级别: 4,
    分类代码: 6,
    职业代码: 6040702,
    大类: "生产、运输设备操作人员及有关人员",
    中类: "机械制造加工人员",
    小类: "航天器件加工成型人员",
    细类: "卫星光学冷加工工",
    职业环境: "办公室环境，现代化办公设备，团队协作氛围浓厚",
    起薪及薪酬空间: "起薪4000-6000元，5-8年经验可达10000-15000元，管理岗位20000-35000元",
    职业发展路径: "助理→专员→主管→经理→总监→副总裁",
    职业风险: "人工智能替代风险，需要提升不可替代的核心技能",
    职业门槛条件: "博士学历优先，发表过相关论文，有海外学习经历",
    人才供给情况: "高端人才稀缺，中低端人才过剩，需要提升技能",
  },
  {
    级别: 4,
    分类代码: 6,
    职业代码: 6040199,
    大类: "生产、运输设备操作人员及有关人员",
    中类: "机械制造加工人员",
    小类: "机械冷加工人员",
    细类: "其他机械冷加工人员",
    职业环境: "工厂车间环境，机械化操作，需要遵守安全规范",
    起薪及薪酬空间: "起薪4000-6000元，5-8年经验可达10000-15000元，管理岗位20000-35000元",
    职业发展路径: "基层→中层→高层→合伙人→股东",
    职业风险: "市场竞争激烈，业绩压力大，工作强度高",
    职业门槛条件: "硕士及以上学历，专业资格证书，5年以上行业经验",
    人才供给情况: "新兴领域人才紧缺，传统领域人才过剩，需要转型",
  },
  {
    级别: 4,
    分类代码: 2,
    职业代码: 2100707,
    大类: "专业技术人员",
    中类: "文学艺术工作人员",
    小类: "工艺美术专业人员",
    细类: "陈列展览设计人员",
    职业环境: "实验室环境，精密仪器设备，需要严格的安全防护",
    起薪及薪酬空间: "起薪6000-10000元，5-10年经验可达15000-25000元，总监级30000-50000元",
    职业发展路径: "初级→中级→高级→专家→技术总监",
    职业风险: "技术更新快，需要持续学习新技术，面临被淘汰风险",
    职业门槛条件: "本科及以上学历，相关专业背景，3年以上工作经验",
    人才供给情况: "高端人才稀缺，中低端人才过剩，需要提升技能",
  },
]

// 常量定义
const PRIMARY_COLOR = "#1A4099"
const ACCENT_POSITIVE = "text-green-600"
const ACCENT_NEGATIVE = "text-red-600"
const BORDER_POSITIVE = "border-green-200"
const BORDER_NEGATIVE = "border-red-200"

// 获取分析数量
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

// 热爱能量显示组件
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

// 条目卡片组件 - 支持展开显示详细信息
function ItemCard({ item, type }: { item: any; type: "positive" | "negative" }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const isPositive = type === "positive"
  const bgColor = isPositive ? "bg-green-50" : "bg-red-50"
  const borderColor = isPositive ? "border-green-200" : "border-red-200"
  const iconColor = isPositive ? "text-green-600" : "text-red-600"
  const Icon = isPositive ? CheckCircle2 : AlertTriangle

  return (
    <>
      <div className={`rounded-lg ${bgColor} border ${borderColor} overflow-hidden`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-2 text-left"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {item.element?.name || "未命名"}
              </p>
              {item.summary && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {item.summary}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Icon className={`w-4 h-4 ${iconColor} mt-0.5`} />
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </button>
        {isExpanded && (
          <div className="px-2 pb-2 pt-1 space-y-2 border-t border-gray-200">
            {item.matchReason && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">匹配原因</p>
                <p className="text-xs text-gray-700 leading-relaxed">{item.matchReason}</p>
              </div>
            )}
            {item.element?.status && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">状态</p>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {item.element.status}
                </p>
              </div>
            )}
            {item.element?.id && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowQuestionnaire(true)
                }}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                <FileText className="w-3 h-3 mr-1" />
                查看问卷内容和答案
              </Button>
            )}
          </div>
        )}
      </div>
      <QuestionnaireViewModal
        open={showQuestionnaire}
        onOpenChange={setShowQuestionnaire}
        elementId={item.element?.id}
      />
    </>
  )
}

// 喜欢与天赋概览组件
function MajorAnalysisActionCard({
  analyses,
  onViewDetail,
  onRedoQuestionnaire,
}: {
  analyses: any[]
  onViewDetail: () => void
  onRedoQuestionnaire: () => void
}) {
  const [expandedType, setExpandedType] = useState<"positive" | "negative" | null>("positive")
  const { positiveCount, negativeCount } = getAnalysisCounts(analyses)
  const totalCount = positiveCount + negativeCount

  // 分组分析数据
  const positiveItems = analyses.filter(
    (a) => a.type === "shanxue" || a.type === "lexue"
  )
  const negativeItems = analyses.filter(
    (a) => a.type === "tiaozhan" || a.type === "yanxue"
  )

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

  const toggleExpanded = (type: "positive" | "negative") => {
    // 如果点击的是当前展开的类型，则收起；否则展开新类型
    setExpandedType(expandedType === type ? null : type)
  }

  return (
    <div className="border border-[#1A4099]/20 rounded-xl shadow-sm">
      <div className="bg-[#1A4099]/5 px-2 py-1.5">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-[#1A4099]">
          <Brain className="w-5 h-5" />
          喜欢与天赋概览
        </h3>
      </div>
      <div className="space-y-0 px-2 py-1.5">
        <div className="flex justify-around items-center text-center gap-2">
          <button
            onClick={() => toggleExpanded("positive")}
            className={`space-y-0 py-2 rounded-xl w-full shadow-md border transition-colors cursor-pointer ${
              expandedType === "positive"
                ? "border-green-300 bg-green-100"
                : "border-green-200 bg-green-50 hover:bg-green-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold text-green-600">{positiveCount}</p>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">积极助力项</p>
          </button>
          <button
            onClick={() => toggleExpanded("negative")}
            className={`space-y-0 py-2 rounded-xl w-full shadow-md border transition-colors cursor-pointer ${
              expandedType === "negative"
                ? "border-red-300 bg-red-100"
                : "border-red-200 bg-red-50 hover:bg-red-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold text-red-600">{negativeCount}</p>
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm text-muted-foreground">潜在挑战项</p>
          </button>
        </div>

        {/* 积极助力项列表 - 点击后显示 */}
        {expandedType === "positive" && positiveItems.length > 0 && (
          <div className="mt-2 pt-2 border-t border-green-200 space-y-2">
            {positiveItems.map((item: any, index: number) => (
              <ItemCard key={index} item={item} type="positive" />
            ))}
          </div>
        )}

        {/* 潜在挑战项列表 - 点击后显示 */}
        {expandedType === "negative" && negativeItems.length > 0 && (
          <div className="mt-2 pt-2 border-t border-red-200 space-y-2">
            {negativeItems.map((item: any, index: number) => (
              <ItemCard key={index} item={item} type="negative" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 天赋匹配度详细分析显示组件
function MajorElementAnalysesDisplay({ analyses }: { analyses: any[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

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

        let typeIcon: React.ReactElement | null = null
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
                const itemBg = isExpanded ? "bg-[#1A4099]/10" : "bg-secondary hover:bg-secondary/80"

                return (
                  <div key={item.originalIndex} className="w-full">
                    <button
                      onClick={() => {
                        setExpandedIndex(isExpanded ? null : item.originalIndex)
                      }}
                      className={`text-sm px-2 py-1 rounded-lg transition-colors text-left w-full flex items-center justify-between group border ${itemBg} ${isExpanded ? "border-[#1A4099] shadow-sm" : "border-transparent"}`}
                    >
                      <span className="font-medium text-gray-800">{item.element?.name || "未命名"}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="mt-0.5 p-1 rounded-b-lg bg-[#1A4099]/5 space-y-0.5 border border-t-0 border-[#1A4099]/20">
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
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function CareerExplorationClient() {
  const router = useRouter()
  const majorData = fixedMajorData
  const [activeTab, setActiveTab] = useState("passion")
  const [majorDetailData, setMajorDetailData] = useState<any | null>(null)
  const [isLoadingMajorData, setIsLoadingMajorData] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)

  // 加载固定的 010101.json 数据
  useEffect(() => {
    setIsLoadingMajorData(true)
    fetch("/data/010101.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`)
        }
        return res.json()
      })
      .then((json) => {
        const data = json.data || json
        setMajorDetailData(data)
      })
      .catch((error) => {
        console.error("Error loading major detail data:", error)
      })
      .finally(() => {
        setIsLoadingMajorData(false)
      })
  }, [])

  const handleNotSuitable = () => {
    // 处理"该专业不适合"的逻辑
    router.back()
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <TopNav />
      {/* Header with curved bottom - 模仿其他页面 */}
      <div className="bg-[#1A4099] text-white px-4 pt-6 pb-8 relative">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-xl font-bold">
              深度探索 <span className="text-base font-normal">哲学</span>
            </h1>
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

      <div className="max-w-lg mx-auto">
        <div className="px-4 pt-4 pb-6 space-y-4">
          {/* 专业基本信息 */}
          <Card className="p-4 border">
              <div className="space-y-3">
                <div>
                  <h2 className="text-lg font-bold text-[#1A4099] mb-2">{majorData.code} 专业信息</h2>
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">学历层次:</span>
                      <span className="font-medium">{majorData.educationLevel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">学制:</span>
                      <span className="font-medium">{majorData.studyPeriod}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">授予学位:</span>
                      <span className="font-medium">{majorData.awardedDegree}</span>
                    </div>
                  </div>
                </div>

                {majorData.majorBrief && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground leading-relaxed">{majorData.majorBrief}</p>
                  </div>
                )}

                {majorData.majorKey && (
                  <div className="pt-2 border-t">
                    <p className="text-xs">
                      <span className="text-muted-foreground">关键词: </span>
                      <span className="font-medium">{majorData.majorKey}</span>
                    </p>
                  </div>
                )}
              </div>
            </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="passion" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                热爱能量
              </TabsTrigger>
              <TabsTrigger value="opportunity" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                职业发展
              </TabsTrigger>
            </TabsList>

            {/* 热爱能量 Tab */}
            <TabsContent value="passion" className="mt-4 space-y-4">
              {/* 热爱能量显示 */}
              {majorDetailData?.major && (
                <Card className="p-4 border">
                  <MajorScoreDisplay majorData={majorDetailData.major} />
                </Card>
              )}

              {/* 喜欢与天赋概览 */}
              {majorDetailData?.majorElementAnalyses && (
                <MajorAnalysisActionCard
                  analyses={majorDetailData.majorElementAnalyses}
                  onViewDetail={() => setShowDetailModal(true)}
                  onRedoQuestionnaire={() => setShowQuestionnaire(true)}
                />
              )}

              {/* 加载中状态 */}
              {isLoadingMajorData && (
                <Card className="p-4 border">
                  <div className="text-center py-8 text-muted-foreground">加载中...</div>
                </Card>
              )}
            </TabsContent>

            {/* 职业发展 Tab */}
            <TabsContent value="opportunity" className="mt-4 space-y-4">
              {/* 产业前景 */}
              {majorData.industryProspectsTag && (
                <Card className="p-4 border">
                  <Collapsible>
                    <div>
                      <CollapsibleTrigger className="w-full text-left hover:opacity-80 transition-opacity">
                        <div className="text-sm font-bold text-muted-foreground mb-1">产业前景：</div>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full inline-block">
                            {majorData.industryProspectsTag}
                          </div>
                          <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180 ml-auto" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 pt-2 border-t space-y-2 text-xs text-muted-foreground leading-relaxed">
                        {majorData.industryProspects && (
                          typeof majorData.industryProspects === "string" ? (
                            <p>{majorData.industryProspects}</p>
                          ) : (
                            <div className="space-y-2">
                              {majorData.industryProspects.指数得分 && (
                                <p className="font-medium text-foreground">{majorData.industryProspects.指数得分}</p>
                              )}
                              {majorData.industryProspects.行业前景 && <p>{majorData.industryProspects.行业前景}</p>}
                              {majorData.industryProspects.趋势性风险 && (
                                <div className="space-y-1 pt-2 border-t">
                                  <p className="font-medium text-foreground">趋势性风险:</p>
                                  {Object.entries(majorData.industryProspects.趋势性风险).map(([key, value]) => (
                                    <p key={key}>
                                      <span className="font-medium">{key}:</span> {String(value)}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                </Card>
              )}

              {/* 职业回报 */}
              {majorData.careerDevelopmentTag && (
                <Card className="p-4 border">
                  <Collapsible>
                    <div>
                      <CollapsibleTrigger className="w-full text-left hover:opacity-80 transition-opacity">
                        <div className="text-sm font-bold text-muted-foreground mb-1">职业回报：</div>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full inline-block">
                            {majorData.careerDevelopmentTag}
                          </div>
                          <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180 ml-auto" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 pt-2 border-t space-y-2 text-xs text-muted-foreground leading-relaxed">
                        {majorData.careerDevelopment && (
                          typeof majorData.careerDevelopment === "string" ? (
                            <p>{majorData.careerDevelopment}</p>
                          ) : (
                            <div className="space-y-2">
                              {majorData.careerDevelopment.指数得分 && (
                                <p className="font-medium text-foreground">{majorData.careerDevelopment.指数得分}</p>
                              )}
                              {majorData.careerDevelopment.薪酬水平参考 && (
                                <div className="space-y-1">
                                  {majorData.careerDevelopment.薪酬水平参考.起薪区间 && (
                                    <p>{majorData.careerDevelopment.薪酬水平参考.起薪区间}</p>
                                  )}
                                  {majorData.careerDevelopment.薪酬水平参考["3-5年薪资区间"] && (
                                    <p>{majorData.careerDevelopment.薪酬水平参考["3-5年薪资区间"]}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                </Card>
              )}

              {/* 成长空间 */}
              {majorData.growthPotentialTag && (
                <Card className="p-4 border">
                  <Collapsible>
                    <div>
                      <CollapsibleTrigger className="w-full text-left hover:opacity-80 transition-opacity">
                        <div className="text-sm font-bold text-muted-foreground mb-1">成长空间：</div>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full inline-block">
                            {majorData.growthPotentialTag}
                          </div>
                          <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180 ml-auto" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 pt-2 border-t space-y-2 text-xs text-muted-foreground leading-relaxed">
                        {majorData.growthPotential && (
                          typeof majorData.growthPotential === "string" ? (
                            <p>{majorData.growthPotential}</p>
                          ) : (
                            <div className="space-y-2">
                              {majorData.growthPotential.指数得分 && (
                                <p className="font-medium text-foreground">{majorData.growthPotential.指数得分}</p>
                              )}
                              {majorData.growthPotential.工作环境提示 && (
                                <p>{majorData.growthPotential.工作环境提示}</p>
                              )}
                              {majorData.growthPotential.横向发展可能 && (
                                <p>{majorData.growthPotential.横向发展可能}</p>
                              )}
                            </div>
                          )
                        )}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                </Card>
              )}

              {/* 学业发展 */}
              {majorData.academicDevelopmentTag && (
                <Card className="p-4 border">
                  <div>
                    <div className="text-sm font-bold text-muted-foreground mb-1">学业发展：</div>
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full inline-block">
                      {majorData.academicDevelopmentTag}
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>


          {/* 该专业不适合按钮 */}
          <div className="sticky bottom-4 mt-6">
            <Button
              onClick={handleNotSuitable}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base font-semibold shadow-lg"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              该专业不适合我
            </Button>
          </div>
        </div>
      </div>

      {/* 天赋匹配度详细分析对话框 */}
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

