"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()

  return (
    <div className="mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="text-white hover:bg-white/20 h-8"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        返回
      </Button>
    </div>
  )
}







