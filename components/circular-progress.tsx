"use client"

import { cn } from "@/lib/utils"

interface CircularProgressProps {
  /**
   * 进度百分比 (0-100)
   */
  progress: number
  /**
   * 尺寸大小（像素）
   */
  size?: number
  /**
   * 线条宽度（像素）
   */
  strokeWidth?: number
  /**
   * 自定义类名
   */
  className?: string
  /**
   * 是否显示百分比文字
   */
  showText?: boolean
  /**
   * 文字大小
   */
  textSize?: string
}

/**
 * 环形进度条组件
 */
export function CircularProgress({
  progress,
  size = 80,
  strokeWidth = 8,
  className,
  showText = true,
  textSize = "text-lg",
}: CircularProgressProps) {
  // 确保进度在 0-100 之间
  const normalizedProgress = Math.min(Math.max(progress, 0), 100)
  
  // 计算半径和周长
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (normalizedProgress / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* 背景圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* 进度圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-[#FF7F50] transition-all duration-500 ease-in-out"
        />
      </svg>
      {/* 百分比文字 */}
      {showText && (
        <div className={cn("absolute inset-0 flex items-center justify-center", textSize)}>
          <span className="font-semibold text-[#FF7F50]">
            {Math.round(normalizedProgress)}%
          </span>
        </div>
      )}
    </div>
  )
}

