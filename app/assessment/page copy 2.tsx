"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@/components/page-container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Clock,
  ArrowRight,
  Trophy,
  MapPin,
  Building2,
  Target,
  User,
  Heart,
} from "lucide-react";
import Link from "next/link";
import questionnaireData from "@/data/questionnaire.json";

const STORAGE_KEY = "questionnaire_answers";
const DIMENSION_ORDER = ["看", "听", "说", "记", "想", "做", "运动"];

function loadAnswersFromStorage(): Record<number, number> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    return {};
  }
}

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isClient, setIsClient] = useState(false);
  const [intendedMajorsCount, setIntendedMajorsCount] = useState(0);
  const [selectedProvincesCount, setSelectedProvincesCount] = useState(0);
  // 测试用：是否完成报告的单选框，默认值为"未完成"
  const [reportStatus, setReportStatus] = useState("未完成");

  useEffect(() => {
    setIsClient(true);
    const storedAnswers = loadAnswersFromStorage();
    setAnswers(storedAnswers);

    // 读取心动专业数量
    const storedMajors = localStorage.getItem("intendedMajors");
    if (storedMajors) {
      try {
        const majors = JSON.parse(storedMajors);
        setIntendedMajorsCount(Array.isArray(majors) ? majors.length : 0);
      } catch (error) {
        setIntendedMajorsCount(0);
      }
    }

    // 读取意向省份数量
    const storedProvinces = localStorage.getItem("selectedProvinces");
    if (storedProvinces) {
      try {
        const provinces = JSON.parse(storedProvinces);
        setSelectedProvincesCount(
          Array.isArray(provinces) ? provinces.length : 0
        );
      } catch (error) {
        setSelectedProvincesCount(0);
      }
    }
  }, []);

  // 监听 localStorage 变化
  useEffect(() => {
    if (!isClient) return;

    const handleStorageChange = () => {
      // 更新心动专业数量
      const storedMajors = localStorage.getItem("intendedMajors");
      if (storedMajors) {
        try {
          const majors = JSON.parse(storedMajors);
          setIntendedMajorsCount(Array.isArray(majors) ? majors.length : 0);
        } catch (error) {
          setIntendedMajorsCount(0);
        }
      } else {
        setIntendedMajorsCount(0);
      }

      // 更新意向省份数量
      const storedProvinces = localStorage.getItem("selectedProvinces");
      if (storedProvinces) {
        try {
          const provinces = JSON.parse(storedProvinces);
          setSelectedProvincesCount(
            Array.isArray(provinces) ? provinces.length : 0
          );
        } catch (error) {
          setSelectedProvincesCount(0);
        }
      } else {
        setSelectedProvincesCount(0);
      }
    };

    // 监听 storage 事件（跨标签页）
    window.addEventListener("storage", handleStorageChange);

    // 定期检查（同标签页内）
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [isClient]);

  // 计算已解锁特质数（已完成的维度数）
  const completedDimensionsCount = DIMENSION_ORDER.filter((dim) => {
    const dimQuestions = (questionnaireData as any[]).filter(
      (q) => q.dimension === dim
    );
    const dimAnswered = dimQuestions.filter((q) => q.id in answers).length;
    return dimAnswered === dimQuestions.length && dimQuestions.length > 0;
  }).length;

  // 计算已匹配专业数（每20题一个专业）
  const answeredCount = Object.keys(answers).length;
  const matchedMajorsCount = Math.floor(answeredCount / 20);

  // 根据单选框状态决定进度：如果选择"完成探索"则进度>=100，否则为实际进度
  const baseProgress = 60; // 基础进度百分比
  const assessmentProgress = reportStatus === "完成探索" ? 100 : baseProgress;
  const completedCount = 3;
  const totalCount = 4;
  const isCompleted = assessmentProgress >= 100;

  return (
    <PageContainer>
      {/* <div className="bg-[#1A4099] text-white px-4 pt-6 pb-16 relative">
        <h1 className="text-xl font-bold mb-1">我的天赋逆袭中心</h1>
        <p className="text-white/90 text-xs">
          {isCompleted ? "查看您的深度分析报告" : "了解自己，发现潜能，科学规划未来"}
        </p>
      
        <div
          className="absolute bottom-0 left-0 right-0 h-4 bg-background"
          style={{
            clipPath: "ellipse(70% 100% at 50% 100%)",
          }}
        ></div>
      </div> */}

      <section className="relative flex flex-col items-start justify-start px-4 py-4 text-center bg-gradient-to-b from-[#1A4099] via-[#2563eb] to-[#2563eb]/80 min-h-[130px]">
        <div
          className="absolute bottom-0 left-0 right-0 h-13 bg-[#F5F5F5]"
          style={{
            clipPath: "ellipse(100% 100% at 50% 100%)",
          }}
        />

        {/* Background decoration - star/light beam effects */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-20 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-100" />
          <div className="absolute top-32 left-1/2 w-2 h-2 bg-white rounded-full animate-pulse delay-200" />
          <div className="absolute top-16 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300" />
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto w-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <p className="text-base md:text-lg text-white/90 font-medium px-4">
              我的天赋逆袭中心
            </p>
            <p className="text-xs md:text-sm text-white/70 font-normal px-1 text-center leading-relaxed">
              {isCompleted
                ? "查看您的深度分析报告"
                : "了解自己，发现潜能，科学规划未来"}
            </p>
          </div>
        </div>
      </section>

      <div className="px-4 space-y-6 pb-8 relative z-10 bg-[#F5F5F5]">
        {/* 测试用：是否完成报告的单选框 */}
        <Card className="p-4 bg-white border-2 border-gray-200">
          <Label className="text-sm font-semibold mb-3 block">是否完成报告（测试用）</Label>
          <RadioGroup
            value={reportStatus}
            onValueChange={setReportStatus}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="完成探索" id="completed" />
              <Label
                htmlFor="completed"
                className="text-sm font-normal cursor-pointer"
              >
                完成探索
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="未完成" id="incomplete" />
              <Label
                htmlFor="incomplete"
                className="text-sm font-normal cursor-pointer"
              >
                未完成
              </Label>
            </div>
          </RadioGroup>
        </Card>

        {!isCompleted ? (
          <Card className="px-4 py-3 shadow-2xl bg-gradient-to-r from-[#1A4099]/5 to-white border-2 border-[#1A4099]/30">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">测评进度</h2>
              <span className="text-lg font-bold text-[#FF7F50]">
                {assessmentProgress}%
              </span>
            </div>
            <div className="relative h-1.5 my-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-[#FF7F50] transition-all duration-300 rounded-full"
                style={{ width: `${assessmentProgress}%` }}
              />
            </div>
            <div className="space-y-1 mb-3">
              <p className="text-xs text-muted-foreground">
                已完成 {completedCount}/{totalCount} 项
              </p>
              {isClient && (
                <p className="text-xs text-muted-foreground">
                  已解锁特质{completedDimensionsCount}项，已匹配专业
                  {matchedMajorsCount}个
                </p>
              )}
            </div>
            <Link href="/assessment/all-majors">
              <Button
                className="w-full h-8 text-sm bg-[#FF7F50] hover:bg-[#E66A42] text-white shadow-md"
                size="sm"
              >
                继续作答 <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </Card>
        ) : (
          <Card className="p-4 shadow-2xl bg-gradient-to-br from-[#1A4099]/10 to-[#FF7F50]/10 border-2 border-[#1A4099]/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#FF7F50]/20 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-[#FF7F50]" />
              </div>
              <div>
                <h2 className="text-sm font-bold">测评已完成</h2>
                <p className="text-xs text-muted-foreground">
                  您的深度报告已生成
                </p>
              </div>
            </div>
            <Link href="/assessment/report">
              <Button
                className="w-full h-9 bg-[#FF7F50] hover:bg-[#E66A42] text-white shadow-md mb-3"
                size="sm"
              >
                查看我的深度报告 <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
            <div className="mt-3 p-3 bg-background rounded-lg border border-gray-100">
              <p className="text-xs font-medium mb-2">报告摘要</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>
                  • 匹配职业：
                  <span className="font-semibold text-[#1A4099]">
                    软件工程师、数据分析师
                  </span>
                </p>
                <p>
                  • 推荐专业：
                  <span className="font-semibold text-[#1A4099]">
                    计算机科学、数据科学
                  </span>
                </p>
                <p>
                  • 核心优势：
                  <span className="font-semibold text-[#FF7F50]">
                    逻辑思维、创新能力
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-3 text-center">
              <Link
                href="/discovery"
                className="text-xs text-[#1A4099] font-medium underline hover:text-[#1A4099]/80 transition-colors"
              >
                前往"专业/职业"深度探索 →
              </Link>
            </div>
          </Card>
        )}

        <div>
          {/* 探索成果 */}
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-4 px-1 text-gray-800">
              探索成果
            </h3>
            <div className="space-y-4">
              <Link href="/assessment/personal-profile">
                <Card className="p-5 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-[#1A4099]/50 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#1A4099]/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-[#1A4099]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#1A4099] mb-1.5">
                        个人特质报告
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        全面了解自己与众不同的特质、面临的挑战和应对策略
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link href="/assessment/favorite-majors">
                <Card className="p-5 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-[#FF7F50]/50 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#FF7F50]/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-[#FF7F50]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="text-sm font-semibold text-[#FF7F50]">
                          心动专业
                        </h4>
                        {isClient && intendedMajorsCount > 0 && (
                          <span className="text-xs font-bold text-[#FF7F50] bg-[#FF7F50]/10 px-2 py-0.5 rounded-full">
                            {intendedMajorsCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        深度探索喜欢的专业
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link href="/assessment/provinces">
                <Card className="p-5 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-[#1A4099]/50 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#1A4099]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#1A4099]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="text-sm font-semibold text-[#1A4099]">
                          意向省份
                        </h4>
                        {isClient && selectedProvincesCount > 0 && (
                          <span className="text-xs font-bold text-[#1A4099] bg-[#1A4099]/10 px-2 py-0.5 rounded-full">
                            {selectedProvincesCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        设置意向省份
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
              {/* 院校探索 */}
              <Link href="/majors/intended?tab=专业赛道">
                <Card className="p-5 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-[#FF7F50]/50 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#FF7F50]/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-[#FF7F50]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#FF7F50] mb-1.5">
                        院校探索
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        探索各专业对应的院校
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>

          {/* 热门专业测评 - 进行中 */}
          {/*
          <Link href="/assessment/popular-majors">
            <Card className="p-3 mb-3 hover:shadow-md transition-shadow cursor-pointer border">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FF7F50]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <FileText className="w-4 h-4 text-[#FF7F50]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-sm font-semibold">热门专业测评</h3>
                    <span className="text-xs text-[#FF7F50] font-bold">进行中</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">探索热门专业匹配度</p>
                  <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-[#FF7F50] transition-all duration-300"
                      style={{ width: "45%" }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Link> 
          */}
        </div>

        <Card className="p-4 bg-gradient-to-r from-blue-50/50 to-orange-50/50 border border-blue-100/50">
          <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
            <span className="text-base">💡</span>
            <span>
              建议按顺序完成所有测评，系统将为您生成更准确的专业和院校推荐。
            </span>
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
