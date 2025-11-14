"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MajorHierarchy } from "@/components/major-hierarchy"
import { TopNav } from "@/components/top-nav"
import type { Major } from "@/lib/majors-data"

interface MajorDetailClientProps {
  currentMajor: Major
  groupedMajors: Record<string, Major[]>
  eduLevelLabels: Record<string, string>
}

export function MajorDetailClient({ currentMajor, groupedMajors, eduLevelLabels }: MajorDetailClientProps) {
  const eduLevels = Object.keys(groupedMajors)
  const [activeTab, setActiveTab] = useState(eduLevels[0] || "")

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <Link href="/majors" className="text-foreground hover:text-primary">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-semibold">专业详情</h1>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Sidebar - Major Info */}
        <aside className="lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-card">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentMajor.name}</h2>
              <p className="text-sm text-muted-foreground">专业代码: {currentMajor.code}</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">教育层次</p>
                  <p className="font-medium">{eduLevelLabels[currentMajor.edu_level] || currentMajor.edu_level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">层级</p>
                  <p className="font-medium">Level {currentMajor.level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">父级ID</p>
                  <p className="font-medium">{currentMajor.parent_id || "无"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">专业介绍</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  该专业的详细介绍信息将在此处显示，包括培养目标、主要课程、就业方向等内��。
                </p>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content - Hierarchical Major List */}
        <main className="flex-1 p-6">
          <h2 className="text-xl font-bold mb-4">专业分类浏览</h2>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {eduLevels.map((level) => (
                <TabsTrigger key={level} value={level}>
                  {eduLevelLabels[level] || level}
                </TabsTrigger>
              ))}
            </TabsList>

            {eduLevels.map((level) => (
              <TabsContent key={level} value={level}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{eduLevelLabels[level] || level} 专业列表</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MajorHierarchy majors={groupedMajors[level]} />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </div>
  )
}
