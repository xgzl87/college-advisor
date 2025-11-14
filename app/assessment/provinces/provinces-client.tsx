"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, CheckCircle2, X } from "lucide-react"

interface Province {
  " name": string
  type: string
  overall_impression: string
  living_cost: string
  suitable_person: string
  key_industries: string
  typical_employers: string
}

interface ProvinceData {
  province: Province[]
}

export default function ProvincesClient() {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProvinces, setSelectedProvinces] = useState<Set<string>>(new Set())
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("全部")

  useEffect(() => {
    fetch("/data/province.json")
      .then((res) => res.json())
      .then((json: ProvinceData) => {
        setProvinces(json.province)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error loading province data:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem("selectedProvinces")
    if (saved) {
      try {
        setSelectedProvinces(new Set(JSON.parse(saved)))
      } catch (error) {
        console.error("Error loading selected provinces:", error)
      }
    }
  }, [])

  // 获取所有唯一的type
  const provinceTypes = useMemo(() => {
    const types = new Set<string>()
    provinces.forEach((p) => types.add(p.type))
    return Array.from(types).sort()
  }, [provinces])

  const toggleProvince = (provinceName: string) => {
    setSelectedProvinces((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(provinceName)) {
        newSet.delete(provinceName)
      } else {
        newSet.add(provinceName)
      }
      localStorage.setItem("selectedProvinces", JSON.stringify(Array.from(newSet)))
      return newSet
    })
  }

  const removeProvince = (provinceName: string) => {
    setSelectedProvinces((prev) => {
      const newSet = new Set(prev)
      newSet.delete(provinceName)
      localStorage.setItem("selectedProvinces", JSON.stringify(Array.from(newSet)))
      return newSet
    })
  }

  const openDetail = (province: Province) => {
    setSelectedProvince(province)
    setShowDetail(true)
  }

  // 根据type筛选省份
  const filteredProvinces = useMemo(() => {
    if (selectedType === "全部") {
      return provinces
    }
    return provinces.filter((p) => p.type === selectedType)
  }, [provinces, selectedType])

  // 获取已选省份的详细信息
  const selectedProvinceDetails = useMemo(() => {
    return provinces.filter((p) => selectedProvinces.has(p[" name"]))
  }, [provinces, selectedProvinces])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Type Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button
          onClick={() => setSelectedType("全部")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            selectedType === "全部"
              ? "bg-[#1A4099] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          全部
        </button>
        {provinceTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedType === type
                ? "bg-[#1A4099] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Selected Provinces */}
      {selectedProvinceDetails.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold text-[#1A4099]">
            已选择 ({selectedProvinceDetails.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedProvinceDetails.map((province) => {
              const provinceName = province[" name"]
              return (
                <div
                  key={provinceName}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1A4099]/10 border border-[#1A4099] rounded-full"
                >
                  <span className="text-sm font-medium text-[#1A4099]">{provinceName}</span>
                  <button
                    onClick={() => removeProvince(provinceName)}
                    className="text-[#1A4099] hover:text-[#1A4099]/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Province list */}
      <div className="grid grid-cols-1 gap-3">
        {filteredProvinces.map((province, index) => {
          const provinceName = province[" name"]
          const isSelected = selectedProvinces.has(provinceName)

          return (
            <Card
              key={index}
              className={`p-3 hover:shadow-md transition-shadow border cursor-pointer ${
                isSelected ? "border-[#1A4099] bg-[#1A4099]/10" : ""
              }`}
              onClick={() => openDetail(province)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <MapPin className={`w-4 h-4 ${isSelected ? "text-[#1A4099]" : "text-muted-foreground"}`} />
                    <h3 className={`font-semibold ${isSelected ? "text-[#1A4099]" : ""}`}>
                      {provinceName}
                    </h3>
                    <span className="text-xs text-muted-foreground">{province.type}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#1A4099]" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {province.overall_impression}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDetail(province)}
                    className="font-bold text-[#FF7F50] hover:bg-[#FF7F50]/10 hover:text-[#FF7F50]"
                  >
                    详情
                  </Button>
                  <Button
                    variant={isSelected ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleProvince(provinceName)}
                    className={`font-bold ${
                      isSelected 
                        ? "border-[#1A4099] text-[#1A4099] bg-white hover:bg-[#1A4099]/10" 
                        : "bg-[#1A4099] text-white hover:bg-[#1A4099]/90"
                    }`}
                  >
                    {isSelected ? "已选择" : "选择"}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedProvince?.[" name"]}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{selectedProvince?.type}</p>
          </DialogHeader>

          {selectedProvince && (
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="font-semibold mb-2 text-[#1A4099]">整体印象</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {selectedProvince.overall_impression}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-[#1A4099]">生活成本</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {selectedProvince.living_cost}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-[#1A4099]">适合人群</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {selectedProvince.suitable_person}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-[#1A4099]">重点产业</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {selectedProvince.key_industries}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-[#1A4099]">典型企业</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {selectedProvince.typical_employers}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    toggleProvince(selectedProvince[" name"])
                    setShowDetail(false)
                  }}
                  className="flex-1"
                  variant={selectedProvinces.has(selectedProvince[" name"]) ? "outline" : "default"}
                >
                  {selectedProvinces.has(selectedProvince[" name"]) ? "取消选择" : "选择此省份"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

