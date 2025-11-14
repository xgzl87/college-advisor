"use client"

import { BottomNav } from "@/components/bottom-nav"
import { TopNav } from "@/components/top-nav"
import ProvincesClient from "./provinces-client"

export default function ProvincesPage() {

  return (
    <div className="min-h-screen bg-background pb-16">
      <TopNav />
      <div className="bg-[#1A4099] text-white px-4 pt-6 pb-8 relative">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-xl font-bold">
              省份探索 <span className="text-base font-normal">设置意向省份</span>
            </h1>
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
        <ProvincesClient />
      </div>
      <BottomNav />
    </div>
  )
}

