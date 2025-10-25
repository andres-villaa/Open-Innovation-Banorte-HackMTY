"use client"

import { Mic } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingHelpButton() {
  const handleClick = () => {
    console.log("[v0] Help button clicked")
    // Add voice assistance functionality here
  }

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
    >
      <Mic className="h-6 w-6" />
      <span className="sr-only">Ayuda por voz</span>
    </Button>
  )
}

