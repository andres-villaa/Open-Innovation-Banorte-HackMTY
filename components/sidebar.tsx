"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShoppingCart,
  Settings,
  FileText,
  TrendingUp,
  MessageSquare,
  Menu,
  X,
  Mic,
  MicOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import dashboardData from "@/data/dashboard_metrics.json"

// Map icon name from JSON to actual lucide component
const iconMap: Record<string, any> = {
  LayoutDashboard,
  BarChart3,
  Users,
  ShoppingCart,
  Settings,
  FileText,
  TrendingUp,
  MessageSquare,
  Menu,
  X,
}

interface SidebarProps {
  onNavigate: (section: string) => void
  currentSection: string
  showConvai: boolean
  onToggleConvai: () => void
}

export function Sidebar({ onNavigate, currentSection, showConvai, onToggleConvai }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const navigationItems = dashboardData.navigationItems || []

  const handleNavClick = (id: string) => {
    onNavigate(id)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">Business AI</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navigationItems.map((item: any) => {
              const Icon = iconMap[item.icon] || LayoutDashboard
              const isActive = item.id === currentSection

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </button>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-border p-4 space-y-3">
            {/* AI Assistant Button */}
            <Button
              onClick={onToggleConvai}
              className="w-full gap-2"
              variant={showConvai ? "default" : "outline"}
            >
              {showConvai ? (
                <>
                  <MicOff className="h-4 w-4" />
                  Cerrar Asistente
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Abrir Asistente
                </>
              )}
            </Button>

            {/* User info */}
            <div className="flex items-center gap-3 rounded-lg bg-accent/50 px-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                JD
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">John Doe</p>
                <p className="truncate text-xs text-muted-foreground">john@business.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
