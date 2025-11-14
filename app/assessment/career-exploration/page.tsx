import { Suspense } from "react"
import CareerExplorationClient from "./career-exploration-client"

export default function CareerExplorationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64">加载中...</div>}>
      <CareerExplorationClient />
    </Suspense>
  )
}

