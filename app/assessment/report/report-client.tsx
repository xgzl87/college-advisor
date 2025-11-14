"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertCircle, Heart, Sparkles, Zap, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react"

interface Scale {
  id: number
  content: string
  answer: string
}

interface Element {
  id: number
  name: string
  type: "like" | "talent"
  dimension: string
  ownedNaturalState: string
  unownedNaturalState: string
  attribute: string
  scales: Scale[]
}

interface DoubleEdgedElement {
  likeElementId: number
  talentElementId: number
  name: string
  demonstrate: string
  affect: string
}

interface ReportData {
  likeDefinition: string
  talentDefinition: string
  doubleEdgedDefinition: string
  myLikeAndTalent: {
    elements: Element[]
    doubleEdgedElements: DoubleEdgedElement[]
  }
}

export function ReportClient() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedElements, setExpandedElements] = useState<Set<number>>(new Set())

  const toggleElement = (id: number) => {
    setExpandedElements((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  useEffect(() => {
    async function loadReport() {
      try {
        const response = await fetch("/data/report.json")
        if (!response.ok) {
          throw new Error("加载报告失败")
        }
        const data = await response.json()
        setReportData(data.data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "未知错误")
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载报告中...</p>
        </div>
      </div>
    )
  }

  if (error || !reportData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6 max-w-md">
          <div className="flex items-center gap-3 text-destructive mb-2">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-semibold">加载失败</h3>
          </div>
          <p className="text-sm text-muted-foreground">{error || "无法加载报告数据"}</p>
        </Card>
      </div>
    )
  }

  const likeElements = reportData.myLikeAndTalent.elements.filter((e) => e.type === "like")
  const talentElements = reportData.myLikeAndTalent.elements.filter((e) => e.type === "talent")

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-8">
        <h1 className="text-2xl font-bold mb-2">我的评估报告</h1>
        <p className="text-primary-foreground/90 text-sm">发现你的喜欢与天赋</p>
      </div>

      <div className="px-4 space-y-6">
        {/* Definitions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">核心概念</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Heart className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">喜欢</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{reportData.likeDefinition}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">天赋</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{reportData.talentDefinition}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">双刃剑</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{reportData.doubleEdgedDefinition}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Elements Tabs */}
        <Tabs defaultValue="like" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="like">
              <Heart className="w-4 h-4 mr-2" />
              喜欢 ({likeElements.length})
            </TabsTrigger>
            <TabsTrigger value="talent">
              <Sparkles className="w-4 h-4 mr-2" />
              天赋 ({talentElements.length})
            </TabsTrigger>
            <TabsTrigger value="doubleEdged">
              <Zap className="w-4 h-4 mr-2" />
              双刃剑 ({reportData.myLikeAndTalent.doubleEdgedElements.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="like" className="space-y-2 mt-4">
            {likeElements.map((element) => {
              const isExpanded = expandedElements.has(element.id)
              const isObvious = element.attribute.includes("明显")
              const toBeDiscovered = element.attribute.includes("待发现")

              return (
                <Card key={element.id} className="overflow-hidden">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto hover:bg-muted/50"
                    onClick={() => toggleElement(element.id)}
                  >
                    <div className="flex items-center gap-2">
                      {isObvious && <Eye className="w-3 h-3 text-green-600" />}
                      {toBeDiscovered && <EyeOff className="w-3 h-3 text-amber-600" />}
                      <span className="text-sm font-medium">{element.name}</span>
                      <Badge
                        variant={isObvious ? "default" : "outline"}
                        className={`text-xs ${isObvious ? "bg-green-600" : toBeDiscovered ? "border-amber-600 text-amber-600" : ""}`}
                      >
                        {element.attribute}
                      </Badge>
                    </div>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </Button>
                  {isExpanded && (
                    <div className="px-2 pb-2 space-y-2 text-sm border-t">
                      <div className="pt-2">
                        <p className="font-medium text-green-600 mb-1 text-xs">拥有状态：</p>
                        <p className="text-muted-foreground leading-relaxed text-xs">{element.ownedNaturalState}</p>
                      </div>
                      {element.scales.length > 0 && (
                        <div>
                          <p className="font-medium mb-1 text-xs">问卷回答：</p>
                          <div className="space-y-1">
                            {element.scales.map((scale) => (
                              <div key={scale.id} className="bg-muted/50 p-2 rounded">
                                <p className="text-xs text-muted-foreground mb-0.5">{scale.content}</p>
                                <p className="text-xs font-medium">{scale.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="talent" className="space-y-2 mt-4">
            {talentElements.map((element) => {
              const isExpanded = expandedElements.has(element.id)
              const isObvious = element.attribute.includes("明显")
              const toBeDiscovered = element.attribute.includes("待发现")

              return (
                <Card key={element.id} className="overflow-hidden">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto hover:bg-muted/50"
                    onClick={() => toggleElement(element.id)}
                  >
                    <div className="flex items-center gap-2">
                      {isObvious && <Eye className="w-3 h-3 text-green-600" />}
                      {toBeDiscovered && <EyeOff className="w-3 h-3 text-amber-600" />}
                      <span className="text-sm font-medium">{element.name}</span>
                      <Badge
                        variant={isObvious ? "default" : "outline"}
                        className={`text-xs ${isObvious ? "bg-green-600" : toBeDiscovered ? "border-amber-600 text-amber-600" : ""}`}
                      >
                        {element.attribute}
                      </Badge>
                    </div>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </Button>
                  {isExpanded && (
                    <div className="px-2 pb-2 space-y-2 text-sm border-t">
                      <div className="pt-2">
                        <p className="font-medium text-blue-600 mb-1 text-xs">拥有状态：</p>
                        <p className="text-muted-foreground leading-relaxed text-xs">{element.ownedNaturalState}</p>
                      </div>
                      {element.scales.length > 0 && (
                        <div>
                          <p className="font-medium mb-1 text-xs">问卷回答：</p>
                          <div className="space-y-1">
                            {element.scales.map((scale) => (
                              <div key={scale.id} className="bg-muted/50 p-2 rounded">
                                <p className="text-xs text-muted-foreground mb-0.5">{scale.content}</p>
                                <p className="text-xs font-medium">{scale.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="doubleEdged" className="space-y-4 mt-4">
            {reportData.myLikeAndTalent.doubleEdgedElements.map((element, index) => {
              const likeElement = reportData.myLikeAndTalent.elements.find((e) => e.id === element.likeElementId)
              const talentElement = reportData.myLikeAndTalent.elements.find((e) => e.id === element.talentElementId)

              return (
                <Card key={index} className="p-4 border-orange-200">
                  <h3 className="font-semibold mb-3 text-orange-600">{element.name}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-2 text-xs">
                      {likeElement && (
                        <Badge variant="secondary">
                          <Heart className="w-3 h-3 mr-1" />
                          {likeElement.name}
                        </Badge>
                      )}
                      {talentElement && (
                        <Badge variant="secondary">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {talentElement.name}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-green-600 mb-1 text-xs">正面展现：</p>
                      <p className="text-muted-foreground leading-relaxed text-xs">{element.demonstrate}</p>
                    </div>
                    <div>
                      <p className="font-medium text-red-600 mb-1 text-xs">负面影响：</p>
                      <p className="text-muted-foreground leading-relaxed text-xs">{element.affect}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
