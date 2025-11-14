import { PageContainer } from "@/components/page-container"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Briefcase, Sparkles, List, Heart } from "lucide-react"
import Link from "next/link"

export default function DiscoveryPage() {
  return (
    <PageContainer>
      <div className="bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground px-6 pt-8 pb-12">
        <h1 className="text-2xl font-bold mb-2">专业与职业探索</h1>
        <p className="text-primary-foreground/90 text-sm">发现最适合你的专业和职业方向</p>
      </div>

      <div className="px-4 -mt-6 space-y-6 pb-6">
        <Card className="p-6 shadow-xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-2 border-primary/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold">为你推荐</h2>
              <p className="text-sm text-muted-foreground">基于测评结果的智能匹配</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/majors/recommended" className="block">
              <Card className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary hover:scale-105">
                <div className="flex flex-col items-center text-center gap-2">
                  <Badge variant="default" className="bg-primary text-primary-foreground font-bold">
                    500+
                  </Badge>
                  <BookOpen className="w-8 h-8 text-primary" />
                  <span className="text-sm font-semibold">推荐专业</span>
                </div>
              </Card>
            </Link>
            <Link href="/careers/recommended" className="block">
              <Card className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary hover:scale-105">
                <div className="flex flex-col items-center text-center gap-2">
                  <Badge variant="default" className="bg-primary text-primary-foreground font-bold">
                    300+
                  </Badge>
                  <Briefcase className="w-8 h-8 text-primary" />
                  <span className="text-sm font-semibold">推荐职业</span>
                </div>
              </Card>
            </Link>
          </div>
        </Card>

        {/* 专业探索 */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-accent/80 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="text-lg font-semibold">专业探索</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
                  <span className="text-xs text-muted-foreground">浏览全部</span>
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
                  <span className="text-xs text-muted-foreground">我的收藏</span>
                </div>
              </Card>
            </Link>
          </div>
        </Card>

        {/* 职业探索 */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold">职业探索</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/careers" className="block">
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/80 flex items-center justify-center">
                    <List className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">所有职业</span>
                  <span className="text-xs text-muted-foreground">职业库</span>
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
                  <span className="text-xs text-muted-foreground">我的收藏</span>
                </div>
              </Card>
            </Link>
          </div>
        </Card>

        <Card className="p-4 bg-muted/50 border-2 border-dashed">
          <p className="text-sm text-muted-foreground leading-relaxed">
            💡 完成测评后，系统会为您推荐最匹配的专业和职业。
            <Link href="/assessment" className="text-primary font-medium ml-1 underline">
              前往测评 →
            </Link>
          </p>
        </Card>
      </div>
    </PageContainer>
  )
}
