"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import AllMajorsClient from "./all-majors-client"
import { BottomNav } from "@/components/bottom-nav"
import { TopNav } from "@/components/top-nav"

export default function MajorsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("本科")

  return (
    <div className="min-h-screen bg-background pb-16">
      <TopNav />
      <div className="bg-[#1A4099] text-white px-4 pt-6 pb-8 relative">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white hover:bg-white/20 h-8 w-8 p-0 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">专业探索</h1>
          </div>
          <p className="text-white/90 text-xs mb-4">发现适合你的专业方向</p>

          <div className="flex gap-1">
            {["本科", "高职本科", "专科"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? "bg-[#FF7F50] text-white shadow-md"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {tab}
              </button>
            ))}
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
        <AllMajorsClient activeTab={activeTab} />
      </div>
      <BottomNav />
    </div>
  )
}
