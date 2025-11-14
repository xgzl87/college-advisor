import { PageContainer } from "@/components/page-container"
import { Card } from "@/components/ui/card"
import { Heart, CheckCircle2, Search, Calculator, FileText } from "lucide-react"
import Link from "next/link"

export default function PlanningPage() {
  return (
    <PageContainer>
      {/* 头部 */}
      <div className="bg-gradient-to-r from-secondary to-primary text-primary-foreground px-6 pt-8 pb-12">
        <h1 className="text-2xl font-bold mb-2">志愿规划</h1>
        <p className="text-primary-foreground/90 text-sm">科学填报，智慧选择</p>
      </div>

      <div className="px-4 -mt-6 space-y-6 pb-6">
        {/* 我的志愿 */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center">
              <Heart className="w-5 h-5 text-secondary-foreground" />
            </div>
            <h2 className="text-lg font-semibold">我的志愿</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/applications/selected" className="block">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-secondary/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-secondary/80 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <span className="text-sm font-medium">入选志愿</span>
                  <span className="text-xs text-muted-foreground">已选择的志愿</span>
                </div>
              </Card>
            </Link>
            <Link href="/applications/backup" className="block">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-secondary/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-secondary/80 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <span className="text-sm font-medium">备选志愿</span>
                  <span className="text-xs text-muted-foreground">候选志愿池</span>
                </div>
              </Card>
            </Link>
          </div>
        </Card>

        {/* 志愿工具 */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold">志愿工具</h2>
          </div>
          <div className="space-y-3">
            <Link href="/planning/simulator">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calculator className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">志愿模拟填报</h3>
                    <p className="text-sm text-muted-foreground">模拟填报志愿，评估录取概率</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/planning/search">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">院校专业查询</h3>
                    <p className="text-sm text-muted-foreground">查询院校和专业的详细信息</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/planning/analysis">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">录取分析</h3>
                    <p className="text-sm text-muted-foreground">分析历年录取数据，预测录取概率</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </Card>

        {/* 提示信息 */}
        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground leading-relaxed">
            💡 建议先完成测评和专业探索，再使用志愿规划工具进行科学填报。
          </p>
        </Card>
      </div>
    </PageContainer>
  )
}
