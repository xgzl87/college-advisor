"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/bottom-nav";
import { TopNav } from "@/components/top-nav";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Compass,
  MapPin,
  Building2,
  ArrowRight,
  Target,
  TrendingUp,
  Lock,
  Clock,
  Users,
  Award,
  Zap,
  BarChart3,
  CheckCircle2,
  Flame,
  Radar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import questionnaireData from "@/data/questionnaire.json";

const STORAGE_KEY = "questionnaire_answers";

function loadAnswersFromStorage(): Record<number, number> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    return {};
  }
}

export default function HomePage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGuideDialogOpen, setIsGuideDialogOpen] = useState(false);
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedAnswers = loadAnswersFromStorage();
    setAnswers(storedAnswers);
  }, []);

  // 当对话框打开时，重新读取本地数据
  useEffect(() => {
    if (isDialogOpen && isClient) {
      const storedAnswers = loadAnswersFromStorage();
      setAnswers(storedAnswers);
    }
  }, [isDialogOpen, isClient]);

  const totalQuestions = (questionnaireData as any[]).length;
  const answeredCount = Object.keys(answers).length;
  const isCompleted = answeredCount === totalQuestions && totalQuestions > 0;

  const handleStartAssessment = () => {
    setIsDialogOpen(false);
    router.push("/assessment/all-majors");
  };

  const handleStartExploration = () => {
    setIsDialogOpen(false);
    setIsGuideDialogOpen(true);
  };

  const handleConfirmStart = () => {
    setIsGuideDialogOpen(false);
    router.push("/assessment/all-majors");
  };

  const handleLockedStep = () => {
    toast({
      title: "提示",
      description: "请先完成喜欢与天赋探索",
    });
  };

  const handleMajorExploration = () => {
    setIsDialogOpen(false);
    router.push("/majors");
  };

  const handleCityExploration = () => {
    setIsDialogOpen(false);
    router.push("/assessment/provinces");
  };

  const handleSchoolExploration = () => {
    setIsDialogOpen(false);
    router.push("/majors/intended?tab=专业赛道");
  };
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] pb-16">
      <Toaster />
      <TopNav />
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
              找到你天生的专业方向
            </p>
            <p className="text-xs md:text-sm text-white/70 font-normal px-1 text-center leading-relaxed">
              基于科学评估与百万数据，为你定制专属的升学路径
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 relative z-20 -mt-4">
        <div className="flex flex-col gap-6 mx-auto max-w-lg">
          {/* 快速测评卡片 - 优化移动端体验 */}
          <Link
            href="/assessment/popular-majors"
            className="w-full block active:scale-[0.98] transition-transform"
          >
            <Card className="relative overflow-hidden border-l-[5px] border-[#FF7F50]/30 shadow-lg bg-gradient-to-br from-[#1A4099]/3 to-white active:shadow-xl transition-all duration-200 group">
              <div className="p-6">
                <div className="flex flex-col gap-5">
                  {/* 头部：图标和标题 */}
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF7F50] to-[#FF6A3D] flex items-center justify-center shadow-lg flex-shrink-0">
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h2 className="text-xl font-extrabold text-[#1A4099] leading-tight">
                          快速测评
                          <br />
                          <div className="flex items-center gap-4 pt-1 text-xs text-[#1A4099]/70">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>约3分钟</span>
                            </div>
                            {/* <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              <span>已测10万+</span>
                            </div> */}
                          </div>
                        </h2>
                        {/* <span className="text-xs px-2 py-0.5 bg-[#FF7F50] text-white font-bold rounded-full">
                          热门专业
                        </span> */}
                      </div>
                      {/* 特性标签 */}
                      {/* <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        <span className="text-[10px] px-2 py-0.5 bg-[#FF7F50]/15 text-[#FF7F50] font-semibold rounded-md">
                          ⚡ 快速
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-[#FF7F50]/15 text-[#FF7F50] font-semibold rounded-md">
                          ✨ 启发
                        </span>
                      </div> */}
                    </div>
                  </div>

                  {/* 描述和统计 */}
                  <div className="space-y-3">
                    <p className="text-sm text-[#1A4099] font-semibold leading-relaxed">
                      发现与你特质契合的<span className="font-bold text-[#FF7F50]">热门专业</span>方向
                    </p>

                    {/* 统计信息 */}

                    {/* 按钮 - 移动端优化，使用科技蓝 */}
                    <Button
                      size="lg"
                      className="w-full h-12 text-base font-bold shadow-md bg-gradient-to-r from-[#1A4099] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1A4099] text-white active:scale-95 transition-all touch-manipulation"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      立即开始
                    </Button>
                  </div>
                </div>
              </div>
              {/* 装饰元素 */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#1A4099]/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#1A4099]/5 rounded-full blur-xl" />
              {/* 能量火焰图标 - 动态效果 */}
              <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center opacity-60 group-hover:opacity-100 group-active:scale-110 transition-all duration-300">
                <Flame className="w-6 h-6 text-[#FF7F50] animate-pulse" />
              </div>
            </Card>
          </Link>

          {/* 全面评估卡片 - 多元化展示 */}
          <Card
            className="relative overflow-hidden border-l-[5px] border-[#1A4099]/20 shadow-lg bg-gradient-to-br from-[#1A4099]/3 to-white active:shadow-xl transition-all duration-200 active:scale-[0.98] cursor-pointer group"
            onClick={() => setIsDialogOpen(true)}
          >
            <div className="p-6">
              <div className="flex flex-col gap-5">
                {/* 头部：图标和标题 */}
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1A4099] to-[#2563eb] flex items-center justify-center shadow-lg flex-shrink-0">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-xl font-extrabold text-[#1A4099] leading-tight">
                        全面评估
                      </h3>
                      {/* <span className="text-xs px-2 py-0.5 bg-[#1A4099] text-white font-bold rounded-full">
                        深度
                      </span> */}
                      {/* <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-[#FF7F50] to-[#FF6A3D] text-white font-bold rounded-full shadow-sm">
                        推荐初次使用
                      </span> */}
                    </div>
                    {/* 特性标签 */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-2">
                      <div className="flex items-center gap-4 text-xs text-[#1A4099]/70">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>约40分钟</span>
                        </div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 bg-[#1A4099]/15 text-[#1A4099] font-semibold rounded-md">
                        📊 168题
                      </span>
                      {/* <span className="text-[10px] px-2 py-0.5 bg-[#1A4099]/15 text-[#1A4099] font-semibold rounded-md">
                        🎯 科学定案
                      </span> */}
                      <span className="text-[10px] px-2 py-0.5 bg-[#1A4099]/15 text-[#1A4099] font-semibold rounded-md">
                        📈 全面数据
                      </span>
                    </div>
                  </div>
                </div>

                {/* 描述和统计 */}
                <div className="space-y-3">
                  <p className="text-sm text-[#1A4099] font-semibold leading-relaxed">
                    解锁你的生涯潜能图谱，定制一份<span className="font-bold text-[#FF7F50]">专属升学规划</span>
                  </p>

                  {/* 稀缺性提示 */}
                  {/* <p className="text-xs text-[#1A4099]/60 font-medium italic leading-relaxed">
                    超过90%用户的最终选择源于此报告
                  </p> */}

                  {/* 进度展示（如果已完成部分） */}
                  {/* {isClient && answeredCount > 0 && (
                    <div className="bg-[#1A4099]/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-[#1A4099]">
                          探索进度
                        </span>
                        <span className="text-xs font-bold text-[#1A4099]">
                          {answeredCount} / {totalQuestions}
                        </span>
                      </div>
                      <div className="w-full bg-[#1A4099]/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#1A4099] to-[#2563eb] rounded-full transition-all duration-500"
                          style={{
                            width: `${(answeredCount / totalQuestions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )} */}

                  {/* 统计信息 */}
                  {/* <div className="flex items-center gap-4 text-xs text-[#1A4099]/70">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>约40分钟</span>
                    </div>
                    <div className="flex items-center gap-1"></div>
                      <Award className="w-3.5 h-3.5" />
                      <span>专业报告</span>
                    </div>
                  </div> */}

                  {/* 按钮 - 移动端优化，使用赋能橙 */}
                  <Button
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDialogOpen(true);
                    }}
                    className="w-full h-12 text-base font-bold shadow-md bg-gradient-to-r from-[#FF7F50] to-[#FF6A3D] hover:from-[#FF6A3D] hover:to-[#FF7F50] text-white active:scale-95 transition-all touch-manipulation"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    开启探索
                  </Button>
                </div>
              </div>
            </div>
            {/* 装饰元素 */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#1A4099]/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#1A4099]/5 rounded-full blur-xl" />
            {/* 雷达图图标 - 动态效果 */}
            <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center opacity-60 group-hover:opacity-100 group-active:scale-110 transition-all duration-300">
              <Radar className="w-6 h-6 text-[#1A4099] group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </Card>
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md w-[calc(100vw-2rem)] sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center text-[#1A4099] mb-4 px-2">
              🚀 你的40分钟深度探索之旅
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* 第一步：深度自我洞察 · 168题 */}
            <div className="p-5 bg-gradient-to-r from-[#FF7F50]/15 to-[#FF7F50]/10 rounded-xl border border-[#FF7F50]/30">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7F50] to-[#FF6A3D] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-[#1A4099]">
                      深度自我洞察 · 168题
                    </h4>
                    {/* <span className="text-xs px-2 py-0.5 bg-[#FF7F50] text-white font-bold rounded-full">
                      测评核心
                    </span> */}
                  </div>
                  <p className="text-sm text-[#1A4099] leading-relaxed mb-2">
                    解锁你喜欢与天赋密码，生成专属的
                    <span className="font-semibold">核心特质报告</span>。
                  </p>
                  {isClient && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-[#1A4099]/70">
                        当前进度：
                      </span>
                      <span className="text-xs font-bold text-[#FF7F50]">
                        {answeredCount}/{totalQuestions}
                      </span>
                      <div className="flex-1 bg-[#FF7F50]/20 rounded-full h-1.5 overflow-hidden ml-2">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF7F50] to-[#FF6A3D] rounded-full transition-all duration-500"
                          style={{
                            width: `${(answeredCount / totalQuestions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {/* 开始探索按钮 */}
                  <Button
                    onClick={handleStartExploration}
                    size="lg"
                    className="w-full h-11 text-base font-bold shadow-md bg-gradient-to-r from-[#FF7F50] to-[#FF6A3D] hover:from-[#FF6A3D] hover:to-[#FF7F50] text-white active:scale-95 transition-all touch-manipulation"
                  >
                    开始探索
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
            {/* 第二步：发现契合专业 - 锁定状态 */}
            <div className="p-5 bg-gradient-to-r from-gray-100/80 to-gray-50/80 rounded-xl border border-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-gray-700 mb-2">
                    发现契合专业
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    让天赋指引方向，我们将你的特质与
                    <span className="font-semibold text-gray-800">
                      数百个专业
                    </span>
                    进行精准匹配。
                  </p>
                  <Button
                    size="sm"
                    disabled
                    className="w-full h-9 text-sm font-medium bg-gray-200 text-gray-500 cursor-not-allowed"
                  >
                    完成测评后解锁
                  </Button>
                </div>
              </div>
            </div>

            {/* 第三步：圈定理想城市 - 锁定状态 */}
            <div className="p-5 bg-gradient-to-r from-gray-100/80 to-gray-50/80 rounded-xl border border-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-gray-700 mb-2">
                    圈定理想城市
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    结合发展机遇与生活偏好，找到与你
                    <span className="font-semibold text-gray-800">
                      同频共振的城市圈
                    </span>
                    。
                  </p>
                  <Button
                    size="sm"
                    disabled
                    className="w-full h-9 text-sm font-medium bg-gray-200 text-gray-500 cursor-not-allowed"
                  >
                    完成测评后解锁
                  </Button>
                </div>
              </div>
            </div>

            {/* 第四步：锁定目标院校 - 锁定状态 */}
            <div className="p-5 bg-gradient-to-r from-gray-100/80 to-gray-50/80 rounded-xl border border-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-gray-700 mb-2">
                    锁定目标院校
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    综合所有维度，生成你的
                    <span className="font-semibold text-gray-800">
                      个性化院校清单
                    </span>
                    ，让每一分都掷地有声。
                  </p>
                  <Button
                    size="sm"
                    disabled
                    className="w-full h-9 text-sm font-medium bg-gray-200 text-gray-500 cursor-not-allowed"
                  >
                    完成测评后解锁
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 探索之旅说明模态框 */}
      <Dialog open={isGuideDialogOpen} onOpenChange={setIsGuideDialogOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md w-[calc(100vw-2rem)] sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center text-[#1A4099] mb-4 px-2">
              【探索之旅说明】
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-center pt-2 px-2">
                <p className="text-sm text-gray-700 leading-relaxed">
                  欢迎开启你的深度探索！为了给你最精准的规划，请按顺序完成以下步骤：
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* 第一步：深度自我洞察 */}
            <div className="p-5 bg-gradient-to-r from-[#FF7F50]/15 to-[#FF7F50]/10 rounded-xl border border-[#FF7F50]/30">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🔓</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-[#1A4099]">
                      深度自我洞察
                    </h4>
                    {isClient && (
                      <span className="text-xs font-bold text-[#FF7F50]">
                        ({answeredCount}/{totalQuestions})
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 bg-[#FF7F50] text-white font-bold rounded-full">
                      您在此处
                    </span>
                  </div>
                  <p className="text-sm text-[#1A4099] leading-relaxed">
                    完成168题科学测评，解锁你的核心特质报告。
                  </p>
                </div>
              </div>
            </div>

            {/* 第二步：发现契合专业 */}
            <div className="p-5 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🔒</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-gray-500">
                      发现契合专业
                    </h4>
                    <span className="text-xs px-2 py-0.5 bg-gray-300 text-gray-600 font-bold rounded-full">
                      完成后解锁
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    基于你的特质报告，匹配最适合的专业方向。
                  </p>
                </div>
              </div>
            </div>

            {/* 第三步：圈定理想城市 */}
            <div className="p-5 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🔒</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-gray-500">
                      圈定理想城市
                    </h4>
                    <span className="text-xs px-2 py-0.5 bg-gray-300 text-gray-600 font-bold rounded-full">
                      完成后解锁
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    结合你的偏好，找到理想的城市圈。
                  </p>
                </div>
              </div>
            </div>

            {/* 第四步：锁定目标院校 */}
            <div className="p-5 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🔒</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-gray-500">
                      锁定目标院校
                    </h4>
                    <span className="text-xs px-2 py-0.5 bg-gray-300 text-gray-600 font-bold rounded-full">
                      完成后解锁
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    综合所有信息，生成你的个性化院校清单。
                  </p>
                </div>
              </div>
            </div>

            {/* 行动按钮 */}
            <div className="pt-2">
              <Button
                onClick={handleConfirmStart}
                size="lg"
                className="w-full h-12 text-base font-bold shadow-lg bg-gradient-to-r from-[#FF7F50] to-[#FF6A3D] hover:from-[#FF6A3D] hover:to-[#FF7F50] text-white active:scale-95 transition-all touch-manipulation"
              >
                我明白了，立即开始答题
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
