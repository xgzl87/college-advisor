"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Sparkles, Compass, Award } from "lucide-react"

// 轮播数据配置
const carouselSlides = [
  {
    id: "discover",
    theme: "",
    icon: Sparkles,
    title: "你生而不同",
    content: '通过 56 个维度，挖掘你被忽略的喜欢与天赋，找到你实现高考志愿"低分高就"的隐藏密码',
  },
  {
    id: "calibrate",
    theme: "",
    icon: Compass,
    title: "校准人生指南针",
    content: "用你的喜欢与天赋避开无效竞争，精准锁定大学专业和未来赛道，实现志愿填报价值最大化",
  },
  {
    id: "fulfill",
    theme: "",
    icon: Award,
    title: "兑现人生价值",
    content: "将喜欢天赋与热爱转化为大学阶段的学习动能、清晰的专业前景，为你的未来职业发展奠定基石",
  },
]

/**
 * 90%契合度专业推荐轮播组件
 * 展示三个核心价值点：发现、校准、兑现
 */
export function MajorMatchCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  // 监听轮播索引变化
  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // 自动轮播功能
  useEffect(() => {
    if (!api) return

    const timer = setInterval(() => {
      const nextIndex = (current + 1) % carouselSlides.length
      api.scrollTo(nextIndex)
    }, 10000) // 每10秒自动切换

    return () => clearInterval(timer)
  }, [api, current])

  return (
    <div className="py-0 text-center">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {carouselSlides.map((slide, index) => {
            const Icon = slide.icon
            return (
              <CarouselItem key={slide.id}>
                <Card className="p-6 transition-all duration-300 hover:scale-[1.02] bg-transparent border-2 border-transparent rounded-2xl mx-2 cursor-pointer">
                  <div className="space-y-4">
                    {/* 主题标签和大标题 - 同一行，主题更显眼 */}
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      {/* 主题标签 - 显眼字体样式 */}
                      <span className="inline-flex items-center gap-2 text-2xl md:text-3xl font-extrabold text-white">
                        <Icon className="w-6 h-6 text-white" />
                        {slide.theme}
                      </span>
                      {/* 大标题 */}
                      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        {slide.title}
                      </h3>
                    </div>

                    {/* 内容描述 */}
                    <p className="text-sm md:text-base text-white/90 leading-relaxed px-2">
                      {slide.content}
                    </p>
                  </div>
                </Card>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      {/* 轮播指示器 */}
      <div className="flex items-center justify-center gap-2 pt-4">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              index === current
                ? "bg-white w-10"
                : "bg-white/50 w-3 hover:bg-white/70",
            )}
            aria-label={`跳转到第 ${index + 1} 页`}
          />
        ))}
      </div>
    </div>
  )
}

