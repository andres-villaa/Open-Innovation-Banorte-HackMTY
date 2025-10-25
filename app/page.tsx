"use client"

import React, { useState } from "react"
import Script from "next/script"
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsGrid } from "@/components/metrics-grid"
import { ChartsSection } from "@/components/charts-section"
import { Sidebar } from "@/components/sidebar"
import { FinancialSimulator } from "@/components/financial-simulator"

const CONVAI_AGENT_ID = "agent_5901k8dz1e4cf1gvd4mg8p58hvgw"
const CONVAI_SCRIPT_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed"

export default function DashboardPage() {
  const [currentSection, setCurrentSection] = useState("dashboard")
  const [showConvai, setShowConvai] = useState(true)

  return (
    // Root uses flex so sidebar + main content share viewport height
    <div className="min-h-screen bg-background flex">
      {/* Sidebar stays at left; assume it handles its own fixed/absolute behavior on lg screens */}
      <Sidebar 
        onNavigate={setCurrentSection} 
        currentSection={currentSection}
        showConvai={showConvai}
        onToggleConvai={() => setShowConvai(!showConvai)}
      />

      {/* Main column: occupies remaining space and is a column so header + main stack vertically */}
      <div className="flex-1 min-h-screen lg:pl-64 flex flex-col">
        <DashboardHeader />

        {/* Main content fills remaining space and scrolls internally if needed */}
        <main className="container mx-auto px-4 py-6 lg:px-8 flex-1 overflow-auto">
          {currentSection === "analytics" ? (
            // Analytics section with Financial Simulator
            <FinancialSimulator />
          ) : (
            // Default Dashboard section (assistant removed)
            <div className="h-full grid gap-6">
              <div className="space-y-6">
                <MetricsGrid />
                <ChartsSection />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Convai Widget - Loads in bottom right by default */}
      {showConvai && (
        <>
          <Script src={CONVAI_SCRIPT_SRC} strategy="afterInteractive" />
          {React.createElement("elevenlabs-convai", { "agent-id": CONVAI_AGENT_ID })}
        </>
      )}
    </div>
  )
}
