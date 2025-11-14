"use client";

import { useState } from "react";
import { PageContainer } from "@/components/page-container";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LogOut,
  LogIn,
  ChevronRight,
} from "lucide-react";

// 模拟用户状态类型
type AssessmentStatus = "not_started" | "in_progress" | "completed";

export default function ProfilePage() {
  // 模拟数据 - 仅用于UI展示
  const [isLoggedIn] = useState(true); // 是否已登录
  const [userName] = useState("张同学"); // 用户昵称
  const [assessmentStatus] = useState<AssessmentStatus>("in_progress"); // 测评状态
  const [progress] = useState(45); // 测评进度百分比
  const [currentQuestion] = useState(76); // 当前题目编号（如果有未完成测评）

  // 根据状态获取头部副标题和图标
  const getStatusInfo = () => {
    switch (assessmentStatus) {
      case "not_started":
        return {
          text: "你的探索之旅尚未开始",
          icon: null,
        };
      case "in_progress":
        return {
          text: `探索完成度：${progress}%`,
          icon: null,
        };
      case "completed":
        return {
          text: "恭喜你！已完成自我探索",
          icon: "🎉",
        };
      default:
        return { text: "", icon: null };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <PageContainer>
      <div className="min-h-screen bg-[#F5F5F5]">
        {/* 头部：个人身份与进度总览 */}
        <section className="bg-gradient-to-b from-[#1A4099] via-[#2563eb] to-[#2563eb]/80 px-4 pt-6 pb-8">
          <div className="flex flex-col items-center gap-4">
            {/* 头像 */}
            <Avatar className="w-20 h-20 border-4 border-white/30 shadow-lg">
              <AvatarImage src="/api/placeholder/80/80" alt="用户头像" />
              <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                {isLoggedIn && userName ? userName.charAt(0) : "未"}
              </AvatarFallback>
            </Avatar>

            {/* 昵称 */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-2">
                你好，{isLoggedIn ? userName : "未来的同学"}
              </h1>
              {/* 副标题/状态 */}
              <div className="flex items-center justify-center gap-2">
                {statusInfo.icon && (
                  <span className="text-2xl">{statusInfo.icon}</span>
                )}
                <p className="text-white/90 text-sm">{statusInfo.text}</p>
              </div>
            </div>

            {/* 环形进度条（仅测评中时显示） */}
            {assessmentStatus === "in_progress" && (
              <div className="relative w-24 h-24 mt-2">
                <svg className="w-24 h-24 transform -rotate-90">
                  {/* 背景圆环 */}
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* 进度圆环 */}
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 40 * (1 - progress / 100)
                    }`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {progress}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="px-4 py-6 space-y-6">
          {/* 核心功能卡片：我的探索之旅 */}
          <Card className="overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-[#1A4099]/5 to-transparent border-b">
              <h2 className="text-lg font-bold text-[#1A4099]">
                我的探索之旅
              </h2>
            </div>
            <div className="divide-y">
              {/* 重启自我测评 */}
              <button className="w-full p-4 flex items-center gap-4 hover:bg-[#F5F5F5] active:bg-[#EEEEEE] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7F50] to-[#FF6A3D] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔄</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-semibold text-[#1A4099] mb-1">
                    重新开始自我测评
                  </h3>
                  <p className="text-sm text-gray-600">
                    重新答题，刷新你的专属地图
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* 查看我的报告 */}
              <button
                className={`w-full p-4 flex items-center gap-4 hover:bg-[#F5F5F5] active:bg-[#EEEEEE] transition-colors ${
                  assessmentStatus !== "completed"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={assessmentStatus !== "completed"}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    assessmentStatus === "completed"
                      ? "bg-gradient-to-br from-[#1A4099] to-[#2563eb]"
                      : "bg-gray-300"
                  }`}
                >
                  <span className="text-2xl">📊</span>
                </div>
                <div className="flex-1 text-left">
                  <h3
                    className={`text-base font-semibold mb-1 ${
                      assessmentStatus === "completed"
                        ? "text-[#1A4099]"
                        : "text-gray-500"
                    }`}
                  >
                    查看我的天赋洞察报告
                  </h3>
                  <p
                    className={`text-sm ${
                      assessmentStatus === "completed"
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  >
                    {assessmentStatus === "completed"
                      ? "回顾你的核心特质、专业与院校地图"
                      : "待生成"}
                  </p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 ${
                    assessmentStatus === "completed"
                      ? "text-gray-400"
                      : "text-gray-300"
                  }`}
                />
              </button>

              {/* 继续未完成测评（仅当有未完成测评时显示） */}
              {assessmentStatus === "in_progress" && (
                <button className="w-full p-4 flex items-center gap-4 hover:bg-[#F5F5F5] active:bg-[#EEEEEE] transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A4099] to-[#2563eb] flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-base font-semibold text-[#1A4099] mb-1">
                      继续未完成的探索
                    </h3>
                    <p className="text-sm text-gray-600">
                      从中断的第{currentQuestion}题继续
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
          </Card>

          {/* 通用设置卡片：更多 */}
          <Card className="overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-[#1A4099]/5 to-transparent border-b">
              <h2 className="text-lg font-bold text-[#1A4099]">更多</h2>
            </div>
            <div className="divide-y">
              {/* 清除缓存 */}
              <button className="w-full p-4 flex items-center gap-4 hover:bg-[#F5F5F5] active:bg-[#EEEEEE] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🧹</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-semibold text-[#1A4099] mb-1">
                    清除缓存
                  </h3>
                  <p className="text-sm text-gray-600">释放设备空间</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* 用户反馈 */}
              <button className="w-full p-4 flex items-center gap-4 hover:bg-[#F5F5F5] active:bg-[#EEEEEE] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A4099] to-[#2563eb] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-semibold text-[#1A4099] mb-1">
                    意见反馈
                  </h3>
                  <p className="text-sm text-gray-600">帮助我们做得更好</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* 关于我们 */}
              <button className="w-full p-4 flex items-center gap-4 hover:bg-[#F5F5F5] active:bg-[#EEEEEE] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A4099] to-[#2563eb] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">ℹ️</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-semibold text-[#1A4099] mb-1">
                    关于我们
                  </h3>
                  <p className="text-sm text-gray-600">
                    了解我们的理念与使命
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* 分享给朋友 */}
              <button className="w-full p-4 flex items-center gap-4 hover:bg-[#F5F5F5] active:bg-[#EEEEEE] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7F50] to-[#FF6A3D] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📤</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-semibold text-[#1A4099] mb-1">
                    分享给朋友
                  </h3>
                  <p className="text-sm text-gray-600">帮更多同学找到方向</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </Card>

          {/* 退出登录/账号管理 */}
          <Card className="overflow-hidden">
            {isLoggedIn ? (
              <button className="w-full p-4 flex items-center justify-center gap-2 hover:bg-red-50 active:bg-red-100 transition-colors">
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="text-base font-semibold text-red-600">
                  退出登录
                </span>
              </button>
            ) : (
              <button className="w-full p-4 flex items-center justify-center gap-2 hover:bg-[#F5F5F5] active:bg-[#EEEEEE] transition-colors">
                <LogIn className="w-5 h-5 text-[#1A4099]" />
                <span className="text-base font-semibold text-[#1A4099]">
                  登录/注册
                </span>
              </button>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
