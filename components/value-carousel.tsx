"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Lightbulb, Heart, TrendingUp, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

const carouselSlides = [
  {
    id: "challenge",
    theme: "挑战",
    color: "purple",
    bgClass: "bg-white",
    borderClass: "border-purple-500",
    iconBgClass: "bg-purple-500/20",
    iconClass: "text-purple-600",
    ringClass: "ring-purple-500/30",
    icon: Lightbulb,
    slogan: "天赋测评，发现优势",
    link: "/assessment/challenges",
  },
  {
    id: "major",
    theme: "专业",
    color: "orange",
    bgClass: "bg-white",
    borderClass: "border-orange-500",
    iconBgClass: "bg-orange-500/20",
    iconClass: "text-[#FF7F50]",
    ringClass: "ring-orange-500/30",
    icon: Heart,
    slogan: "90%契合度专业推荐",
    link: "/majors",
  },
  {
    id: "career",
    theme: "职业",
    color: "gold",
    bgClass: "bg-white",
    borderClass: "border-yellow-500",
    iconBgClass: "bg-yellow-500/20",
    iconClass: "text-yellow-600",
    ringClass: "ring-yellow-500/30",
    icon: TrendingUp,
    slogan: "未来10年，年薪30w+",
    link: "/careers",
  },
  {
    id: "score",
    theme: "分数",
    color: "blue",
    bgClass: "bg-white",
    borderClass: "border-blue-500",
    iconBgClass: "bg-blue-500/20",
    iconClass: "text-[#1A4099]",
    ringClass: "ring-blue-500/30",
    icon: GraduationCap,
    slogan: "分数波动，风险预警",
    link: "/assessment",
  },
]

export function ValueCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselSlides.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const currentSlide = carouselSlides[currentIndex]
  const Icon = currentSlide.icon

  return (
    <div className="space-y-1 -mt-2">
      <div className="w-full flex justify-center">
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-700 ease-in-out transform hover:scale-[1.01] shadow-lg hover:shadow-xl w-[95%] mx-auto rounded-2xl",
            currentSlide.bgClass,
          )}
        >
          <div className="py-3 text-center space-y-1">
            <div
              className={cn(
                "w-10 h-10 rounded-full mx-auto flex items-center justify-center transition-all duration-500 transform hover:scale-105",
                currentSlide.iconBgClass,
                "ring-2 ring-offset-2",
                currentSlide.ringClass,
              )}
            >
              <Icon className={cn("w-5 h-5", currentSlide.iconClass)} />
            </div>

            <h4 className="text-base font-bold text-gray-900 leading-tight px-4 min-h-[2.5rem] flex items-center justify-center">
              {currentSlide.slogan}
            </h4>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-2">
        {carouselSlides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              index === currentIndex ? "bg-[#1A4099] w-10" : "bg-gray-300 w-3 hover:bg-gray-400",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
