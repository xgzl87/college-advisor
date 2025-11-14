import type { ReactNode } from "react"
import { BottomNav } from "./bottom-nav"
import { TopNav } from "./top-nav"

interface PageContainerProps {
  children: ReactNode
}

/**
 * 页面容器组件
 * 包含顶部导航条、内容区域和底部导航条
 */
export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-background pb-16">
      <TopNav />
      <div className="max-w-lg mx-auto">{children}</div>
      <BottomNav />
    </div>
  )
}
