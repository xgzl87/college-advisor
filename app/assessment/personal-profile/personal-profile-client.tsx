"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Sparkles, CheckCircle2, XCircle, Brain, Users, Target, BookOpen, Lightbulb, ChevronDown, Crown, Rocket, Zap, Compass } from "lucide-react"
import { cn } from "@/lib/utils"

// 数据接口定义
interface Portrait {
  id: number
  like_id: number
  talent_id: number
  like_obvious: boolean
  talent_obvious: boolean
  name: string
  explain: string
}

interface Challenge {
  id: number
  like_id: number
  talent_id: number
  like_obvious: boolean
  talent_obvious: boolean
  type: string
  name: string
  content: string
  strategy: string
}

interface Element {
  id: number
  name: string
  type: string
  dimension: string
  correlation_talent_id: number | null
}

interface Mechanism {
  id: number
  reason_id: number
  element_id: number
  content: string
  brief: string
  remarks: string | null
}

// Portrait 分类类型
type PortraitCategory = "热爱高潜能" | "兴趣驱动型" | "能力高效型" | "迷茫待探索"

// Challenge 类型映射
const challengeTypeMap: Record<string, string> = {
  "自我认知与内驱力管理": "自我认知",
  "人际协作与社会融合": "人际协作",
  "认知策略与能力构建": "能力构建"
}

// 获取 portrait 分类
function getPortraitCategory(portrait: Portrait): PortraitCategory {
  if (portrait.like_obvious && portrait.talent_obvious) {
    return "热爱高潜能"
  } else if (portrait.like_obvious && !portrait.talent_obvious) {
    return "兴趣驱动型"
  } else if (!portrait.like_obvious && portrait.talent_obvious) {
    return "能力高效型"
  } else {
    return "迷茫待探索"
  }
}

// 根据分类获取对应的图标
function getPortraitIcon(category: PortraitCategory) {
  switch (category) {
    case "热爱高潜能":
      return <Crown className="w-5 h-5 text-[#FF7F50]" />
    case "兴趣驱动型":
      return <Rocket className="w-5 h-5 text-[#1A4099]" />
    case "能力高效型":
      return <Zap className="w-5 h-5 text-[#FF7F50]" />
    case "迷茫待探索":
      return <Compass className="w-5 h-5 text-[#1A4099]" />
    default:
      return <Sparkles className="w-5 h-5 text-[#1A4099]" />
  }
}

