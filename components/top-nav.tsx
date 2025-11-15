"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, User, LogOut, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

/**
 * 顶部导航条组件
 * 包含Logo、返回按钮和账号信息菜单
 */
export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()

  // 判断是否需要显示返回按钮（不在首页时显示）
  const showBackButton = pathname !== "/"

  // 处理返回按钮点击
  const handleBack = () => {
    router.back()
  }

  // 处理退出登录
  const handleLogout = () => {
    // TODO: 实现退出登录逻辑
    console.log("退出登录")
    // 可以清除本地存储、跳转到登录页等
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200/80 shadow-sm">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between h-14 px-4">
          {/* 左侧：返回按钮和Logo */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="flex-shrink-0 h-9 w-9 rounded-full hover:bg-[#1A4099]/10 transition-all duration-200 group"
                aria-label="返回"
              >
                <ArrowLeft className="h-5 w-5 text-[#1A4099] group-hover:scale-110 transition-transform" />
              </Button>
            )}
            <Link
              href="/"
              className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-80 transition-all duration-200 active:scale-95"
            >
              <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="逆袭志愿"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-lg font-bold text-[#1A4099] tracking-tight whitespace-nowrap">
                逆袭志愿
              </span>
            </Link>
          </div>

          {/* 右侧：账号信息 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-[#1A4099]/10 hover:bg-[#1A4099]/20 transition-all duration-200 group"
                  aria-label="账号菜单"
                >
                  <User className="h-5 w-5 text-[#1A4099] scale-110 group-hover:scale-125 transition-transform" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 shadow-lg">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-[#1A4099]">
                      账号信息
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      用户中心
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <User className="h-4 w-4" />
                    <span>个人中心</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <Settings className="h-4 w-4" />
                    <span>设置</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

