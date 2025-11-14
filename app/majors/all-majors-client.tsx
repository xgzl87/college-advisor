"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Star, ChevronDown, ChevronUp, ArrowUp } from "lucide-react"
import Link from "next/link"
import { TalentMatchModal } from "@/components/talent-match-modal"
import { useRouter } from "next/navigation"

interface MajorScore {
  majorCode: string
  majorName: string
  majorBrief: string
  eduLevel: string
  yanxueDeduction: string
  tiaozhanDeduction: string
  score: string
  lexueScore: string
  shanxueScore: string
  schoolCount: string
  industryProspectsScore: string
  opportunityScore: string
  developmentPotential: string
  academicDevelopmentScore: string
  careerDevelopmentScore: string
  growthPotentialScore: string
  isMatching: boolean
}

interface UserScoreData {
  userId: string
  scores: MajorScore[]
}

interface ModalState {
  open: boolean
  majorCode: string
  majorName: string
  matchScore: number
}

const EDU_LEVEL_MAP: Record<string, string> = {
  本科: "ben",
  高职本科: "gzb",
  专科: "zhuan",
}

export default function AllMajorsClient({ activeTab }: { activeTab: string }) {
  const [data, setData] = useState<UserScoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [intendedMajors, setIntendedMajors] = useState<Set<string>>(new Set())
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({})
  const [flyingMajor, setFlyingMajor] = useState<{
    code: string
    x: number
    y: number
    targetX: number
    targetY: number
  } | null>(null)
  const [expandedBriefs, setExpandedBriefs] = useState<Set<string>>(new Set())
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    majorCode: "",
    majorName: "",
    matchScore: 0,
  })
  const intendedButtonRef = useRef<HTMLAnchorElement>(null)
  const router = useRouter()
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    fetch("/data/user-score.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Error loading user score data:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetch("/data/alternatives.json")
      .then((res) => res.json())
      .then((json) => {
        if (json.data?.alternatives) {
          const counts: Record<string, number> = {}
          json.data.alternatives.forEach((item: { majorCode: string }) => {
            counts[item.majorCode] = (counts[item.majorCode] || 0) + 1
          })
          setApplicationCounts(counts)
        }
      })
      .catch((error) => {
        console.error("[v0] Error loading alternatives data:", error)
      })
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem("intendedMajors")
    if (stored) {
      try {
        setIntendedMajors(new Set(JSON.parse(stored)))
      } catch (error) {
        console.error("[v0] Error loading intended majors:", error)
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleIntendedMajor = (major: MajorScore, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const isAlreadyIntended = intendedMajors.has(major.majorCode)

    if (isAlreadyIntended) {
      setIntendedMajors((prev) => {
        const newSet = new Set(prev)
        newSet.delete(major.majorCode)
        localStorage.setItem("intendedMajors", JSON.stringify(Array.from(newSet)))
        return newSet
      })
    } else {
      // 直接加入心动专业列表，不显示弹框
      const rect = intendedButtonRef.current?.getBoundingClientRect()

      setIntendedMajors((prev) => {
        const newSet = new Set(prev)
        newSet.add(major.majorCode)
        localStorage.setItem("intendedMajors", JSON.stringify(Array.from(newSet)))
        return newSet
      })

      // 显示飞行动画
      if (rect) {
        const targetX = rect.left + rect.width / 2
        const targetY = rect.top + rect.height / 2
        setFlyingMajor({
          code: major.majorCode,
          x: event.clientX,
          y: event.clientY,
          targetX: targetX,
          targetY: targetY,
        })
        setTimeout(() => setFlyingMajor(null), 1000)
      }
    }
  }

  const toggleBrief = (majorCode: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setExpandedBriefs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(majorCode)) {
        newSet.delete(majorCode)
      } else {
        newSet.add(majorCode)
      }
      return newSet
    })
  }

  const handleConfirmIntention = () => {
    const rect = intendedButtonRef.current?.getBoundingClientRect()

    setIntendedMajors((prev) => {
      const newSet = new Set(prev)
      newSet.add(modalState.majorCode)
      localStorage.setItem("intendedMajors", JSON.stringify(Array.from(newSet)))
      return newSet
    })

    if (rect) {
      const targetX = rect.left + rect.width / 2
      const targetY = rect.top + rect.height / 2
      setFlyingMajor({
        code: modalState.majorCode,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        targetX: targetX,
        targetY: targetY,
      })
      setTimeout(() => setFlyingMajor(null), 1000)
    }

    setModalState({ open: false, majorCode: "", majorName: "", matchScore: 0 })
  }

  const handleViewDetails = () => {
    setModalState({ open: false, majorCode: "", majorName: "", matchScore: 0 })
    router.push(`/assessment/single-major?code=${modalState.majorCode}`)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const filteredMajors = useMemo(() => {
    if (!data) return []

    let majors = data.scores

    console.log("[v0] Total majors:", majors.length)
    console.log("[v0] Active tab:", activeTab)
    console.log(
      "[v0] Sample eduLevel values:",
      majors.slice(0, 5).map((m) => m.eduLevel),
    )

    const eduLevelCode = EDU_LEVEL_MAP[activeTab]
    if (eduLevelCode) {
      majors = majors.filter((m) => m.eduLevel === eduLevelCode)
    }

    console.log("[v0] Majors after eduLevel filter:", majors.length)

    if (searchQuery.trim()) {
      majors = majors.filter((m) => m.majorName.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    return majors.slice(0, 50)
  }, [data, searchQuery, activeTab])

  const mockAnalyses = [
    {
      id: 6402,
      type: "shanxue" as const,
      summary: "在理解内容后迅速发现与己认知不一致处",
      matchReason:
        "哲学研究充满了概念辨析、逻辑论证和批判性反思。能够敏锐地识别不同哲学理论之间的细微差别、逻辑前提的强弱、论证的有效性，是进行哲学思考和创新的核心天赋。",
      theoryBasis: "批判性思维能力的核心要素之一就是识别论证中的谬误和不一致性。",
      rawInput: null,
      potentialConversionReason: null,
      potentialConversionValue: null,
      element: {
        id: 35,
        name: "听-能听出不同的点-需理解内容",
        type: "talent",
        status: "理解内容后，能迅速听出和自己认知不一致的点",
        dimension: "听",
      },
    },
    {
      id: 6010,
      type: "shanxue" as const,
      summary: "遇启发内容时能发现触发思考的关键语句，并自动记忆",
      matchReason:
        "哲学经典中蕴含着大量高度凝练且富有启发性的思想和论断。能够快速抓住这些金句并深刻理解其内涵，对于把握哲学家的核心思想和进行有效的哲学反思至关重要。",
      theoryBasis: "专家知识获取理论表明，专家能够快速识别领域内的核心信息并将其组织成有意义的结构。",
      rawInput: null,
      potentialConversionReason: null,
      potentialConversionValue: null,
      element: {
        id: 42,
        name: "记-能记住有意义的内容-得到启发的内容",
        type: "talent",
        status: "遇到启发自己的内容时，能发现触发自己学习或思考的关键语句",
        dimension: "记",
      },
    },
    {
      id: 6234,
      type: "shanxue" as const,
      summary: "多人沟通时能迅速发现共同关注，本能地逻辑表达",
      matchReason:
        "虽然哲学思考很多时候是独立的，但哲学研讨和交流（如课堂讨论、学术会议）也是推动思想发展的重要途径。能够在多人讨论中准确把握议题核心，并用清晰的逻辑将自己的复杂哲学思考表达出来，是一种重要的天赋。",
      theoryBasis: "沟通能力和逻辑表达能力是学术交流的基础。",
      rawInput: null,
      potentialConversionReason: null,
      potentialConversionValue: null,
      element: {
        id: 37,
        name: "说-能说出对方一听就明白的话-多人沟通",
        type: "talent",
        status: "多人沟通时，能迅速发现大家共同的关注",
        dimension: "说",
      },
    },
    {
      id: 6235,
      type: "shanxue" as const,
      summary: "善于发现问题本质并进行深度分析",
      matchReason:
        "哲学的核心就是对问题本质的探究和深度分析。能够透过现象看本质，进行系统性的思考和分析，是哲学研究的基本能力。",
      theoryBasis: "批判性思维和分析能力是哲学研究的基础。",
      rawInput: null,
      potentialConversionReason: null,
      potentialConversionValue: null,
      element: {
        id: 38,
        name: "想-能发现问题本质-深度分析",
        type: "talent",
        status: "善于发现问题的本质并进行深度分析",
        dimension: "想",
      },
    },
    {
      id: 8987,
      type: "lexue" as const,
      summary: "特指其中的演讲、深度访谈等有声内容",
      matchReason:
        "哲学思想的交流和发展也大量依赖于讲座、研讨会、访谈等口头形式。喜欢聆听和理解复杂的口头论述，并能从中获得愉悦和启发，对于哲学学习非常重要。",
      theoryBasis: "苏格拉底的产婆术即是通过对话和诘问来激发思考。",
      rawInput: null,
      potentialConversionReason: null,
      potentialConversionValue: null,
      element: {
        id: 5,
        name: "听-在接收中听-人/乐器声为主旋律的音/乐",
        type: "like",
        status: "经常主动欣赏音乐或倾听他人分享",
        dimension: "听",
      },
    },
    {
      id: 8214,
      type: "lexue" as const,
      summary: "纯粹为兴趣深入探究复杂问题",
      matchReason:
        "哲学探究的是关于存在、知识、价值、理性、心灵和语言等最根本、最普遍的问题，这些问题往往没有标准答案，需要纯粹的思辨和对概念的深度挖掘。对这类非功利性的、探索本质的复杂问题抱有强烈兴趣是学习哲学的核心动力。",
      theoryBasis: "存在主义哲学强调个体对意义和真理的自主探索和追问。",
      rawInput: null,
      potentialConversionReason: null,
      potentialConversionValue: null,
      element: {
        id: 20,
        name: "想-刻意思考-不需要达到的",
        type: "like",
        status: "经常为某种发现不停琢磨",
        dimension: "想",
      },
    },
    {
      id: 8818,
      type: "lexue" as const,
      summary: "对作品中的精彩情节、经典台词或生动人物常常自动浮现",
      matchReason:
        "哲学史本身就是一部充满经典著作和深刻思想的文本史。对这些文本内容（如哲学家的核心论点、关键概念、思想实验）有强烈的自发记忆和回味兴趣，有助于深入理解和把握哲学思想的脉络。",
      theoryBasis: "文本解释学（Hermeneutics）强调对经典文本的细致研读和多重解读在理解思想中的重要性。",
      rawInput: null,
      potentialConversionReason: null,
      potentialConversionValue: null,
      element: {
        id: 14,
        name: "记-自动记忆-看书/影视作品等看到的或听说的",
        type: "like",
        status: "经常不知道在哪里记住了各种各样的东西",
        dimension: "记",
      },
    },
    {
      id: 19014,
      type: "tiaozhan" as const,
      summary: "",
      matchReason:
        "该天赋的核心在于高效沟通、化繁为简、快速达成共识。而哲学的学习和研讨过程，往往是复杂的、充满分歧的、追求概念精确而非快速共识的。一个天生追求简洁高效沟通的学生，在阅读充满晦涩术语和复杂论证的哲学原典时，可能会感到极度不适。",
      theoryBasis: "",
      rawInput: "",
      potentialConversionReason:
        "这是典型的阶段性冲突。学生需要学习适应学术语言的严谨性和复杂性。在后期从事哲学普及、教学或将哲学思想应用于公共领域时，这种能把艰深内容讲明白的能力将是巨大优势。",
      potentialConversionValue: "high",
      element: {
        id: 37,
        name: "说-能说出对方一听就明白的话-多人沟通",
        type: "talent",
        status: "多人沟通时，能迅速发现大家共同的关注",
        dimension: "说",
      },
    },
    {
      id: 19013,
      type: "yanxue" as const,
      summary: "",
      matchReason:
        "此喜欢维度的核心乐趣在于将抽象想法通过动手实验、数据计算等方式进行验证和实现，获得心想事成的鼓舞。而纯粹的哲学研究，特别是形而上学、伦理学等领域，其思考成果往往无法通过物理实验或计算来验证，其价值在于逻辑的思辨和概念的阐释。",
      theoryBasis: "",
      rawInput: "",
      potentialConversionReason:
        "冲突具有持续性。虽然科学哲学等分支会涉及对科学实践的反思，但哲学专业的核心工作流仍然是思辨而非实证。转化需要个体能够从纯粹的逻辑和思辨中找到新的乐趣源泉，这有一定难度。",
      potentialConversionValue: "medium",
      element: {
        id: 21,
        name: "做-能独立完成的-偏思维运算类",
        type: "like",
        status: "经常主动验证方法的正确性",
        dimension: "做",
      },
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">加载失败</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      <Link
        ref={intendedButtonRef}
        href="/assessment/favorite-majors"
        className="fixed bottom-20 right-4 z-50 bg-[#1A4099] text-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
        aria-label="心动专业"
      >
        <Star className="w-6 h-6 fill-[#FF7F50] text-[#FF7F50]" />
        {intendedMajors.size > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {intendedMajors.size}
          </span>
        )}
      </Link>

      {flyingMajor && (
        <div
          className="fixed z-[60] pointer-events-none"
          style={{
            left: `${flyingMajor.x}px`,
            top: `${flyingMajor.y}px`,
            '--target-x': `${flyingMajor.targetX - flyingMajor.x}px`,
            '--target-y': `${flyingMajor.targetY - flyingMajor.y}px`,
            animation: `flyToHeart 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
          } as React.CSSProperties}
        >
          <Star className="w-8 h-8 fill-[#FF7F50] text-[#FF7F50] drop-shadow-lg" />
        </div>
      )}

      <div className="sticky top-0 z-10 bg-background">
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A4099]" />
            <Input
              placeholder="搜索专业名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm border-0 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-2">
        {filteredMajors.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>未找到匹配的专业</p>
          </div>
        ) : (
          filteredMajors.map((major) => (
            <Link key={major.majorCode} href={`/assessment/single-major?code=${major.majorCode}`}>
              <Card className="p-3 hover:shadow-lg transition-shadow cursor-pointer border">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-base text-[#1A4099]">{major.majorName}</h3>
                        <span className="text-xs text-muted-foreground">({major.majorCode})</span>
                        {applicationCounts[major.majorCode] > 0 && (
                          <span className="inline-flex items-center text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {applicationCounts[major.majorCode]} 个志愿
                          </span>
                        )}
                        <span className="inline-flex items-center text-xs font-bold bg-[#FF7F50]/10 text-[#FF7F50] px-2 py-0.5 rounded-full">
                          热爱能量: {major.score}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleIntendedMajor(major, e)
                      }}
                      className="ml-auto hover:scale-110 transition-transform flex-shrink-0 w-7 h-7 flex items-center justify-center relative z-10"
                      aria-label={intendedMajors.has(major.majorCode) ? "取消意向专业" : "加入意向专业"}
                    >
                      <Star
                        className={`w-5 h-5 pointer-events-none ${
                          intendedMajors.has(major.majorCode) ? "fill-[#FF7F50] text-[#FF7F50]" : "text-gray-300"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-start gap-1">
                    <p
                      className={`text-xs text-muted-foreground leading-snug flex-1 ${
                        expandedBriefs.has(major.majorCode) ? "" : "line-clamp-1"
                      }`}
                    >
                      {major.majorBrief}
                    </p>
                    <button
                      onClick={(e) => toggleBrief(major.majorCode, e)}
                      className="flex-shrink-0 text-[#1A4099] hover:text-[#FF7F50] transition-colors"
                      aria-label={expandedBriefs.has(major.majorCode) ? "收起" : "展开"}
                    >
                      {expandedBriefs.has(major.majorCode) ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-36 right-4 z-50 bg-[#1A4099] text-white rounded-full p-3 shadow-lg hover:scale-110 transition-all"
          aria-label="回到顶部"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <TalentMatchModal
        open={modalState.open}
        onOpenChange={(open) => setModalState({ ...modalState, open })}
        majorName={modalState.majorName}
        majorCode={modalState.majorCode}
        matchScore={modalState.matchScore}
        ranking={5}
        analyses={mockAnalyses}
        onConfirmIntention={handleConfirmIntention}
        onViewDetails={handleViewDetails}
      />
    </div>
  )
}
