"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Award, Star, AlertCircle, Target } from "lucide-react"

interface Element {
  id: number
  name: string
  type: string
  status: string
  dimension: string
}

interface MajorElementAnalysis {
  id: number
  type: "shanxue" | "lexue" | "yanxue" | "tiaozhan"
  summary: string
  matchReason: string
  theoryBasis: string
  rawInput: string | null
  potentialConversionReason: string | null
  potentialConversionValue: string | null
  element: Element
}

interface TalentMatchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  majorName: string
  majorCode: string
  matchScore: number
  ranking?: number
  analyses: MajorElementAnalysis[]
  onConfirmIntention: () => void
  onViewDetails: () => void
}

export function TalentMatchModal({
  open,
  onOpenChange,
  majorName,
  majorCode,
  matchScore,
  ranking,
  analyses,
  onConfirmIntention,
  onViewDetails,
}: TalentMatchModalProps) {
  // Group analyses by type
  const shanxueItems = analyses.filter((a) => a.type === "shanxue")
  const lexueItems = analyses.filter((a) => a.type === "lexue")
  const yanxueItems = analyses.filter((a) => a.type === "yanxue")
  const tiaozhanItems = analyses.filter((a) => a.type === "tiaozhan")

  const advantageCount = shanxueItems.length + lexueItems.length
  const riskCount = yanxueItems.length + tiaozhanItems.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{majorName}</DialogTitle>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="text-4xl font-extrabold text-[#FF7F50]">{matchScore}分</div>
            {ranking && <div className="text-2xl font-bold text-[#1A4099]">第 {ranking} 名</div>}
          </div>
        </DialogHeader>

        {/* Tabs for Advantages and Risks */}
        <Tabs defaultValue="advantages" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="advantages">✨ 优势助力 ({advantageCount})</TabsTrigger>
            <TabsTrigger value="risks">⚠️ 潜在风险 ({riskCount})</TabsTrigger>
          </TabsList>

          {/* Tab 1: Advantages */}
          <TabsContent value="advantages" className="mt-4 space-y-2">
            <Accordion type="single" collapsible className="w-full">
              {/* Shanxue items */}
              {shanxueItems.map((item) => (
                <AccordionItem key={item.id} value={`shanxue-${item.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-start gap-3 text-left w-full">
                      <Award className="w-5 h-5 text-[#1A4099] flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-muted-foreground">{item.summary}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 pr-4 pb-2 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-2">
                        <span className="font-bold">天赋</span>：{item.element.name}
                      </p>
                      <p>{item.matchReason}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}

              {/* Lexue items */}
              {lexueItems.map((item) => (
                <AccordionItem key={item.id} value={`lexue-${item.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-start gap-3 text-left w-full">
                      <Star className="w-5 h-5 text-[#FF7F50] flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-muted-foreground">{item.summary}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 pr-4 pb-2 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-2">
                        <span className="font-bold">喜欢</span>：{item.element.name}
                      </p>
                      <p>{item.matchReason}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {/* Tab 2: Risks */}
          <TabsContent value="risks" className="mt-4 space-y-2">
            <Accordion type="single" collapsible className="w-full">
              {/* Yanxue items */}
              {yanxueItems.map((item) => (
                <AccordionItem key={item.id} value={`yanxue-${item.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-start gap-3 text-left w-full">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{item.element.name}</div>
                        <div className="text-xs text-red-500 mt-1">{item.summary}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 pr-4 pb-2 text-sm">
                      <p className="font-medium text-foreground mb-2">冲突原因：</p>
                      <p className="text-muted-foreground mb-3">{item.matchReason}</p>
                      {item.potentialConversionReason && (
                        <div className="border-2 border-[#FF7F50] rounded-lg p-3 bg-orange-50">
                          <p className="font-medium text-[#FF7F50] mb-2">💡 转化建议：</p>
                          <p className="text-sm text-foreground">{item.potentialConversionReason}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}

              {/* Tiaozhan items */}
              {tiaozhanItems.map((item) => (
                <AccordionItem key={item.id} value={`tiaozhan-${item.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-start gap-3 text-left w-full">
                      <Target className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{item.element.name}</div>
                        <div className="text-xs text-orange-500 mt-1">{item.summary}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 pr-4 pb-2 text-sm">
                      <p className="font-medium text-foreground mb-2">挑战原因：</p>
                      <p className="text-muted-foreground mb-3">{item.matchReason}</p>
                      {item.potentialConversionReason && (
                        <div className="border-2 border-[#FF7F50] rounded-lg p-3 bg-orange-50">
                          <p className="font-medium text-[#FF7F50] mb-2">💡 转化建议：</p>
                          <p className="text-sm text-foreground">{item.potentialConversionReason}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <DialogFooter className="flex flex-row gap-3 mt-6">
          <Button onClick={onConfirmIntention} className="bg-[#FF7F50] hover:bg-[#FF6A3D] text-white flex-1">
            加入心动专业
          </Button>
          <Button
            onClick={onViewDetails}
            variant="outline"
            className="border-[#1A4099] text-[#1A4099] hover:bg-[#1A4099] hover:text-white flex-1 bg-transparent"
          >
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
