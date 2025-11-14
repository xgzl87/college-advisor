"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClipboardList, Target, User, Home } from "lucide-react"

const navItems = [
  { href: "/", label: "主页", icon: Home },
  { href: "/assessment", label: "探索成果", icon: ClipboardList },
  { href: "/majors/intended?tab=意向志愿", label: "志愿方案", icon: Target },
  { href: "/profile", label: "个人中心", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            // 提取基础路径（去除查询参数）
            const baseHref = item.href.split("?")[0]
            const isActive = baseHref === "/" ? pathname === "/" : pathname.startsWith(baseHref)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
