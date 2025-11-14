import { PageContainer } from "@/components/page-container"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, BarChart3, BookOpen, Briefcase, Sparkles, List, Target, Heart, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <PageContainer>
      {/* 头部 */}
      <div className="bg-primary text-primary-foreground px-6 pt-8 pb-12">
        <h1 className="text-2xl font-bold mb-2">逆袭志愿</h1>
        <p className="text-primary-foreground/90 text-sm">科学规划，智慧选择，成就未来</p>
      </div>

      <div className="px-4 -mt-6 space-y-6 pb-6">
        {/* 1. 开始评估 */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold">专业评估</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/assessment/single-major" className="block">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/80 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">单个专业</span>
                </div>
              </Card>
            </Link>
            <Link href="/assessment/all-majors" className="block">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/80 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">所有专业</span>
                </div>
              </Card>
            </Link>
            <Link href="/assessment/report" className="block">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/80 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">评估报告</span>
                </div>
              </Card>
            </Link>
          </div>
        </Card>

        {/* 2. 专业逆袭 */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-accent/80 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="text-lg font-semibold">专业逆袭</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/majors/recommended" className="block">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-accent/50 relative">
                <Badge
                  variant="default"
                  className="absolute top-2 left-2 bg-primary text-primary-foreground font-semibold"
                >
                  500
                </Badge>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-accent/80 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <span className="text-sm font-medium">智能推荐</span>
                </div>
              </Card>
            </Link>
            <Link href="/majors" className="block">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-accent/50 relative">
                <Badge
                  variant="default"
                  className="absolute top-2 left-2 bg-primary text-primary-foreground font-semibold"
                >
                  1000
                </Badge>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-accent/80 flex items-center justify-center">
                    <List className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <span className="text-sm font-medium">所有专业</span>
                </div>
              </Card>
            </Link>
            <Link href="/majors/intended" className="block">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-accent/50 relative">
                <Badge
                  variant="default"
                  className="absolute top-2 left-2 bg-primary text-primary-foreground font-semibold"
                >
                  50
                </Badge>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-accent/80 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <span className="text-sm font-medium">意向专业</span>
                </div>
              </Card>
            </Link>
          </div>
        </Card>

        {/* 3. 职业逆袭 */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold">职业逆袭</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/careers/recommended" className="block">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/80 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">智能推荐</span>
                </div>
              </Card>
            </Link>
            <Link href="/careers" className="block">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/80 flex items-center justify-center">
                    <List className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">所有职业</span>
                </div>
              </Card>
            </Link>
            <Link href="/careers/intended" className="block">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/80 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">意向职业</span>
                </div>
              </Card>
            </Link>
          </div>
        </Card>

        {/* 4. 志愿管理 - Moved to bottom */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center">
              <Heart className="w-5 h-5 text-secondary-foreground" />
            </div>
            <h2 className="text-lg font-semibold">志愿管理</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/applications/backup" className="block">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-secondary/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-secondary/80 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <span className="text-sm font-medium">备选志愿</span>
                </div>
              </Card>
            </Link>
            <Link href="/applications/selected" className="block">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-secondary/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-secondary/80 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <span className="text-sm font-medium">入选志愿</span>
                </div>
              </Card>
            </Link>
          </div>
        </Card>

        {/* 提示信息 */}
        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground leading-relaxed">
            💡 建议先完成专业评估问卷，系统将根据您的核心优势、内在动力，为您推荐最适合的专业和职业方向。
          </p>
        </Card>
      </div>
    </PageContainer>
  )
}