// Portrait 卡片组件
function PortraitCard({ 
  portrait, 
  challenges, 
  elements, 
  mechanisms 
}: { 
  portrait: Portrait
  challenges: Challenge[]
  elements: Element[]
  mechanisms: Mechanism[]
}) {
  // 根据 portrait 的 like_id 和 talent_id 查找关联的 challenges
  const relatedChallenges = challenges.filter(
    (c) =>
      c.like_id === portrait.like_id &&
      c.talent_id === portrait.talent_id &&
      c.like_obvious === portrait.like_obvious &&
      c.talent_obvious === portrait.talent_obvious
  )

  // 将 challenges 按类型分组
  const challengesByType = {
    自我认知: relatedChallenges.filter((c) => challengeTypeMap[c.type] === "自我认知"),
    人际协作: relatedChallenges.filter((c) => challengeTypeMap[c.type] === "人际协作"),
    能力构建: relatedChallenges.filter((c) => challengeTypeMap[c.type] === "能力构建")
  }

  // 根据 portrait 的 like_id 和 talent_id 查找关联的 elements
  const likeElement = elements.find((e) => e.id === portrait.like_id && e.type === "like")
  const talentElement = elements.find((e) => e.id === portrait.talent_id && e.type === "talent")

  // 查找关联的 mechanisms（通过 element_id 匹配）
  const likeMechanisms = mechanisms.filter((m) => m.element_id === portrait.like_id)
  const talentMechanisms = mechanisms.filter((m) => m.element_id === portrait.talent_id)

  // 获取 portrait 分类和对应图标
  const category = getPortraitCategory(portrait)
  const categoryIcon = getPortraitIcon(category)

  return (
    <Card className="p-2 bg-white border-2 border-[#1A4099]/20 shadow-lg mb-1">
      {/* Portrait 基本信息 */}
      <div className="mb-0">
        <h3 className="text-lg md:text-xl font-extrabold text-[#1A4099] mb-0.5 flex items-center gap-2">
          {categoryIcon}
          {portrait.name}
        </h3>
        <p className="text-sm text-gray-700 leading-tight mb-0">
          {portrait.explain}
        </p>
      </div>

      {/* Challenge Tabs - 默认隐藏 */}
      {relatedChallenges.length > 0 && (
        <Collapsible className="mb-0 -mt-1">
          <CollapsibleTrigger className="flex items-center gap-2 w-full text-left hover:opacity-80 transition-opacity group py-0">
            <Target className="w-4 h-4 text-[#1A4099]" />
            <h4 className="text-xs font-semibold text-[#1A4099]">潜在挑战与应对策略</h4>
            <ChevronDown className="w-4 h-4 ml-auto text-[#1A4099] transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
            <Tabs defaultValue="自我认知" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-1">
                <TabsTrigger value="自我认知">自我认知</TabsTrigger>
                <TabsTrigger value="人际协作">人际协作</TabsTrigger>
                <TabsTrigger value="能力构建">能力构建</TabsTrigger>
              </TabsList>
              <TabsContent value="自我认知" className="mt-1">
                <div className="space-y-1">
                  {challengesByType.自我认知.length > 0 ? (
                    challengesByType.自我认知.map((challenge) => (
                      <Card key={challenge.id} className="p-1.5 bg-gradient-to-r from-[#FF7F50]/5 to-transparent border-l-4 border-[#FF7F50]">
                        <h5 className="font-semibold text-[#1A4099] mb-0.5 text-sm">{challenge.name}</h5>
                        <p className="text-xs text-gray-700 mb-0.5">{challenge.content}</p>
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center gap-1 w-full text-left hover:opacity-80 transition-opacity group">
                            <p className="text-xs font-medium text-[#1A4099]">应对策略</p>
                            <ChevronDown className="w-3 h-3 ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-0.5 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                            <div className="p-1.5 bg-white/80 rounded-lg">
                              <p className="text-xs text-gray-600 whitespace-pre-line leading-tight">{challenge.strategy}</p>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2">暂无相关挑战</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="人际协作" className="mt-1">
                <div className="space-y-1">
                  {challengesByType.人际协作.length > 0 ? (
                    challengesByType.人际协作.map((challenge) => (
                      <Card key={challenge.id} className="p-1.5 bg-gradient-to-r from-[#FF7F50]/5 to-transparent border-l-4 border-[#FF7F50]">
                        <h5 className="font-semibold text-[#1A4099] mb-0.5 text-sm">{challenge.name}</h5>
                        <p className="text-xs text-gray-700 mb-0.5">{challenge.content}</p>
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center gap-1 w-full text-left hover:opacity-80 transition-opacity group">
                            <p className="text-xs font-medium text-[#1A4099]">应对策略</p>
                            <ChevronDown className="w-3 h-3 ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-0.5 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                            <div className="p-1.5 bg-white/80 rounded-lg">
                              <p className="text-xs text-gray-600 whitespace-pre-line leading-tight">{challenge.strategy}</p>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2">暂无相关挑战</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="能力构建" className="mt-1">
                <div className="space-y-1">
                  {challengesByType.能力构建.length > 0 ? (
                    challengesByType.能力构建.map((challenge) => (
                      <Card key={challenge.id} className="p-1.5 bg-gradient-to-r from-[#FF7F50]/5 to-transparent border-l-4 border-[#FF7F50]">
                        <h5 className="font-semibold text-[#1A4099] mb-0.5 text-sm">{challenge.name}</h5>
                        <p className="text-xs text-gray-700 mb-0.5">{challenge.content}</p>
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center gap-1 w-full text-left hover:opacity-80 transition-opacity group">
                            <p className="text-xs font-medium text-[#1A4099]">应对策略</p>
                            <ChevronDown className="w-3 h-3 ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-0.5 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                            <div className="p-1.5 bg-white/80 rounded-lg">
                              <p className="text-xs text-gray-600 whitespace-pre-line leading-tight">{challenge.strategy}</p>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2">暂无相关挑战</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Element 和 Mechanism - 默认隐藏 */}
      <Collapsible className="mb-0 -mt-1">
        <CollapsibleTrigger className="flex items-center gap-2 w-full text-left hover:opacity-80 transition-opacity group py-0">
          <Brain className="w-4 h-4 text-[#FF7F50]" />
          <h4 className="text-xs font-semibold text-[#FF7F50]">核心要素与机制解析</h4>
          <ChevronDown className="w-4 h-4 ml-auto text-[#FF7F50] transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
          <div className="space-y-1">
            {/* 喜欢要素 */}
            {likeElement && (
              <Card className="p-1.5 bg-gradient-to-br from-[#1A4099]/5 to-transparent border border-[#1A4099]/20">
                <div className="flex items-center gap-2 mb-0.5">
                  <Sparkles className="w-3 h-3 text-[#1A4099]" />
                  <h5 className="font-semibold text-[#1A4099] text-sm">喜欢</h5>
                  <p className="text-xs text-gray-700">{likeElement.name}</p>
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    portrait.like_obvious 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {portrait.like_obvious ? "明显" : "不明显"}
                  </span>
                </div>
                {likeMechanisms.length > 0 && (
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-1 w-full text-left hover:opacity-80 transition-opacity group">
                      <p className="text-xs font-medium text-[#1A4099]">机制解析</p>
                      <ChevronDown className="w-3 h-3 ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-0.5 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                      <div className="space-y-0.5">
                        {likeMechanisms.map((mechanism) => (
                          <div key={mechanism.id} className="p-1.5 bg-white/80 rounded-lg">
                            <p className="text-xs text-gray-600 leading-tight">{mechanism.brief || mechanism.content}</p>
                            {mechanism.remarks && (
                              <p className="text-xs text-gray-500 italic leading-tight mt-0.5">{mechanism.remarks}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </Card>
            )}

            {/* 天赋要素 */}
            {talentElement && (
              <Card className="p-1.5 bg-gradient-to-br from-[#FF7F50]/5 to-transparent border border-[#FF7F50]/20">
                <div className="flex items-center gap-2 mb-0.5">
                  <Lightbulb className="w-3 h-3 text-[#FF7F50]" />
                  <h5 className="font-semibold text-[#FF7F50] text-sm">天赋</h5>
                  <p className="text-xs text-gray-700">{talentElement.name}</p>
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    portrait.talent_obvious 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {portrait.talent_obvious ? "明显" : "不明显"}
                  </span>
                </div>
                {talentMechanisms.length > 0 && (
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-1 w-full text-left hover:opacity-80 transition-opacity group">
                      <p className="text-xs font-medium text-[#FF7F50]">机制解析</p>
                      <ChevronDown className="w-3 h-3 ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-0.5 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                      <div className="space-y-0.5">
                        {talentMechanisms.map((mechanism) => (
                          <div key={mechanism.id} className="p-1.5 bg-white/80 rounded-lg">
                            <p className="text-xs text-gray-600 leading-tight">{mechanism.brief || mechanism.content}</p>
                            {mechanism.remarks && (
                              <p className="text-xs text-gray-500 italic leading-tight mt-0.5">{mechanism.remarks}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </Card>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export function PersonalProfileClient() {
  const [portraits, setPortraits] = useState<Portrait[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [elements, setElements] = useState<Element[]>([])
  const [mechanisms, setMechanisms] = useState<Mechanism[]>([])
  const [loading, setLoading] = useState(true)

  // 将 portraits 按分类分组
  const portraitsByCategory = {
    热爱高潜能: portraits.filter((p) => p.like_obvious && p.talent_obvious),
    兴趣驱动型: portraits.filter((p) => p.like_obvious && !p.talent_obvious),
    能力高效型: portraits.filter((p) => !p.like_obvious && p.talent_obvious),
    迷茫待探索: portraits.filter((p) => !p.like_obvious && !p.talent_obvious)
  }

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/data/report.json")
        const data = await response.json()
        
        setPortraits(data.portrait || [])
        setChallenges(data.challenge || [])
        setElements(data.element || [])
        setMechanisms(data.mechanism || [])
      } catch (error) {
        console.error("加载报告数据失败:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="p-4">
          <Card className="p-6">
            <div className="text-center text-muted-foreground">加载中...</div>
          </Card>
        </div>
      </div>
    )
  }

  if (portraits.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="p-4">
          <Card className="p-6">
            <div className="text-center text-muted-foreground">暂无画像数据</div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-16">
      {/* 头部区域 */}
      <div className="bg-gradient-to-b from-[#1A4099] via-[#2563eb]/80 to-transparent text-white px-2 pt-4 pb-12 relative">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-xl font-bold">个人特质分析</h1>
        </div>

        {/* Wave effect at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 bg-[#F5F5F5]"
          style={{
            clipPath: "ellipse(100% 100% at 50% 100%)",
          }}
        />
      </div>

      <div className="px-2 -mt-8 pb-1 relative z-10">
        {/* Portrait Tabs */}
        <Card className="p-2 bg-white border-2 border-[#1A4099]/20 shadow-lg mb-1">
          <Tabs defaultValue="热爱高潜能" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-1">
              <TabsTrigger value="热爱高潜能">热爱高潜能</TabsTrigger>
              <TabsTrigger value="兴趣驱动型">兴趣驱动型</TabsTrigger>
              <TabsTrigger value="能力高效型">能力高效型</TabsTrigger>
              <TabsTrigger value="迷茫待探索">迷茫待探索</TabsTrigger>
            </TabsList>

            <TabsContent value="热爱高潜能">
              <div className="space-y-1">
                {portraitsByCategory.热爱高潜能.length > 0 ? (
                  portraitsByCategory.热爱高潜能.map((portrait) => (
                    <PortraitCard
                      key={portrait.id}
                      portrait={portrait}
                      challenges={challenges}
                      elements={elements}
                      mechanisms={mechanisms}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">暂无数据</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="兴趣驱动型">
              <div className="space-y-1">
                {portraitsByCategory.兴趣驱动型.length > 0 ? (
                  portraitsByCategory.兴趣驱动型.map((portrait) => (
                    <PortraitCard
                      key={portrait.id}
                      portrait={portrait}
                      challenges={challenges}
                      elements={elements}
                      mechanisms={mechanisms}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">暂无数据</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="能力高效型">
              <div className="space-y-1">
                {portraitsByCategory.能力高效型.length > 0 ? (
                  portraitsByCategory.能力高效型.map((portrait) => (
                    <PortraitCard
                      key={portrait.id}
                      portrait={portrait}
                      challenges={challenges}
                      elements={elements}
                      mechanisms={mechanisms}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">暂无数据</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="迷茫待探索">
              <div className="space-y-1">
                {portraitsByCategory.迷茫待探索.length > 0 ? (
                  portraitsByCategory.迷茫待探索.map((portrait) => (
                    <PortraitCard
                      key={portrait.id}
                      portrait={portrait}
                      challenges={challenges}
                      elements={elements}
                      mechanisms={mechanisms}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">暂无数据</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
