"use client"

import { useState } from "react"
import { GlareCard } from "@/components/ui/glare-card"
import { Globe, AlertTriangle, FileCheck, Phone, Heart, BarChart3 } from "lucide-react"

export default function StackedGlareCards() {
  const [activeTab, setActiveTab] = useState(0)

  const features = [
    {
      title: "Global Language Intelligence",
      shortTitle: "Global Language Intelligence",
      description: "AI-powered multilingual understanding with 95%+ accuracy across international and Indian languages",
      icon: Globe,
    },
    {
      title: "Revenue Leak Detection",
      shortTitle: "Revenue Leak Detection",
      description: "Advanced analytics to identify churn risks, billing issues, service gaps, and missed opportunities",
      icon: AlertTriangle,
    },
    {
      title: "Smart Complaint Categorization",
      shortTitle: "Smart Complaint Categorization",
      description: "Intelligent auto-tagging system that organizes feedback into actionable business insights",
      icon: FileCheck,
    },
    {
      title: "Complete Call Analytics",
      shortTitle: "Complete Call Analytics",
      description:
        "Comprehensive analysis of every customer interaction including service follow-ups and maintenance alerts",
      icon: Phone,
    },
    {
      title: "Customer Happiness Index",
      shortTitle: "Customer Happiness Index",
      description: "Real-time emotion detection through voice patterns and conversation analysis",
      icon: Heart,
    },
    {
      title: "Voice Insights Dashboard",
      shortTitle: "Voice Insights Dashboard",
      description: "Centralized command center for tracking sentiment trends, team performance, and business impact",
      icon: BarChart3,
    },
  ]

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {features.map((feature, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === index
                ? "bg-[#006C67] text-white shadow-lg scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {feature.shortTitle}
          </button>
        ))}
      </div>

      {/* Stacked Cards */}
      <div className="relative max-w-5xl mx-auto" style={{ height: "400px" }}>
        {features.map((feature, index) => {
          const isActive = index === activeTab
          const stackIndex = index - activeTab
          const isVisible = Math.abs(stackIndex) <= 2

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-out cursor-pointer ${
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{
                zIndex: isActive ? 50 : Math.max(0, 50 - Math.abs(stackIndex)),
                transform: `
                  translateY(${stackIndex * 12}px) 
                  translateX(${stackIndex * 8}px) 
                  scale(${1 - Math.abs(stackIndex) * 0.05})
                  rotateY(${stackIndex * 2}deg)
                `,
                transformOrigin: "center center",
              }}
              onClick={() => setActiveTab(index)}
            >
              <GlareCard
                className="flex flex-row items-center justify-start p-12 h-full gap-8 w-full min-h-[350px]"
                isHorizontal={true}
              >
                <div className="flex-shrink-0">
                  <feature.icon className="h-16 w-16 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h2 className="text-white font-bold text-4xl mb-4">{feature.title}</h2>
                  <p className="text-white/90 text-xl leading-relaxed">{feature.description}</p>
                </div>
              </GlareCard>
            </div>
          )
        })}
      </div>

      {/* Stack Indicator */}
      <div className="flex justify-center mt-8 gap-2">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeTab === index ? "bg-[#006C67] scale-125" : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
