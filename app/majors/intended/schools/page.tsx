"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TopNav } from "@/components/top-nav"
import { BottomNav } from "@/components/bottom-nav"
import { ArrowLeft, MapPin, Building2, GraduationCap, ArrowUp, ArrowDown } from "lucide-react"
import IntendedMajorsSchoolsClient from "./schools-client"

function IntendedMajorsSchoolsContent() {
  return <IntendedMajorsSchoolsClient />
}

export default function IntendedMajorsSchoolsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-16">
      <TopNav />
      <Suspense fallback={<div className="flex items-center justify-center h-64">加载中...</div>}>
        <IntendedMajorsSchoolsContent />
      </Suspense>
      <BottomNav />
    </div>
  )
}

