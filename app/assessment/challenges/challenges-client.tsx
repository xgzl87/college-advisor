"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Lightbulb, ChevronDown, ChevronUp } from "lucide-react"

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
}

export function ChallengesClient() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [elements, setElements] = useState<Element[]>([])
  const [expandedStrategy, setExpandedStrategy] = useState<number | null>(null)
  const [modalTab, setModalTab] = useState<"人际协作" | "能力构建">("人际协作")
  const [modalExpandedStrategy, setModalExpandedStrategy] = useState<number | null>(null)
  const [currentCombinationType, setCurrentCombinationType] = useState<number>(0)
  const [showAllChallenges, setShowAllChallenges] = useState(false)

  useEffect(() => {
    fetch("/data/report.json")
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data.challenge || [])
        setElements(data.element || [])
      })
      .catch((error) => {
        console.error("Error loading challenges:", error)
      })
  }, [])

  const getElementName = (id: number): string => {
    const element = elements.find((e) => e.id === id)
    return element ? element.name : "未知"
  }

  const primaryChallenges = challenges.filter(
    (c) => c.like_obvious === true && c.talent_obvious === true && c.type === "自我认知与内驱力管理",
  )

  const remainingChallenges = challenges.filter(
    (c) => !(c.like_obvious === true && c.talent_obvious === true && c.type === "自我认知与内驱力管理"),
  )

  const getFilteredMoreChallenges = (challenge: Challenge) => {
    return challenges.filter(
      (c) =>
        (c.type === "人际协作与社会融合" || c.type === "认知策略与能力构建") &&
        c.like_obvious === challenge.like_obvious &&
        c.talent_obvious === challenge.talent_obvious,
    )
  }

  const handleMoreChallengesClick = () => {
    setModalTab("人际协作")
    setModalExpandedStrategy(null)
  }

  const renderChallengeCard = (challenge: Challenge, showMoreButton = true) => {
    const isStrategyExpanded = expandedStrategy === challenge.id
    const filteredMoreChallenges = getFilteredMoreChallenges(challenge)
    const interpersonalChallenges = filteredMoreChallenges.filter((c) => c.type === "人际协作与社会融合")
    const capabilityBuildingChallenges = filteredMoreChallenges.filter((c) => c.type === "认知策略与能力构建")

    return (
      <Card key={challenge.id} className="p-4 mb-3">
        <div className="flex items-start gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">{challenge.name}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{challenge.content}</p>
          </div>
        </div>

        <div className="mt-1 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedStrategy(isStrategyExpanded ? null : challenge.id)}
            className="h-7 px-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Lightbulb className="w-3 h-3 mr-1" />
            应对策略
            {isStrategyExpanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
          </Button>

          {showMoreButton && filteredMoreChallenges.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-1.5 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  onClick={handleMoreChallengesClick}
                >
                  更多挑战（人际协作与能力构建）
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>更多挑战</DialogTitle>
                </DialogHeader>
                <Tabs
                  value={modalTab}
                  onValueChange={(v) => setModalTab(v as "人际协作" | "能力构建")}
                  className="mt-4"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="人际协作">人际协作</TabsTrigger>
                    <TabsTrigger value="能力构建">能力构建</TabsTrigger>
                  </TabsList>
                  <TabsContent value="人际协作" className="space-y-3 mt-4">
                    {interpersonalChallenges.length > 0 ? (
                      interpersonalChallenges.map((moreChallenge) => {
                        const isModalStrategyExpanded = modalExpandedStrategy === moreChallenge.id
                        return (
                          <Card key={moreChallenge.id} className="p-4">
                            <div className="flex items-start gap-3 mb-1">
                              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-sm font-semibold mb-1">{moreChallenge.name}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{moreChallenge.content}</p>
                              </div>
                            </div>
                            <div className="mt-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setModalExpandedStrategy(isModalStrategyExpanded ? null : moreChallenge.id)
                                }
                                className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Lightbulb className="w-3 h-3 mr-1" />
                                应对策略
                                {isModalStrategyExpanded ? (
                                  <ChevronUp className="w-3 h-3 ml-1" />
                                ) : (
                                  <ChevronDown className="w-3 h-3 ml-1" />
                                )}
                              </Button>
                            </div>
                            {isModalStrategyExpanded && (
                              <div className="mt-1 p-2 bg-blue-50 rounded-lg">
                                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                                  {moreChallenge.strategy}
                                </p>
                              </div>
                            )}
                            <div className="mt-1 pt-1 border-t">
                              <div className="flex flex-wrap gap-2">
                                <div className="flex items-center gap-1.5 text-xs">
                                  <span className="font-medium text-muted-foreground">喜欢:</span>
                                  <span className="font-semibold">{getElementName(moreChallenge.like_id)}</span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-xs ${
                                      moreChallenge.like_obvious
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {moreChallenge.like_obvious ? "明显" : "不明显"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs">
                                  <span className="font-medium text-muted-foreground">天赋:</span>
                                  <span className="font-semibold">{getElementName(moreChallenge.talent_id)}</span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-xs ${
                                      moreChallenge.talent_obvious
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {moreChallenge.talent_obvious ? "明显" : "不明显"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        )
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">暂无人际协作相关挑战</p>
                    )}
                  </TabsContent>
                  <TabsContent value="能力构建" className="space-y-3 mt-4">
                    {capabilityBuildingChallenges.length > 0 ? (
                      capabilityBuildingChallenges.map((moreChallenge) => {
                        const isModalStrategyExpanded = modalExpandedStrategy === moreChallenge.id
                        return (
                          <Card key={moreChallenge.id} className="p-4">
                            <div className="flex items-start gap-3 mb-1">
                              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-sm font-semibold mb-1">{moreChallenge.name}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{moreChallenge.content}</p>
                              </div>
                            </div>
                            <div className="mt-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setModalExpandedStrategy(isModalStrategyExpanded ? null : moreChallenge.id)
                                }
                                className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Lightbulb className="w-3 h-3 mr-1" />
                                应对策略
                                {isModalStrategyExpanded ? (
                                  <ChevronUp className="w-3 h-3 ml-1" />
                                ) : (
                                  <ChevronDown className="w-3 h-3 ml-1" />
                                )}
                              </Button>
                            </div>
                            {isModalStrategyExpanded && (
                              <div className="mt-1 p-2 bg-blue-50 rounded-lg">
                                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                                  {moreChallenge.strategy}
                                </p>
                              </div>
                            )}
                            <div className="mt-1 pt-1 border-t">
                              <div className="flex flex-wrap gap-2">
                                <div className="flex items-center gap-1.5 text-xs">
                                  <span className="font-medium text-muted-foreground">喜欢:</span>
                                  <span className="font-semibold">{getElementName(moreChallenge.like_id)}</span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-xs ${
                                      moreChallenge.like_obvious
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {moreChallenge.like_obvious ? "明显" : "不明显"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs">
                                  <span className="font-medium text-muted-foreground">天赋:</span>
                                  <span className="font-semibold">{getElementName(moreChallenge.talent_id)}</span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-xs ${
                                      moreChallenge.talent_obvious
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {moreChallenge.talent_obvious ? "明显" : "不明显"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        )
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">暂无能力构建相关挑战</p>
                    )}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isStrategyExpanded && (
          <div className="mt-1 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{challenge.strategy}</p>
          </div>
        )}

        <div className="mt-2 pt-2 border-t">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-medium text-muted-foreground">喜欢:</span>
              <span className="font-semibold">{getElementName(challenge.like_id)}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-xs ${
                  challenge.like_obvious ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}
              >
                {challenge.like_obvious ? "明显" : "不明显"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-medium text-muted-foreground">天赋:</span>
              <span className="font-semibold">{getElementName(challenge.talent_id)}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-xs ${
                  challenge.talent_obvious ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                }`}
              >
                {challenge.talent_obvious ? "明显" : "不明显"}
              </span>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="px-4 space-y-4">
      {primaryChallenges.length > 0 ? (
        <>
          <div>{primaryChallenges.map((c) => renderChallengeCard(c, true))}</div>

          {showAllChallenges && remainingChallenges.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">其他挑战</h3>
              {remainingChallenges.map((c) => renderChallengeCard(c, false))}
            </div>
          )}

          {remainingChallenges.length > 0 && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllChallenges(!showAllChallenges)}
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                {showAllChallenges ? "收起" : "更多挑战"}
                {showAllChallenges ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground">暂无挑战数据</p>
        </Card>
      )}
    </div>
  )
}
